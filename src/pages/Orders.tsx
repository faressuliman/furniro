import { Navigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "../lib/supabaseClient"
import { fetchOrders } from "../lib/api"
import { IOrder } from "../interfaces"
import Loader from "../components/ui/Loader"
import PageHeader from "../components/PageHeader"

const Orders = () => {

  // Getting orders from database
  const { data: orders, isLoading, isError, error } = useQuery<IOrder[], Error>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const session = sessionData?.session

      if (!session) {
        throw new Error("NOT_AUTHENTICATED")
      }

      return fetchOrders(session.user.id) as Promise<IOrder[]>
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  }

  if (isError && (error as Error).message === "NOT_AUTHENTICATED") {
    return <Navigate to="/" replace />
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-red-600">Failed to load orders.</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="My Orders" />

      <div className="mt-12 max-w-screen-3xl lg:container mx-auto p-4 lg:px-8 pb-20">
        {orders && orders.length === 0 ? (
          <p className="text-sm text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders?.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="font-semibold">
                    Order #{order.id.slice(0, 8)}
                  </span>
                  <span className="text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="text-sm text-gray-700 mb-2">
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {order.first_name} {order.last_name}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {order.address}, {order.city}
                    {order.postal_code ? `, ${order.postal_code}` : ""}
                  </p>
                  <p>
                    <span className="font-semibold">Payment:</span>{" "}
                    {order.payment_method === "card"
                      ? "Pay by Card"
                      : "Cash on Delivery"}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm mt-3">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold text-primary">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders