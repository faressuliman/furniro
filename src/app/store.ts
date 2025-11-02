import { configureStore } from "@reduxjs/toolkit";
import menuDrawerSlice from "./features/menuDrawerSlice"
import userDrawerSlice from "./features/userDrawerSlice"
import loginSlice from "./features/loginSlice"
import registerSlice from "./features/registerSlice"

export const store = configureStore({
    reducer: {
        menuDrawer: menuDrawerSlice,
        userDrawer: userDrawerSlice,
        login: loginSlice,
        register: registerSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch