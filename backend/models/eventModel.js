import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		date: { type: Date, required: true },
		startTime: { type: Date, required: true }, 
		endTime: { type: Date, required: true }, 
		location: { type: String, required: true },
		image: { type: String },
		organizerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		organizerName: { type: String, required: true },
		capacity: { type: Number, required: true },
		ticketsSold: { type: Number, default: 0 },
		category: { type: String, required: true },
	},
	{ timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
