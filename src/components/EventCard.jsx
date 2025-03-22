import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Heart, User } from "lucide-react";
import { format } from "date-fns";
import PropTypes from "prop-types";

export default function EventCard({ event, organizer }) {
	const [liked, setLiked] = useState(false);

	const toggleLike = (e) => {
		e.stopPropagation();
		setLiked(!liked);
	};

	return (
		<div className="card hidden-section border-1 border-gray-200 rounded-xl overflow-hidden cursor-pointer">
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
			<Link
				to={
					organizer
						? `/organizer/${event._id}`
						: `/events/${event._id}`
				}
			>
				<div className="p-6">
					<h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors duration-200">
						{event.title}
					</h3>
					<p className="text-gray-600 line-clamp-2">
						{event.description}
					</p>

					{/* Organizer Name */}
					<div className="flex items-center text-gray-600 mb-3">
						<User className="h-5 w-5 mr-2 text-purple-500" />
						<span className="font-medium">
							Organized by: {event.organizerName || "Unknown"}
						</span>
					</div>

					<div className="space-y-2 mb-6">
						{/* Event Date */}
						<div className="flex items-center text-gray-600">
							<Calendar className="h-5 w-5 mr-2 text-purple-500" />
							<span>
								{event.date
									? format(
											new Date(event.date),
											"MMMM d, yyyy"
									  )
									: "No date"}
							</span>
						</div>

						{/* Event Timing - Start & End Time */}
						<div className="flex items-center text-gray-600">
							<Clock className="h-5 w-5 mr-2 text-purple-500" />
							<span>{event.timing}</span>
						</div>

						{/* Location */}
						<div className="flex items-center text-gray-600">
							<MapPin className="h-5 w-5 mr-2 text-purple-500" />
							<span>
								{event.location || "Location not specified"}
							</span>
						</div>

						{/* Capacity */}
						<div className="flex items-center text-gray-600">
							<Users className="h-5 w-5 mr-2 text-purple-500" />
							<span>
								{event.capacity
									? `${event.capacity} spots available`
									: "Capacity not specified"}
							</span>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
}

// ✅ Updated PropTypes
EventCard.propTypes = {
	event: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		image: PropTypes.string,
		date: PropTypes.string.isRequired,
		timing: PropTypes.string.isRequired,
		location: PropTypes.string.isRequired,
		capacity: PropTypes.number.isRequired,
		organizerName: PropTypes.string.isRequired,
	}).isRequired,
	onClick: PropTypes.func,
	organizer: PropTypes.bool,
};
