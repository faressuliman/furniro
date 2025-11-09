import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../../interfaces";
import { RootState } from "../store";
import toast from "react-hot-toast";


interface IWishlistState {
    wishlistProducts: IProduct[],
    count: number,
}

const initialState: IWishlistState = {
    wishlistProducts: [],
    count: 0
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
                    position: "bottom-center",
                    duration: 3000,
                    style: { background: 'white', color: 'black' }
                });
                return;
            } 
            
            else {
                state.wishlistProducts.push({ ...action.payload })
                toast.success("Product has been added to your cart!", {
                    position: "bottom-center",
                    duration: 3000,
                    style: { background: 'white', color: 'black' }
                });
                state.count = state.wishlistProducts.length
            }
        },

        removeFromWishlist: (state, action: PayloadAction<number>) => {
            state.wishlistProducts = state.wishlistProducts.filter(
                (product) => product.id !== action.payload
            )
            state.count = state.wishlistProducts.length
        },
    }
})

export const { addtoWishlist, removeFromWishlist } = wishlistSlice.actions
export const selectWishlist = (state: RootState): IWishlistState => state.wishlist;
export default wishlistSlice.reducer