import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../../interfaces";
import { RootState } from "../store";
import toast from "react-hot-toast";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCartFromDB, addToCartDB, checkProductInCartDB, updateCartItemDB, removeFromCartDB, hydrateCart } from "../../lib/api";

export interface ICartProduct extends IProduct {
    quantity: number
    cartItemId?: number
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
    const promises = cartProducts.map(async (product) => {
        const existing = await checkProductInCartDB(userId, product.id);
        if (existing) {
            await updateCartItemDB(existing.id, existing.quantity + product.quantity);
        } else {
            await addToCartDB(userId, product.id, product.quantity);
        }
    });
    await Promise.all(promises);
    return true;
})

export const fetchAndHydrateCart = createAsyncThunk('cart/fetchAndHydrateCart', async (userId: string, { rejectWithValue }) => {
    try {
        const cartItems = await fetchCartFromDB(userId);
        if (cartItems.length === 0) return [];

        const hydratedCart = await hydrateCart(cartItems);
        return hydratedCart;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

export const addToCartAsync = createAsyncThunk('cart/addToCartAsync', async ({ userId, product }: { userId: string, product: IProduct }, { rejectWithValue }) => {
    try {
        const existing = await checkProductInCartDB(userId, product.id);

        if (existing) {
            await updateCartItemDB(existing.id, existing.quantity + 1);
            return { ...product, quantity: existing.quantity + 1, cartItemId: existing.id };
        } else {
            const result = await addToCartDB(userId, product.id, 1);
            return { ...product, quantity: 1, cartItemId: result[0].id };
        }
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

export const removeFromCartAsync = createAsyncThunk('cart/removeFromCartAsync', async ({ userId, productId }: { userId: string, productId: number }, { rejectWithValue }) => {
    try {
        const existing = await checkProductInCartDB(userId, productId);
        if (existing) {
            await removeFromCartDB(existing.id);
        }
        return productId;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

export const increaseQuantityAsync = createAsyncThunk('cart/increaseQuantityAsync', async ({ userId, productId, currentQuantity }: { userId: string, productId: number, currentQuantity: number }, { rejectWithValue }) => {
    try {
        const existing = await checkProductInCartDB(userId, productId);
        if (existing) {
            await updateCartItemDB(existing.id, currentQuantity + 1);
        }
        return productId;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

export const decreaseQuantityAsync = createAsyncThunk('cart/decreaseQuantityAsync', async ({ userId, productId, currentQuantity }: { userId: string, productId: number, currentQuantity: number }, { rejectWithValue }) => {
    try {
        const existing = await checkProductInCartDB(userId, productId);
        if (existing) {
            if (currentQuantity > 1) {
                await updateCartItemDB(existing.id, currentQuantity - 1);
            } else {
                await removeFromCartDB(existing.id);
            }
        }
        return productId;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

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
                toast.success("Quantity updated!", {
                    position: "bottom-right",
                    duration: 3000,
                    style: { background: 'white', color: 'black' }
                });
            }

            else {
                state.cartProducts.push({ ...action.payload, quantity: 1 })
                toast.success("Product added to cart!", {
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
            })
            
            .addCase(fetchAndHydrateCart.fulfilled, (state, action) => {
                state.cartProducts = action.payload;
                state.count = action.payload.reduce((acc: number, product: ICartProduct) => acc + product.quantity, 0);
            })
            
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                const existingProduct = state.cartProducts.find(p => p.id === action.payload.id);
                
                if (existingProduct) {
                    existingProduct.quantity = action.payload.quantity;
                    existingProduct.cartItemId = action.payload.cartItemId;
                } else {
                    state.cartProducts.push(action.payload);
                }
                
                state.count = state.cartProducts.reduce((acc, product) => acc + product.quantity, 0);
                
                toast.success(existingProduct ? "Quantity updated!" : "Product added to cart!", {
                    position: "bottom-right",
                    duration: 3000,
                    style: { background: 'white', color: 'black' }
                });
            })
            
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                state.cartProducts = state.cartProducts.filter(p => p.id !== action.payload);
                state.count = state.cartProducts.reduce((acc, product) => acc + product.quantity, 0);
            })
            
            .addCase(increaseQuantityAsync.fulfilled, (state, action) => {
                const product = state.cartProducts.find(p => p.id === action.payload);
                if (product) {
                    product.quantity += 1;
                }
                state.count = state.cartProducts.reduce((acc, product) => acc + product.quantity, 0);
            })
            
            .addCase(decreaseQuantityAsync.fulfilled, (state, action) => {
                const product = state.cartProducts.find(p => p.id === action.payload);
                if (product) {
                    if (product.quantity > 1) {
                        product.quantity -= 1;
                    } else {
                        state.cartProducts = state.cartProducts.filter(p => p.id !== action.payload);
                    }
                }
                state.count = state.cartProducts.reduce((acc, product) => acc + product.quantity, 0);
            });
    }
})

export const { openCartDrawer, closeCartDrawer, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearLocalCart } = cartSlice.actions
export const selectCart = (state: RootState): ICartState => state.cart;
export default cartSlice.reducer