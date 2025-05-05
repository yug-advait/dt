import React, { useCallback, useEffect, useState } from "react";
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
  CardTitle,
  Table,
  Label,
  FormGroup,
  FormFeedback,
  Alert,
} from "reactstrap";
import Select from "react-select";
import { getRelatedRecords } from "helpers/Api/api_common";
import { getDepartmentPermission } from "helpers/Api/api_admins";
import { getDepartmentApprovals } from "helpers/Api/api_admins";
import { getAdminPermission } from "helpers/Api/api_admins";
import { Link, useLocation } from "react-router-dom";
import classnames from "classnames";
import moment from "moment";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Title } from "../../../constants/layout";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import { useSelector, useDispatch } from "react-redux";
import {
  ADD_ADMINS_REQUEST,
  GET_ADMINS_REQUEST,
  UPDATE_ADMINS_REQUEST,
} from "store/admins/actionTypes";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
import { addData, permissionListsfetchData, updateData } from "../../../firebase/index";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const AddAdmin = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { admins, listAdmins, addAdmins, updateAdmins } = useSelector(
    state => state.admins
  );
  const [activeTab, setActiveTab] = useState(1);
  const history = useHistory();
  const [passedSteps, setPassedSteps] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [address, setAddress] = useState([]);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [formData, setFormData] = useState({});
  const [optionTitle, setOptionTitle] = useState(Title);
  const [optionEmployeeCode, setOptionEmployeeCode] = useState([]);
  const [optionCountry, setOptionCountry] = useState([]);
  const [optionState, setOptionState] = useState([]);
  const [optionDepartment, setOptionDepartment] = useState([]);
  const [optionLanguages, setOptionLanguages] = useState([]);
  const [optionApprovalManager, setOptionApprovalManager] = useState([]);
  const [optionCompany, setOptionCompany] = useState([]);
  const [optionSalesOrganisation, setOptionSalesOrganisation] = useState([]);
  const [optionDistribution, setOptionDistribution] = useState([]);
  const [optionDivision, setOptionDivision] = useState([]);
  const [optionSalesOffice, setOptionSalesOffice] = useState([]);
  const [optionSalesGroup, setOptionSalesGroup] = useState([]);
  const [optionUserGroup, setOptionUserGroup] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [Edit, setEdit] = useState(null);
  const [canApprove, setCanApprove] = useState(false);
  const [approvalManager, setApprovalManager] = useState([]);
  const [maxPriceBand, setMaxPriceBand] = useState(null);
  const mode = Edit === null ? "Add" : "Edit";
  const [loading, setLoading] = useState(false);
  const labelStyle = "original";
  const timezones = {
    ...allTimezones,
    "Asia/Kolkata": "India",
  };
  const [selectedTimeZone, setSelectedTimeZone] = useState("0");
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });
  const handleCheckboxChange = (idx, checkboxLabel, value) => {
    const newValues = [...menuList];
    newValues[idx] = {
      ...newValues[idx],
      [checkboxLabel]: value,
    };
    setMenuList(newValues);
  };
  const handleCheckbox = e => {
    setCanApprove(e.target.checked);
  };

  const handleNumberChange = (idx, checkboxLabel, value) => {
    const newValues = [...menuList];
    newValues[idx] = {
      ...newValues[idx],
      [checkboxLabel]: value,
    };
    setMenuList(newValues);
  };

  const listPermission = async department_id => {
    const menuListData = await getDepartmentPermission(department_id);
    setMenuList(menuListData);
  };
  const listEditPermission = async (department_id, admin_id) => {
    const menuListData = await getAdminPermission(department_id, admin_id);
    setMenuList(menuListData);
  };
  const listDepartmnetApprovals = async department_id => {
    const userList = await getDepartmentApprovals(department_id);
    setOptionApprovalManager(userList);
  };

  const validateForm1 = () => {
    const errors = {};
    if (!formData.title) {
      errors.title = "Title is required";
    }
    if (!formData.first_name) {
      errors.first_name = "First Name is required";
    }
    else if (formData.first_name.length > 50) {
      errors.first_name = "First Name cannot be more than 50 characters"
    }
    if (!formData.last_name) {
      errors.last_name = "Last Name is required";
    }
    else if (formData.last_name.length > 50) {
      errors.last_name = "Last Name cannot be more than 50 characters"
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    else if (formData.password.length > 30) {
      errors.password = "Password cannot be more than 30 characters"
    }
    if (!formData.telephone) {
      errors.telephone = "Telephone is required";
    }
    else if (formData.telephone.length > 20) {
      errors.telephone = "Telephone cannot be more than 20 characters"
    }
    if (!formData.mobile) {
      errors.mobile = "Mobile is required";
    }
    else if (formData.mobile.length > 20) {
      errors.mobile = "Mobile cannot be more than 20 characters"
    }
    if (!formData.email_id) {
      errors.email_id = "Email is required";
    } else if (!validateEmail(formData.email_id)) {
      errors.email_id = "Please enter a valid email address.";
    } else if (formData.email_id.length > 50) {
      errors.email_id = "Email cannot be more than 50 characters"
    }
    if (!formData.employee_id) {
      errors.employee_id = "Employee Code is required";
    }
    if (!formData.address_data_1) {
      errors.address_data_1 = "Address is required";
    }
    else if (formData.address_data_1.length > 50) {
      errors.address_data_1 = "Address cannot be more than 50 characters";
    }
    address.forEach((_, idx) => {
      const fieldName = `address_data_${idx + 2}`;
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
    }
    else if (formData.city.length > 50) {
      errors.city = "City cannot be more than 50 characters";
    }
    if (!formData.pincode) {
      errors.pincode = "PinCode is required";
    }
    else if (formData.pincode.length > 20) {
      errors.pincode = "Pincode cannot be more than 20 characters";
    }
    if (!formData.function_name) {
      errors.function_name = "Function Name is required";
    }
    else if (formData.function_name.length > 50) {
      errors.function_name = "Function Name cannot be more than 50 characters";
    }
    else if (formData.pincode.length > 20) {
      errors.pincode = "Pincode cannot be more than 20 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const validateForm2 = () => {
    const errors = {};
    if (!formData.language_id) {
      errors.language_id = "Languages is required";
    }
    if (!formData.valid_from) {
      errors.valid_from = "Valid From is required";
    }
    if (!formData.valid_to) {
      errors.valid_to = "Valid To is required";
    }
    if (!formData.company_id) {
      errors.company_id = "Company is required";
    }
    if (!formData.sales_organisation_id) {
      errors.sales_organisation_id = "Sales Organisation is required";
    }
    if (!formData.distribution_id) {
      errors.distribution_id = "Distribution is required";
    }
    if (!formData.division_id) {
      errors.division_id = "Division is required";
    }
    if (!formData.sales_office_id) {
      errors.sales_office_id = "Sales Office is required";
    }
    if (!formData.sales_group_id) {
      errors.sales_group_id = "Sales Group is required";
    }

    if (!formData?.time_zone) {
      errors.time_zone = "Time Zone is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const validateForm3 = () => {
    const errors = {};
    if (!formData.department_id) {
      errors.department_id = "Department is required";
    }
    if (!formData?.user_group) {
      errors.user_group = "User Group is required";
    }
    if (menuList.length == 0) {
      errors.permissions = "Permissions is required";
    }
    if (canApprove) {
      if (Edit) {
        if (!approvalManager.length > 0) {
          errors.approvalManager = "Please select an Approval Manager";
        }
      }
      if (!maxPriceBand || maxPriceBand <= 0) {
        errors.maxPriceBand = "Max Price Band must be a positive number";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'first_name' && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        first_name: "First Name cannot be more than 50 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        first_name: ""
      });
    }
    if (name === 'last_name' && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        last_name: "Last Name cannot be more than 50 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        last_name: ""
      });
    }
    if (name === 'password' && value.length > 30) {
      newValue = value.slice(0, 30);
      setFormErrors({
        ...formErrors,
        password: "Password cannot be more than 30 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        password: ""
      });
    }
    if (name === 'telephone' && value.length > 20) {
      newValue = value.slice(0, 20);
      setFormErrors({
        ...formErrors,
        telephone: "Telephone cannot be more than 20 characters",
      });
    } else if (name === 'telephone') {
      setFormErrors({
        ...formErrors,
        telephone: "",
      });
    }
    if (name === 'mobile' && value.length > 20) {
      newValue = value.slice(0, 20);
      setFormErrors({
        ...formErrors,
        mobile: "Mobile cannot be more than 20 characters",
      });
    } else if (name === 'mobile') {
      setFormErrors({
        ...formErrors,
        mobile: "",
      });
    }
    if (name.startsWith('address_data_') && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        [name]: "Address cannot be more than 50 characters",
      });
    } else if (name.startsWith('address_data_')) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
    if (name === 'city' && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        city: "City cannot be more than 50 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        city: ""
      });
    }
    if (name === 'pincode' && value.length > 20) {
      newValue = value.slice(0, 20);
      setFormErrors({
        ...formErrors,
        pincode: "Pincode cannot be more than 20 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        pincode: ""
      });
    }
    if (name === 'function_name' && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        function_name: "Function Name cannot be more than 50 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        function_name: ""
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTimeZoneChange = e => {
    const selectedTimeZone = e.currentTarget.value;
    setFormData(prevData => ({
      ...prevData,
      time_zone: selectedTimeZone,
    }));
    setSelectedTimeZone(selectedTimeZone);
    parseTimezone(selectedTimeZone);
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


  const handleCheckAll = (permission, isChecked) => {
    setMenuList(prevMenuList =>
      prevMenuList.map(item => ({
        ...item,
        [permission]: isChecked, 
      }))
    );
  };

  const permissions = [
    { key: 'can_list', label: 'Can List' },
    { key: 'can_add', label: 'Can Add' },
    { key: 'can_edit', label: 'Can Edit' },
    { key: 'can_delete', label: 'Can Delete' },
    { key: 'can_approved', label: 'Can Approve' }
  ];
 useEffect(() => {
    if (activeTab === 4) {
      const timer = setTimeout(() => {
        history.push("/master/admins");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeTab, history]);
  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("adminData"));
    const { editAdmin } = location.state || {};
    if (editAdmin) {
      setEdit(editAdmin);
      if (editAdmin.country && editAdmin.state) {
        listState(editAdmin.country?.value);
      }
      setCanApprove(editAdmin?.can_approved);
      setMaxPriceBand(editAdmin?.max_price_band);
      setApprovalManager(editAdmin?.approval_ids);
      setFormData({
        title: editAdmin.title || "",
        first_name: editAdmin.first_name || "",
        last_name: editAdmin.last_name || "",
        password: editAdmin.password || "",
        telephone: editAdmin.telephone || "",
        mobile: editAdmin.mobile || "",
        email_id: editAdmin.email_id || "",
        employee_id: editAdmin.employee.value || "",
        address_data_1: editAdmin.address_data_1 || "",
        address_data_2: editAdmin.address_data_2 || "",
        address_data_3: editAdmin.address_data_3 || "",
        country_id: editAdmin.country.value || "",
        state_id: editAdmin.state.value || "",
        city: editAdmin.city || "",
        pincode: editAdmin.pincode || "",
        function_name: editAdmin.function_name || "",
        department_id: editAdmin.department.value || "",
        language_id: editAdmin.language.value || "",
        valid_from: moment(editAdmin.valid_from).format("DD/MM/YYYY") || "",
        valid_to: moment(editAdmin.valid_to).format("DD/MM/YYYY") || "",
        company_id: editAdmin.company.value || "",
        sales_organisation_id: editAdmin.salesorg.value || "",
        distribution_id: editAdmin.distribution.value || "",
        division_id: editAdmin.division.value || "",
        sales_office_id: editAdmin.salesoffice.value || "",
        sales_group_id: editAdmin.salesgroup.value || "",
        user_group: editAdmin?.user_group.value || "",
        time_zone: editAdmin?.time_zone || "",
      });
    } else {
      setEdit(null);
      if (adminData) {
        if (adminData.country_id && adminData.state_id) {
          listState(adminData.country_id);
        }
        setCanApprove(adminData?.can_approved);
        setMaxPriceBand(adminData?.max_price_band);
        setApprovalManager([]);
        setFormData({
          title: adminData.title || "",
          first_name: adminData.first_name || "",
          last_name: adminData.last_name || "",
          password: adminData.password || "",
          telephone: adminData.telephone || "",
          mobile: adminData.mobile || "",
          email_id: adminData.email_id || "",
          employee_id: adminData.employee_id || "",
          address_data_1: adminData.address_data_1 || "",
          address_data_2: adminData.address_data_2 || "",
          address_data_3: adminData.address_data_3 || "",
          country_id: adminData.country_id || "",
          state_id: adminData.state_id || "",
          city: adminData.city || "",
          pincode: adminData.pincode || "",
          function_name: adminData.function_name || "",
          department_id: adminData.department_id || "",
          language_id: adminData.language_id || "",
          valid_from: adminData.valid_from || "",
          valid_to: adminData.valid_to || "",
          company_id: adminData.company_id || "",
          sales_organisation_id: adminData.sales_organisation_id || "",
          distribution_id: adminData.distribution_id || "",
          division_id: adminData.division_id || "",
          sales_office_id: adminData.sales_office_id || "",
          sales_group_id: adminData.sales_group_id || "",
          user_group: adminData?.user_group || "",
          time_zone: adminData?.time_zone || "",
        });
      }
    }
  }, []);
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

  const toggleTab = async tab => {
    if (!Edit) {
      localStorage.setItem("adminData", JSON.stringify(formData));
    }
    if (activeTab !== tab && activeTab == 1) {
      if (!validateForm1()) {
        return;
      }
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 2 && tab == 2) {
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 2) {
      const userList = await getDepartmentApprovals(formData?.department_id);
      setOptionApprovalManager(userList);
      if (!validateForm2()) {
        return;
      }
      if (Edit) {
        if (formData.department_id) {
          const Id = Edit.id;
          listEditPermission(formData.department_id, Id);
        }
      } else {
        if (formData.department_id) {
          listPermission(formData.department_id);
        }
      }
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 3 && tab == 2) {
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 3) {
      if (!validateForm3()) {
        return;
      }
      if (Edit) {
        setLoading(true)
        const Id = Edit.id;
        const data = {
          formData,
          canApprove,
          approvalManager,
          maxPriceBand,
          menuList,
          Id,
        };
        dispatch({
          type: UPDATE_ADMINS_REQUEST,
          payload: data,
        });
      } else {
        setLoading(true)
        const data = {
          formData,
          canApprove,
          approvalManager,
          maxPriceBand,
          menuList,
        };
        dispatch({
          type: ADD_ADMINS_REQUEST,
          payload: data,
        });
      }
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 4 && tab == 3) {
      tabAction(tab);
    }
  };

  useEffect(() => {
    dispatch({
      type: GET_ADMINS_REQUEST,
      payload: [],
    });
  }, []);


  // const [firebasePermission, setFireBasePermission] = useState([]);
  // const [newfirebasePermission, setNewFireBasePermission] = useState([]);

  // Fetch data with useCallback to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    try {
      const res = await permissionListsfetchData();
      // setFireBasePermission(res);
    } catch (error) {
      console.error('Fetch data error:', error);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimize permission update logic
  // const updateOrAddUserPermissions = useCallback((arr, userId) => {
  //    const updatedPermissions = firebasePermission.map(item => {
  //     // Create a deep copy to avoid direct mutation
  //     const updatedItem = { ...item };
      
  //     // If users array is empty, add new user
  //     if (!updatedItem.users.length) {
  //       updatedItem.users = [{ id: userId, permissions: arr }];
  //       return updatedItem;
  //     }

  //     // Update existing users or add new user
  //     updatedItem.users = updatedItem.users.map(user => 
  //       user.id === userId 
  //         ? { ...user, permissions: arr }
  //         : user
  //     );

  //     // If no existing user found, add new user
  //     if (!updatedItem.users.some(user => user.id === userId)) {
  //       updatedItem.users.push({ id: userId, permissions: arr });
  //     }
  //     return updatedItem;
  //   });
  //   setNewFireBasePermission(updatedPermissions);
  // }, [firebasePermission]);

  // Optimize Firebase update
  // const updateFirebase = useCallback(async (permissionsToUpdate) => {
  //   if (permissionsToUpdate && permissionsToUpdate.length > 0) {
  //     try {
  //       await updateData(permissionsToUpdate);
  //     } catch (error) {
  //       console.error('Firebase update error:', error);
  //     }
  //   }
  // }, []);

  // Trigger Firebase update when newfirebasePermission changes
  // useEffect(() => {
  //   if (newfirebasePermission.length > 0) {
  //     updateFirebase(newfirebasePermission);
  //   }
  // }, [newfirebasePermission, updateFirebase]);


  useEffect(() => {
    if (addAdmins?.success === true) {
      setLoading(false)
      setToastMessage("Admins Added Successfully");
      localStorage.removeItem("adminData");
    }
    if (updateAdmins?.success === true) {
      // updateOrAddUserPermissions(updateAdmins?.permissionList,updateAdmins?.updateAdminMasterData?.id )
      setLoading(false)
      setToastMessage("Admins Updated Successfully");
    }
    if (listAdmins) {
      if (admins) {
        setOptionCountry(admins?.countries);
        setOptionEmployeeCode(admins?.employees);
        setOptionDepartment(admins?.departments);
        setOptionLanguages(admins?.languages);
        setOptionCompany(admins?.companies);
        setOptionSalesOrganisation(admins?.sales_organisations);
        setOptionDistribution(admins?.distributions);
        setOptionDivision(admins?.divisions);
        setOptionSalesOffice(admins?.sales_office);
        setOptionSalesGroup(admins?.sales_group);
        setOptionUserGroup(admins?.user_group);
      }
    }
  }, [listAdmins, addAdmins, updateAdmins, admins]);

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

  document.title = "Detergent | " + mode + " Admin";
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
            titlePath="/master/admins"
            title="Admin"
            breadcrumbItem={mode + " Admin"}
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
                        <h4 className="card-title mb-4">Admin Details</h4>
                        <div className="wizard clearfix">
                        <div className="custom-tabs-wrapper">
                        <ul className="custom-tab-nav">
                          {[
                            { id: 1, label: " Basic Details" },
                            { id: 2, label: "  Details" },
                            { id: 3, label: "Roles Assign" },
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
                                          id="first_name"
                                          name="first_name"
                                          placeholder="Enter First Name"
                                          onChange={handleChange}
                                          value={formData?.first_name}
                                        />
                                        <label htmlFor="first_name">
                                          First Name
                                        </label>
                                        {formErrors.first_name && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.first_name}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="last_name"
                                          name="last_name"
                                          placeholder="Enter Last Name"
                                          onChange={handleChange}
                                          value={formData?.last_name}
                                        />
                                        <label htmlFor="last_name">
                                          Last Name
                                        </label>
                                        {formErrors.last_name && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.last_name}
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
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="number"
                                          className="form-control"
                                          id="telephone"
                                          placeholder="Enter Telephone"
                                          value={formData?.telephone}
                                          onChange={e => {
                                            const value = e.target.value;
                                            if (
                                              (value === "" || (Number(value) > 0 && /^\d*$/.test(value))) &&
                                              value.length <= 20
                                            ) {
                                              setFormData(prevData => ({
                                                ...prevData,
                                                telephone: value,
                                              }));
                                            }
                                          }}
                                        />
                                        <label htmlFor="telephone">Telephone</label>
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
                                          placeholder="Enter Mobile"
                                          value={formData?.mobile}
                                          onChange={e => {
                                            const value = e.target.value;
                                            if (
                                              (value === "" || (Number(value) > 0 && /^\d*$/.test(value))) &&
                                              value.length <= 20
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

                                  </Row>
                                  <Row>
                                    
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
                                    <Col lg="3">
                                      <div className="form-floating mb-1">
                                        <select
                                          value={formData?.employee_id}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionEmployeeCode.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
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
                                          {optionEmployeeCode?.map(option => (
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
                                    <Col lg="2">
                                      <div className="form-floating mb-3">
                                        <Input
                                          type="text"
                                          className="inner form-control"
                                          placeholder="Address 1"
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              address_data_1: event.target.value,
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
                                      <Button
                                        onClick={handleAddRowNestedAddress}
                                        color="primary"
                                      >
                                        Add
                                      </Button>
                                    </Col>{address?.map((item1, idx) => (
                                      <>
                                        <Col
                                          lg="1"
                                          key={`address-col-${idx}`}
                                        >
                                          <tr id={"nested" + idx}>
                                            <td>
                                              <div className="form-floating mb-3">
                                                <Input
                                                  type="text"
                                                  className={`inner form-control ${formErrors[
                                                    `address_data_${idx + 2}`
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
                                                      ["address_data_" +
                                                        (idx + 2)]:
                                                        event.target.value,
                                                    }));
                                                  }}
                                                  value={
                                                    formData?.[
                                                    "address_data_" + (idx + 2)
                                                    ] || ""
                                                  }
                                                />
                                                <label
                                                  htmlFor={`address_data_${idx + 2
                                                    }`}
                                                >
                                                  {"Address " + (idx + 2)}
                                                </label>
                                                {formErrors[
                                                  `address_data_${idx + 2}`
                                                ] && (
                                                    <div className="invalid-feedback">
                                                      {
                                                        formErrors[
                                                        `address_data_${idx + 2}`
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
                                          }}
                                        >
                                          <option value="0">Select State</option>
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
                                  </Row>
                                 
                                  <Row>
                                   
                                    <Col lg="2">
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
                                 
                                    <Col lg="3">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="function_name"
                                          name="function_name"
                                          placeholder="EnterFunction Name"
                                          onChange={handleChange}
                                          value={formData?.function_name}
                                        />
                                        <label htmlFor="function_name">
                                          Function Name
                                        </label>
                                        {formErrors.function_name && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.function_name}
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
                                      <Col lg="2">
                                        <div className="form-floating mb-3">
                                          <select
                                            value={formData?.language_id}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionLanguages.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                language_id:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                            className="form-select"
                                          >
                                            <option value="0">
                                              Select Language
                                            </option>
                                            {optionLanguages?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="language_id">
                                            Language
                                          </label>
                                          {formErrors.language_id && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.language_id}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="2">
                                        <div className="form-floating mb-3">
                                          <select
                                            value={formData?.time_zone}
                                            onChange={handleTimeZoneChange}
                                            className="form-select"
                                          >
                                            <option value="0">
                                              Select Time Zone
                                            </option>
                                            {options?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>

                                          <label htmlFor="time_zone">
                                            Time Zone
                                          </label>

                                          {formErrors.time_zone && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.time_zone}
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
                                            onChange={(selectedDates, dateStr, instance) => {
                                              const selectedDate = moment(selectedDates[0]).format("DD/MM/YYYY");
                                              setFormData(prevData => ({
                                                ...prevData,
                                                valid_from: selectedDate,
                                              }));
                                              if (formData.valid_to && moment(selectedDate, "DD/MM/YYYY").isAfter(moment(formData.valid_to, "DD/MM/YYYY"))) {
                                                setFormErrors(prevErrors => ({
                                                  ...prevErrors,
                                                  valid_to: "Valid To date should be after Valid From date",
                                                }));
                                              } else {
                                                setFormErrors(prevErrors => ({
                                                  ...prevErrors,
                                                  valid_to: null,
                                                }));
                                              }
                                            }}
                                            value={moment(formData?.valid_from, "DD/MM/YYYY").toDate()}
                                          />
                                          <label htmlFor="valid_from">Valid From</label>
                                          {formErrors.valid_from && (
                                            <div style={{ color: "#f46a6a", fontSize: "80%" }}>
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
                                            onChange={(selectedDates, dateStr, instance) => {
                                              const selectedDate = moment(selectedDates[0]).format("DD/MM/YYYY");

                                              if (moment(selectedDate, "DD/MM/YYYY").isBefore(moment(formData.valid_from, "DD/MM/YYYY"))) {
                                                setFormErrors(prevErrors => ({
                                                  ...prevErrors,
                                                  valid_to: "Valid To date should be after Valid From date",
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
                                            value={moment(formData?.valid_to, "DD/MM/YYYY").toDate()}
                                          />
                                          <label htmlFor="valid_to">Valid To</label>
                                          {formErrors.valid_to && (
                                            <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                                              {formErrors.valid_to}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="2">
                                        <div className="form-floating mb-3">
                                          <select
                                            value={formData?.distribution_id}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionDistribution.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                distribution_id:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                            className="form-select"
                                          >
                                            <option value="0">
                                              Select Distribution Channel
                                            </option>
                                            {optionDistribution?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="distribution_id">
                                            Distribution Channel
                                          </label>
                                          {formErrors.distribution_id && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.distribution_id}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg="3">
                                        <div className="form-floating mb-3">
                                          <select
                                            value={
                                              formData?.sales_organisation_id
                                            }
                                            onChange={async event => {
                                              const selectedOption =
                                                optionSalesOrganisation.find(
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
                                            className="form-select"
                                          >
                                            <option value="0">
                                              Select Sales Organisation
                                            </option>
                                            {optionSalesOrganisation?.map(
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
                                      <Col lg="3">
                                        <div className="form-floating mb-3">
                                          <select
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
                                            className="form-select"
                                          >
                                            <option value="0">
                                              Select Sales Group
                                            </option>
                                            {optionSalesGroup?.map(option => (
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
                                      <Col lg="3">
                                        <div className="form-floating mb-3">
                                          <select
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
                                            className="form-select"
                                          >
                                            <option value="0">
                                              Select Sales Office
                                            </option>
                                            {optionSalesOffice?.map(option => (
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
                                      <Col lg="3">
                                        <div className="form-floating mb-3">
                                          <select
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
                                            className="form-select"
                                          >
                                            <option value="0">
                                              Select Division
                                            </option>
                                            {optionDivision?.map(option => (
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
                                    </Row>
                                  </Form>
                                </div>
                              </TabPane>
                              <TabPane tabId={3}>
                                <div>
                                  <Form>
                                    <Row>
                                      <Col lg="6">
                                        <div className="form-floating mb-3">
                                          <select
                                            value={formData?.department_id}
                                            onChange={async event => {
                                              setOptionApprovalManager([]);
                                              setApprovalManager([]);
                                              listDepartmnetApprovals(
                                                event.target.value
                                              );
                                              const selectedOption =
                                                optionDepartment.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                department_id:
                                                  selectedOption?.value,
                                              }));
                                              if (Edit) {
                                                const Id = Edit.id;
                                                if (selectedOption?.value) {
                                                  listEditPermission(
                                                    selectedOption?.value,
                                                    Id
                                                  );
                                                }
                                              } else {
                                                if (selectedOption?.value) {
                                                  listPermission(
                                                    selectedOption?.value
                                                  );
                                                }
                                              }
                                            }}
                                            className="form-select"
                                          >
                                            <option value="0">
                                              Select Department
                                            </option>
                                            {optionDepartment?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="department_id">
                                            Department
                                          </label>
                                          {formErrors.department_id && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.department_id}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="6">
                                        <div className="form-floating mb-3">
                                          <select
                                            value={formData?.user_group}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionUserGroup.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                user_group: selectedOption?.value,
                                              }));
                                            }}
                                            className="form-select"
                                          >
                                            <option value="0">
                                              Select User Group
                                            </option>
                                            {optionUserGroup?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="user_group">
                                            User Group
                                          </label>
                                          {formErrors?.user_group && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.user_group}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={6}>
                                        <FormGroup check>
                                          <Label check>
                                            <Input
                                              type="checkbox"
                                              checked={canApprove}
                                              onChange={handleCheckbox}
                                            />{" "}
                                            Can Approve
                                          </Label>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                    {canApprove && (
                                      <Row>
                                        <Col lg={6}>
                                          <FormGroup>
                                            <Label for="approvalManager">
                                              Approval Manager
                                            </Label>
                                            <Select
                                              isMulti
                                              multiple
                                              className="basic-multi-select"
                                              classNamePrefix="select"
                                              value={approvalManager}
                                              options={optionApprovalManager}
                                              onChange={async approvalManager => {
                                                setApprovalManager(
                                                  approvalManager
                                                );
                                              }}
                                            ></Select>
                                            {formErrors.approvalManager && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {formErrors.approvalManager}
                                              </div>
                                            )}
                                          </FormGroup>
                                        </Col>
                                        <Col lg={6}>
                                          <FormGroup>
                                            <Label for="maxPriceBand">
                                              Max Price Band
                                            </Label>
                                            <Input
                                              type="number"
                                              id="maxPriceBand"
                                              placeholder="Enter Max Price"
                                              value={maxPriceBand}
                                              onChange={e =>
                                                setMaxPriceBand(e.target.value)
                                              }
                                              invalid={!!formErrors.maxPriceBand}
                                            />
                                            {formErrors.maxPriceBand && (
                                              <FormFeedback>
                                                {formErrors.maxPriceBand}
                                              </FormFeedback>
                                            )}
                                          </FormGroup>
                                        </Col>
                                      </Row>
                                    )}
                                    <Row>
                                      <Col lg={12}>
                                        <Card>
                                          <CardBody>
                                            <CardTitle className="h4">
                                              Permissions
                                              {formErrors.permissions && (
                                                <div
                                                  style={{
                                                    color: "#f46a6a",
                                                    fontSize: "80%",
                                                  }}
                                                >
                                                  {formErrors.permissions}
                                                </div>
                                              )}
                                            </CardTitle>
                                            <div className="table-responsive">
                                              <Table className="table mb-0">
                                                <thead className="table-light">
                                                  <tr className="bg-gray-50 border-b">
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                      Name
                                                    </th>
                                                    {permissions.map(({ key, label }) => (
                                                      <th
                                                        key={key}
                                                        className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                                                      >
                                                        <div className="flex flex-direction-row items-center space-x-2">
                                                          <span>{label}</span>
                                                          <div className="flex items-center">
                                                            <input
                                                              type="checkbox"
                                                              onChange={(e) => handleCheckAll(key, e.target.checked)}
                                                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="ml-2 text-xs text-gray-600">All</span>
                                                          </div>
                                                        </div>
                                                      </th>
                                                    ))}
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {menuList?.map((item, idx) => (
                                                    <tr key={idx}>
                                                      <td>{item.sub_menu_label}</td>
                                                      <td>
                                                        <input
                                                          type="checkbox"
                                                          checked={menuList[idx]?.can_list}
                                                          onChange={e =>
                                                            handleCheckboxChange(idx, "can_list", e.target.checked)
                                                          }
                                                        />
                                                      </td>
                                                      <td>
                                                        <input
                                                          type="checkbox"
                                                          checked={menuList[idx]?.can_add}
                                                          onChange={e =>
                                                            handleCheckboxChange(idx, "can_add", e.target.checked)
                                                          }
                                                        />
                                                      </td>
                                                      <td>
                                                        <input
                                                          type="checkbox"
                                                          checked={menuList[idx]?.can_edit}
                                                          onChange={e =>
                                                            handleCheckboxChange(idx, "can_edit", e.target.checked)
                                                          }
                                                        />
                                                      </td>
                                                      <td>
                                                        <input
                                                          type="checkbox"
                                                          checked={menuList[idx]?.can_delete}
                                                          onChange={e =>
                                                            handleCheckboxChange(idx, "can_delete", e.target.checked)
                                                          }
                                                        />
                                                      </td>
                                                      <td>
                                                        {(item.sub_menu_name === "po" ||
                                                          item.sub_menu_name === "pr" ||
                                                          item.sub_menu_name === "asn" ||
                                                          item.sub_menu_name === "grn" ||
                                                          item.sub_menu_name === "rfq") && (
                                                            <div
                                                              style={{ display: "flex", alignItems: "center" }}
                                                              className="inline-elements"
                                                            >
                                                              <input
                                                                type="checkbox"
                                                                checked={menuList[idx]?.can_approved}
                                                                onChange={e =>
                                                                  handleCheckboxChange(idx, "can_approved", e.target.checked)
                                                                }
                                                              />
                                                            </div>
                                                          )}
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </Table>

                                            </div>
                                          </CardBody>
                                        </Card>
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
                                        {addAdmins?.success === true ||
                                          updateAdmins?.success === true ? (
                                          <i className="mdi mdi-check-circle-outline text-success display-4" />
                                        ) : (
                                          <i className="mdi mdi-close-circle-outline text-danger display-4" />
                                        )}
                                      </div>
                                      <div>
                                        <h5>
                                          {addAdmins?.message ||
                                            updateAdmins?.message}
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
                                    pathname: "/master/admins/" + mode,
                                    state: { editAdmin: Edit },
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
                                    pathname: "/master/admins/" + mode,
                                    state: { editAdmin: Edit },
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

export default AddAdmin;
