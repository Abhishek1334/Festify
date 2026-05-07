import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Upload, ArrowRight } from 'lucide-react';
import categories from '../categories.json';
import { Input, Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Ticket } from '../components/ui/Ticket';
import { cn } from '../lib/cn';

const API_URL = import.meta.env.VITE_API_URL + '/api';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = 'festify';

export default function CreateEvents() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		title: '',
		description: '',
		date: '',
		startTime: '',
		endTime: '',
		location: '',
		capacity: '',
		category: 'General',
	});
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

	const handleFile = (e) => {
		const f = e.target.files[0];
		if (!f) return;
		setImageFile(f);
		setImagePreview(URL.createObjectURL(f));
	};

	const uploadImage = async (file) => {
		const fd = new FormData();
		fd.append('file', file);
		fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
		const res = await axios.post(
			`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
			fd
		);
		return res.data.public_id;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		if (!imageFile) {
			setError('Add an event image.');
			return;
		}

		setLoading(true);
		try {
			const stored = JSON.parse(localStorage.getItem('user')) || {};
			const token = stored.token;
			const organizerId = stored.id;
			const organizerName = stored.username;

			if (!token) {
				setError('Log in again to host an event.');
				setLoading(false);
				return;
			}

			const publicId = await uploadImage(imageFile);

			const payload = {
				title: form.title,
				description: form.description,
				date: new Date(form.date).toISOString(),
				startTime: new Date(`${form.date}T${form.startTime}:00`).toISOString(),
				endTime: new Date(`${form.date}T${form.endTime}:00`).toISOString(),
				location: form.location,
				capacity: Number(form.capacity),
				category: form.category || 'General',
				image: publicId,
				organizerId,
				organizerName,
			};

			await axios.post(`${API_URL}/events`, payload, {
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			});

			toast.success('Event published.');
			navigate('/user-profile');
		} catch (err) {
			setError(err.response?.data?.message || 'Could not create event.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
			<div className="font-sans text-sm font-medium text-accent-deep uppercase tracking-wider mb-3">
				New event
			</div>
			<h1
				className="font-display font-medium leading-[1.02] tracking-tight mb-3"
				style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
			>
				Host an event.
			</h1>
			<p className="font-sans text-base text-muted mb-12 max-w-md leading-relaxed">
				Fill in the details on the left. Your ticket previews live on the right.
			</p>

			<div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-12 lg:gap-16">
				<form onSubmit={handleSubmit} className="space-y-6">
					{error && (
						<div className="bg-stamp/5 border border-stamp/30 rounded-[var(--radius)] px-4 py-3 font-sans text-sm text-stamp">
							{error}
						</div>
					)}

					<Input
						label="Title"
						name="title"
						value={form.title}
						onChange={handleChange}
						placeholder="What's happening?"
						required
					/>
					<Textarea
						label="Description"
						name="description"
						value={form.description}
						onChange={handleChange}
						rows={4}
						placeholder="Why should anyone show up?"
						required
					/>
					<div className="grid sm:grid-cols-3 gap-4">
						<Input
							label="Date"
							type="date"
							name="date"
							value={form.date}
							onChange={handleChange}
							required
						/>
						<Input
							label="Start"
							type="time"
							name="startTime"
							value={form.startTime}
							onChange={handleChange}
							required
						/>
						<Input
							label="End"
							type="time"
							name="endTime"
							value={form.endTime}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="grid sm:grid-cols-2 gap-4">
						<Input
							label="Location"
							name="location"
							value={form.location}
							onChange={handleChange}
							placeholder="City, venue"
							required
						/>
						<Input
							label="Capacity"
							type="number"
							name="capacity"
							value={form.capacity}
							onChange={handleChange}
							placeholder="500"
							min={1}
							required
						/>
					</div>

					<div>
						<label className="block font-sans text-sm font-medium text-ink mb-2">
							Category
						</label>
						<select
							name="category"
							value={form.category}
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
						<label
							className={cn(
								'flex items-center gap-3 bg-paper-card border-2 border-dashed border-line rounded-[var(--radius)] px-4 py-4 cursor-pointer hover:border-ink transition-colors',
								imageFile && 'border-solid border-line bg-paper-dim/40'
							)}
						>
							<Upload className="size-4 text-muted" strokeWidth={1.75} />
							<span className="font-sans text-sm">
								{imageFile ? imageFile.name : 'Click to upload'}
							</span>
							<input
								type="file"
								accept="image/*"
								onChange={handleFile}
								className="sr-only"
								required
							/>
						</label>
					</div>

					<div className="pt-4">
						<Button type="submit" variant="primary" size="lg" disabled={loading}>
							{loading ? 'Publishing…' : 'Publish event'} <ArrowRight className="size-4" />
						</Button>
					</div>
				</form>

				<aside className="lg:sticky lg:top-24 self-start">
					<div className="font-sans text-sm font-medium text-muted mb-4">
						Live preview
					</div>
					<Ticket
						id="NEW"
						title={form.title || 'Your event title'}
						date={
							form.date
								? new Date(form.date).toLocaleDateString('en-IN', {
										weekday: 'short',
										month: 'short',
										day: 'numeric',
								  }) + (form.startTime ? ' · ' + form.startTime : '')
								: 'Pick a date'
						}
						location={form.location || 'Where?'}
						accent={form.category !== 'General' ? form.category : null}
					/>
					{imagePreview && (
						<div className="mt-4 rounded-[var(--radius)] overflow-hidden border border-line">
							<img src={imagePreview} alt="" className="w-full h-44 object-cover" />
						</div>
					)}
				</aside>
			</div>
		</div>
	);
}
