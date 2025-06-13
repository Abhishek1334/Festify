import User from "../models/userModel.js";
import Event from "../models/eventModel.js";

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select("-password");
		res.json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ message: "Server error" });
	}
}

export const getAllEvents = async (req, res) => {
	try {
		const events = await Event.find();
		res.json(events);
	} catch (error) {
		console.error("Error fetching events:", error);
		res.status(500).json({ message: "Server error" });
	}
}

export const deleteEvent = async (req, res) => {
	try {
		const eventId = req.params.eventId;		const deletedEvent = await Event.findByIdAndDelete(eventId);
		if (!deletedEvent) {
			return res.status(404).json({ message: "Event not found" });
		}
		res.json({ message: "Event deleted successfully" });
	} catch (error) {
		console.error("Error deleting event:", error);
		res.status(500).json({ message: "Server error" });
	}
}
