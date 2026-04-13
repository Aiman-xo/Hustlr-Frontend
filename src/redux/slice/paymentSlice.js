import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const CreateRazorpayClient =createAsyncThunk(
    'createClient',
    async (bill_id,thunkAPI)=>{
        try{
            const resp = await api.post(`create-payment-client/${bill_id}/`);
            return resp.data;

        }catch(err){
            return thunkAPI.rejectWithValue(err?.response?.data)
        }
    }
);

export const VerifyPayment = createAsyncThunk(
    'verify/payment',
    async (userData,thunkAPI)=>{
        try{
            const resp = await api.post(`payment-verify/`, userData);
            return resp.data
        }
        catch(err){
            return thunkAPI.rejectWithValue(err?.response?.data)
        }
    }
)

const paymentSlice = createSlice({
    name:'Razorpay-payment',
    initialState:{
        loading:false,
        error:null,
        client_data:[],
        verified_data:[]

    },
    extraReducers:(builder)=>{
        builder
        .addCase(CreateRazorpayClient.pending,(state,action)=>{
            state.loading=true;
            state.error = null
        })
        .addCase(CreateRazorpayClient.fulfilled, (state,action)=>{
            state.loading = false;
            state.error = null;
            state.client_data = action.payload;
        })
        .addCase(CreateRazorpayClient.rejected, (state,action)=>{
            state.loading=false;
            state.error = action.error || 'cannot process the request'
        })

        builder
        .addCase(VerifyPayment.pending,(state,action)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(VerifyPayment.fulfilled, (state,action)=>{
            state.loading = false;
            state.error = null;
            state.verified_data = action.payload;
        })
        .addCase(VerifyPayment.rejected, (state,action)=>{
            state.loading=false;
            state.error = action.error || 'cannot process the request'
        })

    }
})

export default paymentSlice.reducer