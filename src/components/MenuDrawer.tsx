import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar, selectMenu } from "../app/features/menuDrawerSlice";
import useScrollLock from "../hooks/useScrollLock";

const MenuDrawer = () => {

    // Redux state
    const dispatch = useDispatch();
    const isOpenSidebar = useSelector(selectMenu)

    // lock background scroll when drawer open
    useScrollLock(isOpenSidebar);

    const handleNavClick = () => {
        dispatch(closeSidebar());
    };

    return (
        <>
            {/* Backdrop */}
            {isOpenSidebar && (
                <div
                    className="fixed inset-0 bg-black/40 bg-opacity-50 z-30"
                    onClick={() => dispatch(closeSidebar())}
                />
            )}

            {/* Drawer */}
            <div
                id="drawer-backdrop"
                className={`fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto bg-white w-64 transform transition-transform duration-500 ease-in-out  
                ${isOpenSidebar ? "translate-x-0" : "-translate-x-full"
                    }`}
                tabIndex={-1}
                aria-labelledby="drawer-backdrop-label"
            >
                <h5
                    id="drawer-backdrop-label"
                    className="text-base font-bold mb-4 px-2 uppercase"
                >
                    Menu
                </h5>

                {/* Close button */}
                <button
                    type="button"
                    className="absolute top-4.5 right-2.5 text-gray-500 hover:text-primary transition duration-300 hover:cursor-pointer px-2"
                    onClick={() => dispatch(closeSidebar())}
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">Close menu</span>
                </button>

                {/* Menu Links */}
                <div className="py-4">
                    <ul className="space-y-2 font-semibold text-gray-800 text-xs">
                        <li>
                            <NavLink
                                to="/"
                                className="block p-1 hover:text-gray-400 duration-300 transition-all"
                                onClick={handleNavClick}
                            >
                                Home
                            </NavLink>
                        </li>
                        <hr className="text-gray-200" />

                        <li>
                            <NavLink
                                to="/shop"
                                className="block p-1 hover:text-gray-400 duration-300 transition-all"
                                onClick={handleNavClick}
                            >
                                Shop
                            </NavLink>
                        </li>
                        <hr className="text-gray-200" />

                        <li>
                            <NavLink
                                to="/about"
                                className="block p-1 hover:text-gray-400 duration-300 transition-all"
                                onClick={handleNavClick}
                            >
                                About
                            </NavLink>
                        </li>
                        <hr className="text-gray-200" />

                        <li>
                            <NavLink
                                to="/contact"
                                className="block p-1 hover:text-gray-400 duration-300 transition-all"
                                onClick={handleNavClick}
                            >
                                Contact Us
                            </NavLink>
                        </li>
                        <hr className="text-gray-200" />
                    </ul>
                </div>
            </div>
        </>
    );
};

export default MenuDrawer;
