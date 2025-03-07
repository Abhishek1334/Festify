import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateEvents = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		date: "",
		timing: "",
		location: "",
		price: "",
		capacity: "",
		category: "",
	});
	const [image, setImage] = useState(null);
	const [error, setError] = useState("");

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
		setError(""); // Reset errors

		// Validate fields
		if (
			!formData.title ||
			!formData.description ||
			!formData.date ||
			!formData.timing ||
			!formData.location ||
			!formData.price ||
			!formData.capacity ||
			!formData.category
		) {
			setError("All fields are required.");
			return;
		}

		// Validate image upload
		if (!image) {
			setError("Please upload an event image.");
			return;
		}

		try {
			const token = JSON.parse(localStorage.getItem("user"))?.token; // ✅ Correct token retrieval

			if (!token) {
				setError("Authentication required. Please log in.");
				return;
			}

			const backendUrl =
				import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"; // ✅ Ensure backend URL exists
			const apiUrl = `${backendUrl}/api/events`;

			console.log("API URL:", apiUrl);
			console.log("Token:", token);

			const eventData = new FormData();
			Object.keys(formData).forEach((key) => {
				eventData.append(key, formData[key]);
			});
			eventData.append("image", image);

			const response = await axios.post(apiUrl, eventData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			});

			console.log("Event Created:", response.data);
			navigate("/events"); // ✅ Redirect to events page after success
		} catch (err) {
			console.error(
				"Error creating event:",
				err.response?.data || err.message
			);
			setError(err.response?.data?.message || "Error creating event");
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
					name="price"
					placeholder="Ticket Price"
					value={formData.price}
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
				<input
					type="text"
					name="category"
					placeholder="Category"
					value={formData.category}
					onChange={handleChange}
					required
					className="w-full p-2 mb-2 border rounded"
				/>
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
				>
					Create Event
				</button>
			</form>
		</div>
	);
};

export default CreateEvents;
