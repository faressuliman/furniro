import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { IProduct } from "../../interfaces";
import { RootState } from "../store";
import { fetchWishlistFromDB, addToWishlistDB, checkProductInWishlistDB, removeFromWishlistDB, hydrateWishlist } from "../../lib/api";
import toast from "react-hot-toast";

export interface IWishlistProduct extends IProduct {
    wishlistItemId?: number
}

export interface IWishlistState {
    wishlistProducts: IWishlistProduct[],
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
        const promises = wishlistProducts.map(async (product) => {
            const existing = await checkProductInWishlistDB(userId, product.id);
            if (!existing) {
                await addToWishlistDB(userId, product.id);
            }
        });
        await Promise.all(promises);
        return true;
    }
);

export const fetchAndHydrateWishlist = createAsyncThunk('wishlist/fetchAndHydrateWishlist', async (userId: string, { rejectWithValue }) => {
    try {
        const wishlistItems = await fetchWishlistFromDB(userId);
        if (wishlistItems.length === 0) return [];

        const hydratedWishlist = await hydrateWishlist(wishlistItems);
        return hydratedWishlist;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

export const toggleWishlistAsync = createAsyncThunk('wishlist/toggleWishlistAsync', async ({ userId, product }: { userId: string, product: IProduct }, { rejectWithValue }) => {
    try {
        const existing = await checkProductInWishlistDB(userId, product.id);

        if (existing) {
            await removeFromWishlistDB(existing.id);
            return { product, action: 'remove' as const };
        } else {
            const result = await addToWishlistDB(userId, product.id);
            return { product: { ...product, wishlistItemId: result[0].id }, action: 'add' as const };
        }
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

export const removeFromWishlistAsync = createAsyncThunk('wishlist/removeFromWishlistAsync', async ({ userId, productId }: { userId: string, productId: number }, { rejectWithValue }) => {
    try {
        const existing = await checkProductInWishlistDB(userId, productId);
        if (existing) {
            await removeFromWishlistDB(existing.id);
        }
        return productId;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

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
                toast.success("Removed from wishlist!", {
                    position: "bottom-right",
                    duration: 2000,
                    style: { background: 'white', color: 'black' }
                });
            }

            else {
                state.wishlistProducts.push({ ...action.payload })
                toast.success("Added to wishlist!", {
                    position: "bottom-right",
                    duration: 2000,
                    style: { background: 'white', color: 'black' }
                });
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
            
            .addCase(fetchAndHydrateWishlist.fulfilled, (state, action) => {
                state.wishlistProducts = action.payload;
            })
            
            .addCase(toggleWishlistAsync.fulfilled, (state, action) => {
                if (action.payload.action === 'remove') {
                    state.wishlistProducts = state.wishlistProducts.filter(p => p.id !== action.payload.product.id);
                    toast.success("Removed from wishlist!", {
                        position: "bottom-right",
                        duration: 2000,
                        style: { background: 'white', color: 'black' }
                    });
                } else {
                    state.wishlistProducts.push(action.payload.product);
                    toast.success("Added to wishlist!", {
                        position: "bottom-right",
                        duration: 2000,
                        style: { background: 'white', color: 'black' }
                    });
                }
            })
            
            .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
                state.wishlistProducts = state.wishlistProducts.filter(p => p.id !== action.payload);
            })
    }
})

export const { toggleWishlist, removeFromWishlist, clearLocalWishlist } = wishlistSlice.actions
export const selectWishlist = (state: RootState): IWishlistState => state.wishlist;
export default wishlistSlice.reducer