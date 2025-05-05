import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
    if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        return obj;
    }
};

export const fetchGroupCreation = async () => {
    const userData = getUserData();
    const token = userData?.token
    try {
        const response = await axios.get(`${apiUrl}/employee-groups`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const creationGroup = response?.data?.creationGroupData || [];
        return creationGroup;
    } catch (error) {
        return [];
    }
};

export const addGroupCreation = async (data) => {
    try {
        const response = await axios(`${apiUrl}/employee-groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding employee group:", error);
        throw error;
    }
};

export const updateGroupCreation = async (id, data) => {
    try {
        const response = await axios(`${apiUrl}/employee-groups/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating employee group:", error);
        throw error;
    }
};

export const deleteGroupCreation = async (id) => {
    try {
        const response = await axios(`${apiUrl}/employee-groups/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting employee group:", error);
        throw error;
    }
};