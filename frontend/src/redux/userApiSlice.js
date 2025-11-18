import { apiSlice } from "./apiSlice.js";

const USERS_URL = '/api/v1';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth/users/register`,
                method: 'POST',
                body: data,
            }),
        }),
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth/users/login`,
                method: 'POST',
                body: data,
            }),
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/auth/users/logout`,
                method: 'POST',
            }),
        }),
        fetchCurrentUser: builder.query({
            query: () => ({
                url: `${USERS_URL}/users/current`,
                method: 'GET',
            }),
            providesTags: ['User'], // Cache the result with the tag 'User'
        }),
        verifyEmailUser : builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth/users/verify-otp`,
                method: 'POST',
                body: data,
            }),
        }),
        sendOtpVerification : builder.mutation({
            query: () => ({
                url: `${USERS_URL}/auth/users/send-otp-verify`,
                method: 'POST',
            }),
        }),
        sendResetPassword : builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth/users/send-reset-password`,
                method: 'POST',
                body: data,
            }),
        }),
        ResetPassword : builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth/users/reset-password`,
                method: 'POST',
                body: data,
            }),
        }),
        updateUser: builder.mutation({
            query: ({ id, files, ...data }) => {
                const formData = new FormData();

                // append file(s)
                if (files && files.length > 0) {
                formData.append("file", files[0]); // single file
                // for multiple files: files.forEach((f) => formData.append("files", f));
                }

                // append other fields
                Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
                });

                return {
                url: `${USERS_URL}/users/update/${id}`,
                method: "PUT",
                body: formData,
                };
            },
            invalidatesTags: ["User"],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${USERS_URL}/users/delete/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["User"],
        })
    }),
});

export const { useLoginMutation, 
    useLogoutUserMutation, 
    useRegisterUserMutation, 
    useUpdateUserMutation, 
    useFetchCurrentUserQuery, 
    useVerifyEmailUserMutation, 
    useSendOtpVerificationMutation, 
    useSendResetPasswordMutation, 
    useResetPasswordMutation, 
    useDeleteUserMutation } = usersApiSlice;