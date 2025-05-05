import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getAsn = async () => {
  try {
    const userData = getUserData();
    const userID = userData?.user?.id
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/asns/asn_user/${userID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const pr = response?.data.asnMastersData || [];
    return pr;
  } catch (error) {
    return [];
  }
};
export const vehicalDroupdown = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/asns/vehical_dropdown`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const vehicalDropdown = response?.data?.vehicalDropdown || [];
    return vehicalDropdown;
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
    const response = await axios.post(
      `${apiUrl}/commons/serial_number_checker/`,
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

// export const addAsnApiCall = async (
//   formData,
//   poFilteredItems,
//   Id,
//   isdeleted
// ) => {
//   const userData = getUserData();
//   const token = userData?.token
//   const userID = userData?.user?.id
//   try {
//     let requestBody = {
//       asn_date: formData.asn_date,
//       asn_doc_type_desc: formData.asn_doc_type_desc,
//       asn_no: formData.asn_no,      
//       delivery_no: formData.delivery_no,
//       asn_doc_type_id: formData.asn_doc_type_id,
//       po_no: formData.po_no,
//       vendor_code: formData.vendor_code,
//       vendor_prod_description: formData.vendor_prod_description,
//       vehical_no: formData.vehical_no,
//       vendor_del_no: formData.vendor_del_no,
//       eway_bill_no: formData.eway_bill_no,
//       eway_bill_date: formData.eway_bill_date,
//       transpotar_name: formData.transpotar_name,
//       approvedby: userID,
//       lineItems:poFilteredItems,
//       isactive: true,
//       id: Id,
//     };

//     if (Id === 0) {
//       requestBody = {
//         ...requestBody,
//         createdby: userID,
//         isdeleted: isdeleted,
//       };
//     } else {
//       requestBody = {
//         ...requestBody,
//         updatedby: userID,
//         isdeleted: isdeleted,
//       };
//     }
//     const response = await axios.post(
//       `${apiUrl}/asns/asn/${Id}`,
//       requestBody,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     return {
//       success: false,
//       message: "server not working",
//     };
//   }
// };

export const addAsnApiCall = async (
  formData,
  poFilteredItems,
  Id,
  isdeleted
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    if (Id === 0) {
      const formDataALl = new FormData();
      formDataALl.append("supplier_invoice", formData?.supplier_invoice);
      formDataALl.append("asn_date", formData.asn_date);
      formDataALl.append("asn_doc_type_desc", formData.asn_doc_type_desc);
      formDataALl.append("asn_no", formData.asn_no);
      formDataALl.append("delivery_no", formData.delivery_no);
      formDataALl.append("asn_doc_type_id", formData.asn_doc_type_id);
      formDataALl.append("po_no", JSON.stringify(formData.po_no));
      formDataALl.append("vendor_code", JSON.stringify(formData.vendor_code));
      formDataALl.append(
        "vendor_prod_description",
        formData.vendor_prod_description
      );
      formDataALl.append("vehical_no", formData.vehical_no);
      formDataALl.append("vendor_del_no", formData.vendor_del_no);
      formDataALl.append("eway_bill_no", formData.eway_bill_no);
      formDataALl.append("eway_bill_date", formData.eway_bill_date);
      formDataALl.append("transpotar_name", formData.transpotar_name);
      formDataALl.append("approvedby", userID);
      formDataALl.append("lineItems", JSON.stringify(poFilteredItems));
      formDataALl.append("isactive", true);
      formDataALl.append("id", Id);
      formDataALl.append("createdby", userID);
      formDataALl.append("isdeleted", isdeleted);
      const response = await axios.post(
        `${apiUrl}/asns/asn/${Id}`,
        formDataALl,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;

    } else {
       let requestBody = {
        asn_date: formData.asn_date,
        asn_doc_type_desc: formData.asn_doc_type_desc,
        asn_no: formData.asn_no,      
        delivery_no: formData.delivery_no,
        asn_doc_type_id: formData.asn_doc_type_id,
        po_no: formData.po_no,
        vendor_code: formData.vendor_code,
        vendor_prod_description: formData.vendor_prod_description,
        vehical_no: formData.vehical_no,
        vendor_del_no: formData.vendor_del_no,
        eway_bill_no: formData.eway_bill_no,
        eway_bill_date: formData.eway_bill_date,
        transpotar_name: formData.transpotar_name,
        approvedby: userID,
        lineItems:poFilteredItems,
        isactive: true,
        id: Id,
        updatedby: userID,
        isdeleted: isdeleted,
      };
      const response = await axios.post(
        `${apiUrl}/asns/asn/${Id}`,
        requestBody,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    }
  } catch (error) {
    console.log("error",error)
    return {
      success: false,
      message: "server not working",
    };
  }
};
