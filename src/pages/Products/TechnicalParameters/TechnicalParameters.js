import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  UncontrolledTooltip,
  Button,
  Modal,
  Form,
  Label,
  Input,
  Alert,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
  ADD_TECHNICALPARAMETER_REQUEST,
  GET_TECHNICALPARAMETER_REQUEST,
  UPDATE_TECHNICALPARAMETER_REQUEST,
  DELETE_TECHNICALPARAMETER_REQUEST,
} from "../../../store/technicalParameter/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { getSelectData } from "helpers/Api/api_common";
import { getTechnicalValueParameter } from "helpers/Api/api_technicalParameter";
import { addTechSetApiCall } from "helpers/Api/api_technicalParameterSet";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
import moment from "moment";

const TechnicalParameters = () => {
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const {
    technicalparameter,
    addtechnicalParameter,
    updatetechnicalParameter,
    deletetechnicalParameter,
    listtetechnicalParameter } = useSelector((state) => state.technicalparameter);
  const { updateCommon } = useSelector((state) => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [parameterSetModal, setParameterSetModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [formErrors, setFormErrors] = useState({});
  const [labelvalue, setlabelValue] = useState("");
  const [labelvalueError, setlabelValueError] = useState("");
  const [optionSalesUoM, setOptionSalesUoM] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [dropDownList, setDropdownList] = useState([]);
  const [multiSelectList, setMultiSelectList] = useState([]);
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [TechnicalParametersPermission, setTechnicalParametersPermission] = useState();
  const [formData, setFormData] = useState({
    code: "",
    label: "",
    deviation: "",
    type: "",
    isReqired: true,
    uom: "",
    upper_limit: "",
    lower_limit: "",
    textfield: "",
    textarea: "",
    datebox: "",
    dateTime: "",
    timebox: "",
    emailbox: "",
    numberbox: "",
    colorbox: "",
    urlbox: "",
    numberbox: "",
    radio: "",
  });
  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };

  useEffect(() => {
    const userData = getUserData();
    var permissions = userData?.permissionList?.filter(
      (permission) =>
        permission.sub_menu_name === "technical_parameters"
    );
    setTechnicalParametersPermission(
      permissions.find((permission) => permission.sub_menu_name === "technical_parameters")
    );
    dropdownList();
    dispatch({
      type: GET_TECHNICALPARAMETER_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listtetechnicalParameter) {
      setLoading(false)
    }
    if (addtechnicalParameter) {
      setToast(true);
      setToastMessage("Technical Parameters Added Successfully");
      dispatch({
        type: GET_TECHNICALPARAMETER_REQUEST,
      });
    }
    if (updatetechnicalParameter) {
      setToast(true);
      setToastMessage("Technical Parameters Updated Successfully");
      dispatch({
        type: GET_TECHNICALPARAMETER_REQUEST,
      });
    }
    if (deletetechnicalParameter) {
      setToast(true);
      setToastMessage("Technical Parameters Deleted Successfully");
      dispatch({
        type: GET_TECHNICALPARAMETER_REQUEST,
      });
    }
    if (updateCommon) {
      setToast(true);
      setToastMessage("Technical Parameters Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_TECHNICALPARAMETER_REQUEST,
      });
    }
    setTimeout(() => {
      setToast(false);
    }, 2000);
  }, [
    addtechnicalParameter,
    updatetechnicalParameter,
    updateCommon,
    deletetechnicalParameter,
    listtetechnicalParameter,
    toast,
  ]);

  const handleClicks = () => {
    setDropdownList([]);
    setMultiSelectList([]);
    setFormData({
      code: "",
      label: "",
      deviation: "",
      type: "",
      isReqired: true,
      uom: "",
      upper_limit: "",
      lower_limit: "",
      textfield: "",
      textarea: "",
      datebox: "",
      dateTime: "",
      timebox: "",
      emailbox: "",
      numberbox: "",
      colorbox: "",
      urlbox: "",
      numberbox: "",
      radio: "",
    });
    setModal(true);
  };
  const onClickDelete = (item) => {
    setRowData(item);
    setDeleteModal(true);
  };

  const handleAddRowNestedDropDown = () => {
    const newItem = { value: "", default_value: false };
    setDropdownList([...dropDownList, newItem]);
  };

  const handleRemoveRowNestedDropDown = async idx => {
    const updatedRows = dropDownList.filter((_, index) => index !== idx);
    setDropdownList(updatedRows);
  };

  const handleRadioChange = idx => {
    const updatedList = dropDownList.map((item, index) => ({
      ...item,
      default_value: index === idx,
    }));
    setDropdownList(updatedList);
  };

  const createSet = () => {
    setParameterSetModal(true);
  };

  const handleCheckboxChange = row => {
    setSelectedRows(prevSelected =>
      prevSelected.includes(row)
        ? prevSelected.filter(item => item !== row)
        : [...prevSelected, row]
    );
  };

  const handleInputChange = (event, idx) => {
    const updatedList = dropDownList.map((item, index) =>
      index === idx ? { ...item, value: event.target.value } : item
    );
    setDropdownList(updatedList);
  };

  const handleAddRowNestedMultipleSelect = () => {
    const newItem = { value: "", default_value: false };
    setMultiSelectList([...multiSelectList, newItem]);
  };

  const handleRemoveRowNestedMultipleSelect = async idx => {
    const updatedRows = multiSelectList.filter((_, index) => index !== idx);
    setMultiSelectList(updatedRows);
  };

  const handleMultiSelectRadioChange = idx => {
    const updatedList = multiSelectList.map((item, index) => ({
      ...item,
      default_value: index === idx,
    }));
    setMultiSelectList(updatedList);
  };

  const handleMultiSelectInputChange = (event, idx) => {
    const updatedList = multiSelectList.map((item, index) =>
      index === idx ? { ...item, value: event.target.value } : item
    );
    setMultiSelectList(updatedList);
  };

  const handleDelete = async () => {
    try {
      dispatch({
        type: DELETE_TECHNICALPARAMETER_REQUEST,
        payload: rowData.id,
      });
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const saveSet = async () => {
    let isValid = true;
    if (labelvalue == "") {
      setlabelValueError(prevData => ({
        ...prevData,
        label: "Label is required",
      }));
      isValid = false;
    }
    if (selectedRows.length === 0) {
      setlabelValueError(prevData => ({
        ...prevData,
        label: "Technical Parameter Set is required",
      }));
      isValid = false;
    }

    try {
      if (isValid) {
        const valueString = selectedRows.map(item => item.id).join(", ");
        const addTechnicalParameterSet = await addTechSetApiCall(labelvalue, valueString, 0, false);
        if (addTechnicalParameterSet) {
          setToast(true);
          setParameterSetModal(false);
          setToastMessage("Technical Parameters Added Successfully");
          setTimeout(() => {
            setToast(false);
            history.push("/products/technical_parameters_set")
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const dropdownList = async () => {
    const selectUomData = await getSelectData(
      "uom_description",
      "",
      "unit_of_measure"
    );
    setOptionSalesUoM(selectUomData?.getDataByColNameData);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      emailbox: value,
    }));
    if (!validateEmail(value)) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        emailbox: "Please enter a valid email address.",
      }));
    } else {
      setFormErrors((prevErrors) => {
        const { emailbox, ...rest } = prevErrors;
        return rest;
      });
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "code" && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        code: "Code cannot be more than 50 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        code: ""
      });
    }

    if (name === "label" && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        label: "Label cannot be more than 50 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        label: ""
      });
    }

    if (name === "lower_limit" && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        lower_limit: "Lower Limit cannot be more than 50 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        lower_limit: ""
      });
    }

    if (name === "upper_limit" && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        upper_limit: "Upper Limit cannot be more than 50 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        upper_limit: ""
      });
    }

    if (name === "deviation" && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        deviation: "Deviation cannot be more than 50 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        deviation: ""
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateField = (fieldName, value) => {
    if (!value || value === "") {
      setErrors(prevErrors => ({
        ...prevErrors,
        [fieldName]: "This field is required",
      }));
    }
  };

  const validateForm = () => {
    const errorsdata = {};
    let isValid = true;

    if (!formData.uom) {
      errorsdata.uom = "Uom is required";
      isValid = false;
    }

    if (!formData.code.trim()) {
      errorsdata.code = "Code is required";
      isValid = false;
    } else if (formData.code.length > 50) {
      errorsdata.code = "Code cannot be more than 50 characters";
      isValid = false;
    }

    if (!formData.label.trim()) {
      errorsdata.label = "Label is required";
      isValid = false;
    } else if (formData.label.length > 50) {
      errorsdata.label = "Label cannot be more than 50 characters";
      isValid = false;
    }

    if (!formData.type) {
      errorsdata.type = "Type is required";
      isValid = false;
    }
    else if (formData.type == "dropdown" && dropDownList.length >= 0) {
      if (dropDownList.length == 0) {
        errorsdata.dropdown = "Dropdown Value is required";
        isValid = false;
      } else {
        errorsdata.dropdown = "";
        dropDownList.forEach((item, index) => {
          if (!item?.value || item?.value === "") {
            validateField(`dropdown-${index}`, item?.value);
            isValid = false;
          }
        });
      }
    }
    else if (formData.type == "multipleselect" && multiSelectList.length >= 0) {
      if (multiSelectList.length == 0) {
        errorsdata.multipleselect = "MultipleSelect Value is required";
        isValid = false;
      } else {
        multiSelectList.forEach((item, index) => {
          if (!item?.value || item?.value === "") {
            validateField(`multipleselect-${index}`, item?.value);
            isValid = false;
          }
        });
      }
    }
    else if (formData.type == "textfield") {
      if (formData.textfield.length === 0) {
        errorsdata.textfield = "Text Field is required";
        isValid = false;
      } else if (formData.textfield.length > 50) {
        errorsdata.textfield = "Text Field value cannot be more than 50 characters";
        isValid = false;
      }
    }
    else if (formData.type == "textarea") {
      if (formData.textarea.length === 0) {
        errorsdata.textarea = "Text Area is required";
        isValid = false;
      } else if (formData.textarea.length > 50) {
        errorsdata.textarea = "Text Area value cannot be more than 50 characters";
        isValid = false;
      }
    }
    else if (formData.type == "datebox") {
      if (formData.datebox.length === 0) {
        errorsdata.datebox = "Date is required";
        isValid = false;
      }
    }
    else if (formData.type == "dateTime") {
      if (formData.dateTime.length === 0) {
        errorsdata.dateTime = "Date Time is required";
        isValid = false;
      }
    }
    else if (formData.type == "timebox") {
      if (formData.timebox.length === 0) {
        errorsdata.timebox = "Time is required";
        isValid = false;
      }
    }
    else if (formData.type == "urlbox") {
      if (formData.urlbox.length === 0) {
        errorsdata.urlbox = "URL is required";
        isValid = false;
      } else if (formData.urlbox.length > 50) {
        errorsdata.urlbox = "URL cannot be more than 50 characters";
        isValid = false;
      }
    }
    else if (formData.type == "emailbox") {
      if (formData.emailbox.length === 0) {
        errorsdata.emailbox = "Email is required";
        isValid = false;
      } else if (!validateEmail(formData.emailbox)) {
        errorsdata.emailbox = "Please enter a valid Email";
        isValid = false;
      } else if (formData.emailbox.length > 50) {
        errorsdata.emailbox = "Email cannot be more than 50 characters"
        isValid = false;
      }
    }
    else if (formData.type == "numberbox") {
      if (formData.numberbox.length === 0) {
        errorsdata.numberbox = "Number is required";
        isValid = false;
      } else if (formData.numberbox.length > 50) {
        errorsdata.numberbox = "Number cannot be more than 50 characters";
        isValid = false;
      }
    }

    if (!formData.upper_limit.trim()) {
      errorsdata.upper_limit = "Upper Limit is required";
      isValid = false;
    } else if (formData.upper_limit.length > 50) {
      errorsdata.upper_limit = "Upper Limit cannot be more than 50 characters";
      isValid = false;
    }

    if (!formData.lower_limit.trim()) {
      errorsdata.lower_limit = "Lower Limit is required";
      isValid = false;
    } else if (formData.lower_limit.length > 50) {
      errorsdata.lower_limit = "Lower Limit cannot be more than 50 characters";
      isValid = false;
    }

    if (!formData.deviation.trim()) {
      errorsdata.deviation = "Deviation is required";
      isValid = false;
    } else if (formData.deviation.length > 50) {
      errorsdata.deviation = "Deviation cannot be more than 50 characters";
      isValid = false;
    }

    setFormErrors(errorsdata);
    if (isValid) {
      return true;
    } else {
      return isValid;
    }
  };

  const handleSaveOrEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      if (Edit) {
        const Id = Edit.id;
        const Data = {
          formData,
          dropDownList,
          multiSelectList,
          Id,
        };
        dispatch({
          type: UPDATE_TECHNICALPARAMETER_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          dropDownList,
          multiSelectList,
        };
        dispatch({
          type: ADD_TECHNICALPARAMETER_REQUEST,
          payload: Data,
        });
      }
      setModal(false);
      setEdit(null);
      resetForm();
    } catch (error) {
      console.error("Error saving/editing data:", error);
    }
  };

  const openModal = async (data = null) => {
    const technicalValueParameterData = await getTechnicalValueParameter(
      data?.id
    );
    if (technicalValueParameterData.length > 1) {
      if (data?.type === "dropdown") {
        setDropdownList(technicalValueParameterData);
      } else {
        setMultiSelectList(technicalValueParameterData);
      }
    } else {
      setDropdownList([]);
      setMultiSelectList([]);
    }
    const values =
      technicalValueParameterData.length === 1
        ? technicalValueParameterData[0]?.value
        : "";
    setEdit(data);
    setRowData(data);
    setFormData({
      value_id: technicalValueParameterData[0]?.id,
      code: data?.code || "",
      label: data?.label || "",
      type: data?.type || "",
      isReqired: data?.is_required || false,
      upper_limit: data?.upper_limit || "",
      lower_limit: data?.lower_limit || "",
      deviation: data?.deviation || "",
      uom: data?.uom?.value || "",
      textfield: data?.type === "textfield" ? values : "",
      textarea: data?.type === "textarea" ? values : "",
      datebox: data?.type === "datebox" ? values : "",
      dateTime: data?.type === "dateTime" ? values : "",
      timebox: data?.type === "timebox" ? values : "",
      emailbox: data?.type === "emailbox" ? values : "",
      numberbox: data?.type === "numberbox" ? values : "",
      colorbox: data?.type === "colorbox" ? values : "",
      urlbox: data?.type === "urlbox" ? values : "",
      numberbox: data?.type === "numberbox" ? values : "",
      radio: data?.type === "radio" ? values : "",
    });
    setModal(true);
  };

  const resetForm = () => {
    setFormErrors({})
    setErrors({});
    setEdit(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Code",
        accessor: "code",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <Input
              type="checkbox"
              style={{ cursor: "pointer" }}
              checked={selectedRows.includes(row.original)}
              onChange={() => handleCheckboxChange(row.original)}
            />
            <span className={"ms-5"}>{row.original.code}</span>{" "}
          </div>
        ),
      },
      {
        Header: "Label",
        accessor: "label",
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Upper Limit",
        accessor: "upper_limit",
      },
      {
        Header: "Lower Limit",
        accessor: "lower_limit",
      },
      {
        Header: "Uom",
        accessor: "uom.label",
      },
      {
        Header: "IsReqired",
        accessor: "isReqired",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Created On",
        accessor: "createdon",
        Cell: ({ value }) => {
          const formattedDate = moment(value).format("DD/MM/YYYY");
          return <div>{formattedDate}</div>;
        },
      },
      {
        Header: "Status",
        accessor: "isactive",
        Cell: (cellProps) => (
          <div className="form-check form-switch mb-3" dir="ltr">
            <input
              type="checkbox"
              className="form-check-input"
              id=""
              checked={cellProps.row.original.isactive}
              onClick={() => {
                dispatch({
                  type: STATUS_REQUEST,
                  payload: {
                    name: "technical_parameters_master",
                    isactive: !cellProps.row.original.isactive,
                    id: cellProps.row.original?.id,
                  },
                });
              }}
            />
          </div>
        ),
      },
      {
        Header: "Actions",
        accessor: "action",
        disableFilters: true,
        Cell: (cellProps) => (
          <div className="d-flex gap-3">
            {TechnicalParametersPermission?.can_edit && (
              <Link
                to="#"
                className="text-success"
                onClick={() => openModal(cellProps.row.original)}
              >
                <i
                  className="mdi mdi-pencil-box font-size-18"
                  id="edittooltip"
                />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
              </Link>
            )}
            {TechnicalParametersPermission?.can_delete && (
              <Link
                to="#"
                className="text-danger"
                onClick={() => onClickDelete(cellProps.row.original)}
              // onClick={() => {
              //   const DATA = cellProps.row.original;
              //   onClickDelete(DATA);
              // }}
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>
            )}
          </div>
        ),
      },
    ],
    [dispatch, TechnicalParametersPermission,selectedRows]
  );

  document.title = "Detergent | Technical Parameter";
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
          <DeleteModal
            show={deleteModal}
            title1="Are you sure?"
            title2="You won't be able to revert this!"
            className="mdi mdi-alert-circle-outline"
            saveTitle="Yes, delete it!"
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
          />
          <Breadcrumbs
            titlePath="#"
            title="Products"
            breadcrumbItem="Technical Parameters"
          />
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={
                technicalparameter && technicalparameter.length > 0
                  ? technicalparameter
                  : []
              }
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                TechnicalParametersPermission && TechnicalParametersPermission?.can_add
                  ? "Add Technical Parameters"
                  : null
              }
              handleClicks={handleClicks}
              selectedRows={selectedRows}
              handleCheckboxChange={handleCheckboxChange}
              createSet={createSet}
              showCreateSet={true}
              buttonSizes={
                selectedRows.length > 0
                  ? {
                    createSet: "5",
                    addButtonLabel: "3",
                  }
                  : { addButtonLabel: "8" }
              }
            />
          )}
        </div>
        <Modal isOpen={modal} centered>
          <div className="modal-header">
            {Edit ? "Edit Technical Parameter" : "Add Technical Parameter"}
            <button
              type="button"
              onClick={() => {
                resetForm();
                setModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Form onSubmit={handleSaveOrEdit}>
              <Row>
                <Col md={4} className="">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Code</Label>
                    <Input
                      type="text"
                      name="code"
                      className={`form-control ${formErrors.code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter Code"
                      value={formData?.code}
                      onChange={handleChange}
                    />
                    {formErrors.code && (
                      <div className="invalid-feedback">{formErrors.code}</div>
                    )}
                  </div>
                </Col>
                <Col md={4} className="">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Label</Label>
                    <Input
                      type="text"
                      name="label"
                      className={`form-control ${formErrors.label ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter Label"
                      value={formData?.label}
                      onChange={handleChange}
                    />
                    {formErrors.label && (
                      <div className="invalid-feedback">{formErrors.label}</div>
                    )}
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <label htmlFor="type">Type</label>
                  <select
                    className="form-select"
                    value={formData?.type}
                    onChange={async event => {
                      setFormData(prevData => ({
                        ...prevData,
                        type: event.target.value,
                      }));
                    }}
                  >
                    <option value="">Select</option>
                    <option key="textfield" value="textfield">
                      TextField
                    </option>
                    <option key="textarea" value="textarea">
                      TextArea
                    </option>
                    <option key="dropdown" value="dropdown">
                      Dropdown
                    </option>
                    <option key="multipleselect" value="multipleselect">
                      MultipleSelect
                    </option>
                    <option key="datebox" value="datebox">
                      Date
                    </option>
                    <option key="dateTime" value="dateTime">
                      DateTime
                    </option>
                    <option key="timebox" value="timebox">
                      Time
                    </option>
                    <option key="urlbox" value="urlbox">
                      URL
                    </option>
                    <option key="emailbox" value="emailbox">
                      Email
                    </option>
                    <option key="numberbox" value="numberbox">
                      Number
                    </option>
                    <option key="colorbox" value="colorbox">
                      Color
                    </option>
                  </select>
                  {formErrors.type && (
                    <div
                      style={{
                        color: "#f46a6a",
                        fontSize: "80%",
                      }}
                    >
                      {formErrors.type}
                    </div>
                  )}
                </Col>

                {formData.type === "textfield" && (
                  <Col md={4} className="mb-3">
                    <Label htmlFor="textarea">TextField</Label>
                    <Input
                      type="text"
                      id="textfield"
                      name="textfield"
                      className={`form-control ${formErrors.textfield ? "is-invalid" : ""
                        }`}
                      value={formData.textfield}
                      rows="3"
                      placeholder="Please Enter Text Field"
                      onChange={e => {
                        setFormData(prevData => ({
                          ...prevData,
                          textfield: e.target.value,
                        }));
                        setFormErrors(prevErrors => ({
                          ...prevErrors,
                          textfield: "",
                        }));
                      }}
                    />
                    {formErrors.textfield && (
                      <div className="invalid-feedback">
                        {formErrors.textfield}
                      </div>
                    )}
                  </Col>
                )}

                {formData.type === "textarea" && (
                  <Col md={4} className="mb-3">
                    <Label htmlFor="textarea">Text Area</Label>
                    <Input
                      type="textarea"
                      id="textarea"
                      name="textarea"
                      className={`form-control ${formErrors.textarea ? "is-invalid" : ""
                        }`}
                      value={formData.textarea}
                      rows="3"
                      placeholder="Please Enter Text Area"
                      onChange={e => {
                        setFormData(prevData => ({
                          ...prevData,
                          textarea: e.target.value,
                        }));
                        setFormErrors(prevErrors => ({
                          ...prevErrors,
                          textarea: "",
                        }));
                      }}
                    />
                    {formErrors.textarea && (
                      <div className="invalid-feedback">
                        {formErrors.textarea}
                      </div>
                    )}
                  </Col>
                )}

                {formData.type === "dropdown" && (
                  <>
                    <Col md={4} className="mb-3">
                      {!Edit && (
                        <Button
                          onClick={handleAddRowNestedDropDown}
                          color="primary"
                        >
                          Add DropDown
                        </Button>
                      )}
                      {formErrors.dropdown && (
                        <div
                          style={{
                            color: "#f46a6a",
                            fontSize: "80%",
                          }}
                        >
                          {formErrors.dropdown}
                        </div>
                      )}
                    </Col>
                    {dropDownList.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <Col md={4} className="mb-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="dropdownRadio"
                              id={`dropdownRadio_${idx}`}
                              value={`${idx}`}
                              checked={item.default_value}
                              onChange={() => handleRadioChange(idx)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`dropdownRadio_${idx}`}
                            >
                              Default
                            </label>
                          </div>
                        </Col>
                        <Col md={Edit ? 7 : 6} className="mb-3">
                          <Input
                            type="text"
                            className="inner form-control"
                            placeholder={`Dropdown ${idx + 1}`}
                            onChange={event => handleInputChange(event, idx)}
                            value={item.value}
                          />
                          {errors[`dropdown-${idx}`] && (
                            <div className="text-danger">
                              {errors[`dropdown-${idx}`]}
                            </div>
                          )}
                        </Col>
                        {!Edit && (
                          <Col md={4} className="mb-3">
                            <Button
                              onClick={() => handleRemoveRowNestedDropDown(idx)}
                              color="danger"
                              style={{ width: "50%" }}
                            >
                              <i className="mdi mdi-delete font-size-18" />
                            </Button>
                          </Col>
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}

                {formData.type === "multipleselect" && (
                  <>
                    <Col md={4} className="mb-3">
                      {!Edit && (
                        <Button
                          onClick={handleAddRowNestedMultipleSelect}
                          color="primary"
                        >
                          Add MultipleSelect
                        </Button>
                      )}
                      {formErrors.multipleselect && (
                        <div
                          style={{
                            color: "#f46a6a",
                            fontSize: "80%",
                          }}
                        >
                          {formErrors.multipleselect}
                        </div>
                      )}
                    </Col>
                    {multiSelectList.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <Col md={4} className="mb-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="multipleselectRadio"
                              id={`multipleselectRadio_${idx}`}
                              value={`${idx}`}
                              checked={item.default_value}
                              onChange={() => handleMultiSelectRadioChange(idx)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`multipleselectRadio_${idx}`}
                            >
                              Default
                            </label>
                          </div>
                        </Col>
                        <Col md={Edit ? 7 : 6} className="mb-3">
                          <Input
                            type="text"
                            className="inner form-control"
                            placeholder={`MultipleSelect ${idx + 1}`}
                            onChange={event =>
                              handleMultiSelectInputChange(event, idx)
                            }
                            value={item.value}
                          />
                          {errors[`multipleselect-${idx}`] && (
                            <div className="text-danger">
                              {errors[`multipleselect-${idx}`]}
                            </div>
                          )}
                        </Col>
                        {!Edit && (
                          <Col md={6} className="mb-3">
                            <Button
                              onClick={() =>
                                handleRemoveRowNestedMultipleSelect(idx)
                              }
                              color="danger"
                              style={{ width: "50%" }}
                            >
                              <i className="mdi mdi-delete font-size-18" />
                            </Button>
                          </Col>
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}
                {formData.type === "datebox" && (
                  <Col md={4} className="mb-3">
                    <Label htmlFor="textarea">Default Date</Label>
                    <Flatpickr
                      placeholder="dd M, yyyy"
                      options={{
                        altInput: true,
                        altFormat: "j F, Y",
                        dateFormat: "Y-m-d",
                      }}
                      onChange={selectedDates => {
                        setFormData(prevData => ({
                          ...prevData,
                          datebox: moment(selectedDates[0]).format(
                            "DD/MM/YYYY"
                          ),
                        }));
                      }}
                      value={moment(formData?.datebox, "DD/MM/YYYY").toDate()}
                    />
                    {formErrors.datebox && (
                      <div
                        style={{
                          color: "#f46a6a",
                          fontSize: "80%",
                        }}
                      >
                        {formErrors.datebox}
                      </div>
                    )}
                  </Col>
                )}

                {formData.type === "dateTime" && (
                  <Col md={4} className="mb-3">
                    <Label htmlFor="textarea">Default DateTime</Label>
                    <Flatpickr
                      placeholder="dd M, yyyy HH:mm"
                      options={{
                        altInput: true,
                        altFormat: "j F, Y h:i K",
                        dateFormat: "Y-m-d h:i K",
                        enableTime: true,
                        time_24hr: false,
                      }}
                      onChange={selectedDates => {
                        setFormData(prevData => ({
                          ...prevData,
                          dateTime: moment(selectedDates[0]).format(
                            "DD/MM/YYYY hh:mm A"
                          ),
                        }));
                      }}
                      value={moment(
                        formData?.dateTime,
                        "DD/MM/YYYY hh:mm A"
                      ).toDate()}
                    />
                    {formErrors.dateTime && (
                      <div
                        style={{
                          color: "#f46a6a",
                          fontSize: "80%",
                        }}
                      >
                        {formErrors.dateTime}
                      </div>
                    )}
                  </Col>
                )}

                {formData.type === "timebox" && (
                  <Col md={4} className="mb-3">
                    <Label htmlFor="textarea">Default Time</Label>
                    <Flatpickr
                      placeholder="HH:mm"
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: "h:i K",
                        altFormat: "h:i K",
                        time_24hr: false,
                      }}
                      onChange={selectedDates => {
                        setFormData(prevData => ({
                          ...prevData,
                          timebox: moment(selectedDates[0]).format("hh:mm A"),
                        }));
                      }}
                      value={moment(formData?.timebox, "hh:mm A").toDate()}
                    />
                    {formErrors.timebox && (
                      <div
                        style={{
                          color: "#f46a6a",
                          fontSize: "80%",
                        }}
                      >
                        {formErrors.timebox}
                      </div>
                    )}
                  </Col>
                )}

                {formData.type === "urlbox" && (
                  <Col md={4} className="mb-3">
                    <Label htmlFor="textarea">Url</Label>
                    <Input
                      type="text"
                      id="urlbox"
                      name="urlbox"
                      className={`form-control ${formErrors.urlbox ? "is-invalid" : ""
                        }`}
                      value={formData.urlbox}
                      rows="3"
                      placeholder="Please Enter Url"
                      onChange={e => {
                        setFormData(prevData => ({
                          ...prevData,
                          urlbox: e.target.value,
                        }));
                        setFormErrors(prevErrors => ({
                          ...prevErrors,
                          urlbox: "",
                        }));
                      }}
                    />
                    {formErrors.urlbox && (
                      <div className="invalid-feedback">
                        {formErrors.urlbox}
                      </div>
                    )}
                  </Col>
                )}

                {formData.type === "emailbox" && (
                  <Col md={4} className="mb-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="emailbox"
                      name="emailbox"
                      className={`form-control ${formErrors.emailbox ? "is-invalid" : ""
                        }`}
                      value={formData.emailbox}
                      placeholder="Please Enter Email"
                      onChange={handleEmailChange}
                    />
                    {formErrors.emailbox && (
                      <div className="invalid-feedback">
                        {formErrors.emailbox}
                      </div>
                    )}
                  </Col>
                )}
                {formData.type === "colorbox" && (
                  <Col md={4} className="mb-3">
                    <Label htmlFor="email">Color</Label>
                    <Input
                      type="color"
                      id="colorbox"
                      name="colorbox"
                      className={`form-control ${formErrors.colorbox ? "is-invalid" : ""
                        }`}
                      value={formData.colorbox}
                      onChange={e => {
                        setFormData(prevData => ({
                          ...prevData,
                          colorbox: e.target.value,
                        }));
                        setFormErrors(prevErrors => ({
                          ...prevErrors,
                          colorbox: "",
                        }));
                      }}
                    />
                    {formErrors.colorbox && (
                      <div className="invalid-feedback">
                        {formErrors.colorbox}
                      </div>
                    )}
                  </Col>
                )}
                {formData.type === "numberbox" && (
                  <Col md={4} className="mb-3">
                    <Label htmlFor="email">Number</Label>
                    <Input
                      type="number"
                      id="numberbox"
                      name="numberbox"
                      className={`form-control ${formErrors.numberbox ? "is-invalid" : ""
                        }`}
                      value={formData.numberbox}
                      placeholder="Enter Number"
                      onChange={e => {
                        setFormData(prevData => ({
                          ...prevData,
                          numberbox: e.target.value,
                        }));
                        setFormErrors(prevErrors => ({
                          ...prevErrors,
                          numberbox: "",
                        }));
                      }}
                    />
                    {formErrors.numberbox && (
                      <div className="invalid-feedback">
                        {formErrors.numberbox}
                      </div>
                    )}
                  </Col>
                )}

                <Col md={4} className="mb-3">
                  <label htmlFor="uom">UoM</label>
                  <select
                    className="form-select"
                    value={formData?.uom}
                    onChange={async event => {
                      const selectedOption = optionSalesUoM.find(
                        option => option.value == event.target.value
                      );
                      setFormData(prevData => ({
                        ...prevData,
                        uom: selectedOption?.value,
                      }));
                    }}
                  >
                    <option value="0">Select UoM</option>
                    {optionSalesUoM?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.uom && (
                    <div
                      style={{
                        color: "#f46a6a",
                        fontSize: "80%",
                      }}
                    >
                      {formErrors.uom}
                    </div>
                  )}
                </Col>
                <Col md={4} className="mb-3">
                  <Label htmlFor="name">Lower Limit</Label>
                  <Input
                    type="number"
                    id="name"
                    name="lower_limit"
                    className={`form-control ${formErrors.lower_limit ? "is-invalid" : ""
                      }`}
                    value={formData.lower_limit}
                    rows="2"
                    placeholder="Enter Here"
                    onChange={handleChange}
                  />
                  {formErrors.lower_limit && (
                    <div className="invalid-feedback">
                      {formErrors.lower_limit}
                    </div>
                  )}
                </Col>
                <Col md={4} className="mb-3">
                  <Label htmlFor="name">Upper Limit</Label>
                  <Input
                    type="number"
                    id="name"
                    name="upper_limit"
                    className={`form-control ${formErrors.upper_limit ? "is-invalid" : ""
                      }`}
                    value={formData.upper_limit}
                    rows="3"
                    placeholder="Enter Here"
                    onChange={handleChange}
                  />
                  {formErrors.upper_limit && (
                    <div className="invalid-feedback">
                      {formErrors.upper_limit}
                    </div>
                  )}
                </Col>
                <Col md={4} className="">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Deviation</Label>
                    <Input
                      type="text"
                      name="deviation"
                      className={`form-control ${formErrors.deviation ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter Deviation"
                      value={formData?.deviation}
                      onChange={handleChange}
                    />
                    {formErrors.deviation && (
                      <div className="invalid-feedback">
                        {formErrors.deviation}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="">
                  <div className="form-check form-switch mb-3" dir="ltr">
                    <label
                      className="form-check-label"
                      htmlFor="customSwitchsizesm"
                    >
                      IsRequired
                    </label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="customSwitchsizesm"
                      checked={formData?.isReqired}
                      onClick={() => {
                        setFormData(prevData => ({
                          ...prevData,
                          isReqired: !formData?.isReqired,
                        }));
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <div className="mt-3">
                <Button
                  //color="primary"
                  type="submit"
                  className="btn-custom-theme "
                >
                  Save
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        <Modal isOpen={parameterSetModal} centered>
          <div className="modal-header">
            Parameter Set
            <button
              type="button"
              onClick={() => {
                resetForm();
                setParameterSetModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Row>
              <Col md={12} className="3">
                <div className="mb-3">
                  <Label htmlFor="formrow-state-Input">Label</Label>
                  <Input
                    type="text"
                    name="label"
                    className={`form-control ${formErrors.labelvalue ? "is-invalid" : ""
                      }`}
                    id="formrow-state-Input"
                    placeholder="Please Enter Label"
                    value={labelvalue}
                    onChange={e => setlabelValue(e.target.value)}
                  />
                </div>
                {labelvalueError && (
                  <div
                    style={{
                      color: "#f46a6a",
                      fontSize: "80%",
                    }}
                  >
                    {labelvalueError?.label}
                  </div>
                )}
              </Col>
            </Row>
            <div className="mt-3">
              <Button
                //color="primary"
                onClick={saveSet}
                className="btn-custom-theme "
              >
                Save
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default TechnicalParameters;
