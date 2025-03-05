import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Corrected import
import { logoutUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
	const { user, setUser } = useContext(AuthContext); // Use useContext
	const navigate = useNavigate();

	const handleLogout = () => {
		logoutUser();
		setUser(null);
		navigate("/login");
	};

	return (
		<div>
			<h2>User Profile</h2>
			{user ? (
				<>
					<p>Username: {user.username}</p>
					<p>Email: {user.email}</p>
					<button onClick={handleLogout}>Logout</button>
				</>
			) : (
				<p>Please log in.</p>
			)}
		</div>
	);
};

export default UserProfile;
