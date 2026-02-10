import express from 'express';
import { createTask, getAllTasksByUser, getTaskById, updateTask, deleteTask } from '../controllers/task_controller.js';
import { userAuth } from '../middleware/authenticate.js';
import { authForRoles } from '../middleware/authorize.js';

const router = express.Router();

// @desc    Get all tasks with caching
// @route   GET /api/v1/tasks
// @access  PRIVATE
router.get('/:userId/tasks', userAuth, authForRoles(['user', 'admin']), getAllTasksByUser);

// @desc    Get a single task by ID
// @route   GET /api/v1/tasks/:id
// @access  PRIVATE
router.get('/:id', userAuth, authForRoles(['user', 'admin']), getTaskById);

// @desc    Create a new task
// @route   POST /api/v1/tasks
// @access  PRIVATE
router.post('/create', userAuth, authForRoles('user'), createTask);

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
// @access  PRIVATE
router.put('/update/:id', userAuth, authForRoles('user'), updateTask);

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
// @access  PRIVATE
router.delete('/delete/:id', userAuth, authForRoles(['user','admin']), deleteTask);

export default router;