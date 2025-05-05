import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };

export const getPurchaseGroups = async () => {
    try {
        const userData = getUserData();
        const token = userData?.token
        const response = await axios.get(`${apiUrl}/purchase_groups/purchase_group`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const purchaseGroups = response?.data?.purchaseGroupsData || [];
        return purchaseGroups;
    } catch (error) {
        return false;
    }
};

export const addUpdateDeletePurchaseGroupsApiCall = async (Id, formData, isDeleted) => {
    const userData = getUserData();
    const token = userData?.token
    const userID = userData?.user?.id
    try {
        let requestBody = {
            purchase_group_code: formData?.purchase_group_code,
            purchase_group_description: formData?.purchase_group_description,
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
        `${apiUrl}/purchase_groups/purchase_group/${Id}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        );
        return response.data.success;
    } catch (error) {
        console.error("Error in adding/editing Purchase Groups:", error);
        return false;
    }
};
