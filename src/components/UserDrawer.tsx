import { X } from "lucide-react";
import type { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { closeUserDrawer } from "../app/features/userDrawerSlice";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { NavLink } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "../validation";
import * as z from "zod"
import ErrorMessage from "./ui/ErrorMessage";
import { selectLogin, userLogin } from "../app/features/loginSlice";
import CookieService from "../services/CookieService";
import { fetchUser } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const UserDrawer = () => {

    // Token
    const token = CookieService.get("jwt")

    // Redux state
    const dispatch = useDispatch<AppDispatch>();
    const isOpenUserDrawer = useSelector((state: RootState) => state.userDrawer.isOpenUserDrawer);
    const { loading } = useSelector(selectLogin)

    // useForm
    type ILoginInput = z.infer<typeof loginSchema>;

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors }
    } = useForm<ILoginInput>({ resolver: zodResolver(loginSchema) })


    // Form submission handler
    const onSubmit: SubmitHandler<ILoginInput> = async (data) => {

        const result = await dispatch(userLogin(data))
        if (userLogin.fulfilled.match(result)) {
            dispatch(closeUserDrawer())
        }

        window.location.reload()

        console.log(data)
    }

    // Fetching user's username
    const { data: userData } = useQuery({
        queryFn: fetchUser,
        queryKey: ["user"],
        enabled: !!token // only runs when token exists
    })

    return (
        <>
            {/* Backdrop */}
            {isOpenUserDrawer && (
                <div
                    className="fixed inset-0 bg-black/40 bg-opacity-50 z-30"
                    onClick={() => {
                        clearErrors();
                        reset()
                        dispatch(closeUserDrawer())
                    }}
                />
            )}

            {/* Drawer */}
            <div
                id="drawer-backdrop"
                className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto bg-white w-72 lg:w-80 transform transition-transform duration-500 ease-in-out  
                ${isOpenUserDrawer ? "translate-x-0" : "translate-x-full"}`}
                tabIndex={-1}
                aria-labelledby="drawer-backdrop-label"
            >
                <h5 id="drawer-backdrop-label" className="text-base font-bold mb-4 px-2">
                    {token ? `Hi, ${userData?.username}` : "LOGIN"}
                </h5>

                {/* Close button */}
                <button
                    type="button"
                    className="absolute top-4.5 right-2.5 text-gray-500 hover:text-primary transition duration-300 hover:cursor-pointer px-2"
                    onClick={() => {
                        clearErrors()
                        reset()
                        dispatch(closeUserDrawer())
                    }}
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">Close menu</span>
                </button>

                {token ? (
                    <div className="py-4">
                        <ul className="space-y-2 font-semibold text-gray-800 text-xs">
                            <li>
                                <NavLink to="/account" className="block p-1 hover:text-gray-400 duration-300 transition-all" onClick={() => dispatch(closeUserDrawer())}>
                                    Account Details
                                </NavLink>
                            </li>
                            <hr className="text-gray-200" />

                            <li>
                                <NavLink to="/wishlist" className="block p-1 hover:text-gray-400 duration-300 transition-all" onClick={() => dispatch(closeUserDrawer())}>
                                    Wishlist
                                </NavLink>
                            </li>
                            <hr className="text-gray-200" />

                            <li>
                                <NavLink to="/resetpassword" className="block p-1 hover:text-gray-400 duration-300 transition-all" onClick={() => dispatch(closeUserDrawer())}>
                                    Reset Password
                                </NavLink>
                            </li>
                            <hr className="text-gray-200" />

                            <li>
                                <button
                                    onClick={() => {
                                        CookieService.remove("jwt")
                                        window.location.reload()
                                    }}
                                    className="p-1 hover:cursor-pointer hover:text-gray-400 duration-300 transition-all"
                                >
                                    Log Out
                                </button>
                            </li>
                            <hr className="text-gray-200" />
                        </ul>
                    </div>
                ) : (
                    <div className="py-4 px-2">
                        <form className="text-sm" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <Input type="email" label="Email Address" placeholder="Email Address" {...register("identifier")} />
                                <ErrorMessage msg={errors?.identifier?.message} />
                            </div>

                            <div className="mb-4">
                                <Input type="password" label="Password" placeholder="Password" {...register("password")} />
                                <ErrorMessage msg={errors?.password?.message} />
                            </div>

                            <Button type="submit" isLoading={loading}
                                className="w-full rounded-md text-white bg-primary border hover:bg-white hover:-translate-y-1 hover:border-primary hover:text-primary mb-4 text-sm">
                                {loading ? "LOGGING IN" : "LOG IN"}
                            </Button>
                        </form>
                        <div>
                            <NavLink to="/forgotpassword">
                                <p className="text-gray-600 text-xs underline text-center mb-5">Forgot your password?</p>
                            </NavLink>
                            <NavLink to="/register">
                                <Button onClick={() => dispatch(closeUserDrawer())}
                                    className="w-full rounded-md bg-white border text-primary border-primary hover:bg-primary hover:-translate-y-1 hover:text-white text-sm">
                                    CREATE ACCOUNT
                                </Button>
                            </NavLink>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default UserDrawer;
