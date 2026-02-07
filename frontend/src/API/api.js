import { API_BASE_URL } from "../../Util";

export const fetchUserTaskData = async ({ queryKey}) => {
    // If you expect queryFn to pass the whole context, you can accept ({queryKey}) instead
    const [, userId] = queryKey;
    if (!userId) return [];

    const token = JSON.parse(localStorage.getItem("userData"))?.AccessToken;
    const res = await fetch(`${API_BASE_URL}/api/v1/tasks/user/${userId}`, {
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