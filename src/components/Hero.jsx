
import BackgroundLg from '../assets/images/hero-lg.jpg'
import { useMediaQuery } from 'react-responsive';
import HeroContent from './HeroContent';



const Hero = () => {

	const isMobile = useMediaQuery({ maxWidth: 768 });

	return (

		
		<>

			{isMobile ? <div className='Hero bg-[var(--pale-apricot)] flex flex-col px-10  h-fit pb-10 pt-7 w-screen '>
				<HeroContent/>
			</div> 
			
			:
			<div className="h-[80vh] bg-cover bg-center  w-screen px-20 text-overlay" style={{ backgroundImage: `url(${BackgroundLg})`}}> 
				
				<HeroContent />
			</div>
				}
		</>
	)
}

export default Hero


