import { createContext, useContext, useState, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext();

export function AuthProvider({ children }) {
	// ✅ Fetch user from localStorage safely
	const storedUser = localStorage.getItem("user");

	let parsedUser = null;
	try {
		parsedUser = storedUser ? JSON.parse(storedUser) : null;
	} catch (error) {
		console.error("Error parsing user from localStorage:", error);
		localStorage.removeItem("user"); // Remove corrupted data
	}

	const [user, setUser] = useState(parsedUser);

	// ✅ Update localStorage when user changes
	useEffect(() => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
		}
	}, [user]);

	// ✅ Login function
	const login = (userData) => {
		setUser(userData);
		localStorage.setItem("user", JSON.stringify(userData));
	};

	// ✅ Logout function
	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

// Hook to use AuthContext
export function useAuth() {
	return useContext(AuthContext);
}
