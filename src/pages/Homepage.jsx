/* eslint-disable no-unused-vars */
import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import { useMediaQuery } from 'react-responsive'

const Homepage = () => {

	const isDesktop = useMediaQuery({ minWidth: 1301 });

	const isTablet = useMediaQuery({ minWidth: 530, maxWidth: 1300 });

	const isMobile = useMediaQuery({ maxWidth: 529 });
	return (
		<div className='scroll-smooth'>
			<Navbar isDesktop={isDesktop}  isTablet={isTablet} isMobile={isMobile}/>
			<Hero />
			<Categories isDesktop={isDesktop}  isTablet={isTablet} isMobile={isMobile}/>
		</div>
	)
}

export default Homepage