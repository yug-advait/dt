import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getCountries = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/countries/country`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const countries = response?.data?.countriesData || [];
    return countries;
  } catch (error) {
    return false;
  }
};

export const addCountriesApiCall = async (
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
      country_name:formData?.country_name,
      country_short_code:formData?.country_short_code,
      country_description:formData?.country_description, 
      country_description:formData?.country_description, 
      country_currency:formData?.country_currency, 
      country_iso_3_digit_code:formData?.country_iso_3_digit_code, 
      national_language:formData?.national_language, 
      business_language:formData?.business_language,
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
      `${apiUrl}/countries/country/${Id}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.success;
  } catch (error) {
    console.error("Error adding country:", error);
    return false;
  }
};
