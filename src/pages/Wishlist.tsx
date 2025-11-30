import { Navigate } from "react-router-dom"
import PageHeader from "../components/PageHeader"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../app/store"
import { removeFromWishlist, selectWishlist, removeFromWishlistAsync } from "../app/features/wishlistSlice"
import { IProduct } from "../interfaces"
import Button from "../components/ui/Button"
import { X, ShoppingCart } from "lucide-react"
import { addToCart, addToCartAsync } from "../app/features/cartSlice"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { Session } from "@supabase/supabase-js"
import Loader from "../components/ui/Loader"

const Wishlist = () => {

  // States
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const { wishlistProducts } = useSelector(selectWishlist)
  const dispatch = useDispatch<AppDispatch>()

  // Get current session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Show loading state while checking session
  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader /></div>

  // Redirect if not authenticated or wishlist is empty
  if (!session || wishlistProducts.length === 0) return <Navigate to="/" replace />

  const renderWishlistProducts = wishlistProducts.map((product: IProduct, index: number) => (
    <div key={product.id}>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-8 items-center justify-items-center py-3">

        <div className="">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-20 h-20 object-cover items-center"
          />
        </div>

        <div className="hidden md:block">
          {product.title}
        </div>

        <div>
          ${product.price}
        </div>

        <div className="flex space-x-2">
          {/* Mobile: icon-only Add to Cart */}
          <button
            className="flex md:hidden items-center justify-center w-9 h-9 rounded-md border border-primary text-primary bg-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={async () => {
              if (session) {
                setAddingToCartId(product.id)
                await dispatch(addToCartAsync({ userId: session.user.id, product }))
                setAddingToCartId(null)
              } else {
                dispatch(addToCart(product))
              }
            }}
            disabled={addingToCartId === product.id}
          >
            {addingToCartId === product.id ? (
              <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full" />
            ) : (
              <ShoppingCart size={16} className="text-primary" />
            )}
          </button>

          {/* Desktop: text Add to Cart */}
          <Button
            className="hidden md:flex items-center justify-center gap-1.5 px-3 py-1 text-primary text-nowrap bg-white border hover:border-white hover:text-white hover:bg-primary text-xs font-medium rounded-md transition-all"
            onClick={async () => {
              if (session) {
                setAddingToCartId(product.id)
                await dispatch(addToCartAsync({ userId: session.user.id, product }))
                setAddingToCartId(null)
              } else {
                dispatch(addToCart(product))
              }
            }}
            isLoading={addingToCartId === product.id}
          >
            {addingToCartId === product.id ? "Adding To Cart" : "Add To Cart"}
          </Button>

          <button
            className="hover:cursor-pointer hover:text-grey transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={removingId === product.id}
            onClick={async () => {
              if (session) {
                setRemovingId(product.id)
                await dispatch(removeFromWishlistAsync({ userId: session.user.id, productId: product.id }))
                setRemovingId(null)
              } else {
                dispatch(removeFromWishlist(product.id))
              }
            }}
          >
            {removingId === product.id ? (
              <div className="animate-spin md:w-5 md:h-5 w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full"></div>
            ) : (
              <X className="md:w-5 md:h-5 w-4 h-4 hover:text-gray-400 transition-all duration-200" />
            )}
          </button>
        </div>

      </div>

      {index < wishlistProducts.length - 1 && (
        <hr className="border-gray-300" />
      )}
    </div>
  ))

  return (
    <div>
      <PageHeader title="Wishlist" />

      <div className="mt-12 max-w-screen-3xl lg:container mx-auto p-4 lg:px-8">

        <div className="grid grid-cols-3 md:grid-cols-4 gap-8 font-bold text-md justify-items-center mb-2">
          <div>Product</div>
          <div className="hidden md:block">Name</div>
          <div>Price</div>
          <div>Options</div>
        </div>

        <hr className="border-gray-300" />

        <div className="flex flex-col gap-4">
          {renderWishlistProducts}
        </div>

      </div>
    </div>
  )
}

export default Wishlist
