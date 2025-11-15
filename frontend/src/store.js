import { configureStore } from "@reduxjs/toolkit";
import authReducer from './redux/authSlice.js'
import { apiSlice } from "./redux/apiSlice.js"
// Configure Redux store
const store = configureStore({
    reducer: {
        auth: authReducer, // Authentication state
        [apiSlice.reducerPath]: apiSlice.reducer, // RTK Query API slice 
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable check for non-serializable data (e.g., Date objects)
        }).concat(apiSlice.middleware), // Add API middleware for caching and invalidation
    devTools: true, // Enable Redux DevTools for debugging
});

export default store;