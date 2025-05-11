import Event from "../models/eventModel.js";
import crypto from "crypto";
import axios from "axios";
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
import Ticket from "../models/ticketModel.js";


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
			image, // ✅ Get image from req.body
		} = req.body;

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
			return res.status(400).json({
				message: "Start time must be before end time.",
			});
		}

		const event = new Event({
			title,
			description,
			date: parsedDate,
			startTime: parsedStartTime,
			endTime: parsedEndTime,
			location,
			image, // ✅ Use image from req.body
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
			image, // ✅ Make sure we extract image from req.body
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

		// ✅ Update event fields
		event.title = title || event.title;
		event.description = description || event.description;
		event.category = category || event.category;
		event.location = location || event.location;

		// ✅ Update date and time if provided
		if (date) event.date = new Date(date);
		if (startTime) event.startTime = new Date(startTime);
		if (endTime) event.endTime = new Date(endTime);

		// ✅ Ensure capacity is updated if a valid number is provided
		if (
			capacity !== undefined &&
			!isNaN(capacity) &&
			Number(capacity) > 0
		) {
			event.capacity = Number(capacity);
		}

		// ✅ Save only the public_id of the image
		if (image) {
			event.image = image; // Store only public_id
		}

		await event.save();
		console.log("Event Saved Successfully");
		res.json(event);
	} catch (err) {
		console.error("Update Event Error:", err);
		res.status(500).json({ message: "Server error", error: err.message });
	}
};





// Delete Event Controller
export const deleteEvent = async (req, res) => {
	try {
		const eventId = req.params.id;
		const event = await Event.findById(eventId);

		if (!event) {
			return res
				.status(404)
				.json({ message: "Event not found or not authorized" });
		}

		// Delete image from Cloudinary if exists
		if (event.image) {
			try {
				// More robust public ID extraction
				const urlParts = event.image.split("/");
				const uploadIndex = urlParts.findIndex(
					(part) => part === "upload"
				);
				const publicIdWithExtension = urlParts
					.slice(uploadIndex + 2)
					.join("/");
				const publicId = publicIdWithExtension.split(".")[0];

				console.log("Extracted Public ID:", publicId);

				const timestamp = Math.round(Date.now() / 1000);
				const paramsToSign = {
					public_id: publicId,
					timestamp: timestamp,
				};

				// Using Cloudinary SDK is more reliable than manual signing
				const result = await cloudinary.uploader.destroy(publicId, {
					invalidate: true,
				});

				if (result.result !== "ok") {
					console.error("Cloudinary deletion failed:", result);
					throw new Error("Failed to delete image from Cloudinary");
				}

				console.log("Successfully deleted image from Cloudinary");
			} catch (cloudinaryError) {
				console.error("Cloudinary deletion error:", cloudinaryError);
				// Don't fail the entire deletion if image deletion fails
				// Continue with event deletion but log the issue
			}
		}

		// Delete event and associated tickets
		await Promise.all([
			event.deleteOne(),
			Ticket.deleteMany({ eventId: req.params.id }),
		]);

		res.json({ message: "Event deleted successfully" });
	} catch (error) {
		console.error("Error deleting event:", error);

		if (error.response?.status === 401) {
			return res.status(401).json({
				message: "Authentication failed",
				error: error.response.data,
			});
		}

		res.status(500).json({
			message: error.message || "Server error during deletion",
			error: error.response?.data || error.message,
		});
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
