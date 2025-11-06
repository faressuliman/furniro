import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ISidebarState {
    isOpenSidebar: boolean

}

const initialState: ISidebarState = {
    isOpenSidebar: false
}

const menuDrawerSlice = createSlice({
    name: "menuDrawer",
    initialState,
    reducers: {
        openSidebar: (state) => { state.isOpenSidebar = true },
        closeSidebar: (state) => { state.isOpenSidebar = false }
    }
})

export const { openSidebar, closeSidebar } = menuDrawerSlice.actions
export const selectMenu = (state: RootState) => state.menuDrawer.isOpenSidebar
export default menuDrawerSlice.reducer