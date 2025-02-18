import  { useEffect, useState } from 'react';
import eventsData from '../events.json';
import { Link } from 'react-router-dom';

const EventListing = () => {
	const [events, setEvents] = useState([]);

	useEffect(() => {
	
	setEvents(eventsData);
	}, []);

	return (
	<div className="p-6 pt-10 bg-gray-100 ">
		<h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
		{events.map((event, index) => (
			<div
			key={index}
			className="bg-blue-50  shadow-lg rounded-2xl overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out"
			>
			<img
				src={event.image}
				alt={event.title}
				className="w-full h-48 object-cover"
			/>
			<div className="p-4">
				<h3 className="text-xl font-semibold text-blue-900">{event.title}</h3>
				<p className="text-base text-blue-950 mt-2">{event.description}</p>
				<div className="mt-4 flex flex-col gap-1">
					<div className="text-sm text-blu-700">
						<strong>Timing: </strong>{event.timing}
					</div>
					<div className="text-sm text-gray-700">
						<strong>Pricing: </strong>{event.pricing}
					</div>
					<div className="text-sm text-gray-700">
						<strong>Organizer: </strong>{event.organizer}
					</div>
					<div className="text-sm text-gray-700">
						<strong>Location: </strong>{event.location}
					</div>
				</div>
			</div>
			
			</div>
		))}
		</div>
		<div className="flex justify-center mt-6">
        <Link to="/events">
          <button className="bg-gray-200 text-lg text-blue-950 py-2 px-4 rounded-xl hover:bg-blue-800 hover:text-gray-200 ">
            Load More
          </button>
        </Link>
      </div>
	</div>
	);
};

export default EventListing;
