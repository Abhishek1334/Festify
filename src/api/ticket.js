import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api";

export const bookTicket = async (eventId, token) => {
	try {
		const response = await axios.post(
			`${API_URL}/tickets/book`,
			{ eventId },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error(
			"Error booking ticket:",
			error.response?.data || error.message
		);
		throw error;
	}
};
