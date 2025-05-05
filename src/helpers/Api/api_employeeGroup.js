import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getEmployeeGroup = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/employee_groups/employee_group`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const employeeGroup = response?.data?.employeeGroupsData || [];
    return employeeGroup;
  } catch (error) {
    return [];
  }
};

export const addEmployeeGroupApiCall = async (
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
