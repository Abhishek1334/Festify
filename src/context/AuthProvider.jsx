import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { bookTicket as bookTicketAPI } from "../api/ticket";
import { AuthContext } from "./AuthContext"; // ✅ Import from separate file

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser) : null;
	});
	const [tickets, setTickets] = useState([]);
	const navigate = useNavigate();
	const API_URL = import.meta.env.VITE_API_URL;

	// Update localStorage whenever user state changes
	useEffect(() => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
		}
	}, [user]);

	// ✅ Signup function with better error handling
	const signup = async (name, email, password) => {
		try {
			const res = await axios.post(`${API_URL}/auth/signup`, {
				name,
				email,
				password,
			});
			setUser(res.data);
			localStorage.setItem("user", JSON.stringify(res.data));
			return { success: true };
		} catch (error) {
			console.error("Signup failed", error.response?.data);
			return {
				success: false,
				message: error.response?.data?.message || "Signup failed",
			};
		}
	};

	// ✅ Login function with better error handling
	const login = async (email, password) => {
		try {
			const res = await axios.post(`${API_URL}/auth/login`, {
				email,
				password,
			});
			setUser(res.data);
			localStorage.setItem("user", JSON.stringify(res.data));
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
		navigate("/");
	};

	// ✅ Fetch User Tickets
	const fetchTickets = useCallback(async () => {
		if (!user?.token) return;
		try {
			const res = await axios.get(`${API_URL}/tickets/my-tickets`, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setTickets(res.data);
		} catch (error) {
			console.error("Error fetching tickets:", error);
		}
	}, [user?.token, API_URL]);

	// ✅ Fetch tickets when user logs in
	useEffect(() => {
		fetchTickets();
	}, [fetchTickets]);

	// ✅ Book a Ticket
	const bookTicket = async (eventId) => {
		if (!user) {
			alert("You must be logged in to book a ticket.");
			return;
		}

		try {
			const ticket = await bookTicketAPI(eventId, user.token);
			setTickets((prevTickets) => [...prevTickets, ticket]);
			alert("Ticket booked successfully!");
		} catch (error) {
			console.error("Failed to book ticket:", error);
			alert("Failed to book ticket.");
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
			console.error("Error canceling ticket:", error);
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
