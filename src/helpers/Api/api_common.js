import axios from "axios"
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const updateStatusApiCall = async (action) => {
  const userData = getUserData();
  const token = userData?.token
  try {
    let requestBody = {
      name: action?.name,
      isactive: action?.isactive,
    }
    const response = await axios.post(
      `${apiUrl}/commons/update_field/${action?.id}`,
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

export const getSelectData = async (colName,colValue,table) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    let requestBody = {
      colName: colName,
      colValue: colValue,
      table: table,
    };
    const response = await axios.post(
      `${apiUrl}/commons/search_data/`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getRelatedRecords = async (tableName,nameColumn,filterColumn,filterValue) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    let requestBody = {
      tableName: tableName,
      nameColumn: nameColumn,
      filterColumn: filterColumn,
      filterValue: filterValue
    };
    const response = await axios.post(
      `${apiUrl}/commons/related_data`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return [];
  }
};
export const getCurrencyConverter = async (from,to,amount) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    let requestBody = {
      from: from,
      to: to,
      amount: Number(amount)
    };
    const response = await axios.post(
      `${apiUrl}/commons/currency_converter`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return [];
  }
};

//Update PR,PO and ASN Line Item
export const updateLineItemApiCall = async (formData,type) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    let requestBody = {
      formData: formData,
      type: type,
    }
    const response = await axios.post(
      `${apiUrl}/commons/line_item_update`,
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

//Delete PR,PO and ASN Line Item
export const deleteLineItemApiCall = async (id,type) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    let requestBody = {
      id: id,
      type: type,
    }
    const response = await axios.post(
      `${apiUrl}/commons/line_item_delete`,
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
export const updateApprovalStatus = async (type, lineArray, approval_status, updatedby, reason) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    let requestBody = 
    {
      lineArray: lineArray,
      approval_status: approval_status,
      updatedby: updatedby,
      type: type,
      reason: reason,
    }
    const response = await axios.post(
      `${apiUrl}/commons/update_approval_status`,
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
export const updateApprovalRequest = async (type, lineArray, request_status, request_to, request_from) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    let requestBody = 
    {
      type: type,
      lineArray: lineArray,
      request_status: request_status,
      request_to: request_to,
      request_from: request_from
    }
    const response = await axios.post(
      `${apiUrl}/commons/update_approval_request`,
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