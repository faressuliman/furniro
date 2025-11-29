import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../../interfaces";
import { RootState } from "../store";
import toast from "react-hot-toast";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCartFromDB, addToCartDB } from "../../lib/api";

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

export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId: string) => {
    const cartItems = await fetchCartFromDB(userId);
    return cartItems;
})

export const syncCartToSupabase = createAsyncThunk('cart/syncCartToSupabase', async ({ userId, cartProducts }: { userId: string, cartProducts: ICartProduct[] }) => {
    const promises = cartProducts.map(product =>
        addToCartDB(userId, product.id, product.quantity)
    );
    await Promise.all(promises);
    return true;
}
)

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
                toast.success("Already in cart. Quantity updated.", {
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

        clearLocalCart: (state) => {
            state.cartProducts = [];
            state.count = 0;
        }

    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, () => {
            })

            .addCase(syncCartToSupabase.fulfilled, () => {
            });
    }
})

export const { openCartDrawer, closeCartDrawer, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearLocalCart } = cartSlice.actions
export const selectCart = (state: RootState): ICartState => state.cart;
export default cartSlice.reducer