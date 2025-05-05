import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getHsnSac = async (hsn_sac_type) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/hsnsac/hsn_sac/` + hsn_sac_type, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const hsnsac = response?.data?.hsnSacCodeData || [];
    return hsnsac;
  } catch (error) {
    return false;
  }
};

export const addHsnSacApiCall = async (
  formData,
  isActive,
  Id,
  isdeleted,
  hsn_sac_type,
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      chapter: formData?.chapter,
      heading: formData?.heading,
      sub_heading: formData?.sub_heading,
      tariff_item: formData?.tariff_item,
      hsn_sac_code: formData?.hsn_sac_code,
      hsn_sac_category: formData?.hsn_sac_category,
      hsn_sac_description: formData?.hsn_sac_description,
      isactive: isActive,
      id: Id,
    };

    if (Id === 0) {
      requestBody = {
        ...requestBody,
        createdby: userID,
        hsn_sac_type:hsn_sac_type,
        isdeleted: isdeleted,
      };
    } else {
      requestBody = {
        ...requestBody,
        updatedby: userID,
        hsn_sac_type:hsn_sac_type,
        isdeleted: isdeleted,
      };
    }
    const response = await axios.post(
      `${apiUrl}/hsnsac/hsn_sac/${Id}`,
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
