import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { MapPin, Calendar } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Stamp } from './ui/Stamp';
import { cloudinaryThumb } from '../lib/cloudinary';

const API_URL = import.meta.env.VITE_API_URL + '/api';

export default function TicketCard({ ticket, onCancel }) {
	const { user } = useContext(AuthContext) || {};
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [cancelling, setCancelling] = useState(false);

	const event = ticket.eventId;
	if (!event) return null;

	const isExpired = event.endTime && dayjs(event.endTime).isBefore(dayjs());
	const isCheckedIn = ticket.checkedIn;

	const handleConfirmCancel = async () => {
		setCancelling(true);
		try {
			const res = await axios.delete(`${API_URL}/tickets/cancel/${ticket._id}`, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			if (res.status === 200 || res.status === 204) {
				toast.success('Ticket cancelled.');
				onCancel?.(ticket._id);
				setConfirmOpen(false);
			} else throw new Error('Unexpected response');
		} catch (err) {
			toast.error(err.response?.data?.message || 'Could not cancel ticket.');
		} finally {
			setCancelling(false);
		}
	};

	return (
		<div className="bg-paper-card rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-card)] border border-line/60">
			<div className="relative aspect-[5/3] bg-paper-dim overflow-hidden">
				{event.image ? (
					<img
						src={cloudinaryThumb(event.image, 720, 432)}
						alt=""
						className="w-full h-full object-cover"
						loading="lazy"
					/>
				) : (
					<div className="w-full h-full grid place-items-center text-muted-soft text-sm">
						No image
					</div>
				)}
				<div className="absolute top-3 left-3">
					{isCheckedIn ? (
						<Stamp label="Checked in" variant="live" dot />
					) : isExpired ? (
						<Stamp label="Expired" variant="warn" />
					) : (
						<Stamp label="Active" variant="success" />
					)}
				</div>
			</div>

			<div className="p-5">
				<h3 className="font-display text-xl font-medium leading-snug tracking-tight mb-3 line-clamp-1">
					{event.title}
				</h3>
				<div className="space-y-1.5 text-sm text-muted">
					{event.date && (
						<div className="flex items-center gap-2">
							<Calendar className="size-3.5 text-accent shrink-0" strokeWidth={1.75} />
							<span>{dayjs(event.date).format('ddd, MMM D')} · {dayjs(event.startTime).format('HH:mm')}</span>
						</div>
					)}
					{event.location && (
						<div className="flex items-center gap-2">
							<MapPin className="size-3.5 text-accent shrink-0" strokeWidth={1.75} />
							<span className="line-clamp-1">{event.location}</span>
						</div>
					)}
				</div>

				{ticket.qrCode && (
					<div className="mt-5 pt-5 border-t border-line flex items-center gap-4">
						<img
							src={ticket.qrCode}
							alt="Ticket QR"
							className="size-20 rounded-md border border-line"
						/>
						<div className="flex-1">
							<div className="font-sans text-xs font-medium text-muted mb-1">Ticket ID</div>
							<div className="font-mono text-xs text-ink break-all">
								{String(ticket._id || '').slice(-12).toUpperCase()}
							</div>
							{ticket.rfid && (
								<div className="font-mono text-xs text-muted mt-1">RFID · {ticket.rfid}</div>
							)}
						</div>
					</div>
				)}

				{!isCheckedIn && !isExpired && (
					<button
						onClick={() => setConfirmOpen(true)}
						className="mt-5 font-sans text-sm font-medium text-stamp hover:underline underline-offset-4"
					>
						Cancel ticket
					</button>
				)}
			</div>

			<Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Cancel ticket?" size="sm">
				<p className="font-sans text-base text-ink mb-1">
					Cancel your ticket to <span className="font-medium">{event.title}</span>?
				</p>
				<p className="font-sans text-sm text-muted mb-7">
					This cannot be undone. Your seat goes back to the pool.
				</p>
				<div className="flex justify-end gap-3">
					<Button variant="secondary" onClick={() => setConfirmOpen(false)}>
						Keep ticket
					</Button>
					<Button variant="stamp" onClick={handleConfirmCancel} disabled={cancelling}>
						{cancelling ? 'Cancelling…' : 'Cancel ticket'}
					</Button>
				</div>
			</Modal>
		</div>
	);
}

TicketCard.propTypes = {
	ticket: PropTypes.object.isRequired,
	onCancel: PropTypes.func,
};
