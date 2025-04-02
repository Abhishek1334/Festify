import { useEffect, useState, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContext";
import {toast, ToastContainer} from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL + "/api";

const TicketCard = ({ ticket, onCancel }) => {
	const { user } = useContext(AuthContext) || {};
	const [event, setEvent] = useState(null);
	const [isCancelling, setIsCancelling] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
console.log(event);
	// Extract eventId safely
	const eventId = ticket?.eventId?._id || ticket?.eventId;

	// Fetch event details
	useEffect(() => {
		const fetchEventDetails = async () => {
			if (!eventId) return;

			try {
				const { data } = await axios.get(
					`${API_URL}/events/${eventId}`
				);
				setEvent(data);
			} catch (error) {
				console.error("❌ Error fetching event details:", error);
				setErrorMessage("⚠️ Failed to load event details.");
			}
		};

		fetchEventDetails();
	}, [eventId]);

	// Cancel ticket function
	const handleCancelTicket = async () => {
		if (!user?.token) {
			toast.error("You are not logged in. Please log in again.");
			return;
		}

		if (!window.confirm("Are you sure you want to cancel this ticket?")) {
			return;
		}

		setIsCancelling(true);
		setSuccessMessage("");
		setErrorMessage("");

		// Immediately remove ticket from UI before API request completes
		onCancel(ticket._id);

		try {
			const response = await axios.delete(
				`${API_URL}/tickets/cancel/${ticket._id}`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.status === 200 || response.status === 204) {
				setSuccessMessage("✅ Ticket cancelled successfully!");
			} else {
				throw new Error("Unexpected response from server.");
			}
		} catch (error) {
			console.error("❌ Error cancelling ticket:", error);
			setErrorMessage(
				error.response?.data?.message ||
					"⚠️ Failed to cancel ticket. Please try again."
			);
		} finally {
			setIsCancelling(false);

			// Hide success message after 3 seconds
			setTimeout(() => {
				setSuccessMessage("");
			}, 3000);
		}
	};

	if (!event)
		return <p className="text-gray-500">Loading event details...</p>;
	console.log(event.image)
	return (
		<div className="bg-white shadow-md w-[30%] rounded-lg overflow-hidden p-4 min-w-[300px] flex-1">
			{/* Event Image */}
			<div className="fixed top-0 right-0 z-50">
				<ToastContainer />
			</div>
			<img
				src={`https://res.cloudinary.com/dmgyx29ou/image/upload/${event.image}`}
				alt={event.title || "Event"}
				className="w-full h-40 object-cover rounded-lg"
			/>

			<h3 className="text-lg font-semibold mt-2">
				{event.title || "No Title"}
			</h3>
			<p className="text-gray-600">
				{event.date
					? new Date(event.date).toLocaleString()
					: "No Date Available"}
			</p>
			<p className="text-gray-600">
				{event.location || "Location not specified"}
			</p>
			<p className="text-sm text-gray-500">
				<strong>Ticket ID:</strong> {ticket._id}
			</p>

			{/* QR Code */}
			{ticket.qrCode && (
				<img
					src={ticket.qrCode}
					alt="QR Code"
					className="mt-3 w-24 h-24 mx-auto"
				/>
			)}

			{/* Cancel Button */}
			<button
				className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex place-self-center mt-3 disabled:opacity-50"
				onClick={handleCancelTicket}
				disabled={isCancelling}
			>
				{isCancelling ? "Cancelling..." : "Cancel Ticket"}
			</button>

			{/* Messages */}
			{successMessage && (
				<div className="mt-4 text-green-500">{successMessage}</div>
			)}
			{errorMessage && (
				<div className="mt-4 text-red-500">{errorMessage}</div>
			)}
		</div>
	);
};

TicketCard.propTypes = {
	ticket: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
};

export default TicketCard;
