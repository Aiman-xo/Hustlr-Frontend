import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import api from "../../api/axiosInstance";
import axios from "axios";

export const FetchJobInbox = createAsyncThunk(
    'Job-inbox',
    async (_, thunkApi) => {
        try {
            const resp = await api.get('job-inbox/')
            return resp.data
        }
        catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data)
        }
    }
)

export const JobRequestHandle = createAsyncThunk(
    'JobRequest-accept/reject',
    async ({ jobRequestId, action }, thunkApi) => {
        try {
            const resp = await api.post(`job-request-handle/${jobRequestId}/`, { action })
            return { ...resp.data, jobRequestId }
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data)
        }
    }
)

export const SetJobEstimateTime = createAsyncThunk(
    'set-JobEstimateTime',
    async ({ jobRequestId, estimate_time }, thunkApi) => {
        try {
            await api.patch(`job-request-handle/${jobRequestId}/`, { 'estimated_hours': estimate_time })
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data)
        }
    }
)

export const StartJob = createAsyncThunk(
    'worker/start-job',
    async (jobRequestId, thunkApi) => {
        try {
            const resp = await api.post(`job-request-handle/${jobRequestId}/`, { action: 'start' });
            return { ...resp.data, jobRequestId };
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data);
        }
    }
);

export const FinishJob = createAsyncThunk(
    'worker/finish-job',
    async ({ jobRequestId, material_amount }, thunkApi) => {
        try {
            const resp = await api.post(`job-request-handle/${jobRequestId}/`, { action: 'finish', material_amount });
            return { ...resp.data, jobRequestId };
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data);
        }
    }
);

export const FetchActiveJobs = createAsyncThunk(
    'Fetch-activejobs',
    async (_, thunkApi) => {
        try {
            const resp = await api.get('active-jobs')
            return resp.data
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data)
        }
    }
)

export const FetchNotifications = createAsyncThunk(
    'Fetch-Notification',
    async (_, thunkApi) => {
        try {
            const resp = await api.get('see-notification/');
            return resp.data

        }
        catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data)
        }
    }
)

export const MarkasRead = createAsyncThunk(
    'Mark-asRead-Notification',
    async (data = {}, thunkApi) => { // Default to empty object if no ID is sent
        try {
            // Even if data is {}, the POST request will trigger your "Mark All" logic in Django
            const resp = await api.post('see-notification/', data);
            return { resp: resp.data, sentData: data };
        }
        catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data);
        }
    }
);

export const SendJobMaterials = createAsyncThunk(
    'Job-Materials',
    async (userData, thunkApi) => {
        try {
            await api.post('job-materials/', userData);
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data)
        }
    }
)

export const GetJobMaterials = createAsyncThunk(
    'GetJobMaterials',
    async (job_id, thunkApi) => {
        try {
            const resp = await api.get(`see-job-materials/${job_id}/`)
            return resp.data
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data)
        }
    }
)

const WorkerSlice = createSlice({
    name: "worker-slice",
    initialState: {
        loading: false,
        error: null,
        jobInbox: null,
        updatedJobInbox: null,
        AllNotifications: [],
        unreadCount: null,
        activeJobs: null,
        materialNotes: []
    },
    extraReducers: (builder) => {
        builder
            .addCase(FetchJobInbox.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(FetchJobInbox.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.jobInbox = action.payload
            })
            .addCase(FetchJobInbox.rejected, (state, action) => {
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
            .addCase(JobRequestHandle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(JobRequestHandle.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                const { id, new_status } = action.payload;

                // Find the specific job in the list and update its status
                const index = state.jobInbox.findIndex(job => job.id === id);
                if (index !== -1) {
                    state.jobInbox[index].status = new_status;
                }

                // Also keep this for global reference if needed
                state.updatedJobInbox = action.payload;
            })
            .addCase(JobRequestHandle.rejected, (state, action) => {
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
            .addCase(FetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(FetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.AllNotifications = action.payload.result
                state.unreadCount = action.payload.unread_count;
            })
            .addCase(FetchNotifications.rejected, (state, action) => {
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
            .addCase(MarkasRead.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(MarkasRead.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                const { sentData } = action.payload;

                if (sentData?.notification_id) {
                    // Handle "Mark One" (if you pass an ID)
                    const item = state.AllNotifications.find(n => n.id === sentData.notification_id);
                    if (item) item.is_read = true;
                    state.unread_count = Math.max(0, state.unread_count - 1);
                } else {
                    // Handle "Mark All" (if no ID was passed)
                    state.AllNotifications = state.AllNotifications.map(n => ({
                        ...n,
                        is_read: true
                    }));
                    state.unread_count = 0; // Reset the counter to 0
                }
            })
            .addCase(MarkasRead.rejected, (state, action) => {
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
            .addCase(FetchActiveJobs.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(FetchActiveJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.activeJobs = action.payload
            })
            .addCase(FetchActiveJobs.rejected, (state, action) => {
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
            .addCase(SetJobEstimateTime.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(SetJobEstimateTime.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(SetJobEstimateTime.rejected, (state, action) => {
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
            .addCase(SendJobMaterials.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(SendJobMaterials.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(SendJobMaterials.rejected, (state, action) => {
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
            .addCase(GetJobMaterials.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(GetJobMaterials.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const newNotes = action.payload; // Array of notes for ONE job

                // Filter out any old notes for this specific job before adding new ones
                // This prevents duplicates but keeps notes from OTHER jobs safe
                const jobId = newNotes.length > 0 ? newNotes[0].job : null;

                if (jobId) {
                    state.materialNotes = [
                        ...state.materialNotes.filter(note => note.job !== jobId),
                        ...newNotes
                    ];
                } else {
                    // If the job has 0 notes, we still keep the others
                    state.materialNotes = state.materialNotes;
                }
            })
            .addCase(GetJobMaterials.rejected, (state, action) => {
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
            .addCase(StartJob.fulfilled, (state, action) => {
                const { jobRequestId, new_status } = action.payload;
                const index = state.jobInbox?.findIndex(job => job.id === jobRequestId);
                if (index !== -1 && index !== undefined) {
                    state.jobInbox[index].status = new_status;
                }
                if (state.activeJobs) {
                    const activeIndex = state.activeJobs.findIndex(job => job.id === jobRequestId);
                    if (activeIndex !== -1) state.activeJobs[activeIndex].status = new_status;
                }
            })
            .addCase(FinishJob.fulfilled, (state, action) => {
                const { jobRequestId, new_status } = action.payload;
                const index = state.jobInbox?.findIndex(job => job.id === jobRequestId);
                if (index !== -1 && index !== undefined) {
                    state.jobInbox[index].status = new_status;
                }
                if (state.activeJobs) {
                    const activeIndex = state.activeJobs.findIndex(job => job.id === jobRequestId);
                    if (activeIndex !== -1) state.activeJobs[activeIndex].status = new_status;
                }
            })
    }
})

export default WorkerSlice.reducer