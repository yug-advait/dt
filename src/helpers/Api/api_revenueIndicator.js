import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
    if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        return obj;
    }
};

export const getRevenueIndicators = async (revenue_indicator_type) => {
    try {
        const userData = getUserData();
        const token = userData?.token
        const response = await axios.get(`${apiUrl}/revenue_indicators/revenue_indicator/${revenue_indicator_type}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const revenueIndicators = response?.data?.revenueIndicatorsData || [];
        return revenueIndicators;
    } catch (error) {
        return false;
    }
};

//Add, Update, Delete Revenue Indicator
export const addUpdateDeleteRevenueIndicators = async (Id, formData, isDeleted, revenue_indicator_type) => {
    const userData = getUserData();
    const token = userData?.token
    const userID = userData?.user?.id
    try {

        let requestBody = {
            indicator_code: formData?.indicator_code,
            indicator_description: formData?.indicator_description,
            isactive: formData.isactive,
            id: Id,
        };

        if (Id === 0) {
            requestBody = {
                ...requestBody,
                createdby: userID,
                revenue_indicator_type: revenue_indicator_type,
                isdeleted: isDeleted,
            };
        }
        else {
            requestBody = {
                ...requestBody,
                updatedby: userID,
                revenue_indicator_type: revenue_indicator_type,
                isdeleted: isDeleted,
            };
        }
        const response = await axios.post(
            `${apiUrl}/revenue_indicators/revenue_indicator/${Id}`,
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.success;
    }
    catch (error) {
        console.error("Error in saving/editing data : ", error.message);
        return false;
    }
};
