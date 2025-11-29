import { Navigate } from "react-router-dom"
import PageHeader from "../components/PageHeader"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../app/store"
import { removeFromWishlist, selectWishlist } from "../app/features/wishlistSlice"
import { IProduct } from "../interfaces"
import Button from "../components/ui/Button"
import { X } from "lucide-react"
import { addToCart } from "../app/features/cartSlice"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { Session } from "@supabase/supabase-js"
import Loader from "../components/ui/Loader"

const Wishlist = () => {

  // States
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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
          <Button
            className="flex items-center justify-center gap-1.5 px-3 py-1 text-primary text-nowrap bg-white border hover:border-white hover:text-white hover:bg-primary text-xs font-medium rounded-md transition-all"
            onClick={() => {
              dispatch(addToCart(product))
            }}
          >
            Add To Cart
          </Button>

          <button
            className="hover:cursor-pointer hover:text-grey transition duration-300"
            onClick={() => { dispatch(removeFromWishlist(product.id)) }}
          >
            <X className="md:w-5 md:h-5 w-4 h-4" />
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
