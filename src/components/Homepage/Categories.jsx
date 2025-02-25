
import { Music, Theater, Film, Coffee, Users, Utensils, Palette, Mic } from 'lucide-react';


const categories = [
  { name: 'Music', icon: Music, color: 'bg-red-100 text-red-600 hover:bg-red-200' },
  { name: 'Theater', icon: Theater, color: 'bg-blue-100 text-blue-600 hover:bg-blue-200' },
  { name: 'Film', icon: Film, color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' },
  { name: 'Food & Drink', icon: Utensils, color: 'bg-green-100 text-green-600 hover:bg-green-200' },
  { name: 'Art', icon: Palette, color: 'bg-purple-100 text-purple-600 hover:bg-purple-200' },
  { name: 'Comedy', icon: Mic, color: 'bg-pink-100 text-pink-600 hover:bg-pink-200' },
  { name: 'Networking', icon: Users, color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200' },
  { name: 'Workshops', icon: Coffee, color: 'bg-orange-100 text-orange-600 hover:bg-orange-200' },
];

export default function Categories() {
	return (
		
		<section className="py-16 bg-white hidden-section relative">
		
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
			<h2 className="section-title text-center">
			Browse by Category
			</h2>
			
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
			{categories.map((category) => {
				const Icon = category.icon;
				return (
				<button
					key={category.name}
					className="flex flex-col items-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-200 
							transform hover:-translate-y-1 hover:shadow-lg hidden-section"
				>
					<div className={`p-4 rounded-xl ${category.color} mb-4 transition-colors duration-200 
								hidden-section-hover:scale-110 transform`}>
					<Icon className="h-8 w-8" />
					</div>
					<span className="text-gray-900 font-medium hidden-section-hover:text-purple-600 transition-colors duration-200">
					{category.name}
					</span>
				</button>
				);
			})}
			</div>
		</div>
		
		</section>
	);
}