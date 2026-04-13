import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import api from '../../api/axiosInstance'



export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const resp = await axios.post('http://127.0.0.1/api/register/', userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })

      const token = resp.data.access_token

      localStorage.setItem("access_token", token);

      const decoded = jwtDecode(token);

      return {
        user: { ...resp.data, id: decoded.id },
        isNewUser: resp.data.is_new_user,
        role: decoded.role,
        email: decoded.email,
        date_joined: decoded.date_joined,
        isProfileSetup: decoded.is_profile_setup
      }

    }
    catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {

    try {
      const resp = await axios.post('http://127.0.0.1/api/login/', userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })

      const token = resp.data.access_token


      localStorage.setItem("access_token", token);

      const decoded = jwtDecode(token);
      console.log(decoded.id);

      return {
        user: { ...resp.data, id: decoded.id },
        isNewUser: resp.data.is_new_user,
        role: decoded.role,
        email: decoded.email,
        date_joined: decoded.date_joined,
        isProfileSetup: decoded.is_profile_setup
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }

  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await axios.post('http://127.0.0.1/api/logout/', {}, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      })
      return true
    }
    catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || 'Logout failed!')
    }
  }
)

export const initAuth = createAsyncThunk(
  "auth/init",
  async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    const decoded = jwtDecode(token);

    return {
      access_token: token,
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      date_joined: decoded.date_joined,
      isProfileSetup: decoded.is_profile_setup
    };
  }
);

export const GoogleAuth = createAsyncThunk(
  'auth/googleauth',
  async ({ code, role }, { rejectWithValue }) => {
    try {
      const resp = await axios.post('http://127.0.0.1/api/google/auth/', {
        code,
        role
      }, {
        withCredentials: true
      })
      const token = resp.data.access_token
      console.log(token);

      localStorage.setItem("access_token", token);

      const decoded = jwtDecode(token);
      console.log(decoded.id);

      return {
        user: resp.data,
        isNewUser: resp.data.is_new_user,
        role: decoded.role,
        email: decoded.email,
        date_joined: decoded.date_joined,
        isProfileSetup: decoded.is_profile_setup
      }
    }
    catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

// Add this thunk at the top of your slice file
export const SaveLocation = createAsyncThunk(
  'location/save',
  async (locationData, thunkAPI) => {
    try {
      // This hits your class LocationView(APIView)
      const resp = await api.post('location/', locationData);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isNewUser: false,
    loading: false,
    error: null,
    access_token: null,
    role: null,
    email: null,
    date_joined: null,
    isAuthenticated: false,
    isProfileSetup: false,

    authInitialized: false,
    isRefreshing: false,

    location: null
  },
  reducers: {
    // Use this for the Axios Interceptor
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
    // Use this to sync Axios results to Redux
    updateAccessToken: (state, action) => {
      const token = action.payload;
      try {
        const decoded = jwtDecode(token); 

        state.access_token = token;
        state.role = decoded.role || "worker";
        state.email = decoded.email || "";
        state.date_joined = decoded.date_joined || "";
        state.isProfileSetup = decoded.is_profile_setup || false;
        state.user = { id: decoded.id || decoded.user_id };

        state.isAuthenticated = true;
        state.isRefreshing = false;
      } catch (error) {
        console.error("Token decoding failed", error);
        state.isAuthenticated = false;
        state.isRefreshing = false;
      }
    }
  },

  extraReducers: (builder) => {
    //registering
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.user.message;
        state.isNewUser = true;
        state.access_token = action.payload.user.access_token
        state.role = action.payload.role
        state.email = action.payload.email
        state.date_joined = action.payload.date_joined
        state.isProfileSetup = action.payload.isProfileSetup
        state.isAuthenticated = true
      })
      .addCase(registerUser.rejected, (state, action) => {
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

        // Case 3: Absolute fallback (only if backend gave nothing)
        state.error = "Request failed.";
      });
    //login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
        state.isNewUser = action.payload.isNewUser;
        state.role = action.payload.role;
        state.email = action.payload.email;
        state.date_joined = action.payload.date_joined;
        state.isProfileSetup = action.payload.isProfileSetup;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;

        const payload = action.payload;

        if (typeof payload === "string") {
          state.error = payload;
          return;
        }

        if (payload && typeof payload === "object") {
          const firstField = Object.keys(payload)[0];
          const messages = payload[firstField];

          if (Array.isArray(messages)) {
            state.error = messages[0];
            return;
          }

          if (typeof messages === "string") {
            state.error = messages;
            return;
          }
        }

        state.error = "Login failed.";
      });
    //initAuth for persisting isAuthenticated=true
    builder
      .addCase(initAuth.pending, (state) => {
        state.authInitialized = false
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.authInitialized = true
        if (!action.payload) return;

        state.access_token = action.payload.access_token;
        state.role = action.payload.role;
        state.email = action.payload.email;
        state.user = { id: action.payload.id };
        state.date_joined = action.payload.date_joined;
        state.isProfileSetup = action.payload.isProfileSetup;
        state.isAuthenticated = true;
      })
      .addCase(initAuth.rejected, (state) => {
        state.authInitialized = true
        state.isAuthenticated = false
      })
    //logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.access_token = null;
        state.role = null;
        state.email = null;
        state.date_joined = null;
        state.isAuthenticated = false;
        state.isProfileSetup = false;
        state.error = null;

        localStorage.removeItem("access_token");
      })

    //google auth
    builder
      .addCase(GoogleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GoogleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.access_token = action.payload.user.access_token
        state.isNewUser = action.payload.isNewUser;
        state.role = action.payload.role
        state.email = action.payload.email
        state.date_joined = action.payload.date_joined
        state.isProfileSetup = action.payload.isProfileSetup
        state.isAuthenticated = true
      })
      .addCase(GoogleAuth.rejected, (state, action) => {
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

        // Case 3: Absolute fallback (only if backend gave nothing)
        state.error = "Google Authentication failed";
      });

    builder
      .addCase(SaveLocation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(SaveLocation.fulfilled, (state, action) => {
        state.loading = false,
          state.error = null,
          state.location = action.payload
      })
      .addCase(SaveLocation.rejected, (state, action) => {
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

        // Case 3: Absolute fallback (only if backend gave nothing)
        state.error = "Google Authentication failed";
      })



  },
})

export const { setRefreshing, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
