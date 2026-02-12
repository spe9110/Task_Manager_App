import Task from '../models/task.model.js'

// Challenge - create a pagination API with search, pagination, filter and sort functionality using express.js

export const searchTasks = async (req, res) => {
    try {
        // step 1 - Initialize the page first page to display - By defaut it's the first page
        const page = parseInt(req.query.page) || 1 
        // step 2 - Define the limit of items to display per page - like 8 for eg
        const limit = parseInt(req.query.limit) || 5;
        
        const query = { user: req.user.id }
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
                },
            });
        } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}

