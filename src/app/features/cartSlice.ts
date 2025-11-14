import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../../interfaces";
import { RootState } from "../store";
import toast from "react-hot-toast";

export interface ICartProduct extends IProduct {
    quantity: number
}

interface ICartState {
    isOpenCartDrawer: boolean
    cartProducts: ICartProduct[],
    count: number,
}

const initialState: ICartState = {
    isOpenCartDrawer: false,
    cartProducts: [],
    count: 0
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        openCartDrawer: (state) => { state.isOpenCartDrawer = true },
        closeCartDrawer: (state) => { state.isOpenCartDrawer = false },

        addToCart: (state, action: PayloadAction<IProduct>) => {
            const existingProduct = state.cartProducts.find(
                (product) => product.id === action.payload.id
            )

            if (existingProduct) {
                existingProduct.quantity += 1
                toast.success("Product already exists in your cart, quantity has increased.", {
                    position: "bottom-right",
                    duration: 3000,
                    style: { background: 'white', color: 'black' }
                });
            } 
            
            else {
                state.cartProducts.push({ ...action.payload, quantity: 1 })
                toast.success("Product has been added to your cart!", {
                    position: "bottom-right",
                    duration: 3000,
                    style: { background: 'white', color: 'black' }
                });
            }

            state.count = state.cartProducts.reduce(
                (acc, product) => acc + product.quantity, 0
            )
        },

        removeFromCart: (state, action: PayloadAction<number>) => {
            state.cartProducts = state.cartProducts.filter(
                (product) => product.id !== action.payload
            )

            state.count = state.cartProducts.reduce(
                (acc, product) => acc + product.quantity, 0
            )
        },

        increaseQuantity: (state, action: PayloadAction<number>) => {
            const product = state.cartProducts.find(product => product.id === action.payload);
            if (product) {
                product.quantity += 1;
            }

            state.count = state.cartProducts.reduce(
                (acc, product) => acc + product.quantity, 0
            )
        },
        
        decreaseQuantity: (state, action: PayloadAction<number>) => {
            const product = state.cartProducts.find(product => product.id === action.payload);
            if (product && product.quantity > 1) {
                product.quantity -= 1;
            } 
            
            else {
                state.cartProducts = state.cartProducts.filter((product) => product.id !== action.payload)
            }

            state.count = state.cartProducts.reduce(
                (acc, product) => acc + product.quantity, 0
            )
        },

        clearCart: (state) => {
            state.cartProducts = []
            state.count = 0
        }

    }
})

export const { openCartDrawer, closeCartDrawer, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions
export const selectCart = (state: RootState): ICartState => state.cart;
export default cartSlice.reducer