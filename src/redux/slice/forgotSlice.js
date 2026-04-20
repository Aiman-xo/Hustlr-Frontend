import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const GenerateOTP = createAsyncThunk(
    'generate-otp',
    async (userData,thunkAPI)=>{
        try{
            const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/reset/otp/`,{
                email:userData
            },{
                withCredentials:true
            })

            const reset_session = resp.data.reset_session
            localStorage.setItem('reset_session',reset_session)

        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data)
        }
    }
)

export const VerifyOTP = createAsyncThunk(
    'verify-otp',
    async (userData,thunkAPI)=>{
        try{
            await axios.post(`${import.meta.env.VITE_API_URL}/api/verify/otp/`,{
                reset_session:localStorage.getItem('reset_session'),
                entered_otp:userData
            })
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data)
        }
    }
)

export const ResetPassword = createAsyncThunk(
    'reset-password',
    async (userData,thunkAPI)=>{
        try{
            const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/reset/password/`,{
                reset_session:localStorage.getItem('reset_session'),
                new_password:userData.new_password,
                confirm_password:userData.confirm_password
            })

            if (resp.data){
                localStorage.removeItem('reset_session')
            }
        }
        catch(error){
            return thunkAPI.rejectWithValue(error?.response.data)
        }
    }
)


const forgotSlice = createSlice({
    name:"forgot-slice",
    initialState:{
        entered_otp:null,
        otp_send:false,
        loading:null,
        error:null

    },
    reducers: {
        clearForgotState: (state) => {
          state.otp_send = false;
          state.error = null;
          state.loading = false;
        }
      },
      

    extraReducers:(builder)=>{

        builder
        .addCase(GenerateOTP.pending,(state)=>{
            state.loading = true,
            state.error = null 
        })
        .addCase(GenerateOTP.fulfilled,(state,action)=>{
            state.loading = false
            state.otp_send = true

        })
        .addCase(GenerateOTP.rejected,(state,action)=>{
            state.loading = false;

            const payload = action.payload;
            // Case 1: Backend sent a string message
            if (typeof payload === "string") {
              state.error = payload;
              return;
            }

            // Case 2: Backend sent field-wise validation errors
            if (payload && typeof payload === "object") {
                const firstField = Object.keys(payload)[0];
                const messages = payload[firstField];
            
                    // Handle array-based errors (most common)
                    if (Array.isArray(messages)) {
                        state.error = messages[0];
                        return;
                    }
                    // Handle single-message object
                    if (typeof messages === "string") {
                        state.error = messages;
                        return;
                    }
                }

            state.error = "Request failed.";

        })

        builder
        .addCase(VerifyOTP.pending,(state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(VerifyOTP.fulfilled,(state,action)=>{
            state.loading = false
        })
        .addCase(VerifyOTP.rejected,(state,action)=>{
            state.loading = false;

            const payload = action.payload;
            // Case 1: Backend sent a string message
            if (typeof payload === "string") {
              state.error = payload;
              return;
            }

            // Case 2: Backend sent field-wise validation errors
            if (payload && typeof payload === "object") {
                const firstField = Object.keys(payload)[0];
                const messages = payload[firstField];
            
                    // Handle array-based errors (most common)
                    if (Array.isArray(messages)) {
                        state.error = messages[0];
                        return;
                    }
                    // Handle single-message object
                    if (typeof messages === "string") {
                        state.error = messages;
                        return;
                    }
                }

            state.error = "Request failed.";

        })

        builder
        .addCase(ResetPassword.pending,(state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(ResetPassword.fulfilled,(state,action)=>{
            state.loading = false,
            state.error = null

        })
        .addCase(ResetPassword.rejected,(state,action)=>{
                        state.loading = false;

            const payload = action.payload;
            // Case 1: Backend sent a string message
            if (typeof payload === "string") {
              state.error = payload;
              return;
            }

            // Case 2: Backend sent field-wise validation errors
            if (payload && typeof payload === "object") {
                const firstField = Object.keys(payload)[0];
                const messages = payload[firstField];
            
                    // Handle array-based errors (most common)
                    if (Array.isArray(messages)) {
                        state.error = messages[0];
                        return;
                    }
                    // Handle single-message object
                    if (typeof messages === "string") {
                        state.error = messages;
                        return;
                    }
                }

            state.error = "Request failed.";
        })

    }

})

export default forgotSlice.reducer
export const { clearForgotState } = forgotSlice.actions;

