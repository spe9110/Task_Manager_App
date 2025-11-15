import express from 'express';
import { adminGetUserDashboard } from '../controllers/admin_controller.js';
import { userAuth } from '../middleware/authenticate.js';
import requireRole from '../middleware/authorize.js';

const router = express.Router();

// @desc This API is used to fetch user dashboard for admin
// endpoint GET /api/v1/admin/users/dashboard
// access PRIVATE (Admin only)
router.get('/dashboard', userAuth, requireRole('admin'), adminGetUserDashboard);

export default router;