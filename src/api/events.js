import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // http://localhost:5000/api
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
export const createEvent = async (eventData, token) => {
	try {
		const response = await axios.post(`${API_URL}/events`, eventData, {
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
export const updateEvent = async (eventId, eventData, token) => {
	try {
		const response = await axios.put(`${API_URL}/events/${eventId}`, eventData, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "multipart/form-data",
			},
		});
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
		console.log("API Response:", response.data); // Debugging
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

