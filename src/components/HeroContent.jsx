import {Link} from 'react-router-dom'

import { FaSearch} from 'react-icons/fa';

import { CiLocationOn } from "react-icons/ci";





const HeroContent = () => {
return (
    


    <div className='flex max-md:flex-col max-md:space-y-4  h-full w-full 

    min-md:grid min-md:grid-cols-2 min-md:grid-rows-2 
    '>
        
        <h1 className={` 

        /*Base Style*/
        font-bold  w-fit mx-auto   p-3  transition-all transition-duration-1000 transition-timing-function ease-in-out         
        text-blue-950

        /*Desktop Style*/
        min-md:text-7xl min-md:px-4 min-md:font-black min-md:text-gray-100 min-md:row-span-2 min-md:my-auto min-md:justify-self-start min-md:place-self-start min-md:pb-5 min-md:text-center min-wd:min-w-[30ch]
        
        /*Mobile Style*/
        max-md:active:opacity-50 max-md:active:text-right max-md:border-[var(--vibrant-orange)] max-md:rounded-xl 
        max-md:text-5xl max-md:shadow-sm max-md:text-[var(--vibrant-orange)] max-md:shadow-orange-400 max-md:hover:text-[var(--pale-apricot)] max-md:hover:bg-[var(--vibrant-orange)]  max-md:hover:shadow-lg max-md:active:shadow-lg max-md:border-r-22 max-md:hover:text-right max-md:hover:border-[var(--pale-apricot)] 
        `} >
            Discover Exciting Events Near You All in One Place
            <CiLocationOn className='inline ml-1 pb-[4px] '/>
        </h1>
		
        <div className={`

        /*Desktop Style*/
        min-md:text-4xl min-md:font-extrabold min-md:text-white  place-content-end  min-md:pl-12 min-md:max-w-[28ch] min-wd:min-w-fit min-md:pb-4

        

        /*Mobile Style*/
        max-md:text-xl max-md:text-[var(--vibrant-orange)] max-md:text-right max-md:grid max-md:place-self-end max-md:font-semibold max-w-[17ch] `}>

            Stay updated on the 
            <span className={`

            /*Desktop Style*/
            min-md:text-goldenrod min-md:font-semibold min-md:animate-pulse
            
            /*Mobile Style*/
            max-md:italic max-md:font-normal max-md:bg-[var(--vibrant-orange)] max-md:w-[17ch] max-md:flex max-md:justify-self-end max-md:text-gray-100   max-md:animate-pulse `} >  festivals, workshops, concerts and more </span> 
            in your city. Find, filter, and book events seamlessly.
		</div>
        
        <div className='
        max-md:flex max-md:justify-center w-full
        
        min-md:place-content-start min-md:pt-10 min-md:w-full min-md:pl-50
        '>
            <Link to="/events" className=' max-md:flex max-md:justify-center '>
                <button className={`max-md:p-4  h-15 bg-[var(--vibrant-orange)] cursor-pointer
                
                min-md:rounded-3xl min-md:w-50 min-md:h-15 min-md:font-semibold min-md:text-lg  min-md:border-[var(--vibrant-orange)] min-md:text-[var(--pale-apricot)] min-md:shadow-lg min-md:hover:opacity-80 min-md:active:scale-105
                
                /*Mobile Style*/
                max-md:place-content-center
                max-md:border-1 max-md:rounded-2xl max-md:font-semibold max-md:text-lg  max-md:border-[var(--vibrant-orange)] max-md:text-[var(--pale-apricot)] max-md:shadow-lg max-md:hover:opacity-80  max-md:active:scale-105`} style={{ boxShadow: `0px 4px 10px var(--vibrant-orange)` }} 
                onMouseDown={(e) => e.currentTarget.style.boxShadow = "0px 2px 5px var(--vibrant-orange)"}
                onMouseUp={(e) => e.currentTarget.style.boxShadow = "0px 4px 10px var(--vibrant-orange)"}>
                    Explore Events
                </button>
            </Link>
        </div>

        <div className='grid grid-cols-auto w-full border-2 border-[var(--vibrant-orange)] rounded-2xl  bg-[#fdf0c4] text-[1.1rem] font-semibold 
        
        min-md:hidden'>

            <div className='col-start-1 col-end-2 border-r-1 border-[var(--vibrant-orange)] text-[var(--vibrant-orange)]'>

                <input type='text' placeholder='Search Events...' className='flex-1 px-4 py-3 pl-4 focus:outline-none  w-full border-b-1 border-[var(--vibrant-orange)] '  ></input>

                <span className=''></span>

                <input type='text' placeholder='Search by Location...' className='flex-1 px-4 py-3 pl-4 focus:outline-none  w-full'></input>

            </div>

            <button className='col-start-2 col-end-3 w-full  h-full p-4 cursor-pointer hover:text-lg border-r-3xl active:bg-gray-300 rounded-r-2xl active:text-[1.2rem] text-[#f0622e]'  >
                <FaSearch/>
            </button>

        </div>	
            
    </div>

)
}

export default HeroContent