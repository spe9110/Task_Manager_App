import express from "express";
import { getAllUsers, getCurrentUser, getSingleUser, updateAccount, deleteAccount } from "../controllers/user_controller.js";
import { userAuth } from "../middleware/authenticate.js";
import { authForRoles } from "../middleware/authorize.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// @desc This API is used to fetch list of users
// endpoint POST /api/v1/users/ 
// access PUBLIC
router.get('/', userAuth, authForRoles('admin'), getAllUsers);

// @desc This API is used to fetch list of users
// endpoint POST /api/v1/users/current
// access PRIVATE
router.get('/current', userAuth, getCurrentUser);


// @desc This API is used to fetch list of users
// endpoint POST /api/v1/users/ 
// access PRIVATE
router.get('/:id', userAuth, authForRoles(['user', 'admin']), getSingleUser);

// @desc This API is used to update user profile
// endpoint POST /api/v1/users/update/:id
// access PRIVATE
router.put('/update/:id', userAuth, authForRoles('user'), upload.single('avatar'), updateAccount);

// @desc This API is used to fetch list of users
// endpoint POST /api/v1/users/ 
// access PRIVATE
router.delete('/delete/:id', userAuth, authForRoles(['user', 'admin']), deleteAccount);

export default router