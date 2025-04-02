import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import moment from "moment-timezone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL + "/api";
const CLOUDINARY_CLOUD_NAME = "dmgyx29ou";

const getCloudinaryImageUrl = (publicId) =>
	`https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;

const EventPage = () => {
	const { eventid } = useParams();
	const { bookTicket, user } = useAuth();
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentTime, setCurrentTime] = useState(moment().tz("Asia/Kolkata"));

	useEffect(() => {
		let isMounted = true;

		const fetchEvent = async () => {
			try {
				const response = await axios.get(
					`${API_URL}/events/${eventid}`
				);
				if (isMounted) {
					setEvent(response.data);
					setError(null);
					setLoading(false);
				}
			} catch (error) {
				if (isMounted) {
					console.error("Error fetching event:", error);
					setError("Failed to load event details. Please try again.");
					setLoading(false);
				}
			}
		};

		fetchEvent();
		const interval = setInterval(() => {
			setCurrentTime(moment().tz("Asia/Kolkata"));
		}, 30000);

		return () => {
			isMounted = false;
			clearInterval(interval);
		};
	}, [eventid]);

	const handleTicketBooking = async () => {
		if (!user) {
			toast.error("You must be logged in to book a ticket.");
			return;
		}

		if (!event) {
			toast.error("Event details are missing. Please refresh the page.");
			return;
		}

		if (moment().isAfter(moment(event.endTime))) {
			toast.error("This event has ended. Ticket booking is closed.");
			return;
		}

		if (event.ticketsBooked >= event.capacity) {
			toast.error("Tickets are sold out! No more bookings available.");
			return;
		}

		try {
			const response = await bookTicket(event._id);

			// ✅ Handle error response properly
			if (response?.error) {
				toast.error(
					response.message ||
						"Failed to book ticket. Please try again."
				);
				return;
			}

			// ✅ Success case
			toast.success("🎟️ Ticket booked successfully! Check your profile.");
		} catch (error) {
			console.error("Error booking ticket:", error);
			toast.error("An unexpected error occurred. Please try again.");
		}
	};


	if (loading) return <p>Loading event details...</p>;
	if (error) return <p className="text-red-600">{error}</p>;

	const eventDate = moment(event.date).tz("Asia/Kolkata");
	const eventStartTime = moment(event.startTime).tz("Asia/Kolkata");
	const eventEndTime = moment(event.endTime).tz("Asia/Kolkata");

	const hasEventStarted = currentTime.isSameOrAfter(eventStartTime);
	const hasEventEnded = currentTime.isSameOrAfter(eventEndTime);

	const eventImage = event.image
		? getCloudinaryImageUrl(event.image)
		: "https://via.placeholder.com/800x400?text=No+Image";

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<ToastContainer />
			<div className="bg-white rounded-xl shadow-lg overflow-hidden">
				<img
					src={eventImage}
					alt={event.title}
					className="w-full h-96 object-cover"
				/>
				<div className="p-8">
					<h1 className="text-4xl font-bold">{event.title}</h1>
					<p className="text-lg text-gray-600 mt-4">
						{event.description}
					</p>
					<p className="text-gray-600 mt-4">
						<span className="font-bold">Organizer:</span>{" "}
						{event.organizerId?.name}
					</p>
					<p className="text-gray-600">
						<span className="font-bold">Category:</span>{" "}
						{event.category}
					</p>
					<p className="text-gray-600">
						<span className="font-bold">Location:</span>{" "}
						{event.location}
					</p>
					<p className="text-gray-600">
						<span className="font-bold">Capacity:</span>{" "}
						{event.capacity}
					</p>
					<p className="text-gray-600">
						<span className="font-bold">Date:</span>{" "}
						{eventDate.format("YYYY-MM-DD")}
					</p>
					<p className="text-gray-600">
						<span className="font-bold">Start Time:</span>{" "}
						{eventStartTime.format("hh:mm A")}
					</p>
					<p className="text-gray-600">
						<span className="font-bold">End Time:</span>{" "}
						{eventEndTime.format("hh:mm A")}
					</p>

					{/* Ticket Booking Button */}
					{hasEventEnded ? (
						<p className="text-red-600 font-bold mt-4">
							⚠ Event has ended. Ticket booking is closed.
						</p>
					) : hasEventStarted ? (
						<p className="text-yellow-500 font-bold mt-4">
							⚠ Event has started.
						</p>
					) : (
						user &&
						user.id !== event.organizerId?._id && (
							<button
								onClick={handleTicketBooking}
								className="btn-primary mt-4"
							>
								Get Ticket
							</button>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default EventPage;
