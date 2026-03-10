import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const FetchAllWorkers = createAsyncThunk(
    'Fetch-Workers',
    async (params = {}, thunkAPI) => {
        try {
            const resp = await api.get('all-workers', { params })
            return {
                data: resp.data,
                isFirstPage: !params.page || params.page === 1
            }
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data)
        }
    }
)

export const SendJobRequest = createAsyncThunk(
    'Send-Job-Request',
    async (userData, thunkAPI) => {
        try {
            await api.post('job-request/', userData)

        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data)
        }
    }
)

export const SeeJobRequests = createAsyncThunk(
    'Recieve-Job-Request',
    async ({ status, page }, thunkAPI) => {
        try {
            const resp = await api.get('request-handle/', {
                params: { status, page }
            });
            return resp.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data)
        }
    }
)

export const CancelJobRequest = createAsyncThunk(
    'Cancel-Job-Request',
    async (jonRequestId, thunkAPI) => {
        try {
            const resp = await api.post(`request-handle/${jonRequestId}/`)
            return resp.data
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data)
        }
    }
)

export const AcceptJobStart = createAsyncThunk(
    'employer/accept-job-start',
    async (jobRequestId, thunkAPI) => {
        try {
            const resp = await api.post(`request-handle/${jobRequestId}/`, { action: 'accept_start' });
            return resp.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

const EmployerSlice = createSlice({
    name: 'Employer-Details-slice',
    initialState: {
        loading: false,
        error: null,
        allWorkers: null,
        allJobRequests: [],
        totalCount: 0,
        hasNext: false,
        hasPrevious: false,
        currentPage: 1,
        currentStatus: ''
    },
    extraReducers: (builder) => {
        builder
            .addCase(FetchAllWorkers.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(FetchAllWorkers.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                if (action.payload.isFirstPage) {
                    // If it's a new search or page 1, replace the list
                    state.allWorkers = action.payload.data;
                } else {
                    // If it's "Load More", append the new results to the existing ones
                    state.allWorkers = {
                        ...action.payload.data,
                        results: [...state.allWorkers.results, ...action.payload.data.results]
                    };
                }
            })
            .addCase(FetchAllWorkers.rejected, (state, action) => {
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
            .addCase(SendJobRequest.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(SendJobRequest.fulfilled, (state) => {
                state.loading = false
                state.error = null

            })
            .addCase(SendJobRequest.rejected, (state, action) => {
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
            .addCase(SeeJobRequests.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(SeeJobRequests.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.allJobRequests = action.payload.results || []
                state.totalCount = action.payload.count;
                state.hasNext = !!action.payload.next;
                state.hasPrevious = !!action.payload.previous;
            })
            .addCase(SeeJobRequests.rejected, (state, action) => {
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
            .addCase(CancelJobRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CancelJobRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // Option A: If your backend returns the updated job object
                const updatedJob = action.payload;

                // Find the job in the current list and update its status
                const index = state.allJobRequests.findIndex(job => job.id === updatedJob.id);
                if (index !== -1) {
                    // state.allJobRequests[index].status = 'cancelled';
                    state.allJobRequests[index] = updatedJob;
                }
            })
            .addCase(CancelJobRequest.rejected, (state, action) => {
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
            .addCase(AcceptJobStart.fulfilled, (state, action) => {
                const updatedJob = action.payload;
                const index = state.allJobRequests.findIndex(job => job.id === updatedJob.id);
                if (index !== -1) {
                    state.allJobRequests[index] = updatedJob;
                }
            })
    }
})

export default EmployerSlice.reducer