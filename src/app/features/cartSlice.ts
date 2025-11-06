import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../../interfaces";
import { RootState } from "../store";

interface ICartProduct extends IProduct {
    quantity: number
}

interface ICartState {
    isOpenCartDrawer: boolean
    products: ICartProduct[],
    count: number,
}

const initialState: ICartState = {
    isOpenCartDrawer: false,
    products: [],
    count: 0,
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        openCartDrawer: (state) => { state.isOpenCartDrawer = true },
        closeCartDrawer: (state) => { state.isOpenCartDrawer = false },

        addToCart: (state, action: PayloadAction<IProduct>) => {
            const existingProduct = state.products.find(
                (product) => product.id === action.payload.id
            )

            if (existingProduct) {
                existingProduct.quantity += 1
            } 
            
            else {
                state.products.push({ ...action.payload, quantity: 1 })
            }

            state.count = state.products.reduce(
                (acc, product) => acc + product.quantity, 0
            )
        },

        removeFromCart: (state, action: PayloadAction<number>) => {
            state.products = state.products.filter(
                (product) => product.id !== action.payload
            )

            state.count = state.products.reduce(
                (acc, product) => acc + product.quantity, 0
            )
        },

        increaseQuantity: (state, action: PayloadAction<number>) => {
            const product = state.products.find(product => product.id === action.payload);
            if (product) {
                product.quantity += 1;
            }

            state.count = state.products.reduce(
                (acc, product) => acc + product.quantity, 0
            )
        },
        
        decreaseQuantity: (state, action: PayloadAction<number>) => {
            const product = state.products.find(product => product.id === action.payload);
            if (product && product.quantity > 1) {
                product.quantity -= 1;
            } 
            
            else {
                state.products = state.products.filter((product) => product.id !== action.payload)
            }

            state.count = state.products.reduce(
                (acc, product) => acc + product.quantity, 0
            )
        },

    }
})

export const { openCartDrawer, closeCartDrawer, addToCart, removeFromCart, increaseQuantity, decreaseQuantity } = cartSlice.actions
export const selectCart = (state: RootState): ICartState => state.cart;
export default cartSlice.reducer