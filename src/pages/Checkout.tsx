import { useSelector } from "react-redux"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import PageHeader from "../components/PageHeader"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import ErrorMessage from "../components/ui/ErrorMessage"

import { selectCart, ICartProduct } from "../app/features/cartSlice"
import { checkoutSchema } from "../validation"
import toast from "react-hot-toast"
import { supabase } from "../lib/supabaseClient"
import { createOrder, createOrderItems } from "../lib/api"
import { Navigate, useNavigate } from "react-router-dom"

const Checkout = () => {
  const navigate = useNavigate()

  // Getting cart products from Redux store
  const { cartProducts } = useSelector(selectCart)
  const isCartEmpty = cartProducts.length === 0

  // Form setup
  type ICheckoutInput = z.infer<typeof checkoutSchema>;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ICheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment_method: "cod",
    },
  })

  const paymentMethod = watch("payment_method")

  const subtotal = cartProducts.reduce((acc, product) => acc + product.price * product.quantity, 0)

  if (isCartEmpty) {
    return <Navigate to="/" replace />
  }

  const onSubmit: SubmitHandler<ICheckoutInput> = async (data) => {
    const { data: sessionData } = await supabase.auth.getSession()

    const userId = sessionData?.session?.user.id

    try {
      const order = await createOrder({
        userId: userId as string,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postal_code: data.postal_code,
        order_notes: data.order_notes,
        payment_method: data.payment_method,
        subtotal,
      })

      await createOrderItems(
        cartProducts.map((product) => ({
          order_id: order.id,
          product_id: product.id,
          title: product.title,
          quantity: product.quantity,
          price: product.price,
        }))
      );

      toast.success("Your order has been placed successfully!", {
        position: "bottom-center",
        duration: 3000,
        style: { background: "white", color: "black" },
      })

      setTimeout(() => {
        reset({
          ...data,
          card_number: "",
          order_notes: data.order_notes || "",
          payment_method: data.payment_method,
        })
        navigate("/")
      }, 2000)
    } catch (error) {
      toast.error("Failed to place order", {
        position: "bottom-center",
        duration: 3000,
        style: { background: "white", color: "black" },
      });
    }
  }

  const renderOrderItems = cartProducts.map((product: ICartProduct) => (
    <div
      key={product.id}
      className="flex items-start justify-between text-sm text-gray-700"
    >
      <div className="flex-1 pr-3">
        <p className="font-medium">
          {product.title}{" "}
          <span className="text-xs text-gray-400">x {product.quantity}</span>
        </p>
      </div>
      <div className="text-right font-semibold text-gray-900">
        ${(product.price * product.quantity).toFixed(2)}
      </div>
    </div>
  ))

  return (
    <div>
      <PageHeader title="Checkout" />

      <div>
        <form
          className="mt-12 max-w-screen-3xl lg:container mx-auto p-4 lg:px-8 pb-20 bg-white"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-11/12 mx-auto">
            {/* Billing details */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6 order-1 lg:order-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Billing Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="First Name"
                    className="w-full"
                    {...register("first_name")}
                  />
                  <ErrorMessage msg={errors?.first_name?.message} />
                </div>

                <div>
                  <Input
                    label="Last Name"
                    className="w-full"
                    {...register("last_name")}
                  />
                  <ErrorMessage msg={errors?.last_name?.message} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    className="w-full"
                    {...register("email")}
                  />
                  <ErrorMessage msg={errors?.email?.message} />
                </div>

                <div>
                  <Input
                    label="Phone Number"
                    className="w-full"
                    {...register("phone")}
                  />
                  <ErrorMessage msg={errors?.phone?.message} />
                </div>
              </div>

              <div>
                <Input
                  label="Address"
                  className="w-full"
                  {...register("address")}
                />
                <ErrorMessage msg={errors?.address?.message} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="City"
                    className="w-full"
                    {...register("city")}
                  />
                  <ErrorMessage msg={errors?.city?.message} />
                </div>

                <div>
                  <Input
                    label="Postal Code"
                    className="w-full"
                    {...register("postal_code")}
                  />
                  <ErrorMessage msg={errors?.postal_code?.message} />
                </div>
              </div>

              {/* Order notes textarea */}
              <div>
                <label className="text-xs font-bold">Order Notes (Optional)</label>
                <textarea
                  className="mt-2 border border-gray-300 rounded-md px-3 py-2 mb-1 placeholder:text-sm focus:transition-all focus:duration-400 w-full min-h-[120px] resize-y"
                  placeholder="Notes about your order, e.g. special delivery instructions."
                  {...register("order_notes")}
                />
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 h-fit order-3 lg:order-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Order
              </h2>

              <div className="space-y-3 mb-4">
                {renderOrderItems}
              </div>

              <hr className="border-gray-200 my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold text-primary text-base">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full rounded-md mt-6 py-3 text-white bg-primary border hover:bg-white hover:-translate-y-1 hover:border-primary hover:text-primary text-sm"
              >
                {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
              </Button>
            </div>

            {/* Payment Method container */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4 order-2 lg:order-3 w-5/8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    value="card"
                    {...register("payment_method")}
                    className="h-4 w-4 text-primary border-gray-300"
                  />
                  <span>Pay by Card</span>
                </label>

                {paymentMethod === "card" && (
                  <div className="ml-7">
                    <Input
                      label="Card Number"
                      className="w-full"
                      placeholder="1234 5678 9012 3456"
                      {...register("card_number")}
                    />
                    <ErrorMessage msg={errors?.card_number?.message} />
                  </div>
                )}

                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    value="cod"
                    {...register("payment_method")}
                    className="h-4 w-4 text-primary border-gray-300"
                  />
                  <span>Cash on Delivery</span>
                </label>

                <ErrorMessage msg={errors?.payment_method?.message} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
