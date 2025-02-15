import categoriesList from '../categories.json'

import * as Fa from "react-icons/fa"

const Categories = ({isDesktop,isTablet,isMobile}) => {

    
    const displayedCategories = isMobile ? categoriesList.slice(0, 6) : categoriesList;

    return (
    
        <section className="h-[80vh] p-5 grid grid-rows-[15%_50%] gap-4">
            <h1 className="text-[2rem] font-bold text-gray-900 row-start-1 row-end-2   flex justify-center items-center text-center" >
                Explore Events by Categories
            </h1>
            <div className="h-full flex flex-wrap justify-center space-x-4 gap-y-3">
        {displayedCategories.map((category) => {
          // Declare the IconComponent before the return statement
            const IconComponent = Fa[category.icon];
            return (
                <div key={category.id} className="border-1 border-gray-300 size-25 rounded-[50%] flex justify-center flex-col h-25 relative hover:bg-gray-200 ">
                <span className="flex justify-center items-center">
                    {IconComponent ? (
                    <IconComponent className="text-3xl " />
                    ) : (
                    <div className="text-4xl">{category.fallbackicon}</div>
                    )}

                </span>
                <h3 className="absolute top-26 flex text-center text-sm text-gray-700">{category.name}</h3>
                </div>
            );
            })}
            </div>

        </section>
    )
}

export default Categories