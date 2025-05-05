import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

// Get User Auth Data
const getUserData = () => {
    if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        return obj;
    }
};

//Get: Inquiry Item Categories
export const getInquiryItem = async () => {
    const userData = getUserData();
    const token = userData?.token
    try {
        const response = await axios.get(`${apiUrl}/inquiry_item_categories/inquiry_item_categories`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const inquiryItem = response?.data?.inquiryItemCategoriesData || [];
        return inquiryItem;
    }
    // Handle Errors and Exceptions
    catch (error) {
        return false;
    }
};

// POST : Create/Update/Delete InquiryItemCategory
export const createUpdateDeleteInquiryItemApiCall = async (Id, formData, isdeleted) => {
    const userData = getUserData();
    const token = userData?.token;
    const userId = userData?.user?.id;
    try {
        let requestBody = {
            item_category_code: formData?.item_category_code,
            item_category_description: formData?.item_category_description,
            isactive: formData?.isactive,
            id: Id,
        };

        if (Id === 0)
            requestBody = {
                ...requestBody,
                createdby: userId,
                isdeleted: isdeleted,
            };

        else
            requestBody = {
                ...requestBody,
                updatedby: userId,
                isdeleted: isdeleted,
            };

        const response = await axios.post(
            `${apiUrl}/inquiry_item_categories/inquiry_item_category/${Id}`, requestBody, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        );
        return response.data.success;
    }
    // Handle Errors and Exceptions
    catch (error) {
        return false;
    }
};
