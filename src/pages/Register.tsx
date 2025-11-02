import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import PageHeader from "../components/PageHeader"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "../validation";
import * as z from "zod"
import ErrorMessage from "../components/ui/ErrorMessage";
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../app/store"
import { selectRegister, userRegister } from "../app/features/registerSlice"
import { useEffect } from "react"


const Register = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { loading, data, error } = useSelector(selectRegister)
  const navigate = useNavigate();

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
      email: data.identifier,
      password: data.password,
    };

    const result = await dispatch(userRegister(payload))
    if (userRegister.fulfilled.match(result)) {
      setTimeout(() => reset(), 3000);
    }

    console.log("test")

  }

  useEffect(() => {
    if (data?.jwt) {
      setTimeout(() => {
        navigate("/")
      }, 3000);
    }
  }, [data, navigate])

  return (
    <div>

      <PageHeader title="Register" />
      <div className="max-w-screen-3xl mx-auto lg:px-12 p-4 pb-24">
        <h2 className="py-4 font-semibold">CREATE AN ACCOUNT</h2>
        <h6 className="pb-6 text-xs font-normal tracking-wide">Please register below to create an account</h6>

        {/* Form wrapper */}
        <form className="text-sm flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="max-w-xs">
            <div className="mb-4">
              <Input label="First Name" className="w-full" {...register("first_name")} />
              <ErrorMessage msg={errors?.first_name?.message} />
            </div>
            <div className="mb-4">
              <Input label="Last Name" className="w-full" {...register("last_name")} />
              <ErrorMessage msg={errors?.last_name?.message} />
            </div>
            <div className="mb-4">
              <Input label="Your Email Address" className="w-full" {...register("identifier")} />
              <ErrorMessage msg={errors?.identifier?.message} />
            </div>
            <div className="mb-4">
              <Input label="Your Password" className="w-full" {...register("password")} />
              <ErrorMessage msg={errors?.password?.message} />
            </div>

            <Button type="submit" isLoading={loading}
              className="w-56 rounded-md mt-2 py-3 text-white bg-primary border hover:bg-white hover:-translate-y-1 hover:border-primary hover:text-primary mb-4 text-xs"
            >
              {loading ? "CREATING ACCOUNT" : "CREATE ACCOUNT"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
