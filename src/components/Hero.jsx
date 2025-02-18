
import BackgroundLg from '../assets/images/hero-lg.jpg'
import { useMediaQuery } from 'react-responsive';
import HeroContent from './HeroContent';



const Hero = () => {

	const isDesktop = useMediaQuery({ minWidth: 701 });

	return (

		
		<>

			{isDesktop ? 
			<div className="h-[80vh] bg-cover bg-center flex flex-col w-screen justify-center items-center  text-white relative " style={{ backgroundImage: `url(${BackgroundLg})`}}> 
				
				<HeroContent />
			</div>
			:
			<div className='Hero bg-gray-100 flex flex-col px-10  h-fit pb-10 pt-7 w-screen '>
				<HeroContent/>
			</div> }
				
		</>
	)
}

export default Hero


