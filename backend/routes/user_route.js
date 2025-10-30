import express from "express";
import { getAllUsers, getCurrentUser, getSingleUser, updateAccount, deleteAccount } from "../controllers/user_controller.js";
import { userAuth } from "../middleware/authenticate.js";

const router = express.Router();

// @desc This API is used to fetch list of users
// endpoint POST /api/v1/users/ 
// access PUBLIC
router.get('/', userAuth, getAllUsers);

// @desc This API is used to fetch list of users
// endpoint POST /api/v1/users/current
// access PRIVATE
router.get('/current', userAuth, getCurrentUser);


// @desc This API is used to fetch list of users
// endpoint POST /api/v1/users/ 
// access PRIVATE
router.get('/:id', userAuth, getSingleUser);

// @desc This API is used to update user profile
// endpoint POST /api/v1/users/update/:id
// access PRIVATE
router.put('/update/:id', updateAccount);

// @desc This API is used to fetch list of users
// endpoint POST /api/v1/users/ 
// access PRIVATE
router.delete('/delete/:id', deleteAccount);

export default router