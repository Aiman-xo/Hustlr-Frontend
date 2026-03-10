import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slice/authSlice';
import forgotReducer from './slice/forgotSlice';
import profileReducer from './slice/profileSlice'; 
import chatReducer from './slice/chatSlice';
import employerReducer from './slice/employerSlice';
import workerReducer from './slice/workerSlice';
import chatMiddleware from './middlewares/chatMiddleware';

export const store = configureStore({
    reducer:{
        auth:authReducer,
        resetPass:forgotReducer,
        profile:profileReducer,
        chat:chatReducer,
        employer:employerReducer,
        worker:workerReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(chatMiddleware),
});