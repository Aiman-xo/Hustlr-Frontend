import axios from 'axios';
import { setRefreshing,updateAccessToken } from '../redux/slice/authSlice';
import { store } from '../redux/store';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/`,
    withCredentials: true,
});

// Variables to manage the queue
let isRefreshing = false;
let refreshSubscribers = [];

// Helper to push requests into a waiting list
const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};

// Helper to resolve all waiting requests once we have a new token
const onRefreshed = (token) => {
    refreshSubscribers.map((cb) => cb(token));
    refreshSubscribers = [];
};

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;
        const originalRequest = config;

        if (response?.status === 401 && !originalRequest._retry) {
            
            if (isRefreshing) {
                // IMPORTANT: If a refresh is already in progress, 
                // return a promise that resolves when onRefreshed is called
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            store.dispatch(setRefreshing(true));

            try {
                const resp = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/token/refresh/`, 
                    {}, 
                    { withCredentials: true }
                );

                const { access_token } = resp.data;
                store.dispatch(updateAccessToken(access_token));
                localStorage.setItem('access_token', access_token);
                
                isRefreshing = false;
                store.dispatch(setRefreshing(false));
                onRefreshed(access_token); // Wake up the waiting requests

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                store.dispatch(setRefreshing(false));
                localStorage.removeItem('access_token');
                // Only redirect if it's not a background process or if you want a hard logout
                window.location.href = '/login';
                console.log(refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;