import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getStates = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/states/state`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const states = response?.data?.statesData || [];
    return states;
  } catch (error) {
    return false;
  }
};

export const addStatesApiCall = async (
  formData,
  selectCountry,
  isActive,
  Id,
  isdeleted
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      state_name_alias:formData?.state_name_alias,
      state_code:formData?.state_code,
      state_description:formData?.state_description, 
      external_state_id_1:formData?.external_state_id_1, 
      external_state_id_2:formData?.external_state_id_2, 
      country_id:selectCountry?.value, 
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
      `${apiUrl}/states/state/${Id}`,
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
