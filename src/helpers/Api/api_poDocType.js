import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getPoDocType = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/po_doc_types/po_doc_type`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const PgetPrDocType = response?.data?.poDocTypesData || [];
    return PgetPrDocType;
  } catch (error) {
    return false;
  }
};

export const getPoDocTypeById = async (id) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/po_doc_types/po_doc_type/` + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const poDocTypesData = response?.data?.poDocTypesByIDData || [];
    return poDocTypesData;
  } catch (error) {
    return false;
  }
};


export const addPoDocTypeApiCall = async (
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
      po_doc_type:formData?.po_doc_type,
      po_doc_type_description:formData?.po_doc_type_description,
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
      `${apiUrl}/po_doc_types/po_doc_type/${Id}`,
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
