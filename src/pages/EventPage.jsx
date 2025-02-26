import {  useParams,Link } from "react-router-dom";
import {
	Calendar,
	Clock,
	MapPin,
	Users,
	Heart,
	Share2,
	MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import events from "../events.json";

export default function EventPage() {
	const Params = useParams();
	console.log(Params);

	const id = parseInt(useParams().eventid, 10) || 0;
	const event = events.find((event) => event.id === id);

	if (!event) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<h1 className="text-3xl font-bold text-gray-900">
					Event Not Found
				</h1>
				<p className="text-gray-600 mt-4">
					Sorry, the event you are looking for does not exist.
				</p>
				<Link
					to="/events"
					className="mt-6 inline-block bg-purple-600 text-white px-4 py-2 rounded-md"
				>
					Back to Events
				</Link>
			</div>
		)
	}


	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="bg-white rounded-xl shadow-lg overflow-hidden">
				<div className="relative h-96">
					<img
						src={event.imageUrl}
						alt={event.title}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
				</div>

				<div className="p-8">
					<div className="flex items-start justify-between">
						<div>
							<h1 className="text-4xl font-bold text-gray-900 mb-4">
								{event.title}
							</h1>
							<div className="flex items-center space-x-6 text-gray-600 mb-6">
								<div className="flex items-center">
									<Calendar className="h-5 w-5 mr-2" />
									<span>
										{format(
											new Date(event.date),
											"MMMM d, yyyy"
										)}
									</span>
								</div>
								<div className="flex items-center">
									<Clock className="h-5 w-5 mr-2" />
									<span>
										{format(new Date(event.date), "h:mm a")}
									</span>
								</div>
								<div className="flex items-center">
									<MapPin className="h-5 w-5 mr-2" />
									<span>{event.location}</span>
								</div>
							</div>
						</div>
						<div className="flex space-x-4">
							<button className="btn-primary">RSVP Now</button>
							<button className="btn-secondary flex items-center">
								<Share2 className="h-5 w-5 mr-2" />
								Share
							</button>
						</div>
					</div>

					

					<div className="prose max-w-none mb-8">
						<p className="text-gray-600 text-lg">
							{event.description}
						</p>
					</div>

					<div className="flex items-center space-x-8 border-t border-gray-200 pt-8">
						<button className="flex items-center text-gray-600 hover:text-purple-600">
							<Heart className="h-6 w-6 mr-2" />
							<span>{event.likes} Likes</span>
						</button>
						<button className="flex items-center text-gray-600 hover:text-purple-600">
							<MessageSquare className="h-6 w-6 mr-2" />
							<span>{event.comments} Comments</span>
						</button>
						<div className="flex items-center text-gray-600">
							<Users className="h-6 w-6 mr-2" />
							<span>{event.capacity} Capacity</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
