import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../../interfaces";
import { RootState } from "../store";

export interface IWishlistState {
    wishlistProducts: IProduct[],
}

const initialState: IWishlistState = {
    wishlistProducts: [],
}

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        toggleWishlist: (state, action: PayloadAction<IProduct>) => {
            const existingProduct = state.wishlistProducts.find(
                (product) => product.id === action.payload.id
            )

            if (existingProduct) {
                state.wishlistProducts = state.wishlistProducts.filter(
                    (product) => product.id !== action.payload.id
                )
            }

            else {
                state.wishlistProducts.push({ ...action.payload })
            }
        },

        removeFromWishlist: (state, action: PayloadAction<number>) => {
            state.wishlistProducts = state.wishlistProducts.filter(
                (product) => product.id !== action.payload
            )
        },
    }
})

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions
export const selectWishlist = (state: RootState): IWishlistState => state.wishlist;
export default wishlistSlice.reducer