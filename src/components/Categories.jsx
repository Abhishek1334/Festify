import { useSearchParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import categories from "../categories.json";
import * as LucideIcons from "lucide-react";
import { useState } from "react";

export default function Categories({ isHomepage }) {
	const [isShowMore, setIsShowMore] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	// Get current selected category from URL params
	const selectedCategory = searchParams.get("category") || "";

	// Map categories with corresponding Lucide icons
	const categoriesWithIcons = categories.map((category) => ({
		...category,
		icon: LucideIcons[category.icon] || LucideIcons.HelpCircle, // Fallback icon
	}));

	// Dynamically determine which categories to show
	const displayedCategories = isShowMore
		? categoriesWithIcons
		: categoriesWithIcons.slice(0, 8);

	// ✅ Handle category selection
	const handleCategorySelect = (category) => {
		if (isHomepage) {
			// Redirect to Events page with the selected category
			navigate(`/events?category=${category}`, { replace: true });
		} else {
			// Stay on the Events page and update URL params
			setSearchParams((prevParams) => {
				const newParams = new URLSearchParams(prevParams);
				if (category === selectedCategory) {
					newParams.delete("category"); // Clear category if clicked again
				} else {
					newParams.set("category", category);
				}
				return newParams;
			});

			// ✅ Force reload by navigating to the same URL again
			navigate(`/events?category=${category}`, { replace: true });
		}
	};

	return (
		<section className="pt-4 pb-8 hidden-section relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
				<h2 className="section-title text-center text-xl">
					Browse by Category
				</h2>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 gap-x-0 pt-8">
					{displayedCategories.map((category) => {
						const Icon = category.icon;
						const isActive = selectedCategory === category.category;

						return (
							<button
								key={category.name}
								onClick={() =>
									handleCategorySelect(category.category)
								}
								className={`flex flex-col items-center p-5 rounded-xl transition-all duration-200 
									transform hover:-translate-y-1 hover:shadow-lg hidden-section ${
										isActive
											? "bg-gray-100 text-white"
											: "hover:bg-gray-50"
									}`}
							>
								<div
									className={`p-4 rounded-xl ${category.color} mb-4 transition-colors duration-200 
										hidden-section-hover:scale-110 transform`}
								>
									<Icon className="w-5 h-5" />
								</div>
								<span className="text-gray-900 font-medium hidden-section-hover:text-purple-600 transition-colors duration-200">
									{category.name}
								</span>
							</button>
						);
					})}
				</div>

				{/* Show More Button */}
				<div className="p-4 w-full flex justify-center">
					<button
						className="btn-secondary w-[50%] cursor-pointer"
						onClick={() => setIsShowMore(!isShowMore)}
					>
						{isShowMore ? "Show Less" : "Show More"}
					</button>
				</div>
			</div>
		</section>
	);
}

Categories.propTypes = {
	isHomepage: PropTypes.bool,
};
