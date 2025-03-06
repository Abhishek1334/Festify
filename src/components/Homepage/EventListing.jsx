import { Link } from "react-router-dom";
import EventCard from "../EventCard";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const EventListing = ({ isHomepage }) => {
	const [events, setEvents] = useState([]);

	useEffect(() => {
		fetch("http://localhost:5000/api/events")
			.then((res) => res.json())
			.then((data) => setEvents(data))
			.catch((err) => console.error("Error fetching events:", err));
	}, []);

	const featuredEvents = events.slice(0, 3);
	const eventList = isHomepage ? featuredEvents : events;

	return (
		<section className="hidden-section py-8 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						{isHomepage ? "Featured Events" : "All Events"}
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						{isHomepage
							? "Discover the most exciting upcoming events happening near you."
							: "Explore all events happening in your area."}
					</p>
				</div>

				{eventList.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{eventList.map((event) => (
							<EventCard key={event._id} event={event} />
						))}
					</div>
				) : (
					<p className="text-center text-gray-600">
						No events found.
					</p>
				)}

				{isHomepage && (
					<Link
						to="/events"
						className="flex justify-center text-center mt-12"
					>
						<button className="btn-primary">View All Events</button>
					</Link>
				)}
			</div>
		</section>
	);
};

EventListing.propTypes = {
	isHomepage: PropTypes.bool,
};

export default EventListing;
