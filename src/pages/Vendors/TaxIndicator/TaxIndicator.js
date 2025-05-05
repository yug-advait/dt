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
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import { getSelectData } from "helpers/Api/api_common";
import DeleteModal from "components/Common/DeleteModal";
import Select from "react-select";
import debounce from "lodash/debounce";
import {
  ADD_TAXINDICATOR_REQUEST,
  GET_TAXINDICATOR_REQUEST,
  UPDATE_TAXINDICATOR_REQUEST,
  DELETE_TAXINDICATOR_REQUEST,
} from "../../../store/taxIndicator/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const TaxIndicator = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const {
    listTaxIndicator,
    taxIndicator,
    addTaxIndicator,
    updateTaxIndicator,
    deleteTaxIndicator,
    error,
  } = useSelector(state => state.TaxIndicator);

  const [optionCountry, setOptionCountry] = useState([]);
  const [selectCountry, setSelectedCountry] = useState({});
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
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
  const [taxIndicatorPermission, setTaxIndicatorPermission] = useState();
  const [formData, setFormData] = useState({
    country_id: "",
    tax_code: "",
    tax_description: "",
    isactive: isActive,
  });

  //useLocation
  const location = useLocation();

  const listState = async () => {
    const selectData = await getSelectData(
      "country_name",
      inputValue,
      "country"
    );
    setOptionCountry(selectData?.getDataByColNameData);
  };

  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };

  useEffect(() => {
    const userData = getUserData();
    const taxIndicator = location.pathname == "/vendor/tax_indicator" ? 'vendors_tax_indicators' : 'customers_tax_indicators'
    var permissions = userData?.permissionList?.filter(
      permission =>
        permission.sub_menu_name === taxIndicator
    );
    setTaxIndicatorPermission(
      permissions.find(permission => permission.sub_menu_name === taxIndicator)
    );
    listState();
    dispatch({
      type: GET_TAXINDICATOR_REQUEST,
      payload: { tax_indicator_type: location.pathname == "/vendor/tax_indicator" ? 'v' : 'c' },
    });
  }, []);

  useEffect(() => {
    if (listTaxIndicator) {
      setLoading(false)
    }
    if (addTaxIndicator) {
      setToastMessage("TaxIndicator Added Successfully");
      dispatch({
        type: GET_TAXINDICATOR_REQUEST,
        payload: { tax_indicator_type: location.pathname == "/vendor/tax_indicator" ? 'v' : 'c' },
      });
      setToast(true);
    }
    if (updateTaxIndicator) {
      setToastMessage("TaxIndicator Updated Successfully");
      dispatch({
        type: GET_TAXINDICATOR_REQUEST,
        payload: { tax_indicator_type: location.pathname == "/vendor/tax_indicator" ? 'v' : 'c' },
      });
      setToast(true);
    }
    if (deleteTaxIndicator) {
      setToastMessage("TaxIndicator Deleted Successfully");
      dispatch({
        type: GET_TAXINDICATOR_REQUEST,
        payload: { tax_indicator_type: location.pathname == "/vendor/tax_indicator" ? 'v' : 'c' },
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("TaxIndicator Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_TAXINDICATOR_REQUEST,
        payload: { tax_indicator_type: location.pathname == "/vendor/tax_indicator" ? 'v' : 'c' },
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    addTaxIndicator,
    listTaxIndicator,
    updateTaxIndicator,
    updateCommon,
    deleteTaxIndicator,
    toast,
  ]);

  const handleClicks = () => {
    setSelectedCountry({});
    setFormData({
      country_id: "",
      tax_code: "",
      tax_description: "",
      isactive: isActive,
    });
    setModal(true);
  };
  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {

    const taxIndicatorData = {
      Id: rowData.id,
      tax_indicator_type: location.pathname == "/vendor/tax_indicator" ? 'v' : 'c',
    }

    try {
      dispatch({
        type: DELETE_TAXINDICATOR_REQUEST,
        payload: taxIndicatorData,
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

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'tax_code' && value.length > 6) {
      newValue = value.slice(0, 6);
      setFormErrors({
        ...formErrors,
        tax_code: "Tax Code cannot be more than 6 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        tax_code: ""
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const validateForm = () => {
    const errors = {};
    if (Object.keys(selectCountry).length === 0) {
      errors.country = "Country Name is required";
    }
    if (!formData.tax_code.trim()) {
      errors.tax_code = "Tax Code is required";
    } else if (formData.tax_code.length > 6) {
      errors.tax_code = "Tax Code cannot be more than 6 characters"
    }
    if (!formData.tax_description.trim()) {
      errors.tax_description = "Tax Description is required";
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
          tax_indicator_type: location.pathname == "/vendor/tax_indicator" ? 'v' : 'c',
          Id,
        };
        dispatch({
          type: UPDATE_TAXINDICATOR_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          isActive,
          tax_indicator_type: location.pathname == "/vendor/tax_indicator" ? 'v' : 'c',
        };
        dispatch({
          type: ADD_TAXINDICATOR_REQUEST,
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
    setFormData({
      country_id: data?.country.value,
      tax_code: data?.tax_code,
      tax_description: data?.tax_description,
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
        Header: "Country Name",
        accessor: "country.label",
      },
      {
        Header: "Tax Code",
        accessor: "tax_code",
      },
      {
        Header: "Tax Description",
        accessor: "tax_description",
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
                        name: "tax_indicator",
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
              {taxIndicatorPermission && taxIndicatorPermission?.can_edit ? (
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

              {taxIndicatorPermission && taxIndicatorPermission?.can_delete ? (
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
    [status, taxIndicatorPermission]
  );

  document.title = "Detergent | Tax Indicator";
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
          <Breadcrumbs titlePath="#" title={location.pathname === "/vendor/tax_indicator" ? 'Vendor' : 'Customer'}
            breadcrumbItem="Tax Indicator" />

          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={taxIndicator && taxIndicator.length > 0 ? taxIndicator : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                taxIndicatorPermission && taxIndicatorPermission?.can_add
                  ? "Add Tax Indicator"
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
                <Col md={12} className="mb-3">
                  <div className="">
                    <Label htmlFor="formrow-state-Input">Country Name</Label>
                    <Select
                      value={selectCountry}
                      onChange={selectCountry => {
                        setSelectedCountry(selectCountry);
                        setFormData(prevData => ({
                          ...prevData,
                          country_id: selectCountry?.value,
                        }));
                      }}
                      onInputChange={(inputValue, { action }) => {
                        setInputValue(inputValue);
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
                <Col md={12} className="mb-3">
                  <Label htmlFor="countryDescription">Tax Code</Label>
                  <Input
                    type="text"
                    id="countryDescription"
                    name="code_description"
                    className={`form-control ${formErrors.tax_code ? "is-invalid" : ""
                      }`}
                    value={formData.tax_code}
                    rows="3"
                    placeholder="Please Enter Tax Code"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        tax_code: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        tax_code: "", // Clear error when user starts typing
                      }));
                    }}
                  />
                  {formErrors.tax_code && (
                    <div className="invalid-feedback">
                      {formErrors.tax_code}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <div className="">
                    <Label htmlFor="formrow-state-Input">Tax Description</Label>
                    <Input
                      type="textarea"
                      name="tax_description"
                      className={`form-control ${formErrors.tax_description ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Identifier"
                      value={formData?.tax_description}
                      onChange={handleChange}
                    />
                    {formErrors.tax_description && (
                      <div className="invalid-feedback">
                        {formErrors.tax_description}
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
                        setFormData({
                          ...formData,
                          ['isactive']: !isActive,
                      });
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

export default TaxIndicator;
