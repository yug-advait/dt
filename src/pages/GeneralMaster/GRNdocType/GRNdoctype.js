import React, { useEffect, useState, useMemo} from "react";
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
  ADD_GRNDOCTYPE_REQUEST,
  GET_GRNDOCTYPE_REQUEST,
  UPDATE_GRNDOCTYPE_REQUEST,
  DELETE_GRNDOCTYPE_REQUEST,
} from "../../../store/grnDocType/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const GRNdocType = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { listGrnDoctype, grnDocType, addGrnDocType, updateGrnDocType, deleteGrnDocType } =
    useSelector(state => state.grnDocType);
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
  const [optionAsnDocType, setoptionAsnDocType] = useState([]);
  const [grnDocTypePermission, setGrnDocTypePermission] = useState();
  const [formData, setFormData] = useState({});
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
        permission.sub_menu_name === "grn_doc_type"
    );
    setGrnDocTypePermission(
      permissions.find(permission => permission.sub_menu_name === "grn_doc_type")
    );
    dispatch({ type: GET_GRNDOCTYPE_REQUEST, payload: [] });
  }, [dispatch]);

  useEffect(() => {
    if (listGrnDoctype) {
      setLoading(false)
    }

    if (listGrnDoctype) {
      setoptionAsnDocType(grnDocType?.asn_doc_type);

    }
    if (addGrnDocType) {
      setToastMessage("GRN Doc Type Added Successfully");
      dispatch({ type: GET_GRNDOCTYPE_REQUEST });
      setToast(true);
    }
    if (updateGrnDocType) {
      setToastMessage("GRN Doc Type Updated Successfully");
      dispatch({ type: GET_GRNDOCTYPE_REQUEST });
      setToast(true);
    }
    if (deleteGrnDocType) {
      setToastMessage("GRN Doc Type Deleted Successfully");
      dispatch({ type: GET_GRNDOCTYPE_REQUEST });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("GRN Doc Type Status Updated Successfully");
      dispatch({ type: STATUS_REQUEST });
      dispatch({ type: GET_GRNDOCTYPE_REQUEST });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addGrnDocType, updateGrnDocType, listGrnDoctype, deleteGrnDocType, updateCommon, dispatch]);

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
    dispatch({ type: DELETE_GRNDOCTYPE_REQUEST, payload: rowData.id });
    setDeleteModal(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'grn_doc_type' && value.length > 4) {
      newValue = value.slice(0, 4);
      setFormErrors({
        ...formErrors,
        grn_doc_type: "GRN Doc Type cannot be more than 4 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        grn_doc_type: ""
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.grn_doc_type)
      errors.grn_doc_type = "GRN Doc Type is required";
    else if (formData.grn_doc_type.length > 4) {
      errors.grn_doc_type = "GRN Doc Type cannot be more than 4 characters"
    }
    if (!formData.link_asn_type_id)
      errors.link_asn_type_id = "Link ASN Type is required";
    if (!formData.grn_doctype_description)
      errors.grn_doctype_description = "GRN Doc Type Description is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSaveOrEdit = e => {
    e.preventDefault();
    if (!validateForm()) return;

    if (Edit) {
      dispatch({
        type: UPDATE_GRNDOCTYPE_REQUEST,
        payload: { formData, isActive, Id: Edit.id },
      });
    } else {
      dispatch({
        type: ADD_GRNDOCTYPE_REQUEST,
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
      grn_doc_type: data?.grn_doc_type || "",
      link_asn_type_id: data?.asn_doc_type_link.value || "",
      grn_doctype_description: data?.grn_doctype_description || "",
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
        Header: "GRN Doc Type",
        accessor: "grn_doc_type",
      },
      {
        Header: "GRN Doc Type Description",
        accessor: "grn_doctype_description",
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
                    name: "grn_doc_type_master",
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
            {grnDocTypePermission && grnDocTypePermission?.can_edit ? (
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
            {grnDocTypePermission && grnDocTypePermission?.can_delete ? (
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
    [grnDocTypePermission, dispatch]
  );

  document.title = "Detergent | GRN Doc Type";
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
            breadcrumbItem="GRN Doc Type"
          />
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={
                grnDocType?.grnDocTypes && grnDocType?.grnDocTypes.length > 0
                  ? grnDocType?.grnDocTypes
                  : []
              }
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                grnDocTypePermission && grnDocTypePermission?.can_add
                  ? "Add GRN Doc Type"
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
                  <Label htmlFor="formrow-state-Input">GRN Document Type</Label>
                  <Input
                    type="text"
                    name="grn_doc_type"
                    className={`form-control ${formErrors.grn_doc_type ? "is-invalid" : ""
                      }`}
                    id="formrow-state-Input"
                    placeholder="Please Enter GRN Document Type"
                    value={formData?.grn_doc_type}
                    onChange={handleChange}
                  />
                  {formErrors.grn_doc_type && (
                    <div className="invalid-feedback">
                      {formErrors.grn_doc_type}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Link to ASN Type</Label>
                    <Select
                      value={optionAsnDocType?.find(option => option?.value === formData?.link_asn_type_id)}
                      onChange={selectedOption => {
                        setFormData(prevData => ({
                          ...prevData,
                          link_asn_type_id: selectedOption?.value,
                        }));
                      }}
                      options={optionAsnDocType}
                    />
                    {formErrors.link_asn_type_id && (
                      <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                        {formErrors.link_asn_type_id}
                      </div>
                    )}

                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">GRN Doctype Description</Label>
                    <Input
                      type="textarea"
                      name="grn_doctype_description"
                      className={`form-control ${formErrors.grn_doctype_description ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Description"
                      value={formData?.grn_doctype_description}
                      onChange={handleChange}
                    />
                    {formErrors.grn_doctype_description && (
                      <div className="invalid-feedback">
                        {formErrors.grn_doctype_description}
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

export default GRNdocType;
