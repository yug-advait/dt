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
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import {
  GET_VENDOR_REQUEST,
  UPDATE_VENDOR_REQUEST,
  ADD_VENDOR_REQUEST,
} from "../../../store/vendor/actionTypes";
import { Title } from "../../../constants/layout";
import moment from "moment";
import { getRelatedRecords } from "helpers/Api/api_common";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Vendors = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { vendor, listVendor, addVendor, updateVendor } = useSelector(
    state => state.vendor
  );
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([]);
  const [extVendorCode, setExtVendorCode] = useState([]);
  const [address, setAddress] = useState([]);
  const [taxId, setTaxID] = useState([]);
  const [textId, setTextID] = useState([]);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [optionAccountGrp, setOptionAccountGrp] = useState([]);
  const [optionTitle, setOptionTitle] = useState(Title);
  const [optionCompany, setOptionCompany] = useState([]);
  const [optionCountry, setOptionCountry] = useState([]);
  const [optionState, setOptionState] = useState([]);
  const [optionCity, setOptionCity] = useState([]);
  const [optionGSTIndicator, setOptionGSTIndicator] = useState([]);
  const [optionCurrency, setOptionCurrency] = useState([]);
  const [optionLocationCode, setOptionLocationCode] = useState([]);
  const [optionVendorGroup, setOptionVendorGroup] = useState([]);
  const [optionRevenueIndicator, setOptionRevenueIndicator] = useState([]);
  const [optionPurchaseOrganisation, setOptionPurchaseOrganisation] = useState(
    []
  );
  const [optionCustomer, setOptionCustomer] = useState([]);
  const [optionPurchaseGroup, setOptionPurchaseGroup] = useState([]);
  const [optionEmployee, setOptionEmployee] = useState([]);
  const [optionPaymentTerms, setOptionPaymentTerms] = useState([]);
  const [optionIncoTerm, setOptionIncoTerm] = useState([]);
  const [extVendGrp, setExtVendGrp] = useState([]);
  const [optionWithholdingTax, setOptionWithholdingTax] = useState([]);
  const [formData, setFormData] = useState({});
  const [Edit, setEdit] = useState(null);
  const mode = Edit === null ? "Add" : "Edit";

  const validateForm1 = () => {
    const errors = {};
    if (!formData.account_group_id) {
      errors.account_group_id = "Account Group is required";
    }
    if (!formData.legal_entity_name) {
      errors.legal_entity_name = "Legal Entity Name is required";
    } else if (formData.legal_entity_name.length > 50) {
      errors.legal_entity_name =
        "Legal Entity Name cannot be more than 50 characters";
    }
    if (!formData.vendor_code) {
      errors.vendor_code = "Vendor Code is required";
    } else if (formData.vendor_code.length > 10) {
      errors.vendor_code = "Vendor Code cannot be more than 10 characters";
    }
    if (!formData.title) {
      errors.title = "Title is required";
    }
    if (!formData.firstname) {
      errors.firstname = "First Name is required";
    } else if (formData.firstname.length > 50) {
      errors.firstname = "First Name cannot be more than 50 characters";
    }
    if (!formData.lastname) {
      errors.lastname = "Last Name is required";
    } else if (formData.lastname.length > 50) {
      errors.lastname = "Last Name cannot be more than 50 characters";
    }
    if (!formData.telephone) {
      errors.telephone = "Telephone is required";
    } else if (formData.telephone.length > 20) {
      errors.telephone = "Telephone cannot be more than 20 characters";
    }
    if (!formData.mobile) {
      errors.mobile = "Mobile is required";
    } else if (formData.mobile.length > 20) {
      errors.mobile = "Mobile cannot be more than 20 characters";
    }
    if (!formData.email_id) {
      errors.email_id = "Email is required";
    } else if (!validateEmail(formData.email_id)) {
      errors.email_id = "Please enter a valid email address.";
    } else if (formData.email_id.length > 50) {
      errors.email_id = "Email cannot be more than 50 characters"
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length > 30) {
      errors.password = "Password cannot be more than 30 characters";
    }
    if (!formData.company_id) {
      errors.company_id = "Company is required";
    }
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
    if (!formData.pincode) {
      errors.pincode = "PinCode is required";
    } else if (formData.pincode.length > 20) {
      errors.pincode = "Pincode cannot be more than 20 characters";
    }
    if (!formData.registration_number) {
      errors.registration_number = "Registration Number is required";
    } else if (formData.registration_number.length > 70) {
      errors.registration_number =
        "Registration Number cannot be more than 70 characters";
    }
    if (!formData.tan) {
      errors.tan = "TAN is required";
    } else if (formData.tan.length > 3) {
      errors.tan = "Tan cannot be more than 3 characters";
    }
    if (!formData.tin) {
      errors.tin = "TIN is required";
    } else if (formData.tin.length > 3) {
      errors.tin = "Tin cannot be more than 3 characters";
    }
    if (!formData.aadhar_number) {
      errors.aadhar_number = "Aadhar Number is required";
    } else if (formData.aadhar_number.length !== 12) {
      errors.aadhar_number = "Aadhar Number must be exactly 12 digits";
    }
    if (!formData.udyog_number) {
      errors.udyog_number = "Udhyog Aadhar Number is required";
    } else if (formData.udyog_number.length !== 12) {
      errors.udyog_number = "Udyog Aadhar Number must be exactly 12 digits";
    }
    if (!formData.tax_indicator_id) {
      errors.tax_indicator_id = "GST Iindicator is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm2 = () => {
    const errors = {};
    if (!formData.currency_id) {
      errors.currency_id = "Currency is required";
    }
    if (!formData.vendor_group_id) {
      errors.vendor_group_id = "Vendor Group is required";
    }
    if (!formData.location_code_id) {
      errors.location_code_id = "Location Code is required";
    }
    if (!formData.revenue_indicator_id) {
      errors.revenue_indicator_id = "Revenue Indicator is required";
    }
    if (!formData.vendor_classification) {
      errors.vendor_classification = "Vendor Classification is required";
    } else if (formData.vendor_classification.length > 1) {
      errors.vendor_classification =
        "Please enter a single character between A to Z";
    }
    if (!formData.purchase_organisation_id) {
      errors.purchase_organisation_id = "Purchase Organisation is required";
    }
    if (!formData.ext_vendor_code1) {
      errors.ext_vendor_code1 = "Ext Vendor Code1 is required";
    } else if (formData.ext_vendor_code1.length > 10) {
      errors.ext_vendor_code1 =
        "Ext Vendor Code1 cannot be more than 10 characters";
    }
    extVendorCode.forEach((_, idx) => {
      const fieldName = `ext_vendor_code${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Ext Vendor Code ${idx + 2} is required`;
      } else if (value.length > 10) {
        errors[fieldName] = `Ext Vendor Code ${idx + 2
          } cannot be more than 10 characters`;
      }
    });
    if (!formData.customer_id) {
      errors.customer_id = "Customer is required";
    }
    if (!formData.previous_account_number) {
      errors.previous_account_number = "Previous Account Number is required";
    } else if (formData.previous_account_number.length > 10) {
      errors.previous_account_number =
        "Previous Account Number cannot be more than 10 characters";
    }
    if (!formData.iec_code) {
      errors.iec_code = "IEC Code is required";
    } else if (formData.iec_code.length > 10) {
      errors.iec_code = "IEC Code cannot be more than 10 characters";
    }
    if (!formData.valid_from) {
      errors.valid_from = "Valid From is required";
    }
    if (!formData.valid_to) {
      errors.valid_to = "Valid To is required";
    }
    if (!formData.address_1) {
      errors.address_1 = "Address is required";
    } else if (formData.address_1.length > 50) {
      errors.address_1 = "Address Code cannot be more than 50 characters";
    }

    address.forEach((_, idx) => {
      const fieldName = `address_${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Address ${idx + 2} is required`;
      } else if (value.length > 50) {
        errors[fieldName] = `Address ${idx + 2} cannot exceed 50 characters`;
      }
    });
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
    if (!formData.pod_indicator) {
      errors.pod_indicator = "POD Indicator is required";
    }
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
    if (!formData.purchase_group_id) {
      errors.purchase_group_id = "Purchase Group is required";
    }
    if (!formData.employee_id) {
      errors.employee_id = "Employee is required";
    }
    if (!formData.procurement_block) {
      errors.procurement_block = "Procurement Block is required";
    }
    if (!formData.delivery_block) {
      errors.delivery_block = "Delivery Block is required";
    }
    if (!formData.billing_block) {
      errors.billing_block = "Billing Block is required";
    }
    if (!formData.payment_terms_id) {
      errors.payment_terms_id = "Payment Terms is required";
    }
    if (!formData.inco_term_id) {
      errors.inco_term_id = "Inco Terms is required";
    }
    if (!formData.swift_code) {
      errors.swift_code = "Swift Code is required";
    } else if (formData.swift_code.length > 40) {
      errors.swift_code = "Swift Code cannot be more than 40 characters";
    }
    if (!formData.iban_number) {
      errors.iban_number = "Iban Number is required";
    } else if (formData.iban_number.length > 40) {
      errors.iban_number = "IBAN Number cannot be more than 40 characters";
    }
    if (!formData.withholding_tax_type_id) {
      errors.withholding_tax_type_id = "Withholding Tax Type is required";
    }
    if (!formData.delivery_lead_time) {
      errors.delivery_lead_time = "Delivery Lead Time is required";
    } else if (formData.delivery_lead_time.length > 3) {
      errors.delivery_lead_time =
        "Delivery Lead Time cannot be more than 3 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm3 = () => {
    const errors = {};

    if (!formData.pan_number) {
      errors.pan_number = "Pan Number is required";
    }
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(formData.pan_number)) {
      errors.pan_number = "Must contain 5 alphabets, followed by 4 digits, then 1 alphabet";
    }

    if (!formData.gst_registration_type) {
      errors.gst_registration_type = "Regestration Type is required";
    }

    if (formData.gst_registration_type === "composition" || formData.gst_registration_type === "regular") {
      if (!formData.gstin) {
        errors.gstin = "GSTIN is required";
      } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(formData.gstin)) {
        errors.gstin = "Format: 2 letters (state code) + 5 letters (entity name) + 4 digits + 1 letter (legal name initial) + 1 alphanumeric (taxpayer type) + 'Z' + 1 alphanumeric (checksum)";
      }
    }

    if (formData.additional_gst_details && !formData.place_of_supply) {
      errors.place_of_supply = "Place of Supply is required";
    }

    if (formData.additional_gst_details && formData.is_party_transporter && !formData.transporter_id) {
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
    } else if (formData.bank_account_holdername.length > 50) {
      errors.bank_account_holdername =
        "Bank Account Holder cannot be more than 50 characters";
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
      errors.ifsc_code = "IFSC Code cannot be more than 40 characters";
    }
    if (!formData.bank_address) {
      errors.bank_address = "Bank Address is required";
    } else if (formData.bank_address.length > 200) {
      errors.bank_address = "Bank Address cannot be more than 200 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = event => {
    const inputValue = event.target.value.toUpperCase();
    const isValid = /^[A-Z]$/.test(inputValue);
    const { name, value } = event.target;
    let newValue = value;

    if (name === "vendor_code" && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        vendor_code: "Vendor Code cannot be more than 10 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        vendor_code: "",
      });
    }

    if (name === "firstname" && value.length > 50) {
      newValue = value.slice(0, 50);
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
      newValue = value.slice(0, 50);
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

    if (name === "city" && value.length > 50) {
      newValue = value.slice(0, 50);
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
      newValue = value.slice(0, 20);
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

    if (name === "password" && value.length > 30) {
      newValue = value.slice(0, 50);
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

    if (name === "registration_number" && value.length > 70) {
      newValue = value.slice(0, 70);
      setFormErrors({
        ...formErrors,
        registration_number:
          "Registration Number cannot be more than 70 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        registration_number: "",
      });
    }

    if (name === "pan_number" && value.length > 50) {
      newValue = value.slice(0, 50);
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

    if (name === "tan" && value.length > 3) {
      newValue = value.slice(0, 3);
      setFormErrors({
        ...formErrors,
        tan: "Tan cannot be more than 3 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        tan: "",
      });
    }

    if (name === "tin" && value.length > 3) {
      newValue = value.slice(0, 3);
      setFormErrors({
        ...formErrors,
        tin: "Tin cannot be more than 3 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        tin: "",
      });
    }

    if (name === "gstin" && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        gstin: "GSTIN cannot be more than 50 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        gstin: "",
      });
    }

    if (name === "aadhar_number") {
      newValue = value.replace(/\D/g, "");
      if (newValue.length > 12) {
        newValue = newValue.slice(0, 12);
        setFormErrors({
          ...formErrors,
          aadhar_number: "Aadhar Number must be exactly 12 digits",
        });
      } else {
        setFormErrors({
          ...formErrors,
          aadhar_number: "",
        });
      }
    }

    if (name === "udyog_number") {

      newValue = value.replace(/\D/g, "");
      if (newValue.length > 12) {
        newValue = newValue.slice(0, 12);
        setFormErrors({
          ...formErrors,
          udyog_number: "Udyog Aadhar Number must be exactly 12 digits",
        });
      } else {
        setFormErrors({
          ...formErrors,
          udyog_number: "",
        });
      }
    }

    if (name === "ext_vendor_code1" && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        ext_vendor_code1: "Ext Vendor Code cannot be more than 10 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        ext_vendor_code1: "",
      });
    }
    if (name === "previous_account_number" && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        previous_account_number:
          "Previous Account Number cannot be more than 10 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        previous_account_number: "",
      });
    }

    if (name === "iec_code" && value.length > 50) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        iec_code: "IEC Code cannot be more than 50 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        iec_code: "",
      });
    }

    if (name === "swift_code" && value.length > 40) {
      newValue = value.slice(0, 10);
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

    if (name === "iban_number" && value.length > 40) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        iban_number: "IBAN Number cannot be more than 40 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        iban_number: "",
      });
    }

    if (name === "delivery_lead_time" && value.length > 3) {
      newValue = value.slice(0, 3);
      setFormErrors({
        ...formErrors,
        delivery_lead_time:
          "Delivery Lead Time cannot be more than 3 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        delivery_lead_time: "",
      });
    }

    if (name === "vendor_classification" && value.length > 1) {
      newValue = value.slice(0, 1);
      setFormErrors({
        ...formErrors,
        vendor_classification:
          "Vendor Classification Time cannot be more than 1 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        vendor_classification: "",
      });
    }
    if (name === "bank_name" && value.length > 70) {
      newValue = value.slice(0, 70);
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
      newValue = value.slice(0, 40);
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

    if (name === "bank_account_holdername" && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        bank_account_holdername:
          "Bank Account Name cannot be more than 50 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        bank_account_holdername: "",
      });
    }
    if (name === "bank_branch_code" && value.length > 40) {
      newValue = value.slice(0, 40);
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

    if (name === "ifsc_code" && value.length > 40) {
      newValue = value.slice(0, 40);
      setFormErrors({
        ...formErrors,
        ifsc_code: "IFSC Code cannot be more than 40 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        ifsc_code: "",
      });
    }

    if (name === "bank_address" && value.length > 200) {
      newValue = value.slice(0, 200);
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
      localStorage.setItem("vendorData", JSON.stringify(formData));
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
        setLoading(true);
        const Id = Edit.id;
        const data = {
          formData,
          Id,
        };
        dispatch({
          type: UPDATE_VENDOR_REQUEST,
          payload: data,
        });
      } else {
        setLoading(true);
        const data = {
          formData,
        };
        dispatch({
          type: ADD_VENDOR_REQUEST,
          payload: data,
        });
      }
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 5 && tab == 4) {
      tabAction(tab);
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
    const vendorData = JSON.parse(localStorage.getItem("vendorData"));
    const { editState } = location.state || {};
    if (editState) {
      setEdit(editState);
      if (editState?.country && editState.state) {
        listState(editState.country?.value);
      }
      setFormData({
        account_group_id: editState?.account_group?.value || "",
        vendor_code: editState.vendor_code || "",
        legal_entity_name: editState.legal_entity_name || "",
        title: editState.title || "",
        firstname: editState.firstname || "",
        lastname: editState.lastname || "",
        telephone: editState.telephone || "",
        mobile: editState.mobile || "",
        email_id: editState.email_id || "",
        password: editState.password || "",
        company_id: editState.company?.value || "",
        country_id: editState.country?.value || "",
        state_id: editState.state?.value || "",
        city: editState.city || "",
        pincode: editState.pincode || "",
        registration_number: editState.registration_number || "",
        pan_number: editState.pan_number || "",
        tan: editState.tan || "",
        tin: editState.tin || "",
        gstin: editState.gstin || "",
        aadhar_number: editState.aadhar_number || "",
        udyog_number: editState.udyog_number || "",
        tax_indicator_id: editState.tax_indicator?.value || "",
        currency_id: editState.currency?.value || "",
        location_code_id: editState.location_code?.value || "",
        vendor_group_id: editState.vendor_group?.value || "",
        revenue_indicator_id: editState.revenue_indicator?.value || "",
        vendor_classification: editState.vendor_classification || "",
        purchase_organisation_id: editState.purchase_organisation?.value || "",
        ext_vendor_code1: editState.ext_vendor_code1 || "",
        ext_vendor_code2: editState.ext_vendor_code2 || "",
        ext_vendor_code3: editState.ext_vendor_code3 || "",
        customer_id: editState.customer_id || "",
        previous_account_number: editState.previous_account_number || "",
        iec_code: editState.iec_code || "",
        valid_from: moment(editState.valid_from).format("DD/MM/YYYY") || "",
        valid_to: moment(editState.valid_to).format("DD/MM/YYYY") || "",
        address_1: editState.address_1 || "",
        address_2: editState.address_2 || "",
        address_3: editState.address_3 || "",
        tax_id_1: editState.tax_id_1 || "",
        tax_id_2: editState.tax_id_2 || "",
        tax_id_3: editState.tax_id_3 || "",
        tax_id_4: editState.tax_id_4 || "",
        tax_id_5: editState.tax_id_5 || "",
        pod_indicator: editState.pod_indicator || "",
        text1: editState.text1 || "",
        text2: editState.text2 || "",
        text3: editState.text3 || "",
        text4: editState.text4 || "",
        text5: editState.text5 || "",
        vend_grp1: editState.vend_grp1.value || 0,
        vend_grp2: editState.vend_grp2.value || 0,
        vend_grp3: editState.vend_grp3.value || 0,
        vend_grp4: editState.vend_grp4.value || 0,
        vend_grp5: editState.vend_grp5.value || 0,
        vend_grp6: editState.vend_grp6.value || 0,
        vend_grp7: editState.vend_grp7.value || 0,
        purchase_group_id: editState.purchase_group?.value || "",
        employee_id: editState.employee?.value || "",
        procurement_block: editState.procurement_block || "",
        delivery_block: editState.delivery_block || "",
        billing_block: editState.billing_block || "",
        payment_terms_id: editState.payment_term?.value || "",
        inco_term_id: editState.inco_term?.value || "",
        swift_code: editState.swift_code || "",
        iban_number: editState.iban_number || "",
        withholding_tax_type_id: editState.withholding_tax_type?.value || "",
        delivery_lead_time: editState.delivery_lead_time || "",
        bank_name: editState.bank_name || "",
        bank_account_number: editState.bank_account_number || "",
        bank_account_holdername: editState.bank_account_holdername || "",
        bank_branch_code: editState.bank_branch_code || "",
        ifsc_code: editState.ifsc_code || "",
        bank_address: editState.bank_address || "",
        gst_registration_type: editState?.gst_registration_type || "",
        additional_gst_details: editState?.additional_gst_details || false,
        place_of_supply: editState?.place_of_supply || "",
        is_party_transporter: editState?.is_party_transporter || false,
        transporter_id: editState?.transporter_id || "",
      });
    } else {
      setEdit(null);
      if (vendorData) {
        if (vendorData.country_id && vendorData.state_id) {
          listState(vendorData.country_id);
        }

        setFormData({
          account_group_id: vendorData.account_group_id || "",
          vendor_code: vendorData.vendor_code || "",
          legal_entity_name: vendorData.legal_entity_name || "",
          title: vendorData.title || "",
          firstname: vendorData.firstname || "",
          lastname: vendorData.lastname || "",
          telephone: vendorData.telephone || "",
          mobile: vendorData.mobile || "",
          email_id: vendorData.email_id || "",
          password: vendorData.password || "",
          company_id: vendorData.company_id || "",
          country_id: vendorData.country_id || "",
          state_id: vendorData.state_id || "",
          city: vendorData.city || "",
          pincode: vendorData.pincode || "",
          registration_number: vendorData.registration_number || "",
          pan_number: vendorData.pan_number || "",
          tan: vendorData.tan || "",
          tin: vendorData.tin || "",
          gstin: vendorData.gstin || "",
          aadhar_number: vendorData.aadhar_number || "",
          udyog_number: vendorData.udyog_number || "",
          tax_indicator_id: vendorData.tax_indicator_id || "",
          currency_id: vendorData.currency_id || "",
          location_code_id: vendorData.location_code_id || "",
          vendor_group_id: vendorData.vendor_group_id || "",
          revenue_indicator_id: vendorData.revenue_indicator_id || "",
          vendor_classification: vendorData.vendor_classification || "",
          purchase_organisation_id: vendorData.purchase_organisation_id || "",
          ext_vendor_code1: vendorData.ext_vendor_code1 || "",
          ext_vendor_code2: vendorData.ext_vendor_code2 || "",
          ext_vendor_code3: vendorData.ext_vendor_code3 || "",
          customer_id: vendorData.customer_id || "",
          previous_account_number: vendorData.previous_account_number || "",
          iec_code: vendorData.iec_code || "",
          valid_from: vendorData.valid_from || "",
          valid_to: vendorData.valid_to || "",
          address_1: vendorData.address_1 || "",
          address_2: vendorData.address_2 || "",
          address_3: vendorData.address_3 || "",
          tax_id_1: vendorData.tax_id_1 || "",
          tax_id_2: vendorData.tax_id_2 || "",
          tax_id_3: vendorData.tax_id_3 || "",
          tax_id_4: vendorData.tax_id_4 || "",
          tax_id_5: vendorData.tax_id_5 || "",
          pod_indicator: vendorData.pod_indicator || "",
          text1: vendorData.text1 || "",
          text2: vendorData.text2 || "",
          text3: vendorData.text3 || "",
          text4: vendorData.text4 || "",
          text5: vendorData.text5 || "",
          vend_grp1: vendorData.vend_grp1 || 0,
          vend_grp2: vendorData.vend_grp2 || 0,
          vend_grp3: vendorData.vend_grp3 || 0,
          vend_grp4: vendorData.vend_grp4 || 0,
          vend_grp5: vendorData.vend_grp5 || 0,
          vend_grp6: vendorData.vend_grp6 || 0,
          vend_grp7: vendorData.vend_grp7 || 0,
          purchase_group_id: vendorData.purchase_group_id || "",
          employee_id: vendorData.employee_id || "",
          procurement_block: vendorData.procurement_block || "",
          delivery_block: vendorData.delivery_block || "",
          billing_block: vendorData.billing_block || "",
          payment_terms_id: vendorData.payment_terms_id || "",
          inco_term_id: vendorData.inco_term_id || "",
          swift_code: vendorData.swift_code || "",
          iban_number: vendorData.iban_number || "",
          withholding_tax_type_id: vendorData.withholding_tax_type_id || "",
          delivery_lead_time: vendorData.delivery_lead_time || "",
          bank_name: vendorData.bank_name || "",
          bank_account_number: vendorData.bank_account_number || "",
          bank_account_holdername: vendorData.bank_account_holdername || "",
          bank_branch_code: vendorData.bank_branch_code || "",
          ifsc_code: vendorData.ifsc_code || "",
          bank_address: vendorData.bank_address || "",
          gst_registration_type: vendorData?.gst_registration_type || "",
          additional_gst_details: vendorData?.additional_gst_details || false,
          place_of_supply: vendorData?.place_of_supply || "",
          is_party_transporter: vendorData?.is_party_transporter ||false,
          transporter_id: vendorData?.transporter_id || "",
        });
      }
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: GET_VENDOR_REQUEST,
      payload: [],
    });
  }, [dispatch]);

  useEffect(() => {
    if (addVendor?.success === true) {
      setLoading(false);
      setToastMessage("Vendor Added Successfully");
      localStorage.removeItem("vendorData");
    }
    if (updateVendor?.success === true) {
      setLoading(false);
      setToastMessage("Vendor Updated Successfully");
    }
    if (listVendor) {
      if (vendor && vendor?.account_groups) {
        setOptionAccountGrp(vendor?.account_groups);
        setOptionCompany(vendor?.companies);
        setOptionCountry(vendor?.countries);
        setOptionGSTIndicator(vendor?.tax_indicators);
        setOptionCurrency(vendor?.currencies);
        setOptionLocationCode(vendor?.location_codes);
        setOptionVendorGroup(vendor?.vendor_groups);
        setOptionRevenueIndicator(vendor?.revenue_indicators);
        setOptionPurchaseOrganisation(vendor?.purchase_organisations);
        setOptionCustomer(vendor?.customers);
        setOptionPurchaseGroup(vendor?.purchase_groups);
        setOptionEmployee(vendor?.employees);
        setOptionPaymentTerms(vendor?.payment_terms);
        setOptionIncoTerm(vendor?.inco_terms);
        setOptionWithholdingTax(vendor?.withholding_tax_types);
      }
    }
  }, [listVendor, addVendor, updateVendor, vendor]);

  useEffect(() => {
    if (activeTab === 5) {
      const timer = setTimeout(() => {
        history.push("/vendor/vendor");
      }, 1000);
  
      return () => clearTimeout(timer);
    }
  }, [activeTab, history]);

  const handleAddRowNestedVendgrp = () => {
    if (extVendGrp.length < 6) {
      const newItem = { name1: "" };
      setExtVendGrp([...extVendGrp, newItem]);
    }
  };

  const handleRemoveRowNestedVendgrp = idx => {
    setFormData(prevData => ({
      ...prevData,
      ["vend_grp" + (idx + 2)]: "",
    }));
    const updatedRows = [...extVendGrp];
    updatedRows.splice(idx, 1);
    setExtVendGrp(updatedRows);
  };

  const handleAddRowNestedEXt = () => {
    if (extVendorCode.length < 2) {
      const newItem = { name1: "" };
      setExtVendorCode([...extVendorCode, newItem]);
    }
  };

  const handleRemoveRowNestedExt = idx => {
    const updatedRows = [...extVendorCode];
    updatedRows.splice(idx, 1);
    setExtVendorCode(updatedRows);
  
    // Rebuild formData with corrected keys
    setFormData(prevData => {
      const newFormData = { ...prevData };
  
      // Clear all ext_vendor_codeX keys (except ext_vendor_code1)
      Object.keys(newFormData).forEach(key => {
        if (/^ext_vendor_code[2-9][0-9]*$/.test(key)) {
          delete newFormData[key];
        }
      });
  
      // Reassign ext_vendor_codeX keys based on updatedRows
      updatedRows.forEach((_, newIdx) => {
        newFormData[`ext_vendor_code${newIdx + 2}`] =
          prevData[`ext_vendor_code${idx + 2 + (newIdx > idx ? 1 : 0)}`] || "";
      });
  
      return newFormData;
    });
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

  document.title = "Detergent | Vendor " + mode + " Vendor";
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
            titlePath="/vendor/vendor"
            title="Vendors"
            breadcrumbItem={mode + " Vendor"}
          />
          <Card>
            <CardBody>
              {loading ? (
                <Loader />
              ) : (
                <Row>
                  <Col lg="12">
                    <Card>
                      <CardBody>
                        <div className="wizard clearfix">

                          <div className="custom-tabs-wrapper">
                            <ul className="custom-tab-nav">
                              {[
                                { id: 1, label: "Vendor Details" },
                                { id: 2, label: "Vendor Basic Details" },
                                { id: 3, label: "Tax Registration Details" },
                                { id: 4, label: "Bank Details" },
                                { id: 5, label: "Confirm Detail" },
                              ].map((tab, index) => (
                                <li key={tab.id} className="custom-tab-item">
                                  <button
                                    className={`custom-tab-link ${activeTab === tab.id ? "active" : ""}`}
                                    onClick={() => {
                                      if (tab.id === 1 || passedSteps.includes(tab.id)) {
                                        toggleTab(tab.id);
                                      }
                                    }}
                                    disabled={tab.id !== 1 && !passedSteps.includes(tab.id)}
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
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={formData?.account_group_id}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionAccountGrp.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
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
                                          {optionAccountGrp?.map(option => (
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
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="vendor_code"
                                          name="vendor_code"
                                          placeholder="Enter Vendor Code"
                                          onChange={handleChange}
                                          value={formData?.vendor_code}
                                        />
                                        <label htmlFor="vendor_code">
                                          Vendor Code
                                        </label>
                                        {formErrors.vendor_code && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.vendor_code}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="legal_entity_name"
                                          name="legal_entity_name"
                                          placeholder="Enter Legal Entity Name"
                                          onChange={handleChange}
                                          value={formData?.legal_entity_name}
                                        />
                                        <label htmlFor="legal_entity_name">
                                          Legal Entity Name
                                        </label>
                                        {formErrors.legal_entity_name && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.legal_entity_name}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
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
                                          {optionTitle?.map(option => (
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
                                    <Col lg="4">
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
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="number"
                                          className="form-control"
                                          id="telephone"
                                          name="telephone"
                                          placeholder="Enter Telephone"
                                          value={formData?.telephone}
                                          onChange={e => {
                                            const value = e.target.value;
                                            if (
                                              value === "" ||
                                              (Number(value) > 0 &&
                                                /^\d*$/.test(value))
                                            ) {
                                              setFormData(prevData => ({
                                                ...prevData,
                                                telephone: value,
                                              }));
                                            }
                                          }}
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
                                  </Row>
                                  <Row>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="number"
                                          className="form-control"
                                          id="mobile"
                                          name="mobile"
                                          placeholder="Enter Mobile"
                                          value={formData?.mobile}
                                          onChange={e => {
                                            const value = e.target.value;
                                            if (
                                              value === "" ||
                                              (Number(value) > 0 &&
                                                /^\d*$/.test(value))
                                            ) {
                                              setFormData(prevData => ({
                                                ...prevData,
                                                mobile: value,
                                              }));
                                            }
                                          }}
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
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="email"
                                          className="form-control"
                                          id="email_id"
                                          name="email_id"
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
                                    <Col lg="4">
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
                                        <label htmlFor="password">
                                          Password
                                        </label>
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
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
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
                                              state_id: "",
                                              city: "",
                                            }));
                                            const selectStateData =
                                              await getRelatedRecords(
                                                "states",
                                                "state_name_alias",
                                                "country_id",
                                                selectedOption?.value
                                              );
                                            setOptionState(
                                              selectStateData?.getRelatedRecordsData
                                            );
                                            setOptionCity([]);
                                          }}
                                        >
                                          <option value="0">
                                            Select Country
                                          </option>
                                          {optionCountry?.map(option => (
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
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
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
                                              city: "",
                                            }));
                                            const selectCityData =
                                              await getRelatedRecords(
                                                "cities",
                                                "city_name",
                                                "state_id",
                                                selectedOption?.value
                                              );
                                            setOptionCity(
                                              selectCityData?.getRelatedRecordsData
                                            );
                                          }}
                                        >
                                          <option value="0">
                                            Select State
                                          </option>
                                          {optionState?.map(option => (
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
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="city"
                                          name="city"
                                          placeholder="Enter City"
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              city: event.target.value,
                                            }));
                                          }}
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
                                  </Row>
                                  <Row>
                                    <Col lg="4">
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
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="registration_number"
                                          name="registration_number"
                                          placeholder="Enter Registration Number"
                                          onChange={handleChange}
                                          value={formData?.registration_number}
                                        />
                                        <label htmlFor="registration_number">
                                          Registration Number
                                        </label>
                                        {formErrors.registration_number && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.registration_number}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="tan"
                                          name="tan"
                                          placeholder="Enter Tan"
                                          onChange={handleChange}
                                          value={formData?.tan}
                                        />
                                        <label htmlFor="tan">Tan</label>
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
                                  </Row>
                                  <Row>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="tin"
                                          name="tin"
                                          placeholder="Enter Tin"
                                          onChange={handleChange}
                                          value={formData?.tin}
                                        />
                                        <label htmlFor="tin">Tin</label>
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
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={formData?.tax_indicator_id}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionGSTIndicator.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              tax_indicator_id:
                                                selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select GST Indicator
                                          </option>
                                          {optionGSTIndicator?.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="tax_indicator_id">
                                          GST Indicator
                                        </label>
                                        {formErrors.tax_indicator_id && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.tax_indicator_id}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="number"
                                          className="form-control"
                                          id="aadhar_number"
                                          name="aadhar_number"
                                          placeholder="Enter Aadhar Number"
                                          onChange={handleChange}
                                          value={formData?.aadhar_number}
                                        />
                                        <label htmlFor="aadhar_number">
                                          Aadhar No.
                                        </label>
                                        {formErrors.aadhar_number && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.aadhar_number}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="number"
                                          className="form-control"
                                          id="udyog_number"
                                          name="udyog_number"
                                          placeholder="Enter Registration Number"
                                          onChange={handleChange}
                                          value={formData?.udyog_number}
                                        />
                                        <label htmlFor="udyog_number">
                                          Udyog Aadhar No.
                                        </label>
                                        {formErrors.udyog_number && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.udyog_number}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
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
                                        >
                                          <option value="0">
                                            Select Company
                                          </option>
                                          {optionCompany?.map(option => (
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
                                  </Row>
                                </Form>
                              </TabPane>
                              <TabPane tabId={2}>
                                <div>
                                  <Form>
                                    <Row>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
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
                                                currency_id:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Currency
                                            </option>
                                            {optionCurrency?.map(option => (
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
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.location_code_id}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionLocationCode.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                location_code_id:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select DTA/EOU/SEZ Code
                                            </option>
                                            {optionLocationCode?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="location_code_id">
                                            DTA/EOU/SEZ Location Code
                                          </label>
                                          {formErrors.location_code_id && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.location_code_id}
                                            </div>
                                          )}
                                        </div>
                                      </Col>

                                      <Col lg="3">
                                        <div className="form-floating mb-3">
                                          <select
                                            value={formData?.vend_grp1}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionVendorGroup.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                vend_grp1:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                            className="form-select"
                                          >
                                            <option value="0">
                                              Select Vendor Group
                                            </option>
                                            {optionVendorGroup?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="vend_grp1">
                                            Vendor Group1
                                          </label>
                                          {formErrors.vend_grp1 && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.vend_grp1}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="1">
                                        <Button
                                          onClick={handleAddRowNestedVendgrp}
                                          color="primary"
                                        >
                                          Add
                                        </Button>
                                      </Col>
                                      {extVendGrp?.map((item1, idx) => (
                                        <>
                                          <Col lg="3">
                                            <tr id={"nested" + idx} key={idx}>
                                              <td>
                                                <div className="form-floating mb-3">
                                                  <select
                                                    value={
                                                      formData?.[
                                                      "vend_grp" + (idx + 2)
                                                      ]
                                                    }
                                                    onChange={async event => {
                                                      const selectedOption =
                                                        optionVendorGroup?.find(
                                                          option =>
                                                            option.value ==
                                                            event.target.value
                                                        );
                                                      setFormData(prevData => ({
                                                        ...prevData,
                                                        ["vend_grp" +
                                                          (idx + 2)]:
                                                          selectedOption?.value,
                                                      }));
                                                    }}
                                                    className="form-select"
                                                  >
                                                    <option value="0">
                                                      Select VendorGroup
                                                    </option>
                                                    {optionVendorGroup?.map(
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
                                                  <label htmlFor="vend_grp1">
                                                    {"Vendor Group " +
                                                      (idx + 2)}
                                                  </label>
                                                </div>
                                              </td>
                                            </tr>
                                          </Col>
                                          <Col lg="1">
                                            <Button
                                              onClick={() =>
                                                handleRemoveRowNestedVendgrp(
                                                  idx
                                                )
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
                                    <Row>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.vendor_group_id}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionVendorGroup.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                vendor_group_id:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Vendor Group
                                            </option>
                                            {optionVendorGroup?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="vendor_group_id">
                                            Vendor Group
                                          </label>
                                          {formErrors.vendor_group_id && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.vendor_group_id}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="vendor_classification"
                                            name="vendor_classification"
                                            placeholder="Enter Vendor Classification"
                                            onChange={handleChange}
                                            value={
                                              formData?.vendor_classification
                                            }
                                          />
                                          <label htmlFor="vendor_classification">
                                            Vendor Classification
                                          </label>
                                          {formErrors.vendor_classification && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.vendor_classification}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={
                                              formData?.purchase_organisation_id
                                            }
                                            onChange={async event => {
                                              const selectedOption =
                                                optionPurchaseOrganisation.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                purchase_organisation_id:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Purchase Organisation
                                            </option>
                                            {optionPurchaseOrganisation?.map(
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
                                          <label htmlFor="purchase_organisation_id">
                                            Purchase Organisation
                                          </label>
                                          {formErrors.purchase_organisation_id && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {
                                                formErrors.purchase_organisation_id
                                              }
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg="3">
                                        <div className="form-floating mb-3">
                                          <Input
                                            type="text"
                                            className="inner form-control"
                                            placeholder="Ext VendorCode 1"
                                            onChange={event => {
                                              setFormData(prevData => ({
                                                ...prevData,
                                                ext_vendor_code1:
                                                  event.target.value,
                                              }));
                                            }}
                                            value={formData?.ext_vendor_code1}
                                          />
                                          <label htmlFor="ext_vendor_code1">
                                            Ext VendorCode 1
                                          </label>
                                          {formErrors.ext_vendor_code1 && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.ext_vendor_code1}
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

                                      {extVendorCode?.map((item1, idx) => (
                                        <>
                                          <Col lg="3" key={`col-${idx}`}>
                                            <tr id={"nested" + idx}>
                                              <td>
                                                <div className="form-floating mb-3">
                                                  <Input
                                                    type="text"
                                                    className={`inner form-control ${formErrors[
                                                        `ext_vendor_code${idx + 2
                                                        }`
                                                      ]
                                                        ? "is-invalid"
                                                        : ""
                                                      }`}
                                                    placeholder={
                                                      "Ext Vendor Code " +
                                                      (idx + 2)
                                                    }
                                                    onChange={event => {
                                                      setFormData(prevData => ({
                                                        ...prevData,
                                                        ["ext_vendor_code" +
                                                          (idx + 2)]:
                                                          event.target.value,
                                                      }));
                                                    }}
                                                    value={
                                                      formData?.[
                                                      "ext_vendor_code" +
                                                      (idx + 2)
                                                      ] || ""
                                                    }
                                                  />
                                                  <label
                                                    htmlFor={`ext_vendor_code${idx + 2
                                                      }`}
                                                  >
                                                    {"Ext Vendor Code " +
                                                      (idx + 2)}
                                                  </label>
                                                  {formErrors[
                                                    `ext_vendor_code${idx + 2}`
                                                  ] && (
                                                      <div className="invalid-feedback">
                                                        {
                                                          formErrors[
                                                          `ext_vendor_code${idx + 2
                                                          }`
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
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.customer_id}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionCustomer.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                customer_id:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Customer
                                            </option>
                                            {optionCustomer?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="customer_id">
                                            Customer
                                          </label>
                                          {formErrors.customer_id && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.customer_id}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="previous_account_number"
                                            name="previous_account_number"
                                            placeholder="Enter Vendor Code"
                                            onChange={handleChange}
                                            value={
                                              formData?.previous_account_number
                                            }
                                          />
                                          <label htmlFor="previous_account_number">
                                            Previous Account No.
                                          </label>
                                          {formErrors.previous_account_number && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {
                                                formErrors.previous_account_number
                                              }
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
                                            id="iec_code"
                                            name="iec_code"
                                            placeholder="Enter IEC Code"
                                            onChange={handleChange}
                                            value={formData?.iec_code}
                                          />
                                          <label htmlFor="iec_code">
                                            IEC Code
                                          </label>
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
                                      <Col lg="4">
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
                                      <Col lg="4">
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
                                          <label htmlFor="valid_to">
                                            Valid To
                                          </label>
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
                                    </Row>
                                    <Row>
                                      <Col lg="3">
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
                                          <label htmlFor="address_1">
                                            Address
                                          </label>
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
                                      {address?.map((item1, idx) => (
                                        <>
                                          <Col
                                            lg="3"
                                            key={`address-col-${idx}`}
                                          >
                                            <tr id={"nested" + idx}>
                                              <td>
                                                <div className="form-floating mb-3">
                                                  <Input
                                                    type="text"
                                                    className={`inner form-control ${formErrors[
                                                        `address_${idx + 2}`
                                                      ]
                                                        ? "is-invalid"
                                                        : ""
                                                      }`}
                                                    placeholder={
                                                      "Address " + (idx + 2)
                                                    }
                                                    onChange={event => {
                                                      setFormData(prevData => ({
                                                        ...prevData,
                                                        ["address_" +
                                                          (idx + 2)]:
                                                          event.target.value,
                                                      }));
                                                    }}
                                                    value={
                                                      formData?.[
                                                      "address_" + (idx + 2)
                                                      ] || ""
                                                    }
                                                  />
                                                  <label
                                                    htmlFor={`address_${idx + 2
                                                      }`}
                                                  >
                                                    {"Address " + (idx + 2)}
                                                  </label>
                                                  {formErrors[
                                                    `address_${idx + 2}`
                                                  ] && (
                                                      <div className="invalid-feedback">
                                                        {
                                                          formErrors[
                                                          `address_${idx + 2}`
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
                                                handleRemoveRowNestedAddress(
                                                  idx
                                                )
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

                                      <Col lg="3">
                                        <div className="form-floating mb-3">
                                          <Input
                                            type="text"
                                            className="inner form-control"
                                            placeholder="Tax Id 1"
                                            onChange={event => {
                                              setFormData(prevData => ({
                                                ...prevData,
                                                tax_id_1: event.target.value,
                                              }));
                                            }}
                                            value={formData?.tax_id_1}
                                          />
                                          <label htmlFor="tax_id_1">
                                            Tax Id 1
                                          </label>
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
                                          <Col lg="3" key={`tax-col-${idx}`}>
                                            <tr id={"nested" + idx}>
                                              <td>
                                                <div className="form-floating mb-3">
                                                  <Input
                                                    type="text"
                                                    className={`inner form-control ${formErrors[
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
                                                    htmlFor={`tax_id_${idx + 2
                                                      }`}
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

                                      <Col lg="4">
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
                                      <Col lg="3">
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
                                          <Col lg="3" key={`text-col-${idx}`}>
                                            <tr id={"nested" + idx}>
                                              <td>
                                                <div className="form-floating mb-3">
                                                  <Input
                                                    type="text"
                                                    className={`inner form-control ${formErrors[
                                                        `text${idx + 2}`
                                                      ]
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
                                                  <label
                                                    htmlFor={`text${idx + 2}`}
                                                  >
                                                    {"Text " + (idx + 2)}
                                                  </label>
                                                  {formErrors[
                                                    `text${idx + 2}`
                                                  ] && (
                                                      <div className="invalid-feedback">
                                                        {
                                                          formErrors[
                                                          `text${idx + 2}`
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

                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.purchase_group_id}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionPurchaseGroup.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                purchase_group_id:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Purchase Group
                                            </option>
                                            {optionPurchaseGroup?.map(
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
                                          <label htmlFor="purchase_group_id">
                                            Purchase Group
                                          </label>
                                          {formErrors.purchase_group_id && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.purchase_group_id}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.employee_id}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionEmployee.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                employee_id:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Employee
                                            </option>
                                            {optionEmployee?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="employee_id">
                                            Employee
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
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <div className="form-check mb-3">
                                            <input
                                              type="checkbox"
                                              className="form-check-input input-mini"
                                              id="procurement_block"
                                              checked={
                                                formData?.procurement_block
                                              }
                                              onChange={event => {
                                                setFormData(prevData => ({
                                                  ...prevData,
                                                  procurement_block:
                                                    event.target.checked,
                                                }));
                                              }}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor="procurement_block"
                                            >
                                              Procurement Block
                                            </label>
                                            {formErrors.procurement_block && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {formErrors.procurement_block}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </Col>
                                      <Col lg="4">
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
                                      <Col lg="4">
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
                                    </Row>
                                    <Row>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
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
                                          >
                                            <option value="0">
                                              Select Payment Terms
                                            </option>
                                            {optionPaymentTerms?.map(option => (
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
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.inco_term_id}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionIncoTerm.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                inco_term_id:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Inco Term
                                            </option>
                                            {optionIncoTerm?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="inco_term_id">
                                            Inco Term
                                          </label>
                                          {formErrors.inco_term_id && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.inco_term_id}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
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
                                    </Row>
                                    <Row>
                                      <Col lg="4">
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
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={
                                              formData?.withholding_tax_type_id
                                            }
                                            onChange={async event => {
                                              const selectedOption =
                                                optionWithholdingTax.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                withholding_tax_type_id:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Withholding Tax Type
                                            </option>
                                            {optionWithholdingTax?.map(
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
                                          <label htmlFor="withholding_tax_type_id">
                                            Withholding Tax Type
                                          </label>
                                          {formErrors.withholding_tax_type_id && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {
                                                formErrors.withholding_tax_type_id
                                              }
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="delivery_lead_time"
                                            name="delivery_lead_time"
                                            placeholder="Enter Delivery Lead Time"
                                            onChange={handleChange}
                                            value={formData?.delivery_lead_time}
                                          />
                                          <label htmlFor="delivery_lead_time">
                                            Delivery Lead Time
                                          </label>
                                          {formErrors.delivery_lead_time && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.delivery_lead_time}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={
                                              formData?.revenue_indicator_id
                                            }
                                            onChange={async event => {
                                              const selectedOption =
                                                optionRevenueIndicator.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                revenue_indicator_id:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Revenue Indicator
                                            </option>
                                            {optionRevenueIndicator?.map(
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
                                          <label htmlFor="revenue_indicator_id">
                                            Revenue Indicator
                                          </label>
                                          {formErrors.revenue_indicator_id && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.revenue_indicator_id}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
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
                                              const selectedValue = event.target.value;
                                              const isGstRequired = selectedValue === "unregistered";

                                              setFormData(prevData => ({
                                                ...prevData,
                                                gst_registration_type: selectedValue,
                                                gstin: isGstRequired ? "" : prevData.gstin,
                                              }));
                                            }}
                                            className="form-select"
                                            id="gst_registration_type"
                                          >
                                            <option value="regular"> Regular </option>
                                            <option value="composition"> Composition </option>
                                            <option value="unregistered"> Unregistered/Consumer </option>
                                          </select>
                                          <label htmlFor="gst_registration_type">Regestration Type</label>
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
                                            disabled={ formData?.gst_registration_type === "unregistered" }
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
                                          <Label className="mb-0">Set/Alter Additional GST Details</Label>
                                          <div className="form-check form-switch m-0">
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              id="additional_gst_details"
                                              checked={formData?.additional_gst_details}
                                              onChange={(e) => {
                                                setFormData(prev => ({
                                                  ...prev,
                                                  additional_gst_details: e.target.checked,
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
                                              style={{ whiteSpace: 'nowrap' }}
                                            >
                                              {formData.additional_gst_details ? "Yes" : "No"}
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
                                                    place_of_supply: selectedOption?.value,
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
                                              <label htmlFor="place_of_supply">Place of Supply (for Outwards)</label>
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
                                              <Label className="mb-0">Is the Party a Transporter</Label>
                                              <div className="form-check form-switch m-0">
                                                <input
                                                  type="checkbox"
                                                  className="form-check-input"
                                                  id="is_party_transporter"
                                                  checked={formData?.is_party_transporter}
                                                  onChange={(e) => {
                                                    setFormData(prev => ({
                                                      ...prev,
                                                      is_party_transporter: e.target.checked
                                                    }));
                                                  }}
                                                />
                                                <label
                                                  className="form-check-label ms-2"
                                                  htmlFor="is_party_transporter"
                                                  style={{ whiteSpace: 'nowrap' }}
                                                >
                                                  {formData.is_party_transporter ? "Yes" : "No"}
                                                </label>
                                              </div>
                                            </div>
                                          </Col>
                                        </>
                                      )}
                                    </Row>

                                    {formData.additional_gst_details && formData.is_party_transporter && (
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
                                            value={
                                              formData?.bank_account_number
                                            }
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
                                            name="bank_account_holdername"
                                            placeholder="Enter Bank Account Holder Name"
                                            onChange={handleChange}
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
                                              {
                                                formErrors.bank_account_holdername
                                              }
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
                                        {addVendor?.success === true ||
                                          updateVendor?.success === true ? (
                                          <i className="mdi mdi-check-circle-outline text-success display-4" />
                                        ) : (
                                          <i className="mdi mdi-close-circle-outline text-danger display-4" />
                                        )}
                                      </div>
                                      <div>
                                        <h5>
                                          {addVendor?.message ||
                                            updateVendor?.message}
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
                                    pathname: "/vendor/" + mode,
                                    state: { editState: Edit },
                                  }}
                                  onClick={() => {
                                    if (activeTab == 2 || activeTab == 3 || activeTab == 4) {
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
                                    pathname: "/vendor/" + mode,
                                    state: { editState: Edit },
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
                    </Card>
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

export default Vendors;