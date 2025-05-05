import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getCustomerGroups = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/customer_groups/customer_group`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const customerGroup = response?.data?.customerGroupsData || [];
    return customerGroup;
  } catch (error) {
    return [];
  }
};

export const addCustomerGroupsApiCall = async (
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
      cust_grp_code:formData?.cust_grp_code,
      cust_grp_description:formData?.cust_grp_description,
      cust_grp_type_id:formData?.cust_grp_type_id,
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
      `${apiUrl}/customer_groups/customer_group/${Id}`,
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
