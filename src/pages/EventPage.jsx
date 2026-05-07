import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Calendar, Clock, MapPin, Users, User, ArrowLeft } from 'lucide-react';
import { fetchEventById } from '../api/events';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Stamp } from '../components/ui/Stamp';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { cloudinaryThumb } from '../lib/cloudinary';

const formatDate = (date) =>
	date
		? new Date(date).toLocaleDateString('en-IN', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric',
		  })
		: '—';

const formatTime = (date) =>
	date
		? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
		: '—';

const computeStatus = (event) => {
	if (!event) return 'upcoming';
	const now = Date.now();
	const start = new Date(event.startTime).getTime();
	const end = new Date(event.endTime).getTime();
	if (now < start) return 'upcoming';
	if (now >= start && now <= end) return 'live';
	return 'expired';
};

export default function EventPage() {
	const { eventid } = useParams();
	const { bookTicket, user } = useAuth();
	const [booking, setBooking] = useState(false);

	const { data: event, isLoading, isError } = useQuery({
		queryKey: ['event', eventid],
		queryFn: () => fetchEventById(eventid, user?.token),
		enabled: !!eventid,
	});

	const status = useMemo(() => computeStatus(event), [event]);
	const ticketsLeft = useMemo(() => {
		if (!event) return null;
		if (typeof event.capacity === 'number' && typeof event.ticketsSold === 'number') {
			return Math.max(0, event.capacity - event.ticketsSold);
		}
		return null;
	}, [event]);

	const isOrganizer = user && event && user.id === event.organizerId?._id;
	const canBook =
		user && event && status === 'upcoming' && !isOrganizer && ticketsLeft !== 0;

	const handleBook = async () => {
		if (!user) {
			toast.error('Log in to book a ticket.');
			return;
		}
		setBooking(true);
		try {
			const res = await bookTicket(event._id);
			if (res?.error) toast.error(res.message || 'Booking failed.');
			else toast.success('Ticket booked. Check your profile.');
		} catch {
			toast.error('Something went wrong. Try again.');
		} finally {
			setBooking(false);
		}
	};

	if (isLoading) {
		return (
			<div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
				<Skeleton variant="image" className="aspect-[16/8] mb-8" />
				<Skeleton lines={5} />
			</div>
		);
	}

	if (isError || !event) {
		return (
			<EmptyState
				title="Event not found"
				description="It may have been removed or the link is wrong."
				art="search"
				action={
					<Link to="/events">
						<Button variant="primary">Back to events</Button>
					</Link>
				}
			/>
		);
	}

	const heroSrc = event.image ? cloudinaryThumb(event.image, 1280, 640) : null;

	return (
		<article className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-12">
			<Link
				to="/events"
				className="inline-flex items-center gap-2 font-sans text-sm font-medium text-muted hover:text-ink mb-6 transition-colors"
			>
				<ArrowLeft className="size-4" /> Back to events
			</Link>

			<div className="relative rounded-[var(--radius-lg)] overflow-hidden bg-paper-dim mb-10">
				{heroSrc ? (
					<img
						src={heroSrc}
						alt={event.title}
						className="w-full h-72 sm:h-[440px] object-cover"
					/>
				) : (
					<div className="w-full h-72 sm:h-[440px] bg-paper-dim" />
				)}
				<div className="absolute top-4 left-4 flex flex-wrap gap-2">
					{event.category && <Stamp label={event.category} variant="info" />}
					{status === 'live' && <Stamp label="Live now" variant="live" dot />}
					{status === 'upcoming' && ticketsLeft !== null && ticketsLeft <= 10 && ticketsLeft > 0 && (
						<Stamp label={`${ticketsLeft} left`} variant="dark" />
					)}
					{ticketsLeft === 0 && <Stamp label="Sold out" variant="warn" />}
					{status === 'expired' && <Stamp label="Ended" variant="warn" />}
				</div>
			</div>

			<div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-10 lg:gap-16 items-start">
				<div>
					<motion.h1
						initial={{ y: 16, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
						className="font-display font-medium leading-[1.04] tracking-tight mb-6"
						style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
					>
						{event.title}
					</motion.h1>
					<p className="font-sans text-lg text-ink/85 leading-[1.65] max-w-2xl whitespace-pre-line">
						{event.description}
					</p>

					<div className="grid sm:grid-cols-2 gap-x-10 gap-y-5 mt-12 border-t border-line pt-10">
						<DetailRow icon={Calendar} label="Date" value={formatDate(event.date)} />
						<DetailRow
							icon={Clock}
							label="Doors"
							value={`${formatTime(event.startTime)} → ${formatTime(event.endTime)}`}
						/>
						<DetailRow icon={MapPin} label="Location" value={event.location || '—'} />
						<DetailRow
							icon={User}
							label="Host"
							value={event.organizerId?.name || event.organizerName || 'Festify'}
						/>
						<DetailRow
							icon={Users}
							label="Capacity"
							value={
								typeof event.capacity === 'number'
									? `${event.ticketsSold || 0} / ${event.capacity}`
									: '—'
							}
						/>
					</div>
				</div>

				<aside className="lg:sticky lg:top-24">
					<div className="bg-paper-card rounded-[var(--radius-lg)] p-6 sm:p-7 shadow-[var(--shadow-card)] border border-line/60">
						<div className="font-sans text-sm font-medium text-accent-deep uppercase tracking-wider mb-4">
							Booking
						</div>
						<div className="flex items-baseline justify-between mb-6">
							<div className="font-display text-4xl font-medium tabular">
								{ticketsLeft === null ? '∞' : ticketsLeft}
							</div>
							<div className="font-sans text-sm text-muted">
								tickets left
							</div>
						</div>

						{isOrganizer ? (
							<Link to={`/organizer/${event._id}`}>
								<Button variant="primary" block>
									Manage event
								</Button>
							</Link>
						) : status === 'expired' ? (
							<Button variant="secondary" block disabled>
								Event ended
							</Button>
						) : status === 'live' ? (
							<Button variant="accent" block disabled>
								In progress
							</Button>
						) : ticketsLeft === 0 ? (
							<Button variant="secondary" block disabled>
								Sold out
							</Button>
						) : !user ? (
							<Link to="/login">
								<Button variant="accent" block>
									Log in to book
								</Button>
							</Link>
						) : (
							<Button
								variant="accent"
								block
								onClick={handleBook}
								disabled={booking || !canBook}
							>
								{booking ? 'Booking…' : 'Get a ticket'}
							</Button>
						)}

						<div className="mt-5 pt-5 border-t border-line flex justify-between font-sans text-sm text-muted">
							<span>Free entry</span>
							<span>QR + RFID check-in</span>
						</div>
					</div>
				</aside>
			</div>
		</article>
	);
}

function DetailRow({ icon: Icon, label, value }) {
	return (
		<div className="flex items-start gap-3">
			<Icon className="size-4 mt-1 text-accent" strokeWidth={1.75} />
			<div>
				<div className="font-sans text-sm font-medium text-muted mb-0.5">{label}</div>
				<div className="font-sans text-base text-ink">{value}</div>
			</div>
		</div>
	);
}
