import { useContext, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import TicketCard from '../components/TicketCard';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Stamp } from '../components/ui/Stamp';
import { cn } from '../lib/cn';

const API_URL = import.meta.env.VITE_API_URL + '/api';

const fetchMyEvents = (token) =>
	axios
		.get(`${API_URL}/events/my-events`, { headers: { Authorization: `Bearer ${token}` } })
		.then((r) => r.data || []);

const fetchMyTickets = (token) =>
	axios
		.get(`${API_URL}/tickets/my-tickets`, { headers: { Authorization: `Bearer ${token}` } })
		.then((r) => r.data || []);

export default function UserProfile() {
	const { user } = useContext(AuthContext);
	const [tab, setTab] = useState('tickets');
	const [removedTickets, setRemovedTickets] = useState(new Set());

	const myEventsQ = useQuery({
		queryKey: ['my-events', user?.id],
		queryFn: () => fetchMyEvents(user.token),
		enabled: !!user?.token,
	});

	const myTicketsQ = useQuery({
		queryKey: ['my-tickets', user?.id],
		queryFn: () => fetchMyTickets(user.token),
		enabled: !!user?.token,
	});

	const tickets = useMemo(
		() => (myTicketsQ.data || []).filter((t) => t.eventId && !removedTickets.has(t._id)),
		[myTicketsQ.data, removedTickets]
	);
	const events = myEventsQ.data || [];

	const handleCancelLocal = (id) => {
		setRemovedTickets((prev) => new Set([...prev, id]));
	};

	if (!user) return null;

	return (
		<div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
			<div className="font-sans text-sm font-medium text-accent-deep uppercase tracking-wider mb-3">
				Your profile
			</div>
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12 pb-10 border-b border-line">
				<div>
					<h1
						className="font-display font-medium leading-[1.02] tracking-tight"
						style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
					>
						Hey, {user.username || 'friend'}.
					</h1>
					<p className="mt-3 font-sans text-base text-muted">{user.email}</p>
				</div>
				<Stamp
					label={user.role === 'admin' ? 'Admin' : user.role === 'organizer' ? 'Organizer' : 'Member'}
					variant={user.role === 'admin' ? 'dark' : 'success'}
				/>
			</div>

			<div className="flex items-center gap-2 mb-8 flex-wrap">
				{[
					{ id: 'tickets', label: 'My tickets', count: tickets.length },
					{ id: 'events', label: 'My events', count: events.length },
				].map(({ id, label, count }) => {
					const active = tab === id;
					return (
						<button
							key={id}
							onClick={() => setTab(id)}
							className={cn(
								'px-5 py-2.5 rounded-full font-sans text-[15px] font-medium border transition-colors flex items-center gap-2',
								active
									? 'bg-ink text-paper border-ink'
									: 'bg-paper-card text-ink border-line hover:border-ink hover:bg-paper-dim'
							)}
						>
							{label}
							<span className={cn('text-sm', active ? 'text-paper/60' : 'text-muted')}>
								{count}
							</span>
						</button>
					);
				})}
			</div>

			{tab === 'tickets' && (
				<section>
					{myTicketsQ.isLoading && (
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 3 }).map((_, i) => (
								<Skeleton key={i} variant="card" className="h-72" />
							))}
						</div>
					)}

					{!myTicketsQ.isLoading && tickets.length === 0 && (
						<EmptyState
							title="No tickets yet"
							description="Browse events and book one. Your tickets show up here."
							art="tickets"
							action={
								<Link to="/events">
									<Button variant="primary">Browse events</Button>
								</Link>
							}
						/>
					)}

					{tickets.length > 0 && (
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{tickets.map((ticket) => (
								<TicketCard
									key={ticket._id}
									ticket={ticket}
									onCancel={handleCancelLocal}
								/>
							))}
						</div>
					)}
				</section>
			)}

			{tab === 'events' && (
				<section>
					{myEventsQ.isLoading && (
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="space-y-3">
									<Skeleton variant="image" />
									<Skeleton lines={2} />
								</div>
							))}
						</div>
					)}

					{!myEventsQ.isLoading && events.length === 0 && (
						<EmptyState
							title="You haven't hosted yet"
							description="Create your first event in under a minute."
							art="events"
							action={
								<Link to="/events/create-event">
									<Button variant="primary">Host an event</Button>
								</Link>
							}
						/>
					)}

					{events.length > 0 && (
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{events.map((event, i) => (
								<EventCard key={event._id} event={event} index={i} organizer />
							))}
						</div>
					)}
				</section>
			)}
		</div>
	);
}
