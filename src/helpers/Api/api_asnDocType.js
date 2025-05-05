import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getAsnDocType = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/asn_doc_types/asn_doc_type`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const PgetPrDocType = response?.data?.asnDocTypesData || [];
    return PgetPrDocType;
  } catch (error) {
    return false;
  }
};

export const getAsnDocTypeById = async (id) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/asn_doc_types/asn_doc_type/` + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const PgetPrDocType = response?.data?.asnDocTypesByIDData || [];
    return PgetPrDocType;
  } catch (error) {
    return false;
  }
};

export const addAsnDocTypeApiCall = async (
  formData,
  isActive,
  Id,
  isdeleted
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      asn_doc_type: formData?.asn_doc_type,
      po_doc_type_id:formData?.po_doc_type_id,
      link_po_type_id:formData?.po_doc_type_description,
      isactive: isActive,
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
      `${apiUrl}/asn_doc_types/asn_doc_type/${Id}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.success;
  } catch (error) {
    return false;
  }
};
