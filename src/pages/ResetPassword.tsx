import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import toast from "react-hot-toast"

import PageHeader from "../components/PageHeader"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import ErrorMessage from "../components/ui/ErrorMessage"
import Loader from "../components/ui/Loader"
import { supabase } from "../lib/supabaseClient"
import { resetPasswordSchema } from "../validation"
import registerBg from "../assets/register-bg.png"

const ResetPassword = () => {
  type IResetPasswordInput = z.infer<typeof resetPasswordSchema>

  const navigate = useNavigate()
  const [checkingSession, setCheckingSession] = useState(true)
  const [hasSession, setHasSession] = useState<boolean | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const session = sessionData?.session

      setHasSession(!!session)
      setCheckingSession(false)
    }

    checkSession()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit: SubmitHandler<IResetPasswordInput> = async (data) => {
    try {
      await supabase.auth.updateUser({ password: data.password })

      toast.success("Password has been successfully updated!", {
        position: "bottom-center",
        duration: 4000,
        style: { background: "white", color: "black" },
      })

      reset()

      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (error) {
      toast.error("Failed to update password. Please try again.", {
        position: "bottom-center",
        duration: 3000,
        style: { background: "white", color: "black" },
      })
    }
  }

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  }

  if (hasSession === false) {
    return <Navigate to="/" replace />
  }

  return (
    <div>
      <PageHeader title="Reset Password" />

      <div
        className="auth-bg max-w-screen-3xl mx-auto lg:px-12 p-4 pt-16 pb-24 flex items-center justify-center min-h-[calc(100vh-200px)] bg-fit bg-auto bg-repeat"
        style={{ backgroundImage: `url(${registerBg})` }}
      >
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-xl pt-10 pb-12 px-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Set a new password
            </h2>
            <p className="text-sm text-gray-600">
              Enter your new password below.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="New Password"
                type="password"
                className="w-full"
                {...register("password")}
              />
              <ErrorMessage msg={errors?.password?.message} />
            </div>

            <div>
              <Input
                label="Confirm New Password"
                type="password"
                className="w-full"
                {...register("confirm_password")}
              />
              <ErrorMessage msg={errors?.confirm_password?.message} />
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full rounded-md mt-6 py-3 text-white bg-primary border hover:bg-white hover:-translate-y-1 hover:border-primary hover:text-primary text-sm"
            >
              {isSubmitting ? "UPDATING..." : "UPDATE PASSWORD"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword


