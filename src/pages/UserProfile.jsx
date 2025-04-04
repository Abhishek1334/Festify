import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import TicketCard from "../components/TicketCard";
import axios from "axios";
import { toast,ToastContainer } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL + "/api";
const getCloudinaryImageUrl = (publicId) => {
	if (!publicId) return "https://via.placeholder.com/300x200?text=No+Image";
	publicId = publicId.trim();
	if (publicId.startsWith("https://res.cloudinary.com/")) return publicId;
	if (publicId.startsWith("http")) return publicId;
	return `https://res.cloudinary.com/dmgyx29ou/image/upload/${publicId}`;
};

const UserProfile = () => {
	const { user } = useContext(AuthContext);
	const [myEvents, setMyEvents] = useState([]);
	const [rsvpEvents, setRsvpEvents] = useState([]);
	const [activeTab, setActiveTab] = useState("myEvents");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user || !user.token) return;
		fetchUserEvents();
		fetchRSVPEvents();
	}, [user]);

	const fetchUserEvents = async () => {
		try {
			const response = await axios.get(
				`${API_URL}/events/my-events`,
				{ headers: { Authorization: `Bearer ${user.token}` } }
			);
			setMyEvents(response.data || []);
		} catch (error) {
			console.error("❌ Error fetching user events:", error);
		}
	};

	const fetchRSVPEvents = async () => {
		try {
			const response = await axios.get(`${API_URL}/tickets/my-tickets`, {
				headers: { Authorization: `Bearer ${user.token}` },
			});


			const formattedTickets = response.data
				.map((ticket) => ({
					...ticket,
					event: ticket.eventId
						? {
								...ticket.eventId,
								image: getCloudinaryImageUrl(
									ticket.eventId.image
								),
						}
						: null,
				}))
				.filter((ticket) => ticket.event);

			setRsvpEvents(formattedTickets);
		} catch (error) {
			console.error("❌ Error fetching RSVP events:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCancelTicket = async (ticketId) => {
		if (!user?.token) {
			toast.error("❌ You are not logged in.");
			return;
		}

		// Optimistically remove ticket from state
		setRsvpEvents((prev) =>
			prev.filter((ticket) => ticket._id !== ticketId)
		);

		toast.success("✅ Ticket cancelled successfully!");
	};


	return (
		<div className="max-w-7xl mx-auto py-10 px-5">
			<div>
				<ToastContainer className={"toast-container"} />
			</div>
			<h2 className="text-3xl font-bold mb-4">User Profile</h2>
			<div className="flex justify-between bg-white shadow-md rounded-lg p-6">
				<div>
					<p className="text-lg">
						<strong>Username:</strong> {user?.username || "Guest"}
					</p>
					<p className="text-lg">
						<strong>Email:</strong> {user?.email || "N/A"}
					</p>
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
			<div className="mt-6">
				{loading ? (
					<p className="text-gray-500 text-center">Loading...</p>
				) : activeTab === "myEvents" && myEvents.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{myEvents.map((event) => (
							<EventCard
								key={event._id}
								event={event}
								organizer={true}
							/>
						))}
					</div>
				) : activeTab === "myEvents" ? (
					<p className="text-gray-500 text-center">
						No created events found
					</p>
				) : activeTab === "rsvpEvents" && rsvpEvents.length > 0 ? (
					<div className="bg-white shadow-md rounded-lg p-6">
						<h3 className="text-xl font-semibold mb-4">
							Your RSVP Events
						</h3>
						<ul className="list-disc pl-5 flex flex-row gap-8 flex-wrap">
							{rsvpEvents.map((ticket) => (
								<TicketCard
									key={ticket._id}
									ticket={ticket}
									onCancel={handleCancelTicket}
								/>
							))}
						</ul>
					</div>
				) : (
					<p className="text-gray-500 text-center">
						No RSVP events found
					</p>
				)}
			</div>
		</div>
	);
};

export default UserProfile;
