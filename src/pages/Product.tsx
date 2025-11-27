import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { getProductById, getProductsByCategory } from "../lib/api"
import Button from "../components/ui/Button"
import { addToCart } from "../app/features/cartSlice"
import { useDispatch, useSelector } from "react-redux"
import { Heart, ShoppingCart, Undo2 } from "lucide-react"
import { selectWishlist, toggleWishlist } from "../app/features/wishlistSlice"
import { AppDispatch } from "../app/store"
import ProductDetailsSkeleton from "../components/ui/ProductDetailsSkeleton"
import { IProduct } from "../interfaces"
import ProductCard from "../components/ui/ProductCard"
import ProductCardSkeleton from "../components/ui/ProductSkeleton"

const Product = () => {

  const dispatch = useDispatch<AppDispatch>()
  const { id } = useParams()

  // Fetching product details
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

  // Fetching related products
  const { data: relatedProducts, isLoading: relatedLoading } = useQuery<IProduct[]>({
    queryKey: ["related-products", category],
    queryFn: () => getProductsByCategory(category),
  })

  const numericId = Number(id);

  const filteredProducts = relatedProducts?.filter(product => product.id !== numericId).slice(0, 4);

  const isInWishList = wishlistProducts.some(product => product.id === numericId);

  const navigate = useNavigate()

  return (
    <div>
      {/* Product details */}
      {isLoading ? <ProductDetailsSkeleton />
        : (
          <>
            <div className="mt-3 container mx-auto px-4 md:px-16 md:w-[1200px]">
              <Button className="space-x-2 text-primary font-medium hover:text-amber-400" onClick={() => navigate("/shop")}>
                <Undo2 />
                <h3>Back to Shop</h3>
              </Button>
            </div>
            <div className="mt-8 container mx-auto md:px-8 flex flex-col md:flex-row space-x-8 md:w-[1200px] items-center">
              <div className="w-[300px] h-full">
                <img src={thumbnail} alt={data?.title} className="bg-gray h-full w-full" />
              </div>
              <div className="flex flex-col space-y-6 md:w-[600px] md:px-0 px-8 mx-auto md:mx-0">
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

      {/* Related products */}
      <div className="mt-16 container mx-auto md:px-8 md:w-[1200px]">
        <div className="text-xl md:text-2xl font-bold mb-6 text-center">
          {isLoading ? <div className="h-6 w-40 bg-gray-300 rounded mb-8 mx-auto"></div> : "Related Products"}
        </div>

        <div className="flex md:grid md:grid-cols-2 lg:grid lg:grid-cols-4 
        justify-items-center gap-x-2 md:gap-x-0 md:gap-y-8 lg:gap-x-24 overflow-x-auto md:overflow-visible scrollbar-hide mb-12 px-4">
          {relatedLoading
            ? [...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[200px] md:min-w-0">
                <ProductCardSkeleton />
              </div>
            ))
            : filteredProducts?.map((product: IProduct) => (
              <div key={product.id} className="min-w-[200px] md:min-w-0">
                <ProductCard
                  id={product.id}
                  title={product.title}
                  category={product.category}
                  price={product.price}
                  thumbnail={product.thumbnail}
                />
              </div>
            ))}
        </div>
      </div>

    </div>
  )
}

export default Product