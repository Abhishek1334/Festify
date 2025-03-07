
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import path from "path";
import fs from "fs";

// Get all events
export const getEvents = async (req, res) => {
	try {
		const events = await Event.find().populate("organizerId", "name");
		res.json(
			events.map((event) => ({
				...event.toObject(),
				organizerName: event.organizerId
					? event.organizerId.name
					: "Unknown",
			}))
		);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get a single event by ID
export const getEventById = async (req, res) => {
	try {
		const event = await Event.findById(req.params.id).populate(
			"organizerId",
			"name"
		);
		if (!event) return res.status(404).json({ message: "Event not found" });

		res.json({
			...event.toObject(),
			organizerName: event.organizerId
				? event.organizerId.name
				: "Unknown",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

// Create a new event
export const createEvent = async (req, res) => {
	try {
		const {
			title,
			description,
			date,
			timing,
			location,
			price,
			capacity,
			category,
		} = req.body;

		// Ensure category is provided
		if (!category) {
			return res.status(400).json({ message: "Category is required" });
		}

		const event = new Event({
			title,
			description,
			date,
			timing,
			location,
			price,
			capacity,
			category,
			organizerId: req.user.id,
			organizerName: req.user.name,
			image: req.file ? `uploads/${req.file.filename}` : "", // ✅ Save only "uploads/filename.jpg"
		});

		await event.save();
		res.status(201).json(event);
	} catch (error) {
		res.status(500).json({ message: "Error creating event", error });
	}
};




// Update an event
// Update an event
export const updateEvent = async (req, res) => {
	try {
		const { id } = req.params;
		const event = await Event.findById(id);

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		// Ensure only the event organizer can update
		if (event.organizerId.toString() !== req.user.id) {
			return res.status(403).json({ message: "Unauthorized to update this event" });
		}

		// Update event details
		event.title = req.body.title || event.title;
		event.description = req.body.description || event.description;
		event.date = req.body.date || event.date;
		event.location = req.body.location || event.location;
		event.price = req.body.price || event.price;
		event.capacity = req.body.capacity || event.capacity;
		event.category = req.body.category || event.category;

		// Handle image upload (Ensure path format remains "uploads/filename.jpg")
		if (req.file) {
			event.image = `uploads/${req.file.filename}`;
		}

		const updatedEvent = await event.save();
		res.status(200).json(updatedEvent);
	} catch (error) {
		console.error("Update Event Error:", error);
		res.status(500).json({ message: "Server error" });
	}
};






// Delete an event
export const deleteEvent = async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);

		if (!event) return res.status(404).json({ message: "Event not found" });
		if (event.organizerId.toString() !== req.user.id) {
			return res
				.status(403)
				.json({ message: "Unauthorized to delete this event" });
		}

		await event.deleteOne();
		res.json({ message: "Event deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get all events created by the authenticated user
export const getUserEvents = async (req, res) => {
	try {
		const userId = req.user.id;
		const events = await Event.find({ organizerId: userId });
		res.json(events);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};
