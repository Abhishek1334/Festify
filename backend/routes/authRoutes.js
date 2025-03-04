import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import User from "../models/userModel.js";
import process from "process";

const router = express.Router();

// ✅ User Signup Route
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
			// ❌ Debugging: Check if user already exists
			let existingUser = await User.findOne({ email });
			if (existingUser) {
				console.log("⚠️ User already exists:", existingUser);
				return res.status(400).json({ message: "User already exists" });
			}

			// ✅ Hash Password
			console.log("🔑 Plain Password:", password);
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			console.log("🔒 Hashed Password:", hashedPassword);

			// ✅ Save User to Database
			const user = new User({ name, email, password: hashedPassword });
			await user.save();
			console.log("✅ User Registered:", user);

			// ✅ Generate JWT Token
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});

			res.json({ token, user: { id: user._id, name, email } });
		} catch (err) {
			console.error("❌ Signup Error:", err.message);
			res.status(500).send("Server error");
		}
	}
);

// ✅ User Login Route
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
			// ✅ Find User by Email
			const user = await User.findOne({ email });
			if (!user) {
				console.log("❌ User Not Found:", email);
				return res.status(400).json({ message: "Invalid credentials" });
			}

		
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				console.log("❌ Password Mismatch");
				return res.status(400).json({ message: "Invalid credentials" });
			}

			// ✅ Generate Token
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});

			console.log('✅ Login Successful');
			res.json({
				
				token,
				user: { id: user._id, name: user.name, email: user.email },
			});
		} catch (err) {
			console.error("❌ Login Error:", err.message);
			res.status(500).send("Server error");
		}
	}
);

export default router;
