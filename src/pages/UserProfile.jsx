import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchUserEvents } from "../api/events";

const UserProfile = () => {
	const { user, token } = useContext(AuthContext);
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const getEvents = async () => {
			try {
				if (token) {
					const userEvents = await fetchUserEvents(token);
					setEvents(userEvents);
				}
			} catch (error) {
				console.error("Error fetching user events:", error);
			}
		};
		getEvents();
	}, [token]);

	return (
		<div>
			<h2>User Profile</h2>
			{user ? (
				<>
					<p>Username: {user.name}</p>
					<p>Email: {user.email}</p>
					<h3>My Events</h3>
					<ul>
						{events.map((event) => (
							<li key={event._id}>{event.title}</li>
						))}
					</ul>
				</>
			) : (
				<p>Please log in.</p>
			)}
		</div>
	);
};

export default UserProfile;
