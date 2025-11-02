import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";
import { z } from "zod";
import { loginSchema } from "../../validation";
import CookieService from "../../services/CookieService";
import { RootState } from "../store";
import toast from "react-hot-toast";

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
        const res = await axiosInstance.post("/api/auth/local", userData)
        return res.data
    }

    catch (error: any) {
        const msg = error?.response?.data?.error?.message
        return (rejectWithValue(msg))
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
                state.data = action.payload;
                state.error = null;
                toast.success("Sucessfully logged in!", {
                            position: "bottom-center",
                            duration: 3000,
                            style: { background: 'white', color: 'black' }
                        })
                const date = new Date();
                const IN_DAYS = 3
                const EXPIRES_IN_DAYS = 1000 * 60 * 60 * 24 * IN_DAYS
                date.setTime(date.getTime() + EXPIRES_IN_DAYS);
                const options =  { path: "/", expires: date };
                CookieService.set("jwt", action.payload.jwt, options)
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
                state.error = action.payload ?? "Unknown error";
                toast.error(state.error || "Login failed", { 
                    position: "bottom-center", 
                    duration: 3000, 
                    style: { background: 'white', color: 'black' }
                });
            });
    },
});

export const selectLogin = (state: RootState): ILoginState => state.login;
export default loginSlice.reducer;

