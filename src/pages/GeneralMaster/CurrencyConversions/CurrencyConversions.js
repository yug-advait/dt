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
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import DeleteModal from "components/Common/DeleteModal";
import {
  ADD_CURRENCYCONVERSIONS_REQUEST,
  GET_CURRENCYCONVERSIONS_REQUEST,
  UPDATE_CURRENCYCONVERSIONS_REQUEST,
  DELETE_CURRENCYCONVERSIONS_REQUEST,
} from "../../../store/currencyConversions/actionTypes";
import Select from "react-select";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { getCurrencyConverter } from "helpers/Api/api_common";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
import ViewModal from "components/Common/ViewModal";
 
const CurrencyConversions = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const {
    currencyConversions,
    addCurrencyConversions,
    listCurrencyConversions,
    updateCurrencyConversions,
    deleteCurrencyConversions,
    error,
  } = useSelector(state => state.currencyConversions);
  const [loading, setLoading] = useState(true);
  const [selectCurrencyFrom, setSelectedCurrencyFrom] = useState({});
  const [CValue, setCValue] = useState(0);
  const [optionCurrency, setOptionCurrency] = useState([]);
  const [selectCurrencyTo, setSelectedCurrencyTo] = useState({});
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [currencyConversionsPermission, setCurrencyConversionsPermission] = useState();
  const [formData, setFormData] = useState({
    currency_code_from: "",
    code_from: "",
    currency_description_from: "",
    currency_description_to: "",
    currency_code_to: "",
    code_to: "",
    valid_from: "",
    base_value: "",
    buying_selling: true,
    isactive: isActive,
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
      permission =>
        permission.sub_menu_name === "currency_conversions"
    );
    setCurrencyConversionsPermission(
      permissions.find(permission => permission.sub_menu_name === "currency_conversions")
    );
    dispatch({
      type: GET_CURRENCYCONVERSIONS_REQUEST,
      payload: [],
    });
  }, []);
 
  useEffect(() => {
    if (listCurrencyConversions) {
      setLoading(false)
    }
    if (addCurrencyConversions) {
      setToastMessage("New Currency Conversion Created Successfully");
      dispatch({
        type: GET_CURRENCYCONVERSIONS_REQUEST,
      });
      setToast(true);
    }
    setOptionCurrency(currencyConversions?.currencies);
 
    if (updateCurrencyConversions) {
      setToastMessage("New Currency Conversion Updated Successfully");
      dispatch({
        type: GET_CURRENCYCONVERSIONS_REQUEST,
      });
      setToast(true);
    }
    if (deleteCurrencyConversions) {
      setToastMessage("New Currency Conversion Deleted Successfully");
      dispatch({
        type: GET_CURRENCYCONVERSIONS_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Currency Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_CURRENCYCONVERSIONS_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    addCurrencyConversions,
    listCurrencyConversions,
    updateCurrencyConversions,
    deleteCurrencyConversions,
    updateCommon,
    toast,
  ]);
 
  const currencyConverterData = async amount => {
    var CurrencyConverterData = await getCurrencyConverter(
      formData?.code_from,
      formData?.code_to,
      amount
    );
    setCValue(CurrencyConverterData?.value);
  };
  const handleClicks = () => {
    setSelectedCurrencyFrom({});
    setCValue(0);
    setSelectedCurrencyTo({});
    setFormData({
      currency_code_from: "",
      code_from: "",
      code_to: "",
      valid_from: "",
      currency_description_from: "",
      currency_description_to: "",
      currency_code_to: "",
      base_value: "",
      buying_selling: true,
      isactive: true,
    });
    setModal(true);
  };
  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };
 
  const handleDelete = async () => {
    try {
      dispatch({
        type: DELETE_CURRENCYCONVERSIONS_REQUEST,
        payload: rowData.id,
      });
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
 
  const handleChange = e => {
    const {name, value} = e.target;
    let newValue = value;
 
    if (name === 'currency_description_from') {
      if (value.length > 70) {
        newValue = value.slice(0, 70);
        setFormErrors({
          ...formErrors,
          currency_description_from: "Currency Description From cannot be more than 70 characters"
        });

      } else {
        setFormErrors({
          ...formErrors,
          currency_description_from: ""
        });
      }
   
    }
   
    if (name === 'currency_description_to') {
      if (value.length > 70) {
        newValue = value.slice(0, 70);
        setFormErrors({
          ...formErrors,
          currency_description_to: "Currency Description To cannot be more than 70 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          currency_description_to: ""
        });
      }
    }
 
    setFormData({
      ...formData,
      [name] : value,
    });
  };
 
  const validateForm = () => {
    const errors = {};
 
    if (!formData.currency_code_from) {
      errors.currency_code_from = "Currency Code From is required";
    }
   
    if (!formData.currency_description_from) {
      errors.currency_description_from =
        "Currency Description From is required";
    } else if (formData.currency_description_from.trim().length > 70) {
      errors.currency_description_from = "Currency Description From cannot be more than 70 characters"
    }
 
    if (!formData.currency_code_to) {
      errors.currency_code_to = "Currency Code To is required";
    }
 
    if (!formData.currency_description_to) {
      errors.currency_description_to = "Currency Description To is required";
    } else if (formData.currency_description_to.trim().length > 70) {
      errors.currency_description_to = "Currency Description To cannot be more than 70 characters"
    }
 
    if (!formData.valid_from) {
      errors.valid_from = "Valid From is required";
    }
 
    if (!formData.valid_to) {
      errors.valid_to = "Valid To is required";
    }
 
    if (!formData.base_value) {
      errors.base_value = "Base Value is required";
    } else if (formData.base_value.length > 10) {
      errors.base_value = "Base Value cannot be more than 10 characters"
    }
 
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSaveOrEdit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      if (Edit) {
        const Id = Edit.id;
        const StateData = {
          formData,
          isActive,
          Id,
          CValue,
        };
        dispatch({
          type: UPDATE_CURRENCYCONVERSIONS_REQUEST,
          payload: StateData,
        });
      } else {
        const StateData = {
          formData,
          isActive,
          CValue,
        };
        dispatch({
          type: ADD_CURRENCYCONVERSIONS_REQUEST,
          payload: StateData,
        });
      }
      setModal(false);
      setEdit(null);
      resetForm();
    } catch (error) {
      console.error("Error saving/editing data:", error);
    }
  };
 
  const openModal = (data = null) => {
    setEdit(data);
    setRowData(data);
    setCValue(data?.conversion_value);
    setSelectedCurrencyFrom(data?.convert_currency_from);
    setCValue(data?.conversion_value);
    setSelectedCurrencyTo(data?.convert_currency_to);
    setFormData({
      currency_code_from: data?.convert_currency_from?.value,
      code_from: data?.convert_currency_from?.label,
      code_to: data?.convert_currency_to?.label,
      currency_description_from: data?.currency_description_from,
      currency_code_to: data?.convert_currency_to?.value,
      currency_description_to: data?.currency_description_to,
      valid_from: moment(data.valid_from).format("YYYY-MM-DD") || "",
      valid_to: moment(data.valid_to).format("YYYY-MM-DD") || "",
      base_value: data?.base_value,
      buying_selling: data?.buying_selling,
      isactive: data?.isactive,
    });
    setModal(true);
    if (data) {
      setIsActive(data.isactive);
    }
  };
 
  const resetForm = () => {
    setFormErrors({})
    setErrors({});
    setEdit(null);
  };
 
  const columns = useMemo(
    () => [
      {
        Header: "Currency Code From",
        accessor: "convert_currency_from.label",
      },
      // {
      //   Header: "Currency Description From",
      //   accessor: "currency_description_from",
      // },
      {
        Header: "Currency Code To",
        accessor: "convert_currency_to.label",
      },
      // {
      //   Header: "Currency Description To",
      //   accessor: "currency_description_to",
      // },
      {
        Header: "Base Value",
        accessor: "base_value",
      },
      {
        Header: "Conversion Value",
        accessor: "conversion_value",
      },
      {
        Header: "Buying/Selling",
        accessor: "buying_selling",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Valid From ",
        accessor: "valid_from",
        Cell: ({ value }) => {
          const valid_from = moment(value).format("DD/MM/YYYY");
          return <div>{valid_from}</div>;
        },
      },
      {
        Header: "Valid To",
        accessor: "valid_to",
        Cell: ({ value }) => {
          const valid_to = moment(value).format("DD/MM/YYYY");
          return <div>{valid_to}</div>;
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
        Cell: cellProps => {
          return (
            <>
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
                        name: "currency_conversion_master",
                        isactive: !cellProps.row.original.isactive,
                        id: cellProps.row.original?.id,
                      },
                    });
                  }}
                />
              </div>
            </>
          );
        },
      },
      {
        Header: "Actions",
        accessor: "action",
        disableFilters: true,
        Cell: cellProps => {
          const rowData = cellProps.row.original;
          const viewFields = [
            { label: "Currency Code From", value: rowData.convert_currency_from?.label },
            { label: "Currency Description From", value: rowData.currency_description_from },
            { label: "Currency Code To", value: rowData.convert_currency_to?.label },
            { label: "Currency Description To", value: rowData.currency_description_to },
            { label: "Base Value", value: rowData.base_value },
            { label: "Conversion Value", value: rowData.conversion_value },
            { label: "Buying/Selling", value: rowData.buying_selling ? "Buying" : "Selling" },
            { label: "Valid From", value: moment(rowData.valid_from).format("DD/MM/YYYY") },
            { label: "Valid To", value: moment(rowData.valid_to).format("DD/MM/YYYY") },
            { label: "Created On", value: moment(rowData.createdon).format("DD/MM/YYYY") },
            { label: "Status", value: rowData.isactive ? "Active" : "Inactive" }
          ];

          return (
            <div className="d-flex gap-3">
              <ViewModal 
                title="Currency Conversion Details" 
                fields={viewFields}
                onEdit={() => openModal(rowData)}
              />
              {currencyConversionsPermission && currencyConversionsPermission?.can_edit ? (
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
              ) : null}

              {currencyConversionsPermission && currencyConversionsPermission?.can_delete ? (
                <Link
                  to="#"
                  className="text-danger"
                  onClick={() => {
                    const DATA = cellProps.row.original;
                    onClickDelete(DATA);
                  }}
                >
                  <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                  <UncontrolledTooltip placement="top" target="deletetooltip">
                    Delete
                  </UncontrolledTooltip>
                </Link>
              ) : null}
            </div>
          );
        },
      },
    ],
    [status, currencyConversionsPermission]
  );
 
  document.title = "Detergent | Currency Conversion";
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
            title="Master"
            breadcrumbItem="Currency Conversion"
          />
 
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={
                currencyConversions.currency_conversions &&
                  currencyConversions.currency_conversions.length > 0
                  ? currencyConversions.currency_conversions
                  : []
              }
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                currencyConversionsPermission && currencyConversionsPermission?.can_add
                  ? "Add Currency Conversion"
                  : null
              }
              handleClicks={handleClicks}
            />
          )}
        </div>
        <Modal isOpen={modal} centered>
          <div className="modal-header">
            {Edit ? "Edit" : "Add"}
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
                <Col md={6} className="mb-3">
                  <div className="">
                    <Label htmlFor="formrow-state-Select">
                      Currency Code From
                    </Label>
                    <Select
                      name="currency_code_from"
                      id="formrow-state-Input"
                      value={selectCurrencyFrom}
                      onChange={async selectCurrencyFrom => {
                        setSelectedCurrencyFrom(selectCurrencyFrom);
                        const selectedOption = optionCurrency.find(
                          option => option.value == selectCurrencyFrom.value
                        );
                        setFormData(prevData => ({
                          ...prevData,
                          currency_code_from: selectedOption?.value,
                          code_from: selectedOption?.label,
                        }));
                        var CurrencyConverterData = await getCurrencyConverter(
                          selectedOption?.label,
                          formData?.code_to,
                          formData?.base_value
                        );
                        setCValue(CurrencyConverterData?.value);
                      }}
                      options={optionCurrency}
                    />
                    {formErrors.currency_code_from && (
                      <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                        {formErrors.currency_code_from}
                      </div>
                    )}
                  </div>
                </Col>
 
                <Col md={6} className="mb-3">
                  <Label htmlFor="countryDescription">
                    Currency Description From
                  </Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="currency_description_from"
                    className={`form-control ${formErrors.currency_description_from ? "is-invalid" : ""
                      }`}
                    value={formData.currency_description_from}
                    rows="1"
                    placeholder="Enter Here"
                    onChange={handleChange}
                  />
                  {formErrors.currency_description_from && (
                    <div className="invalid-feedback">
                      {formErrors.currency_description_from}
                    </div>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <div>
                    <Label htmlFor="formrow-state-Input">
                      Currency Code To
                    </Label>
                    <Select
                      name="currency_code_to"
                      id="formrow-state-Input"
                      value={selectCurrencyTo}
                      onChange={async selectCurrencyTo => {
                        setSelectedCurrencyTo(selectCurrencyTo);
                        setFormData(prevData => ({
                          ...prevData,
                          currency_code_to: selectCurrencyTo?.value,
                          code_to: selectCurrencyTo?.label,
                        }));
                        const selectedOption = optionCurrency.find(
                          option => option.value == selectCurrencyTo.value
                        );
                        setFormData(prevData => ({
                          ...prevData,
                          currency_code_to: selectedOption?.value,
                        }));
                        var CurrencyConverterData = await getCurrencyConverter(
                          formData?.code_from,
                          selectedOption?.label,
                          formData?.base_value
                        );
                        setCValue(CurrencyConverterData?.value);
                      }}
                      options={optionCurrency}
                    />
                    {formErrors.currency_code_to && (
                      <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                        {formErrors.currency_code_to}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <Label htmlFor="countryDescription">
                    Currency Description To
                  </Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="currency_description_to"
                    className={`form-control ${formErrors.currency_description_to ? "is-invalid" : ""
                      }`}
                    value={formData.currency_description_to}
                    rows="1"
                    placeholder=" Enter Here"
                    onChange={handleChange}
                  />
                  {formErrors.currency_description_to && (
                    <div className="invalid-feedback">
                      {formErrors.currency_description_to}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="countryDescription">Base Value</Label>
                  <Input
                    type="number"
                    id="countryDescription"
                    name="base_value"
                    className={`form-control ${formErrors.base_value ? "is-invalid" : ""
                      }`}
                    value={formData.base_value}
                    rows="1"
                    placeholder="Please Enter Base Value"
                    onChange={async e => {
                      setFormData(prevData => ({
                        ...prevData,
                        base_value: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        base_value: "",
                      }));
                      currencyConverterData(e.target.value);
                    }}
                  />
                  {formErrors.base_value && (
                    <div className="invalid-feedback">
                      {formErrors.base_value}
                    </div>
                  )}
                </Col>
                <Col md={4} className="mb-3">
                  <div className="">
                    <label htmlFor="formrow-state-Input" className="form-label">
                      Conversion Value :
                    </label>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <p className="form-input form-label">{CValue}</p>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="">
                    <label htmlFor="formrow-state-Input" className="form-label">
                      Buying/Selling :
                    </label>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="">
                    <Input
                      type="checkbox"
                      style={{ cursor: "pointer" }}
                      checked={formData.buying_selling}
                      onChange={e =>
                        setFormData(prevData => ({
                          ...prevData,
                          buying_selling: e.target.checked,
                        }))
                      }
                    />
                    {formData.buying_selling == true ? <span>  Default is Buying</span> : null}
                  </div>
                </Col>
                <Col lg="4">
                  <div className="form-floating mb-3">
                    <Flatpickr
                      options={{
                        altInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                        minDate: "today"
                      }}
                      onChange={(selectedDates, dateStr, instance) => {
                        const selectedDate = moment(selectedDates[0]).format("YYYY-MM-DD");
 
                        setFormData(prevData => ({
                          ...prevData,
                          valid_from: selectedDate,
                        }));
 
                        if (formData.valid_to && moment(selectedDate).isAfter(moment(formData.valid_to))) {
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
                      value={moment(formData?.valid_from, "YYYY-MM-DD").toDate()}
                    />
                    <label htmlFor="valid_from">Valid From</label>
                    {formErrors.valid_from && (
                      <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                        {formErrors.valid_from}
                      </div>
                    )}
                  </div>
                </Col>
 
                <Col lg="4">
                  <div className="form-floating mb-3">
                    <Flatpickr
                      options={{
                        altInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                        minDate: "today"
                      }}
                      onChange={(selectedDates, dateStr, instance) => {
                        const selectedDate = moment(selectedDates[0]).format("YYYY-MM-DD");
 
                        if (moment(selectedDate).isBefore(moment(formData.valid_from))) {
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
                      value={moment(formData?.valid_to, "YYYY-MM-DD").toDate()}
                    />
                    <label htmlFor="valid_to">Valid To</label>
                    {formErrors.valid_to && (
                      <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                        {formErrors.valid_to}
                      </div>
                    )}
                  </div>
                </Col>
 
                <Col md={6} className="">
                  <div className="form-check form-switch mb-3" dir="ltr">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="customSwitchsizesm"
                      checked={isActive}
                      onClick={() => {
                        setIsActive(!isActive);
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="customSwitchsizesm"
                    >
                      Status
                    </label>
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
      </div>
    </React.Fragment>
  );
};
 
export default CurrencyConversions;