import Task from '../models/task.model.js'

// Challenge - create a pagination API with search, pagination, filter and sort functionality using express.js

export const searchTasks = async (req, res) => {
    try {
        // step 1 - Initialize the page first page to display - By defaut it's the first page
        const page = parseInt(req.query.page) || 1 
        // step 2 - Define the limit of items to display per page - like 8 for eg
        const limit = parseInt(req.query.limit) || 10;
        
        const query = { user: req.user.id } // always filter by user
        // By default we sort by createdAt and display the newest first
        const {sort = "createdAt", order = "desc" } = req.query;
        // allowed items to sort
        const allowedFields = ["name", "priority", "status", "due", "createdAt"];

        const sortField = allowedFields.includes(sort) ? sort : "createdAt";

        const sortDirection = order === "asc" ? 1 : -1;

        const sortOptions = { [sortField]: sortDirection };

        // Filter logic
        const { priority, status, createdAt, createdFrom, createdTo } = req.query;

        if(priority && ["Urgent", "not urgent"].includes(priority)) query.priority = priority;
        if(status && ["Open", "Done"].includes(status)) query.status = status;
        // Filter by Specific creation date
        if (createdAt) {
            const date = new Date(createdAt);
            const start = new Date(date.setHours(0,0,0,0));
            const end = new Date(date.setHours(23,59,59,999)); 
            query.createdAt = {
                $gte: start,
                $lte: end
            };
        } else if (createdFrom || createdTo) {
            query.createdAt = {
                ...(createdFrom && { $gte: new Date(createdFrom) }),
                ...(createdTo && { $lte: new Date(createdTo) })
            };
        }

        
        // count total number of user's tasks
        const totalTasks = await Task.countDocuments(query);
        // This formula is used to calculate the number of page
        const totalPages = Math.ceil(totalTasks / limit);

        // current page
        const currentPage = Math.min(page, totalPages || 1);

        const skip = (currentPage - 1) * limit;

        // 9️⃣ Navigation helpers
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;

        const previousPage = currentPage > 1 ? currentPage - 1 : null;

        const userTasks = await Task.find(query)
            .sort(sortOptions)
            .limit(limit)
            .skip(skip)

        return res.status(200).json({
            success: true,
            message: "Tasks fetched successfully",
            data: userTasks,
            pagination: {
                totalTasks,
                totalPages,
                currentPage,
                nextPage,
                previousPage,
                limit
                }
            });
        } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}

