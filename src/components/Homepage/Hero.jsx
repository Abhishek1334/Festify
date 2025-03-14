import { Link } from "react-router-dom";
import { Search, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
	const [searchQuery, setSearchQuery] = useState("");
	const [location, setLocation] = useState("");
	const [date, setDate] = useState("");
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		const queryParams = new URLSearchParams();
		if (searchQuery) queryParams.append("q", searchQuery);
		if (location) queryParams.append("location", location);
		if (date) queryParams.append("date", date);
		navigate(`/events?${queryParams.toString()}`);
		console.log(queryParams.toString());
		};



	return (
		<section className="hidden-section relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-700 min-h-[600px] flex items-center">
			<div className="absolute inset-0">
				<img
					src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"
					alt="Festival background"
					className="w-full h-full object-cover opacity-80"
				/>
				<div className="absolute inset-0 bg-gradient-to-br from-purple-500/90 to-indigo-700/50" />
				<div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 max-md:py-11">
				{/* Hero Content */}
				<div className=" max-w-6xl mx-auto px-6 py-12 max-md:py-3 grid grid-cols-1 md:grid-cols-2 gap-10 ">
					{/* Left Section */}
					<div className="flex flex-col justify-center space-y-7 ">
						<h1 className="text-[3.4rem] md:text-6xl font-bold text-white leading-tight drop-shadow-md  ">
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 2 }}
							>
								Discover Amazing Events
								<span className="block text-[4rem] text-purple-100">
									<motion.div
										className="text-6xl font-bold relative"
										style={{
											background:
												"linear-gradient(90deg, #f0f0f0, #b0b0b0, #d9d9d9, #ffffff, #f0f0f0)",
											backgroundSize: "300% 100%",
											WebkitBackgroundClip: "text",
											WebkitTextFillColor: "transparent",
										}}
										animate={{
											backgroundPosition: [
												"0% 50%",
												"100% 50%",
											],
										}}
										transition={{
											repeat: Infinity,
											duration: 2,
											ease: "linear",
										}}
									>
										NEAR YOU
									</motion.div>
								</span>
							</motion.div>
						</h1>
						<motion.div
							initial={{ opacity: 0, y: 100 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1.5 }}
						>
							<p className="text-xl text-gray-100 leading-relaxed">
								Find and book tickets for the best local events,
								festivals, and experiences happening in your
								area. Join the community of event enthusiasts!
							</p>
						</motion.div>

						{/* Stats Section */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 4 }}
						>
							<div className="grid grid-cols-3 gap-4 text-purple-100">
								<div className="text-center">
									<div className="text-3xl font-bold">
										1000+
									</div>
									<div className="text-sm">Events</div>
								</div>
								<div className="text-center">
									<div className="text-3xl font-bold">
										50k+
									</div>
									<div className="text-sm">Users</div>
								</div>
								<div className="text-center">
									<div className="text-3xl font-bold">
										100+
									</div>
									<div className="text-sm">Cities</div>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Right Section - Search Box */}
					<motion.div
						className="grid grid-cols-1 md:grid-cols-1"
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1.5, ease: "easeOut" }}
					>
						<motion.div className="flex flex-col ">
							<form
								onSubmit={handleSearch}
								className="bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 bg-[#24157194] space-y-4 my-auto h-fit "
							>
								{/* Search Input */}
								<div className="relative">
									<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

									<input
										type="text"
										placeholder="Search events..."
										className="w-full bg-white text-gray-600 placeholder-gray-500 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
										value={searchQuery}
										onChange={(e) =>
											setSearchQuery(e.target.value)
										}
									/>
								</div>

								{/* Location Input */}
								<div className="relative">
									<MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
									<input
										type="text"
										placeholder="Location"
										className="w-full bg-white text-gray-600 placeholder-gray-500 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
										value={location}
										onChange={(e) =>
											setLocation(e.target.value)
										}
									/>
								</div>

								{/* Date Input */}
								<div className="relative">
									<Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
									<input
										type="date"
										className="w-full bg-white text-gray-500 placeholder-gray-500 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
										value={date}
										onChange={(e) =>
											setDate(e.target.value)
										}
									/>
								</div>

								{/* Search Button */}
								<motion.div className="mt-4">
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										transition={{ duration: 0.2 }}
									>
										<button className="btn-primary mx-auto w-full">
											<Link
												to="/events"
												
											>
												Find Events
											</Link>
										</button>
									</motion.div>
								</motion.div>
							</form>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
