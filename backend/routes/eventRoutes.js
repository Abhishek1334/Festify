import express from "express";
import Event from "../models/eventModel.js";

const router = express.Router();

// ✅ Fetch Events (With Optional Filtering by Organizer)
router.get("/", async (req, res) => {
	try {
		const { organizer } = req.query;
		const query = organizer ? { organizer } : {}; // Filter by organizer ID if provided
		const events = await Event.find(query);
		res.json(events);
	} catch (error) {
		console.error("Error fetching events:", error);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
