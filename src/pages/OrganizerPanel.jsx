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
		<div className="max-w-7xl mx-auto py-10 px-5">
			<h2 className="text-3xl font-bold mb-4">Organizer Panel</h2>

			<div className="bg-white shadow-md rounded-lg p-6">
				<p className="text-lg">
					<strong>Organizer Name:</strong> {user.name}
				</p>
				<p className="text-lg">
					<strong>Number of Events:</strong> {events.length}
				</p>
			</div>

			<h3 className="text-2xl font-semibold mt-6">My Created Events</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
				{events.length > 0 ? (
					events.map((event) => (
						<EventCard
							organizer={true}
							key={event._id}
							event={event}
						/>
					))
				) : (
					<p>No events found</p>
				)}
			</div>
		</div>
	);
};

export default OrganizerPanel;
