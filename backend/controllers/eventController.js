import Event from "../models/eventModel.js";
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
		console.error("Error fetching events:", error);
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
		console.error("Error fetching event:", error);
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
			startTime,
			endTime,
			location,
			capacity,
			category,
		} = req.body;

		// Ensure required fields are provided
		if (
			!title ||
			!description ||
			!date ||
			!startTime ||
			!endTime ||
			!location ||
			!capacity
		) {
			return res
				.status(400)
				.json({ message: "All fields except category are required." });
		}

		const event = new Event({
			title,
			description,
			date,
			startTime,
			endTime,
			location,
			capacity,
			category: category || "Uncategorized", // Default to "Uncategorized" if empty
			organizerId: req.user.id,
			organizerName: req.user.name,
			image: req.file ? `uploads/${req.file.filename}` : "",
		});

		await event.save();
		res.status(201).json(event);
	} catch (error) {
		console.error("Error creating event:", error);
		res.status(500).json({ message: "Error creating event" });
	}
};

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
			return res
				.status(403)
				.json({ message: "Unauthorized to update this event" });
		}

		// Update event details
		event.title = req.body.title || event.title;
		event.description = req.body.description || event.description;
		event.date = req.body.date || event.date;
		event.startTime = req.body.startTime || event.startTime;
		event.endTime = req.body.endTime || event.endTime;
		event.location = req.body.location || event.location;
		event.capacity = req.body.capacity || event.capacity;
		event.category =
			req.body.category !== undefined
				? req.body.category
				: event.category;

		// Handle image upload
		if (req.file) {
			// Delete old image if exists
			if (event.image) {
				const oldImagePath = path.join("backend", event.image);
				fs.unlink(oldImagePath, (err) => {
					if (err) console.error("Error deleting old image:", err);
				});
			}
			event.image = `uploads/${req.file.filename}`;
		}

		const updatedEvent = await event.save();
		res.status(200).json(updatedEvent);
	} catch (error) {
		console.error("Error updating event:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Delete an event
export const deleteEvent = async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);

		if (!event) return res.status(404).json({ message: "Event not found" });

		// Ensure only the organizer can delete
		if (event.organizerId.toString() !== req.user.id) {
			return res
				.status(403)
				.json({ message: "Unauthorized to delete this event" });
		}

		// Delete the event image if exists
		if (event.image) {
			const imagePath = path.join("backend", event.image);
			fs.unlink(imagePath, (err) => {
				if (err) console.error("Error deleting image:", err);
			});
		}

		await event.deleteOne();
		res.json({ message: "Event deleted successfully" });
	} catch (error) {
		console.error("Error deleting event:", error);
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
		console.error("Error fetching user events:", error);
		res.status(500).json({ message: "Server error" });
	}
};
