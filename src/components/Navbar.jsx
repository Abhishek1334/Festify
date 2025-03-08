import { Link, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import logo from "../assets/images/logo.png";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; 

export default function Navbar() {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout(); 
		navigate("/"); 
	};

	const isLoggedIn = !!user; // Check if user exists
	return (
		<section className="hidden-section sticky top-0 w-full z-50 bg-[rgb(250, 247, 232)] backdrop-blur-lg hover:bg-[rgba(255,255,255,1)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					<div className="flex items-center">
						<Link to="/" className="flex items-center space-x-2">
							<img
								src={logo}
								alt="Festify Logo"
								className="h-8 w-8"
							/>
							<span className="text-xl font-semibold ml-2 text-gray-900">
								Festify
							</span>
						</Link>
						<div className="hidden md:flex items-center space-x-8 ml-10">
							<Link
								to="/events"
								className="text-gray-700 transform hover:-translate-y-0.5 transition-all duration-200"
							>
								Events
							</Link>
							<Link
								to="/events/create-event"
								className="text-gray-700 transform hover:-translate-y-0.5 transition-all duration-200"
							>
								Create Event
							</Link>
						</div>
					</div>

					{/* Show Profile & Logout if logged in, otherwise show Login & Signup */}
					<div className="flex items-center space-x-4">
						{isLoggedIn ? (
							<>
								<Link
									to="/user-profile"
									className="flex items-center space-x-2 nav-link btn-secondary"
								>
									<User className="h-5 w-5" />
									<span>{user.name || "Profile"}</span>
								</Link>
								<button
									onClick={handleLogout}
									className="flex items-center space-x-2 nav-link btn-secondary"
								>
									<LogOut className="h-5 w-5" />
									<span>Logout</span>
								</button>
							</>
						) : (
							<>
								<Link to="/login" className="btn-secondary">
									Login
								</Link>
								<Link to="/signup" className="btn-primary">
									Sign Up
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
