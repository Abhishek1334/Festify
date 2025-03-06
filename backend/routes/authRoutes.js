import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js"; // Import middleware
import {
	registerUser,
	loginUser,
	logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

// User Signup
router.post(
	"/register",
	[
		body("name").not().isEmpty().withMessage("Name is required"),
		body("email").isEmail().withMessage("Please enter a valid email"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be 6 or more characters"),
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
