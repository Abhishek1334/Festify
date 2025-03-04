import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import User from "../models/userModel.js";
import process from "process";

const router = express.Router();

// Register User
router.post(
	"/signup",
	[
		check("name", "Name is required").not().isEmpty(),
		check("email", "Please enter a valid email").isEmail(),
		check("password", "Password must be 6 or more characters").isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({ message: "User already exists" });
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			user = new User({ name, email, password: hashedPassword });
			await user.save();

			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});

			res.json({ token, user: { id: user._id, name, email } });
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	}
);

// Login User
router.post(
	"/login",
	[
		check("email", "Please enter a valid email").isEmail(),
		check("password", "Password is required").exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			let user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({ message: "Invalid credentials" });
			}

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ message: "Invalid credentials" });
			}

			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});

			res.json({ token, user: { id: user._id, name, email } });
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	}
);

// Protected Route Example
router.get("/me", async (req, res) => {
	try {
		const token = req.header("x-auth-token");
		if (!token) {
			return res
				.status(401)
				.json({ message: "No token, authorization denied" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id).select("-password");
		res.json(user);
	} catch (err) {
        console.error(err.message);
		res.status(401).json({ message: "Invalid token" });
	}
});

export default router;
