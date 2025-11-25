import { ShoppingCart, Heart } from "lucide-react";
import { IProduct } from "../../interfaces";
import Button from "./Button"
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../app/features/cartSlice";
import { toggleWishlist } from "../../app/features/wishlistSlice";
import { AppDispatch } from "../../app/store";
import { selectWishlist } from "../../app/features/wishlistSlice";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ id, title, category, price, thumbnail,}: IProduct) => {

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { wishlistProducts } = useSelector(selectWishlist)

  const isInWishList = wishlistProducts.some((product) => product.id === id)

  return (
    <div className="w-[160px] sm:w-[220px] md:w-[220px] rounded-md xl:w-[280px] bg-[#F4F5F7] border border-gray-200 shadow-md flex flex-col h-[320px] sm:h-[370px] hover:-translate-y-1 transition-all duration-200">
      <div className="hover:cursor-pointer hover:opacity-85 transition duration-300 flex-1 flex flex-col" onClick={() => navigate(`/product/${id}`)}>
        {/* Product Image */}
        <img
          className="rounded-t-lg w-full h-40 sm:h-48 object-cover bg-white"
          src={thumbnail}
          alt={title}
        />

        {/* Product Details */}
        <div className="flex flex-col flex-1 p-3 sm:p-4 rounded-b-lg">
          <div>
            <h5 className="mb-1 sm:mb-2 text-sm md:text-md lg:text-md xl:text-md font-semibold tracking-tight text-gray-900 line-clamp-1">
              {title}
            </h5>
            <p className="mb-2 sm:mb-4 font-normal text-gray-700 text-xs sm:text-sm">
              {category}
            </p>
          </div>

          {/* Price */}
          <div className="flex flex-col mt-auto">
            <span className="text-sm md:text-md font-semibold text-gray-900 ">
              ${price}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-xs">
        <div className="flex items-center justify-center gap-2 w-full">
          <Button className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-4 sm:py-2 text-white bg-primary border hover:bg-white hover:border-primary hover:text-primary text-[10px] sm:text-sm font-medium rounded-md transition-all whitespace-nowrap"
            onClick={() => { dispatch(addToCart({ id, title, price, thumbnail })) }}
          >
            <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
            Add To Cart
          </Button>


          <button onClick={() => { dispatch(toggleWishlist({ id, title, price, thumbnail })) }}
            className={`p-2 border hidden md:block ${isInWishList ? "border-primary" : "border-gray-300"} rounded-lg hover:border-primary hover:cursor-pointer transition-colors`}>
            <Heart size={16} className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>

  );
};

export default ProductCard;
