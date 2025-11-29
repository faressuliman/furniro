import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "../validation";
import * as z from "zod"
import ErrorMessage from "../components/ui/ErrorMessage";
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../app/store"
import { selectRegister, userRegister } from "../app/features/registerSlice"
import { useEffect } from "react"
import PageHeader from "../components/PageHeader";
import registerBg from "../assets/register-bg.png";
import { selectCart, syncCartToSupabase } from "../app/features/cartSlice";
import { selectWishlist, syncWishlistToSupabase } from "../app/features/wishlistSlice";


const Register = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { loading, data } = useSelector(selectRegister)
  const { cartProducts } = useSelector(selectCart)
  const { wishlistProducts } = useSelector(selectWishlist)

  // useForm
  type IRegisterInput = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IRegisterInput>({ resolver: zodResolver(registerSchema) })


  // Form submission handler
  const onSubmit: SubmitHandler<IRegisterInput> = async (data) => {
    
    const payload = {
      username: `${data.first_name} ${data.last_name}`,
      email: data.email,
      password: data.password,
    };

    const result = await dispatch(userRegister(payload))
    if (userRegister.fulfilled.match(result)) {
      setTimeout(() => reset(), 3000);
    }

  }

  useEffect(() => {
    if (data?.session) {
      // Sync guest cart/wishlist to Supabase after registration
      const syncData = async () => {
        if (cartProducts.length > 0) {
          await dispatch(syncCartToSupabase({ userId: data.session.user.id, cartProducts }))
        }
        if (wishlistProducts.length > 0) {
          await dispatch(syncWishlistToSupabase({ userId: data.session.user.id, wishlistProducts }))
        }
      }
      
      syncData().then(() => {
        setTimeout(() => {
          window.location.href = "/"; 
        }, 3000);
      })
    }
  }, [data, dispatch, cartProducts, wishlistProducts])

  return (
    <div>

      <PageHeader title="Register" />
      <div 
        className="max-w-screen-3xl mx-auto lg:px-12 p-4 pt-16 pb-24 flex items-center justify-center min-h-[calc(100vh-200px)] bg-fit bg-auto bg-repeat"
        style={{ backgroundImage: `url(${registerBg})` }}
      >
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-xl pt-10 pb-12 px-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create an Account</h2>
            <p className="text-sm text-gray-600">Please register below to create an account</p>
          </div>

          {/* Form wrapper */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input label="First Name" className="w-full" {...register("first_name")} />
              <ErrorMessage msg={errors?.first_name?.message} />
            </div>
            <div>
              <Input label="Last Name" className="w-full" {...register("last_name")} />
              <ErrorMessage msg={errors?.last_name?.message} />
            </div>
            <div>
              <Input label="Your Email Address" className="w-full" {...register("email")} />
              <ErrorMessage msg={errors?.email?.message} />
            </div>
            <div>
              <Input label="Your Password" type="password" className="w-full" {...register("password")} />
              <ErrorMessage msg={errors?.password?.message} />
            </div>

            <Button type="submit" isLoading={loading}
              className="w-full rounded-md mt-6 py-3 text-white bg-primary border hover:bg-white hover:-translate-y-1 hover:border-primary hover:text-primary text-sm"
            >
              {loading ? "CREATING ACCOUNT" : "CREATE ACCOUNT"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
