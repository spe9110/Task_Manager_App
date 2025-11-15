import express from "express";
import { createAccount, loginAccount, logoutAccount, sendOtpVerificationEmail, verifyEmail, isAuthenticated, PasswordResetEmail, resetPassword } from "../controllers/auth_controller.js";
import { userAuth } from '../middleware/authenticate.js'
import rateLimit from "../middleware/rateLimit.js";

const router = express.Router();

// @desc This API is used to create a user account
// endpoint POST /api/v1/auth/users/create 
// access PUBLIC
router.post('/register', createAccount);

// @desc This API is used to login to user account
// endpoint POST /api/v1/auth/users/login
// access PUBLIC
router.post('/login', rateLimit, loginAccount);

// @desc This API is used to logout from user account
// endpoint POST /api/v1/auth/users/logout 
// access PUBLIC
router.post('/logout', logoutAccount);

// @desc This API is used to logout from user account
// endpoint POST /api/v1/auth/users/logout 
// access PUBLIC
router.post('/send-otp-verify', userAuth, sendOtpVerificationEmail)

// @desc This API is used to verify email using OTP
// endpoint POST /api/v1/auth/users/verify-otp
// access PRIVATE
router.post('/verify-otp', userAuth, verifyEmail);


// @desc This API is used to check the authentication
// @endpoint GET /api/v1/auth/users/is-auth
// @access PRIVATE
router.get('/is-auth', userAuth, isAuthenticated);

// @desc This API is used to handle reset password request sent
// @endpoint POST /api/v1/auth/users/sent-reset-password
// @access PRIVATE
router.post('/send-reset-password', PasswordResetEmail);

// @desc This API is used to handle the reset password business logic
// @endpoint POST /api/v1/auth/users/reset-password
// @access PRIVATE
router.post('/reset-password', resetPassword);

export default router