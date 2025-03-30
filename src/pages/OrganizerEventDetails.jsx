import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {Link} from 'react-router-dom';

const OrganizerEventDetail = () => {
	const { user } = useContext(AuthContext);
	const { eventId } = useParams();

	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editEvent, setEditEvent] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);

	// ✅ Fetch event details
	useEffect(() => {
		const fetchEventDetails = async () => {
			if (!eventId || !user) return;
			try {
				setLoading(true);
				const { data } = await axios.get(
					`http://localhost:5000/api/events/${eventId}`,
					{ headers: { Authorization: `Bearer ${user.token}` } }
				);
				setEvent(data);
				setEditEvent({ ...data, organizerId: undefined });

				// ✅ Fix: Construct correct image URL
				if (data.image) {
					setImagePreview(
						`http://localhost:5000/uploads/${data.image}`
					);
				}
			} catch (err) {
				setError(err.response?.data?.message || "An error occurred");
			} finally {
				setLoading(false);
			}
		};

		fetchEventDetails();
	}, [eventId, user]);

	// ✅ Handle input changes (Ensure proper formatting)
	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditEvent((prev) => ({
			...prev,
			[name]: name === "capacity" ? Number(value) || "" : value,
		}));
	};

	// ✅ Handle image change
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	// ✅ Handle save changes
	const handleSave = async () => {
		try {
			const formData = new FormData();
			const { date, startTime, endTime, capacity, ...editableData } =
				editEvent;

			// ✅ Validate capacity
			if (!capacity || isNaN(capacity) || capacity <= 0) {
				alert("Invalid capacity. It must be a positive number.");
				return;
			}

			// ✅ Append fields to FormData
			Object.entries(editableData).forEach(([key, value]) => {
				if (value !== null && value !== undefined) {
					formData.append(key, value);
				}
			});

			// ✅ Fix: Ensure correct date and time format
			if (date) {
				formData.append(
					"date",
					new Date(date).toISOString().split("T")[0]
				); // YYYY-MM-DD
			}

			// ✅ Format time properly
			if (startTime) {
				formData.append("startTime", `${date}T${startTime}:00`);
			}
			if (endTime) {
				formData.append("endTime", `${date}T${endTime}:00`);
			}

			// ✅ Ensure capacity is a number
			formData.append("capacity", Number(capacity));

			if (imageFile) {
				formData.append("image", imageFile);
			}

			console.log("🚀 Sending Data:", [...formData.entries()]);

			const { data } = await axios.put(
				`http://localhost:5000/api/events/${eventId}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			console.log("✅ API Response:", data);
			setEvent(data);
			setIsEditing(false);
		} catch (err) {
			console.error(
				"❌ Update Error:",
				err.response?.data || err.message
			);
			setError(err.response?.data?.message || "Update failed");
		}
	};

	// ✅ Handle event deletion
	const handleDelete = async () => {
		if (!window.confirm("Are you sure you want to delete this event?"))
			return;

		try {
			await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
				headers: { Authorization: `Bearer ${user.token}` },
			});

			alert("Event deleted successfully.");
			window.location.href = "/organizer"; // Redirect to organizer panel
		} catch (err) {
			console.error(
				"❌ Delete Error:",
				err.response?.data || err.message
			);
			alert(err.response?.data?.message || "Failed to delete event.");
		}
	};

	// ✅ Format Date and Time
	const formatDate = (timestamp) => {
		if (!timestamp) return "";
		const date = new Date(timestamp);
		return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0]; // YYYY-MM-DD
	};

	const formatTime = (timestamp) => {
		if (!timestamp) return "";
		if (typeof timestamp === "string" && timestamp.match(/^\d{2}:\d{2}$/))
			return timestamp;
		const date = new Date(timestamp);
		return isNaN(date.getTime())
			? ""
			: date.toISOString().split("T")[1].slice(0, 5); // HH:mm
	};

	// ✅ Loading & Error States
	if (loading) return <p className="text-center text-gray-500">Loading...</p>;
	if (error)
		return <p className="text-center text-red-500">Error: {error}</p>;
	if (!event)
		return <p className="text-center text-gray-500">Event not found.</p>;

	return (
		<div className="max-w-4xl mx-auto py-10 px-5">
			<div className="flex gap-5 mb-2 ">
				<Link to="/organizer" className="btn-primary ">
					Return to Event Panel
				</Link>
				<button
					onClick={() => setIsEditing(true)}
					className="btn-primary"
				>
					Edit Event
				</button>
				<button onClick={handleDelete} className="bg-red-500 text-white px-5 py-2 rounded-xl font-semibold">
					Delete Event
				</button>
			</div>
			{/* ✅ Event Image */}
			{imagePreview && (
				<img
					src={`http://localhost:5000/${event.image}`}
					alt={event.title}
					className="w-full h-64 object-cover rounded-lg mb-4"
				/>
			)}

			{/* ✅ Event Details */}
			<h1 className="text-3xl font-bold mb-2">{event.title}</h1>
			<p className="text-gray-600 mb-4">{event.description}</p>
			<p>
				<strong>Category:</strong> {event.category}
			</p>
			<p>
				<strong>Date:</strong> {formatDate(event.date)}
			</p>
			<p>
				<strong>Start Time: </strong>
				{new Date(event.startTime).toLocaleTimeString("en-IN", {
					timeZone: "Asia/Kolkata",
					hour: "2-digit",
					minute: "2-digit",
					hour12: true,
				})}
			</p>

			<p>
				<strong>End Time: </strong>
				{new Date(event.endTime).toLocaleTimeString("en-IN", {
					timeZone: "Asia/Kolkata",
					hour: "2-digit",
					minute: "2-digit",
					hour12: true,
				})}
			</p>

			<p>
				<strong>Location:</strong> {event.location}
			</p>
			<p>
				<strong>Capacity:</strong> {event.capacity}
			</p>

			{/* ✅ Edit Event Modal */}
			{isEditing && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
					<div className="bg-white p-6 rounded-lg w-96">
						<h2 className="text-xl font-bold mb-4">Edit Event</h2>

						<input
							name="title"
							value={editEvent?.title || ""}
							onChange={handleChange}
							className="w-full mb-3 p-2 border rounded"
							placeholder="Title"
						/>
						<textarea
							name="description"
							value={editEvent?.description || ""}
							onChange={handleChange}
							className="w-full mb-3 p-2 border rounded"
							placeholder="Description"
						></textarea>
						<input
							name="category"
							value={editEvent?.category || ""}
							onChange={handleChange}
							className="w-full mb-3 p-2 border rounded"
							placeholder="Category"
						/>
						<input
							name="date"
							type="date"
							value={formatDate(editEvent?.date)}
							onChange={handleChange}
							className="w-full mb-3 p-2 border rounded"
						/>
						<input
							name="startTime"
							type="time"
							value={formatTime(editEvent?.startTime)}
							onChange={handleChange}
							className="w-full mb-3 p-2 border rounded"
						/>
						<input
							name="endTime"
							type="time"
							value={formatTime(editEvent?.endTime)}
							onChange={handleChange}
							className="w-full mb-3 p-2 border rounded"
						/>
						<input
							name="location"
							value={editEvent?.location || ""}
							onChange={handleChange}
							className="w-full mb-3 p-2 border rounded"
							placeholder="Location"
						/>
						<input
							name="capacity"
							type="number"
							value={editEvent?.capacity || ""}
							onChange={handleChange}
							className="w-full mb-3 p-2 border rounded"
							placeholder="Capacity"
						/>

						<input
							type="file"
							onChange={handleImageChange}
							className="w-full mb-3 p-2 border rounded"
						/>

						<div className="flex justify-end space-x-2">
							<button
								onClick={() => setIsEditing(false)}
								className="btn-secondary"
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								className="btn-primary"
							>
								Save
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrganizerEventDetail;
