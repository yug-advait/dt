import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

//TechnicalParameter All API
export const getTechSet = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/technical_parameter_set/technical_parameters_sets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response?.data?.technicalParameterSetData || [];
    return data;
  } catch (error) {
    return [];
  }
};

//getTechnicalValueParameter All API
export const getTechnicalValueParameterSet = async (id) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/technical_parameter_set/technical_parameters_sets/` + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response?.data?.technicalParameterSetByIDData || [];
    return data;
  } catch (error) {
    return [];
  }
};

export const addTechSetApiCall = async (
  set_label,
  parameter_sets,
  Id,
  isdeleted
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      set_label:set_label,
      parameter_sets:parameter_sets,
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
      `${apiUrl}/technical_parameter_set/technical_parameters_sets/${Id}`,
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
