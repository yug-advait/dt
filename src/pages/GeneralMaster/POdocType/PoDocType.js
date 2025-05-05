import React, { useEffect, useState, useMemo } from "react";
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
import moment from "moment";
import {
  ADD_PODOCTYPE_REQUEST,
  GET_PODOCTYPE_REQUEST,
  UPDATE_PODOCTYPE_REQUEST,
  DELETE_PODOCTYPE_REQUEST,
} from "../../../store/poDocType/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const PoDocType = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { poDocType, addPoDocType, updatePoDocType, listPoDocType, deletePoDocType } =
    useSelector(state => state.poDocType);
  const [loading, setLoading] = useState(true);
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState("");
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isActive, setIsActive] = useState(true);
  const [Edit, setEdit] = useState(null);
  const [poDocTypePermission, setPoDocTypePermission] = useState();
  const [formData, setFormData] = useState({
    po_doc_type: "",
    po_doc_type_description: "",
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
        permission.sub_menu_name === "po_doc_type"
    );
    setPoDocTypePermission(
      permissions.find(permission => permission.sub_menu_name === "po_doc_type")
    );
    dispatch({ type: GET_PODOCTYPE_REQUEST, payload: [] });
  }, [dispatch]);

  useEffect(() => {
    if (listPoDocType) {
      setLoading(false)
    }
    if (addPoDocType) {
      setToastMessage("PO Doc Type Added Successfully");
      dispatch({ type: GET_PODOCTYPE_REQUEST });
      setToast(true);
    }
    if (updatePoDocType) {
      setToastMessage("PO Doc Type Updated Successfully");
      dispatch({ type: GET_PODOCTYPE_REQUEST });
      setToast(true);
    }
    if (deletePoDocType) {
      setToastMessage("PO Doc Type Deleted Successfully");
      dispatch({ type: GET_PODOCTYPE_REQUEST });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("PO Doc Type Status Updated Successfully");
      dispatch({ type: STATUS_REQUEST });
      dispatch({ type: GET_PODOCTYPE_REQUEST });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addPoDocType, updatePoDocType, deletePoDocType, listPoDocType, updateCommon, dispatch]);

  const handleClicks = () => {
    setFormData({
      po_doc_type: "",
      po_doc_type_description: "",
      isactive: true,
    });
    setModal(true);
  };

  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    dispatch({ type: DELETE_PODOCTYPE_REQUEST, payload: rowData.id });
    setDeleteModal(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'po_doc_type' && value.length > 6) {
      newValue = value.slice(0, 6);
      setFormErrors({
        ...formErrors,
        po_doc_type: "PO Doc Type cannot be more than 6 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        po_doc_type: ""
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const autoResizeTextarea = textarea => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.po_doc_type)
      errors.po_doc_type = "PO Doc Type is required";
    else if (formData.po_doc_type.length > 6) {
      errors.po_doc_type = "PO Doc Type cannot be more than 6 characters"
    }
    if (!formData.po_doc_type_description)
      errors.po_doc_type_description = "PO Doc Type Description is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveOrEdit = e => {
    e.preventDefault();
    if (!validateForm()) return;

    if (Edit) {
      dispatch({
        type: UPDATE_PODOCTYPE_REQUEST,
        payload: { formData, isActive, Id: Edit.id },
      });
    } else {
      dispatch({
        type: ADD_PODOCTYPE_REQUEST,
        payload: { formData, isActive },
      });
    }
    setModal(false);
    setEdit(null);
    resetForm();
  };

  const openModal = (data = null) => {
    setEdit(data);
    setRowData(data);
    setFormData({
      po_doc_type: data?.po_doc_type || "",
      po_doc_type_description: data?.po_doc_type_description || "",
      isactive: data?.isactive,
    });
    setModal(true);
    if (data) setIsActive(data.isactive);
  };

  const resetForm = () => {
    setFormErrors({})
    setErrors({});
    setEdit(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Po Doc Type",
        accessor: "po_doc_type",
      },
      {
        Header: "Po Doc Type Description",
        accessor: "po_doc_type_description",
      },
      {
        Header: "Created On",
        accessor: "createdon",
        Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
      },
      {
        Header: "Status",
        accessor: "isactive",
        Cell: cellProps => (
          <div className="form-check form-switch mb-3" dir="ltr">
            <input
              type="checkbox"
              className="form-check-input"
              checked={cellProps.row.original.isactive}
              onClick={() => {
                dispatch({
                  type: STATUS_REQUEST,
                  payload: {
                    name: "po_doc_type_master",
                    isactive: !cellProps.row.original.isactive,
                    id: cellProps.row.original?.id,
                  },
                });
              }}
            />
          </div>
        ),
      },
      {
        Header: "Actions",
        accessor: "action",
        disableFilters: true,
        Cell: cellProps => (
          <div className="d-flex gap-3">
            {poDocTypePermission && poDocTypePermission?.can_edit ? (
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  openModal(cellProps.row.original);
                }}
              >
                <i className="mdi mdi-pencil-box font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
              </Link>
            ) : null}

            {poDocTypePermission && poDocTypePermission?.can_delete ? (
              <Link
                to="#"
                className="text-danger"
                onClick={() => onClickDelete(cellProps.row.original)}
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>
            ) : null}
          </div>
        ),
      },
    ],
    [poDocType, dispatch, poDocTypePermission]
  );

  document.title = "Detergent | PO Doc Type";
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
          <Breadcrumbs
            titlePath="#"
            title="Master"
            breadcrumbItem="PO Doc Type"
          />

          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={
                poDocType.poDocTypes && poDocType.poDocTypes.length > 0
                  ? poDocType.poDocTypes
                  : []
              }
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                poDocTypePermission && poDocTypePermission?.can_add
                  ? "Add PO Doc Type"
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
                  <Label htmlFor="formrow-state-Input">Po Doc Type</Label>
                  <Input
                    type="text"
                    name="po_doc_type"
                    className={`form-control ${formErrors.po_doc_type ? "is-invalid" : ""
                      }`}
                    id="formrow-state-Input"
                    placeholder="Please Enter Item Category Code"
                    value={formData?.po_doc_type}
                    onChange={handleChange}
                  />
                  {formErrors.po_doc_type && (
                    <div className="invalid-feedback">
                      {formErrors.po_doc_type}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="categoryDescription">
                    Item Category Description
                  </Label>
                  <Input
                    type="textarea"
                    id="categoryDescription"
                    name="po_doc_type_description"
                    className={`form-control ${formErrors.po_doc_type_description ? "is-invalid" : ""
                      }`}
                    value={formData.po_doc_type_description}
                    rows="3"
                    placeholder="Please Enter Pr Doc Type Description"
                    onChange={e => {
                      autoResizeTextarea(e.target);
                      setFormData(prevData => ({
                        ...prevData,
                        po_doc_type_description: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        po_doc_type_description: "",
                      }));
                    }}
                  />
                  {formErrors.po_doc_type_description && (
                    <div className="invalid-feedback">
                      {formErrors.po_doc_type_description}
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

export default PoDocType;
