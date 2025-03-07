import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Ensure the path is correct

const API_URL = "http://localhost:5000/api/events";

// Fetch all events
export const fetchEvents = async () => {
	const { token } = useAuth();
	try {
		const response = await axios.get(API_URL, {
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
export const fetchEventById = async (eventId) => {
	const { token } = useAuth();
	try {
		const response = await axios.get(`${API_URL}/${eventId}`, {
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

// Create a new event (with File Upload Support)
export const createEvent = async (eventData) => {
	const { token } = useAuth();
	try {
		const response = await axios.post(API_URL, eventData, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "multipart/form-data", // Change this for file upload
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error creating event:", error);
		throw error;
	}
};

// Fetch User Events
export const fetchUserEvents = async () => {
	const { token } = useAuth();
	try {
		const response = await axios.get(`${API_URL}/my-events`, {
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
		const response = await axios.get(`${API_URL}/category/${category}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching events by category:", error);
		return [];
	}
};
