import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { getProductById } from "../lib/api"
import Button from "../components/ui/Button"
import { addToCart } from "../app/features/cartSlice"
import { useDispatch, useSelector } from "react-redux"
import { Heart, ShoppingCart, Undo2 } from "lucide-react"
import { selectWishlist, toggleWishlist } from "../app/features/wishlistSlice"
import { AppDispatch } from "../app/store"
import ProductDetailsSkeleton from "../components/ui/ProductDetailsSkeleton"

const Product = () => {

  const dispatch = useDispatch<AppDispatch>()
  const { id } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!)
  })

  const thumbnail = data?.thumbnail
  const title = data?.title
  const description = data?.description
  const price = data?.price
  const category = data?.category

  const { wishlistProducts } = useSelector(selectWishlist)

  const numericId = Number(id);
  const isInWishList = wishlistProducts.some(product => product.id === numericId);

  const navigate = useNavigate()

  return (
    <div>
      {isLoading ? <ProductDetailsSkeleton />
        : (
          <>
            <div className="mt-8 container mx-auto px-4 md:px-16 md:w-[1200px]">
              <Button className="space-x-2 text-primary font-medium hover:text-amber-400" onClick={() => navigate(-1)}>
                <Undo2 />
                <h3>Back to Shop</h3>
              </Button>
            </div>
            <div className="mt-8 container mx-auto md:px-8 flex flex-col md:flex-row space-x-8 md:w-[1200px] items-center">
              <div className="w-[300px] h-full">
                <img src={thumbnail} alt={data?.title} className="bg-gray h-full w-full" />
              </div>
              <div className="flex flex-col space-y-4 md:space-y-6 md:w-[600px] md:px-0 px-8 mx-auto md:mx-0">
                <h1 className="font-bold text-xl md:text-3xl">{title}</h1>
                <h3 className="font-normal text-md md:text-lg text-gray-600">{description}</h3>
                <h3 className="font-bold text:sm md:text-md uppercase">{category}</h3>
                <h3 className="font-bold text:sm md:text-md">${price}</h3>
                <div className="text-xs">
                  <div className="flex items-center gap-2 w-full">
                    <Button className="flex items-center w-56 gap-1.5 px-3 py-2 sm:px-4 sm:py-2 text-white bg-primary border hover:bg-white hover:border-primary hover:text-primary text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap"
                      onClick={() => { dispatch(addToCart({ id: numericId, title, price, thumbnail })) }}
                    >
                      <ShoppingCart size={16} />
                      Add To Cart
                    </Button>


                    <button onClick={() => { dispatch(toggleWishlist({ id: numericId, title, price, thumbnail })) }}
                      className={`p-2 border ${isInWishList ? "border-primary" : "border-gray-300"} rounded-lg hover:border-primary hover:cursor-pointer transition-colors`}>
                      <Heart size={16} className="text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  )
}

export default Product