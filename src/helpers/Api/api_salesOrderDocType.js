import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

// Get User Auth Data
const getUserData = () => {
    if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        return obj;
    }
};

//GET : List of all SalesOrder Doc Types
export const getSalesOrderDocType = async () => {
    const userData = getUserData();
    const token = userData?.token
    try {
        const response = await axios.get(`${apiUrl}/sales_orders/doc_types`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const salesOrderDocTypes = response?.data?.salesOrderDocTypesData || [];
        return salesOrderDocTypes;
    }
    // Handle Errors and Exceptions
    catch (error) {
        return [];
    }
};

// GET : Sales Order DocType By Id
export const getSalesOrderDocTypeById = async (id) => {
    const userData = getUserData();
    const token = userData?.token
    try {
        const response = await axios.get(`${apiUrl}/sales_orders/doc_type/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const salesOrderDocTypeById = response?.data?.salesOrderDocTypeByIdData || [];
        return salesOrderDocTypeById;
    }
    // Handle Errors and Exceptions
    catch (error) {
        return false;
    }
}

//POST : Create/Update/Delete SalesOrder Doc Types
export const createUpdateDeleteSalesOrderDocTypeApiCall = async (Id, formData, isdeleted) => {
    const userData = getUserData();
    const token = userData?.token;
    const userId = userData?.user?.id;
    try {
        let requestBody = {
            id: Id,
            sales_order_doc_type: formData?.sales_order_doc_type,
            sales_order_doc_type_description: formData?.sales_order_doc_type_description,
            item_category_id: formData?.item_category_id,
            isactive: formData?.isactive,
        };

        if (Id === 0) {
            requestBody = {
                ...requestBody,
                createdby: userId,
                isdeleted: isdeleted,
            };
        } else {
            requestBody = {
                ...requestBody,
                updatedby: userId,
                isdeleted: isdeleted,
            };
        }

        const response = await axios.post(
            `${apiUrl}/sales_orders/doc_type/${Id}`, requestBody, {
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
