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
        const { username, email, password, password_confirm, avatar } = req.body;

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
        const accessToken = jwt.sign(payload, secretOrKey, { expiresIn: '15m' }); 
     
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
        return res.status(500).json({ success: false, message: error.message });
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

/*
When deploying to production, consider these additional practices:

Set NODE_ENV to "production"
Use a process manager like PM2 or Forever
Enable compression with compression middleware
Use a reverse proxy like Nginx
Implement proper logging and monitoring
Set up proper error tracking

*/ 