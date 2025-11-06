import { createSlice } from "@reduxjs/toolkit";

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
export default menuDrawerSlice.reducer