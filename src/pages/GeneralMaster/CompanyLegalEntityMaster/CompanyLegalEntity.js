import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import Select from "react-select";
import debounce from "lodash/debounce";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
  ADD_COMPANYLEGALENTITY_REQUEST,
  GET_COMPANYLEGALENTITY_REQUEST,
  UPDATE_COMPANYLEGALENTITY_REQUEST,
  DELETE_COMPANYLEGALENTITY_REQUEST,
} from "../../../store/companyLegalEntity/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import { getSelectData, getRelatedRecords } from "helpers/Api/api_common";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
import moment from "moment";
const CompanyLegalEntity = () => {
  const [modal, setModal] = useState(false);
  const [selectCountry, setSelectedCountry] = useState({});
  const [optionCountry, setOptionCountry] = useState([]);
  const [selectState, setSelectedState] = useState({});
  const [optionState, setOptionState] = useState([]);
  const [taxId, setTaxID] = useState([]);
  const [address, setAddress] = useState([]);
  const dispatch = useDispatch();
  const {
    companyLegalEntity,
    addCompanyLegalEntity,
    listCompanyLegalEntity,
    updateCompanyLegalEntity,
    deleteCompanyLegalEntity,
    error,
  } = useSelector(state => state.companyLegalEntity);
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
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    company_code: "",
    company_name: "",
    registration_number: "",
    pan_number: "",
    tan: "",
    tin: "",
    tax_id_1: "",
    tax_id_2: "",
    tax_id_3: "",
    tax_id_4: "",
    tax_id_5: "",
    address_1: "",
    address_2: "",
    address_3: "",
    country_id: "",
    state_id: "",
    city: "",
    pincode: "",
    isactive: isActive,
  });

  const countryState = async () => {
    const selectData = await getSelectData("country_name", "", "country");
    setOptionCountry(selectData?.getDataByColNameData);
  };

  useEffect(() => {
    countryState();
    dispatch({
      type: GET_COMPANYLEGALENTITY_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listCompanyLegalEntity) {
      setLoading(false)
    }
    if (addCompanyLegalEntity) {
      setToastMessage("Company Legal Entity Added Successfully");
      dispatch({
        type: GET_COMPANYLEGALENTITY_REQUEST,
      });
      setToast(true);
    }
    if (updateCompanyLegalEntity) {
      setToastMessage("Company Legal Entity Updated Successfully");
      dispatch({
        type: GET_COMPANYLEGALENTITY_REQUEST,
      });
      setToast(true);
    }
    if (deleteCompanyLegalEntity) {
      setToastMessage("Company Legal Entity Deleted Successfully");
      dispatch({
        type: GET_COMPANYLEGALENTITY_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Company Legal Entity Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_COMPANYLEGALENTITY_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    addCompanyLegalEntity,
    updateCompanyLegalEntity,
    updateCommon,
    deleteCompanyLegalEntity,
    toast,
  ]);

  const handleClicks = () => {
    setTaxID([]);
    setAddress([]);
    setSelectedCountry({});
    setSelectedState({});
    setFormData({
      company_code: "",
      company_name: "",
      registration_number: "",
      pan_number: "",
      tan: "",
      tin: "",
      tax_id_1: "",
      tax_id_2: "",
      tax_id_3: "",
      tax_id_4: "",
      tax_id_5: "",
      address_1: "",
      address_2: "",
      address_3: "",
      country_id: "",
      state_id: "",
      city: "",
      pincode: "",
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
        type: DELETE_COMPANYLEGALENTITY_REQUEST,
        payload: rowData.id,
      });
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleInputChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectData = await getSelectData(
          "country_name",
          inputValue,
          "country"
        );
        setOptionCountry(selectData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );
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

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "company_code") {
      if (value.length > 4) {
        newValue = value.slice(0, 4);
        setFormErrors({
          ...formErrors,
          company_code: "Company Code cannot be more than 4 characters",
        });
      } else {
        setFormErrors({
          ...formErrors,
          company_code: "",
        });
      }
    }
    if (name === "company_name") {
      if (value.length > 50) {
        newValue = value.slice(0, 50);
        setFormErrors({
          ...formErrors,
          company_name: "Company Name cannot be more than 50 characters",
        });
      } else {
        setFormErrors({
          ...formErrors,
          company_name: "",
        });
      }
    }
    if (name === "registration_number") {
      if (value.length > 70) {
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
    }
    if (name === "pan_number") {
      if (value.length > 50) {
        newValue = value.slice(0, 50);
        setFormErrors({
          ...formErrors,
          pan_number: "PAN Number cannot be more than 50 characters",
        });
      } else {
        setFormErrors({
          ...formErrors,
          pan_number: "",
        });
      }
    }
    if (name === "tan") {
      if (value.length > 4) {
        newValue = value.slice(0, 3);
        setFormErrors({
          ...formErrors,
          tan: "TAN cannot be more than 3 characters",
        });
      } else {
        setFormErrors({
          ...formErrors,
          tan: "",
        });
      }
    }
    if (name === "tin") {
      if (value.length > 3) {
        newValue = value.slice(0, 3);
        setFormErrors({
          ...formErrors,
          tin: "TIN cannot be more than 3 characters",
        });
      } else {
        setFormErrors({
          ...formErrors,
          tin: "",
        });
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.company_code) {
      errors.company_code = "Code is required";
    } else if (formData.company_code.length > 4) {
      errors.company_code = "State cannot be more than 4 characters";
    }

    if (!formData.company_name) {
      errors.company_name = "Company Name is required";
    } else if (formData.company_name.length > 50) {
      errors.company_name = "Company Name cannot be more than 50 characters";
    }

    if (!formData.registration_number) {
      errors.registration_number = "Registration Number is required";
    } else if (formData.registration_number.length > 70) {
      errors.registration_number =
        "Registration Number cannot be more than 70 characters";
    }

    if (!formData.pan_number) {
      errors.pan_number = "PAN Number is required";
    } else if (formData.pan_number.length > 50) {
      errors.pan_number = "PAN Number cannot be more than 50 characters";
    }

    if (!formData.tan) {
      errors.tan = "TAN is required";
    } else if (formData.tan.length > 3) {
      errors.tan = "TAN cannot be more than 3 characters";
    }

    if (!formData.tin) {
      errors.tin = "TIN is required";
    } else if (formData.tin.length > 3) {
      errors.tin = "TIN cannot be more than 3 characters";
    }

    if (!formData.tax_id_1) {
      errors.tax_id_1 = "Tax Id 1 is required";
    } else if (formData.tax_id_1.length > 50) {
      errors.tax_id_1 = "Tax Id 1 cannot be more than 50 characters";
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

    if (!formData.address_1) {
      errors.address_1 = "Address 1 is required";
    } else if (formData.address_1.length > 50) {
      errors.address_1 = "Address 1 cannot be more than 50 characters";
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

    if (Object.keys(selectCountry).length === 0) {
      errors.country = "Country Name is required";
    }

    if (Object.keys(selectState).length === 0) {
      errors.state_id = "State Name is required";
    }

    if (!formData.city) {
      errors.city = "City is required";
    } else if (formData.city.length > 50) {
      errors.city = "City cannot be more than 50 characters";
    }

    if (!formData.pincode) {
      errors.pincode = "PinCode is required";
    } else if (formData.pincode.length > 20) {
      errors.pincode = "PinCode cannot be more than 20 characters";
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
        const Data = {
          formData,
          isActive,
          Id,
        };
        dispatch({
          type: UPDATE_COMPANYLEGALENTITY_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_COMPANYLEGALENTITY_REQUEST,
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

  const openModal = (data = null) => {
    setEdit(data);
    setRowData(data);
    setSelectedCountry(data?.country);
    setSelectedState(data?.state);
    setFormData({
      company_code: data?.company_code,
      company_name: data?.company_name,
      registration_number: data.registration_number,
      pan_number: data.pan_number,
      tan: data.tan,
      tin: data.tin,
      tax_id_1: data.tax_id_1,
      tax_id_2: data.tax_id_2,
      tax_id_3: data.tax_id_3,
      tax_id_4: data.tax_id_4,
      tax_id_5: data.tax_id_5,
      address_1: data?.address_1,
      address_2: data?.address_2,
      address_3: data?.address_3,
      country_id: data?.country?.value,
      state_id: data?.state?.value,
      city: data?.city,
      pincode: data?.pincode,
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
        Header: "Code",
        accessor: "company_code",
      },
      {
        Header: "Name",
        accessor: "company_name",
      },
      {
        Header: "Registration Number",
        accessor: "registration_number",
      },
      {
        Header: "Pan Number",
        accessor: "pan_number",
      },
      {
        Header: "TAN",
        accessor: "tan",
      },
      {
        Header: "TIN",
        accessor: "tin",
      },
      {
        Header: "Country",
        accessor: "country.label",
      },
      {
        Header: "State",
        accessor: "state.label",
      },
      {
        Header: "City",
        accessor: "city",
      },
      {
        Header: "PinCode",
        accessor: "pincode",
      },
      {
        Header: "Tax Id 1",
        accessor: "tax_id_1",
      },
      {
        Header: "Address 1",
        accessor: "address_1",
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
                        name: "company_legal_entity",
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
          return (
            <div className="d-flex gap-3">
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
            </div>
          );
        },
      },
    ],
    [status]
  );

  document.title = "Detergent | Company Legal Entity";
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
            breadcrumbItem="Company Legal Entity"
          />
           {loading ? (
            <Loader />
          ) : ( 
          <TableContainer
            columns={columns}
            data={
              companyLegalEntity && companyLegalEntity.length > 0
                ? companyLegalEntity
                : []
            }
            isGlobalFilter={true}
            isAddOptions={true}
            customPageSize={10}
            className="custom-header-css"
            addButtonLabel={"Add Company Legal Entity"}
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
                <Col md={4} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Code</Label>
                    <Input
                      type="text"
                      name="company_code"
                      className={`form-control ${formErrors.company_code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter here"
                      value={formData?.company_code}
                      onChange={handleChange}
                    />
                    {formErrors.company_code && (
                      <div className="invalid-feedback">
                        {formErrors.company_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="company_name"
                    className={`form-control ${formErrors.company_name ? "is-invalid" : ""
                      }`}
                    value={formData.company_name}
                    rows="2"
                    placeholder="Please Enter Company Legal Entity Name"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        company_name: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        company_name: "",
                      }));
                    }}
                  />
                  {formErrors.company_name && (
                    <div className="invalid-feedback">
                      {formErrors.company_name}
                    </div>
                  )}
                </Col>
                <Col md={4} className="mb-3">
                  <Label htmlFor="name">Registration Number</Label>
                  <Input
                    type="text"
                    id="name"
                    name="registration_number"
                    className={`form-control ${formErrors.registration_number ? "is-invalid" : ""
                      }`}
                    value={formData.registration_number}
                    rows="3"
                    placeholder="Enter here"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        registration_number: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        registration_number: "",
                      }));
                    }}
                  />
                  {formErrors.registration_number && (
                    <div className="invalid-feedback">
                      {formErrors.registration_number}
                    </div>
                  )}
                </Col>
                <Col md={4} className="mb-3">
                  <Label htmlFor="name">Pan Number</Label>
                  <Input
                    type="text"
                    id="name"
                    name="pan_number"
                    className={`form-control ${formErrors.pan_number ? "is-invalid" : ""
                      }`}
                    value={formData.pan_number}
                    rows="3"
                    placeholder="Enter here"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        pan_number: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        pan_number: "",
                      }));
                    }}
                  />
                  {formErrors.pan_number && (
                    <div className="invalid-feedback">
                      {formErrors.pan_number}
                    </div>
                  )}
                </Col>
                <Col md={4} className="mb-3">
                  <Label htmlFor="name">TAN</Label>
                  <Input
                    type="text"
                    id="name"
                    name="tan"
                    className={`form-control ${formErrors.tan ? "is-invalid" : ""
                      }`}
                    value={formData.tan}
                    rows="3"
                    placeholder="Enter here"
                    onChange={handleChange}
                  />
                  {formErrors.tan && (
                    <div className="invalid-feedback">{formErrors.tan}</div>
                  )}
                </Col>
                <Col md={4} className="mb-3">
                  <Label htmlFor="name">TIN</Label>
                  <Input
                    type="text"
                    id="name"
                    name="tin"
                    className={`form-control ${formErrors.tin ? "is-invalid" : ""
                      }`}
                    value={formData.tin}
                    rows="3"
                    placeholder="Enter here"
                    onChange={handleChange}
                  />
                  {formErrors.tin && (
                    <div className="invalid-feedback">{formErrors.tin}</div>
                  )}
                </Col>

                <Col md={12} className="mb-3">
                  <Label>Tax Id </Label>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr id="addrMain" key="">
                        <td>
                          <Row className="inner mb-3 ">
                            <Col md="9" className="col-4">
                              <Input
                                type="text"
                                value={formData.tax_id_1}
                                onChange={e => {
                                  setFormData(prevData => ({
                                    ...prevData,
                                    tax_id_1: e.target.value,
                                  }));
                                  setFormErrors(prevErrors => ({
                                    ...prevErrors,
                                    tax_id_1: "",
                                  }));
                                }}
                                className="inner form-control"
                                placeholder="Tax Id 1"
                              />
                              {formErrors.tax_id_1 && (
                                <div
                                  style={{ color: "#f46a6a", fontSize: "80%" }}
                                >
                                  {formErrors.tax_id_1}
                                </div>
                              )}
                            </Col>
                            <Col md="3" className="col-2">
                              <Button
                                onClick={handleAddRowNestedTax}
                                color="primary"
                              >
                                Add
                              </Button>
                            </Col>
                          </Row>
                        </td>
                      </tr>
                      {taxId?.map((item1, idx) => (
                        <tr id={"nested" + idx} key={idx}>
                          <td>
                            <Row className="inner mb-3">
                              <Col md="9" className="col-8">
                                <div className="form-floating mb-3">
                                  <Input
                                    type="text"
                                    className={`inner form-control ${formErrors[`tax_id_${idx + 2}`]
                                        ? "is-invalid"
                                        : ""
                                      }`}
                                    placeholder={`Tax Id ${idx + 2}`}
                                    value={
                                      formData?.[`tax_id_${idx + 2}`] || ""
                                    }
                                    onChange={e => {
                                      setFormData(prevData => ({
                                        ...prevData,
                                        [`tax_id_${idx + 2}`]: e.target.value,
                                      }));
                                    }}
                                  />
                                  <label
                                    htmlFor={`tax_id_${idx + 2}`}
                                  >{`Tax Id ${idx + 2}`}</label>
                                  {formErrors[`tax_id_${idx + 2}`] && (
                                    <div className="invalid-feedback">
                                      {formErrors[`tax_id_${idx + 2}`]}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col md="3" className="col-4">
                                <Button
                                  onClick={() => handleRemoveRowNestedTax(idx)}
                                  color="danger"
                                  className="btn-block inner"
                                  style={{ width: "100%" }}
                                >
                                  Delete
                                </Button>
                              </Col>
                            </Row>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Col>
                <Col md={12} className="mb-3">
                  <Label>Address </Label>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr id="addrMain" key="">
                        <td>
                          <Row className="inner mb-3 ">
                            <Col md="9" className="col-4">
                              <Input
                                type="text"
                                value={formData.address_1}
                                onChange={e => {
                                  setFormData(prevData => ({
                                    ...prevData,
                                    address_1: e.target.value,
                                  }));
                                  setFormErrors(prevErrors => ({
                                    ...prevErrors,
                                    address_1: "",
                                  }));
                                }}
                                className="inner form-control"
                                placeholder="Address 1"
                              />
                              {formErrors.address_1 && (
                                <div
                                  style={{ color: "#f46a6a", fontSize: "80%" }}
                                >
                                  {formErrors.address_1}
                                </div>
                              )}
                            </Col>
                            <Col md="3" className="col-2">
                              <Button
                                onClick={handleAddRowNestedAddress}
                                color="primary"
                              >
                                Add
                              </Button>
                            </Col>
                          </Row>
                        </td>
                      </tr>
                      {address?.map((item1, idx) => (
                        <tr id={"nested" + idx} key={idx}>
                          <td>
                            <Row className="inner mb-3">
                              <Col md="9" className="col-8">
                                <div className="form-floating mb-3">
                                  <Input
                                    type="text"
                                    className={`inner form-control ${formErrors[`address_${idx + 2}`] ? "is-invalid" : ""
                                      }`}
                                    placeholder={`Address ${idx + 2}`}
                                    value={formData?.[`address_${idx + 2}`] || ""}
                                    onChange={(e) => {
                                      setFormData((prevData) => ({
                                        ...prevData,
                                        [`address_${idx + 2}`]: e.target.value,
                                      }));
                                    }}
                                  />
                                  <label htmlFor={`address_${idx + 2}`}>{`Address ${idx + 2}`}</label>
                                  {formErrors[`address_${idx + 2}`] && (
                                    <div className="invalid-feedback">
                                      {formErrors[`address_${idx + 2}`]}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col md="3" className="col-4">
                                <Button
                                  onClick={() => handleRemoveRowNestedAddress(idx)}
                                  color="danger"
                                  className="btn-block inner"
                                  style={{ width: "100%" }}
                                >
                                  Delete
                                </Button>
                              </Col>
                            </Row>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Country Name</Label>
                    <Select
                      value={selectCountry}
                      onChange={async selectCountry => {
                        setOptionState([]);
                        setSelectedState({});
                        setSelectedCountry(selectCountry);
                        setFormData(prevData => ({
                          ...prevData,
                          country_id: selectCountry?.value,
                        }));
                        const selectStateData = await getRelatedRecords(
                          "states",
                          "state_name_alias",
                          "country_id",
                          selectCountry?.value
                        );
                        setOptionState(selectStateData?.getRelatedRecordsData);
                      }}
                      onInputChange={(inputValue, { action }) => {
                        handleInputChange(inputValue);
                      }}
                      options={optionCountry}
                    />
                    {formErrors.country && (
                      <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                        {formErrors.country}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">State Name</Label>
                    <Select
                      value={selectState}
                      onChange={async selectState => {
                        setSelectedState(selectState);
                        const selectedOption = optionState.find(
                          option => option.value == selectState.value
                        );
                        setFormData(prevData => ({
                          ...prevData,
                          state_id: selectedOption?.value,
                          city: "",
                        }));
                        const selectCityData = await getRelatedRecords(
                          "cities",
                          "city_name",
                          "state_id",
                          selectedOption?.value
                        );
                      }}
                      options={optionState}
                    />

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
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">City</Label>
                    <Input
                      type="text"
                      name="city"
                      className={`form-control ${formErrors.city ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter City"
                      value={formData?.city}
                      onChange={handleChange}
                    />
                    {formErrors.city && (
                      <div className="invalid-feedback">{formErrors.city}</div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">PinCode</Label>
                    <Input
                      type="text"
                      name="pincode"
                      className={`form-control ${formErrors.pincode ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter PinCode"
                      value={formData?.pincode}
                      onChange={handleChange}
                    />
                    {formErrors.pincode && (
                      <div className="invalid-feedback">
                        {formErrors.pincode}
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
                  className="btn btn-custom-theme "
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

export default CompanyLegalEntity;
