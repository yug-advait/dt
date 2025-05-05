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
import Select from "react-select";
import debounce from "lodash/debounce";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
  ADD_VENDORGROUPS_REQUEST,
  GET_VENDORGROUPS_REQUEST,
  UPDATE_VENDORGROUPS_REQUEST,
  DELETE_VENDORGROUPS_REQUEST,
} from "../../../store/vendorGroups/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const LocationCodes = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const {
    listVendorGroups,
    vendorGroups,
    addVendorGroups,
    updateVendorGroups,
    deleteVendorGroups,
    error,
  } = useSelector(state => state.VendorGroups);

  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [selectGroupType, setSelectedGroupType] = useState({});
  const [status, setStatus] = useState("");
  const [vendorGroupPermission, setVendorGroupPermission] = useState();
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    vend_grp: "",
    vend_grp_description: "",
    vend_grp_type: "",
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
        permission.sub_menu_name === "vendor_groups"
    );
    setVendorGroupPermission(
      permissions.find(permission => permission.sub_menu_name === "vendor_groups")
    );
    dispatch({
      type: GET_VENDORGROUPS_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listVendorGroups) {
      setLoading(false)
    }
    if (addVendorGroups) {
      setToastMessage("Vendor Group Added Successfully");
      dispatch({
        type: GET_VENDORGROUPS_REQUEST,
      });
      setToast(true);
    }
    if (updateVendorGroups) {
      setToastMessage("Vendor Group Updated Successfully");
      dispatch({
        type: GET_VENDORGROUPS_REQUEST,
      });
      setToast(true);
    }
    if (deleteVendorGroups) {
      setToastMessage("Vendor Group Deleted Successfully");
      dispatch({
        type: GET_VENDORGROUPS_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Vendor Group Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_VENDORGROUPS_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    listVendorGroups,
    addVendorGroups,
    updateVendorGroups,
    updateCommon,
    deleteVendorGroups,
    toast,
  ]);

  const handleClicks = () => {
    setSelectedGroupType({})
    setFormData({
      vend_grp: "",
      vend_grp_description: "",
      vend_grp_type: "",
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
        type: DELETE_VENDORGROUPS_REQUEST,
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

    if (name === 'vend_grp' && value.length > 3) {
      newValue = value.slice(0, 3);
      setFormErrors({
        ...formErrors,
        vend_grp: "Vendor Group Code cannot be more than 3 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        vend_grp: ""
      });
    }
    if (name === 'vend_grp_description' && value.length > 50) {
      setFormErrors({
        ...formErrors,
        vend_grp_description: "Vendor Description cannot be more than 50 characters"
      });
    }else {
      setFormErrors({
        ...formErrors,
        vend_grp_description: ""
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.vend_grp.trim()) {
      errors.vend_grp = "Vendor Group Code is required";
    } else if (formData.vend_grp.length > 3) {
      errors.vend_grp = "Vendor Group Code cannot be more than 3 characters"
    }
    if (!formData.vend_grp_description.trim()) {
      errors.vend_grp_description = "Code Description is required";
    }
    else if (formData.vend_grp_description.length > 50) {
      errors.vend_grp_description = "Vendor Group Description cannot be more than 50 characters"
    }
    if (Object.keys(selectGroupType).length === 0) {
      errors.vend_grp_type = "Vendor Group Type is required";
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
          type: UPDATE_VENDORGROUPS_REQUEST,
          payload: StateData,
        });
      } else {
        const StateData = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_VENDORGROUPS_REQUEST,
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
    setSelectedGroupType({ value: data?.vend_grp_type, label: data?.vend_grp_type })
    setFormData({
      vend_grp: data?.vend_grp,
      vend_grp_description: data?.vend_grp_description,
      vend_grp_type: data?.vend_grp_type,
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
        Header: "Vendor Groups Code",
        accessor: "vend_grp",
      },
      {
        Header: "Vendor Groups Description",
        accessor: "vend_grp_description",
      },
      {
        Header: "Vendor Groups Type",
        accessor: "vend_grp_type",
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
                        name: "vendor_group",
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
              {vendorGroupPermission && vendorGroupPermission?.can_edit ? (

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
              {vendorGroupPermission && vendorGroupPermission?.can_delete ? (

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
    [status, vendorGroupPermission]
  );

  document.title = "Detergent | Vendor Groups";
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
          <Breadcrumbs titlePath="#" title="Vendor" breadcrumbItem="Vendor Groups" />

          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={vendorGroups && vendorGroups.length > 0 ? vendorGroups : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                vendorGroupPermission && vendorGroupPermission?.can_add
                  ? "Add Vendor Groups"
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
                      name="vend_grp"
                      className={`form-control ${formErrors.vend_grp ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Vendor Group Code"
                      value={formData?.vend_grp}
                      onChange={handleChange}
                    />
                    {formErrors.vend_grp && (
                      <div className="invalid-feedback">
                        {formErrors.vend_grp}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="countryDescription">
                    Vendor Groups Description
                  </Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="vend_grp_description"
                    className={`form-control ${formErrors.vend_grp_description ? "is-invalid" : ""
                      }`}
                    value={formData.vend_grp_description}
                    rows="3"
                    placeholder="Please Enter Vendor Groups Description"
                    onChange={handleChange}
                  />
                  {formErrors.vend_grp_description && (
                    <div className="invalid-feedback">
                      {formErrors.vend_grp_description}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <div className="">
                    <Label htmlFor="formrow-state-Input">
                      Vendor Group Type
                    </Label>
                    <Select
                      value={selectGroupType}
                      onChange={async selectGroupType => {
                        setSelectedGroupType(selectGroupType)
                        setFormData(prevData => ({
                          ...prevData,
                          vend_grp_type: selectGroupType?.value,
                        }));
                      }}
                      options={[{ value: 1, label: 1 }, { value: 2, label: 2 }, { value: 3, label: 3 }, { value: 4, label: 4 }, { value: 5, label: 5 }, { value: 6, label: 6 }]}
                    />
                    {formErrors.vend_grp_type && (
                      <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                        {formErrors.vend_grp_type}
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
