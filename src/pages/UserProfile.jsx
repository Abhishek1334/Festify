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
		<div className="max-w-7xl mx-auto py-10 px-5">
			<h2 className="text-3xl font-bold mb-4">User Profile</h2>
			<div className="bg-white shadow-md rounded-lg p-6">
				<p className="text-lg">
					<strong>Username:</strong> {user.name}
				</p>
				<p className="text-lg">
					<strong>Email:</strong> {user.email}
				</p>
			</div>
			<div className="flex gap-10 mt-4 justify-center">
				<h3 className="text-2xl font-semibold mt-6 cursor-pointer {}">My Events</h3>
				<h3 className="text-2xl font-semibold mt-6 cursor-pointer">RSVP Events</h3>
			</div>
			<div className="flex justify-center mt-4  mx-auto">
				{events.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
									{events.map((event) => (
										
										<EventCard key={event._id} event={event} />
									))}
									
								</div>
				) : (
					<p>No events found</p>
				)}
			</div>
		</div>
	);
};

export default UserProfile;
