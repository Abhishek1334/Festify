import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		date: { type: Date, required: true },
		timing: { type: String, required: true },
		location: { type: String, required: true },
		image: { type: String },
		organizerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		}, // Reference to User model
		organizerName: { type: String, required: true }, // Organizer's name
		price: { type: Number, required: true }, // Ticket price
		capacity: { type: Number, required: true }, // Maximum capacity
		ticketsSold: { type: Number, default: 0 }, // Default tickets sold to 0
		category: { type: String, required: true }, // ✅ Add category field
	},
	{ timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
