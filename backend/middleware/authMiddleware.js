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
			console.log("✅ Decoded JWT:", decoded);

			req.user = await User.findById(decoded.id).select("-password");

			if (!req.user) {
				console.error("❌ ERROR: User not found in DB!");
				return res.status(401).json({ message: "User not found" });
			}

			console.log("✅ Authenticated user:", req.user);
			next();
		} catch (error) {
			console.error("❌ ERROR in Auth Middleware:", error);
			return res
				.status(401)
				.json({ message: "Unauthorized: Invalid token" });
		}
	} else {
		console.error("❌ ERROR: No token provided!");
		return res
			.status(401)
			.json({ message: "Unauthorized: No token provided" });
	}
};
