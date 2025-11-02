import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";
import { z } from "zod";
import { registerSchema } from "../../validation";
import { RootState } from "../store";
import toast from "react-hot-toast";
import CookieService from "../../services/CookieService";

export type IUserRegisterData = z.infer<typeof registerSchema>;

export interface IRegisterState {
    loading: boolean;
    data: any;
    error: string | null;
}

const initialState: IRegisterState = {
    loading: false, // Pending
    data: null, // Success
    error: null // Error
}

export const userRegister = createAsyncThunk<any, { username: string; email: string; password: string }, { rejectValue: string }>("register/userRegister", async (userData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    try {
        const res = await axiosInstance.post("/api/auth/local/register", userData)
        return res.data
    }

    catch (error: any) {
        const msg = error?.response?.data?.error?.message
        return (rejectWithValue(msg))
    }
})

const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userRegister.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userRegister.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
                toast.success("Your account has been successfully created!", {
                    position: "bottom-center",
                    duration: 3000,
                    style: { background: 'white', color: 'black' }
                });
                const date = new Date();
                const IN_DAYS = 3
                const EXPIRES_IN_DAYS = 1000 * 60 * 60 * 24 * IN_DAYS
                date.setTime(date.getTime() + EXPIRES_IN_DAYS);
                const options = { path: "/", expires: date };
                CookieService.set("jwt", action.payload.jwt, options)
            })
            .addCase(userRegister.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
                state.error = action.payload ?? "Unknown error";
                toast.error(state.error || "Registration failed", {
                    position: "bottom-center",
                    duration: 3000,
                    style: { background: 'white', color: 'black' }
                });
            });
    },
});

export const selectRegister = (state: RootState): IRegisterState => state.register;
export default registerSlice.reducer;

