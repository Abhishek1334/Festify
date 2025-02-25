import Hero from '../components/Homepage/Hero';
import Categories from '../components/Homepage/Categories';
import EventListing from '../components/Homepage/EventListing';
import GetStarted from '../components/Homepage/GetStarted';


export default function Homepage() {
  return (
    <div>
      <Hero />
      <Categories />
      <EventListing  />
      <GetStarted />
    </div>
  );
}