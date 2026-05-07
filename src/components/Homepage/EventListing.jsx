import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { fetchEvents } from '../../api/events';
import EventCard from '../EventCard';
import { Skeleton } from '../ui/Skeleton';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export default function EventListing({ isHomepage }) {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['events', 'list'],
		queryFn: () => fetchEvents(),
	});

	const events = Array.isArray(data) ? data : [];
	const upcoming = events
		.filter((e) => !e.endTime || new Date(e.endTime).getTime() > Date.now())
		.sort((a, b) => new Date(a.startTime || a.date) - new Date(b.startTime || b.date));

	const visible = isHomepage ? upcoming.slice(0, 6) : upcoming;

	return (
		<section className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-20">
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
				<div>
					<div className="font-sans text-sm font-medium text-accent-deep uppercase tracking-wider mb-3">
						This week
					</div>
					<h2
						className="font-display font-medium leading-[1.05] tracking-tight"
						style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
					>
						What's on, near you.
					</h2>
				</div>
				{isHomepage && (
					<Link to="/events">
						<Button variant="ghost" size="md">
							See all events →
						</Button>
					</Link>
				)}
			</div>

			{isLoading && (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="space-y-4">
							<Skeleton variant="image" />
							<Skeleton lines={2} />
						</div>
					))}
				</div>
			)}

			{isError && !isLoading && (
				<EmptyState
					title="Couldn't load events"
					description="Try refreshing in a moment."
					art="search"
				/>
			)}

			{!isLoading && !isError && visible.length === 0 && (
				<EmptyState
					title="A quiet week"
					description="No upcoming events yet. Check back soon — or host one yourself."
					art="events"
					action={
						<Link to="/events/create-event">
							<Button variant="primary">Host an event</Button>
						</Link>
					}
				/>
			)}

			{!isLoading && visible.length > 0 && (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
					{visible.map((event, i) => (
						<EventCard key={event._id} event={event} index={i} />
					))}
				</div>
			)}
		</section>
	);
}

EventListing.propTypes = {
	isHomepage: PropTypes.bool,
};
