import EventCard from "../components/EventCard";
import { useEffect, useState } from "react";
import Categories from "../components/Categories";
import { useParams } from "react-router-dom";

export default function Events() {
	const { category } = useParams();
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		const fetchEvents = async () => {
			try {
				let url = "http://localhost:5000/api/events";
				if (category) {
					url = `http://localhost:5000/api/events/category/${category}`;
				}

				const res = await fetch(url);
				const data = await res.json();
				setEvents(data);
			} catch (err) {
				console.error("Error fetching events:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, [category]);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 hidden-section">
			<Categories />
			<h1 className="text-3xl font-bold text-gray-900 mb-8">
				{category ? `${category} Events` : "All Events"}
			</h1>

			{loading ? (
				<p className="text-xl font-light text-gray-900 mb-8">
					Loading...
				</p>
			) : events.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{events.map((event) => (
						<EventCard key={event._id} event={event} />
					))}
				</div>
			) : (
				<p className="text-xl font-light text-gray-900 mb-8">
					No events found
				</p>
			)}
		</div>
	);
}
