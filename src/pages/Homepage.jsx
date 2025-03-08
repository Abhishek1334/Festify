import Hero from "../components/Homepage/Hero";
import EventListing from "../components/Homepage/EventListing";
import GetStarted from "../components/Homepage/GetStarted";

export default function Homepage() {
	return (
		<div>
			<Hero />

			<EventListing isHomepage={true}/>
			<GetStarted />
		</div>
	);
}
