import express from "express";
import User from "../models/userModel.js";
import Event from "../models/eventModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get Events the User Has RSVP'd To
router.get("/:id/rsvps", protect, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// ✅ Find events where the user's ID is in the "attendees" list
		const events = await Event.find({ attendees: req.params.id });

		res.json(events);
	} catch (error) {
		console.error("Error fetching RSVPs:", error);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
