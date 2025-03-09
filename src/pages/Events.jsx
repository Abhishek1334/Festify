import { fetchEvents } from "../api/events"; // Import API function
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EventCard from "../components/EventCard";
import Categories from "../components/Categories";

export default function Events() {
	const [events, setEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [visibleEvents, setVisibleEvents] = useState(6); // Only show 6 initially
	const [loading, setLoading] = useState(true);
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedCategory, setSelectedCategory] = useState(""); // Track selected category

	useEffect(() => {
		const loadEvents = async () => {
			setLoading(true);
			try {
				const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
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

	// ✅ Update category when user selects a new one
	useEffect(() => {
		const categoryFromParams = searchParams.get("category") || "";
		setSelectedCategory(categoryFromParams);
	}, [searchParams]);

	// ✅ Apply search + category filtering
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

			return (
				matchesQuery &&
				matchesLocation &&
				matchesDate &&
				matchesCategory
			);
		});

		setFilteredEvents(filtered);
	}, [events, searchParams, selectedCategory]);

	// ✅ Show more events when button is clicked
	const handleShowMore = () => {
		setVisibleEvents((prev) => prev + 6); // Show 6 more events each time
	};

	// ✅ Handle category selection from Categories component
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

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 hidden-section">
			{/* Pass handleCategorySelect to Categories Component */}
			<Categories
				selectedCategory={selectedCategory}
				onSelectCategory={handleCategorySelect}
			/>

			<h1 className="text-3xl font-bold text-gray-900 mb-8">
				{selectedCategory? `${selectedCategory} Events` : "All Events"}
			</h1>

			{loading ? (
				<div className="flex justify-center items-center h-32">
					<div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
				</div>
			) : filteredEvents.length > 0 ? (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{filteredEvents.slice(0, visibleEvents).map((event) => (
							<EventCard key={event._id} event={event} />
						))}
					</div>

					{/* Show More Button */}
					{visibleEvents < filteredEvents.length && (
						<div className="flex justify-center mt-6">
							<button
								onClick={handleShowMore}
								className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
