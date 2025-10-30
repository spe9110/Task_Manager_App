import User from "../models/user.model.js";

// @desc This API is used to fetch list of users
// endpoint GET /api/v1/users/
// access PRIVATE
export const getAllUsers = async (req, res, next) => {
    try {
         const users = await User.find({}).select('-password'); // Exclude password from the response
        if (!users || users.length === 0) {
            return next({ status: 404, message: "No users found" });
        }
        const usersNumber = await User.countDocuments();
        res.status(200).json({
            message: "Users fetched successfully",
            count: usersNumber,
            data: users,
        }); 
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// @desc This API is used to fetch current user
// endpoint GET /api/v1/users/current
// access PRIVATE
export const getCurrentUser = async (req, res, next) => {
  try {
    const authHeader = req?.headers?.authorization;

  // Get token from either cookies or Authorization header
  const token = req.cookies?.AccessToken || 
  (authHeader && authHeader?.startsWith('Bearer ') && authHeader?.split(' ')[1]);
    console.log("✅ getCurrentUser req.user:", token); // Debug log
    return res.status(200).json({
        success: true,
        user: req.user
    });
  } catch (error) {
    next(error);
  }
};



// @desc This API is used to fetch single user
// endpoint GET /api/v1/users/:id
// access PRIVATE
export const getSingleUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)

        if (!user) {
            return next({ status: 404, message: "No user found" });
        }
        res.status(200).json({
            message: "User fetched successfully",
            data: user
        }); 
    } catch (error) {
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