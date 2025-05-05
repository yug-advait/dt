import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getUnitOfMeasure = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/unit_of_measures/unit_of_measure`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const unitOfMeasure = response?.data?.unitOfMeasuresData || [];
    return unitOfMeasure;
  } catch (error) {
    return [];
  }
};

export const addUnitOfMeasureApiCall = async (
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
      uom_code:formData?.uom_code,
      commercial_uom_code:formData?.commercial_uom_code,
      uom_description:formData?.uom_description,
      commercial_uom_description:formData?.commercial_uom_description,
      iso_code_for_uom:formData?.iso_code_for_uom,
      decimal_allowed_upto:formData?.decimal_allowed_upto,
      alias_uom_1:formData?.alias_uom_1,
      alias_uom_2:formData?.alias_uom_2,
      alias_uom_3:formData?.alias_uom_3,
      alias_uom_4:formData?.alias_uom_4,
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
      `${apiUrl}/unit_of_measures/unit_of_measure/${Id}`,
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
