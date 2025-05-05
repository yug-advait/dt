import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

//TechnicalParameter All API
export const getTechnicalParameter = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/technical_parameter/technical_parameters`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response?.data?.technicalParameterData || [];
    return data;
  } catch (error) {
    return [];
  }
};

//getTechnicalValueParameter All API
export const getTechnicalValueParameter = async (id) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/technical_parameter/technical_parameters_values/` + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response?.data?.technicalSetParameterByIDData || [];
    return data;
  } catch (error) {
    return [];
  }
};


export const deleteTechnicalValueParameter = async (id) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/technical_parameter/technical_parameters_values/` + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response?.data?.technicalParameterByIDData || [];
    return data;
  } catch (error) {
    return [];
  }
};

export const addTechnicalParameterApiCall = async (
  formData,
  dropDownList,
  multiSelectList,
  Id,
  isdeleted
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      formData,
      dropDownList,
      multiSelectList,
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
      `${apiUrl}/technical_parameter/technical_parameters/${Id}`,
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
