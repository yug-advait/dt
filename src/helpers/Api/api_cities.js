import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};
const userData = getUserData();
const UserID = userData?.user?.id

export const getCities = async () => {
  try {
    const response = await axios.get(`${apiUrl}/cities/city`);
    const cities = response?.data?.citiesData || [];
    return cities;
  } catch (error) {
    return false;
  }
};

export const addCitiesApiCall = async (
  formData,
  selectCountry,
  isActive,
  Id,
  isdeleted
) => {
  try {
    let requestBody = {
      city_code:formData?.city_code,
      city_name:formData?.city_name,
      city_description:formData?.city_description, 
      state_id:formData?.state_id, 
      country_id:formData?.country_id, 
      isactive: isActive,
      id: Id,
    };

    if (Id === 0) {
      requestBody = {
        ...requestBody,
        createdby: UserID,
        isdeleted: isdeleted,
      };
    } else {
      requestBody = {
        ...requestBody,
        updatedby: UserID,
        isdeleted: isdeleted,
      };
    }

    const response = await axios.post(
      `${apiUrl}/cities/city/` + Id,
      requestBody
    );
    return response.data.success;
  } catch (error) {
    return false;
  }
};
