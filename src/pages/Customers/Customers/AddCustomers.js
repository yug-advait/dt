import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Input,
  Alert,
  Label,
} from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import "flatpickr/dist/themes/material_blue.css";
import { Title } from "../../../constants/layout";
import moment from "moment";
import Flatpickr from "react-flatpickr";
import { getRelatedRecords } from "helpers/Api/api_common";
import {
  GET_CUSTOMERS_REQUEST,
  UPDATE_CUSTOMERS_REQUEST,
  ADD_CUSTOMERS_REQUEST,
} from "../../../store/customers/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const AddCustomers = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { customers, listCustomer, addcustomers, updatecustomers } =
    useSelector(state => state.customers);
  const [loading, setLoading] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([]);
  const [extCustCode, setExtCustCode] = useState([]);
  const [extCustGrp, setExtCustGrp] = useState([]);
  const [deliveryPlant, setDeliveryPlant] = useState([]);
  const [address, setAddress] = useState([]);
  const [taxId, setTaxID] = useState([]);
  const [textId, setTextID] = useState([]);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [Edit, setEdit] = useState(null);
  const mode = Edit === null ? "Add" : "Edit";
  const [optionCustomerGroup, setOptionCustomerGroup] = useState([]);
  const [optionAccountGrp, setOptionAccountGrp] = useState([]);
  const [optionVendorCode, setOptionVendorCode] = useState([]);
  const [optionSalesOrganisation, setOptionSalesOrganisation] = useState([]);
  const [optionDivision, setOptionDivision] = useState([]);
  const [optionDistributionChannel, setOptionDistributionChannel] = useState(
    []
  );
  const [optionSalesOffice, setOptionSalesoptionSalesOffice] = useState([]);
  const [optionSalesGroup, setOptionSalesoptionSalesGroup] = useState([]);
  const [optionEmployeeCode, setOptionEmployeeCode] = useState([]);
  const [optionCustomerGrp, setOptionCustomerGrp] = useState([]);
  const [optionDeliveryPlant, setOptionDeliveryPlant] = useState([]);
  const [optionCompany, setOptionCompany] = useState([]);
  const [optionCountry, setOptionCountry] = useState([]);
  const [optionState, setOptionState] = useState([]);
  const [optionCurrency, setOptionCurrency] = useState([]);
  const [optionPaymentTerms, setOptionPaymentTerms] = useState([]);
  const [optionIncoTerms, setOptionIncoTerms] = useState([]);
  const [optionIncoTermsDesc, setOptionIncoTermsDesc] = useState([]);
  const [optionSezEouDta, setOptionSezEouDta] = useState([]);
  const [optionTitle, setOptionTitle] = useState(Title);
  const [formData, setFormData] = useState({});

  const validateForm1 = () => {
    const errors = {};
    if (!formData.customer_code) {
      errors.customer_code = "Customer Code is required";
    } else if (formData.customer_code.length > 10) {
      errors.customer_code = "Customer Code  cannot be more than 10 characters";
    }
    if (!formData.customer_group_id) {
      errors.customer_group_id = "Customer Group is required";
    } else if (formData.customer_group_id.length > 10) {
      errors.customer_group_id =
        "Customer Code  cannot be more than 10 characters";
    }
    if (!formData.account_group_id) {
      errors.account_group_id = "Account Group is required";
    }
    if (!formData.vendor_id) {
      errors.vendor_id = "Vendor is required";
    }
    if (!formData.ext_cust_cd_1) {
      errors.ext_cust_cd_1 = "Ext Customer Code 1 is required";
    } else if (formData.ext_cust_cd_1.length > 10) {
      errors.ext_cust_cd_1 =
        "Ext Cust Code 1 cannot be more than 10 characters";
    }
    extCustCode.forEach((_, idx) => {
      const fieldName = `ext_cust_cd_ ${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Ext Cust Code ${idx + 2} is required`;
      } else if (value.length > 10) {
        errors[fieldName] = `Ext Cust Code ${
          idx + 2
        } cannot exceed 10 characters`;
      }
    });
    if (!formData.customer_legal_entity) {
      errors.customer_legal_entity = "Legal Entity Name is required";
    }
    if (!formData.sales_organisation_id) {
      errors.sales_organisation_id = "Sales Organisation is required";
    }
    if (!formData.division_id) {
      errors.division_id = "Division is required";
    }
    if (!formData.distribution_channel_id) {
      errors.distribution_channel_id = "Distribution Channel is required";
    }
    if (!formData.sales_office_id) {
      errors.sales_office_id = "Sales Office is required";
    }
    if (!formData.sales_group_id) {
      errors.sales_group_id = "Sales Group is required";
    }
    if (!formData.employee_id) {
      errors.employee_id = "Employee Code is required";
    }
    if (!formData.previous_account_no) {
      errors.previous_account_no = "Previous Account No is required";
    } else if (formData.previous_account_no.length > 10) {
      errors.previous_account_no =
        "Previous Account  cannot be more than 10 characters";
    }
    if (!formData.tan) {
      errors.tan = "TAN is required";
    } else if (formData.tan.length > 3) {
      errors.tan = "Tan  cannot be more than 3 characters";
    }
    if (!formData.tin) {
      errors.tin = "TIN is required";
    } else if (formData.tin.length > 3) {
      errors.tin = "Tin  cannot be more than 3 characters";
    }
    if (!formData.cust_grp1) {
      errors.cust_grp1 = "Customer Group is required";
    }
    extCustGrp.forEach((_, idx) => {
      const fieldName = `cust_grp ${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Customer Group  ${idx + 2} is required`;
      }
    });
    if (!formData.delivery_plant1) {
      errors.delivery_plant1 = "Delivery Plant is required";
    }
    deliveryPlant.forEach((_, idx) => {
      const fieldName = `delivery_plant ${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Delivery Plant  ${idx + 2} is required`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm2 = () => {
    const errors = {};
    if (!formData.title) {
      errors.title = "Title is required";
    }
    if (!formData.firstname) {
      errors.firstname = "First Name is required";
    } else if (formData.firstname.length > 50) {
      errors.firstname = "First Name  cannot be more than 50 characters";
    }
    if (!formData.lastname) {
      errors.lastname = "Last Name is required";
    } else if (formData.lastname.length > 50) {
      errors.lastname = "Last Name  cannot be more than 50 characters";
    }
    if (!formData.telephone) {
      errors.telephone = "Telephone is required";
    } else if (formData.telephone.length > 20) {
      errors.telephone = "Telephone  cannot be more than 20 characters";
    }
    if (!formData.mobile) {
      errors.mobile = "Mobile is required";
    } else if (formData.mobile.length > 20) {
      errors.mobile = "Mobile  cannot be more than 20 characters";
    }
    if (!formData.email_id) {
      errors.email_id = "Email is required";
    } else if (!validateEmail(formData.email_id)) {
      errors.email_id = "Please enter a valid email address.";
    } else if (formData.email_id.length > 50) {
      errors.email_id = "Email cannot be more than 50 characters";
    }
    if (!formData.company_id) {
      errors.company_id = "Company is required";
    }
    if (!formData.valid_from) {
      errors.valid_from = "Valid From is required";
    }
    if (!formData.valid_to) {
      errors.valid_to = "Valid To is required";
    }
    if (!formData.swift_code) {
      errors.swift_code = "Swift Code is required";
    } else if (formData.swift_code.length > 40) {
      errors.swift_code = "Swift Code  cannot be more than 40 characters";
    }
    if (!formData.address_1) {
      errors.address_1 = "Address is required";
    } else if (formData.address_1.length > 50) {
      errors.address_1 = "Address cannot be more than 50 characters";
    }
    address.forEach((_, idx) => {
      const fieldName = `address_ ${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Address ${idx + 2} is required`;
      } else if (value.length > 50) {
        errors[fieldName] = `Address ${idx + 2} cannot exceed 50 characters`;
      }
    });
    if (!formData.country_id) {
      errors.country_id = "Country is required";
    }
    if (!formData.state_id) {
      errors.state_id = "State is required";
    }
    if (!formData.city) {
      errors.city = "City is required";
    } else if (formData.city.length > 50) {
      errors.city = "City cannot be more than 50 characters";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length > 30) {
      errors.password = "Password cannot be more than 30 characters";
    }
    if (!formData.pincode) {
      errors.pincode = "Pincode is required";
    } else if (formData.pincode.length > 20) {
      errors.pincode = "Pincode  cannot be more than 20 characters";
    }
    if (!formData.credit_limit_amount) {
      errors.credit_limit_amount = "Credit Limit Amount is required";
    } else if (formData.credit_limit_amount.length > 10) {
      errors.credit_limit_amount =
        "Credit Limit Amount cannot be more than 10 characters";
    }
    if (!formData.iban_number) {
      errors.iban_number = "Iban Number is required";
    } else if (formData.iban_number.length > 40) {
      errors.iban_number = "Iban Number cannot be more than 40 characters";
    }
    if (!formData.customer_classification) {
      errors.customer_classification = "Customer Classification is required";
    } else if (formData.customer_classification.length > 1) {
      errors.customer_classification =
        "Customer Classification cannot be more than 1 characters";
    }
    if (!formData.iec_code) {
      errors.iec_code = "Iec Code is required";
    } else if (formData.iec_code.length > 50) {
      errors.iec_code = "IEC Code cannot be more than 50 characters";
    }
    if (!formData.currency_id) {
      errors.currency_id = "Currency is required";
    }
    if (!formData.delivery_block) {
      errors.delivery_block = "Delivery Block is required";
    }
    if (!formData.billing_block) {
      errors.billing_block = "Billing Block is required";
    }
    if (!formData.pod_indicator) {
      errors.pod_indicator = "Pod Indicator is required";
    }
    if (!formData.order_block) {
      errors.order_block = "Order Block is required";
    }
    if (!formData.deletion_indicator) {
      errors.deletion_indicator = "Deletion Indicator is required";
    }
    if (!formData.credit_block) {
      errors.credit_block = "Credit Block is required";
    }
    if (!formData.payment_terms_id) {
      errors.payment_terms_id = "Payment Terms is required";
    }
    if (!formData.inco_terms_id) {
      errors.inco_terms_id = "Inco Terms is required";
    }
    if (!formData.inco_terms_desc_id) {
      errors.inco_terms_desc_id = "Inco Terms Description is required";
    }
    if (!formData.tax_id_1) {
      errors.tax_id_1 = "Tax ID is required";
    } else if (formData.tax_id_1.length > 50) {
      errors.tax_id_1 = "Tax ID Code cannot be more than 50 characters";
    }
    taxId.forEach((_, idx) => {
      const fieldName = `tax_id_${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Tax Id ${idx + 2} is required`;
      } else if (value.length > 50) {
        errors[fieldName] = `Tax Id ${idx + 2} cannot exceed 50 characters`;
      }
    });
    if (!formData.text1) {
      errors.text1 = "Text is required";
    } else if (formData.text1.length > 100) {
      errors.text1 = "Text cannot be more than 100 characters";
    }
    textId.forEach((_, idx) => {
      const fieldName = `text${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Text ${idx + 2} is required`;
      } else if (value.length > 100) {
        errors[fieldName] = `Text ${idx + 2} cannot exceed 100 characters`;
      }
    });
    if (!formData.sez_eou_dta) {
      errors.sez_eou_dta = "SEZ/EOU/DTA is required";
    }
    if (!formData.gst_indicator) {
      errors.gst_indicator = "Gst Indicator is required";
    }
    if (!formData.revenue_indicator) {
      errors.revenue_indicator = "Revenue Indicator is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm3 = () => {
    const errors = {};

    if (!formData.pan_number) {
      errors.pan_number = "Pan Number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(formData.pan_number)) {
      errors.pan_number =
        "Must contain 5 alphabets, followed by 4 digits, then 1 alphabet";
    }

    if (!formData.gst_registration_type) {
      errors.gst_registration_type = "Regestration Type is required";
    }

    if (
      formData.gst_registration_type === "composition" ||
      formData.gst_registration_type === "regular"
    ) {
      if (!formData.gstin) {
        errors.gstin = "GSTIN is required";
      } else if (
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(
          formData.gstin
        )
      ) {
        errors.gstin =
          "Format: 2 letters (state code) + 5 letters (entity name) + 4 digits + 1 letter (legal name initial) + 1 alphanumeric (taxpayer type) + 'Z' + 1 alphanumeric (checksum)";
      }
    }

    if (formData.additional_gst_details && !formData.place_of_supply) {
      errors.place_of_supply = "Place of Supply is required";
    }

    if (
      formData.additional_gst_details &&
      formData.is_party_transporter &&
      !formData.transporter_id
    ) {
      errors.transporter_id = "Transporter ID is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm4 = () => {
    const errors = {};
    if (!formData.bank_name) {
      errors.bank_name = "Bank Name is required";
    } else if (formData.bank_name.length > 70) {
      errors.bank_name = "Bank Name cannot be more than 70 characters";
    }
    if (!formData.bank_account_number) {
      errors.bank_account_number = "Bank Account Number is required";
    } else if (formData.bank_account_number.length > 40) {
      errors.bank_account_number =
        "Bank Account Number cannot be more than 40 characters";
    }
    if (!formData.bank_account_holdername) {
      errors.bank_account_holdername = "Bank Account Holder is required";
    }
    if (!formData.bank_branch_code) {
      errors.bank_branch_code = "Bank Branch Code is required";
    } else if (formData.bank_branch_code.length > 40) {
      errors.bank_branch_code =
        "Bank Branch Code cannot be more than 40 characters";
    }
    if (!formData.ifsc_code) {
      errors.ifsc_code = "IFSC Code is required";
    } else if (formData.ifsc_code.length > 40) {
      errors.ifsc_code = "Ifsc Code cannot be more than 40 characters";
    }
    if (!formData.bank_address) {
      errors.bank_address = "Bank Address is required";
    } else if (formData.bank_address.length > 200) {
      errors.bank_address = "Bank Address cannot be more than 200 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    const inputValue = e.target.value.toUpperCase();
    const isValid = /^[A-Z]$/.test(inputValue);
    if (isValid || inputValue === "") {
      setFormData(prevData => ({
        ...prevData,
        customer_classification: inputValue,
      }));
      setFormErrors({});
    } else {
      setFormErrors({
        customer_classification:
          "Please enter a single character between A to Z",
      });
    }
    if (name === "customer_code" && value.length > 10) {
      setFormErrors({
        ...formErrors,
        customer_code: "Customer Code cannot be more than 10 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        customer_code: "",
      });
    }

    if (name === "previous_account_no" && value.length > 10) {
      setFormErrors({
        ...formErrors,
        previous_account_no:
          "Previous Account No cannot be more than 10 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        previous_account_no: "",
      });
    }
    if (name === "tan" && value.length > 3) {
      setFormErrors({
        ...formErrors,
        tan: "Tan No cannot be more than 3 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        tan: "",
      });
    }
    if (name === "tin" && value.length > 3) {
      setFormErrors({
        ...formErrors,
        tin: "Tin No cannot be more than 3 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        tin: "",
      });
    }
    if (name === "gstin" && value.length > 50) {
      setFormErrors({
        ...formErrors,
        gstin: "GSTIN No cannot be more than 50 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        gstin: "",
      });
    }
    if (name === "firstname" && value.length > 50) {
      setFormErrors({
        ...formErrors,
        firstname: "First Name cannot be more than 50 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        firstname: "",
      });
    }
    if (name === "lastname" && value.length > 50) {
      setFormErrors({
        ...formErrors,
        lastname: "Last Name cannot be more than 50 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        lastname: "",
      });
    }
    if (name === "telephone" && value.length > 20) {
      setFormErrors({
        ...formErrors,
        telephone: "Telephone No cannot be more than 20 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        telephone: "",
      });
    }
    if (name === "mobile" && value.length > 20) {
      setFormErrors({
        ...formErrors,
        mobile: "Mobile No cannot be more than 20 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        mobile: "",
      });
    }
    if (name === "swift_code" && value.length > 40) {
      setFormErrors({
        ...formErrors,
        swift_code: "Swift Code cannot be more than 40 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        swift_code: "",
      });
    }
    if (name === "city" && value.length > 50) {
      setFormErrors({
        ...formErrors,
        city: "City cannot be more than 50 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        city: "",
      });
    }
    if (name === "pincode" && value.length > 20) {
      setFormErrors({
        ...formErrors,
        pincode: "Pincode cannot be more than 20 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        pincode: "",
      });
    }
    if (name === "credit_limit_amount" && value.length > 10) {
      setFormErrors({
        ...formErrors,
        credit_limit_amount:
          "Credit Limit Amount cannot be more than 10 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        credit_limit_amount: "",
      });
    }
    if (name === "iban_number" && value.length > 40) {
      setFormErrors({
        ...formErrors,
        iban_number: "Iban Number cannot be more than 40 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        iban_number: "",
      });
    }
    if (name === "pan_number" && value.length > 50) {
      setFormErrors({
        ...formErrors,
        pan_number: "Pan Number cannot be more than 50 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        pan_number: "",
      });
    }
    if (name === "ifsc_code" && value.length > 40) {
      setFormErrors({
        ...formErrors,
        ifsc_code: "Ifsc Code cannot be more than 40 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        ifsc_code: "",
      });
    }
    if (name === "customer_classification" && value.length > 1) {
      setFormErrors({
        ...formErrors,
        customer_classification:
          "Customer Classification cannot be more than 1 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        customer_classification: "",
      });
    }
    if (name === "password" && value.length > 30) {
      setFormErrors({
        ...formErrors,
        password: "Password cannot be more than 30 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        password: "",
      });
    }
    if (name === "iec_code" && value.length > 50) {
      setFormErrors({
        ...formErrors,
        iec_code: "Iec Code cannot be more than 50 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        iec_code: "",
      });
    }
    if (name === "bank_name" && value.length > 70) {
      setFormErrors({
        ...formErrors,
        bank_name: "Bank Name cannot be more than 70 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        bank_name: "",
      });
    }
    if (name === "bank_account_number" && value.length > 40) {
      setFormErrors({
        ...formErrors,
        bank_account_number:
          "Bank Account Number cannot be more than 40 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        bank_account_number: "",
      });
    }
    if (name === "bank_branch_code" && value.length > 40) {
      setFormErrors({
        ...formErrors,
        bank_branch_code: "Bank Branch Code cannot be more than 40 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        bank_branch_code: "",
      });
    }
    if (name === "bank_address" && value.length > 200) {
      setFormErrors({
        ...formErrors,
        bank_address: "Bank Address cannot be more than 200 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        bank_address: "",
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const tabAction = tab => {
    if (activeTab !== tab && tab >= 1 && tab <= 5) {
      var newPassedSteps;
      if (tab === 5) {
        newPassedSteps = [];
        setPassedSteps([]);
      } else {
        newPassedSteps = [...passedSteps];
      }
      if (!newPassedSteps.includes(tab)) {
        newPassedSteps.push(tab);
      }
      setPassedSteps(newPassedSteps);
      setActiveTab(tab);
    }
  };
  const toggleTab = tab => {
    if (!Edit) {
      localStorage.setItem("customerData", JSON.stringify(formData));
    }
    if (activeTab !== tab && activeTab == 1) {
      if (!validateForm1()) {
        return;
      }
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 2 && tab == 1) {
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 2) {
      if (!validateForm2()) {
        return;
      }
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 3 && tab == 2) {
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 3) {
      if (!validateForm3()) {
        return;
      }
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 4 && tab == 3) {
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 4) {
      if (!validateForm4()) {
        return;
      }
      if (Edit) {
        //Edit  Customer Api Calling
        setLoading(true);
        const Id = Edit.id;
        const data = {
          formData,
          Id,
        };
        dispatch({
          type: UPDATE_CUSTOMERS_REQUEST,
          payload: data,
        });
      } else {
        //Add Customer Api Calling
        setLoading(true);
        const data = {
          formData,
        };
        dispatch({
          type: ADD_CUSTOMERS_REQUEST,
          payload: data,
        });
      }
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 5 && tab == 4) {
      tabAction(tab);
    }
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleEmailChange = event => {
    const { value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      email_id: value,
    }));
    if (!validateEmail(value)) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        email_id: "Please enter a valid email address.",
      }));
    } else {
      setFormErrors(prevErrors => {
        const { email_id, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const listState = async country_id => {
    const selectStateData = await getRelatedRecords(
      "states",
      "state_name_alias",
      "country_id",
      country_id
    );
    setOptionState(selectStateData?.getRelatedRecordsData);
  };

  useEffect(() => {
    const customerData = JSON.parse(localStorage.getItem("customerData"));
    const { editCustomer } = location.state || {};
    if (editCustomer) {
      setEdit(editCustomer);
      if (editCustomer?.country && editCustomer.state) {
        listState(editCustomer.country?.value);
      }
      //Edit section
      setFormData({
        customer_group_id: editCustomer?.customergroup.value || "",
        customer_code: editCustomer?.customer_code || "",
        account_group_id: editCustomer?.account_group.value || "",
        vendor_id: editCustomer?.vendor.value || "",
        ext_cust_cd_1: editCustomer?.ext_cust_cd_1 || "",
        ext_cust_cd_2: editCustomer?.ext_cust_cd_2 || "",
        ext_cust_cd_3: editCustomer?.ext_cust_cd_3 || "",
        customer_legal_entity: editCustomer?.customer_legal_entity || "",
        sales_organisation_id: editCustomer?.salesorg.value || "",
        distribution_channel_id: editCustomer?.distribution.value || "",
        division_id: editCustomer?.division.value || "",
        sales_office_id: editCustomer?.salesoffice.value || "",
        sales_group_id: editCustomer?.salesgroup.value || "",
        employee_id: editCustomer?.employee.value || "",
        previous_account_no: editCustomer?.previous_account_no || "",
        tan: editCustomer?.tan || "",
        tin: editCustomer?.tin || "",
        gstin: editCustomer?.gstin || "",
        cust_grp1: editCustomer?.cust_grp1.value || 0,
        cust_grp2: editCustomer?.cust_grp2.value || 0,
        cust_grp3: editCustomer?.cust_grp3.value || 0,
        cust_grp4: editCustomer?.cust_grp4.value || 0,
        cust_grp5: editCustomer?.cust_grp5.value || 0,
        cust_grp6: editCustomer?.cust_grp6.value || 0,
        cust_grp7: editCustomer?.cust_grp7.value || 0,
        tax_id_1: editCustomer?.tax_id_1 || "",
        tax_id_2: editCustomer?.tax_id_2 || "",
        tax_id_3: editCustomer?.tax_id_3 || "",
        tax_id_4: editCustomer?.tax_id_4 || "",
        tax_id_5: editCustomer?.tax_id_5 || "",
        delivery_plant1: editCustomer?.deliveryplant1.value || 0,
        delivery_plant2: editCustomer?.deliveryplant2 || 0,
        delivery_plant3: editCustomer?.deliveryplant3 || 0,
        title: editCustomer?.title || "",
        firstname: editCustomer?.firstname || "",
        lastname: editCustomer?.lastname || "",
        telephone: editCustomer?.telephone || "",
        mobile: editCustomer?.mobile || "",
        email_id: editCustomer?.email_id || "",
        password: editCustomer?.password || "",
        company_id: editCustomer?.company.value || "",
        valid_from: moment(editCustomer.valid_from).format("DD/MM/YYYY") || "",
        valid_to: moment(editCustomer.valid_to).format("DD/MM/YYYY") || "",
        swift_code: editCustomer?.swift_code || "",
        address_1: editCustomer?.address_1 || "",
        address_2: editCustomer?.address_2 || "",
        address_3: editCustomer?.address_3 || "",
        country_id: editCustomer?.country.value || "",
        state_id: editCustomer?.state.value || "",
        city: editCustomer?.city || "",
        pincode: editCustomer?.pincode || "",
        currency_id: editCustomer?.currency.value || "",
        delivery_block: editCustomer?.delivery_block || "",
        billing_block: editCustomer?.billing_block || "",
        pod_indicator: editCustomer?.pod_indicator || "",
        order_block: editCustomer?.order_block || "",
        deletion_indicator: editCustomer?.deletion_indicator || "",
        customer_classification: editCustomer?.customer_classification || "",
        gst_indicator: editCustomer?.gst_indicator || "",
        credit_block: editCustomer?.credit_block || "",
        revenue_indicator: editCustomer?.revenue_indicator || "",
        credit_limit_amount: editCustomer?.credit_limit_amount || "",
        payment_terms_id: editCustomer?.payment_term.value || "",
        sez_eou_dta: editCustomer?.sez_eou_dta.value || "",
        iec_code: editCustomer?.iec_code || "",
        inco_terms_id: editCustomer?.inco_term.value || "",
        inco_terms_desc_id: editCustomer?.inco_term_desc.value || "",
        iban_number: editCustomer?.iban_number || "",
        pan_number: editCustomer?.pan_number || "",
        text1: editCustomer?.text1 || "",
        text2: editCustomer?.text2 | "",
        text3: editCustomer?.text3 || "",
        text4: editCustomer?.text4 || "",
        text5: editCustomer?.text5 || "",
        bank_name: editCustomer?.bank_name || "",
        ifsc_code: editCustomer?.ifsc_code || "",
        bank_address: editCustomer?.bank_address || "",
        bank_account_number: editCustomer?.bank_account_number || "",
        bank_account_holdername: editCustomer?.bank_account_holdername || "",
        bank_branch_code: editCustomer?.bank_branch_code || "",
        gst_registration_type: editCustomer?.gst_registration_type || "",
        additional_gst_details: editCustomer?.additional_gst_details || false,
        place_of_supply: editCustomer?.place_of_supply || "",
        is_party_transporter: editCustomer?.is_party_transporter || "",
        transporter_id: editCustomer?.transporter_id || "",
      });
    } else {
      setEdit(null);
      //Add section localStorage Data
      if (customerData) {
        if (customerData.country_id && customerData.state_id) {
          listState(customerData.country_id);
        }
        setFormData({
          customer_group_id: customerData?.customer_group_id || "",
          customer_code: customerData?.customer_code || "",
          account_group_id: customerData?.account_group_id || "",
          vendor_id: customerData?.vendor_id || "",
          ext_cust_cd_1: customerData?.ext_cust_cd_1 || "",
          ext_cust_cd_2: customerData?.ext_cust_cd_2 || "",
          ext_cust_cd_3: customerData?.ext_cust_cd_3 || "",
          customer_legal_entity: customerData?.customer_legal_entity || "",
          sales_organisation_id: customerData?.sales_organisation_id || "",
          distribution_channel_id: customerData?.distribution_channel_id || "",
          division_id: customerData?.division_id || "",
          sales_office_id: customerData?.sales_office_id || "",
          sales_group_id: customerData?.sales_group_id || "",
          employee_id: customerData?.employee_id || "",
          previous_account_no: customerData?.previous_account_no || "",
          tan: customerData?.tan || "",
          tin: customerData?.tin || "",
          gstin: customerData?.gstin || "",
          cust_grp1: customerData?.cust_grp1 || 0,
          cust_grp2: customerData?.cust_grp2 || 0,
          cust_grp3: customerData?.cust_grp3 || 0,
          cust_grp4: customerData?.cust_grp4 || 0,
          cust_grp5: customerData?.cust_grp5 || 0,
          cust_grp6: customerData?.cust_grp6 || 0,
          cust_grp7: customerData?.cust_grp7 || 0,
          tax_id_1: customerData?.tax_id_1 || "",
          tax_id_2: customerData?.tax_id_2 || "",
          tax_id_3: customerData?.tax_id_3 || "",
          tax_id_4: customerData?.tax_id_4 || "",
          tax_id_5: customerData?.tax_id_5 || "",
          delivery_plant1: customerData?.delivery_plant1 || 0,
          delivery_plant2: customerData?.delivery_plant2 || 0,
          delivery_plant3: customerData?.delivery_plant3 || 0,
          title: customerData?.title || "",
          firstname: customerData?.firstname || "",
          lastname: customerData?.lastname || "",
          telephone: customerData?.telephone || "",
          mobile: customerData?.mobile || "",
          email_id: customerData?.email_id || "",
          password: customerData?.password || "",
          company_id: customerData?.company_id || "",
          valid_from: customerData?.valid_from || "",
          valid_to: customerData?.valid_to || "",
          swift_code: customerData?.swift_code || "",
          address_1: customerData?.address_1 || "",
          address_2: customerData?.address_2 || "",
          address_3: customerData?.address_3 || "",
          country_id: customerData?.country_id || "",
          state_id: customerData?.state_id || "",
          city: customerData?.city || "",
          pincode: customerData?.pincode || "",
          currency_id: customerData?.currency_id || "",
          delivery_block: customerData?.delivery_block || "",
          billing_block: customerData?.billing_block || "",
          pod_indicator: customerData?.pod_indicator || "",
          order_block: customerData?.order_block || "",
          deletion_indicator: customerData?.deletion_indicator || "",
          credit_block: customerData?.credit_block || "",
          customer_classification: customerData?.customer_classification || "",
          gst_indicator: customerData?.gst_indicator || "",
          revenue_indicator: customerData?.revenue_indicator || "",
          credit_limit_amount: customerData?.credit_limit_amount || "",
          payment_terms_id: customerData?.payment_terms_id || "",
          sez_eou_dta: customerData?.sez_eou_dta || "",
          iec_code: customerData?.iec_code || "",
          inco_terms_id: customerData?.inco_terms_id || "",
          inco_terms_desc_id: customerData?.inco_terms_desc_id || "",
          iban_number: customerData?.iban_number || "",
          pan_number: customerData?.pan_number || "",
          text1: customerData?.text1 || "",
          text2: customerData?.text2 | "",
          text3: customerData?.text3 || "",
          text4: customerData?.text4 || "",
          text5: customerData?.text5 || "",
          bank_name: customerData?.bank_name || "",
          ifsc_code: customerData?.ifsc_code || "",
          bank_address: customerData?.bank_address || "",
          bank_account_number: customerData?.bank_account_number || "",
          bank_account_holdername: customerData?.bank_account_holdername || "",
          bank_branch_code: customerData?.bank_branch_code || "",
          gst_registration_type: customerData?.gst_registration_type || "",
          additional_gst_details: customerData?.additional_gst_details || false,
          place_of_supply: customerData?.place_of_supply || "",
          is_party_transporter: customerData?.is_party_transporter || "",
          transporter_id: customerData?.transporter_id || "",
        });
      }
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: GET_CUSTOMERS_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (addcustomers?.success === true) {
      setLoading(false);
      setToastMessage("Customer Added Successfully");
      localStorage.removeItem("customerData");
    }
    if (updatecustomers?.success === true) {
      setLoading(false);
      setToastMessage("Customer Updated Successfully");
    }
    if (listCustomer) {
      if (customers && customers?.account_groups) {
        setOptionCustomerGroup(customers?.customer_group);
        setOptionAccountGrp(customers?.account_groups);
        setOptionVendorCode(customers?.vendors);
        setOptionSalesOrganisation(customers?.sales_organisations);
        setOptionDivision(customers?.divisions);
        setOptionDistributionChannel(customers?.distributions);
        setOptionSalesoptionSalesOffice(customers?.sales_offices);
        setOptionSalesoptionSalesGroup(customers?.sales_groups);
        setOptionCustomerGrp(customers?.customer_group);
        setOptionEmployeeCode(customers?.employees);
        setOptionDeliveryPlant(customers?.deliveryplant);
        setOptionCompany(customers?.companies);
        setOptionCountry(customers?.countries);
        setOptionState(customers?.states);
        setOptionCurrency(customers?.currencies);
        setOptionPaymentTerms(customers?.payment_terms);
        setOptionIncoTerms(customers?.inco_terms);
        setOptionIncoTermsDesc(customers?.inco_terms_desc);
        setOptionSezEouDta(customers?.sez_eou_dta);
      }
    }
  }, [listCustomer, addcustomers, updatecustomers, customers]);

  useEffect(() => {
    if (activeTab === 5) {
      const timer = setTimeout(() => {
        history.push("/customers/customers");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeTab, history]);

  const handleAddRowNestedEXt = () => {
    if (extCustCode.length < 2) {
      const newItem = { name1: "" };
      setExtCustCode([...extCustCode, newItem]);
    }
  };

  const handleRemoveRowNestedExt = idx => {
    setFormData(prevData => ({
      ...prevData,
      ["ext_cust_cd_" + (idx + 2)]: "",
    }));
    const updatedRows = [...extCustCode];
    updatedRows.splice(idx, 1);
    setExtCustCode(updatedRows);
  };

  const handleAddRowNestedCustgrp = () => {
    if (extCustGrp.length < 6) {
      const newItem = { name1: "" };
      setExtCustGrp([...extCustGrp, newItem]);
    }
  };

  const handleRemoveRowNestedCustgrp = idx => {
    setFormData(prevData => ({
      ...prevData,
      ["cust_grp" + (idx + 2)]: "",
    }));
    const updatedRows = [...extCustGrp];
    updatedRows.splice(idx, 1);
    setExtCustGrp(updatedRows);
  };
  const handleAddRowNestedPlant = () => {
    if (deliveryPlant.length < 2) {
      const newItem = { name1: "" };
      setDeliveryPlant([...deliveryPlant, newItem]);
    }
  };

  const handleRemoveRowNestedPlant = idx => {
    setFormData(prevData => ({
      ...prevData,
      ["delivery_plant" + (idx + 2)]: "",
    }));
    const updatedRows = [...deliveryPlant];
    updatedRows.splice(idx, 1);
    setDeliveryPlant(updatedRows);
  };

  const handleAddRowNestedAddress = () => {
    if (address.length < 2) {
      const newItem = { name1: "" };
      setAddress([...address, newItem]);
    }
  };
  const handleRemoveRowNestedAddress = idx => {
    setFormData(prevData => ({
      ...prevData,
      ["address_" + (idx + 2)]: "",
    }));
    const updatedRows = [...address];
    updatedRows.splice(idx, 1);
    setAddress(updatedRows);
  };

  const handleAddRowNestedTax = () => {
    if (taxId.length < 4) {
      const newItem = { name1: "" };
      setTaxID([...taxId, newItem]);
    }
  };
  const handleRemoveRowNestedTax = idx => {
    setFormData(prevData => ({
      ...prevData,
      ["tax_id_" + (idx + 2)]: "",
    }));
    const updatedRows = [...taxId];
    updatedRows.splice(idx, 1);
    setTaxID(updatedRows);
  };

  const handleAddRowNestedText = () => {
    if (textId.length < 4) {
      const newItem = { name1: "" };
      setTextID([...textId, newItem]);
    }
  };
  const handleRemoveRowNestedText = idx => {
    setFormData(prevData => ({
      ...prevData,
      ["text" + (idx + 2)]: "",
    }));
    const updatedRows = [...textId];
    updatedRows.splice(idx, 1);
    setTextID(updatedRows);
  };

  document.title = "Detergent | Add Customers";
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          {toast && (
            <div
              className="position-fixed top-0 end-0 p-3"
              style={{ zIndex: "1005" }}
            >
              <Alert color="success" role="alert">
                {toastMessage}
              </Alert>
            </div>
          )}
          <Breadcrumbs
            titlePath="/customers/customers"
            title="Customers"
            breadcrumbItem="Add Customers"
          />
          <Card>
          <CardBody>
            {loading ? (
              <Loader />
            ) : (
              <Row>
                <Col lg="12">
                  {/* <Card> */}
                  <CardBody>
                    <div className="wizard clearfix">
                      <div className="custom-tabs-wrapper">
                        <ul className="custom-tab-nav">
                          {[
                            { id: 1, label: " Details" },
                            { id: 2, label: " Basic Details" },
                            { id: 3, label: "Tax Registration Details" },
                            { id: 4, label: "Bank Details" },
                            { id: 5, label: "Confirm Detail" },
                          ].map((tab, index) => (
                            <li key={tab.id} className="custom-tab-item">
                              <button
                                className={`custom-tab-link ${
                                  activeTab === tab.id ? "active" : ""
                                }`}
                                onClick={() => {
                                  if (
                                    tab.id === 1 ||
                                    passedSteps.includes(tab.id)
                                  ) {
                                    toggleTab(tab.id);
                                  }
                                }}
                                disabled={
                                  tab.id !== 1 && !passedSteps.includes(tab.id)
                                }
                              >
                                <span className="tab-index">{index + 1}</span>
                                {tab.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="content clearfix">
                        <TabContent activeTab={activeTab} className="body">
                          <TabPane tabId={1}>
                            <Form>
                              <Row>
                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <input
                                      value={formData?.customer_code}
                                      type="text"
                                      className="form-control"
                                      id="customer_code"
                                      name="customer_code"
                                      placeholder="Enter Employee Code"
                                      onChange={handleChange}
                                    />
                                    <label htmlFor="customer_code">
                                      Customer Code
                                    </label>
                                    {formErrors.customer_code && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.customer_code}
                                      </div>
                                    )}
                                  </div>
                                </Col>

                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <select
                                      value={formData?.customer_group_id}
                                      onChange={async event => {
                                        const selectedOption =
                                          optionCustomerGroup?.find(
                                            option =>
                                              option.value == event.target.value
                                          );
                                        setFormData(prevData => ({
                                          ...prevData,
                                          customer_group_id:
                                            selectedOption?.value,
                                        }));
                                      }}
                                      className="form-select"
                                    >
                                      <option value="0">
                                        Select Customer Group
                                      </option>
                                      {optionCustomerGroup?.map(option => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                    <label htmlFor="customer_group_id">
                                      Customer Group
                                    </label>
                                    {formErrors.customer_group_id && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.customer_group_id}
                                      </div>
                                    )}
                                  </div>
                                </Col>
                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <select
                                      className="form-select"
                                      value={formData?.account_group_id}
                                      onChange={async event => {
                                        const selectedOption =
                                          optionAccountGrp.find(
                                            option =>
                                              option.value == event.target.value
                                          );
                                        setFormData(prevData => ({
                                          ...prevData,
                                          account_group_id:
                                            selectedOption?.value,
                                        }));
                                      }}
                                    >
                                      <option value="0">
                                        Select Account Group
                                      </option>
                                      {optionAccountGrp.map(option => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                    <label htmlFor="account_group_id">
                                      Account Group
                                    </label>
                                    {formErrors.account_group_id && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.account_group_id}
                                      </div>
                                    )}
                                  </div>
                                </Col>

                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <select
                                      value={formData?.vendor_id}
                                      onChange={async event => {
                                        const selectedOption =
                                          optionVendorCode.find(
                                            option =>
                                              option.value == event.target.value
                                          );
                                        setFormData(prevData => ({
                                          ...prevData,
                                          vendor_id: selectedOption?.value,
                                        }));
                                      }}
                                      className="form-select"
                                    >
                                      <option value="0">
                                        Select Vendor Code
                                      </option>
                                      {optionVendorCode.map(option => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                    <label htmlFor="vendor_id">
                                      Vendor Code
                                    </label>
                                    {formErrors.vendor_id && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.vendor_id}
                                      </div>
                                    )}
                                  </div>
                                </Col>

                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="previous_account_no"
                                      name="previous_account_no"
                                      placeholder="Enter Previous Account Number"
                                      value={formData?.previous_account_no}
                                      onChange={handleChange}
                                    />
                                    <label htmlFor="previous_account_no">
                                      Previous Account Number
                                    </label>
                                    {formErrors.previous_account_no && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.previous_account_no}
                                      </div>
                                    )}
                                  </div>
                                </Col>
                                {/* {extCustCode.map((item1, idx) => (
                                      <>
                                        <Col lg="2">
                                          <tr id={"nested" + idx} key={idx}>
                                            <td>
                                              <div className="form-floating mb-3">
                                                <Input
                                                  type="text"
                                                  className="inner form-control"
                                                  placeholder={
                                                    `Ext Cust Code ${idx + 2}`
                                                  }
                                                  onChange={event => {
                                                    setFormData(prevData => ({
                                                      ...prevData,
                                                      [`ext_cust_cd_ ${idx + 2}`]:
                                                        event.target.value,
                                                    }));
                                                  }}
                                                  value={
                                                    formData?.[
                                                    `ext_cust_cd_ ${idx + 2}`
                                                    ]
                                                  }
                                                />
                                                <label htmlFor={`ext_cust_cd_ ${idx + 2}`}>
                                                  {`ext cust cd ${idx + 2}`}
                                                </label>
                                                {formErrors?.[`ext_cust_cd_ ${idx + 2}`] && (
                                                  <div
                                                    style={{
                                                      color: "#f46a6a",
                                                      fontSize: "80%",
                                                    }}
                                                  >
                                                    {formErrors?.[`ext_cust_cd_ ${idx + 2}`]}
                                                  </div>
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        </Col>
                                        <Col lg="1">
                                          <Button
                                            onClick={() =>
                                              handleRemoveRowNestedExt(idx)
                                            }
                                            color="danger"
                                            className="btn-block inner"
                                            style={{ width: "100%" }}
                                          >
                                            Delete
                                          </Button>
                                        </Col>
                                      </>
                                    ))} */}

                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="customer_legal_entity"
                                      placeholder="Legal Entity Name"
                                      value={formData?.customer_legal_entity}
                                      onChange={event => {
                                        setFormData(prevData => ({
                                          ...prevData,
                                          customer_legal_entity:
                                            event.target.value,
                                        }));
                                      }}
                                    />
                                    <label htmlFor="customer_legal_entity">
                                      Legal Entity Name
                                    </label>
                                    {formErrors.customer_legal_entity && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.customer_legal_entity}
                                      </div>
                                    )}
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <select
                                      value={formData?.sales_organisation_id}
                                      onChange={async event => {
                                        const selectedOption =
                                          optionSalesOrganisation.find(
                                            option =>
                                              option.value == event.target.value
                                          );
                                        setFormData(prevData => ({
                                          ...prevData,
                                          sales_organisation_id:
                                            selectedOption?.value,
                                        }));
                                      }}
                                      className="form-select"
                                    >
                                      <option value="0">
                                        Select Sales Organisation
                                      </option>
                                      {optionSalesOrganisation.map(option => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                    <label htmlFor="sales_organisation_id">
                                      Sales Organisation
                                    </label>
                                    {formErrors.sales_organisation_id && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.sales_organisation_id}
                                      </div>
                                    )}
                                  </div>
                                </Col>
                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <select
                                      value={formData?.division_id}
                                      onChange={async event => {
                                        const selectedOption =
                                          optionDivision.find(
                                            option =>
                                              option.value == event.target.value
                                          );
                                        setFormData(prevData => ({
                                          ...prevData,
                                          division_id: selectedOption?.value,
                                        }));
                                      }}
                                      className="form-select"
                                    >
                                      <option value="0">Select Division</option>
                                      {optionDivision.map(option => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                    <label htmlFor="division_id">
                                      Division
                                    </label>
                                    {formErrors.division_id && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.division_id}
                                      </div>
                                    )}
                                  </div>
                                </Col>
                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <select
                                      value={formData?.distribution_channel_id}
                                      onChange={async event => {
                                        const selectedOption =
                                          optionDistributionChannel.find(
                                            option =>
                                              option.value == event.target.value
                                          );
                                        setFormData(prevData => ({
                                          ...prevData,
                                          distribution_channel_id:
                                            selectedOption?.value,
                                        }));
                                      }}
                                      className="form-select"
                                    >
                                      <option value="0">
                                        Select Distribution Channel
                                      </option>
                                      {optionDistributionChannel.map(option => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                    <label htmlFor="distribution_channel_id">
                                      Distribution Channel
                                    </label>
                                    {formErrors.distribution_channel_id && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.distribution_channel_id}
                                      </div>
                                    )}
                                  </div>
                                </Col>

                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <select
                                      value={formData?.sales_office_id}
                                      onChange={async event => {
                                        const selectedOption =
                                          optionSalesOffice.find(
                                            option =>
                                              option.value == event.target.value
                                          );
                                        setFormData(prevData => ({
                                          ...prevData,
                                          sales_office_id:
                                            selectedOption?.value,
                                        }));
                                      }}
                                      className="form-select"
                                    >
                                      <option value="0">
                                        Select Sales Office
                                      </option>
                                      {optionSalesOffice.map(option => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                    <label htmlFor="sales_office_id">
                                      Sales Office
                                    </label>
                                    {formErrors.sales_office_id && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.sales_office_id}
                                      </div>
                                    )}
                                  </div>
                                </Col>
                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <select
                                      value={formData?.sales_group_id}
                                      onChange={async event => {
                                        const selectedOption =
                                          optionSalesGroup.find(
                                            option =>
                                              option.value == event.target.value
                                          );
                                        setFormData(prevData => ({
                                          ...prevData,
                                          sales_group_id: selectedOption?.value,
                                        }));
                                      }}
                                      className="form-select"
                                    >
                                      <option value="0">
                                        Select Sales Group
                                      </option>
                                      {optionSalesGroup.map(option => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                    <label htmlFor="sales_group_id">
                                      Sales Group
                                    </label>
                                    {formErrors.sales_group_id && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.sales_group_id}
                                      </div>
                                    )}
                                  </div>
                                </Col>
                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <select
                                      value={formData?.employee_id}
                                      onChange={async event => {
                                        const selectedOption =
                                          optionEmployeeCode.find(
                                            option =>
                                              option.value == event.target.value
                                          );
                                        setFormData(prevData => ({
                                          ...prevData,
                                          employee_id: selectedOption?.value,
                                        }));
                                      }}
                                      className="form-select"
                                    >
                                      <option value="0">
                                        Select Employee Code
                                      </option>
                                      {optionEmployeeCode.map(option => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                    <label htmlFor="employee_id">
                                      Employee Code
                                    </label>
                                    {formErrors.employee_id && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.employee_id}
                                      </div>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="tan"
                                      name="tan"
                                      placeholder="Enter TAN"
                                      value={formData?.tan}
                                      onChange={handleChange}
                                    />
                                    <label htmlFor="bank_name">TAN</label>
                                    {formErrors.tan && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.tan}
                                      </div>
                                    )}
                                  </div>
                                </Col>
                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="tin"
                                      name="tin"
                                      placeholder="Enter TIN"
                                      value={formData?.tin}
                                      onChange={handleChange}
                                    />
                                    <label htmlFor="bank_name">TIN</label>
                                    {formErrors.tin && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.tin}
                                      </div>
                                    )}
                                  </div>
                                </Col>

                                <Col lg="1">
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className="inner form-control"
                                      placeholder="Ext Cust Code1"
                                      onChange={event => {
                                        setFormData(prevData => ({
                                          ...prevData,
                                          ext_cust_cd_1: event.target.value,
                                        }));
                                      }}
                                      value={formData?.ext_cust_cd_1}
                                    />
                                    <label htmlFor="ext_cust_cd_1">
                                      Ext Cust Code1
                                    </label>
                                    {formErrors.ext_cust_cd_1 && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.ext_cust_cd_1}
                                      </div>
                                    )}
                                  </div>
                                </Col>
                                <Col lg="1">
                                  <Button
                                    onClick={handleAddRowNestedEXt}
                                    color="primary"
                                  >
                                    Add
                                  </Button>
                                </Col>
                                {extCustCode.map((item1, idx) => (
                                  <>
                                    <Col lg="2">
                                      <tr id={"nested" + idx} key={idx}>
                                        <td>
                                          <div className="form-floating mb-3">
                                            <Input
                                              type="text"
                                              className="inner form-control"
                                              placeholder={`Ext Cust Code ${
                                                idx + 2
                                              }`}
                                              onChange={event => {
                                                setFormData(prevData => ({
                                                  ...prevData,
                                                  [`ext_cust_cd_ ${idx + 2}`]:
                                                    event.target.value,
                                                }));
                                              }}
                                              value={
                                                formData?.[
                                                  `ext_cust_cd_ ${idx + 2}`
                                                ]
                                              }
                                            />
                                            <label
                                              htmlFor={`ext_cust_cd_ ${
                                                idx + 2
                                              }`}
                                            >
                                              {`ext cust cd ${idx + 2}`}
                                            </label>
                                            {formErrors?.[
                                              `ext_cust_cd_ ${idx + 2}`
                                            ] && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {
                                                  formErrors?.[
                                                    `ext_cust_cd_ ${idx + 2}`
                                                  ]
                                                }
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    </Col>
                                    <Col lg="1">
                                      <Button
                                        onClick={() =>
                                          handleRemoveRowNestedExt(idx)
                                        }
                                        color="danger"
                                        className="btn-block inner"
                                        style={{ width: "100%" }}
                                      >
                                        Delete
                                      </Button>
                                    </Col>
                                  </>
                                ))}

                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <select
                                      value={formData?.cust_grp1}
                                      onChange={async event => {
                                        const selectedOption =
                                          optionCustomerGrp.find(
                                            option =>
                                              option.value == event.target.value
                                          );
                                        setFormData(prevData => ({
                                          ...prevData,
                                          cust_grp1: selectedOption?.value,
                                        }));
                                      }}
                                      className="form-select"
                                    >
                                      <option value="0">
                                        Select CustomerGroup
                                      </option>
                                      {optionCustomerGrp.map(option => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                    <label htmlFor="cust_grp1">
                                      Customer Group1
                                    </label>
                                    {formErrors.cust_grp1 && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.cust_grp1}
                                      </div>
                                    )}
                                  </div>
                                </Col>
                                <Col lg="1">
                                  <Button
                                    onClick={handleAddRowNestedCustgrp}
                                    color="primary"
                                  >
                                    Add
                                  </Button>
                                </Col>
                                {extCustGrp.map((item1, idx) => (
                                  <>
                                    <Col lg="1">
                                      <tr id={"nested" + idx} key={idx}>
                                        <td>
                                          <div className="form-floating mb-3">
                                            <select
                                              value={
                                                formData?.[
                                                  `cust_grp ${idx + 2}`
                                                ]
                                              }
                                              onChange={async event => {
                                                const selectedOption =
                                                  optionCustomerGrp.find(
                                                    option =>
                                                      option.value ==
                                                      event.target.value
                                                  );
                                                setFormData(prevData => ({
                                                  ...prevData,
                                                  [`cust_grp ${idx + 2}`]:
                                                    selectedOption?.value,
                                                }));
                                              }}
                                              className="form-select"
                                            >
                                              <option value="0">
                                                Select CustomerGroup
                                              </option>
                                              {optionCustomerGrp.map(option => (
                                                <option
                                                  key={option.value}
                                                  value={option.value}
                                                >
                                                  {option.label}
                                                </option>
                                              ))}
                                            </select>
                                            <label
                                              htmlFor={`cust_grp ${idx + 2}`}
                                            >
                                              {`Customer Group ${idx + 2}`}
                                            </label>
                                            {/* Validation Error Display */}
                                            {formErrors[
                                              `cust_grp ${idx + 2}`
                                            ] && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {
                                                  formErrors[
                                                    `cust_grp ${idx + 2}`
                                                  ]
                                                }
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    </Col>
                                    <Col lg="1">
                                      <Button
                                        onClick={() =>
                                          handleRemoveRowNestedCustgrp(idx)
                                        }
                                        color="danger"
                                        className="btn-block inner"
                                        style={{ width: "100%" }}
                                      >
                                        Delete
                                      </Button>
                                    </Col>
                                  </>
                                ))}

                                <Col lg="2">
                                  <div className="form-floating mb-3">
                                    <select
                                      value={formData?.delivery_plant1}
                                      onChange={async event => {
                                        const selectedOption =
                                          optionDeliveryPlant.find(
                                            option =>
                                              option.value == event.target.value
                                          );
                                        setFormData(prevData => ({
                                          ...prevData,
                                          delivery_plant1:
                                            selectedOption?.value,
                                        }));
                                      }}
                                      className="form-select"
                                    >
                                      <option value="0">
                                        Select Delivery Plant
                                      </option>
                                      {optionDeliveryPlant?.map(option => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                    <label htmlFor="delivery_plant1">
                                      Delivery Plant 1
                                    </label>
                                    {formErrors.delivery_plant1 && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors.delivery_plant1}
                                      </div>
                                    )}
                                  </div>
                                </Col>
                                <Col lg="1">
                                  <Button
                                    onClick={handleAddRowNestedPlant}
                                    color="primary"
                                  >
                                    Add
                                  </Button>
                                </Col>
                                {deliveryPlant.map((item1, idx) => (
                                  <>
                                    <Col lg="3">
                                      <tr id={"nested" + idx} key={idx}>
                                        <td>
                                          <div className="form-floating mb-3">
                                            <select
                                              value={
                                                formData?.[
                                                  `delivery_plant ${idx + 2}`
                                                ]
                                              }
                                              onChange={async event => {
                                                const selectedOption =
                                                  optionDeliveryPlant.find(
                                                    option =>
                                                      option.value ==
                                                      event.target.value
                                                  );
                                                setFormData(prevData => ({
                                                  ...prevData,
                                                  [`delivery_plant ${idx + 2}`]:
                                                    selectedOption?.value,
                                                }));
                                              }}
                                              className="form-select"
                                            >
                                              <option value="0">
                                                Select Delivery Plant
                                              </option>
                                              {optionDeliveryPlant.map(
                                                option => (
                                                  <option
                                                    key={option.value}
                                                    value={option.value}
                                                  >
                                                    {option.label}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                            <label
                                              htmlFor={`delivery_plant ${
                                                idx + 2
                                              }`}
                                            >
                                              {`delivery_plant ${idx + 2}`}
                                            </label>
                                            {/* Validation Error Display */}
                                            {formErrors[
                                              `delivery_plant ${idx + 2}`
                                            ] && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {
                                                  formErrors[
                                                    `delivery_plant ${idx + 2}`
                                                  ]
                                                }
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    </Col>
                                    <Col lg="1">
                                      <Button
                                        onClick={() =>
                                          handleRemoveRowNestedPlant(idx)
                                        }
                                        color="danger"
                                        className="btn-block inner"
                                        style={{ width: "100%" }}
                                      >
                                        Delete
                                      </Button>
                                    </Col>
                                  </>
                                ))}
                              </Row>
                            </Form>
                          </TabPane>
                          <TabPane tabId={2}>
                            <div>
                              <Form>
                                <Row>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <select
                                        className="form-select"
                                        value={formData?.title}
                                        onChange={async event => {
                                          const selectedOption =
                                            optionTitle.find(
                                              option =>
                                                option.value ==
                                                event.target.value
                                            );
                                          setFormData(prevData => ({
                                            ...prevData,
                                            title: selectedOption?.value,
                                          }));
                                        }}
                                      >
                                        <option value="0">
                                          Select Select Title
                                        </option>
                                        {optionTitle.map(option => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                      <label htmlFor="title">Title</label>
                                      {formErrors.title && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.title}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="firstname"
                                        name="firstname"
                                        placeholder="Enter First Name"
                                        onChange={handleChange}
                                        value={formData?.firstname}
                                      />
                                      <label htmlFor="firstname">
                                        First Name
                                      </label>
                                      {formErrors.firstname && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.firstname}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="lastname"
                                        name="lastname"
                                        placeholder="Enter Last Name"
                                        onChange={handleChange}
                                        value={formData?.lastname}
                                      />
                                      <label htmlFor="lastname">
                                        Last Name
                                      </label>
                                      {formErrors.lastname && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.lastname}
                                        </div>
                                      )}
                                    </div>
                                  </Col>

                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="number"
                                        className="form-control"
                                        id="mobile"
                                        name="mobile"
                                        placeholder="Enter Mobile"
                                        value={formData?.mobile}
                                        onChange={handleChange}
                                      />
                                      <label htmlFor="mobile">Mobile</label>
                                      {formErrors.mobile && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.mobile}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="email"
                                        className="form-control"
                                        id="email_id"
                                        placeholder="Enter Email"
                                        onChange={handleEmailChange}
                                        value={formData?.email_id}
                                      />
                                      <label htmlFor="email_id">Email</label>
                                      {formErrors.email_id && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.email_id}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        placeholder="Enter Password"
                                        onChange={handleChange}
                                        value={formData?.password}
                                      />
                                      <label htmlFor="password">Password</label>
                                      {formErrors.password && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.password}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="number"
                                        className="form-control"
                                        id="telephone"
                                        name="telephone"
                                        placeholder="Enter Telephone"
                                        value={formData?.telephone}
                                        onChange={handleChange}
                                      />
                                      <label htmlFor="telephone">
                                        Telephone
                                      </label>
                                      {formErrors.telephone && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.telephone}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <Flatpickr
                                        placeholder="dd M, yyyy"
                                        options={{
                                          altInput: true,
                                          altFormat: "j F, Y",
                                          dateFormat: "Y-m-d",
                                          minDate: "today",
                                        }}
                                        onChange={(
                                          selectedDates,
                                          dateStr,
                                          instance
                                        ) => {
                                          const selectedDate = moment(
                                            selectedDates[0]
                                          ).format("DD/MM/YYYY");
                                          setFormData(prevData => ({
                                            ...prevData,
                                            valid_from: selectedDate,
                                          }));

                                          // Clear valid_to error if it now becomes valid
                                          if (
                                            formData.valid_to &&
                                            moment(
                                              selectedDate,
                                              "DD/MM/YYYY"
                                            ).isAfter(
                                              moment(
                                                formData.valid_to,
                                                "DD/MM/YYYY"
                                              )
                                            )
                                          ) {
                                            setFormErrors(prevErrors => ({
                                              ...prevErrors,
                                              valid_to:
                                                "Valid To date should be after Valid From date",
                                            }));
                                          } else {
                                            setFormErrors(prevErrors => ({
                                              ...prevErrors,
                                              valid_to: null,
                                            }));
                                          }
                                        }}
                                        value={moment(
                                          formData?.valid_from,
                                          "DD/MM/YYYY"
                                        ).toDate()}
                                      />
                                      <label htmlFor="valid_from">
                                        Valid From
                                      </label>
                                      {formErrors.valid_from && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.valid_from}
                                        </div>
                                      )}
                                    </div>
                                  </Col>

                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <Flatpickr
                                        placeholder="dd M, yyyy"
                                        options={{
                                          altInput: true,
                                          altFormat: "j F, Y",
                                          dateFormat: "Y-m-d",
                                          minDate: "today",
                                        }}
                                        onChange={(
                                          selectedDates,
                                          dateStr,
                                          instance
                                        ) => {
                                          const selectedDate = moment(
                                            selectedDates[0]
                                          ).format("DD/MM/YYYY");

                                          if (
                                            moment(
                                              selectedDate,
                                              "DD/MM/YYYY"
                                            ).isBefore(
                                              moment(
                                                formData.valid_from,
                                                "DD/MM/YYYY"
                                              )
                                            )
                                          ) {
                                            setFormErrors(prevErrors => ({
                                              ...prevErrors,
                                              valid_to:
                                                "Valid To date should be after Valid From date",
                                            }));
                                          } else {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              valid_to: selectedDate,
                                            }));
                                            setFormErrors(prevErrors => ({
                                              ...prevErrors,
                                              valid_to: null,
                                            }));
                                          }
                                        }}
                                        value={moment(
                                          formData?.valid_to,
                                          "DD/MM/YYYY"
                                        ).toDate()}
                                      />
                                      <label htmlFor="valid_to">Valid To</label>
                                      {formErrors.valid_to && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.valid_to}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="swift_code"
                                        name="swift_code"
                                        placeholder="Enter Swift Code"
                                        onChange={handleChange}
                                        value={formData?.swift_code}
                                      />
                                      <label htmlFor="swift_code">
                                        Swift Code
                                      </label>
                                      {formErrors.swift_code && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.swift_code}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <select
                                        value={formData?.currency_id}
                                        onChange={async event => {
                                          const selectedOption =
                                            optionCurrency.find(
                                              option =>
                                                option.value ==
                                                event.target.value
                                            );
                                          setFormData(prevData => ({
                                            ...prevData,
                                            currency_id: selectedOption?.value,
                                          }));
                                        }}
                                        className="form-select"
                                      >
                                        <option value="0">
                                          Select Currency
                                        </option>
                                        {optionCurrency.map(option => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                      <label htmlFor="currency_id">
                                        Currency
                                      </label>
                                      {formErrors.currency_id && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.currency_id}
                                        </div>
                                      )}
                                    </div>
                                  </Col>

                                  <Col lg="2">
                                    <Row>
                                      <div className="form-floating mb-1">
                                        <div className="form-check mb-1">
                                          <input
                                            type="checkbox"
                                            className="form-check-input input-mini"
                                            id="revenue_indicator"
                                            checked={formData.revenue_indicator}
                                            onChange={event => {
                                              setFormData(prevData => ({
                                                ...prevData,
                                                revenue_indicator:
                                                  event.target.checked,
                                              }));
                                            }}
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor="revenue_indicator"
                                          >
                                            Revenue Indicator
                                          </label>
                                          {formErrors.revenue_indicator && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.revenue_indicator}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </Row>
                                    <Col>
                                      <Row>
                                        <div className="form-floating mb-3">
                                          <div className="form-check mb-3">
                                            <input
                                              type="checkbox"
                                              className="form-check-input input-mini"
                                              id="gst_indicator"
                                              checked={formData.gst_indicator}
                                              onChange={event => {
                                                setFormData(prevData => ({
                                                  ...prevData,
                                                  gst_indicator:
                                                    event.target.checked,
                                                }));
                                              }}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor="gst_indicator"
                                            >
                                              GST Indicator
                                            </label>
                                            {formErrors.gst_indicator && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {formErrors.gst_indicator}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </Row>
                                    </Col>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <Input
                                        type="text"
                                        className="inner form-control"
                                        placeholder="Address 1"
                                        onChange={event => {
                                          setFormData(prevData => ({
                                            ...prevData,
                                            address_1: event.target.value,
                                          }));
                                        }}
                                        value={formData?.address_1}
                                      />
                                      <label htmlFor="address_1">Address</label>
                                      {formErrors.address_1 && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.address_1}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="1">
                                    <Button
                                      onClick={handleAddRowNestedAddress}
                                      color="primary"
                                    >
                                      Add
                                    </Button>
                                  </Col>
                                  {address.map((item1, idx) => (
                                    <>
                                      <Col lg="2">
                                        <tr id={"nested" + idx} key={idx}>
                                          <td>
                                            <div className="form-floating mb-3">
                                              <Input
                                                type="text"
                                                className="inner form-control"
                                                placeholder={`Address  ${
                                                  idx + 2
                                                }`}
                                                onChange={event => {
                                                  setFormData(prevData => ({
                                                    ...prevData,
                                                    [`address_ ${idx + 2}`]:
                                                      event.target.value,
                                                  }));
                                                }}
                                                value={
                                                  formData?.[
                                                    `address_ ${idx + 2}`
                                                  ]
                                                }
                                              />
                                              <label
                                                htmlFor={`address_ ${idx + 2}`}
                                              >
                                                {`Address ${idx + 2}`}
                                              </label>
                                              {formErrors?.[
                                                `address_ ${idx + 2}`
                                              ] && (
                                                <div
                                                  style={{
                                                    color: "#f46a6a",
                                                    fontSize: "80%",
                                                  }}
                                                >
                                                  {
                                                    formErrors?.[
                                                      `address_ ${idx + 2}`
                                                    ]
                                                  }
                                                </div>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      </Col>
                                      <Col lg="1">
                                        <Button
                                          onClick={() =>
                                            handleRemoveRowNestedAddress(idx)
                                          }
                                          color="danger"
                                          className="btn-block inner"
                                          style={{ width: "100%" }}
                                        >
                                          Delete
                                        </Button>
                                      </Col>
                                    </>
                                  ))}

                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <select
                                        value={formData?.country_id}
                                        onChange={async event => {
                                          const selectedOption =
                                            optionCountry.find(
                                              option =>
                                                option.value ==
                                                event.target.value
                                            );
                                          setFormData(prevData => ({
                                            ...prevData,
                                            country_id: selectedOption?.value,
                                          }));
                                        }}
                                        className="form-select"
                                      >
                                        <option value="0">
                                          Select Country
                                        </option>
                                        {optionCountry.map(option => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                      <label htmlFor="country_id">
                                        Country
                                      </label>
                                      {formErrors.country_id && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.country_id}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <select
                                        value={formData?.state_id}
                                        onChange={async event => {
                                          const selectedOption =
                                            optionState.find(
                                              option =>
                                                option.value ==
                                                event.target.value
                                            );
                                          setFormData(prevData => ({
                                            ...prevData,
                                            state_id: selectedOption?.value,
                                          }));
                                        }}
                                        className="form-select"
                                      >
                                        <option value="0">Select State</option>
                                        {optionState.map(option => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                      <label htmlFor="state_id">State</label>
                                      {formErrors.state_id && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.state_id}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="3">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="city"
                                        name="city"
                                        placeholder="Enter City"
                                        onChange={handleChange}
                                        value={formData?.city}
                                      />
                                      <label htmlFor="city">City</label>
                                      {formErrors.city && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.city}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="pincode"
                                        name="pincode"
                                        placeholder="Enter PinCode"
                                        onChange={handleChange}
                                        value={formData?.pincode}
                                      />
                                      <label htmlFor="pincode">PinCode</label>
                                      {formErrors.pincode && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.pincode}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                                <Row></Row>
                                <Row>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <div className="form-check mb-3">
                                        <input
                                          type="checkbox"
                                          className="form-check-input input-mini"
                                          id="order_block"
                                          checked={formData?.order_block}
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              order_block: event.target.checked,
                                            }));
                                          }}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="order_block"
                                        >
                                          Order Block
                                        </label>
                                        {formErrors.order_block && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.order_block}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <div className="form-check mb-3">
                                        <input
                                          type="checkbox"
                                          className="form-check-input input-mini"
                                          id="delivery_block"
                                          checked={formData?.delivery_block}
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              delivery_block:
                                                event.target.checked,
                                            }));
                                          }}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="delivery_block"
                                        >
                                          Delivery Block
                                        </label>
                                        {formErrors.delivery_block && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.delivery_block}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <div className="form-check mb-3">
                                        <input
                                          type="checkbox"
                                          className="form-check-input input-mini"
                                          id="billing_block"
                                          checked={formData?.billing_block}
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              billing_block:
                                                event.target.checked,
                                            }));
                                          }}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="billing_block"
                                        >
                                          Billing Block
                                        </label>
                                        {formErrors.billing_block && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.billing_block}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <div className="form-check mb-3">
                                        <input
                                          type="checkbox"
                                          className="form-check-input input-mini"
                                          id="deletion_indicator"
                                          checked={formData?.deletion_indicator}
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              deletion_indicator:
                                                event.target.checked,
                                            }));
                                          }}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="deletion_indicator"
                                        >
                                          Deletion Indicator
                                        </label>
                                        {formErrors.deletion_indicator && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.deletion_indicator}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Col>

                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <div className="form-check mb-3">
                                        <input
                                          type="checkbox"
                                          className="form-check-input input-mini"
                                          id="credit_block"
                                          checked={formData?.credit_block}
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              credit_block:
                                                event.target.checked,
                                            }));
                                          }}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="credit_block"
                                        >
                                          Credit Block
                                        </label>
                                        {formErrors.credit_block && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.credit_block}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <div className="form-check mb-3">
                                        <input
                                          type="checkbox"
                                          className="form-check-input input-mini"
                                          id="pod_indicator"
                                          checked={formData.pod_indicator}
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              pod_indicator:
                                                event.target.checked,
                                            }));
                                          }}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="pod_indicator"
                                        >
                                          POD Indicator
                                        </label>
                                        {formErrors.pod_indicator && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.pod_indicator}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="number"
                                        className="form-control"
                                        id="credit_limit_amount"
                                        name="credit_limit_amount"
                                        placeholder="Enter Credit Limit Amount"
                                        onChange={handleChange}
                                        value={formData?.credit_limit_amount}
                                      />
                                      <label htmlFor="credit_limit_amount">
                                        Credit Limit Amount
                                      </label>
                                      {formErrors.credit_limit_amount && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.credit_limit_amount}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <select
                                        value={formData?.payment_terms_id}
                                        onChange={async event => {
                                          const selectedOption =
                                            optionPaymentTerms.find(
                                              option =>
                                                option.value ==
                                                event.target.value
                                            );
                                          setFormData(prevData => ({
                                            ...prevData,
                                            payment_terms_id:
                                              selectedOption?.value,
                                          }));
                                        }}
                                        className="form-select"
                                      >
                                        <option value="0">
                                          Select Payment Terms
                                        </option>
                                        {optionPaymentTerms.map(option => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                      <label htmlFor="payment_terms_id">
                                        Payment Terms
                                      </label>
                                      {formErrors.payment_terms_id && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.payment_terms_id}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <select
                                        value={formData?.inco_terms_id}
                                        onChange={async event => {
                                          const selectedOption =
                                            optionIncoTerms.find(
                                              option =>
                                                option.value ==
                                                event.target.value
                                            );
                                          setFormData(prevData => ({
                                            ...prevData,
                                            inco_terms_id:
                                              selectedOption?.value,
                                          }));
                                        }}
                                        className="form-select"
                                      >
                                        <option value="0">
                                          Select Inco Terms
                                        </option>
                                        {optionIncoTerms.map(option => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                      <label htmlFor="inco_terms_id">
                                        Inco Terms
                                      </label>
                                      {formErrors.inco_terms_id && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.inco_terms_id}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <select
                                        value={formData?.inco_terms_desc_id}
                                        onChange={async event => {
                                          const selectedOption =
                                            optionIncoTermsDesc.find(
                                              option =>
                                                option.value ==
                                                event.target.value
                                            );
                                          setFormData(prevData => ({
                                            ...prevData,
                                            inco_terms_desc_id:
                                              selectedOption?.value,
                                          }));
                                        }}
                                        className="form-select"
                                      >
                                        <option value="0">
                                          Select Inco Terms Desc
                                        </option>
                                        {optionIncoTermsDesc.map(option => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                      <label htmlFor="inco_terms_desc_id">
                                        Inco Terms Desc
                                      </label>
                                      {formErrors.inco_terms_desc_id && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.inco_terms_desc_id}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="iban_number"
                                        name="iban_number"
                                        placeholder="Enter Iban Number"
                                        onChange={handleChange}
                                        value={formData?.iban_number}
                                      />
                                      <label htmlFor="iban_number">
                                        Iban Number
                                      </label>
                                      {formErrors.iban_number && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.iban_number}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="iec_code"
                                        name="iec_code"
                                        placeholder="Enter IEC Code"
                                        onChange={handleChange}
                                        value={formData?.iec_code}
                                      />
                                      <label htmlFor="iec_code">IEC Code</label>
                                      {formErrors.iec_code && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.iec_code}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <Input
                                        type="text"
                                        className="inner form-control"
                                        placeholder="Tax Id"
                                        onChange={event => {
                                          setFormData(prevData => ({
                                            ...prevData,
                                            tax_id_1: event.target.value,
                                          }));
                                        }}
                                        value={formData?.tax_id_1}
                                      />
                                      <label htmlFor="tax_id_1">Tax Id</label>
                                      {formErrors.tax_id_1 && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.tax_id_1}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="1">
                                    <Button
                                      onClick={handleAddRowNestedTax}
                                      color="primary"
                                    >
                                      Add
                                    </Button>
                                  </Col>
                                  {taxId?.map((item1, idx) => (
                                    <>
                                      <Col lg="1" key={`tax-col-${idx}`}>
                                        <tr id={"nested" + idx}>
                                          <td>
                                            <div className="form-floating mb-3">
                                              <Input
                                                type="text"
                                                className={`inner form-control ${
                                                  formErrors[
                                                    `tax_id_${idx + 2}`
                                                  ]
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                                placeholder={
                                                  "Tax Id " + (idx + 2)
                                                }
                                                onChange={event => {
                                                  setFormData(prevData => ({
                                                    ...prevData,
                                                    ["tax_id_" + (idx + 2)]:
                                                      event.target.value,
                                                  }));
                                                }}
                                                value={
                                                  formData?.[
                                                    "tax_id_" + (idx + 2)
                                                  ] || ""
                                                }
                                              />
                                              <label
                                                htmlFor={`tax_id_${idx + 2}`}
                                              >
                                                {"Tax Id " + (idx + 2)}
                                              </label>
                                              {formErrors[
                                                `tax_id_${idx + 2}`
                                              ] && (
                                                <div className="invalid-feedback">
                                                  {
                                                    formErrors[
                                                      `tax_id_${idx + 2}`
                                                    ]
                                                  }
                                                </div>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      </Col>
                                      <Col lg="1">
                                        <Button
                                          onClick={() =>
                                            handleRemoveRowNestedTax(idx)
                                          }
                                          color="danger"
                                          className="btn-block inner"
                                          style={{ width: "100%" }}
                                        >
                                          Delete
                                        </Button>
                                      </Col>
                                    </>
                                  ))}
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <select
                                        value={formData?.sez_eou_dta}
                                        onChange={async event => {
                                          const selectedOption =
                                            optionSezEouDta.find(
                                              option =>
                                                option.value ==
                                                event.target.value
                                            );
                                          setFormData(prevData => ({
                                            ...prevData,
                                            sez_eou_dta: selectedOption?.value,
                                          }));
                                        }}
                                        className="form-select"
                                      >
                                        <option value="0">
                                          Select SEZ/EOU/DTA
                                        </option>
                                        {optionSezEouDta.map(option => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                      <label htmlFor="sez_eou_dta">
                                        SEZ/EOU/DTA
                                      </label>
                                      {formErrors.sez_eou_dta && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.sez_eou_dta}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="customer_classification"
                                        name="customer_classification"
                                        placeholder="Enter Customer Classification"
                                        onChange={handleChange}
                                        value={
                                          formData?.customer_classification
                                        }
                                      />
                                      <label htmlFor="customer_classification">
                                        Customer Classification
                                      </label>
                                      {formErrors.customer_classification && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.customer_classification}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <select
                                        value={formData?.company_id}
                                        onChange={async event => {
                                          const selectedOption =
                                            optionCompany.find(
                                              option =>
                                                option.value ==
                                                event.target.value
                                            );
                                          setFormData(prevData => ({
                                            ...prevData,
                                            company_id: selectedOption?.value,
                                          }));
                                        }}
                                        className="form-select"
                                      >
                                        <option value="0">
                                          Select Company
                                        </option>
                                        {optionCompany.map(option => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                      <label htmlFor="company_id">
                                        Company
                                      </label>
                                      {formErrors.company_id && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.company_id}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="2">
                                    <div className="form-floating mb-3">
                                      <Input
                                        type="text"
                                        className="inner form-control"
                                        placeholder="Text1"
                                        onChange={event => {
                                          setFormData(prevData => ({
                                            ...prevData,
                                            text1: event.target.value,
                                          }));
                                        }}
                                        value={formData?.text1}
                                      />
                                      <label htmlFor="text1">Text1</label>
                                      {formErrors.text1 && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.text1}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="1">
                                    <Button
                                      onClick={handleAddRowNestedText}
                                      color="primary"
                                    >
                                      Add
                                    </Button>
                                  </Col>
                                  {textId?.map((item1, idx) => (
                                    <>
                                      <Col lg="1" key={`text-col-${idx}`}>
                                        <tr id={"nested" + idx}>
                                          <td>
                                            <div className="form-floating mb-3">
                                              <Input
                                                type="text"
                                                className={`inner form-control ${
                                                  formErrors[`text${idx + 2}`]
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                                placeholder={
                                                  "Text " + (idx + 2)
                                                }
                                                onChange={event => {
                                                  setFormData(prevData => ({
                                                    ...prevData,
                                                    ["text" + (idx + 2)]:
                                                      event.target.value,
                                                  }));
                                                }}
                                                value={
                                                  formData?.[
                                                    "text" + (idx + 2)
                                                  ] || ""
                                                }
                                              />
                                              <label htmlFor={`text${idx + 2}`}>
                                                {"Text " + (idx + 2)}
                                              </label>
                                              {formErrors[`text${idx + 2}`] && (
                                                <div className="invalid-feedback">
                                                  {formErrors[`text${idx + 2}`]}
                                                </div>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      </Col>
                                      <Col lg="1">
                                        <Button
                                          onClick={() =>
                                            handleRemoveRowNestedText(idx)
                                          }
                                          color="danger"
                                          className="btn-block inner"
                                          style={{ width: "100%" }}
                                        >
                                          Delete
                                        </Button>
                                      </Col>
                                    </>
                                  ))}
                                </Row>
                              </Form>
                            </div>
                          </TabPane>
                          <TabPane tabId={3}>
                            <div>
                              <Form>
                                <Row>
                                  <Col lg="4">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="pan_number"
                                        name="pan_number"
                                        placeholder="Enter Pan Number"
                                        onChange={handleChange}
                                        value={formData?.pan_number}
                                      />
                                      <label htmlFor="pan_number">
                                        Pan/IT No.
                                      </label>
                                      {formErrors.pan_number && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.pan_number}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="4">
                                    <div className="form-floating mb-3">
                                      <select
                                        value={formData?.gst_registration_type}
                                        onChange={async event => {
                                          const selectedValue =
                                            event.target.value;
                                          const isGstRequired =
                                            selectedValue === "unregistered";

                                          setFormData(prevData => ({
                                            ...prevData,
                                            gst_registration_type:
                                              selectedValue,
                                            gstin: isGstRequired
                                              ? ""
                                              : prevData.gstin,
                                          }));
                                        }}
                                        className="form-select"
                                        id="gst_registration_type"
                                      >
                                        <option value="regular">
                                          {" "}
                                          Regular{" "}
                                        </option>
                                        <option value="composition">
                                          {" "}
                                          Composition{" "}
                                        </option>
                                        <option value="unregistered">
                                          {" "}
                                          Unregistered/Consumer{" "}
                                        </option>
                                      </select>
                                      <label htmlFor="gst_registration_type">
                                        Regestration Type
                                      </label>
                                      {formErrors.gst_registration_type && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.gst_registration_type}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="4">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="gstin"
                                        name="gstin"
                                        placeholder="Enter GSTIN"
                                        value={formData?.gstin}
                                        onChange={handleChange}
                                        maxLength={15}
                                        disabled={
                                          formData?.gst_registration_type ===
                                          "unregistered"
                                        }
                                      />
                                      <label htmlFor="gstin">GSTIN/UIN</label>
                                      {formErrors.gstin && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.gstin}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg="4" className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center h-100">
                                      <Label className="mb-0">
                                        Set/Alter Additional GST Details
                                      </Label>
                                      <div className="form-check form-switch m-0">
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          id="additional_gst_details"
                                          checked={
                                            formData?.additional_gst_details
                                          }
                                          onChange={e => {
                                            setFormData(prev => ({
                                              ...prev,
                                              additional_gst_details:
                                                e.target.checked,
                                              // Reset dependent fields when unchecked
                                              is_party_transporter: false,
                                              transporter_id: "",
                                              place_of_supply: "",
                                            }));
                                          }}
                                        />
                                        <label
                                          className="form-check-label ms-2"
                                          htmlFor="additional_gst_details"
                                          style={{ whiteSpace: "nowrap" }}
                                        >
                                          {formData.additional_gst_details
                                            ? "Yes"
                                            : "No"}
                                        </label>
                                      </div>
                                    </div>
                                  </Col>

                                  {formData.additional_gst_details && (
                                    <>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            value={formData?.place_of_supply}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionState.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                place_of_supply:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                            className="form-select"
                                          >
                                            <option value="0">
                                              Select Place
                                            </option>
                                            {optionState.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="place_of_supply">
                                            Place of Supply (for Outwards)
                                          </label>
                                          {formErrors.place_of_supply && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.place_of_supply}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4" className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center h-100">
                                          <Label className="mb-0">
                                            Is the Party a Transporter
                                          </Label>
                                          <div className="form-check form-switch m-0">
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              id="is_party_transporter"
                                              checked={
                                                formData?.is_party_transporter
                                              }
                                              onChange={e => {
                                                setFormData(prev => ({
                                                  ...prev,
                                                  is_party_transporter:
                                                    e.target.checked,
                                                }));
                                              }}
                                            />
                                            <label
                                              className="form-check-label ms-2"
                                              htmlFor="is_party_transporter"
                                              style={{ whiteSpace: "nowrap" }}
                                            >
                                              {formData.is_party_transporter
                                                ? "Yes"
                                                : "No"}
                                            </label>
                                          </div>
                                        </div>
                                      </Col>
                                    </>
                                  )}
                                </Row>

                                {formData.additional_gst_details &&
                                  formData.is_party_transporter && (
                                    <Row>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="transporter_id"
                                            name="transporter_id"
                                            placeholder="Enter Transporter ID"
                                            onChange={handleChange}
                                            value={formData?.transporter_id}
                                          />
                                          <label htmlFor="transporter_id">
                                            Transporter ID
                                          </label>
                                          {formErrors.transporter_id && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.transporter_id}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                  )}
                              </Form>
                            </div>
                          </TabPane>
                          <TabPane tabId={4}>
                            <div>
                              <Form>
                                <Row>
                                  <Col lg="4">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="bank_name"
                                        name="bank_name"
                                        placeholder="Enter Bank Name"
                                        onChange={handleChange}
                                        value={formData?.bank_name}
                                      />
                                      <label htmlFor="bank_name">
                                        Bank Name
                                      </label>
                                      {formErrors.bank_name && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.bank_name}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="4">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="bank_account_number"
                                        name="bank_account_number"
                                        placeholder="Enter Bank Account Number"
                                        onChange={handleChange}
                                        value={formData?.bank_account_number}
                                      />
                                      <label htmlFor="bank_account_number">
                                        Bank Account Number
                                      </label>
                                      {formErrors.bank_account_number && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.bank_account_number}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="4">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="bank_account_holdername"
                                        placeholder="Enter Bank Account Holder Name"
                                        onChange={event => {
                                          setFormData(prevData => ({
                                            ...prevData,
                                            bank_account_holdername:
                                              event.target.value,
                                          }));
                                        }}
                                        value={
                                          formData?.bank_account_holdername
                                        }
                                      />
                                      <label htmlFor="bank_account_holdername">
                                        Bank Account Holder Name
                                      </label>
                                      {formErrors.bank_account_holdername && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.bank_account_holdername}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg="4">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="bank_branch_code"
                                        name="bank_branch_code"
                                        placeholder="Enter Bank Branch Code"
                                        onChange={handleChange}
                                        value={formData?.bank_branch_code}
                                      />
                                      <label htmlFor="bank_branch_code">
                                        Bank Branch Code
                                      </label>
                                      {formErrors.bank_branch_code && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.bank_branch_code}
                                        </div>
                                      )}
                                    </div>
                                  </Col>

                                  <Col lg="4">
                                    <div className="form-floating mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="ifsc_code"
                                        name="ifsc_code"
                                        placeholder="Enter Ifsc Code"
                                        onChange={handleChange}
                                        value={formData?.ifsc_code}
                                      />
                                      <label htmlFor="ifsc_code">
                                        IFSC Code
                                      </label>
                                      {formErrors.ifsc_code && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.ifsc_code}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg="4">
                                    <div className="form-floating mb-3">
                                      <textarea
                                        id="bank_address"
                                        name="bank_address"
                                        className="form-control"
                                        rows="2"
                                        placeholder="Enter Bank Address"
                                        onChange={handleChange}
                                        value={formData?.bank_address}
                                      />
                                      <label htmlFor="bank_address">
                                        Bank Address
                                      </label>
                                      {formErrors.bank_address && (
                                        <div
                                          style={{
                                            color: "#f46a6a",
                                            fontSize: "80%",
                                          }}
                                        >
                                          {formErrors.bank_address}
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Form>
                            </div>
                          </TabPane>
                          <TabPane tabId={5}>
                            <div className="row justify-content-center">
                              <Col lg="6">
                                <div className="text-center">
                                  <div className="mb-4">
                                    {addcustomers?.success === true ||
                                    updatecustomers?.success === true ? (
                                      <i className="mdi mdi-check-circle-outline text-success display-4" />
                                    ) : (
                                      <i className="mdi mdi-close-circle-outline text-danger display-4" />
                                    )}
                                  </div>
                                  <div>
                                    <h5>
                                      {addcustomers?.message ||
                                        updatecustomers?.message}
                                    </h5>
                                  </div>
                                </div>
                              </Col>
                            </div>
                          </TabPane>
                        </TabContent>
                      </div>
                      <div className="actions clearfix">
                        <ul>
                          <li
                            className={
                              activeTab === 1 || activeTab === 5
                                ? "previous disabled"
                                : "previous"
                            }
                          >
                            <Link
                              to={{
                                pathname: "/customers/" + mode,
                                state: { editCustomer: Edit },
                              }}
                              onClick={() => {
                                if (
                                  activeTab == 2 ||
                                  activeTab == 3 ||
                                  activeTab == 4
                                ) {
                                  toggleTab(activeTab - 1);
                                }
                              }}
                            >
                              Previous
                            </Link>
                          </li>
                          <li
                            className={
                              activeTab === 5 ? "next disabled" : "next"
                            }
                          >
                            <Link
                              to={{
                                pathname: "/customers/" + mode,
                                state: { editCustomer: Edit },
                              }}
                              onClick={() => {
                                toggleTab(activeTab + 1);
                              }}
                            >
                              Next
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardBody>
                  {/* </Card> */}
                </Col>
              </Row>
            )}
          </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddCustomers;
