import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast,ToastContainer } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
const API_URL = import.meta.env.VITE_API_URL + "/api";

const TicketCard = ({ ticket, onCancel }) => {
	const { user } = useContext(AuthContext) || {};
	const [isCancelling, setIsCancelling] = useState(false);

	const event = ticket.event;

	const handleCancelTicket = async () => {
		if (!user?.token) {
			toast.error("❌ You are not logged in. Please log in again.");
			return;
		}

		const result = await MySwal.fire({
			title: "Are you sure?",
			text: "You won't be able to undo this action!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, cancel it!",
			background: "#fff",
			allowOutsideClick: false,
		});

		if (!result.isConfirmed) return;

		setIsCancelling(true);

		try {
			const response = await axios.delete(
				`${API_URL}/tickets/cancel/${ticket._id}`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			if (response.status === 200 || response.status === 204) {
				toast.success("✅ Ticket cancelled successfully!");
				onCancel(ticket._id);
			} else {
				throw new Error("Unexpected server response");
			}
		} catch (error) {
			console.error("❌ Ticket cancel error:", error);
			toast.error(
				error.response?.data?.message ||
					"⚠️ Failed to cancel ticket. Please try again."
			);
		} finally {
			setIsCancelling(false);
		}
	};

	if (!event) return <p className="text-gray-500">⚠️ Event data missing</p>;

	return (
		<div className="bg-white shadow-md w-full md:w-[30%] rounded-lg overflow-hidden p-5 flex flex-col gap-4 border border-gray-200">
			<div>
				<ToastContainer className="fixed top-0 right-0 z-50" />
			</div>
			{/* Event Image */}
			<img
				src={event.image || "/placeholder.jpg"}
				alt={event.title || "Event"}
				className="w-full h-44 object-cover rounded-lg"
			/>

			{/* Event Details */}
			<div className="flex flex-col gap-1 border-b border-gray-200 pb-3">
				<h3 className="text-xl font-bold text-gray-800">
					{event.title}
				</h3>
				<p className="text-gray-600">
					📅{" "}
					{event.date
						? new Date(event.date).toLocaleString()
						: "Date not available"}
				</p>
				<p className="text-gray-600">
					📍 {event.location || "No location provided"}
				</p>
			</div>

			{/* Ticket Info */}
			<div className="text-sm border-b border-gray-200 pb-3">
				<p className="text-gray-500">
					<strong>🎟 Ticket ID:</strong> {ticket._id}
				</p>
				{ticket.rfid && (
					<p className="text-gray-500">
						<strong>🔗 RFID:</strong> {ticket.rfid}
					</p>
				)}
			</div>

			{/* QR Code */}
			{ticket.qrCode && (
				<div className="flex justify-center">
					<img
						src={ticket.qrCode}
						alt="QR Code"
						className="mt-2 w-28 h-28 border border-gray-300 rounded-md shadow-sm"
					/>
				</div>
			)}

			{/* Cancel Button */}
			<button
				className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-200 shadow hover:shadow-lg disabled:opacity-50 mt-2"
				onClick={handleCancelTicket}
				disabled={isCancelling}
			>
				{isCancelling ? "Cancelling..." : "Cancel Ticket"}
			</button>
		</div>
	);
};

TicketCard.propTypes = {
	ticket: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
};

export default TicketCard;
