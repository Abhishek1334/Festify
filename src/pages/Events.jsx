import { useMediaQuery } from 'react-responsive'

import Navbar from "../components/Navbar"
import EventListing from "../components/EventsListing"

const Events = () => {
  const isDesktop = useMediaQuery({ minWidth: 1301 });

const isTablet = useMediaQuery({ minWidth: 701, maxWidth: 1300 });

const isMobile = useMediaQuery({ maxWidth: 700 });
  return (

    <><Navbar isDesktop={isDesktop}  isTablet={isTablet} isMobile={isMobile}/>
      <EventListing/>
    </>
  )
}

export default Events