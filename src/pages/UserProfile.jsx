import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";
import TicketCard from "../components/TicketCard";

const UserProfile = () => {
	const { user } = useContext(AuthContext);
	const [myEvents, setMyEvents] = useState([]);
	const [rsvpEvents, setRsvpEvents] = useState([]);
	const [activeTab, setActiveTab] = useState("myEvents");

	useEffect(() => {
		if (!user || !user.token) return;

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

				if (!response.ok) throw new Error("Failed to fetch events");

				const data = await response.json();
				setMyEvents(data);
			} catch (error) {
				console.error("Error fetching user events:", error);
			}
		};

		const fetchRSVPEvents = async () => {
			try {
				const response = await fetch(
					"http://localhost:5000/api/tickets/my-tickets",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${user.token}`,
						},
					}
				);

				if (!response.ok)
					throw new Error("Failed to fetch RSVP events");

				const data = await response.json();
				setRsvpEvents(data);
			} catch (error) {
				console.error("Error fetching RSVP events:", error);
			}
		};

		fetchUserEvents();
		fetchRSVPEvents();
	}, [user]);

	// ✅ Define handleCancelTicket function
	const handleCancelTicket = async (ticketId) => {
		if (!user?.token) {
			alert("You are not logged in. Please log in again.");
			return;
		}

		console.log(`🛠️ Canceling ticket: ${ticketId}`);
		console.log("📡 Sending token:", user.token);

		// ✅ Immediately remove ticket from state to prevent UI delay issue
		setRsvpEvents((prev) =>
			prev.filter((ticket) => ticket._id !== ticketId)
		);

		try {
			const response = await fetch(
				`http://localhost:5000/api/tickets/cancel/${ticketId}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			console.log("📡 Response status:", response.status);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData?.message || "Failed to cancel ticket"
				);
			}

			alert("🎟️ Ticket canceled successfully!");
		} catch (error) {
			console.error("🚨 Error canceling ticket:", error);
			alert(error.message);
		}
	};




	return (
		<div className="max-w-7xl mx-auto py-10 px-5">
			<h2 className="text-3xl font-bold mb-4">User Profile</h2>

			<div className="flex justify-between bg-white shadow-md rounded-lg p-6">
				<div>
					<p className="text-lg">
						<strong>Username:</strong> {user?.name || "Guest"}
					</p>
					<p className="text-lg">
						<strong>Email:</strong> {user?.email || "N/A"}
					</p>
				</div>
				<div>
					<Link to="/organizer">
						<button className="btn-secondary">
							Organizer Panel
						</button>
					</Link>
				</div>
			</div>

			<div className="flex gap-10 mt-4 justify-center">
				<h3
					className={`text-2xl font-semibold mt-6 cursor-pointer ${
						activeTab === "myEvents"
							? "text-blue-600"
							: "text-gray-600"
					}`}
					onClick={() => setActiveTab("myEvents")}
				>
					My Events
				</h3>
				<h3
					className={`text-2xl font-semibold mt-6 cursor-pointer ${
						activeTab === "rsvpEvents"
							? "text-blue-600"
							: "text-gray-600"
					}`}
					onClick={() => setActiveTab("rsvpEvents")}
				>
					RSVP Events
				</h3>
			</div>

			<div className="mt-6 ">
				{activeTab === "myEvents" && myEvents.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{myEvents.map((event) => (
							<EventCard key={event._id} event={event} />
						))}
					</div>
				) : activeTab === "rsvpEvents" && rsvpEvents.length > 0 ? (
					<div className="bg-white shadow-md rounded-lg p-6 ">
						<h3 className="text-xl font-semibold mb-4">
							Your RSVP Events
						</h3>
						<ul className="list-disc pl-5 flex gap-8  flex-wrap">
							{rsvpEvents.map((ticket) => (
								<TicketCard
									key={ticket._id}
									ticket={ticket}
									onCancel={handleCancelTicket} // ✅ Passing handleCancelTicket correctly
								/>
							))}
						</ul>
					</div>
				) : (
					<p className="text-gray-500 text-center">
						{activeTab === "myEvents"
							? "No created events found"
							: "No RSVP events found"}
					</p>
				)}
			</div>
		</div>
	);
};

export default UserProfile;
