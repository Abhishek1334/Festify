import React from 'react'
import { FaSearch } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import logo from '../assets/images/logo.png';

const Navbar = () => {

	const isDesktop = useMediaQuery({ minWidth: 1301 });

	const isTablet = useMediaQuery({ minWidth: 446, maxWidth: 1300 });

	const isMobile = useMediaQuery({ maxWidth: 445 });


	return (
		<>
			{isDesktop && (
				<div className='flex flex-row justify-between items-center border-b border-gray-200 bg-gray-100 px-4 py-4 whitespace-nowrap' >
					<div className="flex items-center h-full logo w-fit  mr-8 sm:w=1/3">
					<img src={logo} alt="logo" className='size-10'/>
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

					<ul className='ml-10 w-1/3 flex flex-row justify-center space-x-10 h-full items-center text-sm text-navy-600 font-semibold mr-4 min-w-fit'>
						<li className='p-2 rounded-lg hover:bg-gray-200 '>Find Events</li>
						<div className="w-[2px] h-10 bg-gray-300 " />
						<li className='p-2 rounded-lg hover:bg-gray-200'>Create Events</li>
						<div className="w-[2px] h-10 bg-gray-300 " />
						<li className='p-2 rounded-lg hover:bg-gray-200'>Log In</li>
						<div className="w-[2px] h-10 bg-gray-300 " />
						<li className='p-2 rounded-lg hover:bg-gray-200'>Sign Up</li>
					</ul>
				</div>
			)}


			{isTablet && (
				<div className='flex flex-col justify-between items-center border-b border-gray-200 gap-3 bg-gray-100 px-4 py-4 whitespace-nowrap' >
				<div className="flex items-center h-full  w-fit  mr-8 sm:w=1/3">
					<img src={logo} alt="logo" className='size-10'/>
				</div>

				<ul className='ml-10 w-1/3 flex flex-row justify-center space-x-5 h-full items-center text-sm text-navy-600 font-semibold mr-4 min-w-fit'>
					<li className='p-2 rounded-lg hover:bg-gray-200 '>Find Events
					</li>
					<div className="w-[2px] h-10 bg-gray-300 " />
					<li className='p-2 rounded-lg hover:bg-gray-200'>Create Events</li>
					<div className="w-[2px] h-10 bg-gray-300 " />
					<li className='p-2 rounded-lg hover:bg-gray-200'>Log In</li>
					<div className="w-[2px] h-10 bg-gray-300 " />
					<li className='p-2 rounded-lg hover:bg-gray-200'>Sign Up</li>
				</ul>
				
				<div className="flex h-3/4 text-sm items-center  min-w-fit w-20 max-w-full  mx-auto bg-gray-100 border border-gray-300 rounded-3xl overflow-hidden shadow-sm flex-1 ">
				<input
					type="text"
					placeholder="Search events..."
					className="flex-1 px-4 pl-6 py-2 focus:outline-none"
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
				<div className='flex flex-col justify-between items-center border-b border-gray-200 gap-3 bg-gray-100 px-4 py-4 whitespace-nowrap' >
				<div className="flex items-center h-full  w-fit  mr-8 sm:w=1/3">
					<img src={logo} alt="logo" className='size-10'/>
				</div>

				<ul className='grid grid-rows-2 auto-cols-auto gap-1 text-sm text-navy-600 font-semibold  border-2 w-[80%] border-gray-300'>
					<div className='flex rows-start-0 rows-end-1 justify-around'>
						<li className='p-2  rounded-lg hover:bg-gray-200 flex cursor-pointer'>Find Events </li>
						
						<li className='p-2 rounded-lg hover:bg-gray-200'>Create Events</li>
					</div>

					<div className='flex justify-around rows-start-1 rows-end-2'>
					<li className='p-2 rounded-lg hover:bg-gray-200 flex justify-between'>Log In</li>
					
					<li className='p-2 rounded-lg hover:bg-gray-200'>Sign Up</li>
					</div>
				</ul>
				
				<div className="flex h-3/4 text-sm items-center  w-fit max-w-[100%]  mx-auto bg-gray-100 border border-gray-300 rounded-3xl overflow-hidden shadow-sm flex-wrap">
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

					<button className="flex  px-3 py-3 bg-pink-500 hover:bg-pink-700 transition-colors rounded-4xl m-1">
						<FaSearch className="text-white text-xl" />
					</button>
				</div>
			</div>
			
			)}
		
		</>
	)
}

export default Navbar