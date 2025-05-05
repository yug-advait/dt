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
  ADD_SALESGROUP_REQUEST,
  GET_SALESGROUP_REQUEST,
  UPDATE_SALESGROUP_REQUEST,
  DELETE_SALESGROUP_REQUEST,
} from "../../../store/salesGroup/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const SalesGroup = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const {
    listSalesGroup,
    salesgroup,
    addSalesGroup,
    updateSalesGroup,
    deleteSalesGroup,
    error,
  } = useSelector(state => state.salesgroup);
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
  const [salesGroupPermission, setsalesGroupPermission] = useState();
  const [formData, setFormData] = useState({
    sales_group_code: "",
    sales_group_description: "",
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
        permission.sub_menu_name === "sales_group"
    );
    setsalesGroupPermission(
      permissions.find(permission => permission.sub_menu_name === "sales_group")
    );
    dispatch({
      type: GET_SALESGROUP_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listSalesGroup) {
      setLoading(false)
    }
    if (addSalesGroup) {
      setToastMessage("Sales Group Added Successfully");
      dispatch({
        type: GET_SALESGROUP_REQUEST,
      });
      setToast(true);
    }
    if (updateSalesGroup) {
      setToastMessage("Sales Group Updated Successfully");
      dispatch({
        type: GET_SALESGROUP_REQUEST,
      });
      setToast(true);
    }
    if (deleteSalesGroup) {
      setToastMessage("Sales Group Deleted Successfully");
      dispatch({
        type: GET_SALESGROUP_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Sales Group Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_SALESGROUP_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    listSalesGroup,
    addSalesGroup,
    updateSalesGroup,
    updateCommon,
    deleteSalesGroup,
    toast,
  ]);

  const handleClicks = () => {
    setFormData({
      sales_group_code: "",
      sales_group_description: "",
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
        type: DELETE_SALESGROUP_REQUEST,
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

    // SALES GROUP CODE
    if (name === 'sales_group_code' && value.length > 7) {
      newValue = value.slice(0, 7);
      setFormErrors({
        ...formErrors,
        sales_group_code: "Sales Group Code cannot be more than 7 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        sales_group_code: ""
      });
    }

    // SALES GROUP DESCRIPTION
    if (name === 'sales_group_description' && value.length > 100) {
      newValue = value.slice(0, 100);
      setFormErrors({
        ...formErrors,
        sales_group_description: "Sales Group Description cannot be more than 100 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        sales_group_description: ""
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.sales_group_code.trim()) {
      errors.sales_group_code = "Sales Group Code is required";
    } else if (formData.sales_group_code.length > 7) {
      errors.sales_group_code = "Sales Group Code cannot be more than 7 characters"
    }
    if (!formData.sales_group_description.trim()) {
      errors.sales_group_description = "Sales Group Description is required";
    }else if (formData.sales_group_description.length > 100) {
      errors.sales_group_description = "Sales Group Description cannot be more than 100 characters"
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
          type: UPDATE_SALESGROUP_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_SALESGROUP_REQUEST,
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
    setFormData({
      sales_group_code: data?.sales_group_code,
      sales_group_description: data?.sales_group_description,
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
        Header: "Sales Group Code",
        accessor: "sales_group_code",
      },
      {
        Header: "Sales Group Description",
        accessor: "sales_group_description",
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
                        name: "sales_group",
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
              {salesGroupPermission && salesGroupPermission?.can_edit ? (
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
              {salesGroupPermission && salesGroupPermission?.can_delete ? (
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
    [status, salesGroupPermission]
  );

  document.title = "Detergent | Sales Groups";
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
          <Breadcrumbs titlePath="#" title="Customers" breadcrumbItem="Sales Group" />

          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={salesgroup && salesgroup.length > 0 ? salesgroup : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                salesGroupPermission && salesGroupPermission?.can_add
                  ? "Add Sales Group"
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
                    <Label htmlFor="formrow-state-Input">Sales Group Code </Label>
                    <Input
                      type="text"
                      name="sales_group_code"
                      className={`form-control ${formErrors.sales_group_code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Sales Groups Code"
                      value={formData?.sales_group_code}
                      onChange={handleChange}
                    />
                    {formErrors.sales_group_code && (
                      <div className="invalid-feedback">
                        {formErrors.sales_group_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="countryDescription">
                    Sales Group Description
                  </Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="sales_group_description"
                    className={`form-control ${formErrors.sales_group_description ? "is-invalid" : ""
                      }`}
                    value={formData.sales_group_description}
                    rows="3"
                    placeholder="Please Enter Sales Group Description"
                    onChange={handleChange}
                  />
                  {formErrors.sales_group_description && (
                    <div className="invalid-feedback">
                      {formErrors.sales_group_description}
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

export default SalesGroup;
