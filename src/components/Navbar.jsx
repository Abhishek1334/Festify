import { FaSearch } from 'react-icons/fa';
import { IoIosArrowDropdownCircle } from "react-icons/io";
import logo from '../assets/images/logo.png';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Navbar = ({ isDesktop, isTablet, isMobile }) => {
    return (
        <>
            {isDesktop && (
                <div className="flex justify-between items-center bg-[var(--pale-apricot)] text-[var(--vibrant-orange)] px-6 py-4 w-full">
                    <Link to={"/"}>
                        <img src={logo} alt="logo" className="size-10" />
                    </Link>

                    <div className="flex items-center bg-gray-100 border rounded-3xl shadow-sm flex-1 mx-6">
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="flex-1 px-4 py-2 focus:outline-none"
                        />
                        <div className="w-px h-10 bg-gray-300" />
                        <input
                            type="text"
                            placeholder="Search by location..."
                            className="flex-1 px-4 py-2 focus:outline-none"
                        />
                        <button className="px-3 py-3 bg-[var(--vibrant-orange)] hover:bg-orange-400 transition-colors rounded-full m-1">
                            <FaSearch className="text-white text-xl" />
                        </button>
                    </div>

                    <ul className="flex items-center space-x-6 text-lg font-semibold">
                        <li><Link to={"/events"} className="hover:bg-gray-300 p-2 rounded-lg">Festify</Link></li>
                        <li><Link to={"/events"} className="hover:bg-gray-300 p-2 rounded-lg">Events</Link></li>
                        <li><Link to={"/login"} className="hover:bg-gray-300 p-2 rounded-lg">Log In</Link></li>
                        <li><Link to={"/signup"} className="hover:bg-gray-300 p-2 rounded-lg">Sign Up</Link></li>
                    </ul>
                </div>
            )}

            {isTablet && (
                <div className="flex flex-col items-center bg-gradient-to-b from-gray-200 via-gray-100 to-orange-100 py-4 px-6 w-full">
                    <Link to={"/"}>
                        <img src={logo} alt="logo" className="size-10 mb-2" />
                    </Link>

                    <div className="flex items-center bg-gray-100 border rounded-3xl shadow-sm w-[90%]">
                        <input type="text" placeholder="Search events..." className="flex-1 px-4 py-2 focus:outline-none" />
                        <div className="w-px h-10 bg-gray-300" />
                        <input type="text" placeholder="Search by location..." className="flex-1 px-4 py-2 focus:outline-none" />
                        <button className="px-3 py-3 bg-[var(--vibrant-orange)] hover:bg-orange-400 transition-colors rounded-full m-1">
                            <FaSearch className="text-white text-xl" />
                        </button>
                    </div>

                    <ul className="flex justify-around space-x-6 text-lg font-semibold w-full mt-2">
                        <li><Link to={"/events"} className="hover:bg-gray-200 p-2 rounded-lg">Events</Link></li>
                        <li><Link to={"/login"} className="hover:bg-gray-200 p-2 rounded-lg">Log In</Link></li>
                        <li><Link to={"/signup"} className="hover:bg-gray-200 p-2 rounded-lg">Sign Up</Link></li>
                    </ul>
                </div>
            )}

            {isMobile && (
                <div className="flex items-center justify-between bg-[var(--vibrant-orange)] py-4 px-6 w-full">
                    <Link to={"/"}>
                        <img src={logo} alt="logo" className="size-10" />
                    </Link>

                    <Menu as="div" className="relative">
                        <MenuButton className="flex items-center px-3 py-2 bg-[var(--pale-apricot)] text-[var(--vibrant-orange)] rounded-md hover:bg-gray-50">
                            <IoIosArrowDropdownCircle className="text-2xl" />
                        </MenuButton>

                        <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black/5">
                            <MenuItem>
                                <Link to={"/events"} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Events</Link>
                            </MenuItem>
                            <MenuItem>
                                <Link to={"/login"} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Log In</Link>
                            </MenuItem>
                            <MenuItem>
                                <Link to={"/signup"} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sign Up</Link>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            )}
        </>
    );
};

Navbar.propTypes = {
    isDesktop: PropTypes.bool.isRequired,
    isTablet: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
};

export default Navbar;
