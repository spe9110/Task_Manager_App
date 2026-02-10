import { API_BASE_URL } from "../../Util";


export const fetchUserTaskData = async ({ queryKey}) => {
    // If you expect queryFn to pass the whole context, you can accept ({queryKey}) instead
    const [, userId] = queryKey;
    if (!userId) return [];

    const token = JSON.parse(localStorage.getItem("userData"))?.AccessToken;
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


export const createUserTask = async (data) => {
    const token = JSON.parse(localStorage.getItem("userData"))?.AccessToken;
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

  const token = JSON.parse(localStorage.getItem("userData"))?.AccessToken;

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
    const token = JSON.parse(localStorage.getItem("userData"))?.AccessToken;
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

    const token = JSON.parse(localStorage.getItem("userData"))?.AccessToken;

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