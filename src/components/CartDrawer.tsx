import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import CookieService from "../services/CookieService";
import { AppDispatch } from "../app/store";
import { closeCartDrawer, selectCart, increaseQuantity, decreaseQuantity, ICartProduct, removeFromCart } from "../app/features/cartSlice";
import Button from "./ui/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CartDrawer = () => {

    // Token
    const token = CookieService.get("jwt")

    const navigate = useNavigate()

    // Redux state
    const dispatch = useDispatch<AppDispatch>();
    const { isOpenCartDrawer, cartProducts, count } = useSelector(selectCart)

    const renderCartProducts = cartProducts.map((product: ICartProduct) => (
        <div className="flex space-x-6 py-4 border-b border-gray-200" key={product.id}>
            <div>
                <img src={product.thumbnail} alt={product.title} className="w-20 h-20 object-cover" />
            </div>
            <div className="flex flex-col w-full">
                <h5 className="font-bold uppercase tracking-wide text-xs mb-3">{product.title}</h5>
                <h5 className="uppercase tracking-wide text-xs text-gray-400 mb-3">${product.price}</h5>
                <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-300 rounded-md w-20 justify-between">
                        <button className="px-3 py-1 text-lg hover:cursor-pointer text-md text-gray-800" onClick={() => { dispatch(decreaseQuantity(product.id)) }}>-</button>
                        <span className="text-center w-6 text-xs text-gray-800">{product.quantity}</span>
                        <button className="px-3 py-1 text-lg hover:cursor-pointer text-md text-gray-800" onClick={() => { dispatch(increaseQuantity(product.id)) }}>+</button>
                    </div>
                    <div className="">
                        <button className="hover:cursor-pointer" onClick={() => { dispatch(removeFromCart(product.id)) }}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ))

    const subtotal = cartProducts.reduce((acc, product) => acc + product.price * product.quantity, 0)

    return (
        <>
            {/* Backdrop */}
            {isOpenCartDrawer && (
                <div
                    className="fixed inset-0 bg-black/40 bg-opacity-50 z-30"
                    onClick={() => {
                        dispatch(closeCartDrawer())
                    }}
                />
            )}

            {/* Drawer */}
            <div
                id="drawer-backdrop"
                className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto bg-white w-72 lg:w-80 transform transition-transform duration-500 ease-in-out  
                ${isOpenCartDrawer ? "translate-x-0" : "translate-x-full"}`}
                tabIndex={-1}
                aria-labelledby="drawer-backdrop-label"
            >
                <h5 id="drawer-backdrop-label" className="text-base font-bold mb-2 px-2">
                    Shopping Cart
                </h5>

                {/* Close button */}
                <button
                    type="button"
                    className="absolute top-4.5 right-2.5 text-gray-500 hover:text-primary transition duration-300 hover:cursor-pointer px-2"
                    onClick={() => {
                        dispatch(closeCartDrawer())
                    }}
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">Close menu</span>
                </button>

                <div className="text-xs text-gray-400 tracking-wide px-2">{count} items</div>
                <div className="px-4 mt-5">
                    {cartProducts.length > 0 ? (
                        <> {renderCartProducts}
                            <div className="mt-3">
                                <div className="flex justify-between">
                                    <h4 className="text-sm font-bold">Subtotal:</h4>
                                    <h4 className="text-sm font-bold">${subtotal.toFixed(2)}</h4>
                                </div>
                            </div>
                            <div className="mt-3">
                                <Button
                                    onClick={() => {
                                        if (token) {
                                            navigate("/checkout")
                                            dispatch(closeCartDrawer())
                                        }

                                        else {
                                            toast.error("You are required to login first!", {
                                                position: "bottom-center",
                                                duration: 2000,
                                                style: { background: 'white', color: 'black' }
                                            });
                                        }
                                    }}
                                    className="w-full rounded-md text-white bg-primary border hover:bg-white hover:-translate-y-1 hover:border-primary hover:text-primary mb-4 text-sm"
                                >
                                    CHECKOUT
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-gray-400 text-xs text-center">Your cart is empty</p>
                            <Button
                                onClick={() => {
                                    navigate("/shop")
                                    dispatch(closeCartDrawer())
                                }}
                                className="w-full rounded-md bg-white border text-primary border-primary hover:bg-primary hover:-translate-y-1 hover:text-white text-sm mt-3"
                            >
                                CONTINUE SHOPPING
                            </Button>
                        </div>
                    )}
                </div>

            </div>

        </>
    );
};

export default CartDrawer;
