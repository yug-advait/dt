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
import moment from "moment";
import {
  ADD_PRITEM_REQUEST,
  GET_PRITEM_REQUEST,
  UPDATE_PRITEM_REQUEST,
  DELETE_PRITEM_REQUEST,
} from "../../../store/prItem/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const PrItem = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { prItems, addPrItem, updatePrItem, listPrItem, deletePrItem, error } = useSelector(
    state => state.prItem
  );
  const [loading, setLoading] = useState(true);
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
  const [prItemPermission, setPrItemPermission] = useState();
  const [formData, setFormData] = useState({
    item_category_code: "",
    item_category_description: "",
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
        permission.sub_menu_name === "pr_item_category"
    );
    setPrItemPermission(
      permissions.find(permission => permission.sub_menu_name === "pr_item_category")
    );
    dispatch({
      type: GET_PRITEM_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listPrItem) {
      setLoading(false)
    }
    if (addPrItem) {
      setToastMessage("PR Item Added Successfully");
      dispatch({
        type: GET_PRITEM_REQUEST,
      });
      setToast(true);
    }
    if (updatePrItem) {
      setToastMessage("PR Item Updated Successfully");
      dispatch({
        type: GET_PRITEM_REQUEST,
      });
      setToast(true);
    }
    if (deletePrItem) {
      setToastMessage("PR Item Deleted Successfully");
      dispatch({
        type: GET_PRITEM_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("PR Item Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_PRITEM_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addPrItem, updatePrItem, updateCommon, listPrItem, deletePrItem, toast]);

  const handleClicks = async () => {
    setFormData({
      item_category_code: "",
      item_category_description: "",
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
        type: DELETE_PRITEM_REQUEST,
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

    if (name === 'item_category_code') {
      if (value.length > 1) {
        newValue = value.slice(0, 1);
        setFormErrors({
          ...formErrors,
          item_category_code: "Item Category Code cannot be more than 1 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          item_category_code: ""
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
    if (!formData.item_category_code) {
      errors.item_category_code = "Item Category Code is required";
    } else if (formData.item_category_code.length > 1) {
      errors.item_category_code = "Item Category Code cannot be more than 1 characters"
    }
    if (!formData.item_category_description) {
      errors.item_category_description = "Item Category Description is required";
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
          type: UPDATE_PRITEM_REQUEST,
          payload: StateData,
        });
      } else {
        const StateData = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_PRITEM_REQUEST,
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
      item_category_code: data?.item_category_code || "",
      item_category_description: data?.item_category_description || "",
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
        Header: "Item Category Code",
        accessor: "item_category_code",
      },
      {
        Header: "Item Category Description",
        accessor: "item_category_description",
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
                        name: "pr_item_categories",
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
              {prItemPermission && prItemPermission?.can_edit ? (
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

              {prItemPermission && prItemPermission?.can_delete ? (
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
    [status, prItemPermission]
  );

  document.title = "Detergent | PR Item";
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
          <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="PR Item Category" />

          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={prItems && prItems.length > 0 ? prItems : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                prItemPermission && prItemPermission?.can_add
                  ? "Add PR Item Category"
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
                    <Label htmlFor="formrow-state-Input">Item Category Code</Label>
                    <Input
                      type="text"
                      name="item_category_code"
                      className={`form-control ${formErrors.item_category_code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Item Category Code"
                      value={formData?.item_category_code}
                      onChange={handleChange}
                    />
                    {formErrors.item_category_code && (
                      <div className="invalid-feedback">
                        {formErrors.item_category_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="categorydescription">Item Category Description</Label>
                  <Input
                    type="textarea"
                    id="categorydescription"
                    name="item_category_description"
                    className={`form-control ${formErrors.item_category_description ? "is-invalid" : ""
                      }`}
                    value={formData.item_category_description}
                    rows="3"
                    placeholder="Please Enter Item Category Description"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        item_category_description: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        item_category_description: "",
                      }));
                    }}
                  />
                  {formErrors.item_category_description && (
                    <div className="invalid-feedback">
                      {formErrors.item_category_description}
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

export default PrItem;
