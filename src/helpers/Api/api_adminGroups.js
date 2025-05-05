import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;



const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getAdminGroups = async () => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    const response = await axios.get(`${apiUrl}/admins_groups/admin_group`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const adminGroups = response?.data?.adminGroupsData || [];
    return adminGroups;
  } catch (error) {
    return [];
  }
};

export const addAdminGroupsApiCall = async (
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
      user_group:formData?.user_group,
      user_sub_group:formData?.user_sub_group,
      user_group_name:formData?.user_group_name,
      user_sub_group_name:formData?.user_sub_group_name,
      task_group:formData?.task_group,
      task_group_name:formData?.task_group_name,
      task_sub_group:formData?.task_sub_group,
      task_sub_group_name:formData?.task_sub_group_name,
      activity_type:formData?.activity_type,
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
      `${apiUrl}/admins_groups/admin_group/${Id}`,
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
