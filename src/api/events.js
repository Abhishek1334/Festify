import axios from "axios";
import process from "process";
const API_URL = import.meta.env.VITE_API_URL + "/api";

// Fetch all events
export const fetchEvents = async (token) => {
	try {
		const response = await axios.get(`${API_URL}/events`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		
		return response.data;
	} catch (error) {
		console.error("Error fetching events:", error);
		throw error;
	}
};

// Fetch event by ID
export const fetchEventById = async (eventId, token) => {
	try {
		const response = await axios.get(`${API_URL}/events/${eventId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching event by ID:", error);
		throw error;
	}
};

// Create a new event
export const createEvent = async (eventData, imageFile, token) => {
	try {
		const formData = new FormData();
		formData.append("title", eventData.title);
		formData.append("description", eventData.description);
		formData.append("date", eventData.date);
		formData.append("startTime", eventData.startTime);
		formData.append("endTime", eventData.endTime);
		formData.append("location", eventData.location);
		formData.append("organizerId", eventData.organizerId);
		formData.append("organizerName", eventData.organizerName);
		formData.append("capacity", eventData.capacity);
		formData.append("category", eventData.category);
		formData.append("image", imageFile); // Image file should be included here

		const response = await axios.post(`${API_URL}/`, formData, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error creating event:", error);
		throw error;
	}
};




// Update an existing event
export const updateEvent = async (eventId, eventData, token, imageFile) => {
	try {
		const formData = new FormData();

		// Append only non-null fields
		Object.entries(eventData).forEach(([key, value]) => {
			if (value) {
				formData.append(key, value);
			}
		});

		// Append image if provided
		if (imageFile) {
			formData.append("image", imageFile);
		}

		const response = await axios.put(
			`${API_URL}/events/${eventId}`,
			formData,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error updating event:", error);
		throw error;
	}
};



// Fetch User Events
export const fetchUserEvents = async (token) => {
	try {
		const response = await axios.get(`${API_URL}/events/my-events`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data || []; // Ensure it returns an array
	} catch (error) {
		console.error("Error fetching user events:", error);
		return [];
	}
};

// Fetch Events by Category
export const fetchEventsByCategory = async (category) => {
	try {
		const response = await axios.get(`${API_URL}/events/category/${category}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching events by category:", error);
		return [];
	}
};

