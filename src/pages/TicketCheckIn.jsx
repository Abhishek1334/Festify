import { useState, useEffect, useCallback } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import {
	StepBack,
	Calendar,
	Clock,
	MapPin,
	Users,
	Tag,
	Search,
	CheckCircle2,
	XCircle,
	PenBoxIcon,
} from "lucide-react";
import QRScanner from "../components/QRScanner";

const API_URL = import.meta.env.VITE_API_URL + "/api";

const getCloudinaryImageUrl = (publicId) => {
	if (!publicId) return "https://via.placeholder.com/300";
	if (publicId.startsWith("http") || publicId.startsWith("https"))
		return publicId;
	const cleanPublicId = publicId.replace(
		/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//,
		""
	);
	return `https://res.cloudinary.com/dmgyx29ou/image/upload/${cleanPublicId}`;
};

const validateRFID = (rfid) => {
	// Validate format: SS 5S E9 55 (uppercase letters and numbers with spaces)
	const regex = /^[A-Z0-9]{2}\s[A-Z0-9]{2}\s[A-Z0-9]{2}\s[A-Z0-9]{2}$/;
	return regex.test(rfid);
};

const TicketCheckInPage = () => {
	const { eventId } = useParams();
	const { state } = useLocation();
	const [event, setEvent] = useState(state?.event || null);
	const [tickets, setTickets] = useState([]);
	const [ticketId, setTicketId] = useState("");
	const [filterVerified, setFilterVerified] = useState(false);
	const [showRfidModal, setShowRfidModal] = useState(false);
	const [currentTicket, setCurrentTicket] = useState(null);
	const [rfidInput, setRfidInput] = useState("");
	const [isUpdating, setIsUpdating] = useState(false);

	const user = JSON.parse(localStorage.getItem("user"));
	const token = user?.token;

	const fetchEventDetails = useCallback(async () => {
		if (!event && eventId) {
			try {
				const { data } = await axios.get(
					`${API_URL}/events/${eventId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setEvent(data);

				const now = dayjs();
				if (now.isAfter(dayjs(data.endTime))) {
					toast.info("⚠️ This event has already ended.");
				} else if (data.ticketsSold >= data.capacity) {
					toast.warn("🎟️ Event is sold out!");
				}
			} catch (err) {
				toast.error("⚠️ Error fetching event details!");
			}
		}
	}, [event, eventId, token]);

	const fetchTickets = useCallback(async () => {
		if (!eventId) return;
		try {
			const { data } = await axios.get(
				`${API_URL}/tickets/event/${eventId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setTickets(data);
		} catch (err) {
			toast.error("⚠️ Error fetching tickets!");
		}
	}, [eventId, token]);

	useEffect(() => {
		fetchEventDetails();
		fetchTickets();
	}, [fetchEventDetails, fetchTickets]);

	const handleVerifyTicket = async (e) => {
		e.preventDefault();

		if (!ticketId) {
			toast.warn("⚠️ Please enter a Ticket ID.");
			return;
		}

		try {
			const response = await axios.post(
				`${API_URL}/tickets/verify`,
				{ ticketId, eventId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (
				response.data.status === "already_verified" ||
				response.data.message === "ALREADY_VERIFIED"
			) {
				toast.info("🔄 This ticket is already verified.");
			} else {
				toast.success("✅ Ticket Verified Successfully!");
			}

			setTicketId("");
			fetchTickets();
		} catch (err) {

			toast.error(
				err.response?.data?.message || "❌ Ticket Verification Failed."
			);
		}
	};

	const handleRfidUpdate = async () => {
		if (!currentTicket?._id) {
			toast.warn("⚠️ No ticket selected for RFID update");
			return;
		}

		if (!validateRFID(rfidInput)) {
			toast.error(
				"❌ Invalid RFID format. Please use format: SS 5S E9 55"
			);
			return;
		}

		setIsUpdating(true);
		try {
			const response = await axios.put(
				`${API_URL}/tickets/update/${currentTicket._id}`,
				{ rfid: rfidInput },
				{ headers: { Authorization: `Bearer ${token}` } }
			);


			toast.success(
				response.data?.message || "✅ RFID Updated Successfully!"
			);
			setShowRfidModal(false);
			setRfidInput("");
			fetchTickets();
		} catch (err) {
			console.error("Error updating RFID:", err);
			toast.error(
				err.response ||
					"❌ RFID Update Failed. Please try again."
			);
		} finally {
			setIsUpdating(false);
		}
	};

	const openRfidModal = (ticket) => {
		setCurrentTicket(ticket);
		setRfidInput(ticket.rfid || "");
		setShowRfidModal(true);
	};

	const filteredTickets = filterVerified
		? tickets.filter((ticket) => ticket.checkedIn)
		: tickets;

	const getEventStatus = () => {
		const now = dayjs();
		if (now.isBefore(dayjs(event.startTime))) return "Upcoming";
		if (now.isBefore(dayjs(event.endTime))) return "Live";
		return "Ended";
	};

	const isSoldOut = event?.ticketsSold >= event?.capacity;

	const getStatusTagColor = () => {
		const status = getEventStatus();
		switch (status) {
			case "Upcoming":
				return "bg-blue-100 text-blue-700";
			case "Live":
				return "bg-green-100 text-green-700";
			default:
				return "bg-red-100 text-red-700";
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4 md:p-6">
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
			/>

			{/* RFID Update Modal */}
			{showRfidModal && (
				<div className="fixed inset-0 z-50 overflow-y-auto">
					<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<div
							className="fixed inset-0 transition-opacity"
							onClick={() => setShowRfidModal(false)}
						>
							<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
						</div>

						<span className="hidden sm:inline-block sm:align-middle sm:h-screen">
							&#8203;
						</span>

						<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
							<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<div className="sm:flex sm:items-start">
									<div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
										<h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
											Update RFID Tag for Ticket
										</h3>
										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													RFID Tag (Format: SS 5S E9
													55)
												</label>
												<input
													type="text"
													value={rfidInput}
													onChange={(e) =>
														setRfidInput(
															e.target.value.toUpperCase()
														)
													}
													placeholder="Enter RFID in SS 5S E9 55 format"
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
												/>
												{rfidInput &&
													!validateRFID(
														rfidInput
													) && (
														<p className="mt-1 text-sm text-red-600">
															Invalid format.
															Please use SS 5S E9
															55 format.
														</p>
													)}
											</div>
											<div className="flex justify-end space-x-3">
												<button
													onClick={() =>
														setShowRfidModal(false)
													}
													className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
												>
													Cancel
												</button>
												<button
													onClick={handleRfidUpdate}
													disabled={
														!validateRFID(
															rfidInput
														) || isUpdating
													}
													className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
														validateRFID(
															rfidInput
														) && !isUpdating
															? "bg-purple-600 hover:bg-purple-700"
															: "bg-purple-300 cursor-not-allowed"
													}`}
												>
													{isUpdating
														? "Updating..."
														: "Update RFID"}
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="max-w-7xl mx-auto">
				<Link
					to={`/organizer/${eventId}`}
					className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-6"
				>
					<StepBack className="h-5 w-5" />
					<span>Back to Event</span>
				</Link>

				{event ? (
					<div className="grid lg:grid-cols-2 gap-6">
						{/* Event Details Card */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
							<div className="relative h-48">
								<img
									src={getCloudinaryImageUrl(event.image)}
									alt={event.title}
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
								<div className="absolute bottom-4 left-4 right-4">
									<h1 className="text-2xl font-bold text-white mb-2">
										{event.title}
									</h1>
									<span
										className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusTagColor()}`}
									>
										{isSoldOut
											? "Sold Out"
											: getEventStatus()}
									</span>
								</div>
							</div>

							<div className="p-6">
								<p className="text-gray-600 mb-6">
									{event.description}
								</p>
								<p className="text-gray-600 text-sm mb-6">
									EventId: {eventId}
								</p>
								<div className="grid grid-cols-2 gap-4">
									<div className="flex items-center space-x-2 text-gray-600">
										<Calendar className="h-5 w-5 text-purple-500" />
										<span>
											{dayjs(event.date).format(
												"MMMM D, YYYY"
											)}
										</span>
									</div>
									<div className="flex items-center space-x-2 text-gray-600">
										<MapPin className="h-5 w-5 text-purple-500" />
										<span>{event.location}</span>
									</div>
									<div className="flex items-center space-x-2 text-gray-600">
										<Clock className="h-5 w-5 text-purple-500" />
										<span>
											{dayjs(event.startTime).format(
												"h:mm A"
											)}
										</span>
									</div>
									<div className="flex items-center space-x-2 text-gray-600">
										<Clock className="h-5 w-5 text-purple-500" />
										<span>
											{dayjs(event.endTime).format(
												"h:mm A"
											)}
										</span>
									</div>
									<div className="flex items-center space-x-2 text-gray-600">
										<Clock className="h-5 w-5 text-purple-500" />
										<span>
											{dayjs(event.endTime).format(
												"h:mm A"
											)}
										</span>
									</div>
									
									<div className="flex items-center space-x-2 text-gray-600">
										<Users className="h-5 w-5 text-purple-500" />
										<span>
											{event.ticketsSold} /{" "}
											{event.capacity} tickets sold
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Ticket Verification Section */}
						<div className="space-y-6">
							<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-xl font-bold text-gray-900">
										Verify Tickets
									</h2>
									<div className="flex items-center space-x-2">
										<input
											type="checkbox"
											id="verifiedFilter"
											checked={filterVerified}
											onChange={() =>
												setFilterVerified(
													(prev) => !prev
												)
											}
											className="rounded text-purple-600 focus:ring-purple-500"
										/>
										<label
											htmlFor="verifiedFilter"
											className="text-sm text-gray-600"
										>
											Show verified only
										</label>
									</div>
								</div>

								<form
									onSubmit={handleVerifyTicket}
									className="mb-6"
								>
									<div className="relative">
										<Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
										<input
											type="text"
											placeholder="Enter Ticket ID"
											value={ticketId}
											onChange={(e) =>
												setTicketId(e.target.value)
											}
											className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
										/>
										<button
											type="submit"
											className="absolute right-2 top-2 px-4 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
										>
											Verify
										</button>
									</div>
								</form>

								<QRScanner
									eventId={event?._id}
									onScanSuccess={fetchTickets}
								/>
							</div>

							{/* Tickets List */}
							<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
								<h3 className="text-lg font-bold text-gray-900 mb-4">
									Recent Tickets
								</h3>
								<div className="space-y-3">
									{filteredTickets.length > 0 ? (
										filteredTickets
											.slice(0, 5)
											.map((ticket) => (
												<div
													key={ticket._id}
													className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
												>
													<div className="flex items-center space-x-3">
														<Tag className="h-5 w-5 text-purple-500" />
														<div>
															<span className="text-sm font-medium text-gray-600 block">
																{ticket._id}
															</span>
															{ticket.rfid && (
																<span className="text-xs text-gray-500 block">
																	RFID:{" "}
																	{
																		ticket.rfid
																	}
																</span>
															)}
														</div>
													</div>
													<div className="flex items-center space-x-2">
														{ticket.checkedIn ? (
															<CheckCircle2 className="h-5 w-5 text-green-500" />
														) : (
															<XCircle className="h-5 w-5 text-red-500" />
														)}
														<PenBoxIcon
															className="h-5 w-5 text-gray-500 cursor-pointer hover:text-purple-600"
															onClick={() =>
																openRfidModal(
																	ticket
																)
															}
														/>
													</div>
												</div>
											))
									) : (
										<p className="text-center text-gray-500 py-4">
											No tickets available
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="flex items-center justify-center h-64">
						<div className="animate-pulse flex space-x-4">
							<div className="rounded-full bg-gray-200 h-12 w-12"></div>
							<div className="space-y-4">
								<div className="h-4 bg-gray-200 rounded w-32"></div>
								<div className="h-4 bg-gray-200 rounded w-24"></div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TicketCheckInPage;
