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
import Select from "react-select"
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import moment from "moment";
import {
  ADD_ASNDOCTYPE_REQUEST,
  GET_ASNDOCTYPE_REQUEST,
  UPDATE_ASNDOCTYPE_REQUEST,
  DELETE_ASNDOCTYPE_REQUEST,
} from "../../../store/asnDocType/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const ASNdocType = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { listAsnDoctype, asnDocType, addAsnDocType, updateAsnDocType, deleteAsnDocType } =
    useSelector(state => state.asnDocType);
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
  const [optionPoDocTypeDesc, setOptionPoDocTypeDesc] = useState([]);
  const [optionPoDocType, setOptionPoDocType] = useState([]);
  const [formData, setFormData] = useState({});
  const [asnDocTypePermission, setAsnDocTypePermission] = useState();

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
        permission.sub_menu_name === "asn_doc_type"
    );
    setAsnDocTypePermission(
      permissions.find(permission => permission.sub_menu_name === "asn_doc_type")
    );
    dispatch({ type: GET_ASNDOCTYPE_REQUEST, payload: [] });
  }, [dispatch]);

  useEffect(() => {
    if (listAsnDoctype) {
      setLoading(false)
      setOptionPoDocType(asnDocType?.po_doc_type);
      setOptionPoDocTypeDesc(asnDocType?.po_doc_type_description)
    }
    if (addAsnDocType) {
      setToastMessage("ASN Doc Type Added Successfully");
      dispatch({ type: GET_ASNDOCTYPE_REQUEST });
      setToast(true);
    }
    if (updateAsnDocType) {
      setToastMessage("ASN Doc Type Updated Successfully");
      dispatch({ type: GET_ASNDOCTYPE_REQUEST });
      setToast(true);
    }
    if (deleteAsnDocType) {
      setToastMessage("ASN Doc Type Deleted Successfully");
      dispatch({ type: GET_ASNDOCTYPE_REQUEST });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("ASN Doc Type Status Updated Successfully");
      dispatch({ type: STATUS_REQUEST });
      dispatch({ type: GET_ASNDOCTYPE_REQUEST });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addAsnDocType, updateAsnDocType, listAsnDoctype, deleteAsnDocType, updateCommon, dispatch]);

  const handleClicks = async () => {
    setFormData({
      isactive: true,
    });
    setModal(true);
  };

  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    dispatch({ type: DELETE_ASNDOCTYPE_REQUEST, payload: rowData.id });
    setDeleteModal(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'asn_doc_type' && value.length > 6) {
      newValue = value.slice(0, 6);
      setFormErrors({
        ...formErrors,
        asn_doc_type: "ASN Doc Type cannot be more than 6 characters"
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

  const validateForm = () => {
    const errors = {};
    if (!formData.asn_doc_type)
      errors.asn_doc_type = "ASN Doc Type is required";
    else if (formData.asn_doc_type.length > 6) {
      errors.asn_doc_type = "ASN Doc Type cannot be more than 6 characters"
    }
    if (!formData.po_doc_type_id)
      errors.po_doc_type_id = "Po Doc Type is required";
    if (!formData.po_doc_type_description)
      errors.po_doc_type_description = "Po Doc Type Description is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSaveOrEdit = e => {
    e.preventDefault();
    if (!validateForm()) return;

    if (Edit) {
      dispatch({
        type: UPDATE_ASNDOCTYPE_REQUEST,
        payload: { formData, isActive, Id: Edit.id },
      });
    } else {
      dispatch({
        type: ADD_ASNDOCTYPE_REQUEST,
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
      asn_doc_type: data?.asn_doc_type || "",
      po_doc_type_id: data?.po_doc_type.value || "",
      po_doc_type_description: data?.po_doc_type_description.value || "",
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
        Header: "ASN Doc Type",
        accessor: "asn_doc_type",
      },
      {
        Header: "Po Doc Type Description",
        accessor: "po_doc_type_description.label",
      },
      {
        Header: "PO Doc Type",
        accessor: "po_doc_type.label",
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
                    name: "asn_doc_type_master",
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
            {asnDocTypePermission && asnDocTypePermission?.can_edit ? (
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

          {asnDocTypePermission && asnDocTypePermission?.can_delete ? (
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
    [dispatch, asnDocTypePermission]
  );

  document.title = "Detergent | ASN Doc Type";
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
            breadcrumbItem="ASN Doc Type"
          />
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={
                asnDocType?.asnDocTypes && asnDocType?.asnDocTypes.length > 0
                  ? asnDocType?.asnDocTypes
                  : []
              }
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                asnDocTypePermission && asnDocTypePermission?.can_add
                  ? "Add ASN Doc Type"
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
                  <Label htmlFor="formrow-state-Input">ASN Doc Type</Label>
                  <Input
                    type="text"
                    name="asn_doc_type"
                    className={`form-control ${formErrors.asn_doc_type ? "is-invalid" : ""
                      }`}
                    id="formrow-state-Input"
                    placeholder="Please Enter Item Category Code"
                    value={formData?.asn_doc_type}
                    onChange={handleChange}
                  />
                  {formErrors.asn_doc_type && (
                    <div className="invalid-feedback">
                      {formErrors.asn_doc_type}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">PO Doc Type</Label>
                    <Select
                      value={optionPoDocType?.find(option => option?.value === formData?.po_doc_type_id)}
                      onChange={selectedOption => {
                        setFormData(prevData => ({
                          ...prevData,
                          po_doc_type_id: selectedOption?.value,
                        }));
                      }}
                      options={optionPoDocType}
                    />
                    {formErrors.po_doc_type_id && (
                      <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                        {formErrors.po_doc_type_id}
                      </div>
                    )}

                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">PO Doc Type Description</Label>
                    <Select
                      value={optionPoDocTypeDesc?.find(option => option?.value === formData?.po_doc_type_description)}
                      onChange={selectedOption => {
                        setFormData(prevData => ({
                          ...prevData,
                          po_doc_type_description: selectedOption?.value,
                        }));
                      }}
                      options={optionPoDocTypeDesc}
                    />
                    {formErrors.po_doc_type_description && (
                      <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                        {formErrors.po_doc_type_description}
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

export default ASNdocType;
