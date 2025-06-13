import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import categories from "../categories.json";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL + "/api";

// Extend dayjs with UTC and timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const CLOUDINARY_UPLOAD_PRESET = "festify";
const CLOUDINARY_CLOUD_NAME = "dmgyx29ou";

const getCloudinaryImageUrl = (publicId) =>
	`https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;

const EventDetail = () => {
	const { user } = useContext(AuthContext);
	const { eventId } = useParams();
	const navigate = useNavigate();

	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editEvent, setEditEvent] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [isUploadingImage, setIsUploadingImage] = useState(false);

	const now = dayjs().utc();

	// Memoize event status calculations
	const eventStatus = useMemo(() => {
		if (!event) return null;

		const start = dayjs(event.startTime);
		const end = dayjs(event.endTime);

		return {
			isSoldOut: event.ticketsSold >= event.capacity,
			isUpcoming: now.isBefore(start),
			isLive: now.isAfter(start) && now.isBefore(end),
			isExpired: now.isAfter(end)
		};
	}, [event, now]);

	// Memoize the fetch event details function
	const fetchEventDetails = useCallback(async () => {
		if (!user) {
			setError("You must be logged in to view this event.");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			const { data } = await axios.get(
				`${API_URL}/events/${eventId}`,
				{
					headers: { Authorization: `Bearer ${user.token}` },
				}
			);

			setEvent(data);
			setEditEvent({
				...data,
				date: dayjs(data.date).format("YYYY-MM-DD"),
				startTime: dayjs(data.startTime).format("HH:mm"),
				endTime: dayjs(data.endTime).format("HH:mm"),
			});

			if (data.image) {
				setImagePreview(getCloudinaryImageUrl(data.image));
			}
		} catch (err) {
			setError(err.response?.data?.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	}, [eventId, user]);

	useEffect(() => {
		fetchEventDetails();
	}, [fetchEventDetails]);

	// Memoize the handle change function
	const handleChange = useCallback((e) => {
		const { name, value } = e.target;
		setEditEvent((prev) => ({ ...prev, [name]: value }));
	}, []);

	// Memoize the image upload handler
	const handleImageChange = useCallback(async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

		try {
			setIsUploadingImage(true);
			const uploadRes = await axios.post(
				`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
				formData
			);

			setImagePreview(getCloudinaryImageUrl(uploadRes.data.public_id));
			setEditEvent((prev) => ({
				...prev,
				image: uploadRes.data.public_id,
			}));
		} catch (err) {
			toast.error("Image upload failed. Please try again.");
		} finally {
			setIsUploadingImage(false);
		}
	}, []);

	// Memoize the save handler
	const handleSave = useCallback(async () => {
		if (new Date(editEvent.startTime) >= new Date(editEvent.endTime)) {
			setError("End time must be after start time.");
			return;
		}

		if (
			!editEvent.title ||
			!editEvent.description ||
			!editEvent.category ||
			!editEvent.location ||
			!editEvent.date ||
			!editEvent.startTime ||
			!editEvent.endTime ||
			!editEvent.capacity
		) {
			setError("Please fill in all required fields.");
			return;
		}

		const startTimeInUTC = dayjs(`${editEvent.date}T${editEvent.startTime}`)
			.utc()
			.format();
		const endTimeInUTC = dayjs(`${editEvent.date}T${editEvent.endTime}`)
			.utc()
			.format();

		const updatedEvent = {
			...editEvent,
			startTime: startTimeInUTC,
			endTime: endTimeInUTC,
		};

		try {
			const { data } = await axios.put(
				`${API_URL}/events/${eventId}`,
				updatedEvent,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
						"Content-Type": "application/json",
					},
				}
			);

			setEvent(data);
			setIsEditing(false);
			toast.success("Event updated successfully.");
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to update event.");
		}
	}, [editEvent, eventId, user?.token]);

	// Memoize the delete handler
	const handleDelete = useCallback(async () => {
		if (!window.confirm("Are you sure you want to delete this event?")) return;
		
		try {
			await axios.delete(`${API_URL}/events/${eventId}`, {
				headers: { Authorization: `Bearer ${user.token}` },
			});

			toast.success("Event deleted successfully.");
			navigate("/user-profile");
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to delete event.");
		}
	}, [eventId, user?.token, navigate]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
			</div>
		);
	}

	if (error) {
		return <div className="text-center text-red-500">Error: {error}</div>;
	}

	if (!event) {
		return <div className="text-center text-gray-500">Event not found.</div>;
	}

	return (
		<div className="max-w-4xl mx-auto py-10 px-5 bg-gray-100 rounded-lg shadow-lg my-10">
			<ToastContainer />
			<div className="flex gap-5 mb-4">
				<Link to="/user-profile" className="btn-primary">
					Return to Event Panel
				</Link>
				<Link to={`/events/checkin/${eventId}`} className="btn-primary">
					Check-in Panel
				</Link>
			</div>

			<img
				src={imagePreview || getCloudinaryImageUrl(event.image)}
				alt={event.title}
				className="w-full h-64 object-cover rounded-lg mb-4"
				loading="lazy"
			/>

			<div className="space-y-2">
				<div className="my-4 flex gap-4">
					{eventStatus.isSoldOut && (
						<span className="inline-block bg-red-200 text-red-800 px-3 py-1 rounded-lg text-sm font-semibold">
							🎟️ Sold Out
						</span>
					)}
					{eventStatus.isUpcoming && !eventStatus.isSoldOut && (
						<span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-lg text-sm font-semibold">
							⏳ Upcoming
						</span>
					)}
					{eventStatus.isLive && (
						<span className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded-lg text-sm font-semibold animate-pulse">
							🟢 Live Now
						</span>
					)}
					{eventStatus.isExpired && (
						<span className="inline-block bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm font-semibold">
							📅 Event Ended
						</span>
					)}
				</div>
				<p>
					<strong>Title:</strong> {event.title}
				</p>
				<p>
					<strong>Description:</strong> {event.description}
				</p>
				<p>
					<strong>Category:</strong> {event.category}
				</p>
				<p>
					<strong>Location:</strong> {event.location}
				</p>
				<p>
					<strong>Capacity:</strong> {event.capacity}
				</p>
				{event?.startTime && (
					<p>
						<strong>Start Time (IST):</strong>{" "}
						{dayjs(event.startTime)
							.tz("Asia/Kolkata")
							.format("h:mm A")}
					</p>
				)}
				{event?.endTime && (
					<p>
						<strong>End Time (IST):</strong>{" "}
						{dayjs(event.endTime)
							.tz("Asia/Kolkata")
							.format("h:mm A")}
					</p>
				)}
			</div>

			<div className="flex gap-5 mt-4">
				{!eventStatus.isExpired && (
					<button
						onClick={() => setIsEditing(true)}
						className="btn-primary"
					>
						Edit Event
					</button>
				)}
				<button
					onClick={handleDelete}
					className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg"
				>
					Delete Event
				</button>
			</div>

			{isEditing && (
				<div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50">
					<div className="bg-white p-6 rounded-lg shadow-xl max-w-lg">
						<h2 className="text-xl font-semibold mb-4">
							Edit Event
						</h2>
						<input
							name="title"
							value={editEvent.title}
							onChange={handleChange}
							placeholder="Title"
							className="input-field"
						/>
						<textarea
							name="description"
							value={editEvent.description}
							onChange={handleChange}
							placeholder="Description"
							className="input-field"
						/>
						<select
							name="category"
							value={editEvent.category}
							onChange={handleChange}
							className="input-field"
						>
							<option value="General">General</option>
							{categories.map((cat) => (
								<option key={cat.category} value={cat.category}>
									{cat.name}
								</option>
							))}
						</select>
						<input
							type="date"
							name="date"
							value={editEvent.date}
							onChange={handleChange}
							className="input-field"
						/>
						<input
							type="time"
							name="startTime"
							value={editEvent.startTime}
							onChange={handleChange}
							className="input-field"
						/>
						<input
							type="time"
							name="endTime"
							value={editEvent.endTime}
							onChange={handleChange}
							className="input-field"
						/>
						<input
							name="location"
							value={editEvent.location}
							onChange={handleChange}
							placeholder="Location"
							className="input-field"
						/>
						<input
							name="capacity"
							value={editEvent.capacity}
							onChange={handleChange}
							placeholder="Capacity"
							className="input-field"
						/>
						<input
							type="file"
							onChange={handleImageChange}
							className="input-field"
						/>
						<div className="flex justify-end gap-4 mt-4">
							<button
								onClick={() => setIsEditing(false)}
								className="btn-secondary"
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								disabled={isUploadingImage}
								className="btn-primary"
							>
								{isUploadingImage
									? "Saving..."
									: "Save Changes"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default EventDetail;
