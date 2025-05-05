import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Input,
  Alert,
} from "reactstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useLocation } from "react-router-dom";
import classnames from "classnames";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import "flatpickr/dist/themes/material_blue.css";
import { Title } from "../../../constants/layout";
import Flatpickr from "react-flatpickr";
import { getRelatedRecords } from "helpers/Api/api_common";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  GET_EMPLOYEEMASTER_REQUEST,
  ADD_EMPLOYEEMASTER_REQUEST,
  UPDATE_EMPLOYEEMASTER_REQUEST,
} from "../../../store/employeeMaster/actionTypes";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
import { IconButton } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import AddIcon from "@mui/icons-material/Add";

const AddEmployeeMaster = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    employeemaster,
    listEmployee,
    addEmployeeMaster,
    updateEmployeeMaster,
  } = useSelector(state => state.employeeMaster);
  const [loading, setLoading] = useState(false);
  const [Edit, setEdit] = useState(null);
  const mode = Edit === null ? "Add" : "Edit";
  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([]);
  const [extEmployeeCode, setExtEmployeeCode] = useState([]);
  const [emrAddress, setEmrAddress] = useState([]);
  const [emrName, setEmrName] = useState([]);
  const [emrPhone, setEmrPhone] = useState([]);
  const [address, setAddress] = useState([]);
  const [textId, setTextID] = useState([]);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [optionEmployeeGrp, setOptionEmployeeGrp] = useState([]);
  const [optionTitle, setOptionTitle] = useState(Title);
  const [optionEmployeeSubGrp, setOptionEmployeeSubGrp] = useState([]);
  const [optionVendorCode, setOptionVendorCode] = useState([]);
  const [optionCompany, setOptionCompany] = useState([]);
  const [optionCountry, setOptionCountry] = useState([]);
  const [optionState, setOptionState] = useState([]);
  const [optionCity, setOptionCity] = useState([]);
  const [optionCalender, setOptionCalender] = useState([]);
  const [optionSalesOrganization, setOptionOrganization] = useState([]);
  const [optionDivision, setOptionoptionDivision] = useState([]);
  const [optionDistributionChannel, setOptionoptionDistributionChannel] =
    useState([]);
  const [optionSalesOffice, setOptionSalesOffice] = useState([]);
  const [optionSalesGroup, setOptionSalesGroup] = useState([]);
  const [optionSupervisor, setOptionSupervisor] = useState([]);
  const [optionDesignation, setOptionDesignation] = useState([]);
  const [optionCurrency, setOptionCurrency] = useState([]);
  const [formData, setFormData] = useState({});
  const history = useHistory();

  const validateForm1 = () => {
    const errors = {};
    if (!formData.employee_code) {
      errors.employee_code = "Employee Code is required";
    } else if (formData.employee_code.length > 10) {
      errors.employee_code = "Employee Code cannot be more than 10 characters";
    }
    if (!formData.employee_group_id) {
      errors.employee_group_id = "Employee Group Id is required";
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
      errors.email_id = "Email cannot be more than 50 characters";
    }
    if (!formData.valid_from) {
      errors.valid_from = "Valid From is required";
    }
    if (!formData.valid_to) {
      errors.valid_to = "Valid To is required";
    }
    if (!formData.employee_sub_group) {
      errors.employee_sub_group = "Employee Sub Group is required";
    }
    if (!formData.vendor_id) {
      errors.vendor_id = "Vendor Code is required";
    }
    if (!formData.challenge_description) {
      errors.challenge_description = "Challenge Description is required";
    } else if (formData.challenge_description.length > 20) {
      errors.challenge_description =
        "Challenge Description cannot be more than 20 characters";
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
    if (!formData.pan_number) {
      errors.pan_number = "PanNumber is required";
    } else if (formData.pan_number.length > 50) {
      errors.pan_number = "Pan Number cannot be more than 50 characters";
    }
    if (!formData.aadhar_card) {
      errors.aadhar_card = "Aadhar Card is required";
    } else if (formData.aadhar_card.length > 12) {
      errors.aadhar_card = "Aadhar Card cannot be more than 12 characters";
    }
    if (!formData.calender_id) {
      errors.calender_id = "Calender is required";
    }
    if (!formData.previous_account_no) {
      errors.previous_account_no = "Previous Account No is required";
    } else if (formData.previous_account_no.length > 10) {
      errors.previous_account_no =
        "Previous Account Number cannot be more than 10 characters";
    }
    if (!formData.sales_organisation_id) {
      errors.sales_organisation_id = "Sales Organization is required";
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
      errors.sales_group_id = "Sales Group Id is required";
    }
    if (!formData.supervisor_id) {
      errors.supervisor_id = "Supervisor is required";
    }
    if (!formData.home_office_address) {
      errors.home_office_address = "Home/Office Address is required";
    } else if (formData.home_office_address.length > 150) {
      errors.home_office_address =
        "Home/Office Address cannot be more than 150 characters";
    }
    if (!formData.satellite_office_address) {
      errors.satellite_office_address = "Satellite Office Address is required";
    } else if (formData.satellite_office_address.length > 150) {
      errors.satellite_office_address =
        "Satellite Office Address cannot be more than 150 characters";
    }

    if (!formData.designation_id) {
      errors.designation_id = "Designation is required";
    }
    if (!formData.emr_address_1) {
      errors.emr_address_1 = "Employee Address is required";
    } else if (formData.emr_address_1.length > 150) {
      errors.emr_address_1 = "EMR ADDRESS 1 cannot be more than 150 characters";
    }
    emrAddress.forEach((_, idx) => {
      const fieldName = `emr_address_ ${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Emr Address ${idx + 2} is required`;
      } else if (value.length > 150) {
        errors[fieldName] = `Emr Address ${
          idx + 2
        } cannot exceed 150 characters`;
      }
    });
    if (!formData.emr_name_1) {
      errors.emr_name_1 = "Emergency Name is required";
    } else if (formData.emr_name_1.length > 70) {
      errors.emr_name_1 = "EMR NAME 1 cannot be more than 70 characters";
    }
    emrName.forEach((_, idx) => {
      const fieldName = `emr_name_ ${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Emr Name ${idx + 2} is required`;
      } else if (value.length > 70) {
        errors[fieldName] = `Emr Name ${idx + 2} cannot exceed 70 characters`;
      }
    });
    if (!formData.emr_phone_1) {
      errors.emr_phone_1 = "Emergency Phone is required";
    } else if (formData.emr_phone_1.length > 20) {
      errors.emr_phone_1 = "EMR PHONE 1 cannot be more than 20 characters";
    }
    emrPhone.forEach((_, idx) => {
      const fieldName = `emr_phone_ ${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Emr Phone ${idx + 2} is required`;
      } else if (value.length > 20) {
        errors[fieldName] = `Emr Phone ${idx + 2} cannot exceed 20 characters`;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const validateForm2 = () => {
    const errors = {};
    if (!formData.tenth_std_percentage) {
      errors.tenth_std_percentage = "10th Percentage is required";
    } else if (formData.tenth_std_percentage.length > 3) {
      errors.tenth_std_percentage =
        "10th Percentage cannot be more than 3 characters";
    }
    if (!formData.twelfth_std_percentage) {
      errors.twelfth_std_percentage = "12th Percentage is required";
    } else if (formData.twelfth_std_percentage.length > 3) {
      errors.twelfth_std_percentage =
        "12th Percentage cannot be more than 3 characters";
    }
    if (!formData.bachelors_degree) {
      errors.bachelors_degree = "Bachelors Degree is required";
    } else if (formData.bachelors_degree.length > 20) {
      errors.bachelors_degree =
        "Bachelors Degree cannot be more than 20 characters";
    }
    if (!formData.university_for_bachelors) {
      errors.university_for_bachelors = "University For Bachelors is required";
    } else if (formData.university_for_bachelors.length > 20) {
      errors.university_for_bachelors =
        "University For Bachelors cannot be more than 20 characters";
    }
    if (!formData.masters_degree) {
      errors.masters_degree = "Master Degree is required";
    } else if (formData.masters_degree.length > 20) {
      errors.masters_degree = "Master Degree cannot be more than 20 characters";
    }
    if (!formData.university_for_masters) {
      errors.university_for_masters = "University For Masters is required";
    } else if (formData.university_for_masters.length > 20) {
      errors.university_for_masters =
        "University For Masters cannot be more than 20 characters";
    }
    if (!formData.bachelors_percentage) {
      errors.bachelors_percentage = "Bachelors Percentage is required";
    } else if (formData.bachelors_percentage.length > 3) {
      errors.bachelors_percentage =
        "Bachelors Percentage cannot be more than 3 characters";
    }
    if (!formData.stream_of_education) {
      errors.stream_of_education = "Stream Of Education is required";
    } else if (formData.stream_of_education.length > 20) {
      errors.stream_of_education =
        "Stream Of Education cannot be more than 20 characters";
    }
    if (!formData.phd_degree_subject) {
      errors.phd_degree_subject = "Phd Degree Subject is required";
    } else if (formData.phd_degree_subject.length > 20) {
      errors.phd_degree_subject =
        "Phd Degree Subject cannot be more than 20 characters";
    }
    if (!formData.masters_percentage) {
      errors.masters_percentage = "Masters Percentage is required";
    } else if (formData.masters_percentage.length > 3) {
      errors.masters_percentage =
        "Masters Percentage cannot be more than 3 characters";
    }
    if (!formData.ext_emp_cd_1) {
      errors.ext_emp_cd_1 = "Ext Employee Code 1 is required";
    } else if (formData.ext_emp_cd_1.length > 10) {
      errors.ext_emp_cd_1 =
        "Ext Employee Code 1 cannot be more than 10 characters";
    }
    extEmployeeCode.forEach((_, idx) => {
      const fieldName = `ext_emp_cd_ ${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Ext Emp Code ${idx + 2} is required`;
      } else if (value.length > 10) {
        errors[fieldName] = `Ext Emp Code ${
          idx + 2
        } cannot exceed 10 characters`;
      }
    });
    if (!formData.swift_code) {
      errors.swift_code = "Swift Code is required";
    } else if (formData.swift_code.length > 40) {
      errors.swift_code = "Swift Code cannot be more than 40 characters";
    }
    if (!formData.iban_number) {
      errors.iban_number = "Iban Number is required";
    } else if (formData.iban_number.length > 40) {
      errors.iban_number = "Iban Number  cannot be more than 40 characters";
    }
    if (!formData.currency_id) {
      errors.currency_id = "Currency is required";
    }
    // if (!formData.block_indicator) {
    //   errors.block_indicator = "Block Indicator is required";
    // }
    if (!formData.challenge_indicator) {
      errors.challenge_indicator = "Challenge Indicator is required";
    }
    // if (!formData.deletion_indicator) {
    //   errors.deletion_indicator = "Deletion Block is required";
    // }
    if (!formData.address_data_1) {
      errors.address_data_1 = "Address is required";
    } else if (formData.address_data_1.length > 50) {
      errors.address_data_1 = "Address 1 cannot be more than 50 characters";
    }
    address.forEach((_, idx) => {
      const fieldName = `address_data_ ${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Address Data ${idx + 2} is required`;
      } else if (value.length > 50) {
        errors[fieldName] = `Address Data ${
          idx + 2
        } cannot exceed 50 characters`;
      }
    });
    if (!formData.text1) {
      errors.text1 = "Text 1 is required";
    } else if (formData.text1.length > 100) {
      errors.text1 = "Text 1 cannot be more than 100 characters";
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
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const validateForm3 = () => {
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
    if (!formData.bank_account_holder_name) {
      errors.bank_account_holder_name = "Bank Account Holder is required";
    } else if (formData.bank_account_holder_name.length > 50) {
      errors.bank_account_holder_name =
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
    const inputValue = event.target.value.toUpperCase(); // Convert input to uppercase
    const isValid = /^[A-Z]$/.test(inputValue); // Regex to test single character A-Z
    const { name, value } = event.target;
    let newValue = value;

    // FIRST NAME CODE
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

    // LAST NAME CODE
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

    // Challenge Description CODE
    if (name === "challenge_description" && value.length > 20) {
      newValue = value.slice(0, 20);
      setFormErrors({
        ...formErrors,
        challenge_description:
          "Challenge Description cannot be more than 20 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        challenge_description: "",
      });
    }

    // CITY CODE
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

    // PINCODE LENGTH VALIDATION
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

    // PAN NUMBER LENGTH VALIDATION
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

    // PREVIOUS ACCOUNT NUMBER
    if (name === "previous_account_no" && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        previous_account_no:
          "Previous Account Number cannot be more than 10 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        previous_account_no: "",
      });
    }

    // EMR ADDRESS 1 CODE
    if (name === "emr_address_1" && value.length > 150) {
      newValue = value.slice(0, 150);
      setFormErrors({
        ...formErrors,
        emr_address_1: "EMR ADDRESS 1 cannot be more than 150 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        emr_address_1: "",
      });
    }

    // EMR NAME 1 CODE
    if (name === "emr_name_1" && value.length > 70) {
      newValue = value.slice(0, 70);
      setFormErrors({
        ...formErrors,
        emr_name_1: "EMR Name 1 cannot be more than 70 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        emr_name_1: "",
      });
    }

    // EMR PHONE 1 CODE
    if (name === "emr_phone_1" && value.length > 70) {
      newValue = value.slice(0, 70);
      setFormErrors({
        ...formErrors,
        emr_phone_1: "EMR Phone 1 cannot be more than 70 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        emr_phone_1: "",
      });
    }

    // tenth_std_percentage CODE
    if (name === "tenth_std_percentage" && value.length > 3) {
      newValue = value.slice(0, 3);
      setFormErrors({
        ...formErrors,
        tenth_std_percentage:
          "10th Percentage cannot be more than 3 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        tenth_std_percentage: "",
      });
    }

    // twelfth_std_percentage CODE
    if (name === "twelfth_std_percentage" && value.length > 3) {
      newValue = value.slice(0, 3);
      setFormErrors({
        ...formErrors,
        twelfth_std_percentage:
          "12th Percentage cannot be more than 3 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        twelfth_std_percentage: "",
      });
    }

    // bachelors_degree CODE
    if (name === "bachelors_degree" && value.length > 20) {
      newValue = value.slice(0, 20);
      setFormErrors({
        ...formErrors,
        bachelors_degree: "Bachelors Degree cannot be more than 20 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        bachelors_degree: "",
      });
    }

    // university_for_bachelors CODE
    if (name === "university_for_bachelors" && value.length > 20) {
      newValue = value.slice(0, 20);
      setFormErrors({
        ...formErrors,
        university_for_bachelors:
          "University For Bachelors cannot be more than 20 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        university_for_bachelors: "",
      });
    }

    // masters_degree CODE
    if (name === "masters_degree" && value.length > 20) {
      newValue = value.slice(0, 20);
      setFormErrors({
        ...formErrors,
        masters_degree: "Masters Degree cannot be more than 20 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        masters_degree: "",
      });
    }

    // university_for_masters CODE
    if (name === "university_for_masters" && value.length > 20) {
      newValue = value.slice(0, 20);
      setFormErrors({
        ...formErrors,
        university_for_masters:
          "University For Masters cannot be more than 20 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        university_for_masters: "",
      });
    }

    // bachelors_percentage CODE
    if (name === "bachelors_percentage" && value.length > 3) {
      newValue = value.slice(0, 3);
      setFormErrors({
        ...formErrors,
        bachelors_percentage:
          "Bachelors Percentage cannot be more than 3 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        bachelors_percentage: "",
      });
    }

    // masters_percentage CODE
    if (name === "masters_percentage" && value.length > 3) {
      newValue = value.slice(0, 3);
      setFormErrors({
        ...formErrors,
        masters_percentage:
          "Masters Percentage cannot be more than 3 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        masters_percentage: "",
      });
    }

    // stream_of_education CODE
    if (name === "stream_of_education" && value.length > 20) {
      newValue = value.slice(0, 20);
      setFormErrors({
        ...formErrors,
        stream_of_education:
          "Stream Of Education cannot be more than 20 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        stream_of_education: "",
      });
    }

    // phd_degree_subject CODE
    if (name === "phd_degree_subject" && value.length > 20) {
      newValue = value.slice(0, 20);
      setFormErrors({
        ...formErrors,
        phd_degree_subject:
          "Phd Degree Subject cannot be more than 20 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        phd_degree_subject: "",
      });
    }

    // ext_emp_cd_1 CODE
    if (name === "ext_emp_cd_1" && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        ext_emp_cd_1: "Ext EMP CD cannot be more than 10 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        ext_emp_cd_1: "",
      });
    }

    // SWIFT CODE
    if (name === "swift_code" && value.length > 40) {
      newValue = value.slice(0, 40);
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

    // IBAN NUMBER
    if (name === "iban_number" && value.length > 40) {
      newValue = value.slice(0, 40);
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

    // ADDRESS CODE
    if (name === "address_data_1" && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        address_data_1: "ADDRESS cannot be more than 50 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        address_data_1: "",
      });
    }

    // Text CODE
    if (name === "text1" && value.length > 100) {
      newValue = value.slice(0, 100);
      setFormErrors({
        ...formErrors,
        text1: "Text cannot be more than 100 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        text1: "",
      });
    }

    // BANK NAME CODE
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

    // BANK ACCOUNT NUMBER CODE
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

    // BANK ACCOUNT HOLDER NAME CODE
    if (name === "bank_account_holder_name" && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        bank_account_holder_name:
          "Bank Account Name cannot be more than 50 characters",
      });
    } else {
      setFormErrors({
        ...formErrors,
        bank_account_holder_name: "",
      });
    }

    // BANK BRANCH CODE
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

    // IFSC CODE
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

    // BANK ADDRESS CODE
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

  const tabAction = tab => {
    if (activeTab !== tab && tab >= 1 && tab <= 4) {
      var newPassedSteps;
      if (tab === 4) {
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

  const listState = async country_id => {
    const selectStateData = await getRelatedRecords(
      "states",
      "state_name_alias",
      "country_id",
      country_id
    );
    setOptionState(selectStateData?.getRelatedRecordsData);
  };

  const toggleTab = tab => {
    if (!Edit) {
      localStorage.setItem("employeeData", JSON.stringify(formData));
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
      if (Edit) {
        //Edit  Employee Api Calling
        setLoading(true);
        const Id = Edit.id;
        const data = {
          formData,
          Id,
        };
        dispatch({
          type: UPDATE_EMPLOYEEMASTER_REQUEST,
          payload: data,
        });
      } else {
        //Add EMployee Api Calling
        setLoading(true);
        const data = {
          formData,
        };
        dispatch({
          type: ADD_EMPLOYEEMASTER_REQUEST,
          payload: data,
        });
      }
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 4 && tab == 3) {
      tabAction(tab);
    }
  };
  useEffect(() => {
    if (activeTab === 4) {
      const timer = setTimeout(() => {
        history.push("/hrdata/employee_master");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeTab, history]);
  useEffect(() => {
    if (addEmployeeMaster?.success === true) {
      setLoading(false);
      setToastMessage("New Employee Created Successfully");
      localStorage.removeItem("employeeData");
    }
    if (updateEmployeeMaster?.success === true) {
      setLoading(false);
      setToastMessage("New Employee Updated Successfully");
    }
    if (listEmployee) {
      if (employeemaster) {
        setOptionEmployeeGrp(employeemaster?.employee_groups);
        setOptionEmployeeSubGrp(employeemaster?.employee_sub_groups);
        setOptionVendorCode(employeemaster?.vendors);
        setOptionCompany(employeemaster?.companies);
        setOptionCountry(employeemaster?.countries);
        if (Edit) {
          setOptionState(employeemaster?.states);
        }
        setOptionCalender(employeemaster?.calenders);
        setOptionOrganization(employeemaster?.sales_organisations);
        setOptionoptionDivision(employeemaster?.divisions);
        setOptionoptionDistributionChannel(employeemaster?.distributions);
        setOptionSalesOffice(employeemaster?.sales_offices);
        setOptionSalesGroup(employeemaster?.sales_groups);
        setOptionSupervisor(employeemaster?.supervisors);
        setOptionDesignation(employeemaster?.designations);
        setOptionCurrency(employeemaster?.currencies);
      }
    }
  }, [listEmployee, addEmployeeMaster, updateEmployeeMaster, employeemaster]);

  useEffect(() => {
    const employeeData = JSON.parse(localStorage.getItem("employeeData"));
    const { editEmployee } = location.state || {};
    if (editEmployee) {
      //Edit section
      setEdit(editEmployee);
      if (editEmployee.country_id && editEmployee.state_id) {
        listState(editEmployee.country_id?.value);
      }
      setFormData({
        employee_code: editEmployee.employee_code || "",
        employee_group_id: editEmployee.employeegroup?.value || "",
        title: editEmployee.title || "",
        firstname: editEmployee.firstname || "",
        lastname: editEmployee.lastname || "",
        telephone: editEmployee.telephone || "",
        mobile: editEmployee.mobile || "",
        email_id: editEmployee.email_id || "",
        valid_from: moment(editEmployee.valid_from).format("DD/MM/YYYY") || "",
        valid_to: moment(editEmployee.valid_to).format("DD/MM/YYYY") || "",
        employee_sub_group: editEmployee.employeesubgroup?.value || "",
        challenge_description: editEmployee.challenge_description || "",
        vendor_id: editEmployee.vendor?.value || "",
        company_id: editEmployee.company?.value || "",
        country_id: editEmployee.country?.value || "",
        state_id: editEmployee.state?.value || "",
        city: editEmployee.city || "",
        pincode: editEmployee.pincode || "",
        pan_number: editEmployee.pan_number || "",
        aadhar_card: editEmployee.aadhar_card || "",
        calender_id: editEmployee.calender?.value || "",
        emr_address_1: editEmployee.emr_address_1 || "",
        sales_organisation_id: editEmployee.salesorg?.value || "",
        division_id: editEmployee.division?.value || "",
        distribution_channel_id: editEmployee.distribution?.value || "",
        sales_office_id: editEmployee.salesoffice?.value || "",
        sales_group_id: editEmployee.salesgroup?.value || "",
        supervisor_id: editEmployee.supervisor?.value || 0,
        home_office_address: editEmployee.home_office_address || "",
        satellite_office_address: editEmployee.satellite_office_address || "",
        designation_id: editEmployee.designation?.value || "",
        previous_account_no: editEmployee.previous_account_no || "",
        tenth_std_percentage: editEmployee.tenth_std_percentage || "",
        twelfth_std_percentage: editEmployee.twelfth_std_percentage || "",
        bachelors_degree: editEmployee.bachelors_degree || "",
        university_for_bachelors: editEmployee.university_for_bachelors || "",
        masters_degree: editEmployee.masters_degree || "",
        university_for_masters: editEmployee.university_for_masters || "",
        bachelors_percentage: editEmployee.bachelors_percentage || "",
        stream_of_education: editEmployee.stream_of_education || "",
        phd_degree_subject: editEmployee.phd_degree_subject || "",
        masters_percentage: editEmployee.masters_percentage || "",
        ext_emp_cd_1: editEmployee.ext_emp_cd_1 || "",
        ext_emp_cd_2: editEmployee.ext_emp_cd_2 || "",
        ext_emp_cd_3: editEmployee.ext_emp_cd_3 || "",
        emr_name_1: editEmployee.emr_name_1 || "",
        emr_name_2: editEmployee.emr_name_2 || "",
        emr_name_3: editEmployee.emr_name_3 || "",
        emr_phone_1: editEmployee.emr_phone_1 || "",
        emr_phone_2: editEmployee.emr_phone_2 || "",
        emr_phone_3: editEmployee.emr_phone_3 || "",
        swift_code: editEmployee.swift_code || "",
        iban_number: editEmployee.iban_number || "",
        challenge_indicator: editEmployee.challenge_indicator || "",
        address_data_1: editEmployee.address_data_1 || "",
        address_data_2: editEmployee.address_data_2 || "",
        address_data_3: editEmployee.address_data_3 || "",
        currency_id: editEmployee.currency?.value || "",
        text1: editEmployee.text1 || "",
        text2: editEmployee.text2 || "",
        text3: editEmployee.text3 || "",
        text4: editEmployee.text4 || "",
        text5: editEmployee.text5 || "",
        bank_name: editEmployee.bank_name || "",
        bank_address: editEmployee.bank_address || "",
        bank_branch_code: editEmployee.bank_branch_code || "",
        ifsc_code: editEmployee.ifsc_code || "",
        bank_account_number: editEmployee.bank_account_number || "",
        bank_account_holder_name: editEmployee.bank_account_holder_name || "",
      });
    } else {
      //Add section localStorage Data
      setEdit(null);
      if (employeeData) {
        if (employeeData.country_id && employeeData.state_id) {
          listState(employeeData.country_id);
        }
        setFormData({
          employee_code: employeeData.employee_code || "",
          employee_group_id: employeeData.employee_group_id || "",
          title: employeeData.title || "",
          firstname: employeeData.firstname || "",
          lastname: employeeData.lastname || "",
          telephone: employeeData.telephone || "",
          mobile: employeeData.mobile || "",
          email_id: employeeData.email_id || "",
          valid_from: employeeData.valid_from || "",
          valid_to: employeeData.valid_to || "",
          employee_sub_group: employeeData.employee_sub_group || "",
          challenge_description: employeeData.challenge_description || "",
          vendor_id: employeeData.vendor_id || "",
          company_id: employeeData.company_id || "",
          country_id: employeeData.country_id || "",
          state_id: employeeData.state_id || "",
          city: employeeData.city || "",
          pincode: employeeData.pincode || "",
          pan_number: employeeData.pan_number || "",
          aadhar_card: employeeData.aadhar_card || "",
          calender_id: employeeData.calender_id || "",
          emr_address_1: employeeData?.emr_address_1 || "",
          sales_organisation_id: employeeData.sales_organisation_id || "",
          division_id: employeeData.division_id || "",
          distribution_channel_id: employeeData.distribution_channel_id || "",
          sales_office_id: employeeData.sales_office_id || "",
          sales_group_id: employeeData.sales_group_id || "",
          supervisor_id: employeeData.supervisor_id || 0,
          home_office_address: employeeData.home_office_address || "",
          satellite_office_address: employeeData.satellite_office_address || "",
          designation_id: employeeData.designation_id || "",
          previous_account_no: employeeData.previous_account_no || "",
          tenth_std_percentage: employeeData.tenth_std_percentage || "",
          twelfth_std_percentage: employeeData.twelfth_std_percentage || "",
          bachelors_degree: employeeData.bachelors_degree || "",
          university_for_bachelors: employeeData.university_for_bachelors || "",
          masters_degree: employeeData.masters_degree || "",
          university_for_masters: employeeData.university_for_masters || "",
          bachelors_percentage: employeeData.bachelors_percentage || "",
          stream_of_education: employeeData.stream_of_education || "",
          phd_degree_subject: employeeData.phd_degree_subject || "",
          masters_percentage: employeeData.masters_percentage || "",
          ext_emp_cd_1: employeeData.ext_emp_cd_1 || "",
          ext_emp_cd_2: employeeData.ext_emp_cd_2 || "",
          ext_emp_cd_3: employeeData.ext_emp_cd_3 || "",
          emr_name_1: employeeData.emr_name_1 || "",
          emr_name_2: employeeData.emr_name_2 || "",
          emr_name_3: employeeData.emr_name_3 || "",
          emr_phone_1: employeeData.emr_phone_1 || "",
          emr_phone_2: employeeData.emr_phone_2 || "",
          emr_phone_3: employeeData.emr_phone_3 || "",
          swift_code: employeeData.swift_code || "",
          iban_number: employeeData.iban_number || "",
          // block_indicator: employeeData.block_indicator || "",
          challenge_indicator: employeeData.challenge_indicator || "",
          // deletion_indicator: employeeData.deletion_indicator || "",
          address_data_1: employeeData.address_data_1 || "",
          address_data_2: employeeData.address_data_2 || "",
          address_data_3: employeeData.address_data_3 || "",
          currency_id: employeeData.currency_id || "",
          text1: employeeData.text1 || "",
          text2: employeeData.text2 || "",
          text3: employeeData.text3 || "",
          text4: employeeData.text4 || "",
          text5: employeeData.text5 || "",
          bank_name: employeeData.bank_name || "",
          bank_address: employeeData.bank_address || "",
          bank_branch_code: employeeData.bank_branch_code || "",
          ifsc_code: employeeData.ifsc_code || "",
          bank_account_number: employeeData.bank_account_number || "",
          bank_account_holder_name: employeeData.bank_account_holder_name || "",
        });
      }
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: GET_EMPLOYEEMASTER_REQUEST,
      payload: [],
    });
  }, []);

  const handleAddRowNestedEXt = () => {
    if (extEmployeeCode.length < 2) {
      const newItem = { name1: "" };
      setExtEmployeeCode([...extEmployeeCode, newItem]);
    }
  };

  const handleRemoveRowNestedExt = idx => {
    setFormData(prevData => ({
      ...prevData,
      ["ext_emp_cd_" + (idx + 2)]: "",
    }));
    const updatedRows = [...extEmployeeCode];
    updatedRows.splice(idx, 1);
    setExtEmployeeCode(updatedRows);
  };

  const handleAddRowNestedEmr = () => {
    if (emrAddress.length < 2) {
      const newItem = { name1: "" };
      setEmrAddress([...emrAddress, newItem]);
    }
  };

  const handleRemoveRowNestedEmr = idx => {
    setFormData(prevData => ({
      ...prevData,
      ["emr_address_" + (idx + 2)]: "",
    }));
    const updatedRows = [...emrAddress];
    updatedRows.splice(idx, 1);
    setEmrAddress(updatedRows);
  };

  const handleAddRowNestedEmrName = () => {
    if (emrName.length < 2) {
      const newItem = { name1: "" };
      setEmrName([...emrName, newItem]);
    }
  };

  const handleRemoveRowNestedEmrName = idx => {
    setFormData(prevData => ({
      ...prevData,
      ["emr_name_" + (idx + 2)]: "",
    }));
    const updatedRows = [...emrName];
    updatedRows.splice(idx, 1);
    setEmrName(updatedRows);
  };

  const handleRemoveRowNestedEmrPhone = idx => {
    setFormData(prevData => ({
      ...prevData,
      ["emr_phone_" + (idx + 2)]: "",
    }));
    const updatedRows = [...emrPhone];
    updatedRows.splice(idx, 1);
    setEmrPhone(updatedRows);
  };
  const handleAddRowNestedEmrPhone = () => {
    if (emrPhone.length < 2) {
      const newItem = { name1: "" };
      setEmrPhone([...emrPhone, newItem]);
    }
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
      ["address_data_" + (idx + 2)]: "",
    }));
    const updatedRows = [...address];
    updatedRows.splice(idx, 1);
    setAddress(updatedRows);
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

  document.title = "Detergent | " + mode + " Employee Master";
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
            titlePath="/hrdata/employee_master"
            title="Employee Master"
            breadcrumbItem={mode + " Employee Master"}
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
                        <h4 className="card-title mb-4">Employee Details</h4>
                        <div className="wizard clearfix ">
                          <div className="custom-tabs-wrapper">
                            <ul className="custom-tab-nav">
                              {[
                                { id: 1, label: "Employee Details" },
                                { id: 2, label: "Employee Education Details" },
                                { id: 3, label: "Bank Details" },
                                { id: 4, label: "Confirm Detail" },
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
                                      tab.id !== 1 &&
                                      !passedSteps.includes(tab.id)
                                    }
                                  >
                                    <span className="tab-index">
                                      {index + 1}
                                    </span>
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
                                          type="text"
                                          className="form-control"
                                          id="employee_code"
                                          placeholder="Enter Employee Code"
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              employee_code: event.target.value,
                                            }));
                                          }}
                                          value={formData?.employee_code}
                                        />
                                        <label htmlFor="employee_code">
                                          Employee Code
                                        </label>
                                        {formErrors.employee_code && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.employee_code}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={formData?.employee_group_id}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionEmployeeGrp.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              employee_group_id:
                                                selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Employee Group
                                          </option>
                                          {optionEmployeeGrp.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="employee_group_id">
                                          Employee Group
                                        </label>
                                        {formErrors.employee_group_id && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.employee_group_id}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
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
                                    {/* </Row>
                                  <Row> */}
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
                                          id="telephone"
                                          name="telephone"
                                          placeholder="Enter Telephone"
                                          value={formData?.telephone}
                                          onChange={e => {
                                            const value = e.target.value;
                                            if (
                                              (value === "" &&
                                                value.length > 20) ||
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
                                    <Col lg="2">
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
                                              (value === "" &&
                                                value.length > 20) ||
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
                                    {/* </Row>
                                  <Row> */}
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
                                        <Flatpickr
                                          options={{
                                            altInput: true,
                                            altFormat: "F j, Y",
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
                                    {/* </Row>
                                  <Row> */}
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={formData?.employee_sub_group}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionEmployeeSubGrp.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              employee_sub_group:
                                                selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Employee Sub Group
                                          </option>
                                          {optionEmployeeSubGrp.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="employee_sub_group">
                                          Employee Sub Group
                                        </label>
                                        {formErrors.employee_sub_group && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.employee_sub_group}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          name="vendor_id"
                                          value={formData?.vendor_id}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionVendorCode.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              vendor_id: selectedOption?.value,
                                            }));
                                          }}
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
                                          id="challenge_description"
                                          name="challenge_description"
                                          placeholder="Enter Challenge Discription"
                                          onChange={handleChange}
                                          value={
                                            formData?.challenge_description
                                          }
                                        />
                                        <label htmlFor="challenge_description">
                                          Challenge Description
                                        </label>
                                        {formErrors.challenge_description && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.challenge_description}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    {/* </Row>
                                  <Row> */}
                                    <Col lg="2">
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
                                    {/* </Row>
                                  <Row> */}
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="city"
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

                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="pincode"
                                          placeholder="Enter PinCode"
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              pincode: event.target.value,
                                            }));
                                          }}
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
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="pan_number"
                                          placeholder="Enter PanNumber"
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              pan_number: event.target.value,
                                            }));
                                          }}
                                          value={formData?.pan_number}
                                        />
                                        <label htmlFor="pan_number">
                                          PanNumber
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
                                    {/* </Row>
                                  <Row> */}
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="aadhar_card"
                                          placeholder="Enter Aadhar Number"
                                          onChange={e => {
                                            const value = e.target.value;

                                            if (
                                              value === "" ||
                                              (Number(value) > 0 &&
                                                /^\d*$/.test(value))
                                            ) {
                                              setFormData(prevData => ({
                                                ...prevData,
                                                aadhar_card: e.target.value,
                                              }));
                                            }
                                          }}
                                          value={formData?.aadhar_card}
                                        />
                                        <label htmlFor="aadhar_card">
                                          Aadhar Number
                                        </label>
                                        {formErrors.aadhar_card && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.aadhar_card}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={formData?.calender_id}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionCalender.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              calender_id:
                                                selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Calender
                                          </option>
                                          {optionCalender.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="calender_id">
                                          Calender
                                        </label>
                                        {formErrors.calender_id && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.calender_id}
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
                                          placeholder="Enter Previous Account No"
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              previous_account_no:
                                                event.target.value,
                                            }));
                                          }}
                                          value={formData?.previous_account_no}
                                        />
                                        <label htmlFor="previous_account_no">
                                          Previous Account No
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
                                    {/* </Row>
                                  <Row> */}
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={
                                            formData?.sales_organisation_id
                                          }
                                          onChange={async event => {
                                            const selectedOption =
                                              optionSalesOrganization.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              sales_organisation_id:
                                                selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Sales Organisation
                                          </option>
                                          {optionSalesOrganization.map(
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
                                          className="form-select"
                                          value={formData?.division_id}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionDivision.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              division_id:
                                                selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Division
                                          </option>
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
                                          className="form-select"
                                          value={
                                            formData?.distribution_channel_id
                                          }
                                          onChange={async event => {
                                            const selectedOption =
                                              optionDistributionChannel.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              distribution_channel_id:
                                                selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Distribution Channel
                                          </option>
                                          {optionDistributionChannel.map(
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
                                    {/* </Row>
                                  <Row> */}
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={formData?.sales_office_id}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionSalesOffice.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              sales_office_id:
                                                selectedOption?.value,
                                            }));
                                          }}
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
                                          className="form-select"
                                          value={formData?.sales_group_id}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionSalesGroup.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              sales_group_id:
                                                selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Sales Office Group
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
                                          Sales Office Group
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
                                          className="form-select"
                                          value={formData?.supervisor_id}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionSupervisor.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              supervisor_id:
                                                selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Supervisor
                                          </option>
                                          {optionSupervisor.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="supervisor_id">
                                          Supervisor
                                        </label>
                                        {formErrors.supervisor_id && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.supervisor_id}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    {/* </Row>
                                  <Row> */}
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="email"
                                          className="form-control"
                                          id="home_office_address"
                                          placeholder="Enter Home Office Address"
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              home_office_address:
                                                event.target.value,
                                            }));
                                          }}
                                          value={formData?.home_office_address}
                                        />
                                        <label htmlFor="home_office_address">
                                          Home/Office Address
                                        </label>
                                        {formErrors.home_office_address && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.home_office_address}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="email"
                                          className="form-control"
                                          id="satellite_office_address"
                                          placeholder="Enter Satellite Office Address"
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              satellite_office_address:
                                                event.target.value,
                                            }));
                                          }}
                                          value={
                                            formData?.satellite_office_address
                                          }
                                        />
                                        <label htmlFor="satellite_office_address">
                                          Satellite Office Address
                                        </label>
                                        {formErrors.satellite_office_address && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {
                                              formErrors.satellite_office_address
                                            }
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={formData?.designation_id}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionDesignation.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              designation_id:
                                                selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Designation
                                          </option>
                                          {optionDesignation.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="designation_id">
                                          Designation
                                        </label>
                                        {formErrors.designation_id && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.designation_id}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    {/* </Row>
                                  <Row> */}
                                    {/*  <Col lg="3">
                                      <div className="form-floating mb-3">
                                        <Input
                                          type="text"
                                          className="inner form-control"
                                          id="emr_address_1"
                                          name="emr_address_1"
                                          placeholder="Emr Address 1"
                                          onChange={handleChange}
                                          value={formData?.emr_address_1}
                                        />
                                        <label htmlFor="emr_address_1">
                                          Emr Address 1
                                        </label>
                                        {formErrors.emr_address_1 && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.emr_address_1}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="1">
                                      <Button
                                        onClick={handleAddRowNestedEmr}
                                        color="primary"
                                      >
                                        Add
                                      </Button>
                                    </Col>
                                    {emrEmployeeAddress.map((item1, idx) => (
                                      <>
                                        <Col lg="3">
                                          <tr id={"nested" + idx} key={idx}>
                                            <td>
                                              <div className="form-floating mb-3">
                                                <Input
                                                  type="text"
                                                  className="inner form-control"
                                                  placeholder={
                                                    "Emr Address  " + (idx + 2)
                                                  }
                                                  onChange={event => {
                                                    setFormData(prevData => ({
                                                      ...prevData,
                                                      ["emr_address_" +
                                                        (idx + 2)]:
                                                        event.target.value,
                                                    }));
                                                  }}
                                                  value={
                                                    formData?.[
                                                    "emr_address_" + (idx + 2)
                                                    ]
                                                  }
                                                />
                                                <label htmlFor="emr_address_1">
                                                  {"Emr Address  " + (idx + 2)}
                                                </label>
                                              </div>
                                            </td>
                                          </tr>
                                        </Col>
                                        <Col lg="1">
                                          <Button
                                            onClick={() =>
                                              handleRemoveRowNestedEmr(idx)
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
                                      <Row>
                                        <Col lg="8">
                                          <div className="form-floating mb-3">
                                            <Input
                                              type="text"
                                              id="emr_address_1"
                                              name="emr_address_1"
                                              className="inner form-control"
                                              placeholder="Emr Address 1"
                                              onChange={handleChange}
                                              value={formData?.emr_address_1}
                                            />
                                            <label htmlFor="emr_address_1">
                                              Emr Address 1
                                            </label>
                                            {formErrors.emr_address_1 && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {formErrors.emr_address_1}
                                              </div>
                                            )}
                                          </div>
                                        </Col>
                                        <Col lg="1">
                                          {/* <Button
                                            onClick={handleAddRowNestedEmr}
                                            color="primary"
                                          >
                                            Add
                                          </Button> */}
                                          <IconButton
                                            onClick={handleAddRowNestedEmr}
                                            color="primary"
                                          >
                                            <AddIcon />
                                          </IconButton>
                                        </Col>
                                      </Row>
                                    </Col>

                                    {emrAddress.map((item1, idx) => (
                                      <>
                                        <Col lg="2">
                                        <Row>
                                          <Col lg='8'>
                                          <tr id={"nested" + idx} key={idx}>
                                            <td>
                                              <div className="form-floating mb-3">
                                                <Input
                                                  type="text"
                                                  className="inner form-control"
                                                  placeholder={`Emr Address  ${
                                                    idx + 2
                                                  }`}
                                                  onChange={event => {
                                                    setFormData(prevData => ({
                                                      ...prevData,
                                                      [`emr_address_ ${
                                                        idx + 2
                                                      }`]: event.target.value,
                                                    }));
                                                  }}
                                                  value={
                                                    formData?.[
                                                      `emr_address_ ${idx + 2}`
                                                    ]
                                                  }
                                                />
                                                <label
                                                  htmlFor={`emr_address_ ${
                                                    idx + 2
                                                  }`}
                                                >
                                                  {`emr_address_ ${idx + 2}`}
                                                </label>
                                                {formErrors?.[
                                                  `emr_address_ ${idx + 2}`
                                                ] && (
                                                  <div
                                                    style={{
                                                      color: "#f46a6a",
                                                      fontSize: "80%",
                                                    }}
                                                  >
                                                    {
                                                      formErrors?.[
                                                        `emr_address_ ${
                                                          idx + 2
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
                                          <IconButton
                                            onClick={() =>
                                              handleRemoveRowNestedEmr(idx)
                                            }
                                            color="error"
                                            className="btn-block inner"
                                            style={{ width: "100%" }}
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </Col>
                                        </Row>
                                         
                                        </Col>
                                        
                                      </>
                                    ))}
                                    <Col lg="2">
                                      <Row>
                                        <Col lg="8">
                                          <div className="form-floating mb-3">
                                            <Input
                                              type="text"
                                              id="emr_name_1"
                                              name="emr_name_1"
                                              className="inner form-control"
                                              placeholder="Emr Name 1"
                                              onChange={handleChange}
                                              value={formData?.emr_name_1}
                                            />
                                            <label htmlFor="emr_name_1">
                                              Emr Name 1
                                            </label>
                                            {formErrors.emr_name_1 && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {formErrors.emr_name_1}
                                              </div>
                                            )}
                                          </div>
                                        </Col>
                                        <Col lg="1">
                                          {/* <Button
                                            onClick={handleAddRowNestedEmrName}
                                            color="primary"
                                          >
                                            Add
                                          </Button> */}
                                          <IconButton
                                            onClick={handleAddRowNestedEmrName}
                                            color="primary"
                                          >
                                            <AddIcon />
                                          </IconButton>
                                        </Col>
                                      </Row>
                                    </Col>

                                    {emrName.map((item1, idx) => (
                                      <>
                                        <Col lg="2">
                                        <Row>
                                          <Col lg="8">
                                          <tr id={"nested" + idx} key={idx}>
                                            <td>
                                              <div className="form-floating mb-3">
                                                <Input
                                                  type="text"
                                                  className="inner form-control"
                                                  placeholder={`Emr Name  ${
                                                    idx + 2
                                                  }`}
                                                  onChange={event => {
                                                    setFormData(prevData => ({
                                                      ...prevData,
                                                      [`emr_name_ ${idx + 2}`]:
                                                        event.target.value,
                                                    }));
                                                  }}
                                                  value={
                                                    formData?.[
                                                      `emr_name_ ${idx + 2}`
                                                    ]
                                                  }
                                                />
                                                <label
                                                  htmlFor={`emr_name_ ${
                                                    idx + 2
                                                  }`}
                                                >
                                                  {`emr_name_ ${idx + 2}`}
                                                </label>
                                                {formErrors?.[
                                                  `emr_name_ ${idx + 2}`
                                                ] && (
                                                  <div
                                                    style={{
                                                      color: "#f46a6a",
                                                      fontSize: "80%",
                                                    }}
                                                  >
                                                    {
                                                      formErrors?.[
                                                        `emr_name_ ${idx + 2}`
                                                      ]
                                                    }
                                                  </div>
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                          </Col>
                                          <Col lg="1">
                                          {/* <Button
                                            onClick={() =>
                                              handleRemoveRowNestedEmrName(idx)
                                            }
                                            color="danger"
                                            className="btn-block inner"
                                            style={{ width: "100%" }}
                                          >
                                            Delete
                                          </Button> */}
                                          <IconButton
                                            onClick={() =>
                                              handleRemoveRowNestedEmrName(idx)
                                            }
                                            color="error"
                                            className="btn-block inner"
                                            style={{ width: "100%" }}
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </Col>
                                        </Row>
                                          
                                        </Col>
                                       
                                      </>
                                    ))}
                                    <Col lg="2">
                                      <Row>
                                        <Col lg="8">
                                          <div className="form-floating mb-3">
                                            <Input
                                              type="number"
                                              id="emr_phone_1"
                                              name="emr_phone_1"
                                              className="inner form-control"
                                              placeholder="Emr Phone 1"
                                              onChange={handleChange}
                                              value={formData?.emr_phone_1}
                                            />
                                            <label htmlFor="emr_phone_1">
                                              Emr Phone 1
                                            </label>
                                            {formErrors.emr_phone_1 && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {formErrors.emr_phone_1}
                                              </div>
                                            )}
                                          </div>
                                        </Col>
                                        <Col lg="1">
                                          {/* <Button
                                            onClick={handleAddRowNestedEmrPhone}
                                            color="primary"
                                          >
                                            Add
                                          </Button> */}
                                          <IconButton
                                            onClick={handleAddRowNestedEmrPhone}
                                            color="primary"
                                          >
                                            <AddIcon />
                                          </IconButton>
                                        </Col>
                                      </Row>
                                    </Col>

                                    {emrPhone.map((item1, idx) => (
                                      <>
                                        <Col lg="2">
                                          <Row>
                                            <Col lg="8">
                                              <tr id={"nested" + idx} key={idx}>
                                                <td>
                                                  <div className="form-floating mb-3">
                                                    <Input
                                                      type="text"
                                                      className="inner form-control"
                                                      placeholder={`emr_phone_ ${
                                                        idx + 2
                                                      }`}
                                                      onChange={event => {
                                                        setFormData(
                                                          prevData => ({
                                                            ...prevData,
                                                            [`emr_phone_ ${
                                                              idx + 2
                                                            }`]:
                                                              event.target
                                                                .value,
                                                          })
                                                        );
                                                      }}
                                                      value={
                                                        formData?.[
                                                          `emr_phone_ ${
                                                            idx + 2
                                                          }`
                                                        ]
                                                      }
                                                    />
                                                    <label
                                                      htmlFor={`emr_phone_ ${
                                                        idx + 2
                                                      }`}
                                                    >
                                                      {`emr_phone_ ${idx + 2}`}
                                                    </label>
                                                    {formErrors?.[
                                                      `emr_phone_ ${idx + 2}`
                                                    ] && (
                                                      <div
                                                        style={{
                                                          color: "#f46a6a",
                                                          fontSize: "80%",
                                                        }}
                                                      >
                                                        {
                                                          formErrors?.[
                                                            `emr_phone_ ${
                                                              idx + 2
                                                            }`
                                                          ]
                                                        }
                                                      </div>
                                                    )}
                                                  </div>
                                                </td>
                                              </tr>
                                            </Col>
                                            <Col lg="2">
                                              <IconButton
                                                onClick={() =>
                                                  handleRemoveRowNestedEmrPhone(
                                                    idx
                                                  )
                                                }
                                                color="error"
                                                className="btn-block inner"
                                                style={{ width: "100%" }}
                                              >
                                                <DeleteIcon />
                                              </IconButton>
                                            </Col>
                                          </Row>
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
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="tenth_std_percentage"
                                            name="tenth_std_percentage"
                                            placeholder="Enter 10th Percentage"
                                            onChange={handleChange}
                                            value={
                                              formData?.tenth_std_percentage
                                            }
                                          />
                                          <label htmlFor="tenth_std_percentage">
                                            10th Percentage
                                          </label>
                                          {formErrors.tenth_std_percentage && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.tenth_std_percentage}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="2">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="twelfth_std_percentage"
                                            name="twelfth_std_percentage"
                                            placeholder="Enter 12th Percentage"
                                            onChange={handleChange}
                                            value={
                                              formData?.twelfth_std_percentage
                                            }
                                          />
                                          <label htmlFor="twelfth_std_percentage">
                                            12th Percentage
                                          </label>
                                          {formErrors.twelfth_std_percentage && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {
                                                formErrors.twelfth_std_percentage
                                              }
                                            </div>
                                          )}
                                        </div>
                                      </Col>

                                      <Col lg="2">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="bachelors_degree"
                                            name="bachelors_degree"
                                            placeholder="Enter Bachelors Degree"
                                            onChange={handleChange}
                                            value={formData?.bachelors_degree}
                                          />
                                          <label htmlFor="bachelors_degree">
                                            Bachelors Degree
                                          </label>
                                          {formErrors.bachelors_degree && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.bachelors_degree}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    {/* </Row>
                                    <Row> */}
                                      <Col lg="2">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="university_for_bachelors"
                                            name="university_for_bachelors"
                                            placeholder="Enter University For bachelors"
                                            onChange={handleChange}
                                            value={
                                              formData?.university_for_bachelors
                                            }
                                          />
                                          <label htmlFor="university_for_bachelors">
                                            University For bachelors
                                          </label>
                                          {formErrors.university_for_bachelors && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {
                                                formErrors.university_for_bachelors
                                              }
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="2">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="masters_degree"
                                            name="masters_degree"
                                            placeholder="Enter Masters Degree"
                                            onChange={handleChange}
                                            value={formData?.masters_degree}
                                          />
                                          <label htmlFor="masters_degree">
                                            Masters Degree
                                          </label>
                                          {formErrors.masters_degree && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.masters_degree}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="2">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="university_for_masters"
                                            name="university_for_masters"
                                            placeholder="Enter University For Masters"
                                            onChange={handleChange}
                                            value={
                                              formData?.university_for_masters
                                            }
                                          />
                                          <label htmlFor="university_for_masters">
                                            University For Masters
                                          </label>
                                          {formErrors.university_for_masters && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {
                                                formErrors.university_for_masters
                                              }
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    {/* </Row>
                                    <Row> */}
                                      <Col lg="2">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="bachelors_percentage"
                                            name="bachelors_percentage"
                                            placeholder="Enter Bachelors Percentage"
                                            onChange={handleChange}
                                            value={
                                              formData?.bachelors_percentage
                                            }
                                          />
                                          <label htmlFor="bachelors_percentage">
                                            Bachelors Percentage
                                          </label>
                                          {formErrors.bachelors_percentage && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.bachelors_percentage}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="2">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="stream_of_education"
                                            name="stream_of_education"
                                            placeholder="Enter Stream Education"
                                            onChange={handleChange}
                                            value={
                                              formData?.stream_of_education
                                            }
                                          />
                                          <label htmlFor="stream_of_education">
                                            Stream Education
                                          </label>
                                          {formErrors.stream_of_education && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.stream_of_education}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="2">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="phd_degree_subject"
                                            name="phd_degree_subject"
                                            placeholder="Enter PHD Degree Subject"
                                            onChange={handleChange}
                                            value={formData?.phd_degree_subject}
                                          />
                                          <label htmlFor="phd_degree_subject">
                                            PHD Degree Subject
                                          </label>
                                          {formErrors.phd_degree_subject && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.phd_degree_subject}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    {/* </Row>
                                    <Row> */}
                                      <Col lg="2">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="masters_percentage"
                                            name="masters_percentage"
                                            placeholder="Enter Masters Percentage"
                                            onChange={handleChange}
                                            value={formData?.masters_percentage}
                                          />
                                          <label htmlFor="masters_percentage">
                                            Masters Percentage
                                          </label>
                                          {formErrors.masters_percentage && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.masters_percentage}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="2">
                                      <Row>
                                        <Col lg="8">
                                        <div className="form-floating mb-3">
                                          <Input
                                            type="text"
                                            className="inner form-control"
                                            placeholder="Ext Employee Code1"
                                            onChange={event => {
                                              setFormData(prevData => ({
                                                ...prevData,
                                                ext_emp_cd_1:
                                                  event.target.value,
                                              }));
                                            }}
                                            value={formData?.ext_emp_cd_1}
                                          />
                                          <label htmlFor="ext_emp_cd_1">
                                            Ext Employee Code1
                                          </label>
                                          {formErrors.ext_emp_cd_1 && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.ext_emp_cd_1}
                                            </div>
                                          )}
                                        </div>
                                        </Col>
                                        <Col lg="1">
                                        <IconButton
                                          onClick={handleAddRowNestedEXt}
                                          color="primary"
                                        >
                                          <AddIcon />
                                        </IconButton>
                                      </Col>
                                      </Row>
                                     
                                      </Col>
                                     
                                      {extEmployeeCode.map((item1, idx) => (
                                        <>
                                        
                                          <Col lg="2">
                                          <Row>
                                          <Col lg='8'>
                                          <tr id={"nested" + idx} key={idx}>
                                              <td>
                                                <div className="form-floating mb-3">
                                                  <Input
                                                    type="text"
                                                    className="inner form-control"
                                                    placeholder={`Emr Employee Code  ${
                                                      idx + 2
                                                    }`}
                                                    onChange={event => {
                                                      setFormData(prevData => ({
                                                        ...prevData,
                                                        [`ext_emp_cd_ ${
                                                          idx + 2
                                                        }`]: event.target.value,
                                                      }));
                                                    }}
                                                    value={
                                                      formData?.[
                                                        `ext_emp_cd_ ${idx + 2}`
                                                      ]
                                                    }
                                                  />
                                                  <label
                                                    htmlFor={`ext_emp_cd_ ${
                                                      idx + 2
                                                    }`}
                                                  >
                                                    {`ext emp cd ${idx + 2}`}
                                                  </label>
                                                  {formErrors?.[
                                                    `ext_emp_cd_ ${idx + 2}`
                                                  ] && (
                                                    <div
                                                      style={{
                                                        color: "#f46a6a",
                                                        fontSize: "80%",
                                                      }}
                                                    >
                                                      {
                                                        formErrors?.[
                                                          `ext_emp_cd_ ${
                                                            idx + 2
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
                                            <IconButton
                                              onClick={() =>
                                                handleRemoveRowNestedExt(
                                                  idx
                                                )
                                              }
                                              color="error"
                                              className="btn-block inner"
                                              style={{ width: "100%" }}
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          </Col>
                                        </Row>
                                            
                                          </Col>
                                          
                                        </>
                                      ))}
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
                                    {/* </Row>
                                    <Row> */}
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
                                      <Row>
                                        <Col lg='8'>
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
                                        <IconButton
                                          onClick={handleAddRowNestedText}
                                          color="primary"
                                        >
                                          <AddIcon />
                                        </IconButton>
                                      </Col>
                                      </Row>
                                      
                                      </Col>
                                     
                                      {textId?.map((item1, idx) => (
                                        <>
                                          <Col lg="2" key={`text-col-${idx}`}>
                                          <Row>
                                            <Col lg='8'>
                                            <tr id={"nested" + idx}>
                                              <td>
                                                <div className="form-floating mb-3">
                                                  <Input
                                                    type="text"
                                                    className={`inner form-control ${
                                                      formErrors[
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
                                            <IconButton
                                              onClick={() =>
                                                handleRemoveRowNestedText(idx)
                                              }
                                              color="error"
                                              className="btn-block inner"
                                              style={{ width: "100%" }}
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          </Col>
                                          </Row>
                                         
                                          </Col>
                                         
                                        </>
                                      ))}

                                      <Col lg="2">
                                      <Row>
                                        <Col lg='8'>
                                        <div className="form-floating mb-3">
                                          <Input
                                            type="text"
                                            className="inner form-control"
                                            placeholder="Address  1"
                                            onChange={event => {
                                              setFormData(prevData => ({
                                                ...prevData,
                                                address_data_1:
                                                  event.target.value,
                                              }));
                                            }}
                                            value={formData?.address_data_1}
                                          />
                                          <label htmlFor="address_data_1">
                                            Address
                                          </label>
                                          {formErrors.address_data_1 && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.address_data_1}
                                            </div>
                                          )}
                                        </div>
                                        </Col>
                                        <Col lg="1">
                                        <IconButton
                                          onClick={handleAddRowNestedAddress}
                                          color="primary"
                                        >
                                          <AddIcon />
                                        </IconButton>
                                      </Col>
                                      </Row>
                                       
                                      </Col>
                                 
                                      {address.map((item1, idx) => (
                                        <>
                                          <Col lg="2">
                                          <Row>
                                            <Col lg='8'>
                                            <tr id={"nested" + idx} key={idx}>
                                              <td>
                                                <div className="form-floating mb-3">
                                                  <Input
                                                    type="text"
                                                    className="inner form-control"
                                                    placeholder={`Address Data  ${
                                                      idx + 2
                                                    }`}
                                                    onChange={event => {
                                                      setFormData(prevData => ({
                                                        ...prevData,
                                                        [`address_data_ ${
                                                          idx + 2
                                                        }`]: event.target.value,
                                                      }));
                                                    }}
                                                    value={
                                                      formData?.[
                                                        `address_data_ ${
                                                          idx + 2
                                                        }`
                                                      ]
                                                    }
                                                  />
                                                  <label
                                                    htmlFor={`address_data_ ${
                                                      idx + 2
                                                    }`}
                                                  >
                                                    {`Address Data ${idx + 2}`}
                                                  </label>
                                                  {formErrors?.[
                                                    `address_data_ ${idx + 2}`
                                                  ] && (
                                                    <div
                                                      style={{
                                                        color: "#f46a6a",
                                                        fontSize: "80%",
                                                      }}
                                                    >
                                                      {
                                                        formErrors?.[
                                                          `address_data_ ${
                                                            idx + 2
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
                                            
                                            <IconButton
                                              onClick={() =>
                                                handleRemoveRowNestedAddress(
                                                  idx
                                                )
                                              }
                                              color="error"
                                              className="btn-block inner"
                                              style={{ width: "100%" }}
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          </Col>
                                          </Row>
                                         
                                          </Col>
                                         
                                        </>
                                      ))}
                                    {/* </Row>
                                    <Row> */}
                                      <Col lg="2">
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
                                        <div className="form-floating mb-3">
                                          <div className="form-check mb-3">
                                            <input
                                              type="checkbox"
                                              className="form-check-input input-mini"
                                              id="challenge_indicator"
                                              checked={
                                                formData?.challenge_indicator
                                              }
                                              onChange={event => {
                                                setFormData(prevData => ({
                                                  ...prevData,
                                                  challenge_indicator:
                                                    event.target.checked,
                                                }));
                                              }}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor="challenge_indicator"
                                            >
                                              Challenge Indicator
                                            </label>
                                            {formErrors.challenge_indicator && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {formErrors.challenge_indicator}
                                              </div>
                                            )}
                                          </div>
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
                                      <Col lg="2">
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
                                      <Col lg="2">
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
                                      <Col lg="2">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="bank_account_holder_name"
                                            name="bank_account_holder_name"
                                            placeholder="Enter Bank Account Holder Name"
                                            onChange={handleChange}
                                            value={
                                              formData?.bank_account_holder_name
                                            }
                                          />
                                          <label htmlFor="bank_account_holder_name">
                                            Bank Account Holder Name
                                          </label>
                                          {formErrors.bank_account_holder_name && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {
                                                formErrors.bank_account_holder_name
                                              }
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    {/* </Row>
                                    <Row> */}
                                      <Col lg="2">
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

                                      <Col lg="2">
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
                                      <Col lg="2">
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
                              <TabPane tabId={4}>
                                <div className="row justify-content-center">
                                  <Col lg="6">
                                    <div className="text-center">
                                      <div className="mb-4">
                                        {addEmployeeMaster?.success === true ||
                                        updateEmployeeMaster?.success ===
                                          true ? (
                                          <i className="mdi mdi-check-circle-outline text-success display-4" />
                                        ) : (
                                          <i className="mdi mdi-close-circle-outline text-danger display-4" />
                                        )}
                                      </div>
                                      <div>
                                        <h5>
                                          {addEmployeeMaster?.message ||
                                            updateEmployeeMaster?.message}
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
                                  activeTab === 1 || activeTab === 4
                                    ? "previous disabled"
                                    : "previous"
                                }
                              >
                                <Link
                                  to={{
                                    pathname: "/hrdata/employee_master/" + mode,
                                    state: { editEmployee: Edit },
                                  }}
                                  onClick={() => {
                                    if (activeTab == 2 || activeTab == 3) {
                                      toggleTab(activeTab - 1);
                                    }
                                  }}
                                >
                                  Previous
                                </Link>
                              </li>
                              <li
                                className={
                                  activeTab === 4 ? "next disabled" : "next"
                                }
                              >
                                <Link
                                  to={{
                                    pathname: "/hrdata/employee_master/" + mode,
                                    state: { editEmployee: Edit },
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

export default AddEmployeeMaster;
