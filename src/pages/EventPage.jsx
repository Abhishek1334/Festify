import { useParams, Link } from "react-router-dom";
import {
	Calendar,
	Clock,
	MapPin,	
	Share2,
} from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function EventPage() {
	const { eventid } = useParams(); // Get event ID from URL params
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch(`http://localhost:5000/api/events/${eventid}`)
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch event");
				return res.json();
			})
			.then((data) => {
				setEvent(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching event:", err);
				setError(err.message);
				setLoading(false);
			});
	}, [eventid]);

	if (loading) return <p>Loading event...</p>;
	if (error || !event) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<h1 className="text-3xl font-bold text-gray-900">
					Event Not Found
				</h1>
				<p className="text-gray-600 mt-4">
					{error || "Sorry, the event does not exist."}
				</p>
				<Link
					to="/events"
					className="mt-6 inline-block bg-purple-600 text-white px-4 py-2 rounded-md"
				>
					Back to Events
				</Link>
			</div>
		);
	}

	console.log(event.imageUrl);
	
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="bg-white rounded-xl shadow-lg overflow-hidden">
				<div className="relative h-96">
					{/* ✅ Use full URL stored in the database */}
					<img
						src={`http://localhost:5000${event.imageUrl}`}
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
							<span>
								{format(new Date(event.date), "MMMM d, yyyy")}
							</span>
						</div>
						<div className="flex items-center">
							<Clock className="h-5 w-5 mr-2" />
							<span>
								{format(new Date(event.date), "h:mm a")}
							</span>
						</div>
						<div className="flex items-center">
							<MapPin className="h-5 w-5 mr-2" />
							<span>{event.location}</span>
						</div>
					</div>

					<p className="text-gray-600 text-lg mb-8">
						{event.description}
					</p>

					<div className="flex space-x-4">
						<button className="btn-primary">RSVP Now</button>
						<button className="btn-secondary flex items-center">
							<Share2 className="h-5 w-5 mr-2" />
							Share
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
