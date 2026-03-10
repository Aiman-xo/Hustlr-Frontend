import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axiosInstance";
// import { builtinRules } from "eslint/use-at-your-own-risk";

export const ProfileSetup = createAsyncThunk(
    'profile-set',
    async (userData,thunkAPI)=>{
        try{
             await api.post('profile-setup/',userData);

            // return resp.data

        }
        catch(error){
            return thunkAPI.rejectWithValue(error?.response?.data)
        }

    }
)


export const FetchProfile = createAsyncThunk(
    'profile-get',
    async (_, thunkAPI) => {

        try {
            const resp = await api.get('profile-setup/');
            return resp.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

export const FetchSkill = createAsyncThunk(
    'fetch-skill',
    async (search='',thunkAPI)=>{

        try{
            const resp = await api.get(`skill/?search=${search}`)
            
            return resp.data
        }
        catch (error){
            return thunkAPI.rejectWithValue(error?.response?.data)
        }
    }
)

export const WorkerProfilePost = createAsyncThunk(
    'worker-profile-setup',
    async(userData,thunkAPI)=>{

        try{
            const resp = await api.post('worker-setup/',userData)

            return resp.data

        }
        catch(error){
            return thunkAPI.rejectWithValue(error?.response?.data)
        }
    }
)

export const EmployerProfilePost = createAsyncThunk(
    'Employer-profile-setup',
    async(userData,thunkAPI)=>{
        try{
            await api.post('employer-setup/',{
                company_name : userData.company_name
            })
        }
        catch(error){
            return thunkAPI.rejectWithValue(error?.response?.data)
        }
    }
)

export const FetchWorkerProfile = createAsyncThunk(
    'FetchWorker-profile',
    async(_,thunkAPI)=>{
        try{
            const resp = await api.get('worker-setup/')
            return resp.data
        }
        catch(error){
            return thunkAPI.rejectWithValue(error?.response?.data)
        }
    }
)

export const FetchEmployerProfile = createAsyncThunk(
    'FetchEmployer-profile',
    async(_,thunkAPI)=>{
        try{
            const resp = await api.get('employer-setup/')
            return resp.data
        }
        catch(error){
            return thunkAPI.rejectWithValue(error?.response?.data)
        }
    }
)

export const FetchAllUsers = createAsyncThunk(
    'FetchAll-users',
    async(_,thunkAPI)=>{
        try {
            // Adjust this URL to your Django endpoint that lists all users
            const resp = await api.get('all-users/');
            return resp.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
)

const ProfileSetupSlice = createSlice({
    name:"profile-setup-slice",
    initialState:{
        profileData:null,
        workerData:null,
        employerData:null,
        allUsers:[],
        loading:false,
        error:null,
        skills:[]
    },

    extraReducers:(builder)=>{
        builder
        .addCase(ProfileSetup.pending,(state)=>{
            state.loading = true
        })
        .addCase(ProfileSetup.fulfilled,(state,action)=>{
            state.loading = false
            state.error  = null
            state.profileData = action.payload
        })
        .addCase(ProfileSetup.rejected,(state,action)=>{
            state.loading = false
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
        // --- GET Profile Cases ---
        .addCase(FetchProfile.pending, (state) => {
            state.loading = true;
        })
        .addCase(FetchProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profileData = action.payload; // This fills your form on page load!
        })
        .addCase(FetchProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = "Could not load profile.";
        })

        builder
        .addCase(FetchSkill.pending,(state)=>{
            state.loading = true
        })
        .addCase(FetchSkill.fulfilled,(state,action)=>{
            state.loading=false;
            state.skills = action.payload;
        })
        .addCase(FetchSkill.rejected,(state,action)=>{
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

            state.error = "Couldn't get Skills";
        })

        builder
        .addCase(WorkerProfilePost.pending,(state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(WorkerProfilePost.fulfilled,(state,action)=>{
            state.loading = false
            state.error = null
            // state.workerData = action.payload
            
        })
        .addCase(WorkerProfilePost.rejected,(state,action)=>{
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

            state.error = "Couldn't get worker data";
        })

        builder
        .addCase(FetchWorkerProfile.pending,(state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(FetchWorkerProfile.fulfilled,(state,action)=>{
            state.loading=false,
            state.error = null,
            state.workerData = action.payload
        })
        .addCase(FetchWorkerProfile.rejected,(state,action)=>{
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
            state.error = "Couldn't get worker data";
        })

        builder
        .addCase(FetchAllUsers.pending, (state) => {
            state.loading = true;
        })
        .addCase(FetchAllUsers.fulfilled, (state, action) => {
            state.loading = false;
            // Make sure you add 'allUsers: []' to your initialState
            state.allUsers = action.payload; 
        })
        .addCase(FetchAllUsers.rejected, (state) => {
            state.loading = false;
            state.error = "Failed to load users.";
        });

        builder
        .addCase(EmployerProfilePost.pending,(state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(EmployerProfilePost.fulfilled,(state)=>{
            state.loading = false,
            state.error = null
        })
        .addCase(EmployerProfilePost.rejected,(state,action)=>{
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

            state.error = "Couldn't get Employer data";
        })
        
        builder
        .addCase(FetchEmployerProfile.pending,(state)=>{
            state.loading =true,
            state.error = null
        })
        .addCase(FetchEmployerProfile.fulfilled,(state,action)=>{
            state.loading = false,
            state.error =null,
            state.employerData = action.payload
        })
        .addCase(FetchEmployerProfile.rejected,(state,action)=>{
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

            state.error = "Couldn't get Employer data";
            
        })
    }
})

export default ProfileSetupSlice.reducer
