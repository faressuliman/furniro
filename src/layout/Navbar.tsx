import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { UserRound, Heart, ShoppingCart, Search, Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import { openSidebar } from "../app/features/menuDrawerSlice"
import { openUserDrawer } from "../app/features/userDrawerSlice"

const Navbar = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    return (
        <nav className="bg-white shadow-xs">
            <div className="mx-auto max-w-screen-3xl p-4 lg:px-12">

                {/* Mobile + Tablet navbar */}
                <div className="flex items-center justify-between lg:hidden">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 w-8 h-8 text-gray-700 rounded-lg hover:bg-gray-100 hover:cursor-pointer focus:outline-none"
                            onClick={() => { dispatch(openSidebar()) }}
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <button className="text-gray-700 hover:text-primary hover:cursor-pointer transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    <NavLink to="/" className="flex items-center">
                        <img src={logo} className="h-8" alt="Furniro Logo" />
                    </NavLink>

                    <div className="flex items-center gap-3">
                        <button className="hover:text-primary hover:cursor-pointer transition-colors text-gray-700"
                            onClick={() => { dispatch(openUserDrawer()) }}>
                            <UserRound className="w-5 h-5" />
                        </button>
                        <button className="hover:text-primary hover:cursor-pointer transition-colors relative text-gray-700">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-1.5">
                                0
                            </span>
                        </button>
                    </div>
                </div>

                {/* Desktop Navbar */}
                <div className="hidden lg:flex items-center justify-between">
                    <NavLink to="/" className="flex items-center space-x-2">
                        <img src={logo} className="h-8" alt="Furniro Logo" />
                        <span className="text-2xl font-bold text-black">Furniro</span>
                    </NavLink>

                    <ul className="flex items-center space-x-16 font-medium lg:translate-x-0 xl:translate-x-24">
                        <li>
                            <NavLink
                                to="/"
                                className="text-gray-900 hover:text-primary transition duration-200"
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/shop"
                                className="text-gray-900 hover:text-primary transition duration-200"
                            >
                                Shop
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/about"
                                className="text-gray-900 hover:text-primary transition duration-200"
                            >
                                About
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/contact"
                                className="text-gray-900 hover:text-primary transition duration-200"
                            >
                                Contact
                            </NavLink>
                        </li>
                    </ul>

                    <div className="flex items-center gap-5 text-gray-700">
                        <div className="relative">
                            <input
                                type="text"
                                className="block w-48 p-2 text-sm focus:outline-none border-b border-gray-400 focus:border-primary duration-200 placeholder:text-black transition-all"
                                placeholder="Search"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <Search className="w-4 h-4 text-gray-500" />
                            </div>
                        </div>

                        <button className="hover:text-primary hover:cursor-pointer transition-colors"
                            onClick={() => { 
                                dispatch(openUserDrawer()) 
                            }}>
                            <UserRound className="w-5 h-5" />
                        </button>
                        <button onClick={() => {navigate("/wishlist")}}
                            className="hover:text-primary hover:cursor-pointer transition-colors">
                            <Heart className="w-5 h-5" />
                        </button>
                        <button className="hover:text-primary hover:cursor-pointer transition-colors relative">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-1.5">
                                0
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
