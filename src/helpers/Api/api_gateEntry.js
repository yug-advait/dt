import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getGateEntry = async () => {
  try {
    const userData = getUserData();
    const userID = userData?.user?.id
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/gate_entrys/gate_entry_user/${userID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response?.data.gateEntryMastersData || [];
    return data;
  } catch (error) {
    return [];
  }
};

export const addGateEntryApiCall = async (
  formData,
  GateInbound,
  grnFilteredItems,
  Id,
  isdeleted
) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const userID = userData?.user?.id
    let requestBody = {
      gate_doc_type_id : formData?.gate_doc_type_id,
      gate_pass_no : formData?.gate_pass_no,
      gate_no : formData?.gate_no,
      purpose : formData?.purpose,
      reference_no : formData?.grn_no,
      in_date : formData?.in_date,
      out_date : formData?.out_date,
      time_in : formData?.time_in,
      time_out : formData?.time_out,
      contact_person : formData?.contact_person,
      gate_pass_type_id : formData?.gate_pass_type,
      gate_pass_status : formData?.gate_pass_status,
      vehical_number : formData?.vehical_number,
      vehical_type : formData?.vehical_type,
      driver_name : formData?.driver_name,
      driver_contact : formData?.driver_contact,
      license_no : formData?.license_no,
      transporter_name : formData?.transporter_name,
      contact_no : formData?.contact_no,
      vehical_owner : formData?.vehical_owner,
      remarks : formData?.remarks,
      security_memo : formData?.security_memo,
      approval_status : GateInbound===true ? 0 : 3,
      gate_inbound:GateInbound,
      approvedby: userID,
      lineItems:grnFilteredItems,
      isactive: true,
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
      `${apiUrl}/gate_entrys/gate_entry/${Id}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: "server not working",
    };
  }
};
