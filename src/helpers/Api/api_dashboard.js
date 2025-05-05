import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
    if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        return obj;       
    }
};

export const getCounts = async () => {
    try {
        const userData = getUserData();
        const token = userData?.token
        const userID = userData?.user?.id
        const response = await axios.get(`${apiUrl}/dashboard_master/user_dashboard/${userID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    
        const totalCount = response?.data || [];
        
        return totalCount;
    } catch (error) {
        console.log('Error fetching total count:', 
            error.response ? error.response.data : error.message);
            return [];
    }
}

export const getVendorCounts = async () => {
    try {
        const userData = getUserData();       
        const token = userData?.token    
        const userID = userData?.user?.id
        const response = await axios.get(`${apiUrl}/dashboard_master/vendor_dashboard/${userID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
            
        const totalCustomerCount = response?.data || [];
        
        return totalCustomerCount;
    } catch (error) {
        console.log('Error fetching total customer count:', 
            error.response ? error.response.data : error.message);
            return [];
    }
}