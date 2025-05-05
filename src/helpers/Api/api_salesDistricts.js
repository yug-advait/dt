import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

// Get All SalesDistricts
const getUserData = () => {
    if (localStorage.getItem('authUser')) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  }

export const getSalesDistricts = async () => {
    const userData = getUserData();
  const token = userData?.token;
    try {
        const response = await axios.get(`${apiUrl}/sales_district/sales_districts`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        const salesDistricts = response?.data?.salesDistrictsData || [];
        return salesDistricts;
    }
    catch (error) {
        return false;
    }
}

//Create/ Update/ Delete SalesDistricts
export const addUpdateDeleteSalesDistrictsApiCall = async (Id, formData, isDeleted) => {
    const userData = getUserData();
  const token = userData?.token
  const userId = userData?.user?.id
    try {

        let requestBody = {
            id : Id,
            sales_district_short_code : formData?.sales_district_short_code,
            sales_district_description : formData?.sales_district_description,
            isactive : formData?.isactive
        };

        if (Id === 0) {
            requestBody = {
              ...requestBody,
              createdby: userId,
              isdeleted: isDeleted,
            };
          }
        else{
            requestBody = {
                ...requestBody,
                updatedby : userId,
                isdeleted : isDeleted
            };
        }

        const response = await axios.post(
            `${apiUrl}/sales_district/sales_district/${Id}`,
            requestBody, {
                headers  : {
                  Authorization : `Bearer ${token}`
                }
              }
            );
        return response.data.success;
    }
    catch (error) {
        console.error("Error in adding/updating/ deleting sales district : ", error);
        return false;
    }
}