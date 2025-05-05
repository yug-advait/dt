import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getDepartments = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/departments/department`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const departments = response?.data?.departmentsData || [];
    return departments;
  } catch (error) {
    return false;
  }
};

export const addDepartmentApiCall = async (
  departmentId,
  departmentDescription,
  isActive,
  Id,
  isdeleted
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      department_description: departmentDescription,
      department_id: departmentId,
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
      `${apiUrl}/departments/department/${Id}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.success;
  } catch (error) {
    console.error("Error adding department:", error);
    return false;
  }
};
