import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Search, CheckCircle2, XCircle, Edit3 } from 'lucide-react';
import QRScanner from '../components/QRScanner';
import { Button } from '../components/ui/Button';
import { Stamp } from '../components/ui/Stamp';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { NumberTicker } from '../components/ui/NumberTicker';
import { cloudinaryThumb } from '../lib/cloudinary';

const API_URL = import.meta.env.VITE_API_URL + '/api';

const RFID_REGEX = /^[A-Z0-9]{2}\s[A-Z0-9]{2}\s[A-Z0-9]{2}\s[A-Z0-9]{2}$/;
const validateRFID = (s) => RFID_REGEX.test(s);

const fetchEvent = (id, token) =>
	axios.get(`${API_URL}/events/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data);

const fetchTickets = (id, token) =>
	axios.get(`${API_URL}/tickets/event/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data);

export default function TicketCheckIn() {
	const { eventId } = useParams();
	const stored = JSON.parse(localStorage.getItem('user') || '{}');
	const token = stored.token;
	const qc = useQueryClient();

	const [ticketId, setTicketId] = useState('');
	const [rfidModalTicket, setRfidModalTicket] = useState(null);
	const [rfidInput, setRfidInput] = useState('');
	const [rfidUpdating, setRfidUpdating] = useState(false);
	const [filterVerified, setFilterVerified] = useState(false);

	const eventQ = useQuery({
		queryKey: ['event', eventId],
		queryFn: () => fetchEvent(eventId, token),
		enabled: !!eventId && !!token,
	});

	const ticketsQ = useQuery({
		queryKey: ['tickets', eventId],
		queryFn: () => fetchTickets(eventId, token),
		enabled: !!eventId && !!token,
	});

	const event = eventQ.data;
	const tickets = ticketsQ.data || [];

	const stats = useMemo(() => {
		const total = tickets.length;
		const checked = tickets.filter((t) => t.checkedIn).length;
		return { total, checked, pct: total > 0 ? Math.round((checked / total) * 100) : 0 };
	}, [tickets]);

	const filteredTickets = useMemo(
		() => (filterVerified ? tickets.filter((t) => t.checkedIn) : tickets),
		[tickets, filterVerified]
	);

	const status = useMemo(() => {
		if (!event) return null;
		const now = dayjs();
		if (now.isBefore(dayjs(event.startTime))) return 'upcoming';
		if (now.isBefore(dayjs(event.endTime))) return 'live';
		return 'ended';
	}, [event]);

	const handleVerify = async (e) => {
		e.preventDefault();
		if (!ticketId.trim()) {
			toast.warn('Enter a ticket ID.');
			return;
		}
		try {
			const res = await axios.post(
				`${API_URL}/tickets/verify`,
				{ ticketId: ticketId.trim(), eventId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (res.data.status === 'already_verified') toast.info('Already verified.');
			else toast.success('Ticket verified.');
			setTicketId('');
			qc.invalidateQueries({ queryKey: ['tickets', eventId] });
		} catch (err) {
			toast.error(err.response?.data?.message || 'Verification failed.');
		}
	};

	const openRfidModal = (ticket) => {
		setRfidModalTicket(ticket);
		setRfidInput(ticket.rfid || '');
	};

	const handleRfidSave = async () => {
		if (!rfidModalTicket) return;
		if (!validateRFID(rfidInput)) {
			toast.error('Format must be SS 5S E9 55');
			return;
		}
		setRfidUpdating(true);
		try {
			await axios.put(
				`${API_URL}/tickets/update/${rfidModalTicket._id}`,
				{ rfid: rfidInput },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success('RFID updated.');
			setRfidModalTicket(null);
			setRfidInput('');
			qc.invalidateQueries({ queryKey: ['tickets', eventId] });
		} catch (err) {
			toast.error(err.response?.data?.message || 'Update failed.');
		} finally {
			setRfidUpdating(false);
		}
	};

	if (eventQ.isLoading) {
		return (
			<div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-12">
				<Skeleton variant="image" className="aspect-[16/8] mb-8" />
				<Skeleton lines={4} />
			</div>
		);
	}

	if (!event) {
		return (
			<EmptyState
				title="Event not found"
				description="Try the organizer panel."
				art="search"
				action={
					<Link to="/user-profile">
						<Button variant="primary">Back</Button>
					</Link>
				}
			/>
		);
	}

	return (
		<div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
			<Link
				to={`/organizer/${eventId}`}
				className="inline-flex items-center gap-2 font-sans text-sm font-medium text-muted hover:text-ink mb-6 transition-colors"
			>
				<ArrowLeft className="size-4" /> Back to event
			</Link>

			<div className="font-sans text-sm font-medium text-accent-deep uppercase tracking-wider mb-3">
				Check-in station
			</div>

			<EventHeader event={event} status={status} />

			{/* Stats */}
			<div className="grid grid-cols-3 gap-6 sm:gap-8 mt-10 mb-12 py-10 border-y border-line">
				<Stat label="Tickets sold" value={stats.total} />
				<Stat label="Checked in" value={stats.checked} />
				<Stat label="Floor rate" value={stats.pct} suffix="%" />
			</div>

			<div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] gap-10">
				<section>
					<div className="font-sans text-sm font-medium text-muted mb-4">Manual verify</div>
					<form onSubmit={handleVerify} className="flex gap-3 mb-10 items-end">
						<div className="flex-1">
							<Input
								name="ticket"
								placeholder="Paste a ticket ID"
								value={ticketId}
								onChange={(e) => setTicketId(e.target.value)}
							/>
						</div>
						<Button type="submit" variant="primary">
							<Search className="size-4" /> Verify
						</Button>
					</form>

					<div className="flex items-center justify-between mb-5">
						<div className="font-sans text-sm font-medium text-muted">Ticket roll</div>
						<button
							onClick={() => setFilterVerified((v) => !v)}
							className="font-sans text-sm font-medium text-ink hover:text-accent-deep"
						>
							{filterVerified ? 'Show all' : 'Show checked-in only'}
						</button>
					</div>

					{ticketsQ.isLoading && (
						<div className="space-y-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} className="h-14 rounded-[var(--radius)]" />
							))}
						</div>
					)}

					{!ticketsQ.isLoading && filteredTickets.length === 0 && (
						<EmptyState title="No tickets yet" description="" art="tickets" />
					)}

					{!ticketsQ.isLoading && filteredTickets.length > 0 && (
						<div className="space-y-2">
							{filteredTickets.map((ticket) => (
								<TicketRow key={ticket._id} ticket={ticket} onEditRfid={openRfidModal} />
							))}
						</div>
					)}
				</section>

				<aside className="lg:sticky lg:top-24 self-start space-y-4">
					<QRScanner
						eventId={event._id}
						onScanSuccess={() => qc.invalidateQueries({ queryKey: ['tickets', eventId] })}
					/>
					<div className="bg-paper-dim/60 rounded-[var(--radius-lg)] p-5 border border-line/60">
						<div className="font-sans text-sm font-medium text-muted mb-3">How to use</div>
						<ol className="font-sans text-sm text-ink/85 space-y-2 list-decimal list-inside">
							<li>Press start, allow camera access.</li>
							<li>Aim the camera at the attendee's QR code.</li>
							<li>Wait for the green confirmation.</li>
						</ol>
					</div>
				</aside>
			</div>

			<Modal
				open={!!rfidModalTicket}
				onClose={() => setRfidModalTicket(null)}
				title="Assign RFID"
				size="sm"
			>
				<p className="font-sans text-sm text-muted mb-5">
					Format: <span className="font-mono text-ink">SS 5S E9 55</span> (uppercase + spaces)
				</p>
				<Input
					label="RFID tag"
					value={rfidInput}
					onChange={(e) => setRfidInput(e.target.value.toUpperCase())}
					placeholder="SS 5S E9 55"
					error={rfidInput && !validateRFID(rfidInput) ? 'Wrong format' : null}
				/>
				<div className="flex justify-end gap-3 mt-6">
					<Button variant="secondary" onClick={() => setRfidModalTicket(null)}>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={handleRfidSave}
						disabled={rfidUpdating || !validateRFID(rfidInput)}
					>
						{rfidUpdating ? 'Saving…' : 'Save RFID'}
					</Button>
				</div>
			</Modal>
		</div>
	);
}

function EventHeader({ event, status }) {
	return (
		<div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-8 items-start">
			<div>
				<h1
					className="font-display font-medium leading-[1.02] tracking-tight"
					style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
				>
					{event.title}.
				</h1>
				<div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-7 max-w-md">
					<DetailMini icon={Calendar} value={dayjs(event.date).format('MMM D, YYYY')} />
					<DetailMini icon={MapPin} value={event.location} />
					<DetailMini icon={Clock} value={`${dayjs(event.startTime).format('HH:mm')} → ${dayjs(event.endTime).format('HH:mm')}`} />
					<DetailMini icon={Users} value={`${event.ticketsSold || 0}/${event.capacity}`} />
				</div>
			</div>
			<div className="space-y-3">
				{event.image && (
					<div className="rounded-[var(--radius-lg)] overflow-hidden border border-line/60">
						<img src={cloudinaryThumb(event.image, 800, 360)} alt="" className="w-full h-44 object-cover" />
					</div>
				)}
				<div className="flex flex-wrap gap-2">
					{status === 'live' && <Stamp label="Live now" variant="live" dot />}
					{status === 'upcoming' && <Stamp label="Upcoming" variant="info" />}
					{status === 'ended' && <Stamp label="Ended" variant="warn" />}
				</div>
			</div>
		</div>
	);
}

function DetailMini({ icon: Icon, value }) {
	return (
		<div className="flex items-center gap-2.5 font-sans text-sm text-ink/80">
			<Icon className="size-4 text-accent shrink-0" strokeWidth={1.75} />
			<span className="truncate">{value}</span>
		</div>
	);
}

function Stat({ label, value, suffix }) {
	return (
		<div>
			<div
				className="font-display font-medium tabular text-ink leading-none tracking-tight"
				style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
			>
				<NumberTicker value={value} suffix={suffix || ''} />
			</div>
			<div className="mt-3 font-sans text-sm text-muted">{label}</div>
		</div>
	);
}

function TicketRow({ ticket, onEditRfid }) {
	return (
		<div className="grid grid-cols-[1fr_auto] items-center gap-4 py-3 px-4 bg-paper-card rounded-[var(--radius)] border border-line/60 hover:border-line">
			<div className="min-w-0">
				<div className="font-mono text-sm text-ink truncate">
					{String(ticket._id).slice(-12).toUpperCase()}
				</div>
				<div className="font-sans text-xs text-muted">
					RFID · {ticket.rfid || '—'}
				</div>
			</div>
			<div className="flex items-center gap-3">
				{ticket.checkedIn ? (
					<span className="inline-flex items-center gap-1.5 font-sans text-sm text-accent-deep">
						<CheckCircle2 className="size-4" /> In
					</span>
				) : (
					<span className="inline-flex items-center gap-1.5 font-sans text-sm text-muted">
						<XCircle className="size-4" /> Out
					</span>
				)}
				<button
					onClick={() => onEditRfid(ticket)}
					aria-label="Edit RFID"
					className="size-9 grid place-items-center rounded-full hover:bg-paper-dim text-muted hover:text-ink transition-colors"
				>
					<Edit3 className="size-3.5" />
				</button>
			</div>
		</div>
	);
}
