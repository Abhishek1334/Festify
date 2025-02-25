
import EventListing from '../components/EventCard'
import events from '../events.json'

export default function Events() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 hidden-section">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {events.map(event => (
          <EventListing key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}