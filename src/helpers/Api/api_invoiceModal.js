import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};


export const getInvoiceModal = async (type, id) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/tax_invoices_master/tax_invoices_master/${type}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const invoice = response?.data || [];
    return invoice;
  } catch (error) {
    return false;
  }
};
export const getInvoiceNo = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/tax_invoices_master/invoice_id`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const invoice = response?.data || [];
    console.log("aaaaa", invoice)
    return invoice;
  } catch (error) {
    return false;
  }
};
