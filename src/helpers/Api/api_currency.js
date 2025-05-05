import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getCurrency = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/currencies/currency`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const currencies = response?.data?.currenciesData || [];
    return currencies;
  } catch (error) {
    return [];
  }
};

export const addCurrencyApiCall = async (
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
      currency_code:formData?.currency_code,
      commercial_currency_code:formData?.commercial_currency_code,
      currency_description:formData?.currency_description,
      commercial_currency_description:formData?.commercial_currency_description,
      decimal_allowed_upto:formData?.decimal_allowed_upto,
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
      `${apiUrl}/currencies/currency/${Id}`,
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
