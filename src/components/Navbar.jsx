import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import logo from "../assets/images/logo.png";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
	const authContext = useContext(AuthContext) || {};
	const { user, logout } = authContext;
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleLogout = () => {
		logout();
		setIsMenuOpen(false);
		navigate("/login");
	};

	const isLoggedIn = !!user;

	const closeMenu = () => setIsMenuOpen(false);

	return (
		<section className="hidden-section sticky top-0 w-full z-50 bg-[rgb(250, 247, 232)] backdrop-blur-lg hover:bg-[rgba(255,255,255,1)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Logo */}
					<div className="flex items-center">
						<Link
							to="/"
							className="flex items-center space-x-2"
							onClick={closeMenu}
						>
							<img
								src={logo}
								alt="Festify Logo"
								className="h-8 w-8"
							/>
							<span className="text-xl font-semibold ml-2 text-gray-900">
								Festify
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
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
						{isLoggedIn ? (
							<>
								<Link
									to="/user-profile"
									className="flex items-center space-x-2 nav-link btn-secondary"
								>
									<User className="h-5 w-5" />
									<span>{user?.username || "Profile"}</span>
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

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
					>
						{isMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</button>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg rounded-b-lg border-t border-gray-100">
						<div className="flex flex-col space-y-4 px-4 py-6">
							<Link
								to="/events"
								className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
								onClick={closeMenu}
							>
								<span>Events</span>
							</Link>
							<Link
								to="/events/create-event"
								className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
								onClick={closeMenu}
							>
								<span>Create Event</span>
							</Link>
							{isLoggedIn ? (
								<>
									<Link
										to="/user-profile"
										className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
										onClick={closeMenu}
									>
										<User className="h-5 w-5" />
										<span>{user?.name || "Profile"}</span>
									</Link>
									<button
										onClick={handleLogout}
										className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
									>
										<LogOut className="h-5 w-5" />
										<span>Logout</span>
									</button>
								</>
							) : (
								<div className="flex flex-col space-y-2">
									<Link
										to="/login"
										className="w-full py-2 px-4 text-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
										onClick={closeMenu}
									>
										Login
									</Link>
									<Link
										to="/signup"
										className="w-full py-2 px-4 text-center rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
										onClick={closeMenu}
									>
										Sign Up
									</Link>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
