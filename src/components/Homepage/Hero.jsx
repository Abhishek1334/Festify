import { Calendar, MapPin, Users, Search } from "lucide-react";
import { motion } from "framer-motion";
import HeroImg from "../../assets/images/hero.jpeg"

const Hero = () => {
	return (
		<section className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-700 min-h-[70vh]">
			{/* Background Image & Overlay */}
			<div className="absolute inset-0">
				<img
					src={HeroImg}
					alt="Festival background"
					className="w-full h-full object-cover opacity-40"
				/>
				<div className="absolute inset-0 bg-gradient-to-br from-purple-500/90 to-indigo-700/50" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-purple-500/10 to-indigo-700/20" />
			</div>

			{/* Content */}
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left Column */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className="space-y-8"
					>
						<motion.h1
							className="text-5xl md:text-7xl font-bold text-white leading-tight"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.8 }}
						>
							Discover
							<motion.span
								className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-[length:200%_100%]"
								animate={{
									backgroundPosition: ["0%", "100%", "0%"],
								}}
								transition={{
									duration: 5,
									repeat: Infinity,
									ease: "linear",
								}}
							>
								Amazing Events
							</motion.span>
						</motion.h1>

						<motion.p
							className="text-xl text-purple-100 leading-relaxed max-w-xl"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4, duration: 0.8 }}
						>
							Find and book tickets for the best local events,
							festivals, and experiences. Join a vibrant community
							of event enthusiasts near you!
						</motion.p>


						{/* Stats */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8, duration: 0.8 }}
							className="grid grid-cols-3 gap-8"
						>
							{[
								{
									icon: Calendar,
									count: "1000+",
									label: "Events",
								},
								{ icon: Users, count: "50k+", label: "Users" },
								{
									icon: MapPin,
									count: "100+",
									label: "Cities",
								},
							].map((stat, index) => (
								<div
									key={index}
									className="flex flex-col items-center gap-2 text-purple-100"
								>
									<stat.icon className="w-6 h-6 mb-1" />
									<div className="text-2xl font-bold">
										{stat.count}
									</div>
									<div className="text-sm opacity-80">
										{stat.label}
									</div>
								</div>
							))}
						</motion.div>
					</motion.div>

					{/* Right Column */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.4, duration: 0.8 }}
						className="relative hidden lg:block"
					>
						<div className="relative">
							<motion.img
								src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80"
								alt="Featured event"
								className="rounded-2xl shadow-2xl"
								initial={{ y: 20 }}
								animate={{ y: 0 }}
								transition={{
									repeat: Infinity,
									repeatType: "reverse",
									duration: 2,
									ease: "easeInOut",
								}}
							/>
							<motion.div
								className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg"
								initial={{ x: 20 }}
								animate={{ x: 0 }}
								transition={{
									repeat: Infinity,
									repeatType: "reverse",
									duration: 2,
									delay: 0.5,
									ease: "easeInOut",
								}}
							>
								<div className="text-white">
									<p className="font-semibold text-lg">
										Next Big Event
									</p>
									<p className="text-purple-200">
										This Weekend
									</p>
								</div>
							</motion.div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

export default Hero;
