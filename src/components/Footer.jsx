import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
    <footer className="bg-blue-100 text-blue-950 py-6 px-2">
        <div className="container mx-auto flex flex-col items-center md:flex-row justify-between">
        {/* Logo Section */}
        <div className="flex items-center mb-4 md:mb-0">
            <img src={logo} alt="Festify Logo" className="h-10 mr-3" />
            <span className="text-xl font-semibold">Festify</span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap space-x-4 items-center justify-center mb-4 md:mb-0">
            <Link to="/about" className="hover:text-gray-400">About</Link>
            <Link to="/contact" className="hover:text-gray-400">Contact</Link>
            <Link to="/terms" className="hover:text-gray-400">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-gray-400">Privacy Policy</Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 size-6 rounded-[50%] grid place-items-center">
            <FaFacebookF className='size-4'/>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 size-6 rounded-[50%] grid place-items-center">
            <FaTwitter className='size-4'/>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 size-6 rounded-[50%] grid place-items-center">
            <FaInstagram className='size-4'/>
            </a>
        </div>
        </div>
        <div className="text-center text-blue-500 mt-4">
        <p>&copy; {new Date().getFullYear()} Festify. All rights reserved.</p>
        </div>
    </footer>
    );
};

export default Footer;
