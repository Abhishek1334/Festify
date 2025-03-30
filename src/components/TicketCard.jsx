import { useEffect, useState, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContext"; // ✅ Use AuthContext for token

const TicketCard = ({ ticket, onCancel }) => {
	const { user } = useContext(AuthContext); // ✅ Get token from context
	const [event, setEvent] = useState(null);
	const [isCancelling, setIsCancelling] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	// ✅ Ensure eventId is correctly extracted
	const eventId = ticket.eventId?._id || ticket.eventId;

	// Fetch event details
	useEffect(() => {
		const fetchEventDetails = async () => {
			if (!eventId) return;

			try {
				const response = await axios.get(
					`http://localhost:5000/api/events/${eventId}`
				);
				setEvent(response.data);
			} catch (error) {
				console.error("❌ Error fetching event details:", error);
			}
		};

		fetchEventDetails();
	}, [eventId]);

	// Cancel ticket function
	const handleCancelTicket = async () => {
		if (!window.confirm("Are you sure you want to cancel this ticket?")) {
			return;
		}

		setIsCancelling(true);
		setSuccessMessage("");

		// ✅ Immediately remove ticket from UI before API request completes
		onCancel(ticket._id);

		try {
			if (!user?.token) {
				alert(
					"⚠️ Authentication token is missing. Please log in again."
				);
				setIsCancelling(false);
				return;
			}

			console.log(`🎟️ Cancelling Ticket ID: ${ticket._id}`);
			console.log("📡 Sending Token:", user.token);

			const response = await axios.delete(
				`http://localhost:5000/api/tickets/cancel/${ticket._id}`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
						"Content-Type": "application/json",
					},
				}
			);

			console.log("✅ API Response:", response.data);

			if (response.status === 200 || response.status === 204) {
				setSuccessMessage("✅ Ticket cancelled successfully!");
			} else {
				console.error("❌ Unexpected Response:", response);
				alert("⚠️ Failed to cancel ticket. Please try again.");
			}
		} catch (error) {
			console.error("❌ Error cancelling ticket:", error);
			console.log("📡 API Error Response:", error.response?.data);

			alert(
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



	// Display loading message until event data is fetched
	if (!event) return <p>Loading event details...</p>;

	return (
		<div className="bg-white shadow-md w-[30%] rounded-lg overflow-hidden p-4">
			<img
				src={`http://localhost:5000/${event.image}`}
				alt={event.title}
				className="w-full h-40 object-cover"
				onError={(e) => (e.target.src = "/default-placeholder.jpg")}
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
			{ticket.qrCode && (
				<img
					src={ticket.qrCode}
					alt="QR Code"
					className="mt-3 w-24 h-24 mx-auto"
				/>
			)}
			<button
				className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex place-self-center mt-3 disabled:opacity-50"
				onClick={handleCancelTicket}
				disabled={isCancelling}
			>
				{isCancelling ? "Cancelling..." : "Cancel Ticket"}
			</button>

			{successMessage && (
				<div className="mt-4 text-green-500">{successMessage}</div>
			)}
		</div>
	);
};

TicketCard.propTypes = {
	ticket: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
};

export default TicketCard;
