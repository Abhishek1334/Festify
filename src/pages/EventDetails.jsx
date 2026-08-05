import { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { toast } from 'react-toastify';
import { Calendar, MapPin, Users, ScanLine, Edit3, Trash2, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import categories from '../categories.json';
import { Button } from '../components/ui/Button';
import { Stamp } from '../components/ui/Stamp';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { NumberTicker } from '../components/ui/NumberTicker';
import { cloudinaryThumb } from '../lib/cloudinary';

dayjs.extend(utc);
dayjs.extend(timezone);

const API_URL = import.meta.env.VITE_API_URL + '/api';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = 'festify';

const fetchEvent = (id, token) =>
	axios
		.get(`${API_URL}/events/${id}`, { headers: { Authorization: `Bearer ${token}` } })
		.then((r) => r.data);

export default function EventDetails() {
	const { eventId } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { user } = useContext(AuthContext);

	const { data: event, isLoading, isError } = useQuery({
		queryKey: ['event', eventId],
		queryFn: () => fetchEvent(eventId, user?.token),
		enabled: !!eventId && !!user?.token,
	});

	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [edit, setEdit] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		if (event && !edit) {
			setEdit({
				...event,
				date: dayjs(event.date).format('YYYY-MM-DD'),
				startTime: dayjs(event.startTime).format('HH:mm'),
				endTime: dayjs(event.endTime).format('HH:mm'),
			});
			if (event.image) setImagePreview(cloudinaryThumb(event.image, 600, 360));
		}
	}, [event, edit]);

	const status = useMemo(() => {
		if (!event) return null;
		const now = dayjs();
		const start = dayjs(event.startTime);
		const end = dayjs(event.endTime);
		const soldOut = event.ticketsSold >= event.capacity;
		if (now.isBefore(start)) return soldOut ? 'sold-out' : 'upcoming';
		if (now.isAfter(end)) return 'ended';
		return 'live';
	}, [event]);

	const handleChange = useCallback((e) => {
		const { name, value } = e.target;
		setEdit((p) => ({ ...p, [name]: value }));
	}, []);

	const handleImageChange = useCallback(async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setUploading(true);
		try {
			const fd = new FormData();
			fd.append('file', file);
			fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
			const res = await axios.post(
				`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
				fd,
				{ withCredentials: false }
			);
			setImagePreview(cloudinaryThumb(res.data.public_id, 600, 360));
			setEdit((p) => ({ ...p, image: res.data.public_id }));
		} catch {
			toast.error('Image upload failed.');
		} finally {
			setUploading(false);
		}
	}, []);

	const handleSave = useCallback(async () => {
		if (new Date(`${edit.date}T${edit.startTime}`) >= new Date(`${edit.date}T${edit.endTime}`)) {
			toast.error('End time must come after start.');
			return;
		}
		setSaving(true);
		try {
			const startUtc = dayjs(`${edit.date}T${edit.startTime}`).utc().format();
			const endUtc = dayjs(`${edit.date}T${edit.endTime}`).utc().format();
			await axios.put(
				`${API_URL}/events/${eventId}`,
				{ ...edit, startTime: startUtc, endTime: endUtc },
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
						'Content-Type': 'application/json',
					},
				}
			);
			await queryClient.invalidateQueries({ queryKey: ['event', eventId] });
			toast.success('Event saved.');
			setEditOpen(false);
		} catch (err) {
			toast.error(err.response?.data?.message || 'Save failed.');
		} finally {
			setSaving(false);
		}
	}, [edit, eventId, user?.token, queryClient]);

	const handleDelete = useCallback(async () => {
		setDeleting(true);
		try {
			await axios.delete(`${API_URL}/events/${eventId}`, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			toast.success('Event deleted.');
			navigate('/user-profile');
		} catch (err) {
			toast.error(err.response?.data?.message || 'Could not delete.');
		} finally {
			setDeleting(false);
		}
	}, [eventId, user?.token, navigate]);

	if (isLoading || !edit) {
		return (
			<div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-12">
				<Skeleton variant="image" className="aspect-[16/8] mb-8" />
				<Skeleton lines={5} />
			</div>
		);
	}

	if (isError || !event) {
		return (
			<EmptyState
				title="Event not found"
				description="It may have been removed."
				art="search"
				action={
					<Link to="/user-profile">
						<Button variant="primary">Back to profile</Button>
					</Link>
				}
			/>
		);
	}

	const ticketsLeft = Math.max(0, event.capacity - event.ticketsSold);

	return (
		<div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
			<Link
				to="/user-profile"
				className="inline-flex items-center gap-2 font-sans text-sm font-medium text-muted hover:text-ink mb-6 transition-colors"
			>
				<ArrowLeft className="size-4" /> Back to profile
			</Link>

			<div className="font-sans text-sm font-medium text-accent-deep uppercase tracking-wider mb-3">
				Manage event
			</div>

			<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-8 border-b border-line">
				<div>
					<h1
						className="font-display font-medium leading-[1.02] tracking-tight"
						style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
					>
						{event.title}.
					</h1>
					<p className="font-sans text-base text-muted mt-3">
						{event.category} · {dayjs(event.date).format('MMM D, YYYY')}
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					{status === 'live' && <Stamp label="Live now" variant="live" dot size="lg" />}
					{status === 'upcoming' && <Stamp label="Upcoming" variant="info" size="lg" />}
					{status === 'sold-out' && <Stamp label="Sold out" variant="warn" size="lg" />}
					{status === 'ended' && <Stamp label="Ended" variant="warn" size="lg" />}
				</div>
			</div>

			{event.image && (
				<div className="rounded-[var(--radius-lg)] overflow-hidden mb-10 border border-line/60">
					<img src={cloudinaryThumb(event.image, 1280, 540)} alt={event.title} className="w-full h-72 object-cover" />
				</div>
			)}

			{/* Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-10 pb-10 border-b border-line">
				<Stat label="Tickets sold" value={event.ticketsSold || 0} hint={`/ ${event.capacity}`} />
				<Stat label="Tickets left" value={ticketsLeft} />
				<Stat
					label="Fill rate"
					value={Math.round(((event.ticketsSold || 0) / Math.max(1, event.capacity)) * 100)}
					suffix="%"
				/>
				<Stat label="Days to go" value={Math.max(0, dayjs(event.startTime).diff(dayjs(), 'day'))} />
			</div>

			<div className="grid sm:grid-cols-2 gap-x-10 gap-y-5 mb-10">
				<DetailRow icon={Calendar} label="Date" value={dayjs(event.date).format('dddd, MMMM D, YYYY')} />
				<DetailRow
					icon={Calendar}
					label="Doors"
					value={`${dayjs(event.startTime).format('HH:mm')} → ${dayjs(event.endTime).format('HH:mm')}`}
				/>
				<DetailRow icon={MapPin} label="Location" value={event.location} />
				<DetailRow icon={Users} label="Capacity" value={`${event.ticketsSold || 0} / ${event.capacity}`} />
			</div>

			<p className="font-sans text-base text-ink/85 leading-[1.65] max-w-3xl whitespace-pre-line border-t border-line pt-8">
				{event.description}
			</p>

			<div className="flex flex-wrap gap-3 mt-10">
				<Link to={`/events/checkin/${eventId}`}>
					<Button variant="accent">
						<ScanLine className="size-4" /> Open check-in
					</Button>
				</Link>
				<Button variant="secondary" onClick={() => setEditOpen(true)}>
					<Edit3 className="size-4" /> Edit
				</Button>
				<Button variant="ghost" onClick={() => setDeleteOpen(true)}>
					<Trash2 className="size-4 text-stamp" /> Delete
				</Button>
			</div>

			{/* Edit modal */}
			<Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit event" size="lg">
				<div className="space-y-5">
					<Input label="Title" name="title" value={edit.title} onChange={handleChange} />
					<Textarea
						label="Description"
						name="description"
						value={edit.description}
						onChange={handleChange}
						rows={4}
					/>
					<div className="grid sm:grid-cols-3 gap-4">
						<Input label="Date" type="date" name="date" value={edit.date} onChange={handleChange} />
						<Input label="Start" type="time" name="startTime" value={edit.startTime} onChange={handleChange} />
						<Input label="End" type="time" name="endTime" value={edit.endTime} onChange={handleChange} />
					</div>
					<div className="grid sm:grid-cols-2 gap-4">
						<Input label="Location" name="location" value={edit.location} onChange={handleChange} />
						<Input
							label="Capacity"
							type="number"
							name="capacity"
							value={edit.capacity}
							onChange={handleChange}
						/>
					</div>
					<div>
						<label className="block font-sans text-sm font-medium text-ink mb-2">
							Category
						</label>
						<select
							name="category"
							value={edit.category}
							onChange={handleChange}
							className="w-full bg-paper-card border border-line rounded-[var(--radius)] px-4 py-3 font-sans text-base text-ink focus:outline-none focus:ring-2 focus:ring-ink/15 focus:border-ink"
						>
							<option value="General">General</option>
							{categories.map((c) => (
								<option key={c.category} value={c.category}>
									{c.name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block font-sans text-sm font-medium text-ink mb-2">
							Cover image
						</label>
						{imagePreview && (
							<img src={imagePreview} alt="" className="w-full h-40 object-cover rounded-[var(--radius)] mb-2 border border-line" />
						)}
						<input type="file" accept="image/*" onChange={handleImageChange} className="font-sans text-sm" />
					</div>
					<div className="flex justify-end gap-3 pt-2">
						<Button variant="secondary" onClick={() => setEditOpen(false)}>
							Cancel
						</Button>
						<Button variant="primary" onClick={handleSave} disabled={saving || uploading}>
							{saving ? 'Saving…' : uploading ? 'Uploading…' : 'Save changes'}
						</Button>
					</div>
				</div>
			</Modal>

			{/* Delete modal */}
			<Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete event?" size="sm">
				<p className="font-sans text-base text-ink mb-1">
					Delete <span className="font-medium">{event.title}</span>?
				</p>
				<p className="font-sans text-sm text-muted mb-7">
					Tickets will be cancelled. This cannot be undone.
				</p>
				<div className="flex justify-end gap-3">
					<Button variant="secondary" onClick={() => setDeleteOpen(false)}>
						Keep
					</Button>
					<Button variant="stamp" onClick={handleDelete} disabled={deleting}>
						{deleting ? 'Deleting…' : 'Delete'}
					</Button>
				</div>
			</Modal>
		</div>
	);
}

function Stat({ label, value, suffix, hint }) {
	return (
		<div>
			<div
				className="font-display font-medium tabular text-ink leading-none tracking-tight"
				style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
			>
				<NumberTicker value={value} suffix={suffix || ''} />
			</div>
			<div className="mt-3 font-sans text-sm text-muted">
				{label}
				{hint && <span className="ml-1 text-muted-soft">{hint}</span>}
			</div>
		</div>
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
