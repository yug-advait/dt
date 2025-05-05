import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getCustomers = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/customers/customer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response?.data?.customerData || [];
    return data;
  } catch (error) {
    return [];
  }
};

export const getCustomerByID = async id => {
  const userData = getUserData();
  const token = userData?.token;
  try {
    const response = await axios.get(`${apiUrl}/customers/customer/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const customer = response?.data?.customerByIDData || [];
    return customer;
  } catch (error) {
    return [];
  }
};

export const addCustomersApiCall = async (
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
      customer_group_id: formData?.customer_group_id,
      customer_code: formData?.customer_code,
      account_group_id: formData?.account_group_id,
      vendor_id: formData?.vendor_id,
      ext_cust_cd_1: formData?.ext_cust_cd_1,
      ext_cust_cd_2: formData?.ext_cust_cd_2,
      ext_cust_cd_3: formData?.ext_cust_cd_3,
      customer_legal_entity: formData?.customer_legal_entity,
      sales_organisation_id: formData?.sales_organisation_id,
      distribution_channel_id: formData?.distribution_channel_id,
      division_id: formData?.division_id,
      sales_office_id: formData?.sales_office_id,
      sales_group_id: formData?.sales_group_id,
      customer_classification: formData?.customer_classification,
      employee_id: formData?.employee_id,
      previous_account_no: formData?.previous_account_no,
      tan: formData?.tan,
      tin: formData?.tin,
      gstin: formData?.gstin,
      cust_grp1: formData?.cust_grp1,
      cust_grp2: formData?.cust_grp2,
      cust_grp3: formData?.cust_grp3,
      cust_grp4: formData?.cust_grp4,
      cust_grp5: formData?.cust_grp5,
      cust_grp6: formData?.cust_grp6,
      cust_grp7: formData?.cust_grp7,
      tax_id_1: formData?.tax_id_1,
      tax_id_2: formData?.tax_id_2,
      tax_id_3: formData?.tax_id_3,
      tax_id_4: formData?.tax_id_4,
      tax_id_5: formData?.tax_id_5,
      delivery_plant1: formData?.delivery_plant1,
      delivery_plant2: formData?.delivery_plant2,
      delivery_plant3: formData?.delivery_plant3,
      title: formData?.title,
      firstname: formData?.firstname,
      lastname: formData?.lastname,
      telephone: formData?.telephone,
      mobile: formData?.mobile,
      email_id: formData?.email_id,
      password: formData?.password,
      company_id: formData?.company_id,
      valid_from: formData?.valid_from,
      valid_to: formData?.valid_to,
      swift_code: formData?.swift_code,
      address_1: formData?.address_1,
      address_2: formData?.address_2,
      address_3: formData?.address_3,
      country_id: formData?.country_id,
      state_id: formData?.state_id,
      city: formData?.city,
      pincode: formData?.pincode,
      currency_id: formData?.currency_id,
      delivery_block: formData?.delivery_block,
      billing_block: formData?.billing_block,
      pod_indicator: formData?.pod_indicator,
      revenue_indicator: formData?.revenue_indicator,
      gst_indicator: formData?.gst_indicator,
      order_block: formData?.order_block,
      deletion_indicator: formData?.deletion_indicator,
      credit_block: formData?.credit_block,
      credit_limit_amount: formData?.credit_limit_amount,
      payment_terms_id: formData?.payment_terms_id,
      sez_eou_dta: formData?.sez_eou_dta,
      iec_code: formData?.iec_code,
      inco_terms_id: formData?.inco_terms_id,
      inco_terms_desc_id: formData?.inco_terms_desc_id,
      iban_number: formData?.iban_number,
      pan_number: formData?.pan_number,
      text1: formData?.text1,
      text2: formData?.text2,
      text3: formData?.text3,
      text4: formData?.text4,
      text5: formData?.text5,
      bank_name: formData?.bank_name,
      ifsc_code: formData?.ifsc_code,
      bank_address: formData?.bank_address,
      bank_account_number: formData?.bank_account_number,
      bank_account_holdername: formData?.bank_account_holdername,
      bank_branch_code: formData?.bank_branch_code,
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
      `${apiUrl}/customers/customer/${Id}`,
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

// GET : getCustomerAddress
export const getCustomerAddress = async (id) => {
  const userData = getUserData();
  const token = userData?.token;
  try {
    const response = await axios.get(`${apiUrl}/customers/get_customer_address/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const customerAddress = response?.data?.getCustomerAddressData || [];
    return customerAddress;
  } catch (error) {
    return [];
  }
};
