import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		rfid: { type: String, required: true, unique: true },
		userName: {
			// ✅ Store user name
			type: String,
			required: true,
		},
		qrCode: {
			type: String, // Stores QR code URL
		},
		checkedIn: {
			type: Boolean,
			default: false, // Initially, ticket is not checked in
		},
	},
	{ timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
