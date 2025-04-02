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
				}
			} catch (error) {
				if (isMounted) {
					console.error("Error fetching event:", error);
					setError("Failed to load event details. Please try again.");
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
		// ✅ Attempt to book the ticket via API request
		const response = await bookTicket(event._id);
		console.log("API Response:", response); // Debugging log

		// ✅ Ensure response is successful before showing success message
		if (response?.success && response?.ticket) {
			toast.success(
				"🎟️ Ticket booked successfully! Check your profile for details."
			);
			return;
		}

		// ❌ Handle unexpected API response (no success flag or missing ticket data)
		console.error("Unexpected API response:", response);
		toast.error(
			response?.message ||
				"An error occurred while booking. Please try again."
		);
	} catch (error) {
		console.error("Error booking ticket:", error);

		// ❌ Handle backend errors properly
		const errorMessage =
			error?.response?.data?.message ||
			"Failed to book ticket. Please try again.";
		toast.error(errorMessage);
	}
};




	if (error) return <p className="text-red-600">{toast.error(error)}</p>;
	if (!event) return <p>Loading event details...</p>;
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
			<div className="fixed top-0 right-0 z-50">
				<ToastContainer />
			</div>
			<div className="bg-white rounded-xl shadow-lg overflow-hidden">
				<img
					src={eventImage}
					alt={event.title}
					className="w-full h-96 object-cover"
				/>
				<div className="p-8">
					<h1 className="text-4xl font-bold">{event.title}</h1>
					<div className="text-lg text-gray-600 mt-4 flex justify-between flex-wrap">
						<p className="flex-1">{event.description}</p>
						<p className="flex place-self-end text-gray-600 ">
							<span className="font-bold">Organizer: </span>{" "}
							{event.organizerId?.name}
						</p>
						
					</div>
					<p className="text-gray-600 mt-4">
						<span className="font-bold">Category : </span>
						{event.category}
					</p>

					<div className="flex  gap-1 flex-col ">
						<p className="text-gray-600 mt-4">
							<span className="font-bold">Location:</span>{" "}
							{event.location}
						</p>

						<p className="text-gray-600 ">
							<span className="font-bold">Capacity:</span>{" "}
							{event.capacity}
						</p>
						<p className="text-gray-600 ">
							<span className="font-bold">Date:</span>{" "}
							{eventDate.format("YYYY-MM-DD")}
						</p>
						<p className="text-gray-600 ">
							<span className="font-bold">Start Time:</span>{" "}
							{eventStartTime.format("HH:mm A")}
						</p>
						<p className="text-gray-600">
							<span className="font-bold">End Time:</span>{" "}
							{eventEndTime.format("HH:mm A")}
						</p>
					</div>

					{/* Expired Status */}
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
								disabled={hasEventEnded} // Disable button if event has ended
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
