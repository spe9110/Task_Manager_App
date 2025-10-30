import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createAccountSchema } from "../validation/createAccount.js";
import { loginAccountSchema } from "../validation/loginAccount.js";
import gravatar from 'gravatar';
import { secretOrKey } from "../config/key.js";

// @desc This API is used to create a user account
// endpoint POST /api/v1/auth/users/create 
// access PUBLIC
export const createAccount = async (req, res, next) => {
    try {
        // step 1 - Validate request body
        const { error } = createAccountSchema.validate(req.body, { abortEarly: false });
        if(error) return res.status(400).json({ error: error.details[0].message})
        
        // step 2 - get data
        const { username, email, password, password_confirm, avatar, role } = req.body;

        // step 3 - check if the user is already
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return next({ status: 400, message: "User already exists." });
        }
        
        // step 4 - Generate gravatar URL
        const avatarUrl = gravatar.url(email, {
            s: '200',  // Size of avatar
            r: 'pg',   // Rating
            d: 'mm'    // Default
        });

        // step 5 - Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // step 6 - create new user
        const newUser = await User.create({
            username,
            email,
            role,
            password: hashedPassword,
            avatar: avatarUrl,  // Use the generated gravatar URL
        });

        // step 7 - remove password from the response
        newUser.password = undefined;

        // step 8 - return the response
        return res.status(201).json({ success: true, message: "User created successfully", user: newUser });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// @desc This API is used to create a user account
// endpoint POST post('/create) 
// access PUBLIC
export const loginAccount = async (req, res, next) => {
    try {
        // step 1 - Validate request body
        const { error } = loginAccountSchema.validate(req.body, { abortEarly: false });
        if(error) return res.status(400).json({ error: error.details[0].message})
        
        // step 2 - Destructure email and password from request body
        const { email, password } = req.body;

        // step 3 - check if user exist
        const user = await User.findOne({ email });
        if(!user){
            return next({ status: 404, message: "User not found" });
        }

        // step 4 - Check if password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return next({ status: 401, message: "Invalid password" });
        }

        // step 5 - create a token for the user
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
        }

        // step 6 - sign the token
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); 
     
        // step 7 - cookie to store the token
        res.cookie('AccessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
            sameSite: 'Strict', // Prevent CSRF attacks
            maxAge: 15 * 60 * 1000 // 15 minutes
        })
        
        // step 8 - response with user data and token
        res.status(200).json({
            message: "User logged in successfully",
            token: accessToken,
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
        })
    } catch (error) {
        next(error)
    }
}

// @desc This API is used to create a user account
// endpoint POST post('/create) 
// access PUBLIC
export const logoutAccount = async (req, res, next) => {
    try {
         // Clear the cookie
        res.clearCookie('AccessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'Strict'
        });
        
        res.status(200).json({ message: "User logged out successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// send verification OTP to the user's email
export const sendOtpVerificationEmail = async (req, res, next) => {
  try {
    const userId = req.user; // Assuming user is set in the request by an authentication middleware

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
        return next({ status: 404, message: "User not found" });
    }

    if (user.isAccountVerified) {
        return next({ status: 400, message: "Account is already verified." });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the OTP and expiration time to the user's document
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send the OTP to the user's email
    /*const mailOptions = {
      from: {
        name: "Spencer Wawaku",
        address: process.env.EMAIL_SENDER
      },
      to: user.email,
      subject: "Email Verification OTP",
      // text: `Hello ${user.name || ""},\n\nYour OTP for email verification is: ${otp}\n\nPlease use this OTP to verify your email address.\n\nBest regards,\nMERN Auth Team`,
      html: EMAIL_TEMPLATE
        .replace("{{otp}}", otp)
        .replace("{{email}}", user.email)
        .replace("{{name}}", user.name)
    };

    await transporter.sendMail(mailOptions);
    */
    return res.status(200).json({ success: true, message: "Verification email sent successfully." });

  } catch (error) {
    next(error);
  }
};

// ---------------------------
// Verify Email with OTP
// ---------------------------
export const verifyEmail = async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (!otp) return next({ status: 400, message: "OTP is required." });

    const userId = req.user; // Assuming user is set in the request by authentication middleware
    const user = await User.findById(userId);

    if (!user) return next({ status: 404, message: "User not found." });

    // Check if OTP is correct
    if (!user.verifyOtp || user.verifyOtp !== otp)
      return next({ status: 400, message: "Invalid OTP." });

    // Check if OTP has expired
    if (!user.verifyOtpExpireAt || user.verifyOtpExpireAt < Date.now())
      return next({ status: 400, message: "OTP has expired." });

    // Mark the account as verified
    user.isAccountVerified = true;
    user.verifyOtp = ""; // Clear OTP
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully."});
  } catch (error) {
    next(error);
  }
};

// ---------------------------
// Check Authentication
// ---------------------------
export const isAuthenticated = (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: "User is authenticated",
      userId: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------
// Send Password Reset OTP
// ---------------------------
export const PasswordResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next({ status: 400, message: "Email is required." });

    // Find user
    const user = await User.findOne({ email });
    if (!user) return next({ status: 404, message: "User not found." });

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiration
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

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

    return res.status(200).json({
      success: true,
      message: "OTP was sent to your email address.",
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------
// Reset Password
// ---------------------------
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return next({
        status: 400,
        message: "Email, OTP, and new password are required.",
      });

    const user = await User.findOne({ email });
    if (!user) return next({ status: 404, message: "User not found." });

    if (!user.resetOtp || user.resetOtp !== otp)
      return next({ status: 400, message: "Invalid OTP." });

    if (!user.resetOtpExpireAt || user.resetOtpExpireAt < Date.now())
      return next({ status: 400, message: "OTP has expired." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    return res
      .status(200).json({ success: true, message: "Password reset successfully." });
  } catch (error) {
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