import Event from "../models/eventModel.js";
import mongoose from "mongoose";

// @desc   Get all events
// @route  GET /api/events
export const getEvents = async (req, res) => {
	try {
		const events = await Event.find();
		res.json(events);
	} catch (error) {
		console.error("Error fetching events:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// @desc   Get event by ID
// @route  GET /api/events/:id
export const getEventById = async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);
		if (!event) return res.status(404).json({ message: "Event not found" });
		res.json(event);
	} catch (error) {
		console.error("Error fetching event:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// @desc   Create an event
// @route  POST /api/events
export const createEvent = async (req, res) => {
	try {
		const { title, description, date, location } = req.body;
		if (!title || !description || !date || !location) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const event = await Event.create({
			title,
			description,
			date,
			location,
			createdBy: req.user.id, // Ensure user ID is attached from middleware
		});

		res.status(201).json(event);
	} catch (error) {
		console.error("Error creating event:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


// @desc   Update an event
// @route  PUT /api/events/:id
export const updateEvent = async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		if (event.createdBy.toString() !== req.user.id) {
			return res.status(403).json({ message: "Not authorized" });
		}

		const updatedEvent = await Event.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);

		res.json(updatedEvent);
	} catch (error) {
		console.error("Error updating event:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


// @desc   Delete an event
// @route  DELETE /api/events/:id


export const deleteEvent = async (req, res) => {
	try {
		const eventId = req.params.id;

		// Validate ObjectId format
		if (!mongoose.Types.ObjectId.isValid(eventId)) {
			return res.status(400).json({ message: "Invalid event ID format" });
		}

		// Find the event by ID
		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		// Ensure only the creator can delete the event
		if (!event.createdBy || event.createdBy.toString() !== req.user.id) {
			return res
				.status(403)
				.json({ message: "Not authorized to delete this event" });
		}

		// Use deleteOne() instead of remove()
		await Event.deleteOne({ _id: eventId });

		res.json({ message: "Event deleted successfully" });
	} catch (error) {
		console.error("Error deleting event:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};



// @desc   Get user's events
// @route  GET /api/events/
export const getUserEvents = async (req, res) => {
	try {
		console.log("🔍 Checking req.user:", req.user); // Debugging log

		if (!req.user || !req.user.id) {
			console.error("❌ ERROR: req.user is undefined!");
			return res
				.status(401)
				.json({ message: "Unauthorized: User not found" });
		}

		console.log(`✅ Fetching events for user ID: ${req.user.id}`);

		const userEvents = await Event.find({ createdBy: req.user.id });

		console.log("✅ User events found:", userEvents); // Debugging log
		res.json(userEvents);
	} catch (error) {
		console.error("❌ ERROR in getUserEvents:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
