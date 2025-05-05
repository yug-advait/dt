import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };

export const getDesignations = async () => {
    const userData = getUserData();
    const token = userData?.token
    try {
        const response = await axios.get(`${apiUrl}/designations/designation/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        const designations = response?.data?.designationsData || [];
        return designations;
    }
    catch (error) {
        return false;
    }
}

//Create/ Update/ Delete Designations
export const addUpdateDeleteDesignationApiCall = async (Id, formData, selectCompany, selectDepartment, isActive, isDeleted) => {
    try {
        const userData = getUserData();
        const token = userData?.token
        const userID = userData?.user?.id
        let requestBody = {
            id : Id,
            company_id : selectCompany?.value,
            department_id : selectDepartment?.value,
            designation_id : formData?.designation_id,
            designation_description : formData?.designation_description,
            remarks : formData?.remarks,
            isactive : isActive
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
            `${apiUrl}/designations/designation/${Id}`,
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
        console.error("Error in adding designation : ", error);
        return false;
    }
}