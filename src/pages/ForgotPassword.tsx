import PageHeader from "../components/PageHeader"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import ErrorMessage from "../components/ui/ErrorMessage"
import { supabase } from "../lib/supabaseClient"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { forgotPasswordSchema } from "../validation"
import toast from "react-hot-toast"
import { useState } from "react"
import registerBg from "../assets/register-bg.png"

const ForgotPassword = () => {
  type IForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

  const [isSending, setIsSending] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit: SubmitHandler<IForgotPasswordInput> = async (data) => {
    setIsSending(true)

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/resetpassword`,
    })

    if (error) {
      const message = error.message || ""

      if (message.toLowerCase().includes("user not found")) {
        toast.error("This email is not registered.", {
          position: "bottom-center",
          duration: 3000,
          style: { background: "white", color: "black" },
        })
      } else {
        toast.error("Failed to send reset email. Please try again.", {
          position: "bottom-center",
          duration: 3000,
          style: { background: "white", color: "black" },
        })
      }
    } else {
      toast.success("Password reset email sent. Please check your inbox.", {
        position: "bottom-center",
        duration: 4000,
        style: { background: "white", color: "black" },
      })
    }

    setIsSending(false)
  }

  return (
    <div>
      <PageHeader title="Forgot Password" />

      <div
        className="auth-bg max-w-screen-3xl mx-auto lg:px-12 p-4 pt-16 pb-24 flex items-center justify-center min-h-[calc(100vh-200px)] bg-fit bg-auto bg-repeat"
        style={{ backgroundImage: `url(${registerBg})` }}
      >
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-xl pt-10 pb-12 px-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Forgot your password?
            </h2>
            <p className="text-sm text-gray-600">
              Enter your email address and we&apos;ll send you a reset link.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Email Address"
                type="email"
                className="w-full"
                {...register("email")}
              />
              <ErrorMessage msg={errors?.email?.message} />
            </div>

            <Button
              type="submit"
              isLoading={isSending}
              className="w-full rounded-md mt-6 py-3 text-white bg-primary border hover:bg-white hover:-translate-y-1 hover:border-primary hover:text-primary text-sm"
            >
              {isSending ? "SENDING..." : "SEND RESET LINK"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword


