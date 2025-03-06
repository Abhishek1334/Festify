import {  useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Share2 } from "lucide-react";
import { format } from "date-fns";

import { fetchEventById } from "../api/events"; 
import { Link } from "react-router-dom";
const EventPage = () => {
	
	const id = useParams().eventid;
	console.log(id)
	const [event, setEvent] = useState(null);

	useEffect(() => {
		fetchEventById(id).then(setEvent);
	}, [id]);

	if (!event) return (
		<div className="flex flex-col space-y-5 w-full   h-[60vh] items-center justify-center bg-gray-200">
			<p className="text-xl text-semibold">Event not found</p>
			<Link to="/events">
				<button className="btn-secondary">Return to Events</button>
			</Link>
		</div>
	);

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
};

export default EventPage;
