import express from 'express';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from '../controllers/task_controller.js';
import { userAuth } from '../middleware/authenticate.js';
import requireRole from '../middleware/authorize.js';

const router = express.Router();

// @desc    Get all tasks with caching
// @route   GET /api/v1/tasks
// @access  PRIVATE
router.get('/', userAuth, requireRole(['user', 'admin']), getAllTasks);

// @desc    Get a single task by ID
// @route   GET /api/v1/tasks/:id
// @access  PRIVATE
router.get('/:id', userAuth, requireRole(['user', 'admin']), getTaskById);
// @desc    Create a new task
// @route   POST /api/v1/tasks
// @access  PRIVATE
router.post('/', userAuth, requireRole(['user', 'admin']), createTask);

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
// @access  PRIVATE
router.put('/update/:id', userAuth, requireRole('user'), updateTask);

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
// @access  PRIVATE
router.delete('/delete/:id', userAuth, requireRole(['user','admin']), deleteTask);

export default router;