import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../../interfaces";
import { RootState } from "../store";
import toast from "react-hot-toast";


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
        addtoWishlist: (state, action: PayloadAction<IProduct>) => {
            const existingProduct = state.wishlistProducts.find(
                (product) => product.id === action.payload.id
            )

            if (existingProduct) {
                toast.error("Product already exists in your wishlist", {
                    position: "bottom-right",
                    duration: 3000,
                    style: { background: 'white', color: 'black', textAlign: 'center' }
                });
                return;
            } 
            
            else {
                state.wishlistProducts.push({ ...action.payload })
                toast.success("Product has been added to your wishlist!", {
                    position: "bottom-right",
                    duration: 3000,
                    style: { background: 'white', color: 'black', textAlign: 'center' }
                });
            }
        },

        removeFromWishlist: (state, action: PayloadAction<number>) => {
            state.wishlistProducts = state.wishlistProducts.filter(
                (product) => product.id !== action.payload
            )
        },
    }
})

export const { addtoWishlist, removeFromWishlist } = wishlistSlice.actions
export const selectWishlist = (state: RootState): IWishlistState => state.wishlist;
export default wishlistSlice.reducer