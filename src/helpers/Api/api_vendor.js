import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;


const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getVendor = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/vendors/vendor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const vendors = response?.data?.vendorsData || [];
    return vendors;
  } catch (error) {
    return [];
  }
};

export const getVendorByID = async (id) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/vendors/vendor/` + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const vendors = response?.data?.vendorByIDData || [];
    return vendors;
  } catch (error) {
    return [];
  }
};

export const addVendorApiCall = async (
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
      account_group_id: formData?.account_group_id,
      vendor_code: formData?.vendor_code,
      legal_entity_name: formData?.legal_entity_name,
      title: formData?.title,
      firstname: formData?.firstname,
      lastname: formData?.lastname,
      telephone: formData?.telephone,
      mobile: formData?.mobile,
      email_id: formData?.email_id,
      password: formData?.password,
      company_id: formData?.company_id,
      country_id: formData?.country_id,
      state_id: formData?.state_id,
      city: formData?.city,
      pincode: formData?.pincode,
      registration_number: formData?.registration_number,
      pan_number: formData?.pan_number,
      tan: formData?.tan,
      tin: formData?.tin,
      gstin: formData?.gstin,
      tax_indicator_id: formData?.tax_indicator_id,
      currency_id: formData?.currency_id,
      location_code_id: formData?.location_code_id,
      vendor_group_id: formData?.vendor_group_id,
      revenue_indicator_id: formData?.revenue_indicator_id,
      vendor_classification: formData?.vendor_classification,
      purchase_organisation_id: formData?.purchase_organisation_id,
      ext_vendor_code1: formData?.ext_vendor_code1,
      ext_vendor_code2: formData?.ext_vendor_code2,
      ext_vendor_code3: formData?.ext_vendor_code3,
      customer_id: formData?.customer_id,
      previous_account_number: formData?.previous_account_number,
      iec_code: formData?.iec_code,
      valid_from: formData?.valid_from,
      udyog_number: formData?.udyog_number,
      aadhar_number: formData?.aadhar_number,
      valid_to: formData?.valid_to,
      address_1: formData?.address_1,
      address_2: formData?.address_2,
      address_3: formData?.address_3,
      tax_id_1: formData?.tax_id_1,
      tax_id_2: formData?.tax_id_2,
      tax_id_3: formData?.tax_id_3,
      tax_id_4: formData?.tax_id_4,
      tax_id_5: formData?.tax_id_5,
      pod_indicator: formData?.pod_indicator,
      text1: formData?.text1,
      text2: formData?.text2,
      text3: formData?.text3,
      text4: formData?.text4,
      text5: formData?.text5,
      vend_grp1: formData?.vend_grp1,
      vend_grp2: formData?.vend_grp2,
      vend_grp2: formData?.vend_grp2,
      vend_grp3: formData?.vend_grp3,
      vend_grp4: formData?.vend_grp4,
      vend_grp5: formData?.vend_grp5,
      vend_grp6: formData?.vend_grp6,
      vend_grp7: formData?.vend_grp7,
      purchase_group_id: formData?.purchase_group_id,
      employee_id: formData?.employee_id,
      procurement_block: formData?.procurement_block,
      delivery_block: formData?.delivery_block,
      billing_block: formData?.billing_block,
      payment_terms_id: formData?.payment_terms_id,
      inco_term_id: formData?.inco_term_id,
      swift_code: formData?.swift_code,
      iban_number: formData?.iban_number,
      withholding_tax_type_id: formData?.withholding_tax_type_id,
      delivery_lead_time: formData?.delivery_lead_time,
      bank_name: formData?.bank_name,
      bank_account_number: formData?.bank_account_number,
      bank_account_holdername: formData?.bank_account_holdername,
      bank_branch_code: formData?.bank_branch_code,
      ifsc_code: formData?.ifsc_code,
      bank_address: formData?.bank_address,
      gst_registration_type: formData?.gst_registration_type,
      additional_gst_details: formData?.additional_gst_details,
      place_of_supply: formData?.place_of_supply,
      is_party_transporter: formData?.is_party_transporter,
      transporter_id: formData?.transporter_id,
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
      `${apiUrl}/vendors/vendor/${Id}`,
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
