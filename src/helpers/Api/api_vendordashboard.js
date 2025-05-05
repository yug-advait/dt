import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};
export const getVendorDashboard = async (type) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const userID = userData?.user?.id
    let requestBody = {
      type: type,
    };
      const response = await axios.post(`${apiUrl}/vendors/vendor_details/${userID}`,
        requestBody,
       {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const vendordashboard = response?.data?.rfqDasboardData || [];
      return vendordashboard;
  } catch (error) {
    return [];
  }
};

export const addVendorDashboardApiCall = async (
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
      emp_grp_code:formData?.emp_grp_code,
      emp_grp_desc:formData?.emp_grp_desc,
      emp_subgrp_code:formData?.emp_subgrp_code,
      emp_subgrp_desc:formData?.emp_subgrp_desc,
      department_id:formData?.department_id,
      identifier:formData?.identifier,
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
      `${apiUrl}/employee_groups/employee_group/${Id}`,
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
