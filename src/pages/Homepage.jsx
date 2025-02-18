/* eslint-disable no-unused-vars */
import { useMediaQuery } from 'react-responsive'
import React from 'react'

import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import EventsListing from '../components/EventsListing'
import Footer from '../components/Footer'


const Homepage = () => {

	const isDesktop = useMediaQuery({ minWidth: 1301 });

	const isTablet = useMediaQuery({ minWidth: 701, maxWidth: 1300 });

	const isMobile = useMediaQuery({ maxWidth: 700 });
	return (
		<div className='scroll-smooth'>
			<Navbar isDesktop={isDesktop}  isTablet={isTablet} isMobile={isMobile}/>
			<Hero />
			<Categories isDesktop={isDesktop}  isTablet={isTablet} isMobile={isMobile}/>

			<EventsListing/>
			<Footer/>
		</div>
	)
}

export default Homepage