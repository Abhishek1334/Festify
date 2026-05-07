import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { fetchEvents } from '../api/events';
import EventCard from '../components/EventCard';
import Categories from '../components/Categories';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/cn';

const STATUS_OPTIONS = [
	{ value: 'all', label: 'All' },
	{ value: 'live', label: 'Live now' },
	{ value: 'upcoming', label: 'Upcoming' },
	{ value: 'expired', label: 'Past' },
];

const getStatus = (event) => {
	const now = Date.now();
	const start = event?.startTime ? new Date(event.startTime).getTime() : null;
	const end = event?.endTime ? new Date(event.endTime).getTime() : null;
	if (!start || !end) return 'upcoming';
	if (now < start) return 'upcoming';
	if (now >= start && now <= end) return 'live';
	return 'expired';
};

export default function Events() {
	const [searchParams, setSearchParams] = useSearchParams();
	const category = searchParams.get('category') || '';
	const status = searchParams.get('status') || 'all';
	const query = searchParams.get('q') || '';

	const { data, isLoading, isError } = useQuery({
		queryKey: ['events', 'list'],
		queryFn: () => fetchEvents(),
	});

	const events = useMemo(() => {
		const list = Array.isArray(data) ? data : [];
		const q = query.trim().toLowerCase();

		return list
			.filter((e) => {
				if (category && e.category !== category) return false;
				if (status !== 'all' && getStatus(e) !== status) return false;
				if (q) {
					const hay = `${e.title || ''} ${e.location || ''}`.toLowerCase();
					if (!hay.includes(q)) return false;
				}
				return true;
			})
			.sort((a, b) => new Date(a.startTime || a.date) - new Date(b.startTime || b.date));
	}, [data, category, status, query]);

	const updateParam = (key, value) => {
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			if (!value || value === 'all') next.delete(key);
			else next.set(key, value);
			return next;
		});
	};

	const heading = category
		? `${category} events`
		: status !== 'all'
		? `${STATUS_OPTIONS.find((s) => s.value === status)?.label || 'Events'}`
		: 'All events';

	return (
		<div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
			<div className="mb-10 sm:mb-14">
				<div className="font-sans text-sm font-medium text-accent-deep uppercase tracking-wider mb-3">
					Directory
				</div>
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
					<h1
						className="font-display font-medium leading-[1.02] tracking-tight"
						style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
					>
						{heading}.
					</h1>
					<div className="relative w-full sm:w-80">
						<Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
						<input
							type="search"
							value={query}
							onChange={(e) => updateParam('q', e.target.value)}
							placeholder="Search title or location"
							className="w-full pl-11 pr-4 py-3 bg-paper-card border border-line rounded-full font-sans text-[15px] placeholder:text-muted-soft focus:outline-none focus:ring-2 focus:ring-ink/15 focus:border-ink"
						/>
					</div>
				</div>
			</div>

			<div className="space-y-4 mb-10">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="font-sans text-sm font-medium text-muted mr-1">When</span>
					{STATUS_OPTIONS.map((opt) => {
						const active = status === opt.value;
						return (
							<button
								key={opt.value}
								onClick={() => updateParam('status', opt.value)}
								className={cn(
									'px-4 py-2 rounded-full font-sans text-sm font-medium transition-colors border',
									active
										? 'bg-ink text-paper border-ink'
										: 'bg-paper-card text-ink border-line hover:border-ink hover:bg-paper-dim'
								)}
							>
								{opt.label}
							</button>
						);
					})}
				</div>
				<Categories />
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

			{!isLoading && isError && (
				<EmptyState
					title="Couldn't load events"
					description="Try refreshing in a moment."
					art="search"
				/>
			)}

			{!isLoading && !isError && events.length === 0 && (
				<EmptyState
					title="Nothing matches"
					description="Try clearing filters or hosting an event yourself."
					art="search"
					action={
						<Link to="/events/create-event">
							<Button variant="primary">Host an event</Button>
						</Link>
					}
				/>
			)}

			{!isLoading && !isError && events.length > 0 && (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
					{events.map((event, i) => (
						<EventCard key={event._id} event={event} index={i} />
					))}
				</div>
			)}
		</div>
	);
}
