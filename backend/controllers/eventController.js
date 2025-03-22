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
			startTime: new Date(`${date}T${startTime}:00`),
			endTime: new Date(`${date}T${endTime}:00`),
			location,
			capacity,
			category: category || "General",
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



export const updateEvent = async (req, res) => {
	try {
		const {
			title,
			description,
			date,
			startTime,
			endTime,
			location,
			image,
			category,
		} = req.body;

		// ✅ Convert string dates to Date objects
		const parsedDate = date ? new Date(date) : null;
		const parsedStartTime = startTime ? new Date(startTime) : null;
		const parsedEndTime = endTime ? new Date(endTime) : null;

		if (
			parsedStartTime == "Invalid Date" ||
			parsedEndTime == "Invalid Date"
		) {
			return res.status(400).json({ message: "Invalid date format" });
		}

		const updatedEvent = await Event.findByIdAndUpdate(
			req.params.id,
			{
				title,
				description,
				date: parsedDate,
				startTime: parsedStartTime,
				endTime: parsedEndTime,
				location,
				image,
				category,
			},
			{ new: true }
		);

		if (!updatedEvent) {
			return res.status(404).json({ message: "Event not found" });
		}

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
