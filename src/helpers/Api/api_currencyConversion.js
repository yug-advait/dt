import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getCurrencyConversions = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/currency_conversion/conversion`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const currenciesConversion = response?.data?.currencyConversionsData || [];
    return currenciesConversion;
  } catch (error) {
    return [];
  }
};

export const addCurrencyConversionsApiCall = async (
  formData,
  isActive,
  Id,
  isdeleted,
  CValue
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      currency_from_id:formData?.currency_code_from,
      currency_to_id:formData?.currency_code_to,
      base_value:formData?.base_value,
      conversion_value:CValue,
      currency_description_from:formData?.currency_description_from,
      currency_description_to:formData?.currency_description_to,
      valid_from:formData?.valid_from,
      valid_to:formData?.valid_to,
      buying_selling:formData?.buying_selling,
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
      `${apiUrl}/currency_conversion/conversion/${Id}`,
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
