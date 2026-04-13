import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

// 1. Fetch Dashboard Analytics
export const fetchDashboardStats = createAsyncThunk(
    "admin/fetchStats",
    async (_, thunkAPI) => {
        try {
            const resp = await api.get("admin-interface/dashboard-stats/");
            return resp.data.result;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch stats");
        }
    }
);

// 2. Fetch All Workers
export const fetchWorkers = createAsyncThunk(
    "admin/fetchWorkers",
    async (_, thunkAPI) => {
        try {
            const resp = await api.get("admin-interface/get-workers/");
            return resp.data.result;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch workers");
        }
    }
);

// 3. Fetch All Employers
export const fetchEmployers = createAsyncThunk(
    "admin/fetchEmployers",
    async (_, thunkAPI) => {
        try {
            const resp = await api.get("admin-interface/get-employers/");
            return resp.data.result;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch employers");
        }
    }
);

// 4. Toggle Worker Block
export const toggleWorkerBlock = createAsyncThunk(
    "admin/toggleWorkerBlock",
    async (workerId, thunkAPI) => {
        try {
            const resp = await api.post(`admin-interface/block-worker/${workerId}/`);
            return { workerId, is_active: resp.data.is_active };
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || "Failed to toggle block");
        }
    }
);

// 5. Toggle Employer Block
export const toggleEmployerBlock = createAsyncThunk(
    "admin/toggleEmployerBlock",
    async (employerId, thunkAPI) => {
        try {
            const resp = await api.post(`admin-interface/block-employer/${employerId}/`);
            return { employerId, is_active: resp.data.is_active };
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || "Failed to toggle block");
        }
    }
);

// 6. Fetch All Jobs
// 6. Fetch All Jobs
export const fetchJobs = createAsyncThunk(
    "admin/fetchJobs",
    async ({ page = 1, status = "", search = "" } = {}, thunkAPI) => {
        try {
            let url = `admin-interface/get-jobs/?page=${page}`;
            if (status) url += `&status=${status}`;
            if (search) url += `&search=${search}`;
            
            const resp = await api.get(url);
            return resp.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch jobs");
        }
    }
);

// 7. Fetch All Financials
export const fetchFinancials = createAsyncThunk(
    "admin/fetchFinancials",
    async ({ page = 1, search = "" } = {}, thunkAPI) => {
        try {
            const url = search 
                ? `admin-interface/get-financials/?page=${page}&search=${search}` 
                : `admin-interface/get-financials/?page=${page}`;
            const resp = await api.get(url);
            return resp.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch financials");
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        stats: null,
        workers: [],
        employers: [],
        jobs: [],
        jobsPagination: {
            currentPage: 1,
            totalPages: 1,
            totalCount: 0,
        },
        financials: [],
        financialsPagination: {
            currentPage: 1,
            totalPages: 1,
            totalCount: 0,
        },
        loading: false,
        error: null,
        searchQuery: ""
    },
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Stats
            .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Workers
            .addCase(fetchWorkers.fulfilled, (state, action) => {
                state.workers = action.payload;
            })
            // Employers
            .addCase(fetchEmployers.fulfilled, (state, action) => {
                state.employers = action.payload;
            })
            // Jobs
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.jobs = action.payload.result;
                state.jobsPagination = {
                    currentPage: action.payload.current_page,
                    totalPages: action.payload.total_pages,
                    totalCount: action.payload.count,
                };
            })
            // Financials
            .addCase(fetchFinancials.fulfilled, (state, action) => {
                state.financials = action.payload.result;
                state.financialsPagination = {
                    currentPage: action.payload.current_page,
                    totalPages: action.payload.total_pages,
                    totalCount: action.payload.count,
                };
            })
            // Toggle Block
            .addCase(toggleWorkerBlock.fulfilled, (state, action) => {
                const worker = state.workers.find(w => w.id === action.payload.workerId);
                if (worker) worker.is_active = action.payload.is_active;
            })
            .addCase(toggleEmployerBlock.fulfilled, (state, action) => {
                const employer = state.employers.find(e => e.id === action.payload.employerId);
                if (employer) employer.is_active = action.payload.is_active;
            });
    }
});

export const { setSearchQuery } = adminSlice.actions;
export default adminSlice.reducer;
