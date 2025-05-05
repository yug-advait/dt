import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };
 

export const getPaymentTerms = async () => {
    try {
        const userData = getUserData();
        const token = userData?.token
        const response = await axios.get(`${apiUrl}/payment_terms/payment_term`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const paymentTerms = response?.data?.paymentTermsData || [];
        return paymentTerms;
    } catch (error) {
        return false;
    }
};

export const addUpdateDeletePaymentTermsApiCall = async (Id, formData, isDeleted) => {
    const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
    try {
        let requestBody = {
            payment_code: formData?.payment_code,
            payment_description: formData?.payment_description,
            isactive: formData?.isactive,
            id: Id,
        };

        if (Id === 0) {
            requestBody = {
                ...requestBody,
                createdby: userID,
                isdeleted: isDeleted,
            };
        } else {
            requestBody = {
                ...requestBody,
                updatedby: userID,
                isdeleted: isDeleted,
            };
        }

        const response = await axios.post(
            `${apiUrl}/payment_terms/payment_term/${Id}`,
            requestBody,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        return response.data.success;
    } catch (error) {
        console.error("Error in adding/editing Payment Terms:", error);
        return false;
    }
};
