import EventCard from "../EventCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEvents, fetchEventsByCategory } from "../../api/events";
import Categories from "../Categories";
import { Link } from "react-router-dom";
export default function Events() {
	const { category } = useParams();
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadEvents = async () => {
			setLoading(true);
			try {
				let data;
				if (category) {
					data = await fetchEventsByCategory(category);
				} else {
					data = await fetchEvents();
				}
				if (Array.isArray(data)) {
					setEvents(data);
				} else {
					console.error("API did not return an array:", data);
					setEvents([]); // Prevent breaking the UI
				}
			} catch (err) {
				console.error("Error fetching events:", err);
			} finally {
				setLoading(false);
			}
		};

		loadEvents();
	}, [category]);

	const displayEvents = events.length > 0 ? events.slice(0, 6) : [];
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 hidden-section">
			<Categories />
			<h1 className="text-3xl font-bold text-gray-900 mb-8">
				{category ? `${category} Events` : "All Events"}
			</h1>

			{loading ? (
				<div className="flex justify-center items-center h-32">
					<div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
				</div>
			) : events.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{displayEvents.map((event) => (
						<EventCard key={event._id} event={event} />
					))}
				</div>
			) : (
				<p className="text-xl font-light text-gray-900 mb-8">
					No events found
				</p>
			)}
			<Link to={"/events"}>
				<button className="btn-primary mx-auto mt-8 grid ">Explore Events</button>
			</Link>
		</div>
	);
}
