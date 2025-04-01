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
			organizerId,
			organizerName,
			capacity,
			category,
		} = req.body;

		// ✅ Save only the relative image path
		const imagePath = req.file ? `uploads/${req.file.filename}` : null;

		const parsedDate = new Date(date);
		const parsedStartTime = new Date(startTime);
		const parsedEndTime = new Date(endTime);

		if (
			isNaN(parsedDate) ||
			isNaN(parsedStartTime) ||
			isNaN(parsedEndTime)
		) {
			return res.status(400).json({
				message: "Invalid date format. Please provide a valid date.",
			});
		}

		if (parsedStartTime >= parsedEndTime) {
			return res
				.status(400)
				.json({ message: "Start time must be before end time." });
		}

		const event = new Event({
			title,
			description,
			date: parsedDate,
			startTime: parsedStartTime,
			endTime: parsedEndTime,
			location,
			image: imagePath, // ✅ Stores only `uploads/filename.jpg`
			organizerId,
			organizerName,
			capacity,
			category,
		});

		await event.save();
		res.status(201).json({ message: "Event created successfully", event });
	} catch (error) {
		console.error("Error creating event:", error);
		res.status(500).json({ message: "Server Error" });
	}
};

// Update an event by ID
export const updateEvent = async (req, res) => {
	try {
		const {
			title,
			description,
			category,
			date,
			startTime,
			endTime,
			location,
			capacity,
		} = req.body;
		const eventId = req.params.id;

		let event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		// Ensure only the organizer can update
		if (event.organizerId.toString() !== req.user.id) {
			return res
				.status(403)
				.json({ message: "Unauthorized to update this event" });
		}

		// Update fields
		event.title = title || event.title;
		event.description = description || event.description;
		event.category = category || event.category;
		
		// Debug logs
		console.log("Received date:", date);
		console.log("Received startTime:", startTime);
		console.log("Received endTime:", endTime);
		
		// Handle date and time updates
		if (date) event.date = new Date(date);
		if (startTime) event.startTime = new Date(startTime);
		if (endTime) event.endTime = new Date(endTime);
		
		event.location = location || event.location;

		// ✅ Fix: Ensure capacity is updated
		if (
			capacity !== undefined &&
			!isNaN(capacity) &&
			Number(capacity) > 0
		) {
			event.capacity = Number(capacity);
		}

		// Handle image update if provided
		if (req.file) {
			event.image = `uploads/${req.file.filename}`;
		}

		// Debug log
		console.log("Saving event with dates:", {
			date: event.date,
			startTime: event.startTime,
			endTime: event.endTime
		});

		await event.save();
		res.json(event);
	} catch (err) {
		console.error("Update Event Error:", err);
		res.status(500).json({ message: "Server error", error: err.message });
	}
};


// Delete an event
export const deleteEvent = async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);
		if (!event) return res.status(404).json({ message: "Event not found" });

		if (event.image) {
			fs.unlink(path.join("backend", event.image), (err) => {
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
