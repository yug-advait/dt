import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};
const userData = getUserData();
const UserID = userData?.user?.id

export const getQualityCheck = async () => {
  try {
    const response = await axios.get(`${apiUrl}/asns/asn`)
    const pr = response?.data.asnMastersData || [];
    return pr;
  } catch (error) {
    return [];
  }
};


export const addQualityCheckApiCall = async (
  formData,
  poFilteredItems,
  Id,
  isdeleted
) => {
  try {
    let requestBody = {
      asn_date: formData.asn_date,
      asn_doc_type_desc: formData.asn_doc_type_desc,
      asn_no: formData.asn_no,      
      delivery_no: formData.delivery_no,
      asn_doc_type_id: formData.asn_doc_type_id,
      po_no: formData.po_no,
      vendor_code: formData.vendor_code,
      vendor_prod_description: formData.vendor_prod_description,
      approvedby: 1,
      lineItems:poFilteredItems,
      isactive: true,
      id: Id,
    };

    if (Id === 0) {
      requestBody = {
        ...requestBody,
        createdby: UserID,
        isdeleted: isdeleted,
      };
    } else {
      requestBody = {
        ...requestBody,
        updatedby: UserID,
        isdeleted: isdeleted,
      };
    }

    const response = await axios.post(
      `${apiUrl}/asns/asn/` + Id,
      requestBody
    );
    return response.data;
  } catch (error) {
    return false;
  }
};
