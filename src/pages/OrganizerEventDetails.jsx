import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const OrganizerEventDetail = () => {
	const { user } = useContext(AuthContext);
	const { eventId } = useParams();
	const navigate = useNavigate();

	const [event, setEvent] = useState(null);
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		date: "",
		startTime: "",
		endTime: "",
		location: "",
		capacity: "",
	});


	const [imagePreview, setImagePreview] = useState(null);
	const [imageFile, setImageFile] = useState(null);

	useEffect(() => {
		const fetchEventDetails = async () => {
			try {
				setLoading(true); // Use setLoading before the request
				const { data } = await axios.get(
					`http://localhost:5000/api/events/${eventId}`,
					{ headers: { Authorization: `Bearer ${user.token}` } }
				);
				setEvent(data);
				setTickets(data.tickets || []); // Set tickets if available

				setFormData({
					title: data.title || "",
					description: data.description || "",
					date: data.date ? data.date.split("T")[0] : "",
					startTime: data.startTime || "",
					endTime: data.endTime || "",
					location: data.location || "",
					capacity: data.capacity || "",
				});

				setImagePreview(
					data.image ? `http://localhost:5000/${data.image}` : ""
				);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false); // Set loading to false after request completes
			}
		};
		if (eventId && user) {
			fetchEventDetails(); // ✅ Call the function here
		}
	}, [eventId, user]);


	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImageFile(file);
		setImagePreview(URL.createObjectURL(file));
	};

	const handleSave = async () => {
		try {
			const updatedEvent = {
				...formData,
				startTime: new Date(
					`${formData.date}T${formData.startTime}:00Z`
				).toISOString(),
				endTime: new Date(
					`${formData.date}T${formData.endTime}:00Z`
				).toISOString(),
				date: new Date(formData.date).toISOString(),
				capacity: Number(formData.capacity) || 0, // Ensure capacity is a number
			};

			const eventFormData = new FormData();
			Object.keys(updatedEvent).forEach((key) => {
				eventFormData.append(key, updatedEvent[key]);
			});

			if (imageFile) {
				eventFormData.append("image", imageFile);
			}

			const { data } = await axios.put(
				`http://localhost:5000/api/events/${eventId}`,
				eventFormData,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			setEvent(data);
			setIsEditing(false);
		} catch (error) {
			console.error("Error updating event:", error);
			setError("Failed to update event.");
		}
	};



	if (loading) return <p className="text-center text-gray-500">Loading...</p>;
	if (error)
		return <p className="text-center text-red-500">Error: {error}</p>;
	if (!event)
		return <p className="text-center text-gray-500">Event not found.</p>;

	return (
		<div className="max-w-4xl mx-auto py-10 px-5">
			<button
				onClick={() => navigate("/organizer")}
				className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
			>
				⬅ Back to Organizer Page
			</button>

			{isEditing ? (
				<>
					<label className="block font-semibold">Event Title</label>
					<input
						type="text"
						name="title"
						value={formData.title || ""}
						onChange={handleChange}
						className="w-full p-2 border rounded mb-4"
					/>

					<label className="block font-semibold">
						Event Description
					</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						className="w-full p-2 border rounded mb-4"
					/>

					<label className="block font-semibold">Event Date</label>
					<input
						type="date"
						name="date"
						value={formData.date}
						onChange={handleChange}
						className="w-full p-2 border rounded mb-4"
					/>

					<label className="block font-semibold">
						Event Start Time
					</label>
					<input
						type="time"
						name="startTime"
						value={formData.startTime}
						onChange={handleChange}
						className="w-full p-2 border rounded mb-4"
					/>

					<label className="block font-semibold">
						Event End Time
					</label>
					<input
						type="time"
						name="endTime"
						value={formData.endTime}
						onChange={handleChange}
						className="w-full p-2 border rounded mb-4"
					/>

					<label className="block font-semibold">
						Event Location
					</label>
					<input
						type="text"
						name="location"
						value={formData.location}
						onChange={handleChange}
						className="w-full p-2 border rounded mb-4"
					/>

					<label className="block font-semibold">
						Event Capacity
					</label>
					<input
						type="number"
						name="capacity"
						value={formData.capacity}
						onChange={handleChange}
						className="w-full p-2 border rounded mb-4"
					/>

					<label className="block font-semibold">Event Image</label>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="w-full mb-4"
					/>
					{imagePreview && (
						<img
							src={imagePreview}
							alt="Event"
							className="w-full h-64 object-cover mb-4"
						/>
					)}

					<button
						onClick={handleSave}
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
					>
						Save Changes
					</button>
				</>
			) : (
				<>
					<img
						src={`${event.image}`} // Use the relative path to the event.image}
						alt={event.title}
						className="w-full h-64 object-cover rounded-lg mb-4"
					/>
					<h1 className="text-3xl font-bold">{event.title}</h1>
					<p className="text-gray-600">{event.description}</p>
					<button
						onClick={() => setIsEditing(true)}
						className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
					>
						Edit Event
					</button>
				</>
			)}

			<h3 className="text-2xl font-semibold mt-8">Attendees</h3>
			{tickets.length > 0 ? (
				<div className="overflow-x-auto mt-4">
					<table className="min-w-full bg-white border border-gray-300">
						<thead>
							<tr className="bg-gray-200">
								<th className="py-2 px-4 border">Ticket ID</th>
								<th className="py-2 px-4 border">
									Attendee Name
								</th>
								<th className="py-2 px-4 border">QR Code</th>
							</tr>
						</thead>
						<tbody>
							{tickets.map((ticket) => (
								<tr key={ticket._id} className="text-center">
									<td className="py-2 px-4 border">
										{ticket._id}
									</td>
									<td className="py-2 px-4 border">
										{ticket.userName}
									</td>
									<td className="py-2 px-4 border">
										{ticket.qrCode ? (
											<img
												src={ticket.qrCode}
												alt="QR Code"
												className="mt-3 w-24 h-24 mx-auto"
												onError={(e) =>
													(e.target.src =
														"/default-placeholder.jpg")
												}
											/>
										) : (
											<span className="text-gray-500">
												No QR Code
											</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p className="text-gray-500 mt-4">No tickets booked yet.</p>
			)}
		</div>
	);
};

export default OrganizerEventDetail;
