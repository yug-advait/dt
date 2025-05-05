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
  ADD_PRODUCTHIERARCHY_REQUEST,
  GET_PRODUCTHIERARCHY_REQUEST,
  UPDATE_PRODUCTHIERARCHY_REQUEST,
  DELETE_PRODUCTHIERARCHY_REQUEST,
} from "../../../store/productHierarchy/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
const ProductHierarchy = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { producthierarchy, addproductHierarchy, updateproductHierarchy, listproductHierarchy, deleteproductHierarchy } = useSelector(
    state => state.productHierarchy
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
  const [productHierarchyPermission, setProductHierarchyPermission] = useState();
  const [formData, setFormData] = useState({
    prod_hier1: "",
    prod_hierarchy_description: "",
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
        permission.sub_menu_name === "product_hierarchy"
    );
    setProductHierarchyPermission(
      permissions.find(permission => permission.sub_menu_name === "product_hierarchy")
    );
    dispatch({
      type: GET_PRODUCTHIERARCHY_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listproductHierarchy) {
      setLoading(false)
    }
    if (addproductHierarchy) {
      setToastMessage("Product Hierarchy Added Successfully");
      dispatch({
        type: GET_PRODUCTHIERARCHY_REQUEST,
      });
      setToast(true);
    }
    if (updateproductHierarchy) {
      setToastMessage("Product Hierarchy Updated Successfully");
      dispatch({
        type: GET_PRODUCTHIERARCHY_REQUEST,
      });
      setToast(true);
    }
    if (deleteproductHierarchy) {
      setToastMessage("Product Hierarchy Deleted Successfully");
      dispatch({
        type: GET_PRODUCTHIERARCHY_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Product Hierarchy Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      })
      dispatch({
        type: GET_PRODUCTHIERARCHY_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [listproductHierarchy, addproductHierarchy, updateproductHierarchy, updateCommon, deleteproductHierarchy, toast]);

  const handleClicks = () => {
    setFormData({
      prod_hier1: "",
      prod_hierarchy_description: "",
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
        type: DELETE_PRODUCTHIERARCHY_REQUEST,
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

    if (name === 'prod_hier1' && value.length > 40) {
      newValue = value.slice(0, 40);
      setFormErrors({
        ...formErrors,
        prod_hier1: "Product Hier1 cannot be more than 40 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        prod_hier1: ""
      });
    }

    if (name === 'prod_hierarchy_description' && value.length > 70) {
      newValue = value.slice(0, 70);
      setFormErrors({
        ...formErrors,
        prod_hierarchy_description: "Product Hierarchy Description cannot be more than 70 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        prod_hierarchy_description: ""
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.prod_hier1.trim()) {
      errors.prod_hier1 = "Product Hier1 is required";
    } else if (formData.prod_hier1.trim().length > 40) {
      errors.prod_hier1 = "Product Hier1 cannot be more than 40 characters"
    }
    if (!formData.prod_hierarchy_description.trim()) {
      errors.prod_hierarchy_description = "Product Hierarchy Description is required";
    } else if (formData.prod_hierarchy_description.trim().length > 70) {
      errors.prod_hierarchy_description = "Product Hierarchy Description cannot be more than 70 characters"
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
        const ProductHierarchyData = {
          formData,
          isActive,
          Id,
        };
        dispatch({
          type: UPDATE_PRODUCTHIERARCHY_REQUEST,
          payload: ProductHierarchyData,
        });
      } else {
        const ProductHierarchyData = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_PRODUCTHIERARCHY_REQUEST,
          payload: ProductHierarchyData,
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
      prod_hier1: data?.prod_hier1 || "", 
      prod_hierarchy_description: data?.prod_hierarchy_description || "",
      isactive: data?.isactive || true,
    });
    setIsActive(data?.isactive || true);
    setModal(true);
  };
  

  const resetForm = () => {
    setFormErrors({})
    setErrors({});
    setEdit(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Product Hierarchy",
        accessor: "prod_hier1",
      },
      { 
        Header: "Product Hierarchy Description",
        accessor: "prod_hierarchy_description",
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
                        name: "product_hierarchy",
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
              {productHierarchyPermission && productHierarchyPermission?.can_edit ? (
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
              {productHierarchyPermission && productHierarchyPermission?.can_delete ? (
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
    [status, productHierarchyPermission]
  );

  document.title = "Detergent | Product Hierarchy";
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
          <Breadcrumbs titlePath="#" title="Products" breadcrumbItem="Product Hierarchy" />
          {loading ? (
            <Loader />
          ) : (
          <TableContainer
            columns={columns}
            data={producthierarchy && producthierarchy.length > 0 ? producthierarchy : []}
            isGlobalFilter={true}
            isAddOptions={true}
            customPageSize={10}
            className="custom-header-css"
              addButtonLabel={
                productHierarchyPermission && productHierarchyPermission?.can_add
                  ? "Add Product Hierarchy"
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
                    <Label htmlFor="formrow-state-Input">Product Hierarchy</Label>
                    <Input
                      type="text"
                      name="prod_hier1"
                      className={`form-control ${
                        formErrors.prod_hier1 ? "is-invalid" : ""
                      }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Product Hierarchy"
                      value={formData?.prod_hier1} 
                      onChange={handleChange}
                    />
                    {formErrors.prod_hier1 && (
                      <div className="invalid-feedback">
                        {formErrors.prod_hier1}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="name">Product Hierarchy Description</Label>
                  <Input
                    type="text"
                    id="name"
                    name="prod_hierarchy_description"
                    className={`form-control ${
                      formErrors.prod_hierarchy_description ? "is-invalid" : ""
                    }`}
                    value={formData.prod_hierarchy_description}
                    rows="3"
                    placeholder="Please Enter Product Hierarchy Description"
                    onChange={handleChange}
                  />
                  {formErrors.prod_hierarchy_description && (
                    <div className="invalid-feedback">
                      {formErrors.prod_hierarchy_description}
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

export default ProductHierarchy;
