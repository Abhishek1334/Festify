import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Pencil } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const EventPage = () => {
	const { eventid } = useParams();
	const [event, setEvent] = useState(null);
	const { user } = useContext(AuthContext); // Get logged-in user

	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/events/${eventid}`)
			.then((response) => setEvent(response.data))
			.catch((error) => console.error("Error fetching event:", error));
	}, [eventid]);

	if (!event) {
		return (
			<div className="flex flex-col space-y-5 w-full h-[60vh] items-center justify-center bg-gray-200">
				<p className="text-xl font-semibold">Event not found</p>
				<Link to="/events">
					<button className="btn-secondary">Return to Events</button>
				</Link>
			</div>
		);
	}

	const imageUrl = event.image
		? `http://localhost:5000/${event.image}`
		: "/default-placeholder.jpg";

	const formattedDate =
		event?.date && !isNaN(new Date(event.date).getTime())
			? format(new Date(event.date), "MMMM d, yyyy")
			: "Date not available";

	const formattedTime =
		event?.date && !isNaN(new Date(event.date).getTime())
			? format(new Date(event.date), "h:mm a")
			: "Time not available";

	const organizerName = event.organizerName || "Unknown";

	// Check if the logged-in user is the organizer
	const isOrganizer = user && user.id === event.organizerId;

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="bg-white rounded-xl shadow-lg overflow-hidden">
				<div className="relative h-96">
					<img
						src={imageUrl}
						alt={event.title}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
				</div>

				<div className="p-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						{event.title}
					</h1>
					<div className="flex items-center space-x-6 text-gray-600 mb-6">
						<div className="flex items-center">
							<Calendar className="h-5 w-5 mr-2" />
							<span>{formattedDate}</span>
						</div>
						<div className="flex items-center">
							<Clock className="h-5 w-5 mr-2" />
							<span>{formattedTime}</span>
						</div>
						<div className="flex items-center">
							<MapPin className="h-5 w-5 mr-2" />
							<span>{event.location}</span>
						</div>
					</div>

					<p className="text-gray-600 text-lg mb-8">
						{event.description}
					</p>
					<span>Organized by: {organizerName}</span>

					<div className="flex space-x-4 mt-4">
						<button className="btn-primary">Get Tickets</button>

						{/* Show "Edit Event" button only for the organizer */}
						{isOrganizer && (
							<Link to={`/edit-event/${eventid}`}>
								<button className="btn-secondary flex items-center">
									<Pencil className="h-5 w-5 mr-2" />
									Edit Event
								</button>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventPage;
