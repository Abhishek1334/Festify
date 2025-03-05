import express from "express";
import { check } from "express-validator";
import { protect } from "../middleware/authMiddleware.js"; // Import middleware
import {
	registerUser,
	loginUser,
	logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

// User Signup
router.post(
	"/signup",
	[
		check("name", "Name is required").not().isEmpty(),
		check("email", "Please enter a valid email").isEmail(),
		check("password", "Password must be 6 or more characters").isLength({
			min: 6,
		}),
	],
	registerUser
);

// User Login
router.post("/login", loginUser);

// User Logout
router.post("/logout", logoutUser);

router.get("/protected", protect, (req, res) => {
	res.json({ message: "Access granted!", user: req.user });
});

export default router;
