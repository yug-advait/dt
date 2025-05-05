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

export const getSiteSetting = async () => {
  try {
    const response = await axios.get(`${apiUrl}/site_sittings/site_sitting`)
    const sitesitting = response?.data?.siteSittingsData || [];
    return sitesitting;
  } catch (error) {
    return [];
  }
};

export const addSiteSettingApiCall = async (
  formData,
  isActive,
  Id,
  isdeleted
) => {
  try {
    let requestBody = {
      key:formData?.key,
      value:formData?.value,
      identifier:formData?.identifier,
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
      `${apiUrl}/site_sittings/site_sitting/` + Id,
      requestBody
    );
    return response.data.success;
  } catch (error) {
    return false;
  }
};
