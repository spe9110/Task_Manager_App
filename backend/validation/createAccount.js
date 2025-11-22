import Joi from "joi";

export const createAccountSchema = Joi.object({
    username: Joi.string().min(2).max(25).required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(8).max(250).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required(),
    password_confirm: Joi.any().valid(Joi.ref('password')).required(),
    role: Joi.string().trim().valid('user', 'admin').default('user').optional(), 
});


// update user
export const updateUserSchema = Joi.object({
    username: Joi.string().trim().min(2).max(25).optional().messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name cannot be more than 25 characters long',
    })
});

// validate a password reset request
export const passwordResetSchema = Joi.object({
    email: Joi.string().email().trim().required().messages({
        'string.email': 'Please provide a valid email address',
    }),
    otp: Joi.string().length(6).required().messages({
        'string.length': 'OTP must be exactly 6 characters long',
    }),
    newPassword: Joi.string()
        .min(8)
        .max(255)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .required()
        .messages({
            'string.min': 'newPassword must be at least 8 characters long',
            'string.max': 'newPassword cannot be more than 255 characters long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        })
});