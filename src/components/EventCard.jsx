import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Stamp } from './ui/Stamp';
import { cloudinaryThumb } from '../lib/cloudinary';
import { cn } from '../lib/cn';

const formatDateLine = (date, startTime) => {
	if (!date) return null;
	try {
		const d = new Date(date);
		const t = startTime ? new Date(startTime) : null;
		const dateStr = format(d, 'EEE, MMM d');
		const timeStr = t
			? t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
			: '';
		return timeStr ? `${dateStr} · ${timeStr}` : dateStr;
	} catch {
		return null;
	}
};

const getStatus = (event) => {
	const now = Date.now();
	const start = event?.startTime ? new Date(event.startTime).getTime() : null;
	const end = event?.endTime ? new Date(event.endTime).getTime() : null;
	if (!start || !end) return 'upcoming';
	if (now < start) return 'upcoming';
	if (now >= start && now <= end) return 'live';
	return 'expired';
};

export default function EventCard({ event, organizer, index = 0 }) {
	const status = getStatus(event);
	const ticketsLeft =
		typeof event.ticketsSold === 'number' && typeof event.capacity === 'number'
			? event.capacity - event.ticketsSold
			: null;
	const dateLine = formatDateLine(event.date, event.startTime);
	const to = organizer ? `/organizer/${event._id}` : `/events/${event._id}`;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-40px' }}
			transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
			whileHover={{ y: -4 }}
			className="group"
		>
			<Link
				to={to}
				className={cn(
					'block bg-paper-card rounded-[var(--radius-lg)] overflow-hidden',
					'shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]',
					'transition-shadow border border-line/60'
				)}
			>
				<div className="relative aspect-[5/3] overflow-hidden bg-paper-dim">
					{event.image ? (
						<img
							src={cloudinaryThumb(event.image, 720, 432)}
							alt={event.title}
							loading="lazy"
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
						/>
					) : (
						<div className="w-full h-full grid place-items-center text-muted-soft text-sm">
							No image
						</div>
					)}
					<div className="absolute top-3 left-3 flex gap-2">
						{status === 'live' && <Stamp label="Live now" variant="live" dot size="sm" />}
						{status === 'expired' && <Stamp label="Ended" variant="warn" size="sm" />}
						{ticketsLeft === 0 && status !== 'expired' && (
							<Stamp label="Sold out" variant="warn" size="sm" />
						)}
						{status === 'upcoming' &&
							ticketsLeft !== null &&
							ticketsLeft > 0 &&
							ticketsLeft <= 10 && (
								<Stamp label={`${ticketsLeft} left`} variant="dark" size="sm" />
							)}
					</div>
					{event.category && (
						<div className="absolute top-3 right-3">
							<Stamp label={event.category} variant="info" size="sm" />
						</div>
					)}
				</div>

				<div className="p-5 sm:p-6">
					{dateLine && (
						<div className="font-sans text-sm font-medium text-accent-deep mb-2">
							{dateLine}
						</div>
					)}
					<h3 className="font-display text-xl sm:text-2xl font-medium text-ink leading-snug line-clamp-2 mb-2 tracking-tight">
						{event.title}
					</h3>
					{event.location && (
						<div className="flex items-center gap-1.5 text-muted text-sm">
							<MapPin className="size-3.5 shrink-0" strokeWidth={1.75} />
							<span className="line-clamp-1">{event.location}</span>
						</div>
					)}
				</div>
			</Link>
		</motion.div>
	);
}

EventCard.propTypes = {
	event: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		image: PropTypes.string,
		date: PropTypes.string,
		startTime: PropTypes.string,
		endTime: PropTypes.string,
		location: PropTypes.string,
		capacity: PropTypes.number,
		ticketsSold: PropTypes.number,
		category: PropTypes.string,
	}).isRequired,
	organizer: PropTypes.bool,
	index: PropTypes.number,
};
