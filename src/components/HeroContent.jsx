
import { FaSearch } from 'react-icons/fa';
const HeroContent = () => {
return (
    
    <div className='flex flex-col space-y-7 '>
        <h1 className=' lg:text-6xl max-md:text-5xl  font-bold text-blue-950 w-fit mx-auto shadow-md shadow-gray-900 p-3 hover:p-[13px] lg:shadow-none  sm:hover:shadow-lg sm:active:shadow-lg active:opacity-50 active:text-right lg:text-center border-r-25 border-blue-900 rounded-xl' >Discover Exciting Events Near You All in One Place!</h1>
		<div className='text-2xl text-blue-950 text-right grid place-self-end font-semibold  w-[70%] '>
					Stay updated on the <span className='italic font-normal bg-blue-950 w-fit text-white hover:text-blue-950 hover:bg-gray-100 animate-pulse '> festivals, workshops, concerts and more </span> in your city. Find, filter, and book events seamlessly.
		</div>
            <div className='flex justify-center w-full'>
            <button className='w-[60%] h-15 border-1 rounded-2xl font-semibold text-lg bg-gray-100 border-blue-200 shadow-md shadow-blue-200  text-blue-900 hover:bg-gray-200 hover:text-[1.2rem] hover:w-[62%] active:bg-gray-200 active:text-[1.1rem] hover:cursor-pointer '>Explore Events</button>

            </div>
            <div className='grid grid-cols-auto w-full border-2 border-gray-300 rounded-2xl  bg-gradient-to-br from-blue-50 to-blue-100 text-[1.1rem] font-light '>

                <div className='col-start-1 col-end-2 border-r-1 border-gray-600 '>

                    <input type='text' placeholder='Search Events...' className='flex-1 px-4 py-3 pl-4 focus:outline-none  w-full border-b-1 border-gray-400  text-gray-950'  ></input>

                    <span className=''></span>

                    <input type='text' placeholder='Search by Location...' className='flex-1 px-4 py-3 pl-4 focus:outline-none text-gray-950 w-full'></input>

                </div>

                <button className='col-start-2 col-end-3 w-full  h-full p-4 cursor-pointer hover:text-lg border-r-3xl active:bg-gray-300 rounded-r-2xl active:text-[1.2rem] text-blue-950'  ><FaSearch/></button>

			</div>	
            
        </div>

)
}

export default HeroContent