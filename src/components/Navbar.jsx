import { FaSearch } from 'react-icons/fa';
import { IoIosArrowDropdownCircle } from "react-icons/io";
import logo from '../assets/images/logo.png';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Navbar = ({isDesktop,isTablet,isMobile}) => {

	return (
		<>
			{isDesktop && (
				<div className='flex flex-row justify-between items-center  bg-gray-200 px-4 py-4 whitespace-nowrap ' >
					<div className="flex items-center h-full logo w-fit  mr-8 ">
					<Link to={"/"}>
					<img src={logo} alt="logo" className='size-10'/></Link>
					</div>

					<div className="flex h-3/4 text-sm items-center  min-w-fit max-w-full  mx-auto bg-gray-100 border border-gray-300 rounded-3xl overflow-hidden shadow-sm flex-1 ">
					
					<input
						type="text"
						placeholder="Search events..."
						className="flex-1 px-4 pl-6 py-2 focus:outline-none"
					/>

					<div className="w-px h-10 bg-gray-300 " />
						<input
							type="text"
							placeholder="Search by location..."
							className="flex-1 px-4 py-2 pl-6 focus:outline-none"
						/>

						<button className="flex items-center justify-center px-3 py-3 bg-pink-500 hover:bg-pink-700 transition-colors rounded-4xl m-1">
							<FaSearch className="text-white text-xl" />
						</button>
					</div>

					<ul className='ml-10 w-1/4 flex flex-row justify-center space-x-8 h-full items-center text-lg text-navy-600 font-semibold mr-4 min-w-fit'>
						<li><Link to={"/events"} className='p-2 rounded-lg hover:bg-gray-300'>Events</Link></li>
						<div className="w-[2px] h-10 bg-gray-300 " />
						<li><Link to={"/login"} className='p-2 rounded-lg hover:bg-gray-300'>Log In</Link></li>
						<div className="w-[2px] h-10 bg-gray-300 " />
						<li><Link to={"/signup"} className='p-2 rounded-lg hover:bg-gray-300'>Sign Up</Link></li>
					</ul>
				</div>
			)}


			{isTablet && (
				<div className='flex flex-col justify-between items-center border-b border-gray-200 gap-3 bg-gray-100 px-4 py-4 whitespace-nowrap ' >

				<div className="flex items-center h-full  w-fit  mr-8 ">
					<Link to={"/"}><img src={logo} alt="logo" className='size-10'/></Link>
				</div>

				<ul className='ml-10  flex flex-row justify-center space-x-5 h-full items-center text-sm text-navy-600 font-semibold mr-4 w-[80%] '>
					<li><Link to={"/events"} className='flex-1 p-2 rounded-lg hover:bg-gray-200 flex justify-center'>Events
					</Link></li>
					<div className="w-[2px] h-10 bg-gray-300 " />
					
					<li><Link to={"/login"} className='flex-1 p-2 rounded-lg hover:bg-gray-200 flex justify-center'>Log In</Link></li>
					<div className="w-[2px] h-10 bg-gray-300 " />
					<li><Link to={"/signup"} className='flex-1 p-2 rounded-lg hover:bg-gray-200 flex justify-center'>Sign Up</Link></li>
				</ul>
				
				<div className="flex  h-3/4 text-sm items-center   w-full  mx-auto bg-gray-100 border border-gray-300 rounded-3xl overflow-hidden shadow-sm flex-1 ">
				<input
					type="text"
					placeholder="Search events..."
					className="flex-1 px- pl-6 py-2 focus:outline-none"
				/>

				<div className="w-px h-10 bg-gray-300" />
					<input
						type="text"
						placeholder="Search by location..."
						className="flex-1 px-4 py-2 pl-6 focus:outline-none"
					/>

					<button className="flex items-center justify-center px-3 py-3 bg-pink-500 hover:bg-pink-700 transition-colors rounded-4xl m-1">
						<FaSearch className="text-white text-xl" />
					</button>
				</div>
			</div>
			)}

			{isMobile && (
				<div className='flex flex-col justify-between items-center  gap-2  py-4 whitespace-nowrap bg-blue-50 border-b-2  border-b-gray-200 w-full' >
					<div className='flex '>
				<div className="flex items-center justify-center h-full  w-full  mr-8 sm:w=1/3">
					<Link to={"/"}>
					<img src={logo} alt="logo" className='flex size-10 justify-self-center hover:cursor-pointer'/></Link>
					</div>
						<Menu as="div" className="inline-block text-left absolute right-10 ">
					<div>
						<MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:cursor-pointer hover:bg-gray-50">

						<IoIosArrowDropdownCircle className='text-2xl'/>

						</MenuButton>
						</div>

					<MenuItems
						transition
						className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
						<div className="py-1">
						<MenuItem>
							<Link
							to={"/events"}
							className="block px-4 py-2  text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
							>
							Events
							</Link>
						</MenuItem>
						
						<MenuItem>
							<Link
							to={"/login"}
							className="block px-4 py-2  text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
							>
							Log In
							</Link>
						</MenuItem>
						
							<MenuItem>
							<Link
							to={"/login"}
							className="block px-4 py-2 text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
							>
							Sign Up
							</Link>
							
							</MenuItem>
						</div>
					</MenuItems>
				</Menu>
				</div>

				
				
				{/* <div className="flex h-3/4 text-sm items-center  w-full max-w-[100%]  mx-auto bg-gray-100 border border-gray-300  overflow-hidden shadow-sm flex-wrap ml-2 mr-2">
				<input
					type="text"
					placeholder="Search events..."
					className="flex-1 px-4 pl-6 py-2 focus:outline-none"
				/>

				<div className="flex w-px h-10 bg-gray-300" />
					<input
						type="text"
						placeholder="Search by location..."
						className="flex-1 px-4 py-2 pl-6 focus:outline-none"
					/>
				<button className="flex  px-3 py-3 bg-pink-500 hover:bg-pink-700 transition-colors rounded-4xl m-1" >
						<FaSearch className="text-white text-xl" />
				</button>
					
				</div> */}
				
			</div>
			
			)}
		
		</>
	)
}

Navbar.propTypes = {
	isDesktop: PropTypes.bool.isRequired,
	isTablet: PropTypes.bool.isRequired,
	isMobile: PropTypes.bool.isRequired
};

export default Navbar