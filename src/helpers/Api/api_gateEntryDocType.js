import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getGateEntryDocType = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/gate_entry_doc_types/gate_entry_doc_type`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const grnDocType = response?.data?.gateEntryDocTypesData || [];
    return grnDocType;
  } catch (error) {
    return false;
  }
};

export const getGateEntryDocTypeById = async (id) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/gate_entry_doc_types/gate_entry_doc_type/`+id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const grnDocType = response?.data?.gateEntryDocTypesByIDData || [];
    return grnDocType;
  } catch (error) {   
    return false;
  }
};

export const addGateEntryDocTypeApiCall = async (
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
      gate_entry_doc_type: formData?.gate_entry_doc_type,
      link_grn_type_id:formData?.link_grn_type_id,
      gate_entry_doctype_description:formData?.gate_entry_doctype_description,
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
      `${apiUrl}/gate_entry_doc_types/gate_entry_doc_type/${Id}`,
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
