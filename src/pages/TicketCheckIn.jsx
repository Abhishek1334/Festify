import { useState, useEffect, useCallback } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import { StepBack } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL + "/api";
const getCloudinaryImageUrl = (publicId) => {
	// ✅ Return placeholder if no image is provided
	if (!publicId) return "https://via.placeholder.com/300";

	// ✅ If the image is already a full URL, return it as-is
	if (publicId.startsWith("http") || publicId.startsWith("https"))
		return publicId;

	// ✅ Ensure we clean up any unwanted Cloudinary URL prefixes
	const cleanPublicId = publicId.replace(
		/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//,
		""
	);

	// ✅ Construct a valid Cloudinary URL
	return `https://res.cloudinary.com/dmgyx29ou/image/upload/${cleanPublicId}`;
};

const TicketCheckInPage = () => {
	const { eventId } = useParams();
	const { state } = useLocation();
	const [event, setEvent] = useState(state?.event || null);
	const [tickets, setTickets] = useState([]);
	const [ticketId, setTicketId] = useState("");
	const [filterVerified, setFilterVerified] = useState(false);

	const user = JSON.parse(localStorage.getItem("user"));
	const token = user?.token;

	// ✅ Fetch Event Details
	const fetchEventDetails = useCallback(async () => {
		if (!event && eventId) {
			try {
				const { data } = await axios.get(
					`${API_URL}/events/${eventId}`,
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
				`${API_URL}/tickets/event/${eventId}`,
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

	// ✅ Ticket Verification Handler
	const handleVerifyTicket = async (e) => {
		e.preventDefault();

		// 🛑 Ensure Ticket ID is entered
		if (!ticketId) {
			toast.warn("⚠️ Please enter a Ticket ID.");
			return;
		}

		try {
			// 🔹 Send request to verify ticket
			const response = await axios.post(
				`${API_URL}/tickets/verify`,
				{ ticketId, eventId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			// ✅ Handle different response messages
			if (response.data.message === "Ticket already verified.") {
				toast.info("🔄 This ticket is already verified.");
			} else {
				toast.success("✅ Ticket Verified Successfully!");
			}

			// ✅ Clear input and refresh ticket data
			setTicketId("");
			fetchTickets();
		} catch (err) {
			console.error("Error verifying ticket:", err);

			// ❌ Handle verification errors
			toast.error(
				err.response?.data?.message || "❌ Ticket Verification Failed."
			);
		}
	};


	// ✅ Filtering Tickets
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

			<Link to={`/user-profile`}>
				<button className="btn-primary mb-3 flex gap-2">
					<StepBack className="size-6" />
					Go Back
				</button>
			</Link>

			{event ? (
				<div className="flex flex-wrap gap-5 max-lg:flex-col ">
					{/* Event Details */}
					<div className="flex-1 p-5 border  border-gray-300 space-y-3 max-h-[80vh]">
						<h2 className="font-bold">{event.title}</h2>
						<p className="text-sm">Event ID: {event._id}</p>

						{/* Live, Upcoming, or Ended Status */}
						<div className="flex items-center gap-1">
							{dayjs().isBefore(dayjs(event.startTime)) ? (
								<>
									<span className="text-blue-500">🔵</span>
									<span>Upcoming</span>
								</>
							) : dayjs().isBefore(dayjs(event.endTime)) ? (
								<>
									<span className="text-green-500">🟢</span>
									<span>Live</span>
								</>
							) : (
								<>
									<span className="text-red-500">🔴</span>
									<span>Ended</span>
								</>
							)}
						</div>

						{/* ✅ Event Image (Cloudinary) */}
						<img
							src={getCloudinaryImageUrl(event.image)}
							alt={`Event Image for ${event.title}`}
							className="w-full h-64 object-cover rounded-lg mb-4"
						/>

						<p className="text-lg">
							<b>Description:</b> {event.description}
						</p>

						{/* Event Info */}
						<div className="mt-5 grid grid-cols-2 gap-2 gap-x-4">
							<p>
								<b>Category:</b> {event.category}
							</p>
							<p>
								<b>Event Date:</b>{" "}
								{dayjs(event.date).format("MMMM D, YYYY")}
							</p>
							<p>
								<b>Start Time:</b>{" "}
								{dayjs(event.startTime).format("h:mm A")}
							</p>
							<p>
								<b>End Time:</b>{" "}
								{dayjs(event.endTime).format("h:mm A")}
							</p>
							<p>
								<b>Location:</b> {event.location}
							</p>
							<p>
								<b>Capacity:</b> {event.capacity}
							</p>
							<p>
								<b>Tickets Sold:</b> {event.ticketsSold}
							</p>
							<p>
								<b>Available Tickets:</b>{" "}
								{event.capacity - event.ticketsSold}
							</p>
						</div>
					</div>

					{/* Tickets Table */}
					<div className="flex-1 place-self-start w-full p-5 border border-gray-300 ">
						<h6 className="mb-3 text-lg font-bold">Tickets Sold</h6>

						{/* ✅ Verified Tickets Filter */}
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

						{/* ✅ Ticket Verification Form */}
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
									<th className="p-3 border  border-gray-300">
										Ticket ID
									</th>
									<th className="p-3 border  border-gray-300 ">
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
											<td className="p-3 border border-gray-300 max-w-21 overflow-auto">
												{ticket._id}
											</td>
											<td className="p-2 border border-gray-300 ">
												<img
													src={
														ticket.qrCode ||
														"https://via.placeholder.com/100"
													}
													alt={`QR Code for ${ticket._id}`}
													className="max-w-20 h-auto"
												/>
											</td>
											<td className="p-3 border border-gray-300 ">
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
