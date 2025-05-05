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
  Alert,
  UncontrolledTooltip,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import { Link } from "react-router-dom";
import moment from "moment";
import DeleteModal from "components/Common/DeleteModal";
import { useSelector, useDispatch } from "react-redux";
import {
  ADD_DEPARTMENTS_REQUEST,
  GET_DEPARTMENTS_REQUEST,
  UPDATE_DEPARTMENTS_REQUEST,
  DELETE_DEPARTMENTS_REQUEST,
} from "../../../store/department/actionTypes";
import { STATUS_REQUEST,UPDATE_STATUS_RESET } from "../../../store/common/actionTypes";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss"; 

const Department = () => {
  const dispatch = useDispatch();
  const { departments, addDepartment, updateDepartment, deleteDepartment, listDepartment, error } = useSelector(state => state.departments);
  const { updateCommon } = useSelector(state => state.commons);

  const [modal, setModal] = useState(false);
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departmentRow, setDepartmentRow] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [toast, setToast] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [status, setStatus] = useState('');
  const [toastMessage, setToastMessage] = useState();
  const [selectedDepartmentForEdit, setSelectedDepartmentForEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [departmentPermission, setDepartmentPermission] = useState();

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
        permission.sub_menu_name === "departments"
    );
    setDepartmentPermission(
      permissions.find(permission => permission.sub_menu_name === "departments")
    );
    dispatch({
      type: GET_DEPARTMENTS_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listDepartment) {
      setLoading(false)
    }
    if (addDepartment || updateDepartment || deleteDepartment ) {
      setToastMessage(
        addDepartment
          ? "Department Added Successfully"
          : updateDepartment
            ? "Department Updated Successfully"
            : deleteDepartment
              ? "Department Deleted Successfully"
              : "Department Status Updated Successfully"
      );
      dispatch({ type: GET_DEPARTMENTS_REQUEST });
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    }
      if (updateCommon) {
          setToastMessage("Department Status Updated Successfully.");
          dispatch({
            type: UPDATE_STATUS_RESET,
          });
          dispatch({
            type: GET_DEPARTMENTS_REQUEST,
          });
          setToast(true);
          setTimeout(() => setToast(false), 3000);

        }
  }, [addDepartment, updateDepartment, deleteDepartment, listDepartment, updateCommon, dispatch]);

  const handleSaveOrEdit = async e => {
    e.preventDefault();
    if (!departmentId.trim() || !departmentDescription.trim()) {
      setErrors({
        departmentId: !departmentId.trim() ? "Department ID is required" : "",
        departmentDescription: !departmentDescription.trim()
          ? "Department Description is required"
          : "",
      });
      return;
    }

    if (departmentId.trim().length > 10||departmentDescription.trim().length > 40) {
      setErrors({
        departmentId: "Department ID should contain 10 characters",
      });
      setErrors({
        departmentDescription: "Department Description should contain 40 characters",
      });
      return;
    }

    try {
      if (selectedDepartmentForEdit) {
        const Id = selectedDepartmentForEdit.id;
        const DepartmentData = {
          departmentId,
          departmentDescription,
          isActive,
          Id,
        };
        dispatch({
          type: UPDATE_DEPARTMENTS_REQUEST,
          payload: DepartmentData,
        });
      } else {
        setToast(false);
        const DepartmentData = {
          departmentId,
          departmentDescription,
          isActive,
        };
        dispatch({
          type: ADD_DEPARTMENTS_REQUEST,
          payload: DepartmentData,
        });
      }
      setModal(false);
      setSelectedDepartmentForEdit(null);
      resetForm();
    } catch (error) {
      console.error("Error saving/editing data:", error);
    }
  };

  const handleDelete = async () => {
    try {
      dispatch({
        type: DELETE_DEPARTMENTS_REQUEST,
        payload: departmentRow.id,
      });
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleClicks = () => {
    setModal(true);
  };

  const onClickDelete = item => {
    setDepartmentRow(item);
    setDeleteModal(true);
  };

  const openModal = (data = null) => {
    resetForm();
    setDepartmentDescription("");
    setDepartmentId("");
    setSelectedDepartmentForEdit(data);
    setModal(true);
    if (data) {
      setDepartmentDescription(data.department_description);
      setDepartmentId(data.department_code);
      setIsActive(data.isactive);
    }
  };

  const resetForm = () => {
    setDepartmentDescription("");
    setDepartmentId("");
    setErrors({});
    setSelectedDepartmentForEdit(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "department_code",
      },
      {
        Header: "Description",
        accessor: "department_description",
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
            <div className="form-check form-switch mb-3" dir="ltr">
              <input
                type="checkbox"
                className="form-check-input"
                checked={cellProps.row.original.isactive}
                onClick={() => {
                  dispatch({
                    type: STATUS_REQUEST,
                    payload: {
                      name: 'department',
                      isactive: !cellProps.row.original.isactive,
                      id: cellProps.row.original?.id,
                    },
                  });
                }}
              />
            </div>
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
              {departmentPermission && departmentPermission?.can_edit ? (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => openModal(cellProps.row.original)}
                >
                  <i className="mdi mdi-pencil-box font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </Link>
              ) : null}

              {departmentPermission && departmentPermission?.can_delete ? (
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
    [dispatch, departmentPermission]
  );

  document.title = "Detergent | Department";

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
            breadcrumbItem={<>Departments</>}
            breadcrumbItem2="cities"
            showBackButton={false}
          />
          {loading ? (
            <Loader />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={departments && departments.length > 0 ? departments : []}
                      isGlobalFilter={true}
                      isAddOptions={true}
                      customPageSize={10}
                      className="custom-header-css"
                      addButtonLabel={
                        departmentPermission && departmentPermission?.can_add
                          ? "Add Departments"
                          : null
                      }
                      handleClicks={handleClicks}
                      filterStateWise={true}
                      loading={loading}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </div>
        <Modal isOpen={modal} centered>
          <div className="modal-header">
            {selectedDepartmentForEdit ? "Edit" : "Add"}
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
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Id</Label>
                    <Input
                      type="text"
                      className={`form-control ${errors.departmentId ? "is-invalid" : ""}`}
                      id="formrow-state-Input"
                      placeholder="Enter Your Department Id"
                      value={departmentId}
                      onChange={e => {
                        if (e.target.value.length <= 10) {
                          setDepartmentId(e.target.value);
                          setErrors({ ...errors, departmentId: "" });
                        } else {
                          setErrors({ ...errors, departmentId: "Department ID should contain 10 characters" });
                        }
                      }}
                    />
                    {errors.departmentId && (
                      <div className="invalid-feedback">
                        {errors.departmentId}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="formmessage">Description</Label>
                  <Input
                    type="textarea"
                    id="formmessage"
                    className={`form-control ${errors.departmentDescription ? "is-invalid" : ""}`}
                    value={departmentDescription}
                    rows="3"
                    placeholder="Enter your department description"
                    onChange={e => {
                      setDepartmentDescription(e.target.value);
                      setErrors({ ...errors, departmentDescription: "" });
                    }}
                  />
                  {errors.departmentDescription && (
                    <div className="invalid-feedback">
                      {errors.departmentDescription}
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

export default Department;
