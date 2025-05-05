import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getLanguagesApiCall = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token;
    const response = await axios.get(`${apiUrl}/languages/language/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    const languages = response?.data?.languagesData || [];
    return languages;
  } catch (error) {
    console.error("Error in adding language : ", error);
    return false;
  }
};

// Create/ Update/ Delete Language
export const addUpdateDeleteLanguageApiCall = async (
  Id,
  languageShortCode,
  languageDescription,
  isActive,
  isDeleted
) => {
    const userData = getUserData();
    const token = userData?.token;
    const userID = userData?.user?.id;
  try {
    let requestBody = {
      id: Id,
      language_short_code: languageShortCode,
      language_description: languageDescription,
      isactive: isActive,
    };
    if (Id === 0) {
      requestBody = {
        ...requestBody,
        createdby: userID,
      };
    } else {
      requestBody = {
        ...requestBody,
        updatedby: userID,
        isdeleted: isDeleted,
      };
    }
    const response = await axios.post(
        `${apiUrl}/languages/language/${Id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    return response.data.success;
  } catch (error) {
    console.error("Error in adding language : ", error);
    return false;
  }
};
