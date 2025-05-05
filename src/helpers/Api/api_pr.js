import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};
export const getPr = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const userID = userData?.user?.id
    // const response = await axios.get(`${apiUrl}/purchase_requests/purchase_request_user/${userID}`)
    const response = await axios.get(`${apiUrl}/purchase_requests/purchase_request_user/${userID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const pr = response?.data.prMastersData || [];
    return pr;
  } catch (error) {
    return [];
  }
};


export const addPrApiCall = async (
  formData,
  lineItems,
  Id,
  isdeleted
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      pr_doc_type_id: formData.pr_doc_type_id,
      pr_no: formData.pr_no,
      purchase_group_id: formData.purchase_group_id,
      purchase_organisation_id: formData.purchase_organisation_id,
      pr_date: formData.pr_date,
      po_process: false,
      rfq_process: false,
      approvedby: userID,
      lineItems:lineItems,
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
      `${apiUrl}/purchase_requests/purchase_request/${Id}`,
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
