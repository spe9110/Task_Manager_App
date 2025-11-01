import express from "express";
import { createAccount, loginAccount, logoutAccount, sendOtpVerificationEmail } from "../controllers/auth_controller.js";
import { userAuth } from '../middleware/authenticate.js'

const router = express.Router();

// @desc This API is used to create a user account
// endpoint POST /api/v1/auth/users/create 
// access PUBLIC
router.post('/register', createAccount);

// @desc This API is used to login to user account
// endpoint POST /api/v1/auth/users/login
// access PUBLIC
router.post('/login', loginAccount);

// @desc This API is used to logout from user account
// endpoint POST /api/v1/auth/users/logout 
// access PUBLIC
router.post('/logout', logoutAccount);

// // @desc This API is used to logout from user account
// endpoint POST /api/v1/auth/users/logout 
// access PUBLIC
router.post('/send-otp-verify', userAuth, sendOtpVerificationEmail)


export default router