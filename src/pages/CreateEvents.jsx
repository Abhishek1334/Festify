import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import categories from "../categories.json";
const API_URL = import.meta.env.VITE_API_URL + "/api";
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
		category: "General",
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
			setImage(file);
		}
	};

	// Function to upload image to Cloudinary
	const uploadImageToCloudinary = async (imageFile) => {
		const formData = new FormData();
		formData.append("file", imageFile);
		formData.append("upload_preset", "festify"); // Replace with your actual upload preset

		try {
			const response = await axios.post(
				"https://api.cloudinary.com/v1_1/dmgyx29ou/image/upload",
				formData
			);
			console.log("✅ Cloudinary Response:", response.data);

			return response.data.public_id; // Return public_id of uploaded image
		} catch (error) {
			console.error("❌ Cloudinary Upload Error:", error);
			throw new Error("Failed to upload image. Please try again.");
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
			// ✅ Fetch user details
			const user = JSON.parse(localStorage.getItem("user")) || {};
			const token = user?.token;
			const organizerId = user?.id;
			const organizerName = user?.username;

			if (!token || !organizerId || !organizerName) {
				setError("⚠️ Authentication error. Please log in again.");
				setLoading(false);
				return;
			}

			// ✅ Step 1: Upload image to Cloudinary
			let publicId;
			try {
				publicId = await uploadImageToCloudinary(image);
			} catch (uploadError) {
				setError(uploadError.message);
				setLoading(false);
				return;
			}

			// ✅ Step 2: Convert date fields
			const eventDate = new Date(formData.date).toISOString();
			const startTime = new Date(
				`${formData.date}T${formData.startTime}:00`
			).toISOString();
			const endTime = new Date(
				`${formData.date}T${formData.endTime}:00`
			).toISOString();

			// ✅ Step 3: Prepare event data with Cloudinary image
			const eventData = {
				title: formData.title,
				description: formData.description,
				date: eventDate,
				startTime,
				endTime,
				location: formData.location,
				capacity: formData.capacity,
				category: formData.category || "General",
				image: publicId, // ✅ Ensure image is included
				organizerId,
				organizerName,
			};

			console.log("📤 Event Data Sent to Backend:", eventData);

			// ✅ Step 4: Send event data to backend
			
			await axios.post(`${API_URL}/events`, eventData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			navigate("/events");
		} catch (err) {
			setError(err.response?.data?.message || "Error creating event.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-gradient-to-br from-purple-500 to-indigo-300 min-h-[82vh] flex items-center justify-center py-8">
			<div className="max-w-3xl mx-auto p-8 shadow-xl rounded-lg bg-white">
				<h2 className="text-3xl font-semibold text-center mb-6">
					Create Event
				</h2>
				{error && (
					<p className="text-red-500 text-center mb-4">{error}</p>
				)}
				<form onSubmit={handleSubmit} className="grid gap-6">
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
					<div className="grid grid-cols-2 gap-4">
						<label className="w-full">
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
						<label className="w-full">
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
					</div>
					<input
						type="text"
						name="location"
						placeholder="Event Location"
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
						className="btn-primary mt-4 w-full"
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
