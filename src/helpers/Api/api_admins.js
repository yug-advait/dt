import axios from "axios";
import login from "store/auth/login/reducer";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getAdmins = async () => {
  const userData = getUserData();
  const token = userData?.token
  try {
    const response = await axios.get(`${apiUrl}/admins/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const admins = response?.data?.adminMastersData || [];
    return admins;
  } catch (error) {
    return [];
  }
};

export const getDepartmentPermission = async (id) => {
  const userData = getUserData();
  const token = userData?.token
  try {
    const response = await axios.get(`${apiUrl}/departments/department_permission/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const admins = response?.data?.permissionList || [];
    return admins;
  } catch (error) {
    return [];
  }
};
export const getDepartmentApprovals = async (id) => {
  const userData = getUserData();
  const token = userData?.token
  try {
    const response = await axios.get(`${apiUrl}/admins/department_users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const admins = response?.data?.userList || [];
    return admins;
  } catch (error) {
    return [];
  }
};

export const getAdminPermission = async (department_id,admin_id) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      createdby: userID,
      admin_id: admin_id,
    };
    const response = await axios.post(
      `${apiUrl}/admins/admin_permission/${department_id}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const admins = response?.data?.permissionList || [];
    return admins;
  } catch (error) {
    return [];
  }
};

export const addAdminsApiCall = async (
  formData,
  canApprove,
  approvalManager,
  maxPriceBand,
  menuList,
  isActive,
  Id,
  isdeleted
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      title: formData.title || "",
      first_name: formData.first_name || "",
      last_name: formData.last_name || "",
      password: formData.password || "",
      telephone: formData.telephone || "",
      mobile: formData.mobile || "",
      email_id: formData.email_id || "",
      employee_id: formData.employee_id || "",
      address_data_1: formData.address_data_1 || "",
      address_data_2: formData.address_data_2 || "",
      address_data_3: formData.address_data_3 || "",
      country_id: formData.country_id || "",
      state_id: formData.state_id || "",
      city: formData.city || "",
      pincode: formData.pincode || "",
      function_name: formData.function_name || "",
      department_id: formData.department_id || "",
      language_id: formData.language_id || "",
      valid_from: formData.valid_from || "",
      valid_to: formData.valid_to || "",
      company_id: formData.company_id || "",
      sales_organisation_id: formData.sales_organisation_id || "",
      distribution_id: formData.distribution_id || "",
      division_id: formData.division_id || "",
      sales_office_id: formData.sales_office_id || "",
      time_zone: formData.time_zone || "",
      sales_group_id: formData.sales_group_id || "",
      user_group: formData.user_group || "",
      can_approved: canApprove,
      approval_ids: JSON.stringify(approvalManager),
      max_price_band: maxPriceBand,
      isactive: isActive,
      menuList:menuList,
      login_as:userData?.login_as,
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
      `${apiUrl}/admins/admin/${Id}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return false;
  }
};
