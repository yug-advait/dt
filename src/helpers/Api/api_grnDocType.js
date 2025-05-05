import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getGrnDocType = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/grn_doc_types/grn_doc_type`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const grnDocType = response?.data?.grnDocTypesData || [];
    return grnDocType;
  } catch (error) {
    return false;
  }
};

export const getGrnDocTypeById = async (id) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/grn_doc_types/grn_doc_type/` + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const grnDocType = response?.data?.grnDocTypesByIDData || [];
    return grnDocType;
  } catch (error) {
    return false;
  }
};

export const addGrnDocTypeApiCall = async (
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
      grn_doc_type: formData?.grn_doc_type,
      link_asn_type_id:formData?.link_asn_type_id,
      grn_doctype_description:formData?.grn_doctype_description,
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
      `${apiUrl}/grn_doc_types/grn_doc_type/${Id}`,
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
