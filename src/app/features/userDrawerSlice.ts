import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IUserDrawerState {
    isOpenUserDrawer: boolean
}

const initialState: IUserDrawerState = {
    isOpenUserDrawer: false
}

const userDrawer = createSlice({
    name: "userDrawer",
    initialState,
    reducers: {
        openUserDrawer: (state) => {state.isOpenUserDrawer = true},
        closeUserDrawer: (state) => {state.isOpenUserDrawer = false}
    }
})

export const { openUserDrawer, closeUserDrawer } = userDrawer.actions
export const selectUser = (state: RootState) => state.userDrawer.isOpenUserDrawer
export default userDrawer.reducer