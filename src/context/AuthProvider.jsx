import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { bookTicket as bookTicketAPI } from "../api/ticket";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL+"/api";
import "react-toastify/dist/ReactToastify.css";
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser) : null;
	});
	const [tickets, setTickets] = useState([]);
	const navigate = useNavigate();

	// ✅ Keep user data in sync with localStorage
	useEffect(() => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
		}
	}, [user]);

	// ✅ Fetch User Tickets
	const fetchTickets = useCallback(async () => {
		if (!user?.token) return;

		try {
			const res = await axios.get(`${API_URL}/tickets/my-tickets`, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setTickets(res.data);
		} catch (error) {
			console.error("Error fetching tickets:", error.response?.data);
		}
	}, [user]);

	// ✅ Auto-fetch tickets when user changes
	useEffect(() => {
		if (user) fetchTickets();
	}, [user, fetchTickets]);

	// ✅ Signup function
	const signup = async (name, email, password) => {
		try {
			const res = await axios.post(`${API_URL}/auth/signup`, {
				name,
				email,
				password,
			});

			const { id, name: username, email: userEmail, token } = res.data;
			setUser({ id, username, email: userEmail, token });

			return { success: true };
		} catch (error) {
			console.error("Signup failed", error.response?.data);
			return {
				success: false,
				message: error.response?.data?.message || "Signup failed",
			};
		}
	};

	// ✅ Login function
	const login = async (email, password) => {
		try {
			const res = await axios.post(`${API_URL}/auth/login`, {
				email,
				password,
			});

			const { id, name: username, email: userEmail, token } = res.data;
			setUser({ id, username, email: userEmail, token });

			return { success: true };
		} catch (error) {
			console.error("Login failed", error.response?.data);
			return {
				success: false,
				message: error.response?.data?.message || "Login failed",
			};
		}
	};

	// ✅ Logout function
	const logout = () => {
		setUser(null);
		setTickets([]);
		localStorage.removeItem("user");
	};

	// ✅ Book a Ticket
	const bookTicket = async (eventId) => {
		if (!user) {
			toast.error("You must be logged in to book a ticket.");
			return;
		}

		// Check if user already has a ticket for this event
		const alreadyBooked = tickets.some(
			(ticket) => ticket.eventId === eventId
		);
		if (alreadyBooked) {
			toast.info("🎟️ You already have a ticket for this event.");
			return;
		}

		try {
			const ticket = await bookTicketAPI(eventId, user.token);
			setTickets((prevTickets) => [...prevTickets, ticket]);

			toast.success("🎟️ Ticket booked successfully!");
		} catch (error) {
			console.error("Failed to book ticket:", error.response?.data);
			toast.error(
				error.response?.data?.message ||
					"Failed to book ticket. Please try again."
			);
		}
	};



	// ✅ Cancel a Ticket
	const cancelTicket = async (ticketId) => {
		try {
			await axios.delete(`${API_URL}/tickets/cancel/${ticketId}`, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setTickets((prevTickets) =>
				prevTickets.filter((t) => t._id !== ticketId)
			);
		} catch (error) {
			console.error("Error canceling ticket:", error.response?.data);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				tickets,
				signup,
				login,
				logout,
				bookTicket,
				cancelTicket,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
