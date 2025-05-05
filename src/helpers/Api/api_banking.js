import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
    if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        return obj;
    }
};

export const fetchBankData = async () => {
    const userData = getUserData();
    const token = userData?.token
    try {
        const response = await axios.get(`${apiUrl}/bank-data`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const bankData = response?.data?.BankData || [];
        return bankData;

    } catch (error) {
        return false;
    }
}

export const addBankData = async (data) => {
    try {
        const response = await axios(`${apiUrl}/bank-data`, {
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
        console.error("Error adding Bank:", error);
        throw error;
    }
};

export const updateBankData = async (id, data) => {
    try {
        const response = await axios(`${apiUrl}/bank-data/${id}`, {
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
        console.error("Error updating Bank:", error);
        throw error;
    }
};

export const deleteBankData = async (id) => {
    try {
        const response = await axios(`${apiUrl}/bank-data/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting Bank:", error);
        throw error;
    }
};