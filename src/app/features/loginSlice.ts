import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { z } from "zod";
import { loginSchema } from "../../validation";
import { RootState } from "../store";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient";

export type IUserLoginData = z.infer<typeof loginSchema>;

export interface ILoginState {
    loading: boolean;
    data: any;
    error: string | null;
}

const initialState: ILoginState = {
    loading: false, // Pending
    data: null, // Success
    error: null // Error
}

export const userLogin = createAsyncThunk<any, IUserLoginData, { rejectValue: string }>("login/userLogin", async (userData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password
        })

        if (error) {
            return rejectWithValue(error.message)
        }

        return data
    }

    catch (error: any) {
        return rejectWithValue(error?.message || "Something went wrong")
    }
})

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.user ?? null;
                state.error = null;
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
                state.error = action.payload ?? "Invalid login credentials";
                toast.error(state.error || "Invalid login credentials", { 
                    position: "bottom-center", 
                    duration: 3000, 
                    style: { background: 'white', color: 'black' }
                });
            });
    },
});

export const selectLogin = (state: RootState): ILoginState => state.login;
export default loginSlice.reducer;

