import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api";

// Create axios instance with default config
const adminApi = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Add request interceptor to add auth token
adminApi.interceptors.request.use(
	(config) => {
		const user = JSON.parse(localStorage.getItem('user'));
		if (user?.token) {
			config.headers.Authorization = `Bearer ${user.token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add response interceptor to handle common errors
adminApi.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Clear invalid user data
			localStorage.removeItem('user');
		}
		return Promise.reject(error);
	}
);

export const fetchUsers = async (token) => {
	console.log(token)
	try {
		const response = await adminApi.get('/admin/users');
		return response.data;
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
};

export const fetchEvents = async (token) => {
	try {
		const response = await adminApi.get('/admin/events');
		return response.data;
	} catch (error) {
		console.error("Error fetching events:", error);
		throw error;
	}
};

export const deleteEvent = async(eventId) => {
	try {
		const response = await adminApi.delete(`/admin/events/${eventId}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting event:", error);
		throw error;
	}
}