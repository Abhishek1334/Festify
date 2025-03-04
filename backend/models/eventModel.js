import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		category: { type: String, required: true },
		date: { type: String, required: true },
		time: { type: String, required: true }, // ✅ Added time field
		location: { type: String, required: true },
		price: { type: Number, required: true },
		capacity: { type: Number, required: true },
		ticketsSold: { type: Number, default: 0 }, // ✅ Added ticket tracking
		imageUrl: { type: String, required: true },
		organizerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		}, // ✅ Organizer ID
	},
	{ timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
