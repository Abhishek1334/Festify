import * as Fa from "react-icons/fa";
import {Link} from 'react-router-dom'
const Categories = () => {
    return (
        <div className="h-fit w-full px-4 bg-[#ffffff69]">
        <section className="px-2">
            <div className="grid grid-cols-4 gap-5 justify-center items-center w-full h-full border-b-4 border-[var(--vibrant-orange)]  border-t-4  py-10 min-md:flex min-md:gap-15">
            {[
                { name: 'Music', icon: <Fa.FaItunesNote /> },
                { name: 'Nightlife', icon: <Fa.FaLaptop /> },
                { name: 'Performing Arts', icon: <Fa.FaTheaterMasks /> },
                { name: 'Holidays', icon: <Fa.FaTree /> },
                { name: 'Dating', icon: <Fa.FaHeart /> },
                { name: 'Hobbies', icon: <Fa.FaPaintBrush /> },
                { name: 'Business', icon: <Fa.FaBriefcase /> },
                { name: 'Food & Drink', icon: <Fa.FaCocktail /> }
            ].map((category, index) => (
                <Link to={`/categories/${category.name}`} key={index}>    
                    <div
                    key={index}
                    className="flex flex-col items-center gap-2 hover:text-[var(--vibrant-orange)] "
                    >
                    <div className="w-18 h-18 flex items-center justify-center rounded-full bg-white text-3xl text-[#ffb85c]  border-2 border-orange-100 hover:bg-orange-100 hover:text-2xl transition duration-200 ease-linear active:bg-orange-200 active:scale-115 ">
                        {category.icon}
                    </div>
                    <div className="text-sm text-[#ffa228] text-center max-w-[4.5rem] overflow-hidden text-ellipsis ">
                        {category.name}
                    </div>
                    </div>
                </Link>
            ))}
            </div>
        </section>
        </div>
    );
};

export default Categories;
