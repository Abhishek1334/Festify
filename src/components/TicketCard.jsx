import { useEffect, useState } from "react";
import axios from "axios";
import {PropTypes} from "prop-types";

const TicketCard = ({ ticket, onCancel }) => {
	const [event, setEvent] = useState(null);
	const [isCancelling, setIsCancelling] = useState(false);

	useEffect(() => {
		const fetchEventDetails = async () => {
			try {
				const response = await axios.get(
					`/api/events/${ticket.eventId._id}`
				);
				setEvent(response.data);
			} catch (error) {
				console.error("Error fetching event details:", error);
			}
		};

		fetchEventDetails();
	}, [ticket.eventId._id]);

	const handleCancelTicket = async () => {
		if (!window.confirm("Are you sure you want to cancel this ticket?"))
			return;

		setIsCancelling(true);
		try {
			await axios.delete(`/api/tickets/${ticket._id}`);
			alert("Ticket cancelled successfully!");
			onCancel(ticket._id); // Remove ticket from UI
		} catch (error) {
			console.error("Error cancelling ticket:", error);
			alert("Failed to cancel ticket. Please try again.");
		}
		setIsCancelling(false);
	};

	if (!event) return <p>Loading event details...</p>;

	return (
		<div className="bg-white shadow-md w-[30%] rounded-lg overflow-hidden p-4">
			<img
				src={`http://localhost:5000/${event.image}`}
				alt={event.title}
				className="w-full h-40 object-cover"
				onError={(e) => (e.target.src = "/default-placeholder.jpg")}
			/>
			<h3 className="text-lg font-semibold mt-2">{event.title}</h3>
			<p className="text-gray-600">
				{new Date(event.date).toLocaleString()}
			</p>
			<p className="text-gray-600">{event.location}</p>
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
				className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex place-self-center"
				onClick={handleCancelTicket}
				disabled={isCancelling}
			>
				{isCancelling ? "Cancelling..." : "Cancel Ticket"}
			</button>
		</div>
	);
};

export default TicketCard;

TicketCard.propTypes = {
	ticket: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
};