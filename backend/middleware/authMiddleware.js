import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
import process from "process";
dotenv.config();

export const protect = async (req, res, next) => {
	let token;

	// ✅ Check if Authorization header exists and starts with "Bearer"
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// ✅ Extract Token
			token = req.headers.authorization.split(" ")[1];

			// ✅ Verify Token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// ✅ Get User Data (Exclude Password)
			req.user = await User.findById(decoded.id).select("-password");

			next(); // Continue to the next middleware
		} catch (error) {
			console.error("Token verification failed:", error);
			res.status(401).json({ message: "Unauthorized, invalid token" });
		}
	} else {
		res.status(401).json({ message: "Unauthorized, no token provided" });
	}
};
