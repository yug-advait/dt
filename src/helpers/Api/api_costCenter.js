import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getCostCenter = async (cost_profit_type) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/cost_center/costcenter/` + cost_profit_type, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const costcenter = response?.data?.costCenterData || [];
    return costcenter;
  } catch (error) {
    return false;
  }
};

export const addCostCenterApiCall = async (
  formData,
  isActive,
  Id,
  isdeleted,
  cost_profit_type
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      cost_center_code: formData?.cost_center_code,
      cost_center_description: formData?.cost_center_description,
      isactive: isActive,
      id: Id,
    };

    if (Id === 0) {
      requestBody = {
        ...requestBody,
        createdby: userID,
        cost_profit_type:cost_profit_type,
        isdeleted: isdeleted,
      };
    } else {
      requestBody = {
        ...requestBody,
        updatedby: userID,
        cost_profit_type:cost_profit_type,
        isdeleted: isdeleted,
      };
    }
    const response = await axios.post(
      `${apiUrl}/cost_center/costcenter/${Id}`,
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
