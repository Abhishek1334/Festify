import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import EventCard from "../components/EventCard";

const OrganizerPanel = () => {
	const { user } = useContext(AuthContext);
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const fetchOrganizerEvents = async () => {
			try {
				const response = await fetch(
					"http://localhost:5000/api/events/my-events",
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${user.token}`,
						},
					}
				);

				if (!response.ok) throw new Error("Failed to fetch events");

				const data = await response.json();
				setEvents(data);
			} catch (error) {
				console.error("Error fetching organizer events:", error);
			}
		};

		if (user) fetchOrganizerEvents();
	}, [user]);

	return (
		<div className="max-w-7xl mx-auto py-10 px-6 sm:px-8">
			{/* Header */}
			<h2 className="text-4xl font-bold text-gray-800 mb-6">
				Organizer Panel
			</h2>

			{/* Organizer Info */}
			<div className="bg-white shadow-lg rounded-lg p-6 mb-8 flex items-center justify-between space-x-4">
				<div>
					<p className="text-xl font-semibold text-gray-800">
						<strong>Organizer Name:</strong> {user.name}
					</p>
					<p className="text-lg text-gray-600 mt-2">
						<strong>Number of Events:</strong> {events.length}
					</p>
				</div>
				{/* Organizer Image or Icon */}
				<div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
					{/* Placeholder for Profile Picture */}
					<span className="text-2xl font-semibold text-gray-700">
						{user.name[0]}
					</span>
				</div>
			</div>

			{/* My Events Section */}
			<h3 className="text-3xl font-semibold text-gray-800 mb-4">
				My Created Events
			</h3>

			{/* Event Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{events.length > 0 ? (
					events.map((event) => (
						<EventCard
							organizer={true}
							key={event._id}
							event={event}
						/>
					))
				) : (
					<p className="col-span-full text-center text-lg text-gray-500">
						No events found
					</p>
				)}
			</div>
		</div>
	);
};

export default OrganizerPanel;
