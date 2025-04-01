import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const EventDetail = () => {
	const { user } = useContext(AuthContext);
	const { eventId } = useParams();

	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editEvent, setEditEvent] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);

	// Fetch event details
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
				setEditEvent({ ...data });

				if (data.image) {
					const imagePath = data.image.startsWith("uploads/")
						? data.image
						: `uploads/${data.image}`;
					setImagePreview(`http://localhost:5000/${imagePath}`);
				}
			} catch (err) {
				setError(err.response?.data?.message || "An error occurred");
			} finally {
				setLoading(false);
			}
		};

		fetchEventDetails();
	}, [eventId, user]);

	// Handle input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditEvent((prev) => ({ ...prev, [name]: value }));
	};

	// Handle image change
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	// Format date and time for display in IST
	const formatDateTimeIST = (dateTimeString) => {
		if (!dateTimeString) return "";
		try {
			const date = new Date(dateTimeString);
			if (isNaN(date.getTime())) return "";
			return date.toLocaleString("en-IN", {
				timeZone: "Asia/Kolkata",
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			});
		} catch (e) {
			console.error("Error formatting time to IST:", e);
			return "";
		}
	};

	const formatDateForInput = (dateString) => {
		if (!dateString) return "";
		try {
			const date = new Date(dateString);
			if (!isNaN(date.getTime())) {
				return date.toISOString().split("T")[0];
			}
		} catch (e) {
			console.error("Error parsing date:", e);
		}
		return "";
	};

	const formatTimeForInput = (timeString) => {
		if (!timeString) return "";
		try {
			const date = new Date(timeString);
			if (!isNaN(date.getTime())) {
				const hours = date.getHours().toString().padStart(2, "0");
				const minutes = date.getMinutes().toString().padStart(2, "0");
				return `${hours}:${minutes}`;
			}
		} catch (e) {
			console.error("Error parsing time:", e);
		}

		if (typeof timeString === "string") {
			const timeParts = timeString.split(":");
			if (timeParts.length >= 2) {
				return `${timeParts[0]}:${timeParts[1]}`;
			}
		}

		return "";
	};

	// Save changes
	const handleSave = async () => {
		try {
			const formData = new FormData();
			const dateStr = formatDateForInput(editEvent.date);
			const startTimeStr = formatTimeForInput(editEvent.startTime);
			const endTimeStr = formatTimeForInput(editEvent.endTime);

			const startDateTime = new Date(`${dateStr}T${startTimeStr}`);
			const endDateTime = new Date(`${dateStr}T${endTimeStr}`);

			formData.append("startTime", startDateTime.toISOString());
			formData.append("endTime", endDateTime.toISOString());
			formData.append("date", dateStr);

			Object.entries(editEvent).forEach(([key, value]) => {
				if (
					value !== null &&
					value !== undefined &&
					key !== "startTime" &&
					key !== "endTime" &&
					key !== "date"
				) {
					formData.append(key, value);
				}
			});

			if (imageFile) {
				formData.append("image", imageFile);
			}

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

			setEvent(data);
			setIsEditing(false);
			window.location.reload();
		} catch (err) {
			setError(err.response?.data?.message || "Update failed");
		}
	};

	// Delete event
	const handleDelete = async () => {
		if (!window.confirm("Are you sure you want to delete this event?"))
			return;
		try {
			await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			alert("Event deleted successfully.");
			window.location.href = "/organizer";
		} catch (err) {
			alert(err.response?.data?.message || "Failed to delete event.");
		}
	};

	// Loading & Error States
	if (loading)
		return <div className="text-center text-gray-500">Loading...</div>;
	if (error)
		return <div className="text-center text-red-500">Error: {error}</div>;
	if (!event)
		return (
			<div className="text-center text-gray-500">Event not found.</div>
		);

	return (
		<div className="max-w-4xl mx-auto py-10 px-5 bg-gray-100 rounded-lg shadow-lg">
			{/* Header Section */}
			<div className="flex gap-5 mb-4">
				<Link to="/organizer" className="btn-primary">
					Return to Event Panel
				</Link>
				<Link
					to={{
						pathname: `/events/checkin/${eventId}`,
						state: { event },
					}}
					className="btn-secondary"
				>
					Check-In Center
				</Link>
			</div>

			{/* Event Image */}
			<img
				src={
					imagePreview ||
					(event.image
						? `http://localhost:5000/${event.image}`
						: "https://via.placeholder.com/800x400?text=No+Image")
				}
				alt={event.title}
				className="w-full h-64 object-cover rounded-lg mb-4"
			/>

			{/* Event Details */}
			<h1 className="text-4xl font-semibold mb-2">{event.title}</h1>
			<p className="text-lg text-gray-700 mb-4">{event.description}</p>
			<p className="text-lg">
				<strong>Category:</strong> {event.category}
			</p>
			<p className="text-lg">
				<strong>Date:</strong>{" "}
				{new Date(event.date).toLocaleDateString("en-IN", {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</p>
			<p className="text-lg">
				<strong>Start Time:</strong>{" "}
				{formatDateTimeIST(event.startTime)}
			</p>
			<p className="text-lg">
				<strong>End Time:</strong> {formatDateTimeIST(event.endTime)}
			</p>
			<p className="text-lg">
				<strong>Location:</strong> {event.location}
			</p>
			<p className="text-lg">
				<strong>Capacity:</strong> {event.capacity}
			</p>
			<p className="text-lg">
				<strong>Tickets Sold: </strong>
				{event.ticketsSold}
			</p>
			<div className="flex gap-5 mt-4">
				<button
					onClick={() => setIsEditing(true)}
					className="btn-primary"
				>
					Edit Event
				</button>
				<button
					onClick={handleDelete}
					className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
				>
					Delete Event
				</button>
			</div>
			{/* Edit Modal */}
			{isEditing && (
				<div className="fixed inset-0  flex justify-center items-center bg-gray-100 bg-opacity-50 transition-opacity z-50">
					<div className="bg-white p-6 rounded-lg shadow-xl max-w-[40vw]  overflow-y-auto">
						<h2 className="text-xl font-semibold mb-4 text-gray-700">
							Edit Event
						</h2>

						<div className="space-y-3">
							<label className=" ">Title</label>
							<input
								name="title"
								value={editEvent.title}
								onChange={handleChange}
								className="input-field"
							/>

							<label className="">Description</label>
							<textarea
								name="description"
								value={editEvent.description}
								onChange={handleChange}
								className="input-field"
							/>

							<label className=" ">Category</label>
							<input
								name="category"
								value={editEvent.category}
								onChange={handleChange}
								className="input-field"
							/>

							<label className=" ">Location</label>
							<input
								name="location"
								value={editEvent.location}
								onChange={handleChange}
								className="input-field"
							/>

							<label className=" ">Date</label>
							<input
								type="date"
								name="date"
								value={formatDateForInput(editEvent.date)}
								onChange={handleChange}
								className="input-field"
							/>

							<div className="flex gap-4">
								<div>
									<label>Start Time</label>
									<input
										type="time"
										name="startTime"
										value={formatTimeForInput(
											editEvent.startTime
										)}
										onChange={handleChange}
										className="input-field"
									/>
								</div>
								<div>
									<label>End Time</label>
									<input
										type="time"
										name="endTime"
										value={formatTimeForInput(
											editEvent.endTime
										)}
										onChange={handleChange}
										className="input-field"
									/>
								</div>
							</div>
							<div>
								<label>Capacity</label>
								<input
									name="capacity"
									value={editEvent.capacity}
									onChange={handleChange}
									className="input-field"
								/>
							</div>


							<label>Upload Image</label>
							<input
								type="file"
								onChange={handleImageChange}
								className="input-field"
							/>
							{imagePreview && (
								<img
									src={imagePreview}
									alt="Preview"
									className="mt-2 rounded-md"
									width="100"
								/>
							)}
						</div>

						<div className="flex justify-end gap-4 mt-4">
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
								Save Changes
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default EventDetail;
