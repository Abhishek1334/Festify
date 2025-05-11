import { useEffect, useState, useContext } from "react";
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

	const now = dayjs().utc(); // Always use UTC for consistency

	// ✅ Avoid accessing event.startTime when event is still null
	const start = event ? dayjs(event.startTime) : null;
	const end = event ? dayjs(event.endTime) : null;

	const isSoldOut = event ? event.ticketsSold >= event.capacity : false;
	const isUpcoming = event ? now.isBefore(start) : false;
	const isLive = event ? now.isAfter(start) && now.isBefore(end) : false;
	const isExpired = event ? now.isAfter(end) : false;

	useEffect(() => {
		const fetchEventDetails = async () => {
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
		};

		fetchEventDetails();
	}, [eventId, user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditEvent((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

			try {
				setIsUploadingImage(true);
				const uploadRes = await axios.post(
					`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
					formData
				);

				setImagePreview(
					getCloudinaryImageUrl(uploadRes.data.public_id)
				);
				setEditEvent((prev) => ({
					...prev,
					image: uploadRes.data.public_id,
				}));
			} catch (err) {
				console.error("Error uploading image:", err);
				setError("Image upload failed. Please try again.");
			} finally {
				setIsUploadingImage(false);
			}
		}
	};

	const handleSave = async () => {
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
			setError(err.response?.data?.message || "Update failed");
			toast.error(
				err.response?.data?.message || "Failed to update event."
			);
		}
	};

	const handleDelete = async () => {
		if (!window.confirm("Are you sure you want to delete this event?"))
			return;
		try {
			const response = await axios.delete(
				`${API_URL}/events/${eventId}`,
				{
					headers: { Authorization: `Bearer ${user.token}` },
				}
			);

			if (response.status === 200) {
				toast.success("Event deleted successfully.");
				navigate("/user-profile");
			}
		} catch (err) {
			console.error("Delete event error:", err);
			toast.error(
				err.response?.data?.message || "Failed to delete event."
			);
		}
	};

	if (loading)
		return <div className="text-center text-gray-500">Loading...</div>;
	if (error)
		return <div className="text-center text-red-500">Error: {error}</div>;
	if (!event)
		return (
			<div className="text-center text-gray-500">Event not found.</div>
		);

	return (
		<div className=" max-w-4xl mx-auto py-10 px-5 bg-gray-100 rounded-lg shadow-lg my-10">
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
			/>

			<div className="space-y-2">
				<div className="my-4 flex gap-4">
					{isSoldOut && (
						<span className="inline-block bg-red-200 text-red-800 px-3 py-1 rounded-lg text-sm font-semibold">
							🎟️ Sold Out
						</span>
					)}
					{isUpcoming && !isSoldOut && (
						<span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-lg text-sm font-semibold">
							⏳ Upcoming
						</span>
					)}
					{isLive && (
						<span className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded-lg text-sm font-semibold animate-pulse">
							🟢 Live Now
						</span>
					)}
					{isExpired && (
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
				{!isExpired && (
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
