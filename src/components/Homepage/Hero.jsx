
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
export default function Hero() {
	return (
		<section className="hidden-section relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-700 min-h-[600px] flex items-center">
		<div className="absolute inset-0">
		<img
		src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"
		alt="Festival background"
		className="w-full h-full object-cover opacity-99"
		/>
		<div className="absolute inset-0 bg-gradient-to-br from-purple-500/90 to-indigo-700/90" />
		<div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
		</div>
		
		<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 max-md:py-11">
		{/* Hero Content */}
		<div className=" max-w-6xl mx-auto px-6 py-12 max-md:py-3 grid grid-cols-1 md:grid-cols-2 gap-10 ">
		{/* Left Section */}
		<div className="flex flex-col justify-center space-y-7 ">
		<h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-md  ">
		<motion.div initial={{ y: -500 }} animate={{ y: 0 }} transition={{ duration: 1 }}>  Discover Amazing Events
		
		<span className="block text-[4rem] text-purple-100">NEAR YOU</span>
		</motion.div>
		</h1>
		<motion.p initial={{ y: -500 }} animate={{ y: 0 }} transition={{ duration: 0.8 }}>
		<p className="text-xl text-gray-100 leading-relaxed">
		Find and book tickets for the best local events, festivals, and experiences happening in your area.
		Join the community of event enthusiasts!
		</p></motion.p>
		
		{/* Stats Section */}
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1}} transition={{ duration: 4 }}>
		<div className="grid grid-cols-3 gap-4 text-purple-100">
		<div className="text-center">
		<div className="text-3xl font-bold">1000+</div>
		<div className="text-sm">Events</div>
		</div>
		<div className="text-center">
		<div className="text-3xl font-bold">50k+</div>
		<div className="text-sm">Users</div>
		</div>
		<div className="text-center">
		<div className="text-3xl font-bold">100+</div>
		<div className="text-sm">Cities</div>
		</div>
		</div>
		</motion.div>
		</div>
		
		
		
		{/* Right Section - Search Box */}
		<motion.div 
		className="grid grid-cols-1 md:grid-cols-1"
		initial={{ opacity: 0, y: 50 }} 
		animate={{ opacity: 1, y: 0 }} 
		transition={{ duration: 0.6, ease: "easeOut" }}
		>
		<motion.div 
		className="bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 bg-[#24157194] space-y-4 my-auto h-fit"
		initial={{ scale: 0.9, opacity: 0 }} 
		animate={{ scale: 1, opacity: 1 }} 
		transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
		>
		{/* Search Input */}
		<div className="relative">
		<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
		<input
		type="text"
		placeholder="Search events..."
		className="w-full bg-white text-gray-600 placeholder-gray-500 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
		/>
		</div>
		
		{/* Location Input */}
		<div className="relative">
		<MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
		<input
		type="text"
		placeholder="Location"
		className="w-full bg-white text-gray-600 placeholder-gray-500 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
		/>
		</div>
		
		{/* Date Input */}
		<div className="relative">
		<Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
		<input
		type="date"
		className="w-full bg-white text-gray-500 placeholder-gray-500 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
		/>
		</div>
		
		{/* Search Button */}
		<motion.div className="mt-4">
		<motion.div 
		whileHover={{ scale: 1.05 }} 
		whileTap={{ scale: 0.95 }} 
		transition={{ duration: 0.2 }}
		>
		<Link 
		to="/events" 
		className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 text-center"
		>
		Find Events
		</Link>
		</motion.div>
		</motion.div>
		</motion.div>
		</motion.div>
		
		</div>
		</div>
		
		</section>
	);
}