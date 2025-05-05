import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;


const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};


export const getAccountGroups = async (
  account_group_type
) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/account_groups/account_group/`+ account_group_type, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const responseData = response?.data?.accountGroupsData || [];
    return responseData;
  } catch (error) {
    return [];
  }
};

export const addAccountGroupsApiCall = async (
  formData,
  isActive,
  Id,
  isdeleted,
  account_group_type,
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      account_group_code:formData?.account_group_code,
      account_group_desc:formData?.account_group_desc,
      suffix_code:formData?.suffix_code,
      from_number:formData?.from_number,
      to_number:formData?.to_number,
      current_number_status:formData?.current_number_status,
      isactive: isActive,
      id: Id,
    };

    if (Id === 0) {
      requestBody = {
        ...requestBody,
        createdby: userID,
        account_group_type:account_group_type,
        isdeleted: isdeleted,
      };
    } else {
      requestBody = {
        ...requestBody,
        updatedby: userID,
        account_group_type:account_group_type,
        isdeleted: isdeleted,
      };
    }
    const response = await axios.post(
      `${apiUrl}/account_groups/account_group/${Id}`,
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
