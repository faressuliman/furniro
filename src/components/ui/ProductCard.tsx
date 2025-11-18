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
    <div className="w-[190px] sm:w-[250px] rounded-md xl:w-[280px] bg-[#F4F5F7] border border-gray-200 shadow-md flex flex-col h-[370px]">
      <div className="hover:cursor-pointer hover:opacity-85 transition duration-300" onClick={() => navigate(`/product/${id}`)}>
        {/* Product Image */}
        <img
          className="rounded-t-lg w-full h-48 object-cover bg-white"
          src={thumbnail}
          alt={title}
        />

        {/* Product Details */}
        <div className="flex flex-col justify-between grow p-4 rounded-b-lg">
          <div>
            <h5 className="mb-2  md:text-md lg:text-md xl:text-md font-semibold tracking-tight text-gray-900 line-clamp-1">
              {title}
            </h5>
            <p className="mb-4 font-normal text-gray-700 text-sm">
              {category}
            </p>
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <span className="text-sm md:text-md font-semibold text-gray-900 ">
              ${price}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-4 text-xs">
        <div className="flex items-center justify-center gap-2 w-full">
          <Button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 text-white bg-primary border hover:bg-white hover:border-primary hover:text-primary text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap"
            onClick={() => { dispatch(addToCart({ id, title, price, thumbnail })) }}
          >
            <ShoppingCart size={16} />
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
