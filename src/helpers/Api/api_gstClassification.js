import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
    if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        return obj;
    }
};

export const fetchGstClassification = async (id) => {
    const userData = getUserData();
    const token = userData?.token
    try {
        const response = await axios.get(`${apiUrl}/gst_master/gst_classification/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const gstClassification = response?.data?.data || [];
        return gstClassification;
    } catch (error) {
        return [];
    }
};

export const addGstClassification = async (data) => {
    const userData = getUserData();
    const token = userData?.token
    try {
        const response = await axios.post(`${apiUrl}/gst_master/gst_classification`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error adding gst classification:", error);
        throw error;
    }
};

export const updateGstClassification = async (id, data) => {
    const userData = getUserData();
    const token = userData?.token
    try {
        const response = await axios.put(`${apiUrl}/gst_master/gst_classification/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response;
    } catch (error) {
        console.error("Error updating gst classification:", error);
        throw error;
    }
};

export const deleteGstClassification = async (data) => {
    const userData = getUserData();
    const token = userData?.token
    try {
        const response = await axios.put(`${apiUrl}/gst_master/gst_classification/delete/${data.id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response;
    } catch (error) {
        console.error("Error deleting gst classification:", error);
        throw error;
    }
};