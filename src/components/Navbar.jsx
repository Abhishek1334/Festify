import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import logo from "../assets/images/logo.png";
export default function Navbar() {
	const isLoggedIn = false;

	return (
		<section className="hidden-section sticky top-0 w-full border-b border-gray-100 z-50 bg-[rgb(250, 247, 2320.8)] backdrop-blur-xs hover:bg-[rgba(255,255,255,1)]  ">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					<div className="flex items-center">
						<Link to="/" className="flex items-center space-x-2">
							<img
								src={logo}
								alt="Festify Logo"
								className="h-8 w-8 "
							/>
							<span className="text-xl font-semibold ml-2 text-gray-900">
								Festify
							</span>
						</Link>
						<div className="hidden md:flex items-center space-x-8 ml-10">
							<Link
								to="/events"
								className="text-gray-700  transition duration-300"
							>
								Events
							</Link>
							<Link
								to="/create-event"
								className="text-gray-700  transition duration-300"
							>
								Create Event
							</Link>
						</div>
					</div>

					<div className="flex items-center space-x-4">
						{isLoggedIn ? (
							<>
								<Link
									to="/dashboard"
									className="flex items-center space-x-2 nav-link"
								>
									<User className="h-5 w-5" />
									<span>Dashboard</span>
								</Link>
								<button className="flex items-center space-x-2 nav-link">
									<LogOut className="h-5 w-5" />
									<span>Logout</span>
								</button>
							</>
						) : (
							<>
								<Link to="/login" className=" btn-secondary">
									Login
								</Link>
								<Link to="/signup" className=" btn-primary">
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
