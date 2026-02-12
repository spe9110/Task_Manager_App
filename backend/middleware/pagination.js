// import Task from "../models/task.model.js"

// We implement pagination, filter and sort
// Pagination is simply dividing the data shown to the users into a set number of data at a time 
const pagination = (model) => {
    return async (req, res, next) => {
        try {
            // page = current page
            const page = parseInt(req.query.page) || 1;
            // pageSize = items per page
            const pageSize = parseInt(req.query.limit) || 4;
            // Build filter query - let query = { userId: req.user.id }; - and Now add optional filters:
            const { status, orderBy } = req.query;
            
            let query = {userId: req.user.id}


            // Optional filter
            if (status) {
                query.status = status;
            }

            // Sorting
            let sort = {};
            if (orderBy) {
                sort[orderBy] = 1; // ascending
            }

            // Total count
            const totalItems = await model.countDocuments(query);

            // Paginated data
            const results = await model
                .find(query)
                .sort(sort)
                .skip((page - 1) * pageSize)
                .limit(pageSize);

            res.status(200).json({
                page,
                totalPages: Math.ceil(totalItems / pageSize),
                totalItems,
                data: results,
            });
        } catch (error) {
            next(error);
        }
    } 
}