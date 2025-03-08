import EventCard from "../components/EventCard";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Categories from "../components/Categories";

export default function Events() {
	const { category } = useParams();
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const loadEvents = async () => {
			setLoading(true);
			try {
				// Construct query params dynamically
				const queryString = new URLSearchParams();
				if (category) queryString.append("category", category);
				searchParams.forEach((value, key) => {
					queryString.append(key, value);
				});

				const response = await fetch(
					"http://localhost:5000/api/events",
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				);


				const data = await response.json();
				if (Array.isArray(data)) {
					setEvents(data);
				} else {
					console.error("API did not return an array:", data);
					setEvents([]); // Prevent errors
				}
			} catch (err) {
				console.error("Error fetching events:", err);
			} finally {
				setLoading(false);
			}
		};

		loadEvents();
	}, [category, searchParams]);

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
