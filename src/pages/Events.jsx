import EventCard from "../components/EventCard";
import events from "../events.json";
import Categories from "../components/Categories";
import {useParams} from "react-router-dom";


export default function Events() {

	const Param = useParams();
	


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
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
				{eventsData.map((event) => (
					<EventCard key={event.id} event={event} />
				))}
			</div>
		</div>
	);
}
