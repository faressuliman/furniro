import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { IProduct } from "../../interfaces";
import { RootState } from "../store";
import { fetchWishlistFromDB, addToWishlistDB } from "../../lib/api";

export interface IWishlistState {
    wishlistProducts: IProduct[],
}

const initialState: IWishlistState = {
    wishlistProducts: [],
}

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (userId: string) => {
        const wishlistItems = await fetchWishlistFromDB(userId);
        return wishlistItems;
    }
);

export const syncWishlistToSupabase = createAsyncThunk('wishlist/syncWishlistToSupabase', async ({ userId, wishlistProducts }: { userId: string, wishlistProducts: IProduct[] }) => {
        const promises = wishlistProducts.map(product => 
            addToWishlistDB(userId, product.id)
        );
        await Promise.all(promises);
        return true;
    }
);

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

        clearLocalWishlist: (state) => {
            state.wishlistProducts = [];
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.fulfilled, () => {
            })
            
            .addCase(syncWishlistToSupabase.fulfilled, () => {
            })
    }
})

export const { toggleWishlist, removeFromWishlist, clearLocalWishlist } = wishlistSlice.actions
export const selectWishlist = (state: RootState): IWishlistState => state.wishlist;
export default wishlistSlice.reducer