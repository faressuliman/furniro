import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ICategoryDrawerState {
    isOpenCategoryDrawer: boolean
}

const initialState: ICategoryDrawerState = {
    isOpenCategoryDrawer: false
}

const categoryDrawer = createSlice({
    name: "categoryDrawer",
    initialState,
    reducers: {
        openCategoryDrawer: (state) => {state.isOpenCategoryDrawer = true},
        closeCategoryDrawer: (state) => {state.isOpenCategoryDrawer = false}
    }
})

export const { openCategoryDrawer, closeCategoryDrawer } = categoryDrawer.actions
export const selectCategoryDrawer = (state: RootState) => state.categoryDrawer.isOpenCategoryDrawer
export default categoryDrawer.reducer

