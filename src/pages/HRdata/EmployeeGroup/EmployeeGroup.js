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
import Select from 'react-select';
import { Link } from "react-router-dom";
import debounce from "lodash/debounce";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
  ADD_EMPLOYEEGROUP_REQUEST,
  GET_EMPLOYEEGROUP_REQUEST,
  UPDATE_EMPLOYEEGROUP_REQUEST,
  DELETE_EMPLOYEEGROUP_REQUEST,
} from "../../../store/employeeGroup/actionTypes";
import { getSelectData } from "helpers/Api/api_common";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const EmployeeGroup = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const {
    listEmployeeGroup,
    employeeGroup,
    addEmployeeGroup,
    updateEmployeeGroup,
    deleteEmployeeGroup,
    error,
  } = useSelector(state => state.employeeGroup);
  const [loading, setLoading] = useState(true);
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectDepartment, setSelectedDepartment] = useState({});
  const [optionDepartment, setOptionDepartment] = useState([]);
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [employeeGroupPermission, setEmployeeGroupPermission] = useState();
  const [formData, setFormData] = useState({
    emp_grp_code: "",
    emp_grp_desc: "",
    emp_subgrp_code: "",
    emp_subgrp_desc: "",
    department_id: "",
    identifier: "",
    isactive: isActive,
  });
  const listState = async () => {
    const selectCompanyData = await getSelectData("department_description", "", "department");
    setOptionDepartment(selectCompanyData?.getDataByColNameData);
  };

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
        permission.sub_menu_name === "employee_group"
    );
    setEmployeeGroupPermission(
      permissions.find(permission => permission.sub_menu_name === "employee_group")
    );
    listState();
    dispatch({
      type: GET_EMPLOYEEGROUP_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listEmployeeGroup) {
      setLoading(false)
    }
    if (addEmployeeGroup) {
      setToastMessage("Employee Group Added Successfully");
      dispatch({
        type: GET_EMPLOYEEGROUP_REQUEST,
      });
      setToast(true);
    }
    if (updateEmployeeGroup) {
      setToastMessage("Employee Group Updated Successfully");
      dispatch({
        type: GET_EMPLOYEEGROUP_REQUEST,
      });
      setToast(true);
    }
    if (deleteEmployeeGroup) {
      setToastMessage("Employee Group Deleted Successfully");
      dispatch({
        type: GET_EMPLOYEEGROUP_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Employee Group Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_EMPLOYEEGROUP_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    listEmployeeGroup,
    addEmployeeGroup,
    updateEmployeeGroup,
    updateCommon,
    deleteEmployeeGroup,
    toast,
  ]);

  const handleClicks = async () => {
    // const selectData = await getSelectData('department_description', "", 'department')
    // setOptionDepartment(selectData?.getDataByColNameData)
    setSelectedDepartment({})
    setFormData({
      emp_grp_code: "",
      emp_grp_desc: "",
      emp_subgrp_code: "",
      emp_subgrp_desc: "",
      department_id: "",
      identifier: "",
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
        type: DELETE_EMPLOYEEGROUP_REQUEST,
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

    // EMPLOYEE GROUP CODE LENGTH VALIDATION
    if (name === 'emp_grp_code' && value.length > 6) {
      newValue = value.slice(0, 6);
      setFormErrors({
        ...formErrors,
        emp_grp_code: "Employee Group Code cannot be more than 6 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        emp_grp_code: ""
      });
    }

    // EMPLOYEE GROUP DESCRIPTION LENGTH VALIDATION
    if (name === 'emp_grp_desc' && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        emp_grp_desc: "Employee Group Description cannot be more than 50 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        emp_grp_desc: ""
      });
    }

    // EMPLOYEE SUBGROUP CODE LENGTH VALIDATION
    if (name === 'emp_subgrp_code' && value.length > 6) {
      newValue = value.slice(0, 6);
      setFormErrors({
        ...formErrors,
        emp_subgrp_code: "Employee Subgroup Code cannot be more than 6 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        emp_subgrp_code: ""
      });
    }

    // EMPLOYEE SUBGROUP DESCRIPTION LENGTH VALIDATION
    if (name === 'emp_subgrp_desc' && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        emp_subgrp_desc: "Employee Subgroup Description cannot be more than 50 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        emp_subgrp_desc: ""
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.emp_grp_code.trim()) {
      errors.emp_grp_code = "Employee Group Code is required";
    } else if (formData.emp_grp_code.length > 6) {
      errors.emp_grp_code = "Employee Group Code cannot be more than 6 characters"
    }
    if (!formData.emp_grp_desc.trim()) {
      errors.emp_grp_desc = "Employee Group Description is required";
    }else if (formData.emp_grp_desc.length > 50) {
      errors.emp_grp_desc = "Employee Group Description cannot be more than 50 characters"
    }
    if (!formData.emp_subgrp_code.trim()) {
      errors.emp_subgrp_code = "Employee Subgroup Code is required";
    } else if (formData.emp_subgrp_code.length > 6) {
      errors.emp_subgrp_code = "Employee Subgroup Code cannot be more than 6 characters"
    }
    if (!formData.emp_subgrp_desc) {
      errors.emp_subgrp_desc = "Emp Subgroup Desc is required";
    }else if (formData.emp_subgrp_desc.length > 50) {
      errors.emp_subgrp_desc = "Employee Subgroup Description cannot be more than 50 characters"
    }
    if (!formData.department_id) {
      errors.department_id = "Department is required";
    }
    if (!formData.identifier) {
      errors.identifier = "identifier is required";
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
          type: UPDATE_EMPLOYEEGROUP_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_EMPLOYEEGROUP_REQUEST,
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
  const handleInputChangeDepartment = useCallback(
    debounce(async inputValue => {
      try {
        const selectData = await getSelectData(
          "department_description",
          inputValue,
          "department"
        );
        setOptionDepartment(selectData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const openModal = (data = null) => {
    setEdit(data);
    setRowData(data);
    setSelectedDepartment(data?.department)
    setFormData({
      emp_grp_code: data?.emp_grp_code || "",
      emp_grp_desc: data?.emp_grp_desc || "",
      emp_subgrp_code: data?.emp_subgrp_code || "",
      emp_subgrp_desc: data?.emp_subgrp_desc || "",
      department_id: data?.department.value || "",
      identifier: data?.identifier || "",
      isactive: data?.isactive || true,
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
        Header: "Emp Grp Code",
        accessor: "emp_grp_code",
      },
      {
        Header: "Emp Grp Desc",
        accessor: "emp_grp_desc",
      },
      {
        Header: "Emp Subgrp Code",
        accessor: "emp_subgrp_code",
      },
      {
        Header: "Emp Subgrp Desc",
        accessor: "emp_subgrp_desc",
      },
      {
        Header: "Department Id",
        accessor: "department.label",
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
                        name: "employee_group",
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
              {employeeGroupPermission && employeeGroupPermission?.can_edit ? (
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

              {employeeGroupPermission && employeeGroupPermission?.can_delete ? (
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
    [status, employeeGroupPermission]
  );

  document.title = "Detergent | Employee Group";
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
          <Breadcrumbs titlePath="#" title="HR Data" breadcrumbItem="Employee Group" />

          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={employeeGroup && employeeGroup.length > 0 ? employeeGroup : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                employeeGroupPermission && employeeGroupPermission?.can_add
                  ? "Add Employee Group"
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
                <Col md={5} className="mb-3">
                  <div className="">
                    <Label htmlFor="formrow-state-Input">Emp Grp Code</Label>
                    <Input
                      type="text"
                      name="emp_grp_code"
                      className={`form-control ${formErrors.emp_grp_code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter Emp Grp Code"
                      value={formData?.emp_grp_code}
                      onChange={handleChange}
                    />
                    {formErrors.emp_grp_code && (
                      <div className="invalid-feedback">
                        {formErrors.emp_grp_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <Label htmlFor="countryDescription">
                    Emp Grp Desc
                  </Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="emp_grp_desc"
                    className={`form-control ${formErrors.emp_grp_desc ? "is-invalid" : ""
                      }`}
                    value={formData.emp_grp_desc}
                    rows="2"
                    placeholder="Enter Emp Grp Desc"
                    onChange={handleChange}
                  />
                  {formErrors.emp_grp_desc && (
                    <div className="invalid-feedback">
                      {formErrors.emp_grp_desc}
                    </div>
                  )}
                </Col>
                <Col md={5} className="mb-3">
                  <div className="">
                    <Label htmlFor="formrow-state-Input">
                      Emp Subgrp Code
                    </Label>
                    <Input
                      type="text"
                      name="emp_subgrp_code"
                      className={`form-control ${formErrors.emp_subgrp_code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter Emp Subgrp Code"
                      value={formData?.emp_subgrp_code}
                      onChange={handleChange}
                    />
                    {formErrors.emp_subgrp_code && (
                      <div className="invalid-feedback">
                        {formErrors.emp_subgrp_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <Label htmlFor="countryDescription">
                    Emp Subgrp Desc
                  </Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="emp_subgrp_desc"
                    className={`form-control ${formErrors.emp_subgrp_desc
                      ? "is-invalid"
                      : ""
                      }`}
                    value={formData.emp_subgrp_desc}
                    rows="2"
                    placeholder="Enter Emp Subgrp Desc"
                    onChange={handleChange}
                  />
                  {formErrors.emp_subgrp_desc && (
                    <div className="invalid-feedback">
                      {formErrors.emp_subgrp_desc}
                    </div>
                  )}
                </Col>
                <Col md={5}>
                  <div className="mb-3">
                    <Label className="form-label">Department</Label>
                    <Select
                      value={selectDepartment}
                      onChange={async selectDepartment => {
                        setSelectedDepartment(selectDepartment)
                        setFormData(prevData => ({
                          ...prevData,
                          department_id: selectDepartment?.value,
                        }));
                      }}
                      onInputChange={(inputValue, { action }) => {
                        handleInputChangeDepartment(inputValue);
                      }}
                      options={optionDepartment}
                    />
                    {formErrors.department_id && (
                      <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                        {formErrors.department_id}
                      </div>
                    )}
                  </div>
                </Col>

                <Col md={6} className="mb-3">
                  <div className="mb-3">
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

export default EmployeeGroup;
