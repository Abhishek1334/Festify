import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Settings, User } from "lucide-react";
import EventCard from "../components/EventCard";
import eventsData from "../events.json"; // Import event data
import { div } from "framer-motion/client";

export default function UserProfile() {
	const user = {
		id: 1,
		name: "John Doe",
		avatar: "", // Empty or null avatar will show default user icon
		location: "New York, USA",
		bio: "I am a passionate event organizer.",
		following: 42,
		followers: 100,
	};

	// Filter events where the organizer matches the user's name
	const myEvents = [...new Set(eventsData.filter(event => event.organizer === user.name))];

	// Pagination logic
	const [visibleEvents, setVisibleEvents] = useState(6);

	const showMoreEvents = () => {
		setVisibleEvents(prev => prev + 6);
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Profile Header */}
			<div className="bg-white rounded-xl shadow-lg p-8 mb-8">
				<div className="flex flex-col md:flex-row items-start md:items-center gap-8">
					{user.avatar ? (
						<img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover" />
					) : (
						<div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
							<User className="h-16 w-16 text-gray-500" />
						</div>
					)}
					<div className="flex-1">
						<div className="flex items-center justify-between mb-4">
							<h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
							<div className="flex space-x-4">
								<Link to="/ManageEvents" className="btn-secondary flex items-center">
									<Settings className="h-5 w-5 mr-2" />
									Manage My Events
								</Link>
							</div>
						</div>
						<div className="flex items-center text-gray-600 mb-4">
							<MapPin className="h-5 w-5 mr-2" />
							<span>{user.location}</span>
						</div>
						<p className="text-gray-600 mb-6">{user.bio}</p>
						<div className="flex space-x-8">
							<div className="text-gray-600">
								<span className="font-semibold text-gray-900">{user.following}</span> Following
							</div>
							<div className="text-gray-600">
								<span className="font-semibold text-gray-900">{user.followers}</span> Followers
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* User's Events */}
			<div className="mb-12">
				<h2 className="text-2xl font-bold text-gray-900 mb-6">My Events</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{myEvents.length > 0 ? (
						myEvents.slice(0, visibleEvents).map(event => <EventCard key={event.id} event={event} />)
					) : (
						<p className="text-gray-500">No events found.</p>
					)}
				</div>
				{/* Show More Button */}
				{myEvents.length > visibleEvents && (
					<div className="flex justify-center">
					<button
						onClick={showMoreEvents}
						className="mt-6  btn-primary "
					>
						Show More
					</button>
					</div>
				)}
			</div>

			{/* User's RSVPs */}
			<div>
				<h2 className="text-2xl font-bold text-gray-900 mb-6">My RSVPs</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{myEvents.length > 0 ? (
						myEvents.slice(0, visibleEvents).map(event => <EventCard key={event.id} event={event} />)
					) : (
						<p className="text-gray-500">No RSVPs found.</p>
					)}
				</div>
				{/* Show More Button for RSVPs */}
				{myEvents.length > visibleEvents && (
					<button
						onClick={showMoreEvents}
						className="mt-6 px-6 py-3 btn-primary align-center"
					>
						Show More
					</button>
				)}
			</div>
		</div>
	);
}
