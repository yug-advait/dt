import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};
export const getInvoice = async () => {
  try {
    const userData = getUserData();
    const userID = userData?.user?.id
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/invoices/invoice_list/${userID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response?.data|| [];
    return data;
  } catch (error) {
    return [];
  }
};

export const addInvoiceApiCall = async (
  formData,
  filteredItems,
  Id,
  isdeleted
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      invoice_date: formData.invoice_date,
      reference: formData.reference,
      supplier_invoice_no: formData.supplier_invoice_no,      
      total_amount: formData.total_amount,
      total_tax_amount: formData.total_tax_amount,
      remark: formData.remark,
      vendor_id: formData.vendor_id,
      lineItems:filteredItems,
      isactive: true,
      id: Id,
    };

    if (Id === 0) {
      requestBody = {
        ...requestBody,
        createdby: userID,
        isdeleted: isdeleted,
      };
    } else {
      requestBody = {
        ...requestBody,
        updatedby: userID,
        isdeleted: isdeleted,
      };
    }
    const response = await axios.post(
      `${apiUrl}/invoices/invoice/${Id}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: "server not working",
    };
  }
};
