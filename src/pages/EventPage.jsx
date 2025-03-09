import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Pencil, Save } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import categoriesData from "../categories.json"

const EventPage = () => {
	const { eventid } = useParams();
	const [event, setEvent] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({});
	const [loading, setLoading] = useState(false);
	const [imagePreview, setImagePreview] = useState(null); 
	const [categories, setCategories] = useState([]);

	const { user } = useContext(AuthContext);

	useEffect(() => {
		setCategories(categoriesData);
	}, []);
	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/events/${eventid}`)
			.then((response) => {
				setEvent(response.data);
				setFormData(response.data);
				setImagePreview(`http://localhost:5000/${response.data.image}`);
			})
			.catch((error) => console.error("Error fetching event:", error));
	}, [eventid]);

	const isOrganizer =
		user && event && String(user.id) === String(event.organizerId?._id);

	// Handle form changes
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Handle image selection
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setFormData({ ...formData, image: file });

		// Update preview
		const reader = new FileReader();
		reader.onloadend = () => setImagePreview(reader.result);
		if (file) reader.readAsDataURL(file);
	};

	// Handle event update
	const handleSave = async () => {
		try {
			setLoading(true);

			const formDataToSend = new FormData();
			Object.keys(formData).forEach((key) => {
				formDataToSend.append(key, formData[key]);
			});

			const response = await axios.put(
				`http://localhost:5000/api/events/${eventid}`,
				formDataToSend,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			// Preserve the organizerId if it's missing from the response
			setEvent((prev) => ({
				...response.data,
				organizerId: response.data.organizerId || prev.organizerId,
			}));

			setFormData((prev) => ({
				...response.data,
				organizerId: response.data.organizerId || prev.organizerId,
			}));

			setIsEditing(false);
		} catch (error) {
			console.error("Error updating event:", error);
		} finally {
			setLoading(false);
		}
	};


	if (!event) {
		return (
			<div className="flex flex-col space-y-5 w-full h-[60vh] items-center justify-center bg-gray-200">
				<p className="text-xl font-semibold">Event not found</p>
				<Link to="/events">
					<button className="btn-secondary">Return to Events</button>
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="bg-white rounded-xl shadow-lg overflow-hidden">
				{/* Event Image */}
				<div className="relative h-96">
					<img
						src={imagePreview || "/default-placeholder.jpg"}
						alt={event.title}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
				</div>

				<div className="p-8">
					{isEditing ? (
						<input
							type="text"
							name="title"
							value={formData.title}
							onChange={handleChange}
							className="text-4xl font-bold w-full p-2 border border-gray-300 rounded"
						/>
					) : (
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							{event.title}
						</h1>
					)}

					<div className="flex items-center space-x-6 text-gray-600 mb-6">
						<div className="flex items-center">
							<Calendar className="h-5 w-5 mr-2" />
							{isEditing ? (
								<input
									type="date"
									name="date"
									value={formData.date?.split("T")[0] || ""}
									onChange={handleChange}
									className="border border-gray-300 p-1 rounded"
								/>
							) : (
								<span>
									{format(
										new Date(event.date),
										"MMMM d, yyyy"
									)}
								</span>
							)}
						</div>

						<div className="flex items-center">
							<MapPin className="h-5 w-5 mr-2" />
							{isEditing ? (
								<input
									type="text"
									name="location"
									value={formData.location}
									onChange={handleChange}
									className="border border-gray-300 p-1 rounded"
								/>
							) : (
								<span>{event.location}</span>
							)}
						</div>
					</div>

					{/* Show Category & Image ONLY when editing */}
					{isEditing && (
						<>
							{/* Category Selection */}
							<div className="flex items-center mb-4">
								<label className="mr-2">Category:</label>
								<select
									name="category"
									value={formData.category}
									onChange={handleChange}
								>
									<option value="">Select a category</option>
									{categories.length > 0 ? (
										categories.map((cat) => (
											<option
												key={cat.category}
												value={cat.category}
											>
												{cat.name}
											</option>
										))
									) : (
										<option disabled>
											Loading categories...
										</option>
									)}
								</select>
							</div>

							{/* Image Upload */}
							<div className="mb-4">
								<label className="block mb-2 font-semibold">
									Event Image:
								</label>
								<input
									type="file"
									name="image"
									accept="image/*"
									onChange={handleImageChange}
									className="border border-gray-300 p-2 rounded"
								/>
							</div>
						</>
					)}

					{/* Description */}
					{isEditing ? (
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							className="border border-gray-300 w-full p-2 rounded mb-4"
						/>
					) : (
						<p className="text-gray-600 text-lg mb-8">
							{event.description}
						</p>
					)}

					<span>
						Organized by: {event.organizerId?.name || "Unknown"}
					</span>

					<div className="flex space-x-4 mt-4">
						<button className="btn-primary">Get Tickets</button>

						{isOrganizer && !isEditing && (
							<button
								onClick={() => setIsEditing(true)}
								className="btn-secondary flex items-center"
							>
								<Pencil className="h-5 w-5 mr-2" />
								Edit Event
							</button>
						)}

						{isOrganizer && isEditing && (
							<button
								onClick={handleSave}
								className="btn-success flex items-center"
								disabled={loading}
							>
								{loading ? (
									"Saving..."
								) : (
									<>
										<Save className="h-5 w-5 mr-2" />
										Save Changes
									</>
								)}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventPage;
