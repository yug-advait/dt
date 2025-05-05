// Import necessary files and packages
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
    if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        return obj;
    }
};

// GET the list of Sales Order Headers and Line Items
export const getSalesOrderMaster = async () => {
    try {
        const userData = getUserData();
        const token = userData?.token
        const userID = userData?.user?.id
        const response = await axios.get(`${apiUrl}/sales_orders_master/sales_order/${userID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const salesOrders = response?.data.salesOrdersMasterByIdData || [];
        return salesOrders;
    }
    // Handle Errors and Exceptions.
    catch (error) {
        console.error('Error fetching quotation masters:', error.response ? error.response.data : error.message);
        return [];
    }
}
export const getCustomerSalesOrder = async () => {
    try {
        const userData = getUserData();
        const token = userData?.token;
        const userID = userData?.user?.id;
        const url = `${apiUrl}/customers/customer_sales_order/${userID}`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const salesorderMastersData = response?.data.salesOrderMastersData || {};
        return salesorderMastersData;
    } catch (error) {
        console.error('Error fetching sales order masters:', error.response ? error.response.data : error.message);
        return {};
    }
};

// POST : Create/Update/Delete Sales Order
export const createUpdateDeleteSalesOrder = async (id, formData, so_details, isdeleted) => {
    try {
        const userData = getUserData();
        const token = userData?.token
        const userID = userData?.user?.id
        let requestBody = {
            id: id,
            so_doc_type_id: formData?.so_doc_type_id,
            so_number: formData?.so_number,
            customer_sold_to_id: formData?.customer_sold_to_id,
            customer_ship_to_id: formData?.customer_ship_to_id,
            company_id: formData?.company_id,
            sales_employee_id: formData?.sales_employee_id,
            sales_group_id: formData?.sales_group_id,
            sales_district_id: formData?.sales_district_id,
            sales_office_id: formData?.sales_office_id,
            sales_organisation_id: formData?.sales_organisation_id,
            distribution_id: formData?.distribution_id,
            division_id: formData?.division_id,
            so_doc_date: formData?.so_doc_date,
            total_so_amount: formData?.total_so_amount,
            total_so_tax_amount: formData?.total_so_tax_amount,
            total_so_quantity: formData?.total_so_quantity,
            total_so_discount: formData?.total_so_discount,
            cust_quotation_id: formData?.cust_quotation_id,
            so_net_total: formData?.so_net_total,
            isactive: true,
            so_details: so_details
        };

        // Add New Sales Order
        if (id === 0)
            requestBody = {
                ...requestBody, createdby: userID, isdeleted: isdeleted
            }
        // Update Existing Sales Order
        else
            requestBody = {
                ...requestBody, updatedby: userID, isdeleted: isdeleted
            }
        // Get the response from API
        const response = await axios.post(
            `${apiUrl}/sales_orders_master/sales_order/${id}`,
            requestBody,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        return response.data;
    }
    // Handle Errors and Exceptions
    catch (error) {
        return false;
    }
}