import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};


export const getEmployeeMaster = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/employees/employee`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const employeeMaster = response?.data?.employeesData || [];
    return employeeMaster;
  } catch (error) {
    return [];
  }
};

export const addEmployeeMasterApiCall = async (
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
      employee_code: formData?.employee_code,
      employee_group_id: formData?.employee_group_id,
      title: formData?.title,
      firstname: formData?.firstname,
      lastname: formData?.lastname,
      telephone: formData?.telephone,
      mobile: formData?.mobile,
      email_id: formData?.email_id,
      valid_from: formData?.valid_from,
      valid_to: formData?.valid_to,
      employee_sub_group_id: formData?.employee_sub_group,
      challenge_description: formData?.challenge_description,
      vendor_id: formData?.vendor_id,
      company_id: formData?.company_id,
      country_id: formData?.country_id,
      state_id: formData?.state_id,
      city: formData?.city,
      pincode: formData?.pincode,
      pan_number: formData?.pan_number,
      aadhar_card: formData?.aadhar_card,
      calender_id: formData?.calender_id,
      emr_address_1: formData?.emr_address_1,
      sales_organisation_id: formData?.sales_organisation_id,
      division_id: formData?.division_id,
      distribution_channel_id: formData?.distribution_channel_id,
      sales_office_id: formData?.sales_office_id,
      sales_group_id: formData?.sales_group_id,
      supervisor_id: formData?.supervisor_id,
      home_office_address: formData?.home_office_address,
      satellite_office_address: formData?.satellite_office_address,
      designation_id: formData?.designation_id,
      previous_account_no: formData?.previous_account_no,
      tenth_std_percentage: formData?.tenth_std_percentage,
      twelfth_std_percentage: formData?.twelfth_std_percentage,
      bachelors_degree: formData?.bachelors_degree,
      university_for_bachelors: formData?.university_for_bachelors,
      masters_degree: formData?.masters_degree,
      university_for_masters: formData?.university_for_masters,
      bachelors_percentage: formData?.bachelors_percentage,
      stream_of_education: formData?.stream_of_education,
      phd_degree_subject: formData?.phd_degree_subject,
      masters_percentage: formData?.masters_percentage,
      ext_emp_cd_1: formData?.ext_emp_cd_1,
      ext_emp_cd_2: formData?.ext_emp_cd_2,
      ext_emp_cd_3: formData?.ext_emp_cd_3,
      emr_name_1: formData?.emr_name_1,
      emr_name_2: formData?.emr_name_2,
      emr_name_3: formData?.emr_name_3,
      emr_phone_1: formData?.emr_phone_1,
      emr_phone_2: formData?.emr_phone_2,
      emr_phone_3: formData?.emr_phone_3,
      swift_code: formData?.swift_code,
      iban_number: formData?.iban_number,
      // block_indicator: formData?.block_indicator,
      challenge_indicator: formData?.challenge_indicator,
      // deletion_indicator: formData?.deletion_indicator,
      address_data_1: formData?.address_data_1,
      address_data_2: formData?.address_data_2,
      address_data_3: formData?.address_data_3,
      currency_id: formData?.currency_id,
      text1: formData?.text1,
      text2: formData?.text2,
      text3: formData?.text3,
      text4: formData?.text4,
      text5: formData?.text5,
      bank_name: formData?.bank_name,
      bank_address: formData?.bank_address,
      bank_branch_code: formData?.bank_branch_code,
      ifsc_code: formData?.ifsc_code,
      bank_account_number: formData?.bank_account_number,
      bank_account_holder_name: formData?.bank_account_holder_name,
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
      `${apiUrl}/employees/employee/${Id}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return false;
  }
};

export const getEmployeeByID = async(id) => {
  const userData = getUserData();
  const token = userData?.token;
  try {
    const response = await axios.get(`${apiUrl}/employees/employee/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const employeeById = response?.data?.employeesByIDData || [];
    return employeeById;
  }
  // Handle Errors and Exceptions
  catch(error){
    return false;
  }
}
