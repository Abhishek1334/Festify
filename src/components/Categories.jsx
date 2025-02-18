import * as Fa from "react-icons/fa";

const Categories = () => {
    return (
        <div className="h-fit w-full px-4">
        <section className="px-2">
            <div className="grid grid-cols-4 gap-6 justify-center items-center w-full h-full border-b-4 border-blue-200 border-t-4  py-10 ">
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
                <div
                key={index}
                className="flex flex-col items-center gap-2 hover:text-blue-800 "
                >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white text-3xl text-[#627deb] border-2 border-indigo-200 hover:bg-blue-100 hover:text-2xl transition duration-200 ease-linear active:bg-blue-200 active:scale-115">
                    {category.icon}
                </div>
                <div className="text-sm text-blue-950 text-center max-w-[4.5rem] overflow-hidden text-ellipsis whitespace-nowrap">
                    {category.name}
                </div>
                </div>
            ))}
            </div>
        </section>
        </div>
    );
};

export default Categories;
