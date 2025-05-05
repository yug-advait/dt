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
  ADD_RFQDOCTYPE_REQUEST,
  GET_RFQDOCTYPE_REQUEST,
  UPDATE_RFQDOCTYPE_REQUEST,
  DELETE_RFQDOCTYPE_REQUEST,
} from "../../../store/rfqDocType/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const RFQDocType = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { rfqDocType, addRfqDocType, updateRfqDocType, listRfqDoctype, deleteRfqDocType } =
    useSelector(state => state.rfqDocType);
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState("");
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isActive, setIsActive] = useState(true);
  const [Edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rfqDocTypePermission, setRfqDocTypePermission] = useState();
  const [formData, setFormData] = useState({
    rfq_doc_type: "",
    rfq_doc_type_description: "",
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
        permission.sub_menu_name === "rfq_doc_type"
    );
    setRfqDocTypePermission(
      permissions.find(permission => permission.sub_menu_name === "rfq_doc_type")
    );
    dispatch({ type: GET_RFQDOCTYPE_REQUEST, payload: [] });
  }, [dispatch]);

  useEffect(() => {
    if (listRfqDoctype) {
      setLoading(false)
    }
    if (addRfqDocType) {
      setToastMessage("RFQ Doc Type Added Successfully");
      dispatch({ type: GET_RFQDOCTYPE_REQUEST });
      setToast(true);
    }
    if (updateRfqDocType) {
      setToastMessage("RFQ Doc Type Updated Successfully");
      dispatch({ type: GET_RFQDOCTYPE_REQUEST });
      setToast(true);
    }
    if (deleteRfqDocType) {
      setToastMessage("RFQ Doc Type Deleted Successfully");
      dispatch({ type: GET_RFQDOCTYPE_REQUEST });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("RFQ Doc Type Status Updated Successfully");
      dispatch({ type: STATUS_REQUEST });
      dispatch({ type: GET_RFQDOCTYPE_REQUEST });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addRfqDocType, updateRfqDocType, deleteRfqDocType, listRfqDoctype, updateCommon, dispatch]);

  const handleClicks = () => {
    setFormData({
      rfq_doc_type: "",
      rfq_doc_type_description: "",
      isactive: true,
    });
    setModal(true);
  };

  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    dispatch({ type: DELETE_RFQDOCTYPE_REQUEST, payload: rowData.id });
    setDeleteModal(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'asn_doc_type' && value.length > 6) {
      newValue = value.slice(0, 6);
      setFormErrors({
        ...formErrors,
        asn_doc_type: "RFQ Doc Type cannot be more than 6 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        asn_doc_type: ""
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
    if (!formData.rfq_doc_type)
      errors.rfq_doc_type = "RFQ Doc Type is required";
    else if (formData.rfq_doc_type.length > 6) {
      errors.rfq_doc_type = "RFQ Doc Type cannot be more than 6 characters"
    }
    if (!formData.rfq_doc_type_description)
      errors.rfq_doc_type_description = "RFQ Doc Type Description is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSaveOrEdit = e => {
    e.preventDefault();
    if (!validateForm()) return;

    if (Edit) {
      dispatch({
        type: UPDATE_RFQDOCTYPE_REQUEST,
        payload: { formData, isActive, Id: Edit.id },
      });
    } else {
      dispatch({
        type: ADD_RFQDOCTYPE_REQUEST,
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
      rfq_doc_type: data?.rfq_doc_type || "",
      rfq_doc_type_description: data?.rfq_doc_type_description || "",
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
        Header: "RFQ Doc Type",
        accessor: "rfq_doc_type",
      },
      {
        Header: "RFQ Doc Type Description",
        accessor: "rfq_doc_type_description",
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
                    name: "rfq_doc_type_master",
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
            {rfqDocTypePermission && rfqDocTypePermission?.can_edit ? (
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
            {rfqDocTypePermission && rfqDocTypePermission?.can_delete ? (
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
    [rfqDocType, rfqDocTypePermission, dispatch]
  );

  document.title = "Detergent | RFQ Doc Type";
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
            breadcrumbItem="RFQ Doc Type"
          />
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={
                rfqDocType.rfqDocTypes && rfqDocType.rfqDocTypes.length > 0
                  ? rfqDocType.rfqDocTypes
                  : []
              }
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                rfqDocTypePermission && rfqDocTypePermission?.can_add
                  ? "Add RFQ Doc Type"
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
                  <Label htmlFor="formrow-state-Input">RFQ Doc Type</Label>
                  <Input
                    type="text"
                    name="rfq_doc_type"
                    className={`form-control ${formErrors.rfq_doc_type ? "is-invalid" : ""
                      }`}
                    id="formrow-state-Input"
                    placeholder="Please Enter Item Category Code"
                    value={formData?.rfq_doc_type}
                    onChange={handleChange}
                  />
                  {formErrors.rfq_doc_type && (
                    <div className="invalid-feedback">
                      {formErrors.rfq_doc_type}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="categoryDescription">
                    RFQ Doc Type Description
                  </Label>
                  <Input
                    type="textarea"
                    id="categoryDescription"
                    name="rfq_doc_type_description"
                    className={`form-control ${formErrors.rfq_doc_type_description ? "is-invalid" : ""
                      }`}
                    value={formData.rfq_doc_type_description}
                    rows="3"
                    placeholder="Please Enter RFQ Doc Type Description"
                    onChange={e => {
                      autoResizeTextarea(e.target);
                      setFormData(prevData => ({
                        ...prevData,
                        rfq_doc_type_description: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        rfq_doc_type_description: "",
                      }));
                    }}
                  />
                  {formErrors.rfq_doc_type_description && (
                    <div className="invalid-feedback">
                      {formErrors.rfq_doc_type_description}
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

export default RFQDocType;
