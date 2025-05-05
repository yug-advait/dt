import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };


export const getPurchaseOrganisations = async () => {
    try {
        const userData = getUserData();
        const token = userData?.token
        const response = await axios.get(`${apiUrl}/purchase_organisations/purchase_org`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const purchaseOrganisations = response?.data?.purchaseOrgsData || [];
        return purchaseOrganisations;
    }
    catch (error) {
        return false;
    }
}

//Create/ Update/ Delete Purchase Organisations
export const addUpdateDeletePurchaseOrganisationApiCall = async (Id, formData, selectCompany, selectPlant, selectPurchaseGroup, isDeleted) => {
    const userData = getUserData();
    const token = userData?.token
    const userID = userData?.user?.id
    try {      
        let requestBody = {
            id : Id,
            purchase_organisation : formData?.purchase_organisation,
            company_id : selectCompany?.value,
            plant_id : selectPlant?.value,
            purchase_group_id : selectPurchaseGroup?.value,
            isactive : formData?.isactive
        };

        if (Id === 0) {
            requestBody = {
              ...requestBody,
              createdby: userID,
              isdeleted: isDeleted,
            };
          }
        else{
            requestBody = {
                ...requestBody,
                updatedby : userID,
                isdeleted : isDeleted
            };
        }

        const response = await axios.post(
            `${apiUrl}/purchase_organisations/purchase_org/${Id}`,
            requestBody,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
           );
        return response.data.success;
    }
    catch (error) {
        console.error("Error in adding/editing purchase Organisation : ", error);
        return false;
    }
}