import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;


const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};
export const getPo = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const userID = userData?.user?.id
    const response = await axios.get(`${apiUrl}/purchase_orders/purchase_order_user/${userID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const pr = response?.data.poMastersData || [];
    return pr;
  } catch (error) {
    return [];
  }
};

export const addPoApiCall = async (
  formData,
  prFilteredItems,
  Id,
  isdeleted
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      company_code: formData.company_code,
      company_name: formData.company_name,
      po_date: formData.po_date,
      po_doc_type_id: formData.po_doc_type_id,
      po_no: formData.po_no,
      purchase_group_id: formData.purchase_group_id,
      purchase_organisation_id: formData.purchase_organisation_id,
      total_amount: formData.total_amount,
      total_tax_amount: formData.total_tax_amount,
      vendor_code: formData.vendor_code,
      vendor_name: formData.vendor_name,
      approvedby: userID,
      lineItems: prFilteredItems,
      isactive: true,
      id: Id,
      createdby: userID,
      isdeleted: isdeleted,
    };

    const response = await axios.post(
      `${apiUrl}/po_direct/purchase_order`,
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

export const updatePoApiCall = async (
  formData
) => {
  const userData = getUserData();
  const token = userData?.token;
  try {
    let requestBody = {
      formData: formData,
    };

    const response = await axios.put(
      `${apiUrl}/po_direct/purchase_order/${formData?.id}`,
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