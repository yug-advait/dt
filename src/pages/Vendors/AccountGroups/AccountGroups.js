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
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
  ADD_ACCOUNTGROUPS_REQUEST,
  GET_ACCOUNTGROUPS_REQUEST,
  UPDATE_ACCOUNTGROUPS_REQUEST,
  DELETE_ACCOUNTGROUPS_REQUEST,
} from "../../../store/accountGroups/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const AccountGroups = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const {
    listAccountGroups,
    accountGroups,
    addAccountGroups,
    updateAccountGroups,
    deleteAccountGroups,
    error,
  } = useSelector(state => state.accountGroups);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
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
  const [accountGroupsPermission, setAccountGroupsPermission] = useState();
  const [formData, setFormData] = useState({
    account_group_code: "",
    account_group_desc: "",
    suffix_code: "",
    from_number: "",
    to_number: "",
    current_number_status: "",
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
    const vendorAccountGroup = location.pathname == "/vendor/account_groups" ? 'vendors_account_groups' : 'customers_account_groups'
    var permissions = userData?.permissionList?.filter(
      permission =>
        permission.sub_menu_name === vendorAccountGroup
    );
    setAccountGroupsPermission(
      permissions.find(permission => permission.sub_menu_name === vendorAccountGroup)
    );
    dispatch({
      type: GET_ACCOUNTGROUPS_REQUEST,
      payload: {
        account_group_type: location.pathname == "/vendor/account_groups" ? 'v' : 'c'
      },
    });
  }, []);

  useEffect(() => {
    if (listAccountGroups) {
      setLoading(false)
    }
    if (addAccountGroups) {
      setToastMessage("Account Groups Added Successfully");
      dispatch({
        type: GET_ACCOUNTGROUPS_REQUEST,
        payload: {
          account_group_type: location.pathname == "/vendor/account_groups" ? 'v' : 'c'
        },
      });
      setToast(true);
    }
    if (updateAccountGroups) {
      setToastMessage("Account Groups Updated Successfully");
      dispatch({
        type: GET_ACCOUNTGROUPS_REQUEST,
        payload: {
          account_group_type: location.pathname == "/vendor/account_groups" ? 'v' : 'c'
        },
      });
      setToast(true);
    }
    if (deleteAccountGroups) {
      setToastMessage("Account Groups Deleted Successfully");
      dispatch({
        type: GET_ACCOUNTGROUPS_REQUEST,
        payload: {
          account_group_type: location.pathname == "/vendor/account_groups" ? 'v' : 'c'
        },
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Account Groups Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_ACCOUNTGROUPS_REQUEST,
        payload: {
          account_group_type: location.pathname == "/vendor/account_groups" ? 'v' : 'c'
        },
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    listAccountGroups,
    addAccountGroups,
    updateAccountGroups,
    updateCommon,
    deleteAccountGroups,
    toast,
  ]);

  const handleClicks = () => {
    setFormData({
      account_group_code: "",
      account_group_desc: "",
      suffix_code: "",
      from_number: "",
      to_number: "",
      current_number_status: "",
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
        type: DELETE_ACCOUNTGROUPS_REQUEST,
        payload: { Id: rowData.id, account_group_type: location.pathname == "/vendor/account_groups" ? 'v' : 'c' },
      });
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'account_group_code' && value.length > 6) {
      newValue = value.slice(0, 6);
      setFormErrors({
        ...formErrors,
        account_group_code: "Account Group Code cannot be more than 6 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        account_group_code: ""
      });
    }
    if (name === 'account_group_desc' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        account_group_desc: "Account Group Desc cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        account_group_desc: ""
      });
    }
    if (name === 'suffix_code' && value.length > 4) {
      newValue = value.slice(0, 4);
      setFormErrors({
        ...formErrors,
        suffix_code: "Suffix Code cannot be more than 4 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        suffix_code: ""
      });
    }
    if (name === 'from_number' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        from_number: "From Number cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        from_number: ""
      });
    }
    if (name === 'to_number' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        to_number: "To Number cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        to_number: ""
      });
    }
    if (name === 'current_number_status' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        current_number_status: "Current Number Status cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        current_number_status: ""
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.account_group_code.trim()) {
      errors.account_group_code = "Account Group Code is required";
    } else if (formData.account_group_code.length > 6) {
      errors.account_group_code = "Account Group Code cannot be more than 6 characters"
    }
    if (!formData.account_group_desc.trim()) {
      errors.account_group_desc = "Account Group Desc is required";
    } else if (formData.account_group_desc.length > 10) {
      errors.account_group_desc = "Account Group Desc cannot be more than 10 characters"
    }
    if (!formData.suffix_code.trim()) {
      errors.suffix_code = "Suffix Code is required";
    } else if (formData.suffix_code.length > 4) {
      errors.suffix_code = "Suffix Code cannot be more than 4 characters"
    }
    if (!formData.from_number) {
      errors.from_number = "From Number is required";
    } else if (formData.from_number.length > 10) {
      errors.from_number = "From Number cannot be more than 10 characters"
    }
    if (!formData.to_number) {
      errors.to_number = "To Number is required";
    } else if (formData.to_number.length > 10) {
      errors.to_number = "To Number cannot be more than 10 characters"
    }
    if (Number(formData.to_number) <= Number(formData.from_number)) {
      errors.to_number = "To Number must be greater than From Number";
    }
    if (!formData.current_number_status) {
      errors.current_number_status = "Current Number Status is required";
    } else if (formData.current_number_status.length > 10) {
      errors.current_number_status = "Current Number Status cannot be more than 10 characters"
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
          account_group_type: location.pathname == "/vendor/account_groups" ? 'v' : 'c',
          Id,
        };
        dispatch({
          type: UPDATE_ACCOUNTGROUPS_REQUEST,
          payload: StateData,
        });
      } else {
        const StateData = {
          formData,
          account_group_type: location.pathname == "/vendor/account_groups" ? 'v' : 'c',
          isActive,
        };
        dispatch({
          type: ADD_ACCOUNTGROUPS_REQUEST,
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
      account_group_code: data?.account_group_code,
      account_group_desc: data?.account_group_desc,
      suffix_code: data?.suffix_code,
      from_number: data?.from_number,
      to_number: data?.to_number,
      current_number_status: data?.current_number_status,
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
        accessor: "account_group_code",
      },
      {
        Header: "Description",
        accessor: "account_group_desc",
      },
      {
        Header: "Suffix Code",
        accessor: "suffix_code",
      },
      {
        Header: "From Number",
        accessor: "from_number",
      },
      {
        Header: "To Number",
        accessor: "to_number",
      },
      {
        Header: "Current Number Status",
        accessor: "current_number_status",
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
                        name: "account_group",
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
              {accountGroupsPermission && accountGroupsPermission?.can_edit ? (
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

              {accountGroupsPermission && accountGroupsPermission?.can_delete ? (
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
    [status, accountGroupsPermission]
  );

  document.title = "Detergent | Account Groups";
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
          <Breadcrumbs titlePath="#" title={location.pathname === "/vendor/account_groups" ? 'Vendor' : 'Customer'} 
          breadcrumbItem="Account Groups" />

          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={accountGroups && accountGroups.length > 0 ? accountGroups : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                accountGroupsPermission && accountGroupsPermission?.can_add
                  ? "Add Account Groups"
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
                    <Label htmlFor="formrow-state-Input">Account Groups Code</Label>
                    <Input
                      type="text"
                      name="account_group_code"
                      className={`form-control ${formErrors.account_group_code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Account Groups Code"
                      value={formData?.account_group_code}
                      onChange={handleChange}
                    />
                    {formErrors.account_group_code && (
                      <div className="invalid-feedback">
                        {formErrors.account_group_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="countryDescription">
                    Account Group Description
                  </Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="account_group_desc"
                    className={`form-control ${formErrors.account_group_desc ? "is-invalid" : ""
                      }`}
                    value={formData.account_group_desc}
                    rows="2"
                    placeholder="Please Enter Account Group Description"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        account_group_desc: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        account_group_desc: "", 
                      }));
                    }}
                  />
                  {formErrors.account_group_desc && (
                    <div className="invalid-feedback">
                      {formErrors.account_group_desc}
                    </div>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <div className="">
                    <Label htmlFor="formrow-state-Input">
                      Suffix Code
                    </Label>
                    <Input
                      type="text"
                      name="suffix_code"
                      className={`form-control ${formErrors.suffix_code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Suffix Code"
                      value={formData?.suffix_code}
                      onChange={handleChange}
                    />
                    {formErrors.suffix_code && (
                      <div className="invalid-feedback">
                        {formErrors.suffix_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <Label htmlFor="countryDescription">
                    From Number
                  </Label>
                  <Input
                    type="number"
                    id="countryDescription"
                    name="from_number"
                    className={`form-control ${formErrors.from_number
                      ? "is-invalid"
                      : ""
                      }`}
                    value={formData.from_number}
                    rows="3"
                    placeholder="Please Enter From Number"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        from_number: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        from_number: "", 
                      }));
                    }}
                  />
                  {formErrors.from_number && (
                    <div className="invalid-feedback">
                      {formErrors.from_number}
                    </div>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <div className="">
                    <Label htmlFor="formrow-state-Input">
                      To Number
                    </Label>
                    <Input
                      type="number"
                      name="to_number"
                      className={`form-control ${formErrors.to_number ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter To Number"
                      value={formData?.to_number}
                      onChange={handleChange}
                    />
                    {formErrors.to_number && (
                      <div className="invalid-feedback">
                        {formErrors.to_number}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">
                      Current Number Status
                    </Label>
                    <Input
                      type="number"
                      name="current_number_status"
                      className={`form-control ${formErrors.current_number_status ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Current Number Status"
                      value={formData?.current_number_status}
                      onChange={handleChange}
                    />
                    {formErrors.current_number_status && (
                      <div className="invalid-feedback">
                        {formErrors.current_number_status}
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

export default AccountGroups;
