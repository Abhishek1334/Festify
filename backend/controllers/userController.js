import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import process from "process";

// Generate JWT Token1
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register User
export const registerUser = async (req, res) => {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });
	if (userExists)
		return res.status(400).json({ message: "User already exists" });

	const user = await User.create({ name, email, password });

	if (user) {
		res.status(201).json(
			{ "_id": user._id, "name": user.name, "email": user.email , "token": generateToken(user._id) },
		);
	} else {
		res.status(400).json({ message: "Invalid user data" });
	}
};

// Login User
export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (user && (await user.matchPassword(password))) {
		res.json({ token: generateToken(user._id) });
	} else {
		res.status(401).json({ message: "Invalid email or password" });
	}
};

// Get User Profile
export const getUserProfile = async (req, res) => {
	const user = await User.findById(req.user.id).select("-password");
	if (user) res.json(user);
	else res.status(404).json({ message: "User not found" });
};

export const UserProfile = async (req, res) => {
	const user = await User.findById(req.user.id).select("-password");
	if (user) res.json(user);	
	else res.status(404).json({ message: "User not found" });
	

}
