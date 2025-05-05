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
  ADD_WAREHOUSES_REQUEST,
  GET_WAREHOUSES_REQUEST,
  UPDATE_WAREHOUSES_REQUEST,
  DELETE_WAREHOUSES_REQUEST,
} from "../../../store/warehouses/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import { getSelectData, getRelatedRecords } from "helpers/Api/api_common";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
const Warehouses = () => {
  const [modal, setModal] = useState(false);
  const [selectCountry, setSelectedCountry] = useState({});
  const [selectCompany, setSelectedCompany] = useState({});
  const [optionCountry, setOptionCountry] = useState([]);
  const [optionCompany, setOptionCompany] = useState([]);
  const [selectState, setSelectedState] = useState({});
  const [selectCity, setSelectedCity] = useState({});
  const [optionState, setOptionState] = useState([]);
  const [optionCity, setOptionCity] = useState([]);
  const [taxId, setTaxID] = useState([]);
  const [address, setAddress] = useState([]);
  const dispatch = useDispatch();
  const {
    warehouses,
    addWarehouses,
    listWarehouses,
    updateWarehouses,
    deleteWarehouses,
  } = useSelector(state => state.warehouses);
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    plant_code: "",
    registration_number: "",
    pan_number: "",
    tan: "",
    tin: "",
    gstin: "",
    tax_id_1: "",
    tax_id_2: "",
    tax_id_3: "",
    tax_id_4: "",
    address_1: "",
    address_2: "",
    address_3: "",
    country_id: "",
    state_id: "",
    city: "",
    pincode: "",
    isactive: isActive,
  });

  const listState = async () => {
    const selectData = await getSelectData("country_name", "", "country");
    setOptionCountry(selectData?.getDataByColNameData);

    const selectCompanyData = await getSelectData("company_name", "", "company_legal_entity");
    setOptionCompany(selectCompanyData?.getDataByColNameData);
  };

  useEffect(() => {
    listState();
    dispatch({
      type: GET_WAREHOUSES_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if(listWarehouses){
      setLoading(false)
    }
    if (addWarehouses) {
      setToastMessage("Warehouse Added Successfully");
      dispatch({
        type: GET_WAREHOUSES_REQUEST,
      });
      setToast(true);
    }
    if (updateWarehouses) {
      setToastMessage("Warehouse Updated Successfully");
      dispatch({
        type: GET_WAREHOUSES_REQUEST,
      });
      setToast(true);
    }
    if (deleteWarehouses) {
      setToastMessage("Warehouse Deleted Successfully");
      dispatch({
        type: GET_WAREHOUSES_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Warehouse Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_WAREHOUSES_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    addWarehouses,
    updateWarehouses,
    updateCommon,
    deleteWarehouses,
    toast,
  ]);

  const handleClicks = () => {
    setTaxID([]);
    setAddress([]);
    setSelectedCountry({})
    setSelectedCompany({})
    setSelectedState({});
    setSelectedCity({});

    setFormData({
      plant_code: "",
      registration_number: "",
      pan_number: "",
      tan: "",
      tin: "",
      gstin: "",
      tax_id_1: "",
      tax_id_2: "",
      tax_id_3: "",
      tax_id_4: "",
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
        type: DELETE_WAREHOUSES_REQUEST,
        payload: rowData.id,
      });
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === 'plant_code' && value.length > 4) {
      newValue = value.slice(0, 4); 
      setFormErrors({
        ...formErrors,
        plant_code: "Code cannot be more than 4 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        plant_code: ""
      });
    }

    if (name === 'registration_number' && value.length > 70) {
      newValue = value.slice(0, 70);
      setFormErrors({
        ...formErrors,
        registration_number: "Registration Number cannot be more than 70 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        registration_number: ""
      });
    }

    if (name === 'pan_number' && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        pan_number: "Pan Number cannot be more than 50 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        pan_number: ""
      });
    }

    if (name === 'tan' && value.length > 3) {
      newValue = value.slice(0, 3); 
      setFormErrors({
        ...formErrors,
        tan: "TAN cannot be more than 3 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        tan: ""
      });
    }
    
    if (name === 'tin' && value.length > 3) {
      newValue = value.slice(0, 3); 
      setFormErrors({
        ...formErrors,
        tin: "TIN cannot be more than 3 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        tin: ""
      });
    }

    if (name === 'gstin' && value.length > 50) {
      newValue = value.slice(0, 50); 
      setFormErrors({
        ...formErrors,
        gstin: "GSTIN cannot be more than 50 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        gstin: ""
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

    setFormData({
      ...formData,
      [name]: value,
    });
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

  const handleInputChangeCompany = useCallback(
    debounce(async inputValue => {
      try {
        const selectData = await getSelectData(
          "company_name",
          inputValue,
          "company_legal_entity"
        );
        setOptionCompany(selectData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const handleAddRowNestedTax = () => {
    if (taxId.length < 3) {
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

  const validateForm = () => {
    const errors = {};
    
    if (!formData.plant_code.trim()) {
      errors.plant_code = "Code is required";}
    else if (formData.plant_code.length > 4) {
      errors.plant_code = "Code cannot be more than 4 characters"
    }
    
      if (Object.keys(selectCompany).length === 0) {
      errors.company = "Company Name is required";
    }

    if (!formData.registration_number.trim()) {
      errors.registration_number = "Registration Number is required";
    } else if (formData.registration_number.trim().length > 70) {
      errors.registration_number = "Registration Number cannot be more than 70 characters"
    }

    if (!formData.pan_number.trim()) {
      errors.pan_number = "Pan Number is required";
    } else if (formData.pan_number.trim().length > 50) {
      errors.pan_number = "Pan Number cannot be more than 50 characters"
    }

    if (!formData.tan.trim()) {
      errors.tan = "TAN is required";
    }else if (formData.tan.length > 3) {
      errors.tan = "TAN cannot be more than 3 characters"
    }
    
      if (!formData.tin.trim()) {
      errors.tin = "TIN is required";
    } else if (formData.tin.length > 3) {
      errors.tin = "TIN cannot be more than 3 characters"
    }
    
      if (!formData.gstin.trim()) {
      errors.gstin = "GSTIN is required";
    } else if (formData.gstin.trim().length > 50) {
      errors.gstin = "GSTIN cannot be more than 50 characters"
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

    if (!formData.city.trim()) {
      errors.city = "City is required";
    } else if (formData.city.trim().length > 50) {
      errors.city = "City cannot be more than 50 characters"
    }

    if (!formData.pincode.trim()) {
      errors.pincode = "PinCode is required";
    } else if (formData.pincode.trim().length > 20) {
      errors.pincode = "PinCode cannot be more than 20 characters"
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
          type: UPDATE_WAREHOUSES_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_WAREHOUSES_REQUEST,
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
    setSelectedCountry(data?.country)
    setSelectedCompany(data?.company)
    setSelectedState(data?.state);
    setSelectedCity(data?.city);
    setFormData({
      plant_code: data?.plant_code,
      registration_number: data.registration_number,
      pan_number: data.pan_number,
      tan: data.tan,
      tin: data.tin,
      gstin: data.gstin,
      tax_id_1: data.tax_id_1,
      tax_id_2: data.tax_id_2,
      tax_id_3: data.tax_id_3,
      tax_id_4: data.tax_id_4,
      address_1: data?.address_1,
      address_2: data?.address_2,
      address_3: data?.address_3,
      country_id: data?.country?.value,
      state_id: data?.state?.value,
      company_id: data?.company?.value,
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
        accessor: "plant_code",
      },
      {
        Header: "Company Name",
        accessor: "company.label",
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
        Header: "GSTIN",
        accessor: "gstin",
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
      // {
      //   Header: "Created On",
      //   accessor: "createdon",
      //   Cell: ({ value }) => {
      //     const formattedDate = moment(value).format("DD/MM/YYYY");
      //     return <div>{formattedDate}</div>;
      //   },
      // },
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
                        name: "warehouse_master",
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

  document.title = "Detergent | Warehouses";
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
          <Breadcrumbs titlePath="#" title="Products" breadcrumbItem="Warehouse" />
          {loading ? (
            <Loader />
          ) : (
          <TableContainer
            columns={columns}
            data={warehouses && warehouses.length > 0 ? warehouses : []}
            isGlobalFilter={true}
            isAddOptions={true}
            customPageSize={10}
            className="custom-header-css"
            addButtonLabel={"Add Warehouse"}
            handleClicks={handleClicks}
          />
          )}
        </div>
        <Modal isOpen={modal} centered size="lg">
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
                <Col md={3} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Warehouses Code</Label>
                    <Input
                      type="text"
                      name="plant_code"
                      className={`form-control ${formErrors.plant_code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter Here"
                      value={formData?.plant_code}
                      onChange={handleChange}
                    />
                    {formErrors.plant_code && (
                      <div className="invalid-feedback">
                        {formErrors.plant_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <Label htmlFor="name">Company Name</Label>
                  <Select
                    value={selectCompany}
                    onChange={async selectCompany => {
                      setSelectedCompany(selectCompany)
                      setFormData(prevData => ({
                        ...prevData,
                        company_id: selectCompany?.value,
                      }));
                    }}
                    onInputChange={(inputValue, { action }) => {
                      handleInputChangeCompany(inputValue);
                    }}
                    options={optionCompany}
                  />
                  {formErrors.company && (
                    <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                      {formErrors.company}
                    </div>
                  )}
                </Col>
                <Col md={3} className="mb-3">
                  <Label htmlFor="name">Registration Number</Label>
                  <Input
                    type="text"
                    id="name"
                    name="registration_number"
                    className={`form-control ${formErrors.registration_number ? "is-invalid" : ""
                      }`}
                    value={formData.registration_number}
                    rows="3"
                    placeholder="Enter Here"
                    onChange={handleChange}
                  />
                  {formErrors.registration_number && (
                    <div className="invalid-feedback">
                      {formErrors.registration_number}
                    </div>
                  )}
                </Col>
                <Col md={3} className="mb-3">
                  <Label htmlFor="name">Pan Number</Label>
                  <Input
                    type="text"
                    id="name"
                    name="pan_number"
                    className={`form-control ${formErrors.pan_number ? "is-invalid" : ""
                      }`}
                    value={formData.pan_number}
                    rows="3"
                    placeholder="Enter Here"
                    onChange={handleChange}
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
                    placeholder="Enter Here"
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
                    placeholder="Enter Here"
                    onChange={handleChange}
                  />
                  {formErrors.tin && (
                    <div className="invalid-feedback">{formErrors.tin}</div>
                  )}
                </Col>
                <Col md={4} className="mb-3">
                  <Label htmlFor="name">GSTIN</Label>
                  <Input
                    type="text"
                    id="name"
                    name="gstin"
                    className={`form-control ${formErrors.gstin ? "is-invalid" : ""
                      }`}
                    value={formData.gstin}
                    rows="3"
                    placeholder="Enter Here"
                    onChange={handleChange}
                  />
                  {formErrors.gstin && (
                    <div className="invalid-feedback">{formErrors.gstin}</div>
                  )}
                </Col>
                <Col md={6} className="mb-3">
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
                                placeholder="Enter Here"
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
                                    className={`inner form-control ${
                                      formErrors[`tax_id_${idx + 2}`]
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    placeholder={`Enter Here`}
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
                <Col md={6} className="mb-3">
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
                                placeholder="Enter Here"
                              />
                              {formErrors.address_1 && (
                                <div style={{ color: "#f46a6a", fontSize: "80%" }}>
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
                                    className={`inner form-control ${
                                      formErrors[`address_${idx + 2}`] ? "is-invalid" : ""
                                    }`}
                                    placeholder={`Enter Here`}
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
                <Col md={3} className="mb-3">
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
                <Col md={3} className="mb-3">
                  <div className="mb-3">
                  <Label htmlFor="formrow-state-Input">State Name</Label>
                  <Select
                      value={selectState}
                      onChange={async selectState => {
                        setSelectedState(selectState);
                        const selectedOption =
                          optionState.find(
                            option =>
                              option.value ==
                            selectState.value
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
                        setOptionCity(selectCityData?.getRelatedRecordsData);
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
                <Col md={3} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">City</Label>
                    <Input
                      type="text"
                      name="city"
                      className={`form-control ${formErrors.city ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter Here"
                      value={formData?.city}
                      onChange={handleChange}
                    />
                    {formErrors.city && (
                      <div className="invalid-feedback">
                        {formErrors.city}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">PinCode</Label>
                    <Input
                      type="text"
                      name="pincode"
                      className={`form-control ${formErrors.pincode ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter Here"
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
                  className="btn-custom-theme"
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

export default Warehouses;
