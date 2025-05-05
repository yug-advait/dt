import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  Form,
  Label,
  Input,
  UncontrolledTooltip,
  Alert,
} from "reactstrap";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import { Link } from "react-router-dom";
import moment from "moment";
import DeleteModal from "components/Common/DeleteModal";
import { useSelector, useDispatch } from "react-redux";
import {
  ADD_COUNTRIES_REQUEST,
  GET_COUNTRIES_REQUEST,
  UPDATE_COUNTRIES_REQUEST,
  DELETE_COUNTRIES_REQUEST,
} from "../../../store/country/actionTypes";
import { STATUS_REQUEST ,UPDATE_STATUS_RESET} from "../../../store/common/actionTypes";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const CountryMaster = () => {
  const dispatch = useDispatch();
  const {
    countries,
    addCountries,
    updateCountries,
    listCountries,
    deleteCountries,
  } = useSelector(state => state.countries);
  const {
    updateCommon
  } = useSelector(state => state.commons)
  const [modal, setModal] = useState(false);
  const [countryRow, setCountryRow] = useState("")
  const [deleteModal, setDeleteModal] = useState(false);
  const [toast, setToast] = useState(false);
  const [isActive, setIsActive] = useState(true)
  const [formErrors, setFormErrors] = useState({})
  const [status, setStatus] = useState('')
  const [toastMessage, setToastMessage] = useState();
  const [countryEdit, setCountryEdit] =
    useState(null);
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({});
  const [countryPermission, setCountryPermission] = useState();
  const [formData, setFormData] = useState({
    country_name: "",
    country_short_code: "",
    country_description: "",
    country_currency: "",
    country_iso_3_digit_code: "",
    national_language: "",
    business_language: "",
    isactive: isActive,
    createdby: 1,
    updatedby: 1
  })

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
        permission.sub_menu_name === "countries"
    );
    setCountryPermission(
      permissions.find(permission => permission.sub_menu_name === "countries")
    );
    dispatch({
      type: GET_COUNTRIES_REQUEST,
      payload: [],
    });
  }, []);
  useEffect(() => {
    if (listCountries) {
      setLoading(false)
    }
    if (addCountries) {
      setToastMessage("Country Added Successfully");
      dispatch({
        type: GET_COUNTRIES_REQUEST,
      });
      setToast(true);
    }
    if (updateCountries) {
      setToastMessage("Country Updated Successfully");
      dispatch({
        type: GET_COUNTRIES_REQUEST,
      });
      setToast(true);
    }
    if (deleteCountries) {
      setToastMessage("Country Deleted Successfully");
      dispatch({
        type: GET_COUNTRIES_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
             setToastMessage("Country Status Updated Successfully.");
             dispatch({
               type: UPDATE_STATUS_RESET,
             });
             dispatch({
               type: GET_COUNTRIES_REQUEST,
             });
             setToast(true);
             setTimeout(() => setToast(false), 3000);
   
           }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addCountries, updateCountries, updateCommon, listCountries, deleteCountries, toast]);

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'country_name' && value.length > 50) {
      setFormErrors({
        ...formErrors,
        country_name: "Name cannot be more than 50 characters"
      });
    }else {
      setFormErrors({
        ...formErrors,
        country_name: ""
      });
    }
    if (name === 'country_description' && value.length > 50) {
      setFormErrors({
        ...formErrors,
        country_description: "Description cannot be more than 50 characters"
      });
    }else {
      setFormErrors({
        ...formErrors,
        country_description: ""
      });
    }
    if (name === 'country_short_code' && value.length > 5) {
      newValue = value.slice(0, 5);
      setFormErrors({
        ...formErrors,
        country_short_code: "Country Short Code cannot be more than 5 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        country_short_code: ""
      });
    }
    if (name === 'country_currency') {
      if (value.length > 5) {
        newValue = value.slice(0, 5);
        setFormErrors({
          ...formErrors,
          country_currency: "Currency cannot be more than 5 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          country_currency: ""
        });
      }
    }
    if (name === 'country_iso_3_digit_code') {
      if (value.length > 3) {
        newValue = value.slice(0, 3);
        setFormErrors({
          ...formErrors,
          country_iso_3_digit_code: "ISO Code cannot be more than 3 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          country_iso_3_digit_code: ""
        });
      }
    }
    if (name === 'national_language') {
      if (value.length > 10) {
        newValue = value.slice(0, 10);
        setFormErrors({
          ...formErrors,
          national_language: "National Language cannot be more than 10 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          national_language: ""
        });
      }
    }
    if (name === 'business_language') {
      if (value.length > 10) {
        newValue = value.slice(0, 10);
        setFormErrors({
          ...formErrors,
          business_language: "Business Language cannot be more than 10 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          business_language: ""
        });
      }
    }

    setFormData({
      ...formData,
      [name]: newValue,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {}
    if (!formData.country_name.trim()) {
      errors.country_name = "Name is required"
    }
    else if (formData.country_name.length > 50) {
      errors.country_name = "Name cannot be more than 50 characters"
    }
    if (!formData.country_short_code.trim()) {
      errors.country_short_code = "Country Short Code is required"
    } else if (formData.country_short_code.trim().length > 5) {
      errors.country_short_code = "Country Short Code cannot be more than 5 characters"
    }
    if (!formData.country_description.trim()) {
      errors.country_description = "country description is required"
    }
    else if (formData.country_description.trim().length > 50) {
      errors.country_description = "Country Description cannot be more than 50 characters"
    }
    if (!formData.country_currency) {
      errors.country_currency = "country currency is required"
    } else if (formData.country_currency.trim().length > 5) {
      errors.country_currency = "Currency cannot be more than 5 characters"
    }
    if (!formData.country_iso_3_digit_code) {
      errors.country_iso_3_digit_code = "country iso 3 digit code is required"
    } else if (formData.country_iso_3_digit_code.trim().length > 3) {
      errors.country_iso_3_digit_code = "ISO Code cannot be more than 3 characters"
    }
    if (!formData.national_language) {
      errors.national_language = "national language is required"
    } else if (formData.national_language.trim().length > 10) {
      errors.national_language = "National Language cannot be more than 10 characters"
    }
    if (!formData.business_language.trim()) {
      errors.business_language = "bussiness language is required"
    } else if (formData.business_language.trim().length > 10) {
      errors.business_language = "Business Language cannot be more than 10 characters"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
  const handleSaveOrEdit = async e => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    try {
      if (countryEdit) {
        const Id = countryEdit.id
        const CountryData = {
          formData,
          isActive,
          Id
        };
        dispatch({
          type: UPDATE_COUNTRIES_REQUEST,
          payload: CountryData,
        });
      } else {
        const CountryData = {
          formData,
          isActive
        };
        dispatch({
          type: ADD_COUNTRIES_REQUEST,
          payload: CountryData,
        });
      }
      setModal(false)
      setCountryEdit(null)
      resetForm()
    } catch (error) {
      console.error("Error saving/editing data:", error)
    }
  }

  const handleDelete = async () => {
    try {
      dispatch({
        type: DELETE_COUNTRIES_REQUEST,
        payload: countryRow.id,
      })
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const handleClicks = () => {
    setFormData({
      country_name: '',
      country_short_code: '',
      country_description: '',
      country_currency: '',
      country_iso_3_digit_code: '',
      national_language: '',
      business_language: '',
      isactive: true
    })
    setModal(true)
  };

  const onClickDelete = item => {
    setCountryRow(item);
    setDeleteModal(true);
  };
  const openModal = (data = null) => {
    setCountryEdit(data)
    setCountryRow(data)
    setFormData({
      country_name: data?.country_name,
      country_short_code: data?.country_short_code,
      country_description: data?.country_description,
      country_currency: data?.country_currency,
      country_iso_3_digit_code: data?.country_iso_3_digit_code,
      national_language: data?.national_language,
      business_language: data?.business_language,
      isactive: data?.isactive
    })
    setModal(true)
    if (data) {
      setIsActive(data.isactive)
    }
  }


  const resetForm = () => {
    setFormErrors({})
    setErrors({});
    setCountryEdit(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "country_name",
      },
      {
        Header: "Country Code",
        accessor: "country_short_code",
      },
      {
        Header: "Description",
        accessor: "country_description",
      },
      {
        Header: "Currency",
        accessor: "country_currency",
      },
      {
        Header: "Business language",
        accessor: "business_language",
      },
      {
        Header: "National language",
        accessor: "national_language",
      },
      {
        Header: "Created On",
        accessor: "createdon",
        Cell: ({ value }) => {
          const formattedDate = moment(value).format('DD/MM/YYYY');
          return <div>{formattedDate}</div>
        }
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
                      payload: { name: 'country', isactive: !cellProps.row.original.isactive, id: cellProps.row.original?.id }
                    })
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
              {countryPermission && countryPermission?.can_edit ? (
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

              {countryPermission && countryPermission?.can_delete ? (
                <Link
                  to="#"
                  className="text-danger"
                  onClick={() => {
                    const DATA = cellProps.row.original
                    onClickDelete(DATA)
                  }}
                >
                  <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                  <UncontrolledTooltip placement="top" target="deletetooltip">
                    Delete
                  </UncontrolledTooltip>
                </Link>
              ) : null}
            </div>
          )
        },
      },
    ],
    [status, countryPermission]
  )


  document.title = " Detergent | Country";
  return (
    <React.Fragment>
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
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            titlePath="#"
            title="Master"
            breadcrumbItem='Country'
            showBackButton={false}
          />
          <Row></Row>
          {loading ? (
            <Loader />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={
                        countries && countries.length > 0 ? countries : []
                      }
                      isGlobalFilter={true}
                      isAddOptions={true}
                      customPageSize={10}
                      className="custom-header-css"
                      addButtonLabel={
                        countryPermission && countryPermission?.can_add
                          ? "Add Country"
                          : null
                      }
                      handleClicks={handleClicks}
                      filterStateWise={true}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </div>
        <Modal isOpen={modal} centered>
          <div className="modal-header">
            {countryEdit ? "Edit" : "Add"}
            <button
              type="button"
              onClick={() => {
                resetForm()
                setModal(false)
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
                    <Label htmlFor="formrow-state-Input">Country Name</Label>
                    <Input
                      type="text"
                      name="country_name"
                      className={`form-control ${formErrors.country_name ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter here"
                      value={formData?.country_name}
                      onChange={handleChange}
                    />
                    {formErrors.country_name && (
                      <div className="invalid-feedback">
                        {formErrors.country_name}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Code</Label>
                    <Input
                      type="text"
                      name="country_short_code"
                      className={`form-control ${formErrors.country_short_code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter here"
                      value={formData?.country_short_code}
                      onChange={handleChange}
                    />
                    {formErrors.country_short_code && (
                      <div className="invalid-feedback">
                        {formErrors.country_short_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="countryCurrency">Currency</Label>
                    <Input
                      className={`form-control ${formErrors.country_currency ? "is-invalid" : ""}`}
                      type="text"
                      id="countryCurrency"
                      name="country_currency"
                      placeholder="Enter here"
                      value={formData.country_currency}
                      onChange={handleChange}
                    />
                    {formErrors.country_currency && (
                      <div className="invalid-feedback">
                        {formErrors.country_currency}
                      </div>
                    )}
                  </div>
                </Col>

                <Col md={4} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="countryIsoCode">Country ISO Code</Label>
                    <Input
                      className={`form-control ${formErrors.country_iso_3_digit_code ? "is-invalid" : ""
                        }`}
                      type="text"
                      id="countryIsoCode"
                      name="country_iso_3_digit_code"
                      placeholder="Enter here"
                      value={formData.country_iso_3_digit_code}
                      onChange={handleChange}
                    />
                    {formErrors.country_iso_3_digit_code && (
                      <div className="invalid-feedback">
                        {formErrors.country_iso_3_digit_code}
                      </div>
                    )}
                  </div>
                </Col>

                <Col md={4} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="nationalLanguage">National Language</Label>
                    <input
                      className={`form-control ${formErrors.national_language ? "is-invalid" : ""
                        }`}
                      type="text"
                      id="nationalLanguage"
                      name="national_language"
                      placeholder="Enter here"
                      value={formData.national_language}
                      onChange={handleChange}
                    />
                    {formErrors.national_language && (
                      <div className="invalid-feedback">
                        {formErrors.national_language}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="businessLanguage">Business Language</Label>
                    <Input
                      className={`form-control ${formErrors.business_language ? "is-invalid" : ""
                        }`}
                      type="text"
                      id="businessLanguage"
                      name="business_language"
                      placeholder="Enter here"
                      value={formData.business_language}
                      onChange={handleChange}
                    />
                    {formErrors.business_language && (
                      <div className="invalid-feedback">
                        {formErrors.business_language}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={7} className="mb-3">
                  <Label htmlFor="countryDescription">
                    Description
                  </Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="country_description"
                    className={`form-control ${formErrors.country_description ? "is-invalid" : ""
                      }`}
                    value={formData.country_description}
                    rows="2"
                    placeholder="Enter Country Description"
                    onChange={handleChange}
                  />
                  {formErrors.country_description && (
                    <div className="invalid-feedback">
                      {formErrors.country_description}
                    </div>
                  )}
                </Col>
                <Col md={6} className="">
                  <div className="form-check form-switch mb-3" dir="ltr">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="customSwitchsizesm"
                      checked={isActive}
                      onClick={() => {
                        setIsActive(!isActive)
                        setFormData(prevData => ({
                          ...prevData,
                          isactive: !isActive,
                        }))
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

export default CountryMaster;
