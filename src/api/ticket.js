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
					"Content-Type": "application/json",
				},
			}
		);

		// ✅ Return full ticket object with updated QR Code and organizerId
		return response.data;
	} catch (error) {
		const errData = error.response?.data || { message: "Unknown error" };
		console.error("Error booking ticket:", errData);
		throw new Error(errData.message || "Ticket booking failed");
	}
};
