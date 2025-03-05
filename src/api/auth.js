const API_URL = "http://localhost:5000/api/auth"; // Update this if needed

export const registerUser = async (userData) => {
	const response = await fetch(`${API_URL}/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userData),
	});
	return response.json();
};

export const loginUser = async (userData) => {
	const response = await fetch(`${API_URL}/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userData),
	});
	return response.json();
};

export const logoutUser = async () => {
	localStorage.removeItem("token");
};

export const fetchProtectedData = async (token) => {
	const response = await fetch(`${API_URL}/protected`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.json();
};

export const signup = async (userData) => {
	const response = await fetch("http://localhost:5000/api/auth/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(userData),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Signup failed");
	}

	return response.json();
};