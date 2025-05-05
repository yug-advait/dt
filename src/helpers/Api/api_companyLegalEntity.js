import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getCompanyLegalEntity = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/companies/company`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const companies = response?.data?.companiesData || [];
    return companies;
  } catch (error) {
    return [];
  }
};

export const getCompanyLegalEntityByID = async (id) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/companies/company/` + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const companies = response?.data?.companyByIDData || [];
    return companies;
  } catch (error) {
    return [];
  }
};

export const addCompanyLegalEntityApiCall = async (
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
      company_code:formData?.company_code,
      company_name:formData?.company_name,
      registration_number:formData?.registration_number,
      pan_number:formData?.pan_number,
      tan:formData?.tan,
      tin:formData?.tin,
      tax_id_1:formData?.tax_id_1,
      tax_id_2:formData?.tax_id_2,
      tax_id_3:formData?.tax_id_3,
      tax_id_4:formData?.tax_id_4,
      tax_id_5:formData?.tax_id_5,
      address_1:formData?.address_1,
      address_2:formData?.address_2,
      address_3:formData?.address_3,
      country_id:formData?.country_id,
      state_id:formData?.state_id,
      city:formData?.city,
      pincode:formData?.pincode,
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
      `${apiUrl}/companies/company/${Id}`,
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
