import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, Tag } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const EventPage = () => {
	const { eventid } = useParams();
	const { bookTicket } = useAuth();
	const [event, setEvent] = useState(null);

	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/events/${eventid}`)
			.then((response) => {
				setEvent(response.data);
			})
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

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="bg-white rounded-xl shadow-lg overflow-hidden">
				{/* Event Image */}
				<div className="relative h-96">
					<img
						src={
							event.image
								? `http://localhost:5000/${event.image}`
								: "/default-placeholder.jpg"
						}
						alt={event.title}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
				</div>

				<div className="p-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						{event.title}
					</h1>

					<div className="flex flex-wrap items-center space-x-6 text-gray-600 mb-6">
						{/* Date */}
						<div className="flex items-center">
							<Calendar className="h-5 w-5 mr-2" />
							<span>
								{event.date
									? format(
											new Date(event.date),
											"MMMM d, yyyy"
									  )
									: "No date available"}
							</span>
						</div>

						{/* Location */}
						<div className="flex items-center">
							<MapPin className="h-5 w-5 mr-2" />
							<span>
								{event.location || "Location not available"}
							</span>
						</div>

						{/* Category */}
						<div className="flex items-center">
							<Tag className="h-5 w-5 mr-2" />
							<span>{event.category || "No category"}</span>
						</div>

						{/* Capacity */}
						<div className="flex items-center">
							<Users className="h-5 w-5 mr-2" />
							<span>
								{event.capacity
									? `${event.capacity} seats`
									: "Capacity not specified"}
							</span>
						</div>

						{/* Timing */}
						<div className="flex items-center">
							<Clock className="h-5 w-5 mr-2" />
							<span>
								{event.timing || "Timing not available"}
							</span>
						</div>
					</div>

					<p className="text-gray-600 text-lg mb-8">
						{event.description || "No description provided"}
					</p>

					<span>
						Organized by: {event.organizerId?.name || "Unknown"}
					</span>

					<div className="flex space-x-4 mt-4">
						<button
							onClick={() => bookTicket(event._id)}
							className="btn-primary"
						>
							Get Ticket
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventPage;
