import { API_BASE_URL } from "../../Util";

export const fetchUserTaskData = async ({ queryKey}) => {
    // If you expect queryFn to pass the whole context, you can accept ({queryKey}) instead
    const [, userId] = queryKey;
    if (!userId) return [];
    // accessToken come from the backend response object
    const token = JSON.parse(localStorage.getItem("userData"))?.accessToken;
    console.log("Token being sent:", token);

    const res = await fetch(`${API_BASE_URL}/api/v1/tasks/${userId}/tasks`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
    const result = await res.json();
    return result;
};

// export const getToken = () => {
//   const data = JSON.parse(localStorage.getItem("userData"));
//   return data?.accessToken || null;
// };

export const fetchPaginatedTasks = async ({ queryKey }) => {
    try {
        // If you expect queryFn to pass the whole context, you can accept ({queryKey}) instead
        const [, userId, page = 1, limit = 10, status, sort = "createdAt", order = "desc"] = queryKey; // page comes from queryKey
        if (!userId) return [];

        // accessToken come from the backend response object
        const token = JSON.parse(localStorage.getItem("userData"))?.accessToken;
        if (!token) {
            throw new Error("Token expired or missing");
        }
        console.log("Token being sent:", token);
        // Build query params dynamically
        const params = new URLSearchParams({
            page,
            limit,
            sort,
            order
        });

        // Only add status if it's not "All"
        if (status && status !== "All") {
            params.append("status", status);
        }


        const res = await fetch(
            `${API_BASE_URL}/api/v1/tasks/${userId}/paginate?${params.toString()}`,
            {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.status === 401 || res.status === 403) {
            // Auto logout
            localStorage.removeItem("userData");
            window.location.href = "/login";
            return;
        }
        // if (res.status === 401 || res.status === 403) {
        //     // Instead of returning undefined, return null so React Query can keep old data
        //     return null;
        // }

        if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
        const result = await res.json();
        return result;

    } catch (error) {
        console.error(error.message)
        throw error; // IMPORTANT
    }
}


export const createUserTask = async (data) => {
    // accessToken come from the backend response object
    const token = JSON.parse(localStorage.getItem("userData"))?.accessToken;
    const res = await fetch(`${API_BASE_URL}/api/v1/tasks/create`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Failed to create todo: ${res.status}`);

    const result = await res.json();
    return result;
};

export const fetchSingleUserTask = async ({ queryKey }) => {
  const [, taskId] = queryKey;

  // accessToken come from the backend response object
  const token = JSON.parse(localStorage.getItem("userData"))?.accessToken;

  const res = await fetch(`${API_BASE_URL}/api/v1/tasks/${taskId}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);

  const result = await res.json();

  // 🔥 unwrap backend response
  return result.task;
};

export const updateUserTask = async ({ id, data }) => {
    // accessToken come from the backend response object
    const token = JSON.parse(localStorage.getItem("userData"))?.accessToken;
    const res = await fetch(`${API_BASE_URL}/api/v1/tasks/update/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Failed to update task: ${res.status}`);

    const result = await res.json();
    return result.task;
}

export const deleteUserTask = async (id) => {
    // accessToken come from the backend response object
    const token = JSON.parse(localStorage.getItem("userData"))?.accessToken;

    const res = await fetch(`${API_BASE_URL}/api/v1/tasks/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    console.log("The task Id is: ", id)

    if (!res.ok) throw new Error(`Failed to delete task: ${res.status}`);

    const result = await res.json();
    return result;
}