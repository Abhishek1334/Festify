import { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs"; // Required for DateTimePicker
import { toast, ToastContainer } from "react-toastify";
import {Link} from "react-router-dom";
import { StepBack } from "lucide-react";

const TicketCheckInPage = () => {
	const { eventId } = useParams();
	const { state } = useLocation();
	const [event, setEvent] = useState(state?.event || null);
	const [tickets, setTickets] = useState([]);
	const [ticketId, setTicketId] = useState(""); // ✅ Removed RFID
	const [filterVerified, setFilterVerified] = useState(false);

	const user = JSON.parse(localStorage.getItem("user"));
	const token = user?.token;

	// ✅ Fetch Event Details
	const fetchEventDetails = useCallback(async () => {
		if (!event && eventId) {
			try {
				const { data } = await axios.get(
					`http://localhost:5000/api/events/${eventId}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setEvent(data);
			} catch (err) {
				console.error("Error fetching event details:", err);
				toast.error("⚠️ Error fetching event details!");
			}
		}
	}, [event, eventId, token]);

	// ✅ Fetch Tickets
	const fetchTickets = useCallback(async () => {
		if (!eventId) return;
		try {
			const { data } = await axios.get(
				`http://localhost:5000/api/tickets/event/${eventId}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setTickets(data);
		} catch (err) {
			console.error("Error fetching tickets:", err);
			toast.error("⚠️ Error fetching tickets!");
		}
	}, [eventId, token]);

	useEffect(() => {
		fetchEventDetails();
		fetchTickets();
	}, [fetchEventDetails, fetchTickets]);

	// ✅ Ticket Verification Handler (Only Ticket ID)
	const handleVerifyTicket = async (e) => {
		e.preventDefault();

		if (!ticketId) {
			toast.warn("⚠️ Please enter a Ticket ID.");
			return;
		}

		try {
			await axios.post(
				`http://localhost:5000/api/tickets/verify`,
				{ ticketId, eventId }, // ✅ Removed RFID from request
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			toast.success("✅ Ticket Verified Successfully.");
			setTicketId(""); // ✅ Clear input after success
			fetchTickets();
		} catch (err) {
			console.error("Error verifying ticket:", err);
			toast.error(
				err.response?.data?.message || "❌ Ticket Verification Failed."
			);
		}
	};

	// ✅ Filtering Tickets Based on Checkbox
	const filteredTickets = filterVerified
		? tickets.filter((ticket) => ticket.checkedIn)
		: tickets;

	return (
		<div className="p-5">
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
			/>
			<Link to={`/organizer/${eventId}`} className="">
				<button className="btn-primary mb-3 flex gap-2">
					<StepBack className="size-6" />
					Go Back
				</button>
			</Link>
			{event ? (
				<div className="flex flex-wrap gap-5">
					{/* Event Details */}

					<div className="flex-1 p-5 border max-w-[25%] border-gray-300 space-y-3 max-h-[80vh]">
						<h2 className="font-bold">{event.title} </h2>
						<p className="text-sm">Event ID: {event._id}</p>
						{/* Showing live icon if the event has started*/}
						{dayjs(event.startTime).isBefore(dayjs()) && (
							<div className="flex items-center gap-1">
								<span className="text-green-500">🟢</span>
								<span>Live</span>
							</div>
						)}

						{/* Showing ended icon if the event has ended*/}
						{dayjs(event.endTime).isBefore(dayjs()) && (
							<div className="flex items-center gap-1">
								<span className="text-red-500">🔴</span>
								<span>Ended</span>
							</div>
						)}
						{/* Event Image */}
						<img
							src={`http://localhost:5000/${event.image}`}
							alt={`Event Image for ${event.title}`}
							className="w-full h-64 object-cover rounded-lg mb-4"
						/>
						<p className="text-lg">
							<b>Description:</b> {event.description}
						</p>

						{/* Event Date */}
						<div className="mt-5 grid grid-cols-2 gap-2 gap-x-4">
							<p>
								<b>Category:</b> {event.category}
							</p>
							<div>
								<b>Event Date:</b>{" "}
								{dayjs(event.date).format("MMMM D, YYYY")}
							</div>
							<div>
								<b>Start Time:</b>{" "}
								{dayjs(event.startTime).format("h:mm A")}
							</div>
							<div>
								<b>End Time:</b>{" "}
								{dayjs(event.endTime).format("h:mm A")}
							</div>
							<div>
								<b>Location:</b> {event.location}
							</div>
							<div>
								<b>Capacity:</b> {event.capacity}
							</div>
							<div>
								<b>Ticket Sold:</b> {event.ticketsSold}
							</div>
							<div>
								<b>Ticket Available:</b>{" "}
								{event.capacity - event.ticketsSold}
							</div>
							<div>
								<b>Created at:</b>{" "}
								{dayjs(event.createdAt).format(
									"MMMM D, YYYY h:mm A"
								)}
							</div>
						</div>
					</div>

					{/* Tickets Table */}
					<div className="flex-1 place-self-start w-full p-5 border border-gray-300">
						<h6 className="mb-3 text-lg font-bold">Tickets Sold</h6>

						{/* ✅ Verification Checkbox */}
						<div className="mb-3">
							<input
								type="checkbox"
								id="verifiedFilter"
								checked={filterVerified}
								onChange={() =>
									setFilterVerified((prev) => !prev)
								}
							/>
							<label htmlFor="verifiedFilter" className="ml-2">
								Show Verified Tickets Only
							</label>
						</div>

						{/* ✅ Ticket Verification Form (Only Ticket ID) */}
						<form onSubmit={handleVerifyTicket} className="mb-5">
							<input
								type="text"
								placeholder="Enter Ticket ID"
								value={ticketId}
								onChange={(e) => setTicketId(e.target.value)}
								className="border p-2 mr-2"
							/>
							<button
								type="submit"
								className="p-2 bg-blue-500 text-white"
							>
								Verify Ticket
							</button>
						</form>

						{/* Tickets Table */}
						<table className="w-full border-collapse">
							<thead>
								<tr>
									<th className="p-3 border border-gray-300">
										Ticket ID
									</th>
									<th className="p-3 border border-gray-300">
										QR Code
									</th>
									<th className="p-3 border border-gray-300">
										Status
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredTickets.length > 0 ? (
									filteredTickets.map((ticket) => (
										<tr key={ticket._id}>
											<td className="p-3 border border-gray-300">
												{ticket._id}
											</td>
											<td className="p-3 border border-gray-300">
												<img
													src={ticket.qrCode}
													alt={`QR Code for ${ticket._id}`}
													className="w-24 h-auto"
												/>
											</td>
											<td className="p-3 border border-gray-300">
												{ticket.checkedIn
													? "✅ Verified"
													: "❌ Not Verified"}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={3}
											className="p-3 text-center"
										>
											No tickets available
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			) : (
				<p>Loading event details...</p>
			)}
		</div>
	);
};

export default TicketCheckInPage;
