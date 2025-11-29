import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabaseClient";
import { z } from "zod";
import { registerSchema } from "../../validation";
import { RootState } from "../store";
import toast from "react-hot-toast";

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
        const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    username: userData.username
                }
            }
        })

        if (error) {
            return rejectWithValue(error.message)
        }

        return { user: data.user, session: data.session }
    }

    catch (error: any) {
        return rejectWithValue(error?.message || "Something went wrong")
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

