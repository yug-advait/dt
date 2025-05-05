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
  ADD_PRODUCTGROUPS_REQUEST,
  GET_PRODUCTGROUPS_REQUEST,
  UPDATE_PRODUCTGROUPS_REQUEST,
  DELETE_PRODUCTGROUPS_REQUEST,
} from "../../../store/productGroups/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
const Groups = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { productgroups, addproductGroups, updateproductGroups, deleteproductGroups, listproductGroups } = useSelector(
    state => state.productGroups
  );
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [rowData, setRowData] = useState("")
  const [toastMessage, setToastMessage] = useState()
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [productGroupsPermission, setproductGroupsPermission] = useState();
  const [formData, setFormData] = useState({
    division_code: "",
    division_name: "",
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
        permission.sub_menu_name === "product_groups"
    );
    setproductGroupsPermission(
      permissions.find(permission => permission.sub_menu_name === "product_groups")
    );
    dispatch({
      type: GET_PRODUCTGROUPS_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listproductGroups) {
      setLoading(false)
    }
    if (addproductGroups) {
      setToastMessage("Product Groups Added Successfully");
      dispatch({
        type: GET_PRODUCTGROUPS_REQUEST,
      });
      setToast(true);
    }
    if (updateproductGroups) {
      setToastMessage("Product Groups Updated Successfully");
      dispatch({
        type: GET_PRODUCTGROUPS_REQUEST,
      });
      setToast(true);
    }
    if (deleteproductGroups) {
      setToastMessage("Product Groups Deleted Successfully");
      dispatch({
        type: GET_PRODUCTGROUPS_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Product Groups Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      })
      dispatch({
        type: GET_PRODUCTGROUPS_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addproductGroups, updateproductGroups, updateCommon, listproductGroups, deleteproductGroups, toast]);

  const handleClicks = () => {
    setFormData({
      division_code: "",
      division_name: "",
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
        type: DELETE_PRODUCTGROUPS_REQUEST,
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

    if (name === 'division_code' && value.length > 2) {
      newValue = value.slice(0, 2);
      setFormErrors({
        ...formErrors,
        division_code: "Product Groups Code cannot be more than 2 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        division_code: ""
      });
    }

    if (name === 'division_name' && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        division_name: "Product Groups Name cannot be more than 50 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        division_name: ""
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.division_code){
      errors.division_code = "Product Groups Code is required";
    } else if (formData.division_code.length > 2){
      errors.division_code = "Product Groups Code cannot be more than 2 characters";}
    if (!formData.division_name.trim()){
      errors.division_name = "Product Groups Name is required";
    } else if (formData.division_name.trim().length > 50) {
      errors.division_name = "Product Groups Name cannot be more than 50 characters"
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
          type: UPDATE_PRODUCTGROUPS_REQUEST,
          payload: StateData,
        });
      } else {
        const StateData = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_PRODUCTGROUPS_REQUEST,
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
      division_code: data?.division_code,
      division_name: data?.division_name,
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
        Header: "Product Group Code",
        accessor: "division_code",
      },
      {
        Header: "Product Group Name",
        accessor: "division_name",
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
                        name: "product_grouping_division",
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
              {productGroupsPermission && productGroupsPermission?.can_edit ? (
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
              {productGroupsPermission && productGroupsPermission?.can_delete ? (
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
    [status, productGroupsPermission]
  );

  document.title = "Detergent | Product Groups";
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
          <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="Product Groups" />
          {loading ? (
            <Loader />
          ) : (
          <TableContainer
            columns={columns}
            data={productgroups && productgroups.length > 0 ? productgroups : []}
            isGlobalFilter={true}
            isAddOptions={true}
            customPageSize={10}
            className="custom-header-css"
              addButtonLabel={
                productGroupsPermission && productGroupsPermission?.can_add
                  ? "Add Product Groups"
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
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Product Groups Code</Label>
                    <Input
                      type="text"
                      name="division_code"
                      className={`form-control ${formErrors.division_code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Product Groups Code"
                      value={formData?.division_code}
                      onChange={handleChange}
                    />
                    {formErrors.division_code && (
                      <div className="invalid-feedback">
                        {formErrors.division_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="name">Product Groups Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="division_name"
                    className={`form-control ${formErrors.division_name ? "is-invalid" : ""
                      }`}
                    value={formData.division_name}
                    rows="3"
                    placeholder="Please Enter Product Groups Name"
                    onChange={handleChange}
                  />
                  {formErrors.division_name && (
                    <div className="invalid-feedback">
                      {formErrors.division_name}
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

export default Groups;
