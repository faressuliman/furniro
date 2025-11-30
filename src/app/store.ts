import { configureStore } from "@reduxjs/toolkit";
import menuDrawerSlice from "./features/menuDrawerSlice"
import userDrawerSlice from "./features/userDrawerSlice"
import categoryDrawerSlice from "./features/categoryDrawerSlice"
import loginSlice from "./features/loginSlice"
import registerSlice from "./features/registerSlice"
import cartSlice from "./features/cartSlice"
import wishlistSlice from "./features/wishlistSlice"
import searchDrawerReducer from "./features/searchDrawerSlice"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

const persistCartConfig = {
    key: "cart",
    storage
}

const persistedCart = persistReducer(persistCartConfig, cartSlice)

const persistWishlistConfig = {
    key: "wishlist",
    storage
}

const persistedWishlist = persistReducer(persistWishlistConfig, wishlistSlice)


export const store = configureStore({
    reducer: {
        menuDrawer: menuDrawerSlice,
        userDrawer: userDrawerSlice,
        categoryDrawer: categoryDrawerSlice,
        login: loginSlice,
        register: registerSlice,
        cart: persistedCart,
        wishlist: persistedWishlist,
        searchDrawer: searchDrawerReducer,
    }
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch