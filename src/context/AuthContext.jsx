import {
	createContext,
	useState,
	useEffect,
	useContext,
	useCallback,
} from "react";
import axios from "axios";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { bookTicket as bookTicketAPI } from "../api/ticket"; // ✅ Import API function

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [tickets, setTickets] = useState([]);
	const navigate = useNavigate();
	const API_URL = import.meta.env.VITE_API_URL;

	// Load user from localStorage
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (error) {
				console.error(
					"Failed to parse user data from localStorage:",
					error
				);
				localStorage.removeItem("user"); // Remove invalid data
			}
		}
	}, []);



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

	// ✅ Logout function to prevent unnecessary API calls
	const logout = () => {
		setUser(null);
		setTickets([]);
		localStorage.removeItem("user");
		navigate("/");
	};

	// ✅ Fetch User Tickets with useCallback to prevent infinite loops
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
	}, [user?.token, API_URL]); // ✅ Ensures stable function reference

	// ✅ Fetch tickets when user logs in
	useEffect(() => {
		fetchTickets();
	}, [fetchTickets]); // ✅ Runs only when `fetchTickets` reference changes

	// ✅ Book a Ticket
	const bookTicket = async (eventId) => {
		if (!user) {
			alert("You must be logged in to book a ticket.");
			return;
		}

		try {
			const ticket = await bookTicketAPI(eventId, user.token);
			setTickets((prevTickets) => [...prevTickets, ticket]); // ✅ Update state safely
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

// ✅ Custom hook for consuming AuthContext
export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
