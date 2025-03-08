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
		category: "",
		customCategory: "",
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
			!formData.capacity ||
			!(formData.category || formData.customCategory)
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
			const token = localStorage.getItem("token"); // Get token from local storage

			const eventData = new FormData();
			Object.keys(formData).forEach((key) => {
				if (key !== "customCategory") {
					eventData.append(key, formData[key]);
				}
			});

			// If user selected "Other", send the customCategory value
			const categoryToSend =
				formData.category === "Other"
					? formData.customCategory
					: formData.category;
			eventData.append("category", categoryToSend);
			eventData.append("image", image);

			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/events`,
				eventData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`, // Send auth token
					},
				}
			);

			// Redirect to events page after success
			navigate("/events");
		} catch (err) {
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
					required
					className="w-full p-2 mb-2 border rounded"
				>
					<option value="">Select a Category</option>
					<option value="Other">Other</option>{" "}
					{categories.map((cat) => (
						<option key={cat.category} value={cat.category}>
							{cat.name}
						</option>
					))}
					{/* Blank category for unmatched cases */}
				</select>

				{/* Show custom category input if "Other" is selected */}
				{formData.category === "Other" && (
					<input
						type="text"
						name="customCategory"
						placeholder="Enter custom category"
						value={formData.customCategory}
						onChange={handleChange}
						className="w-full p-2 mt-2 border rounded"
					/>
				)}

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
