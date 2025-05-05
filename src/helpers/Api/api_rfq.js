import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};
 
export const getRfq = async () => {
  const userData = getUserData();
  const userID = userData?.user?.id
  const token = userData?.token
  try {
    const response = await axios.get(`${apiUrl}/rfqs/rfq_user/${userID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const rfq = response?.data.rfqMastersData || [];
    return rfq;
  } catch (error) {
    return [];
  }
};

export const getRfqDetail = async (rfq_id) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/rfqs/rfq_details/${rfq_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const rfq = response?.data.rfqMastersDetailsData || [];
    return rfq;
  } catch (error) {
    return [];
  }
};

export const getDataBySerialNo = async (colName,colValue,table) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    let requestBody = {
      colName: colName,
      colValue: colValue,
      table: table,
    };
    // const response = await axios.post(`${apiUrl}/commons/serial_number_checker/`, requestBody);
    const response = await axios.post(
      `${apiUrl}/commons/serial_number_checker/${Id}`,
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



export const addRfqApiCall = async (
  formData,
  prFilteredItems,
  Id,
  isdeleted
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      rfq_date: formData.rfq_date,
      rfq_doc_type_id: formData.rfq_doc_type_id,
      rfq_no: formData.rfq_no,      
      vendors: formData.vendors,
      approvedby: userID,
      lineItems:prFilteredItems,
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
      `${apiUrl}/rfqs/rfq/${Id}`,
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


export const rfqSendMail = async (pdfBlob, filename) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const formData = new FormData();
    formData.append("file", pdfBlob, filename);
    formData.append("email", userData?.user?.email_id);
    formData.append("subject", "Your RFQ PDF Details");
    formData.append("html", "<h2>Please find the attached PDF</h2>");

    const response = await axios.post(`${apiUrl}/rfqs/send_email`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return {
      success: false,
      message: "Server not working. Please try again later.",
    };
  }
};
