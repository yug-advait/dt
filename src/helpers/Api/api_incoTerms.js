import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
    if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        return obj;
    }
};

export const getIncoTerms = async (inco_term_type) => {
    try {
        const userData = getUserData();
        const token = userData?.token
        const response = await axios.get(`${apiUrl}/inco_terms/inco_term/${inco_term_type}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const incoTerms = response?.data?.incoTermsData || [];
        return incoTerms;
    } catch (error) {
        return false;
    }
};

export const addUpdateDeleteIncoTermsApiCall = async (Id, formData, isDeleted, inco_term_type) => {
    const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  
    try {
        let requestBody = {
            inco_term: formData?.inco_term,
            version: formData?.version,
            inco_term1: formData?.inco_term1,
            inco_term2: formData?.inco_term2,
            isactive: formData?.isactive,
            id: Id,
        };

        if (Id === 0) {
            requestBody = {
                ...requestBody,
                createdby: userID,
                inco_term_type: inco_term_type,
                isdeleted: isDeleted,
            };
        } else {
            requestBody = {
                ...requestBody,
                updatedby: userID,
                inco_term_type: inco_term_type,
                isdeleted: isDeleted,
            };
        }
        const response = await axios.post(
            `${apiUrl}/inco_terms/inco_term/${Id}`,
            requestBody,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        return response.data.success;
    } catch (error) {
        console.error("Error adding Inco Terms:", error);
        return false;
    }
};
