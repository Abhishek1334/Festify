import { Link } from "react-router-dom";
import EventCard from "../EventCard";
import events from "../../events.json";
import PropTypes from "prop-types";


const featuredEvents = events.slice(0, 3);

const EventListing = ({isHomepage}) => {

	const EventList = (isHomepage) ? featuredEvents : events;

	return (
		<section className=" hidden-section py-8 bg-white ">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						Featured Events
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Discover the most exciting upcoming events happening
						near you
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{EventList.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</div>

				<Link
					to="/events"
					className="flex justify-center text-center mt-12"
				>
					<button className="btn-primary ">View All Events</button>
				</Link>
			</div>
		</section>
	);
};

export default EventListing;

EventListing.propTypes = {
	isHomepage: PropTypes.bool,
};