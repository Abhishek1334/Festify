import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import process from "process";

export const protect = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.id).select("-password");
			next();
		} catch (error) {
			console.error("Auth Middleware Error:", error);
			res.status(401).json({ message: "Unauthorized, invalid token" });
		}
	} else {
		res.status(401).json({ message: "Unauthorized, no token provided" });
	}
};
