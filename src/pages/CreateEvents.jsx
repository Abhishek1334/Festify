import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import categories from "../categories.json";

const CreateEvents = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		date: "",
		startTime: "",
		endTime: "",
		location: "",
		capacity: "",
		category: "General", // Default category
	});
	const [image, setImage] = useState(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	// Handle input changes
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Handle file selection
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			console.log("📸 Selected file:", file);
			setImage(file);
		}
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		if (!image) {
			setError("⚠️ Please upload an event image.");
			setLoading(false);
			return;
		}

		try {
			const user = JSON.parse(localStorage.getItem("user")) || {};
			const token = user?.token;
			const organizerId = user?.id;
			const organizerName = user?.name;

			if (!token) {
				setError(
					"⚠️ Authentication error: No token found. Please log in."
				);
				setLoading(false);
				return;
			}

			if (!organizerId || !organizerName) {
				setError("⚠️ Organizer details missing. Please log in again.");
				setLoading(false);
				return;
			}

			// ✅ Convert date fields to valid format
			const eventDate = new Date(formData.date).toISOString();
			const startTime = new Date(
				`${formData.date}T${formData.startTime}:00`
			).toISOString();
			const endTime = new Date(
				`${formData.date}T${formData.endTime}:00`
			).toISOString();

			const eventData = new FormData();
			eventData.append("title", formData.title);
			eventData.append("description", formData.description);
			eventData.append("date", eventDate);
			eventData.append("startTime", startTime);
			eventData.append("endTime", endTime);
			eventData.append("location", formData.location);
			eventData.append("capacity", formData.capacity);
			eventData.append("category", formData.category || "General"); // Default category if empty
			eventData.append("image", image);
			eventData.append("organizerId", organizerId);
			eventData.append("organizerName", organizerName);

			console.log("📤 Sending event data:", eventData);

			const apiUrl = import.meta.env.VITE_API_URL
				? `${import.meta.env.VITE_API_URL}/events`
				: "http://localhost:5000/api/events";

			await axios.post(apiUrl, eventData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			});

			navigate("/events");
		} catch (err) {
			console.error(
				"❌ Error creating event:",
				err.response?.data || err
			);
			setError(err.response?.data?.message || "Error creating event");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-gradient-to-br from-purple-500 to-indigo-300 min-h-[82vh] flex items-center justify-center py-8">
			<div className="max-w-[35vw] mx-auto p-6 shadow-black shadow-sm rounded-lg bg-gray-100">
				<h2 className="text-2xl font-semibold mb-4 w-[50vw]">
					Create Event
				</h2>
				{error && <p className="text-red-500">{error}</p>}
				<form onSubmit={handleSubmit} className="grid gap-4">
					<input
						type="text"
						name="title"
						placeholder="Event Title"
						value={formData.title}
						onChange={handleChange}
						required
						className="inputbox"
					/>
					<textarea
						name="description"
						placeholder="Event Description"
						value={formData.description}
						onChange={handleChange}
						required
						className="inputbox"
					/>
					<input
						type="date"
						name="date"
						value={formData.date}
						onChange={handleChange}
						required
						className="inputbox"
					/>
					<label>
						Start Time
						<input
							type="time"
							name="startTime"
							value={formData.startTime}
							onChange={handleChange}
							required
							className="inputbox"
						/>
					</label>
					<label>
						End Time
						<input
							type="time"
							name="endTime"
							value={formData.endTime}
							onChange={handleChange}
							required
							className="inputbox"
						/>
					</label>
					<input
						type="text"
						name="location"
						placeholder="Location"
						value={formData.location}
						onChange={handleChange}
						required
						className="inputbox"
					/>
					<input
						type="number"
						name="capacity"
						placeholder="Capacity"
						value={formData.capacity}
						onChange={handleChange}
						required
						className="inputbox"
					/>
					<label>
						Category
						<select
							name="category"
							value={formData.category}
							onChange={handleChange}
							className="inputbox"
						>
							<option value="General">General</option>
							{categories.map((cat) => (
								<option key={cat.category} value={cat.category}>
									{cat.name}
								</option>
							))}
						</select>
					</label>
					<label>
						Event Image
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							required
							className="inputbox"
						/>
					</label>
					<button
						type="submit"
						className="btn-primary mt-2"
						disabled={loading}
					>
						{loading ? "Creating Event..." : "Create Event"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateEvents;
