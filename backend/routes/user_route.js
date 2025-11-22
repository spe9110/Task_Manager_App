import express from "express";
import { getAllUsers, getCurrentUser, getSingleUser, updateAccount, deleteAccount } from "../controllers/user_controller.js";
import { userAuth } from "../middleware/authenticate.js";
import requireRole from "../middleware/authorize.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// @desc This API is used to fetch list of users
// endpoint POST /api/v1/users/ 
// access PUBLIC
router.get('/', userAuth, requireRole('admin'), getAllUsers);

// @desc This API is used to fetch list of users
// endpoint POST /api/v1/users/current
// access PRIVATE
router.get('/current', userAuth, getCurrentUser);


// @desc This API is used to fetch list of users
// endpoint POST /api/v1/users/ 
// access PRIVATE
router.get('/:id', userAuth, requireRole(['user', 'admin']), getSingleUser);

// @desc This API is used to update user profile
// endpoint POST /api/v1/users/update/:id
// access PRIVATE
router.put('/update/:id', userAuth, requireRole('user'), upload.single('avatar'), updateAccount);

// @desc This API is used to fetch list of users
// endpoint POST /api/v1/users/ 
// access PRIVATE
router.delete('/delete/:id', userAuth, requireRole(['user', 'admin']), deleteAccount);

export default router