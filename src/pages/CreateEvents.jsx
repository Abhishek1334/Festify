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
		timing: "",
		location: "",
		capacity: "",
		category: "", // Default empty category
	});
	const [image, setImage] = useState(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	// Handle input changes
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Handle file upload
	const handleFileChange = (e) => {
		setImage(e.target.files[0]);
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		// Validate required fields
		if (
			!formData.title ||
			!formData.description ||
			!formData.date ||
			!formData.timing ||
			!formData.location ||
			!formData.capacity
		) {
			setError("All fields except category are required.");
			setLoading(false);
			return;
		}

		if (!image) {
			setError("Please upload an event image.");
			setLoading(false);
			return;
		}

		try {
			// Retrieve user token safely
			const user = JSON.parse(localStorage.getItem("user")) || {};
			const token = user?.token;

			if (!token) {
				setError(
					"Authentication error: No token found. Please log in again."
				);
				setLoading(false);
				return;
			}

			// Ensure category is never empty
			const categoryValue = formData.category.trim()
				? formData.category
				: "Uncategorized";

			const eventData = new FormData();
			Object.keys(formData).forEach((key) => {
				eventData.append(
					key,
					key === "category" ? categoryValue : formData[key]
				);
			});
			eventData.append("image", image);

			// Debugging: Log form data before sending
			console.log("🔍 FormData before sending:");
			for (let pair of eventData.entries()) {
				console.log(pair[0], pair[1]);
			}

			// Ensure API URL is correctly set
			const apiUrl =
				(import.meta.env.VITE_API_URL || "http://localhost:5000") +
				"/events";
			const response = await axios.post(apiUrl, eventData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			});

			console.log("✅ Event Created Successfully:", response.data);
			navigate("/events"); // Redirect after success
		} catch (err) {
			console.error("❌ Error creating event:", err.response?.data);
			setError(err.response?.data?.message || "Error creating event");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
			<h2 className="text-2xl font-bold mb-4">Create Event</h2>

			{error && <p className="text-red-500">{error}</p>}

			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="title"
					placeholder="Event Title"
					value={formData.title}
					onChange={handleChange}
					required
					className="w-full p-2 mb-2 border rounded"
				/>
				<textarea
					name="description"
					placeholder="Event Description"
					value={formData.description}
					onChange={handleChange}
					required
					className="w-full p-2 mb-2 border rounded"
				/>
				<input
					type="date"
					name="date"
					value={formData.date}
					onChange={handleChange}
					required
					className="w-full p-2 mb-2 border rounded"
				/>
				<input
					type="time"
					name="timing"
					value={formData.timing}
					onChange={handleChange}
					required
					className="w-full p-2 mb-2 border rounded"
				/>
				<input
					type="text"
					name="location"
					placeholder="Location"
					value={formData.location}
					onChange={handleChange}
					required
					className="w-full p-2 mb-2 border rounded"
				/>
				<input
					type="number"
					name="capacity"
					placeholder="Capacity"
					value={formData.capacity}
					onChange={handleChange}
					required
					className="w-full p-2 mb-2 border rounded"
				/>
				<select
					name="category"
					value={formData.category}
					onChange={handleChange}
					className="w-full p-2 mb-2 border rounded"
				>
					<option value="">No Category</option>
					{categories.map((cat) => (
						<option key={cat.category} value={cat.category}>
							{cat.name}
						</option>
					))}
				</select>

				<input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					required
					className="w-full p-2 mb-2 border rounded"
				/>

				<button
					type="submit"
					className="w-full bg-blue-600 text-white p-2 rounded mt-3"
					disabled={loading}
				>
					{loading ? "Creating Event..." : "Create Event"}
				</button>
			</form>
		</div>
	);
};

export default CreateEvents;
