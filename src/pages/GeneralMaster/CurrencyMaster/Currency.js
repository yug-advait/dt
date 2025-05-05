import React, { useEffect, useMemo, useState  } from "react";
import {
  Row,
  Col,
  UncontrolledTooltip,
  Button,
  Modal,
  Form,
  Label,
  Input,
  Alert
} from "reactstrap";
import { Link } from "react-router-dom"
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
  ADD_CURRENCY_REQUEST,
  GET_CURRENCY_REQUEST,
  UPDATE_CURRENCY_REQUEST,
  DELETE_CURRENCY_REQUEST,
} from "../../../store/currency/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
const Currency = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { currency, addCurrency,listCurrency, updateCurrency, deleteCurrency, error } = useSelector(
    state => state.currency
  );
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [rowData, setRowData] = useState("")
  const [toastMessage, setToastMessage] = useState()
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    currency_code: "",
    currency_description: "",
    commercial_currency_code: "",
    commercial_currency_description: "",
    decimal_allowed_upto: "",
    isactive: isActive
  });

  useEffect( () => {
    dispatch({
      type: GET_CURRENCY_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listCurrency) {
setLoading(false)
    }
    if (addCurrency) {
      setToastMessage("Currency Added Successfully");
      dispatch({
        type: GET_CURRENCY_REQUEST,
      });
      setToast(true);
    }
    if (updateCurrency) {
      setToastMessage("Currency Updated Successfully");
      dispatch({
        type: GET_CURRENCY_REQUEST,
      });
      setToast(true);
    }
    if (deleteCurrency) {
      setToastMessage("Currency Deleted Successfully");
      dispatch({
        type: GET_CURRENCY_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Currency Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      })
      dispatch({
        type: GET_CURRENCY_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addCurrency, updateCurrency, updateCommon, deleteCurrency, toast]);

  const handleClicks = () => {
    setFormData({
      currency_code: "",
      currency_description: "",
      commercial_currency_code: "",
      commercial_currency_description: "",
      decimal_allowed_upto:"",
      isactive: true
    })
    setModal(true)
  };
  const onClickDelete = item => {
    setRowData(item)
    setDeleteModal(true)
  };

  const handleDelete = async () => {
    try {
      dispatch({
        type: DELETE_CURRENCY_REQUEST,
        payload: rowData.id,
      });
      setDeleteModal(false)
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };


  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'currency_code') {
      if (value.length > 5) {
        newValue = value.slice(0, 5); 
        setFormErrors({
          ...formErrors,
          currency_code: "Currency Code cannot be more than 5 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          currency_code: ""
        });
      }
    }
    if (name === 'currency_description') {
      if (value.length > 70) {
        newValue = value.slice(0, 70); 
        setFormErrors({
          ...formErrors,
          currency_description: "Currency Description cannot be more than 70 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          currency_description: ""
        });
      }
    }
    if (name === 'commercial_currency_code') {
      if (value.length > 5) {
        newValue = value.slice(0, 5); 
        setFormErrors({
          ...formErrors,
          commercial_currency_code: "Commercial Currency Code cannot be more than 5 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          commercial_currency_code: ""
        });
      }
    }
    if (name === 'commercial_currency_description') {
      if (value.length > 70) {
        newValue = value.slice(0, 70); 
        setFormErrors({
          ...formErrors,
          commercial_currency_description: "Commercial Currency Description cannot be more than 70 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          commercial_currency_description: ""
        });
      }
    }
    if (name === 'decimal_allowed_upto') {
      if (value.length > 5) {
        newValue = value.slice(0, 5); 
        setFormErrors({
          ...formErrors,
          decimal_allowed_upto: "Decimal Allowed Upto cannot be more than 5 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          decimal_allowed_upto: ""
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
    if (!formData.currency_code.trim()) {
      errors.currency_code = "Currency Code is required";
    } else if (formData.currency_code.trim().length > 5) {
      errors.currency_code = "Currency Code cannot be more than 5 characters"
    }

    if (!formData.currency_description.trim()) {
      errors.currency_description = "Currency Description is required";
    } else if (formData.currency_description.trim().length > 70) {
      errors.currency_description = "Currency Description cannot be more than 70 characters"
    }

    if (!formData.commercial_currency_code.trim()) {
      errors.commercial_currency_code = "Commercial Currency Code is required";
    } else if (formData.commercial_currency_code.trim().length > 5) {
      errors.commercial_currency_code = "Commercial Currency Code cannot be more than 5 characters"
    }

    if (!formData.commercial_currency_description.trim()) {
      errors.commercial_currency_description = "Commercial Currency Description is required";
    } else if (formData.commercial_currency_description.trim().length > 70) {
      errors.commercial_currency_description = "Commercial Currency Description cannot be more than 70 characters"
    }

    if (!formData.decimal_allowed_upto.trim()) {
      errors.decimal_allowed_upto = "Decimal Allowed Upto is required";
    } else if (formData.decimal_allowed_upto.trim().length > 5) {
      errors.decimal_allowed_upto = "Decimal Allowed Upto cannot be more than 5 characters"
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
        };
        dispatch({
          type: UPDATE_CURRENCY_REQUEST,
          payload: StateData,
        });
      } else {
        const StateData = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_CURRENCY_REQUEST,
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
    setEdit(data)
    setRowData(data)
   setFormData({
    currency_code: data?.currency_code,
    currency_description: data?.currency_description,
    commercial_currency_code: data?.commercial_currency_code,
    commercial_currency_description: data?.commercial_currency_description,
    decimal_allowed_upto: data?.decimal_allowed_upto,
    isactive: data?.isactive,
    })
    setModal(true)
    if (data) {
      setIsActive(data.isactive)
    }
  }

  const resetForm = () => {
    setFormErrors({})
    setErrors({});
    setEdit(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Code",
        accessor: "currency_code",
      },
      {
        Header: "Description",
        accessor: "currency_description",
      },
      {
        Header: "Commercial Code",
        accessor: "commercial_currency_code",
      },
      {
        Header: "Commercial Description",
        accessor: "commercial_currency_description",
      },
      {
        Header: "Decimal Allowed",
        accessor: "decimal_allowed_upto",
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
                      payload: {
                        name: "currency",
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

  document.title = "Detergent | Currency";
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
          <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="Currency" />
          {loading ? (
            <Loader />
          ) : (
          <TableContainer
            columns={columns}
            data={currency && currency.length > 0 ? currency : []}
            isGlobalFilter={true}
            isAddOptions={true}
            customPageSize={10}
            className="custom-header-css"
            addButtonLabel={"Add Currency"}
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
                    <Label htmlFor="formrow-state-Input">Currency Code</Label>
                    <Input
                      type="text"
                      name="currency_code"
                      className={`form-control ${
                        formErrors.currency_code ? "is-invalid" : ""
                      }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Currency Code"
                      value={formData?.currency_code}
                      onChange={handleChange}
                    />
                    {formErrors.currency_code && (
                      <div className="invalid-feedback">
                        {formErrors.currency_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="countryDescription">Currency Description</Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="currency_description"
                    className={`form-control ${
                      formErrors.currency_description ? "is-invalid" : ""
                    }`}
                    value={formData.currency_description}
                    rows="3"
                    placeholder="Please Enter Currency Description"
                    onChange={handleChange}
                  />
                  {formErrors.currency_description && (
                    <div className="invalid-feedback">
                      {formErrors.currency_description}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <div className="">
                    <Label htmlFor="formrow-state-Input">Commercial Currency Code</Label>
                    <Input
                      type="text"
                      name="commercial_currency_code"
                      className={`form-control ${
                        formErrors.commercial_currency_code ? "is-invalid" : ""
                      }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Commercial Currency Code"
                      value={formData?.commercial_currency_code}
                      onChange={handleChange}
                    />
                    {formErrors.commercial_currency_code && (
                      <div className="invalid-feedback">
                        {formErrors.commercial_currency_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="countryDescription">Commercial Currency Description</Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="commercial_currency_description"
                    className={`form-control ${
                      formErrors.commercial_currency_description ? "is-invalid" : ""
                    }`}
                    value={formData.commercial_currency_description}
                    rows="3"
                    placeholder="Please Enter Commercial Currency Description"
                    onChange={handleChange}
                  />
                  {formErrors.commercial_currency_description && (
                    <div className="invalid-feedback">
                      {formErrors.commercial_currency_description}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Decimal Allowed Upto</Label>
                    <Input
                      type="number"
                      name="decimal_allowed_upto"
                      className={`form-control ${
                        formErrors.decimal_allowed_upto ? "is-invalid" : ""
                      }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Decimal Allowed Upto"
                      value={formData?.decimal_allowed_upto}
                      onChange={handleChange}
                    />
                    {formErrors.decimal_allowed_upto && (
                      <div className="invalid-feedback">
                        {formErrors.decimal_allowed_upto}
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

export default Currency;
