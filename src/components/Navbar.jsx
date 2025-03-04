import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";
import { Menu, X } from "lucide-react"; // Icons for mobile menu
import logo from "../assets/images/logo.png";

export default function Navbar() {
	const { user, valid, logout } = useAuth();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/80 shadow-md z-50">
			<div className="container mx-auto px-6 py-4 flex justify-between items-center">
				{/* Logo */}
				<Link to="/" className="flex items-center space-x-2">
					<img src={logo} alt="Festify" className="h-10 w-auto" />
					<span className="text-2xl font-bold text-gray-800">
						Festify
					</span>
				</Link>

				{/* Desktop Menu */}
				<div className="hidden md:flex space-x-6">
					<Link
						to="/"
						className="text-gray-600 hover:text-gray-800 transition"
					>
						Home
					</Link>
					<Link
						to="/events"
						className="text-gray-600 hover:text-gray-800 transition"
					>
						Events
					</Link>
					{valid ? (
						<>
							<Link
								to="/profile"
								className="text-gray-600 hover:text-gray-800 transition"
							>
								{user?.name}
							</Link>
							<button
								onClick={logout}
								className="text-red-600 hover:text-red-800 transition"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								to="/login"
								className="text-gray-600 hover:text-gray-800 transition"
							>
								Login
							</Link>
							<Link
								to="/signup"
								className="text-gray-600 hover:text-gray-800 transition"
							>
								Signup
							</Link>
						</>
					)}
				</div>

				{/* Mobile Menu Button */}
				<button
					className="md:hidden text-gray-800"
					onClick={() => setIsOpen(!isOpen)}
				>
					{isOpen ? <X size={28} /> : <Menu size={28} />}
				</button>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div className="md:hidden bg-white/80 backdrop-blur-md absolute top-16 left-0 w-full py-4 shadow-md">
					<div className="flex flex-col items-center space-y-4">
						<Link
							to="/"
							className="text-gray-600 hover:text-gray-800 transition"
							onClick={() => setIsOpen(false)}
						>
							Home
						</Link>
						<Link
							to="/events"
							className="text-gray-600 hover:text-gray-800 transition"
							onClick={() => setIsOpen(false)}
						>
							Events
						</Link>
						{valid ? (
							<>
								<Link
									to="/profile"
									className="text-gray-600 hover:text-gray-800 transition"
									onClick={() => setIsOpen(false)}
								>
									{user?.name}
								</Link>
								<button
									onClick={() => {
										logout();
										setIsOpen(false);
									}}
									className="text-red-600 hover:text-red-800 transition"
								>
									Logout
								</button>
							</>
						) : (
							<>
								<Link
									to="/login"
									className="text-gray-600 hover:text-gray-800 transition"
									onClick={() => setIsOpen(false)}
								>
									Login
								</Link>
								<Link
									to="/signup"
									className="text-gray-600 hover:text-gray-800 transition"
									onClick={() => setIsOpen(false)}
								>
									Signup
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
