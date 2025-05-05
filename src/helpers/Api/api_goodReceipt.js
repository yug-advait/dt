import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};
export const getGoodReceipt = async () => {
  try {
    const userData = getUserData();
    const userID = userData?.user?.id
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/grns/grn_user/${userID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const pr = response?.data.grnMastersData || [];
    return pr;
  } catch (error) {
    return [];
  }
};


export const addGoodReceiptApiCall = async (
  formData,
  asnFilteredItems,
  Id,
  isdeleted
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      grn_date: formData.grn_date,
      grn_doc_type_desc: formData.grn_doc_type_desc,
      grn_no: formData.grn_no,      
      delivery_no: formData.delivery_no,
      grn_doc_type_id: formData.grn_doc_type_id,
      asn_no: formData.asn_no,
      vendor_code: formData.vendor_code,
      vendor_prod_description: formData.vendor_prod_description,
      approvedby: userID,
      lineItems:asnFilteredItems,
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
      `${apiUrl}/grns/grn/${Id}`,
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
