import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import process from "process";

// Generate JWT
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// @desc   Register new user
// @route  POST /api/auth/signup
// @access Public
export const registerUser = async (req, res) => {
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

		user = new User({ name, email, password });
		await user.save();

		res.status(201).json({
			id: user._id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		});
	} catch (error) {
		console.error("Signup Error:", error);
		res.status(500).send("Server error");
	}
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user || !(await user.matchPassword(password))) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		res.json({
			id: user._id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		});
	} catch (error) {
		console.error("Login Error:", error);
		res.status(500).send("Server error");
	}
};

// @desc   Logout user
// @route  POST /api/auth/logout
// @access Private
export const logoutUser = (req, res) => {
	res.json({ message: "User logged out successfully" });
};
