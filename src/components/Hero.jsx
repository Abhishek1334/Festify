import { FaSearch } from 'react-icons/fa';
import BackgroundLg from '../assets/images/hero-lg.jpg'
import { useMediaQuery } from 'react-responsive';

const Hero = () => {

	const isDesktop = useMediaQuery({ minWidth: 530 });

	return (
		<>

			{isDesktop ? (<img src={BackgroundLg} alt="People attending concert" className='w-full border-0 border-black max-h-[85vh]'/>) : <div className='Hero  bg-gradient-to-br from-red-200 via-orange-100 to-fuchsia-300 flex flex-col gap-8 p-10 h-fit pb-15 pt-11 w-screen '>
				<h1 className='text-4xl font-bold text-gray-900'>Discover Exciting Events Near You - All in One Place!</h1>
				<div className='text-lg font-light'>
					Stay updated on the latest concerts, festivals, workshops, and more in your city. Find, filter, and book events seamlessly.
				</div>
				<div className='flex justify-center w-full'>
				<button className='w-[60%] h-15 border-1 rounded-2xl bg-gradient-to-b from-fuchsia-50 to-stone-200 shadow-lg shadow-fuscia-500/50 inset-shadow-sm inset-shadow-gray-300 font-light'>Explore Events</button>

				</div>
				<div className='grid grid-cols-auto w-full mx-auto border-black border-2 rounded-2xl bg-gradient-to-b from-fuchsia-50 to-stone-200  '>
					<div className='col-start-1 col-end-2 border-r-1 border-gray-500'>
					<input type='text' placeholder='Search Events...' className='flex-1 px-4 py-2 pl-6 focus:outline-none  w-full border-b-1 border-gray-500'></input>
					<span className=''></span>
					<input type='text' placeholder='Search by Location...' className='flex-1 px-4 py-2 pl-6 focus:outline-none  w-full'></input></div>
					<button className='col-start-2 col-end-3 w-full  h-full p-5 cursor-pointer hover:text-lg border-r-3xl' ><FaSearch/></button>
				</div>			
			</div> }
		</>
	)
}

export default Hero