import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ISearchDrawerState {
    isOpenSearchDrawer: boolean
}

const initialState: ISearchDrawerState = {
    isOpenSearchDrawer: false
}

const searchDrawerSlice = createSlice({
    name: "searchDrawer",
    initialState,
    reducers: {
        openSearchDrawer: (state) => { state.isOpenSearchDrawer = true },
        closeSearchDrawer: (state) => { state.isOpenSearchDrawer = false }
    }
})

export const { openSearchDrawer, closeSearchDrawer } = searchDrawerSlice.actions
export const selectSearchDrawer = (state: RootState) => state.searchDrawer.isOpenSearchDrawer
export default searchDrawerSlice.reducer
