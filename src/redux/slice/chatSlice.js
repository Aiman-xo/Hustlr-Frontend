import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import api from '../../api/axiosInstance';

export const FetchChatEligibleUsers = createAsyncThunk(
  'Chat-eligible/users',
  async(_,thunkApi)=>{
    try{
      const resp = await api.get('chat-list/');
      return resp.data;
    }
    catch(error){
      return thunkApi.rejectWithValue(error?.response?.data)
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    isConnected: false,
    loading: false, // Added for UI feedback
    error: null,
    contacts:null
  },
  reducers: {
    setConnected: (state, action) => { state.isConnected = action.payload; },
    setHistory: (state, action) => {
      state.messages = action.payload; 
    },
    // Inside chatSlice.js reducers:
    receiveMessage: (state, action) => {
      // If it's history, we usually don't need to check for duplicates 
      // unless you suspect the backend is sending them.
      // Let's ensure we are comparing the right fields.
      const newMessage = action.payload;
      if (newMessage.type === 'chat_history') return;
      
      const isDuplicate = state.messages.some(m => 
          m.timestamp === newMessage.timestamp && 
          (m.message === newMessage.message || m.content === newMessage.message)
      );
  
      if (!isDuplicate) {
          state.messages.push(newMessage);
      }
  },
    setError: (state, action) => { state.error = action.payload; },
    connect: (state, action) => {
      state.messages = []; // Clear old messages so history doesn't mix up!
      state.error = null;
    }, 
    sendMessage: (state, action) => {},
    disconnect: (state, action) => {
        state.isConnected = false;
        state.messages = [];
    },
  },
  extraReducers:(builder)=>{
    builder
    .addCase(FetchChatEligibleUsers.pending,(state)=>{
      state.loading = true;
      state.error = null;
    })
    .addCase(FetchChatEligibleUsers.fulfilled,(state,action)=>{
      state.loading = false;
      state.error = null;
      state.contacts = action.payload
    })
    .addCase(FetchChatEligibleUsers.rejected,(state,action)=>{
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
  }
});

export const chatActions = chatSlice.actions;
export default chatSlice.reducer;