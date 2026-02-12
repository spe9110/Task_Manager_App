import Task from "../models/task.model.js";

// Pagination + Search + Filter + Sort
export const searchTasks = async (req, res) => {
  try {
    // 1️⃣ Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 2️⃣ Extract optional query params
    const { search, status, sort = "createdAt", order = "desc" } = req.query;

    // 3️⃣ Base query (user-specific tasks)
    const query = { userId: req.user.id };

    // 4️⃣ Search functionality (by name)
    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive
    }

    // 5️⃣ Filter by status
    if (status) {
      query.status = status;
    }

    // 6️⃣ Sorting logic
    const sortOptions = {};
    sortOptions[sort] = order === "desc" ? -1 : 1;

    // 7️⃣ Count AFTER applying filters
    const totalTasks = await Task.countDocuments(query);

    const totalPages = Math.ceil(totalTasks / limit);

    // Ensure page does not exceed totalPages
    const currentPage = Math.min(page, totalPages || 1);

    const skip = (currentPage - 1) * limit;

    // 8️⃣ Fetch paginated tasks
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // 9️⃣ Navigation helpers
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const previousPage = currentPage > 1 ? currentPage - 1 : null;

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
      pagination: {
        totalTasks,
        totalPages,
        currentPage,
        nextPage,
        previousPage,
        limit,
      },
    });

  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
