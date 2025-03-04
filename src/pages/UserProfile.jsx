import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Settings, User } from "lucide-react";
import EventCard from "../components/EventCard";
import { useAuth } from "../components/context/AuthContext";

export default function UserProfile() {
	const { user } = useAuth(); // Get authenticated user data
	const [myEvents, setMyEvents] = useState([]);
	const [myRSVPs, setMyRSVPs] = useState([]);
	const [visibleEvents, setVisibleEvents] = useState(6);

	useEffect(() => {
		if (user) {
			// ✅ Fetch events created by the logged-in user
			fetch(`http://localhost:5000/api/events?organizer=${user._id}`)
				.then((res) => res.json())
				.then((data) => setMyEvents(data))
				.catch((err) => console.error("Error fetching events:", err));

			// ✅ Fetch RSVPs (Events the user has joined)
			fetch(`http://localhost:5000/api/users/${user._id}/rsvps`)
				.then((res) => res.json())
				.then((data) => setMyRSVPs(data))
				.catch((err) => console.error("Error fetching RSVPs:", err));
		}
	}, [user]);

	const showMoreEvents = () => setVisibleEvents((prev) => prev + 6);

	if (!user) {
		return <p className="text-center text-gray-500">Loading...</p>;
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Profile Header */}
			<div className="bg-white rounded-xl shadow-lg p-8 mb-8">
				<div className="flex flex-col md:flex-row items-start md:items-center gap-8">
					{user.avatar ? (
						<img
							src={user.avatar}
							alt={user.name}
							className="w-32 h-32 rounded-full object-cover"
						/>
					) : (
						<div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
							<User className="h-16 w-16 text-gray-500" />
						</div>
					)}
					<div className="flex-1">
						<div className="flex items-center justify-between mb-4">
							<h1 className="text-3xl font-bold text-gray-900">
								{user.name}
							</h1>
							<div className="flex space-x-4">
								<Link
									to="/ManageEvents"
									className="btn-secondary flex items-center"
								>
									<Settings className="h-5 w-5 mr-2" />
									Manage My Events
								</Link>
							</div>
						</div>
						<div className="flex items-center text-gray-600 mb-4">
							<MapPin className="h-5 w-5 mr-2" />
							<span>{user.location || "Location not set"}</span>
						</div>
						<p className="text-gray-600 mb-6">
							{user.bio || "No bio available."}
						</p>
					</div>
				</div>
			</div>

			{/* User's Events */}
			<div className="mb-12">
				<h2 className="text-2xl font-bold text-gray-900 mb-6">
					My Events
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{myEvents.length > 0 ? (
						myEvents
							.slice(0, visibleEvents)
							.map((event) => (
								<EventCard key={event._id} event={event} />
							))
					) : (
						<p className="text-gray-500">No events found.</p>
					)}
				</div>
			</div>

			{/* User's RSVPs */}
			<div>
				<h2 className="text-2xl font-bold text-gray-900 mb-6">
					My RSVPs
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{myRSVPs.length > 0 ? (
						myRSVPs
							.slice(0, visibleEvents)
							.map((event) => (
								<EventCard key={event._id} event={event} />
							))
					) : (
						<p className="text-gray-500">No RSVPs found.</p>
					)}
				</div>
			</div>
		</div>
	);
}
