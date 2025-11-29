const ProductCardSkeleton = () => {
  return (
    <div className="w-[160px] sm:w-[220px] md:w-[220px] rounded-md xl:w-[280px] bg-[#f8f8f8] shadow-md flex flex-col h-[320px] sm:h-[370px] animate-pulse">
      {/* Product Image Skeleton */}
      <div className="rounded-t-lg w-full h-40 sm:h-48 bg-gray-300"></div>

      {/* Product Details Skeleton */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 rounded-b-lg">
        <div>
          {/* Title Skeleton */}
          <div className="mb-1 sm:mb-2 h-4 sm:h-5 bg-gray-300 w-3/4 rounded-md"></div>

          {/* Category Skeleton */}
          <div className="mb-2 sm:mb-4 h-3 sm:h-4 bg-gray-300 w-20 rounded-md"></div>
        </div>

        {/* Price Skeleton */}
        <div className="flex flex-col mt-auto">
          <div className="h-4 sm:h-5 bg-gray-300 w-16 rounded-md"></div>
        </div>
      </div>

      {/* Buttons Skeleton */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="flex items-center justify-center gap-2 w-full">
          {/* Add to Cart Button Skeleton */}
          <div className="flex-1 h-7 sm:h-9 bg-gray-300 rounded-md"></div>

          {/* Heart Button Skeleton (hidden on mobile, visible on md+) */}
          <div className="h-9 w-9 bg-gray-300 rounded-lg hidden md:block"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
