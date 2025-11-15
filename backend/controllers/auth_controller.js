import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createAccountSchema } from "../validation/createAccount.js";
import { loginAccountSchema } from "../validation/loginAccount.js";
import gravatar from 'gravatar';
import { secretOrKey } from "../config/key.js";
import logger from "../config/logging.js";
// @desc This API is used to create a user account
// endpoint POST /api/v1/auth/users/create 
// access PUBLIC
export const createAccount = async (req, res, next) => {
    try {
        logger.info("createAccount - start", { route: req.originalUrl, method: req.method, body: req.body });

        // step 1 - Validate request body
        const { error } = createAccountSchema.validate(req.body, { abortEarly: false });
        if(error) {
            logger.warn("createAccount - validation failed", { error: error.details[0].message });
            return res.status(400).json({ error: error.details[0].message });
        }
        
        // step 2 - get data
        const { username, email, password, password_confirm, avatar, role } = req.body;

        // step 3 - check if the user already exists
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            logger.warn("createAccount - user already exists", { email });
            return next({ status: 400, message: "User already exists." });
        }
        
        // step 4 - Generate gravatar URL
        const avatarUrl = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

        // step 5 - Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // step 6 - create new user
        const newUser = await User.create({
            username,
            email,
            role,
            password: hashedPassword,
            avatar: avatarUrl,
        });

        // step 7 - remove password from the response
        newUser.password = undefined;

        logger.info("createAccount - user created successfully", { userId: newUser._id, email });

        // step 8 - return the response
        return res.status(201).json({ success: true, message: "User created successfully", user: newUser });
    } catch (error) {
        logger.error("createAccount - error", { error: error.message });
        return res.status(500).json({ success: false, message: error.message });
    }
}

// @desc This API is used to login a user
// endpoint POST /api/v1/auth/login 
// access PUBLIC
export const loginAccount = async (req, res, next) => {
    try {
        logger.info("loginAccount - start", { route: req.originalUrl, method: req.method, body: req.body });

        // step 1 - Validate request body
        const { error } = loginAccountSchema.validate(req.body, { abortEarly: false });
        if(error) {
            logger.warn("loginAccount - validation failed", { error: error.details[0].message });
            return res.status(400).json({ error: error.details[0].message });
        }
        
        // step 2 - Destructure email and password
        const { email, password } = req.body;

        // step 3 - check if user exists
        const user = await User.findOne({ email });
        if(!user){
            logger.warn("loginAccount - user not found", { email });
            return next({ status: 404, message: "User not found" });
        }

        // step 4 - Check if password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            logger.warn("loginAccount - invalid password", { email });
            return next({ status: 401, message: "Invalid password" });
        }

        // step 5 - create a token
        const payload = { id: user._id, email: user.email, role: user.role };

        // step 6 - sign the token
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); 
     
        // step 7 - set cookie
        res.cookie('AccessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000
        });
        
        logger.info("loginAccount - user logged in successfully", { userId: user._id, email });

        // step 8 - return response
        res.status(200).json({
            message: "User logged in successfully",
            token: accessToken,
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
        });
    } catch (error) {
        logger.error("loginAccount - error", { error: error.message });
        next(error);
    }
}

// @desc This API is used to logout a user
// endpoint POST /api/v1/auth/logout 
// access PUBLIC
export const logoutAccount = async (req, res, next) => {
    try {
        logger.info("logoutAccount - start", { route: req.originalUrl, method: req.method, userId: req.user?.id || "anonymous" });

        // Clear the cookie
        res.clearCookie('AccessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'Strict'
        });
        
        logger.info("logoutAccount - user logged out successfully", { userId: req.user?.id || "anonymous" });

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        logger.error("logoutAccount - error", { error: error.message });
        return res.status(500).json({ success: false, message: error.message });
    }
}
// send verification OTP to the user's email
export const sendOtpVerificationEmail = async (req, res, next) => {
  try {
    const userId = req.user.id;
    logger.info("sendOtpVerificationEmail - start", { userId });

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
        logger.warn("sendOtpVerificationEmail - user not found", { userId });
        return next({ status: 404, message: "User not found" });
    }

    if (user.isAccountVerified) {
        logger.warn("sendOtpVerificationEmail - account already verified", { userId });
        return next({ status: 400, message: "Account is already verified." });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    logger.info("sendOtpVerificationEmail - OTP saved successfully", { userId, otp });

    // Email sending commented out, but can log intent
    logger.info("sendOtpVerificationEmail - OTP email ready to send", { userEmail: user.email });

    return res.status(200).json({ success: true, message: "Verification email sent successfully." });
  } catch (error) {
    logger.error("sendOtpVerificationEmail - error", { error: error.message });
    next({status: 500, message: error.message});
  }
};

// ---------------------------
// Verify Email with OTP
// ---------------------------
export const verifyEmail = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const userId = req.user;
    logger.info("verifyEmail - start", { userId, otp });

    if (!otp) {
      logger.warn("verifyEmail - OTP not provided", { userId });
      return next({ status: 400, message: "OTP is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      logger.warn("verifyEmail - user not found", { userId });
      return next({ status: 404, message: "User not found." });
    }

    if (!user.verifyOtp || user.verifyOtp !== otp) {
      logger.warn("verifyEmail - invalid OTP", { userId, otp });
      return next({ status: 400, message: "Invalid OTP." });
    }

    if (!user.verifyOtpExpireAt || user.verifyOtpExpireAt < Date.now()) {
      logger.warn("verifyEmail - OTP expired", { userId });
      return next({ status: 400, message: "OTP has expired." });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    logger.info("verifyEmail - email verified successfully", { userId });

    return res.status(200).json({ success: true, message: "Email verified successfully." });
  } catch (error) {
    logger.error("verifyEmail - error", { error: error.message });
    next(error);
  }
};

// ---------------------------
// Check Authentication
// ---------------------------
export const isAuthenticated = (req, res, next) => {
  try {
    const userId = req.user;
    logger.info("isAuthenticated - check", { userId });
    return res.status(200).json({
      success: true,
      message: "User is authenticated",
      userId,
    });
  } catch (error) {
    logger.error("isAuthenticated - error", { error: error.message });
    next(error);
  }
};
// ---------------------------
// Send Password Reset OTP
// ---------------------------
export const PasswordResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    logger.info("PasswordResetEmail - start", { email });

    if (!email) {
      logger.warn("PasswordResetEmail - email not provided");
      return next({ status: 400, message: "Email is required." });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("PasswordResetEmail - user not found", { email });
      return next({ status: 404, message: "User not found." });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiration
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    logger.info("PasswordResetEmail - OTP saved successfully", { email, otp });

    // Send OTP via email
    const mailOptions = {
      from: {
        name: "Spencer Wawaku",
        address: process.env.EMAIL_SENDER,
      },
      to: user.email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_TEMPLATE
        .replace("{{otp}}", otp)
        .replace("{{email}}", user.email)
        .replace("{{name}}", user.name),
    };

    await transporter.sendMail(mailOptions);
    logger.info("PasswordResetEmail - OTP email sent successfully", { email });

    return res.status(200).json({
      success: true,
      message: "OTP was sent to your email address.",
    });
  } catch (error) {
    logger.error("PasswordResetEmail - error", { error: error.message });
    next(error);
  }
};

// ---------------------------
// Reset Password
// ---------------------------
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    logger.info("resetPassword - start", { email });

    if (!email || !otp || !newPassword) {
      logger.warn("resetPassword - missing parameters", { email });
      return next({
        status: 400,
        message: "Email, OTP, and new password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("resetPassword - user not found", { email });
      return next({ status: 404, message: "User not found." });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      logger.warn("resetPassword - invalid OTP", { email, otp });
      return next({ status: 400, message: "Invalid OTP." });
    }

    if (!user.resetOtpExpireAt || user.resetOtpExpireAt < Date.now()) {
      logger.warn("resetPassword - OTP expired", { email });
      return next({ status: 400, message: "OTP has expired." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    logger.info("resetPassword - password reset successfully", { email });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    logger.error("resetPassword - error", { error: error.message });
    next(error);
  }
};

/*
When deploying to production, consider these additional practices:

Set NODE_ENV to "production"
Use a process manager like PM2 or Forever
Enable compression with compression middleware
Use a reverse proxy like Nginx
Implement proper logging and monitoring
Set up proper error tracking

*/ 