import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getTaxIndicator = async (tax_indicator_type) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/tax_indicators/tax_indicator/${tax_indicator_type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const taxIndicators = response?.data?.taxIndicatorsData || [];
    return taxIndicators;
  } catch (error) {
    return [];
  }
};

export const addTaxIndicatorApiCall = async (
  formData,
  isActive,
  Id,
  isdeleted,
  tax_indicator_type
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      country_id: formData?.country_id,
      tax_code: formData?.tax_code,
      tax_description: formData?.tax_description,
      isactive: isActive,
      id: Id,
    };

    if (Id === 0) {
      requestBody = {
        ...requestBody,
        createdby: userID,
        tax_indicator_type : tax_indicator_type,
        isdeleted: isdeleted,
      };
    } else {
      requestBody = {
        ...requestBody,
        updatedby: userID,
        tax_indicator_type : tax_indicator_type,
        isdeleted: isdeleted,
      };
    }
    const response = await axios.post(
      `${apiUrl}/tax_indicators/tax_indicator/${Id}`,
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
