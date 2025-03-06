import axios from "axios";

const API_URL = "http://localhost:5000/api/events";

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


// Fetch event by ID (✅ ADD THIS FUNCTION)
export const fetchEventById = async (eventId) => {
	try {
		const response = await axios.get(`${API_URL}/${eventId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching event by ID:", error);
		throw error;
	}
};

// Create a new event
export const createEvent = async (eventData, token) => {
	try {
		const response = await axios.post(API_URL, eventData, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error creating event:", error);
		throw error;
	}
};

export const fetchUserEvents = async (token) => {
	try {
		const response = await axios.get(`${API_URL}/events/user`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching user events:", error);
		throw error;
	}
};
