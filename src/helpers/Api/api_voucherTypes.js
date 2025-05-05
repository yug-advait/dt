import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
    if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        return obj;
    }
};

export const fetchVoucherType = async () => {
    const userData = getUserData();
    const token = userData?.token
    try {
        const response = await axios.get(`${apiUrl}/voucher-type`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const voucherType = response?.data?.voucherTypeData || [];
        return voucherType;
    } catch (error) {
        return [];
    }
};

export const addVoucherType = async (data) => {
    try {
        const response = await axios(`${apiUrl}/voucher-type`, {
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

export const updateVoucherType = async (id, data) => {
    try {
        const response = await axios(`${apiUrl}/voucher-type/${id}`, {
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

export const deleteVoucherType = async (id) => {
    try {
        const response = await axios(`${apiUrl}/voucher-type/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting Voucher Type:", error);
        throw error;
    }
};