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
	const [attendees, setAttendees] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({});
	const [imagePreview, setImagePreview] = useState(null);
	const [imageFile, setImageFile] = useState(null);

	useEffect(() => {
		const fetchEventDetails = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/events/${eventId}`,
					{ headers: { Authorization: `Bearer ${user.token}` } }
				);
				setEvent(response.data);
				setFormData(response.data);
				setImagePreview(`http://localhost:5000/${response.data.image}`);
			} catch (err) {
				setError(err.message);
			}
		};

		const fetchTickets = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/tickets/event/${eventId}`,
					{ headers: { Authorization: `Bearer ${user.token}` } }
				);
				setTickets(response.data);
				fetchAttendeeNames(response.data);
			} catch (err) {
				setError(err.message);
			}
		};

		const fetchAttendeeNames = async (tickets) => {
			const attendeeData = {};
			await Promise.all(
				tickets.map(async (ticket) => {
					const userId = ticket.userId?._id || ticket.userId;
					if (!userId) return;

					try {
						const userResponse = await axios.get(
							`http://localhost:5000/api/users/${userId}`,
							{
								headers: {
									Authorization: `Bearer ${user.token}`,
								},
							}
						);
						attendeeData[userId] = userResponse.data.name;
					} catch (err) {
						console.error("Error fetching user details:", err);
						attendeeData[userId] = "Unknown";
					}
				})
			);
			setAttendees(attendeeData);
		};

		if (eventId && user) {
			Promise.all([fetchEventDetails(), fetchTickets()]).finally(() =>
				setLoading(false)
			);
		}
	}, [eventId, user]);

	// Handle input changes
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Handle image change
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImageFile(file);
		setImagePreview(URL.createObjectURL(file));
	};

	// Handle event update
	const handleSave = async () => {
		try {
			const updatedEvent = { ...formData };

			// If there's an image file, upload it first
			if (imageFile) {
				const formData = new FormData();
				formData.append("image", imageFile);

				const uploadResponse = await axios.post(
					`http://localhost:5000/api/events/upload/${eventId}`,
					formData,
					{
						headers: {
							Authorization: `Bearer ${user.token}`,
							"Content-Type": "multipart/form-data",
						},
					}
				);
				updatedEvent.image = uploadResponse.data.imagePath;
			}

			// Update event details
			const response = await axios.put(
				`http://localhost:5000/api/events/${eventId}`,
				updatedEvent,
				{ headers: { Authorization: `Bearer ${user.token}` } }
			);
			setEvent(response.data);
			setIsEditing(false);
		} catch (error) {
			console.error("Error updating event:", error);
		}
	};

	// Handle loading state
	if (loading) return <p className="text-center text-gray-500">Loading...</p>;

	// Handle error state
	if (error)
		return <p className="text-center text-red-500">Error: {error}</p>;

	// Handle case when event data is missing
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
					{/* Editable Fields */}
					<input
						type="text"
						name="title"
						value={formData.title}
						onChange={handleChange}
						className="w-full p-2 border rounded"
					/>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						className="w-full p-2 border rounded mt-2"
					/>

					{/* Image Upload */}
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="mt-2"
					/>

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
						src={imagePreview || "/default-placeholder.jpg"}
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
										{attendees[ticket.userId] ||
											"Loading..."}
									</td>
									<td className="py-2 px-4 border">
										<img
											src={ticket.qrCode}
											alt="QR Code"
											className="w-16 h-16 mx-auto"
										/>
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
