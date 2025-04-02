import { fetchEvents } from "../api/events";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EventCard from "../components/EventCard";
import Categories from "../components/Categories";

export default function Events() {
	const [events, setEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [visibleEvents, setVisibleEvents] = useState(6);
	const [loading, setLoading] = useState(true);
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("all"); // Track event status filter

	useEffect(() => {
		const loadEvents = async () => {
			setLoading(true);
			try {
				const token = localStorage.getItem("token");
				const data = await fetchEvents(token);
				setEvents(Array.isArray(data) ? data : []);
			} catch (error) {
				console.error("Error fetching events:", error);
			} finally {
				setLoading(false);
			}
		};

		loadEvents();
	}, []);

	useEffect(() => {
		const categoryFromParams = searchParams.get("category") || "";
		const statusFromParams = searchParams.get("status") || "all";
		setSelectedCategory(categoryFromParams);
		setSelectedStatus(statusFromParams);
	}, [searchParams]);

	const getEventStatus = (event) => {
		const now = new Date();
		const startTime = new Date(event.startTime);
		const endTime = new Date(event.endTime);

		// Convert to IST (UTC+5:30)
		const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
		const nowIST = new Date(now.getTime() + istOffset);
		const startTimeIST = new Date(startTime.getTime() + istOffset);
		const endTimeIST = new Date(endTime.getTime() + istOffset);

		if (nowIST < startTimeIST) {
			return "upcoming";
		} else if (nowIST > endTimeIST) {
			return "expired";
		} else {
			return "live";
		}
	};

	useEffect(() => {
		const query = searchParams.get("q")?.toLowerCase() || "";
		const location = searchParams.get("location")?.toLowerCase() || "";
		const date = searchParams.get("date") || "";

		const filtered = events.filter((event) => {
			const matchesQuery =
				!query || event.title.toLowerCase().includes(query);
			const matchesLocation =
				!location || event.location.toLowerCase().includes(location);
			const matchesDate = !date || event.date.startsWith(date);
			const matchesCategory =
				!selectedCategory || event.category === selectedCategory;

			// Apply status filter
			const eventStatus = getEventStatus(event);
			const matchesStatus =
				selectedStatus === "all" || eventStatus === selectedStatus;

			return (
				matchesQuery &&
				matchesLocation &&
				matchesDate &&
				matchesCategory &&
				matchesStatus
			);
		});

		// Sort events based on date and time
		const sortedFiltered = [...filtered].sort((a, b) => {
			const aStart = new Date(a.startTime);
			const bStart = new Date(b.startTime);
			return aStart - bStart;
		});

		setFilteredEvents(sortedFiltered);
	}, [events, searchParams, selectedCategory, selectedStatus]);

	const handleShowMore = () => {
		setVisibleEvents((prev) => prev + 6);
	};

	const handleCategorySelect = (category) => {
		setSearchParams((prevParams) => {
			const newParams = new URLSearchParams(prevParams);
			if (category) {
				newParams.set("category", category);
			} else {
				newParams.delete("category");
			}
			return newParams;
		});
	};

	const handleStatusSelect = (status) => {
		setSearchParams((prevParams) => {
			const newParams = new URLSearchParams(prevParams);
			if (status !== "all") {
				newParams.set("status", status);
			} else {
				newParams.delete("status");
			}
			return newParams;
		});
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 hidden-section">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 hidden-section">
				<Categories
					selectedCategory={selectedCategory}
					onSelectCategory={handleCategorySelect}
				/>
			</div>
			<div className="flex flex-row justify-between">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">
					{selectedCategory
						? `${selectedCategory} Events${
								selectedStatus !== "all"
									? ` - ${
											selectedStatus
												.charAt(0)
												.toUpperCase() +
											selectedStatus.slice(1)
									  }`
									: ""
						  }`
						: selectedStatus === "all"
						? "All Events"
						: `${
								selectedStatus.charAt(0).toUpperCase() +
								selectedStatus.slice(1)
						  } Events`}
				</h1>
				{/* Status Filter */}
				<div className="flex items-center gap-2 h-full">
					<span className="text-gray-700">Status:</span>
					<select
						value={selectedStatus}
						onChange={(e) => handleStatusSelect(e.target.value)}
						className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
					>
						<option value="all">All Events</option>
						<option value="upcoming">Upcoming</option>
						<option value="live">Live</option>
						<option value="expired">Expired</option>
					</select>
				</div>
			</div>
			{loading ? (
				<div className="flex justify-center items-center h-32">
					<div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
				</div>
			) : filteredEvents.length > 0 ? (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{filteredEvents.slice(0, visibleEvents).map((event) => (
							<EventCard
								key={event._id}
								event={event}
								status={getEventStatus(event)} // Pass status to EventCard
							/>
						))}
					</div>

					{visibleEvents < filteredEvents.length && (
						<div className="flex justify-center mt-6">
							<button
								onClick={handleShowMore}
								className="btn-secondary"
							>
								Show More
							</button>
						</div>
					)}
				</>
			) : (
				<p className="text-xl font-light text-gray-900 mb-8">
					No events found
				</p>
			)}
		</div>
	);
}
