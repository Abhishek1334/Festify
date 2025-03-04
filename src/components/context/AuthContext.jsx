import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		// Load user from localStorage on refresh
		const storedUser = localStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser) : null;
	});

	const navigate = useNavigate();

	// Function to handle login
	const login = async (email, password) => {
		try {
			const response = await fetch(
				"http://localhost:5000/api/auth/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				}
			);
			const data = await response.json();

			if (response.ok) {
				setUser(data.user); // Update state
				localStorage.setItem("user", JSON.stringify(data.user)); // Store user in localStorage
				localStorage.setItem("token", data.token); // Store token
				navigate("/"); // Redirect to homepage
			} else {
				alert(data.message); // Show error message
			}
		} catch (error) {
			console.error("Login failed", error);
			alert("Login failed. Please try again.");
		}
	};

	// Function to handle signup
	const signup = async (name, email, password) => {
		try {
			const response = await fetch(
				"http://localhost:5000/api/auth/signup",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ name, email, password }),
				}
			);
			const data = await response.json();

			if (response.ok) {
				setUser(data.user);
				localStorage.setItem("user", JSON.stringify(data.user));
				localStorage.setItem("token", data.token);
				navigate("/");
			} else {
				alert(data.message);
			}
		} catch (error) {
			console.error("Signup failed", error);
			alert("Signup failed. Please try again.");
		}
	};

	// Logout function
	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		navigate("/login");
	};

	return (
		<AuthContext.Provider value={{ user, login, signup, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
