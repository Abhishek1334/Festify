import EventCard from "../components/EventCard";
import { useEffect, useState } from "react";
import Categories from "../components/Categories";
import {useParams} from "react-router-dom";


export default function Events() {

	const Param = useParams();

	const [events, setEvents] = useState([]);

	useEffect(() => {
		fetch("http://localhost:5000/api/events")
			.then((res) => res.json())
			.then((data) => setEvents(data))
			.catch((err) => console.error("Error fetching events:", err));
	}, []);
	


	const eventsData = (Param && Param.category) ? events.filter(event => event.category === Param.category) : events;
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 hidden-section">
			<Categories />
			{Param.category ? <h1 className="text-3xl font-bold text-gray-900 mb-8">
				{Param.category} Events
			</h1> :
				<h1 className="text-3xl font-bold text-gray-900 mb-8">
				All Events
			</h1>}
			
			{eventsData.length>0 ? 
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
				{eventsData.map((event) => (
					<EventCard key={event._id} event={event} />
				))}
			</div>
			:
			<p className="text-xl font-light text-gray-900 mb-8">No events found </p>}
			
		</div>
	);
}
