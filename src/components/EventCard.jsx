import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Heart } from 'lucide-react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

export default function EventCard({ event }) {
  const [liked, setLiked] = useState(false);

  // Toggle like status
  const toggleLike = (e) => {
    e.stopPropagation(); 
    setLiked(!liked);

  };

  return (
    <div className="card hidden-section">
      
        <div className="relative overflow-hidden ">
          <img
            src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'}
            alt={event.title}
            className="w-full h-48 object-cover transform ani-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            {/* ✅ Like button that doesn't trigger navigation */}
            <button 
              onClick={toggleLike} 
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-200"
            >
              <Heart 
                className={`h-5 w-5 transition-colors duration-200 ${
                  liked ? 'text-red-500 fill-red-500' : 'text-gray-600'
                } `}
                onClick={toggleLike}

              />
            </button>
          </div>
        </div>
      
      <Link to={`/events/${event.id}`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 ani-hover:text-purple-600 transition-colors duration-200">
                {event.title}
              </h3>
              <p className="text-gray-600 line-clamp-2">{event.description}</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              ${event.price}
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2 text-purple-500" />
              <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2 text-purple-500" />
              <span>{format(new Date(event.date), 'h:mm a')}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2 text-purple-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2 text-purple-500" />
              <span>{event.capacity} spots available</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Link
              to={`/events/${event.id}`}
              className="btn-secondary text-sm px-4 py-2"
            >
              View Details
            </Link>
            <Link
              to={`/events/${event.id}/book`}
              className="btn-primary text-sm px-4 py-2"
            >
              Book Now
            </Link>
          </div>
        </div>
      </Link>  
    </div>
  );
}


{/*Prop Validation*/}
EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    date: PropTypes.instanceOf(Date).isRequired,
    location: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};