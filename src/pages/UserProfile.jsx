import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Settings, Edit } from 'lucide-react';
import EventListing from '../components/Homepage/EventListing';

export default function UserProfile() {
    const user = {
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
        location: "New York, NY",
        bio: "Event organizer and music enthusiast",
        followers: 245,
        following: 182,
        events: [
        {
            id: 1,
            title: "Summer Music Festival 2025",
            description: "Join us for three days of amazing music featuring top artists from around the world.",
            date: "2025-07-15T18:00:00",
            location: "Central Park, New York",
            price: 149,
            capacity: 5000,
            imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80"
        }
        ],
        rsvps: [
        {
            id: 2,
            title: "Food & Wine Exhibition",
            description: "Discover the finest cuisines and wines from renowned chefs and sommeliers.",
            date: "2025-06-20T11:00:00",
            location: "Convention Center, Miami",
            price: 89,
            capacity: 1000,
            imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80"
        }
        ]
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex space-x-4">
                    <Link to="/settings" className="btn-secondary flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Settings
                    </Link>
                </div>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{user.location}</span>
                </div>
                <p className="text-gray-600 mb-6">{user.bio}</p>
                <div className="flex space-x-8">
                <div className="text-gray-600">
                    <span className="font-semibold text-gray-900">{user.following}</span> Following
                </div>
                <div className="text-gray-600">
                    <span className="font-semibold text-gray-900">{user.followers}</span> Followers
                </div>
                </div>
            </div>
            </div>
        </div>

        {/* User's Events */}
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {user.events.map(event => (
                <EventListing key={event.id} event={event} />
            ))}
            </div>
        </div>

        {/* User's RSVPs */}
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My RSVPs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {user.rsvps.map(event => (
                <EventListing key={event.id} event={event} />
            ))}
            </div>
        </div>
        </div>
    );
}