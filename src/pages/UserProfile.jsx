import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import EventCard from "../components/EventCard"; // Import EventCard

const UserProfile = () => {
	const { user } = useContext(AuthContext);
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const fetchUserEvents = async () => {
			try {
				const response = await fetch(
					"http://localhost:5000/api/events/my-events",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${user.token}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch events");
				}

				const data = await response.json();
				setEvents(data);
			} catch (error) {
				console.error("Error fetching user events:", error);
			}
		};

		if (user) {
			fetchUserEvents();
		}
	}, [user]);

	return (
		<div className="max-w-4xl mx-auto py-10 px-5">
			<h2 className="text-3xl font-bold mb-4">User Profile</h2>
			<div className="bg-white shadow-md rounded-lg p-6">
				<p className="text-lg">
					<strong>Username:</strong> {user.name}
				</p>
				<p className="text-lg">
					<strong>Email:</strong> {user.email}
				</p>
			</div>

			<h3 className="text-2xl font-semibold mt-6">My Events</h3>

			{events.length > 0 ? (
				<ul>
					{events.map((event) => (
						<li key={event._id} className="mb-4">
							<EventCard event={event} />
						</li>
					))}
				</ul>
			) : (
				<p>No events found</p>
			)}
		</div>
	);
};

export default UserProfile;
