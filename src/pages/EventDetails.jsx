import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Heart, Share2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function EventDetails() {
    // const { id } = useParams();
    // For demo purposes, using static data
    const event = {
        id: 1,
        title: "Summer Music Festival 2025",
        description: "Join us for three days of amazing music featuring top artists from around the world. Experience unforgettable performances, great food, and incredible atmosphere.",
        date: "2025-07-15T18:00:00",
        location: "Central Park, New York",
        price: 149,
        capacity: 5000,
        imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80",
        organizer: {
        id: 1,
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
        },
        likes: 245,
        comments: 32
    };

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
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                <div className="flex items-center space-x-6 text-gray-600 mb-6">
                    <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{format(new Date(event.date), 'h:mm a')}</span>
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

            <div className="flex items-center space-x-4 mb-8">
                <Link to={`/users/${event.organizer.id}`} className="flex items-center">
                <img
                    src={event.organizer.avatar}
                    alt={event.organizer.name}
                    className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                    <p className="font-medium text-gray-900">Organized by</p>
                    <p className="text-gray-600">{event.organizer.name}</p>
                </div>
                </Link>
            </div>

            <div className="prose max-w-none mb-8">
                <p className="text-gray-600 text-lg">{event.description}</p>
            </div>

            <div className="flex items-center space-x-8 border-t border-gray-200 pt-8">
                <button className="flex items-center text-gray-600 hover:text-purple-600">
                <Heart className="h-6 w-6 mr-2" />
                <span>{event.likes} likes</span>
                </button>
                <button className="flex items-center text-gray-600 hover:text-purple-600">
                <MessageSquare className="h-6 w-6 mr-2" />
                <span>{event.comments} comments</span>
                </button>
                <div className="flex items-center text-gray-600">
                <Users className="h-6 w-6 mr-2" />
                <span>{event.capacity} spots available</span>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}