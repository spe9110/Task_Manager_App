import User from "../models/user.model.js";
import logger from "../config/logging.js";

//  @desc This API is used to fetch list of users
// endpoint GET /api/v1/users/
// access PRIVATE
export const getAllUsers = async (req, res, next) => {
    try {
        logger.info("Fetching all users", { route: req.originalUrl, method: req.method, user: req.user?.id || "anonymous" });

        const users = await User.find({}).select('-password'); // Exclude password from the response
        if (!users || users.length === 0) {
            logger.warn("No users found", { route: req.originalUrl, method: req.method });
            return next({ status: 404, message: "No users found" });
        }

        const usersNumber = await User.countDocuments();

        logger.info("Users fetched successfully", { count: usersNumber });

        res.status(200).json({
            message: "Users fetched successfully",
            count: usersNumber,
            data: users,
        }); 
    } catch (error) {
        logger.error("Error fetching all users", { error: error.message });
        return res.status(500).json({ success: false, message: error.message });
    }
}

// @desc This API is used to fetch current user
// endpoint GET /api/v1/users/current
// access PRIVATE
export const getCurrentUser = async (req, res, next) => {
  try {
    logger.info("Fetching current user", { userId: req.user?.id || "anonymous" });

    return res.status(200).json({
        success: true,
        user: req.user
    });
  } catch (error) {
    logger.error("Error fetching current user", { error: error.message });
    next(error);
  }
};

// @desc This API is used to fetch single user
// endpoint GET /api/v1/users/:id
// access PRIVATE
export const getSingleUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        logger.info("Fetching single user", { userId: id, requestedBy: req.user?.id || "anonymous" });

        const user = await User.findById(id);

        if (!user) {
            logger.warn("User not found", { userId: id });
            return next({ status: 404, message: "No user found" });
        }

        logger.info("Single user fetched successfully", { userId: id });

        res.status(200).json({
            message: "User fetched successfully",
            data: user
        }); 
    } catch (error) {
        logger.error("Error fetching single user", { error: error.message });
        return res.status(500).json({ success: false, message: error.message });
    }
}

// @desc This API is used to update a user profile
// endpoint app.put() 
// access PRIVATE
export const updateAccount = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, avatar } = req.body;

        // Ensure user is updating their own account
        if (id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }

        const updates = {};
        if (username) updates.username = username;
        if (avatar) updates.avatar = avatar;

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

        // Remove sensitive fields
        const { password, verifyOtp, resetOtp, ...safeUser } = updatedUser.toObject();

        return res.status(200).json({ message: "User updated successfully", data: safeUser });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



// @desc This API is used to delete a user profile
// endpoint app.delete() 
// access PRIVATE
export const deleteAccount = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return next({ status: 404, message: "No user found" });
        }
        res.status(200).json({
            message: "User deleted successfully"
        }); 
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}