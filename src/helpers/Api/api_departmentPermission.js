import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getDepartmentPermission = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/departments/department_permission`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const Permission = response?.data?.permissionListData || [];
    return Permission;
  } catch (error) {
    return [];
  }
};

export const addDepartmentPermissionApiCall = async ( 
  formData,
  menuList,
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  const Id = formData.department_id
  try {
    let requestBody = {
      menuList: menuList,
      updatedby: userID
    };
    const response = await axios.post(
      `${apiUrl}/departments/department_permission/${Id}`,
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
