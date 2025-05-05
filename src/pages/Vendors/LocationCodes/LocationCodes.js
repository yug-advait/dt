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
import DeleteModal from "components/Common/DeleteModal";
import {
  ADD_LOCATIONCODES_REQUEST,
  GET_LOCATIONCODES_REQUEST,
  UPDATE_LOCATIONCODES_REQUEST,
  DELETE_LOCATIONCODES_REQUEST,
} from "../../../store/locationCodes/actionTypes";
import { STATUS_REQUEST,UPDATE_STATUS_RESET } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const LocationCodes = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const {
    listLocationCodes,
    locationCodes,
    addLocationCodes,
    updateLocationCodes,
    deleteLocationCodes,
    error,
  } = useSelector(state => state.locationCodes);
  const [loading, setLoading] = useState(true);
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
  const [locationCodesPermission, setLocationCodesPermission] = useState();
  const [formData, setFormData] = useState({
    code: "",
    code_description: "",
    identifier: "",
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
    const locationCode = location.pathname == "/vendor/location_code" ? 'vendors_location_codes' : 'customers_location_codes'
    var permissions = userData?.permissionList?.filter(
      permission =>
        permission.sub_menu_name === locationCode
    );
    setLocationCodesPermission(
      permissions.find(permission => permission.sub_menu_name === locationCode)
    );
    dispatch({
      type: GET_LOCATIONCODES_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listLocationCodes) {
      setLoading(false)
    }
    if (addLocationCodes) {
      setToastMessage("Location Codes Added Successfully");
      dispatch({
        type: GET_LOCATIONCODES_REQUEST,
      });
      setToast(true);
    }
    if (updateLocationCodes) {
      setToastMessage("Location Codes Updated Successfully");
      dispatch({
        type: GET_LOCATIONCODES_REQUEST,
      });
      setToast(true);
    }
    if (deleteLocationCodes) {
      setToastMessage("Location Codes Deleted Successfully");
      dispatch({
        type: GET_LOCATIONCODES_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Location Codes Status Updated Successfully");
      dispatch({
        type: UPDATE_STATUS_RESET,
      });
      dispatch({
        type: GET_LOCATIONCODES_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    listLocationCodes,
    addLocationCodes,
    updateLocationCodes,
    deleteLocationCodes,
    updateCommon,
    toast,
  ]);

  const handleClicks = () => {
    setFormData({
      code: "",
      code_description: "",
      identifier: "",
      isactive: isActive,
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
        type: DELETE_LOCATIONCODES_REQUEST,
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

    if (name === 'code' && value.length > 3) {
      newValue = value.slice(0, 3);
      setFormErrors({
        ...formErrors,
        code: "Code be more than 3 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        code: ""
      });
    }
    if (name === 'code_description' && value.length > 50) {
      setFormErrors({
        ...formErrors,
        code_description: "Code Description cannot be more than 50 characters"
      });
    }else {
      setFormErrors({
        ...formErrors,
        code_description: ""
      });
    }
    if (name === 'identifier' && value.length > 50) {
      setFormErrors({
        ...formErrors,
        identifier: "identifier cannot be more than 50 characters"
      });
    }else {
      setFormErrors({
        ...formErrors,
        identifier: ""
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) {
      errors.code = "Code is required";
    } else if (formData.code.length > 3) {
      errors.code = "Code cannot be more than 3 characters"
    }
    if (!formData.code_description.trim()) {
      errors.code_description = "Code Description is required";
    }
    else if (formData.code_description.length > 50) {
      errors.code_description = "Code Description cannot be more than 50 characters"
    }
    if (!formData.identifier.trim()) {
      errors.identifier = "Identifier is required";
    }
    else if (formData.identifier.length > 50) {
      errors.identifier = "Indicator cannot be more than 50 characters"
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
          type: UPDATE_LOCATIONCODES_REQUEST,
          payload: StateData,
        });
      } else {
        const StateData = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_LOCATIONCODES_REQUEST,
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
    setFormData({
      code: data?.code,
      code_description: data?.code_description,
      identifier: data?.identifier,
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
        accessor: "code",
      },
      {
        Header: "Code Description",
        accessor: "code_description",
      },
      {
        Header: "Identifier",
        accessor: "identifier",
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
                        name: "location_code",
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
              {locationCodesPermission && locationCodesPermission?.can_edit ? (
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

              {locationCodesPermission && locationCodesPermission?.can_delete ? (
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
    [status, locationCodesPermission]
  );

  document.title = "Detergent | Location Codes";
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
          <Breadcrumbs titlePath="#" title={location.pathname === "/vendor/location_code" ? 'Vendor' : 'Customer'}
            breadcrumbItem="SEZ/EOU/DTA Location Codes" />

          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={locationCodes && locationCodes.length > 0 ? locationCodes : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                locationCodesPermission && locationCodesPermission?.can_add
                  ? "Add SEZ/EOU/DTA Location Codes"
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
                    <Label htmlFor="formrow-state-Input">Code</Label>
                    <Input
                      type="text"
                      name="code"
                      className={`form-control ${formErrors.code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Code"
                      value={formData?.code}
                      onChange={handleChange}
                    />
                    {formErrors.code && (
                      <div className="invalid-feedback">
                        {formErrors.code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="countryDescription">
                    Code Description
                  </Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="code_description"
                    className={`form-control ${formErrors.code_description ? "is-invalid" : ""
                      }`}
                    value={formData.code_description}
                    rows="3"
                    placeholder="Please Enter Code Description"
                    onChange={handleChange}
                  />
                  {formErrors.code_description && (
                    <div className="invalid-feedback">
                      {formErrors.code_description}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <div className="">
                    <Label htmlFor="formrow-state-Input">
                      Identifier
                    </Label>
                    <Input
                      type="text"
                      name="identifier"
                      className={`form-control ${formErrors.identifier ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Identifier"
                      value={formData?.identifier}
                      onChange={handleChange}
                    />
                    {formErrors.identifier && (
                      <div className="invalid-feedback">
                        {formErrors.identifier}
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

export default LocationCodes;
