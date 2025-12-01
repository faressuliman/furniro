import { ShoppingCart, Heart } from "lucide-react";
import { IProduct } from "../../interfaces";
import Button from "./Button"
import { useDispatch, useSelector } from "react-redux";
import { addToCart, addToCartAsync } from "../../app/features/cartSlice";
import { toggleWishlist, toggleWishlistAsync } from "../../app/features/wishlistSlice";
import { AppDispatch } from "../../app/store";
import { selectWishlist } from "../../app/features/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

const ProductCard = ({ id, title, category, price, thumbnail, }: IProduct) => {

  // Hooks
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { wishlistProducts } = useSelector(selectWishlist)

  // States
  const [session, setSession] = useState<Session | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)

  // Get current session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isInWishList = wishlistProducts.some((product) => product.id === id)

  // Handlers
  const handleAddToCart = async () => {
    const product = { id, title, price, thumbnail }
    if (session) {
      setIsAddingToCart(true)
      await dispatch(addToCartAsync({ userId: session.user.id, product }))
      setIsAddingToCart(false)
    } else {
      dispatch(addToCart(product))
    }
  }

  const handleToggleWishlist = async () => {
    const product = { id, title, price, thumbnail }
    if (session) {
      setIsTogglingWishlist(true)
      await dispatch(toggleWishlistAsync({ userId: session.user.id, product }))
      setIsTogglingWishlist(false)
    } else {
      dispatch(toggleWishlist(product))
    }
  }

  return (
    <div className="w-[160px] sm:w-[220px] md:w-[220px] rounded-md xl:w-[280px] bg-[#f8f8f8] shadow-md flex flex-col h-[320px] sm:h-[370px] transition-all duration-200 border border-gray-200">
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
          <Button
            className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-4 sm:py-2 text-white bg-primary border hover:bg-white hover:border-primary hover:text-primary text-[10px] sm:text-sm font-medium rounded-md transition-all whitespace-nowrap"
            onClick={handleAddToCart}
            isLoading={isAddingToCart}
          >
            {!isAddingToCart && <ShoppingCart size={14} className="sm:w-4 sm:h-4" />}
            {isAddingToCart ? "Adding To Cart" : "Add To Cart"}
          </Button>


          <button
            onClick={handleToggleWishlist}
            disabled={isTogglingWishlist}
            className="p-2.5 bg-transparent hidden md:block hover:cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none border-none">
            {isTogglingWishlist ? (
              <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full"></div>
            ) : (
              <Heart
                size={24}
                className={`transition-colors ${isInWishList ? "fill-primary text-primary" : "text-gray-700 group-hover:text-primary"
                  }`}
              />
            )}
          </button>
        </div>
      </div>
    </div>

  );
};

export default ProductCard;
