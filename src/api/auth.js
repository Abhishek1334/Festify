const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (userData) => {
	const response = await fetch(`${API_URL}/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userData),
	});
	return response.json();
};

export const loginUser = async (userData) => {
	const response = await fetch(`${API_URL}/auth/login`, {
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
	const response = await fetch(`${API_URL}/auth/protected`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.json();
};

export const signup = async (userData) => {
	const response = await fetch(`${API_URL}/auth/signup`, {
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