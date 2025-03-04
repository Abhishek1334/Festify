import Event from "../models/eventModel.js";

// Create Event
export const createEvent = async (req, res) => {
	try {
		const { title, description, date, location, price, capacity } =
			req.body;
		const imageUrl = req.file ? req.file.path : null;

		const event = new Event({
			title,
			description,
			date,
			location,
			price,
			capacity,
			imageUrl,
			organizer: req.user._id,
		});

		await event.save();
		res.status(201).json(event);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error creating event" });
	}
};

// Get All Events
export const getEvents = async (req, res) => {
	const events = await Event.find();
	res.json(events);
};

// Update Event
export const updateEvent = async (req, res) => {
	const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.json(event);
};

// Delete Event
export const deleteEvent = async (req, res) => {
	await Event.findByIdAndDelete(req.params.id);
	res.json({ message: "Event deleted" });
};
