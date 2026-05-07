import Hero from '../components/Homepage/Hero';
import EventListing from '../components/Homepage/EventListing';
import HowItWorks from '../components/Homepage/HowItWorks';
import Stats from '../components/Homepage/Stats';

export default function Homepage() {
	return (
		<div>
			<Hero />
			<EventListing isHomepage />
			<HowItWorks />
			<Stats />
		</div>
	);
}
