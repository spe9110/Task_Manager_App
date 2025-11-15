import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../Util.js'; // Import the base URL from environment variables
import { logout } from './authSlice.js';

// Base query configuration with error handling and authentication
const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL || 'http://localhost:5000', // Use environment variable for base URL
    credentials: 'include', // Include cookies or credentials
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.userData?.token; // Fetch token from Redux state
        if (token) {
            headers.set('Authorization', `Bearer ${token}`); // Set Authorization header
        }
        return headers;
    },
});

// Wrapper to handle token expiration / 401
const baseQueryWithReauth = async (args, api, extraOptions) => {
  try {
   let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
      console.warn("⚠️ Unauthorized: logging out user...");
      api.dispatch(logout());        // clear Redux + localStorage
      window.location.href = "/signin"; // redirect to login
    }
    return result; 
  } catch (error) {
    console.error("API Error:", error);
  }
};

// Create API slice
export const apiSlice = createApi({
    reducerPath: 'api', // Unique reducer path for this API slice
    baseQuery: baseQueryWithReauth,
    // baseQuery,
    // tagTypes: ['User', 'Company', 'Profile'], // Define tags for cache invalidation
    tagTypes: ['User'], // Define tags for cache invalidation
    endpoints: (builder) => ({}) // Define endpoints in other slices (e.g., usersApiSlice)
});