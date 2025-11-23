import Task from "../models/task.model.js";
import logger from "../config/logging.js";
import cache from "../Utils/cache.js";
import { createTaskSchema, updateTaskSchema } from "../validation/validateTask.js";

/*
    Task controllers with step-by-step documentation.
    Each controller contains numbered steps (1, 2, 3, ...) that explain the logic.
*/

/*
    @desc    Get all tasks for the authenticated user (with caching)
    @route   GET /api/v1/tasks
    @access  PRIVATE
 */
export const getAllTasksByUser = async (req, res, next) => {
  try {
    // 1. Verify authentication: ensure req.user exists and has an id
    if (!req.user || !req.user.id) {
      logger.warn("1 - Unauthorized task fetch attempt", { requestedBy: "anonymous" });
      return next({ status: 401, message: "Unauthorized" });
    }

    // 2. Build a cache key scoped to the user
    const cacheKey = `all_tasks_user_${req.user.id}`;

    // 3. If cached result exists, return it (fast path)
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      logger.info("3 - All tasks for user retrieved from cache", { requestedBy: req.user.id });

      return res.status(200).json({
        message: "Tasks fetched successfully (from cache)",
        total: cached.total,
        data: cached.data,
      });
    }

    // 4. If not cached, query the DB for tasks belonging to the user
    const userTasks = await Task.find({ user: req.user.id });

    // 5. Handle empty result (no tasks)
    if (!userTasks || userTasks.length === 0) {
      logger.warn("5 - No tasks found for this user", { requestedBy: req.user.id });
      return next({ status: 404, message: "No tasks found for this user" });
    }

    // 6. Prepare the result object and count
    const result = {
      total: userTasks.length,
      data: userTasks,
    };

    // 7. Cache the result for 5 minutes (300 seconds)
    cache.set(cacheKey, result, 300);

    // 8. Log the successful DB fetch & return the response
    logger.info("8 - Tasks fetched from DB and cached successfully", {
      count: userTasks.length,
      requestedBy: req.user.id,
    });

    return res.status(200).json({
      message: "User tasks fetched successfully (from DB)",
      ...result,
    });
  } catch (error) {
    // 9. Catch unexpected errors and forward to error middleware
    logger.error("9 - Error fetching all tasks by user", {
      error,
      requestedBy: req.user?.id || "anonymous",
    });
    return next({ status: 500, message: "Internal Server Error" });
  }
};

/*
    @desc    Get a single task by ID for the authenticated user (with caching)
    @route   GET /api/v1/tasks/:id
    @access  PRIVATE
 */
export const getTaskById = async (req, res, next) => {
  try {
    // 1. Verify authentication
    if (!req.user || !req.user.id) {
      logger.warn("1 - Unauthorized task fetch attempt", { requestedBy: "anonymous" });
      return next({ status: 401, message: "Unauthorized" });
    }

    // 2. Extract task id from params
    const { id } = req.params;
    logger.info("2 - Fetching task by ID", { taskId: id, requestedBy: req.user.id });

    // 3. Build cache key for this specific task and user
    const cacheKey = `task_${id}_user_${req.user.id}`;

    // 4. Return cached task if present
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      logger.info("4 - Task retrieved from cache", { taskId: id, requestedBy: req.user.id });

      return res.status(200).json({
        message: "Task fetched successfully (from cache)",
        task: cached,
      });
    }

    // 5. Fetch task from DB ensuring ownership by user
    const task = await Task.findOne({ _id: id, user: req.user.id });

    // 6. Handle not found
    if (!task) {
      logger.warn("6 - Task fetch failed - not found", { taskId: id, requestedBy: req.user.id });
      return next({ status: 404, message: "Task not found" });
    }

    // 7. Cache the found task for 5 minutes
    cache.set(cacheKey, task, 300);
    logger.info("7 - Task fetched from DB and cached successfully", { taskId: id, requestedBy: req.user.id });

    // 8. Return the task
    return res.status(200).json({
      message: "Task fetched successfully (from DB)",
      task,
    });
  } catch (error) {
    // 9. Error handling
    logger.error("9 - Error fetching task by id", { error, requestedBy: req.user?.id || "anonymous" });
    return next({ status: 500, message: "Internal Server Error" });
  }
};

/*
    @desc    Create a new task for authenticated user
    @route   POST /api/v1/tasks
    @access  PRIVATE
 */
export const createTask = async (req, res, next) => {
  try {
    // 1. Verify authentication
    if (!req.user || !req.user.id) {
      logger.warn("1 - Unauthorized task creation attempt", { requestedBy: "anonymous" });
      return next({ status: 401, message: "Unauthorized" });
    }

    // 2. Validate request body using Joi schema
    const { error } = createTaskSchema.validate(req.body, { abortEarly: false });
    if (error) {
      logger.warn("2 - Task creation validation failed", {
        errors: error.details,
        requestedBy: req.user.id,
      });
      return next({ status: 400, message: "Validation Error", errors: error.details });
    }

    // 3. Extract fields from body
    const { name, description, priority, due, status } = req.body;

    // 4. Check for duplicate task name for the user (prevent duplicates)
    const existingTask = await Task.findOne({ name, user: req.user.id });
    if (existingTask) {
      logger.warn("4 - Task creation failed - duplicate name", { name, requestedBy: req.user.id });
      return next({ status: 409, message: "Task with this name already exists" });
    }

    // 5. Create the task document
    const newTask = await Task.create({
      name,
      description,
      priority,
      due,
      status,
      user: req.user.id,
    });
    
    // 5.1 Delete cache for this user (so GET /tasks sees new task immediately)
    cache.del(`all_tasks_user_${req.user.id}`);

    // 6. Log success and return response
    logger.info("6 - Task created successfully", { taskId: newTask._id, createdBy: req.user.id });
    return res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    // 7. Error handling
    logger.error("7 - Error creating task", { error, requestedBy: req.user?.id || "anonymous" });
    return next({ status: 500, message: "Internal Server Error" });
  }
};

/*
    @desc    Update an existing task (only fields provided) for the authenticated user
    @route   PUT /api/v1/tasks/:id
    @access  PRIVATE
 */
export const updateTask = async (req, res, next) => {
  try {
    // 1. Verify authentication
    if (!req.user || !req.user.id) {
      logger.warn("1 - Unauthorized task update attempt", { requestedBy: "anonymous" });
      return next({ status: 401, message: "Unauthorized" });
    }

    // 2. Validate request body using Joi schema (all fields optional in update schema)
    const { error } = updateTaskSchema.validate(req.body, { abortEarly: false });
    if (error) {
      logger.warn("2 - Task update validation failed", { errors: error.details, requestedBy: req.user.id });
      return next({ status: 400, message: "Validation Error", errors: error.details });
    }

    // 3. Extract task id and data
    const { id } = req.params;
    const fields = req.body;

    // 4. Build update object only with provided fields (allow empty string or falsy values intentionally)
    const updateFields = {};
    for (const key in fields) {
        // Only include keys that are explicitly provided (not undefined)
        if (fields[key] !== undefined) {
            updateFields[key] = fields[key];
        }
    }

    // 5. Find the user's task and apply updates (ensures ownership)
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: updateFields },
      { new: true }
    );
    // 7.1 Delete cache for this user and for this specific task
    cache.del(`all_tasks_user_${req.user.id}`);
    cache.del(`task_${id}_user_${req.user.id}`);

    // 6. If task not found (either doesn't exist or not owned by user), return 404
    if (!updatedTask) {
      logger.warn("6 - Task update failed - not found", { taskId: id, requestedBy: req.user.id });
      return next({ status: 404, message: "Task not found" });
    }

    // 7. Log success and return updated task
    logger.info("7 - Task updated successfully", { taskId: id, updatedBy: req.user.id });

    // 8 Delete old cache

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    // 8. Error handling
    logger.error("8 - Error updating task by id", { error, requestedBy: req.user?.id || "anonymous" });
    return next({ status: 500, message: "Internal Server Error" });
  }
};

/*
    @desc    Delete a task owned by the authenticated user
    @route   DELETE /api/v1/tasks/:id
    @access  PRIVATE
 */
export const deleteTask = async (req, res, next) => {
  try {
    // 1. Verify authentication
    if (!req.user || !req.user.id) {
      logger.warn("1 - Unauthorized task delete attempt", { requestedBy: "anonymous" });
      return next({ status: 401, message: "Unauthorized" });
    }

    // 2. Extract task id
    const { id } = req.params;

    // 3. Delete only if the task belongs to the requesting user
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
    // 5.1 Delete cache for this user and for this specific task
    cache.del(`all_tasks_user_${req.user.id}`);
    cache.del(`task_${id}_user_${req.params.id}`);

    // 4. If no task deleted (not found or not owned), return 404
    if (!task) {
      logger.warn("4 - Task deletion failed - not found or not owned", { taskId: id, requestedBy: req.user.id });
      return next({ status: 404, message: "Task not found" });
    }

    // 5. Log success and send response
    logger.info("5 - Task deleted successfully", { taskId: id, deletedBy: req.user.id });
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    // 6. Error handling
    logger.error("6 - Error deleting task by ID", { error, requestedBy: req.user?.id || "anonymous" });
    return next({ status: 500, message: "Internal Server Error" });
  }
};
