import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Heart, User } from "lucide-react";
import { format } from "date-fns";
import PropTypes from "prop-types";

export default function EventCard({ event }) {
	const [liked, setLiked] = useState(false);

	// Toggle like status
	const toggleLike = (e) => {
		e.stopPropagation();
		setLiked(!liked);
	};

	return (
		<div className="card hidden-section border-1 border-gray-200 rounded-xl overflow-hidden">
			<div className="relative overflow-hidden">
				<img
					src={`http://localhost:5000/${event.image}`}
					alt={event.title}
					className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
				/>
				<div className="absolute top-4 right-4">
					<button
						onClick={toggleLike}
						className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-200"
					>
						<Heart
							className={`h-5 w-5 transition-colors duration-200 ${
								liked
									? "text-red-500 fill-red-500"
									: "text-gray-600"
							}`}
						/>
					</button>
				</div>
			</div>

			<Link to={`/events/${event._id}`}>
				<div className="p-6">
					<div className="flex items-start justify-between mb-4">
						<div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors duration-200">
								{event.title}
							</h3>
							<p className="text-gray-600 line-clamp-2">
								{event.description}
							</p>
						</div>
						
					</div>

					{/* Organizer Name */}
					<div className="flex items-center text-gray-600 mb-3">
						<User className="h-5 w-5 mr-2 text-purple-500" />
						<span className="font-medium">
							Organized by: {event.organizerName || "Unknown"}
						</span>
					</div>

					<div className="space-y-2 mb-6">
						<div className="flex items-center text-gray-600">
							<Calendar className="h-5 w-5 mr-2 text-purple-500" />
							<span>
								{format(new Date(event.date), "MMMM d, yyyy")}
							</span>
						</div>
						<div className="flex items-center text-gray-600">
							<Clock className="h-5 w-5 mr-2 text-purple-500" />
							<span>
								{format(new Date(event.date), "h:mm a")}
							</span>
						</div>
						<div className="flex items-center text-gray-600">
							<MapPin className="h-5 w-5 mr-2 text-purple-500" />
							<span>{event.location}</span>
						</div>
						<div className="flex items-center text-gray-600">
							<Users className="h-5 w-5 mr-2 text-purple-500" />
							<span>{event.capacity} spots available</span>
						</div>
					</div>

					<div className="flex justify-between items-center">
						<div className="btn-secondary">View Details</div>
						<div className="btn-primary">Book Now</div>
					</div>
				</div>
			</Link>
		</div>
	);
}

// ✅ FIXED PropTypes (Added organizer)
EventCard.propTypes = {
	event: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		image: PropTypes.string,
		date: PropTypes.string.isRequired,
		location: PropTypes.string.isRequired,
		capacity: PropTypes.number.isRequired,
		organizer: PropTypes.string.isRequired, // Added organizer
		organizerName: PropTypes.string.isRequired, // Added organizer name
	}).isRequired,
};
