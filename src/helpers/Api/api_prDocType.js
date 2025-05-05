import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getPrDocType = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/pr_doc_types/pr_doc_type`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const PgetPrDocType = response?.data?.prDocTypesData || [];
    return PgetPrDocType;
  } catch (error) {
    return false;
  }
};

export const getPrDocTypeById = async (id) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/pr_doc_types/pr_doc_type/` + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const prDocTypesByIDData = response?.data?.prDocTypesByIDData || [];
    return prDocTypesByIDData;
  } catch (error) {
    return false;
  }
};


export const addPrDocTypeApiCall = async (
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
      pr_doc_type:formData?.pr_doc_type,
      pr_doc_type_description:formData?.pr_doc_type_description,
      item_category_id:formData?.item_category_id,
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
      `${apiUrl}/pr_doc_types/pr_doc_type/${Id}`,
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
