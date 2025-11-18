const ProductDetailsSkeleton = () => {
    return (
        <div className="mt-8 container mx-auto px-4 md:px-16 md:w-[1200px] animate-pulse">
            {/* Back button skeleton */}
            <div className="h-6 w-32 bg-gray-300 rounded mb-8"></div>

            <div className="flex flex-col md:flex-row space-x-0 md:space-x-8">
                <div className="flex flex-col md:flex-row  items-center">
                    {/* Image Skeleton */}
                    <div className="w-[250px] h-[350px] bg-gray-300 rounded mb-6 md:mb-0"></div>
                </div>

                {/* Details Skeleton */}
                <div className="flex flex-col space-y-4 md:space-y-6 md:w-[600px] md:px-0 px-4 items-start">
                    <div className="h-8 bg-gray-300 rounded w-3/4"></div> {/* Title */}
                    <div className="h-4 bg-gray-300 rounded w-full"></div> {/* Description line 1 */}
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div> {/* Description line 2 */}
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div> {/* Category */}
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div> {/* Price */}

                    {/* Buttons Skeleton */}
                    <div className="flex items-center gap-2 mt-4">
                        <div className="h-10 w-40 bg-gray-300 rounded"></div>
                        <div className="h-10 w-10 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsSkeleton;
