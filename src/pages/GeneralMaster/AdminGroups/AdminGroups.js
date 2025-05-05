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
  Alert
} from "reactstrap";
import { Link } from "react-router-dom"
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
  ADD_ADMINGROUPS_REQUEST,
  GET_ADMINGROUPS_REQUEST,
  UPDATE_ADMINGROUPS_REQUEST,
  DELETE_ADMINGROUPS_REQUEST,
} from "../../../store/adminGroups/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
const AdminGroups = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { admingroups, addAdminGroups, updateAdminGroups, deleteAdminGroups, listAdminGroups, error } = useSelector(
    state => state.AdminGroups
  );
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState("")
  const [toastMessage, setToastMessage] = useState()
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [adminGroupsPermission, setAdminGroupsPermission] = useState();
  const [formData, setFormData] = useState({
    user_group: "",
    user_sub_group: "",
    user_group_name: "",
    user_sub_group_name: "",
    task_group: "",
    task_group_name: "",
    task_sub_group: "",
    task_sub_group_name: "",
    activity_type: "",
    isactive: isActive
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
        permission.sub_menu_name === "admin_groups"
    );
    setAdminGroupsPermission(
      permissions.find(permission => permission.sub_menu_name === "admin_groups")
    );
    dispatch({
      type: GET_ADMINGROUPS_REQUEST,
      payload: [],
    });
  }, []);
  useEffect(() => {
    if (listAdminGroups) {
      setLoading(false)
    }
    if (addAdminGroups) {
      setToastMessage("Admin Group Added Successfully");
      dispatch({
        type: GET_ADMINGROUPS_REQUEST,
      });
      setToast(true);
    }
    if (updateAdminGroups) {
      setToastMessage("Admin Group Updated Successfully");
      dispatch({
        type: GET_ADMINGROUPS_REQUEST,
      });
      setToast(true);
    }
    if (deleteAdminGroups) {
      setToastMessage("Admin Group Deleted Successfully");
      dispatch({
        type: GET_ADMINGROUPS_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Admin Group Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      })
      dispatch({
        type: GET_ADMINGROUPS_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [updateCommon, addAdminGroups, updateAdminGroups, deleteAdminGroups, listAdminGroups, toast]);

  const handleClicks = () => {
    setFormData({
      user_group: "",
      user_sub_group: "",
      user_group_name: "",
      user_sub_group_name: "",
      task_group: "",
      task_group_name: "",
      task_sub_group: "",
      task_sub_group_name: "",
      activity_type: "",
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
        type: DELETE_ADMINGROUPS_REQUEST,
        payload: rowData.id,
      });
      setDeleteModal(false)
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };


  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.user_group) {
      errors.user_group = "User Group is required";
    }
    if (!formData.user_sub_group) {
      errors.user_sub_group = "User Sub Group is required";
    }
    if (!formData.user_group_name) {
      errors.user_group_name = "User Group Name is required";
    }
    if (!formData.user_sub_group_name) {
      errors.user_sub_group_name = "User Sub Group Name is required";
    }
    if (!formData.task_group) {
      errors.task_group = "Task Group is required";
    }
    if (!formData.task_group_name) {
      errors.task_group_name = "Task Group Name is required";
    }
    if (!formData.task_sub_group) {
      errors.task_sub_group = "Task Sub Group is required";
    }
    if (!formData.task_sub_group_name) {
      errors.task_sub_group_name = "Task Sub Group Name is required";
    }
    if (!formData.activity_type) {
      errors.activity_type = "Activity Type is required";
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
          type: UPDATE_ADMINGROUPS_REQUEST,
          payload: StateData,
        });
      } else {
        const StateData = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_ADMINGROUPS_REQUEST,
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
      user_group: data?.user_group || "",
      user_sub_group: data?.user_sub_group || "",
      user_group_name: data?.user_group_name || "",
      user_sub_group_name: data?.user_sub_group_name || "",
      task_group: data?.task_group || "",
      task_group_name: data?.task_group_name || "",
      task_sub_group: data?.task_sub_group || "",
      task_sub_group_name: data?.task_sub_group_name || "",
      activity_type: data?.activity_type || "",
      isactive: data?.isactive || true,
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
        Header: "User Group",
        accessor: "user_group",
      },
      {
        Header: "User Sub Group",
        accessor: "user_sub_group",
      },
      {
        Header: "User Group Name",
        accessor: "user_group_name",
      },
      {
        Header: "User Sub Group Name",
        accessor: "user_sub_group_name",
      },
      {
        Header: "Task Group",
        accessor: "task_group",
      },
      {
        Header: "Task Group Name",
        accessor: "task_group_name",
      },
      {
        Header: "Task Sub Group",
        accessor: "task_sub_group",
      },
      {
        Header: "Task Sub Group Name",
        accessor: "task_sub_group_name",
      },
      {
        Header: "Activity Type",
        accessor: "activity_type",
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
                        name: "admin_group",
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
              {adminGroupsPermission && adminGroupsPermission?.can_edit ? (
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

              {adminGroupsPermission && adminGroupsPermission?.can_delete ? (
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
    [status,adminGroupsPermission]
  );

  document.title = "Detergent | Admin Groups";
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
          <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="Admin Groups" />
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={admingroups.admins && admingroups.admins.length > 0 ? admingroups.admins : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                adminGroupsPermission && adminGroupsPermission?.can_add
                  ? "Add Admin Groups"
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
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">User Group</Label>
                    <Input
                      type="text"
                      name="user_group"
                      className={`form-control ${formErrors.user_group ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter here"
                      value={formData?.user_group}
                      onChange={handleChange}
                    />
                    {formErrors.user_group && (
                      <div className="invalid-feedback">
                        {formErrors.user_group}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <Label htmlFor="countryDescription">User Sub Group</Label>
                  <Input
                    type="text"
                    id="countryDescription"
                    name="user_sub_group"
                    className={`form-control ${formErrors.user_sub_group ? "is-invalid" : ""
                      }`}
                    value={formData.user_sub_group}
                    rows="3"
                    placeholder="Enter here"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        user_sub_group: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        user_sub_group: "",
                      }));
                    }}
                  />
                  {formErrors.user_sub_group && (
                    <div className="invalid-feedback">
                      {formErrors.user_sub_group}
                    </div>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <Label htmlFor="countryDescription">User Group Name</Label>
                  <Input
                    type="text"
                    id="countryDescription"
                    name="user_group_name"
                    className={`form-control ${formErrors.user_group_name ? "is-invalid" : ""
                      }`}
                    value={formData.user_group_name}
                    rows="3"
                    placeholder="Enter here"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        user_group_name: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        user_group_name: "",
                      }));
                    }}
                  />
                  {formErrors.user_group_name && (
                    <div className="invalid-feedback">
                      {formErrors.user_group_name}
                    </div>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <Label htmlFor="countryDescription">User Sub Group Name</Label>
                  <Input
                    type="text"
                    id="countryDescription"
                    name="user_sub_group_name"
                    className={`form-control ${formErrors.user_sub_group_name ? "is-invalid" : ""
                      }`}
                    value={formData.user_sub_group_name}
                    rows="3"
                    placeholder="Enter here"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        user_sub_group_name: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        user_sub_group_name: "",
                      }));
                    }}
                  />
                  {formErrors.user_sub_group_name && (
                    <div className="invalid-feedback">
                      {formErrors.user_sub_group_name}
                    </div>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <Label htmlFor="countryDescription">Task Group</Label>
                  <Input
                    type="text"
                    id="countryDescription"
                    name="task_group"
                    className={`form-control ${formErrors.task_group ? "is-invalid" : ""
                      }`}
                    value={formData.task_group}
                    rows="3"
                    placeholder="Enter here"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        task_group: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        task_group: "",
                      }));
                    }}
                  />
                  {formErrors.task_group && (
                    <div className="invalid-feedback">
                      {formErrors.task_group}
                    </div>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <Label htmlFor="countryDescription">Task Group Name</Label>
                  <Input
                    type="text"
                    id="countryDescription"
                    name="task_group_name"
                    className={`form-control ${formErrors.task_group_name ? "is-invalid" : ""
                      }`}
                    value={formData.task_group_name}
                    rows="3"
                    placeholder="Enter here"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        task_group_name: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        task_group_name: "",
                      }));
                    }}
                  />
                  {formErrors.task_group_name && (
                    <div className="invalid-feedback">
                      {formErrors.task_group_name}
                    </div>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <Label htmlFor="countryDescription">Task Sub Group</Label>
                  <Input
                    type="text"
                    id="countryDescription"
                    name="task_sub_group"
                    className={`form-control ${formErrors.task_sub_group ? "is-invalid" : ""
                      }`}
                    value={formData.task_sub_group}
                    rows="3"
                    placeholder="Enter here"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        task_sub_group: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        task_sub_group: "",
                      }));
                    }}
                  />
                  {formErrors.task_sub_group && (
                    <div className="invalid-feedback">
                      {formErrors.task_sub_group}
                    </div>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <Label htmlFor="countryDescription">Task Sub Group Name</Label>
                  <Input
                    type="text"
                    id="countryDescription"
                    name="task_sub_group_name"
                    className={`form-control ${formErrors.task_sub_group_name ? "is-invalid" : ""
                      }`}
                    value={formData.task_sub_group_name}
                    rows="3"
                    placeholder="Enter here"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        task_sub_group_name: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        task_sub_group_name: "",
                      }));
                    }}
                  />
                  {formErrors.task_sub_group_name && (
                    <div className="invalid-feedback">
                      {formErrors.task_sub_group_name}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="countryDescription">Activity Type</Label>
                  <Input
                    type="text"
                    id="countryDescription"
                    name="activity_type"
                    className={`form-control ${formErrors.activity_type ? "is-invalid" : ""
                      }`}
                    value={formData.activity_type}
                    rows="3"
                    placeholder="Enter here"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        activity_type: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        activity_type: "",
                      }));
                    }}
                  />
                  {formErrors.activity_type && (
                    <div className="invalid-feedback">
                      {formErrors.activity_type}
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

export default AdminGroups;
