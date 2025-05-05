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
  ADD_PRDOCTYPE_REQUEST,
  GET_PRDOCTYPE_REQUEST,
  UPDATE_PRDOCTYPE_REQUEST,
  DELETE_PRDOCTYPE_REQUEST,
} from "../../../store/prDocType/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const PrDocType = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { prDocType, addPrDocType, updatePrDocType, listPrDocType, deletePrDocType } =
    useSelector(state => state.prDocType);
  const [loading, setLoading] = useState(true);
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState("");
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [optionItemCategory, setOptionItemCategory] = useState([]);
  const [selectItemCategory, setSelectItemCategory] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isActive, setIsActive] = useState(true);
  const [Edit, setEdit] = useState(null);
  const [prDocTypePermission, setPrDocTypePermission] = useState();
  const [formData, setFormData] = useState({
    pr_doc_type: "",
    pr_doc_type_description: "",
    item_category_id: "",
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
        permission.sub_menu_name === "pr_doc_type"
    );
    setPrDocTypePermission(
      permissions.find(permission => permission.sub_menu_name === "pr_doc_type")
    );
    dispatch({ type: GET_PRDOCTYPE_REQUEST, payload: [] });
  }, [dispatch]);

  useEffect(() => {
    if (listPrDocType) {
      setLoading(false)
    }
    if (addPrDocType) {
      setToastMessage("PR Doc Type Added Successfully");
      dispatch({ type: GET_PRDOCTYPE_REQUEST });
      setToast(true);
    }
    if (updatePrDocType) {
      setToastMessage("PR Doc Type Updated Successfully");
      dispatch({ type: GET_PRDOCTYPE_REQUEST });
      setToast(true);
    }
    if (deletePrDocType) {
      setToastMessage("PR Doc Type Deleted Successfully");
      dispatch({ type: GET_PRDOCTYPE_REQUEST });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("PR Doc Type Status Updated Successfully");
      dispatch({ type: STATUS_REQUEST });
      dispatch({ type: GET_PRDOCTYPE_REQUEST });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addPrDocType, updatePrDocType, deletePrDocType, listPrDocType, updateCommon, dispatch]);

  const handleClicks = () => {
    setSelectItemCategory({});
    setOptionItemCategory(prDocType?.category);
    setFormData({
      pr_doc_type: "",
      pr_doc_type_description: "",
      item_category_id: "",
      isactive: true,
    });
    setModal(true);
  };

  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    dispatch({ type: DELETE_PRDOCTYPE_REQUEST, payload: rowData.id });
    setDeleteModal(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'pr_doc_type' && value.length > 6) {
      newValue = value.slice(0, 6);
      setFormErrors({
        ...formErrors,
        pr_doc_type: "PR Doc Type cannot be more than 6 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        pr_doc_type: ""
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
    if (!formData.pr_doc_type)
      errors.pr_doc_type = "Pr Doc Type is required";
    else if (formData.pr_doc_type.length > 6) {
      errors.pr_doc_type = "PR Doc Type cannot be more than 6 characters"
    }
    if (!formData.pr_doc_type_description)
      errors.pr_doc_type_description = "Pr Doc Type Description is required";
    if (!formData.item_category_id)
      errors.item_category_id = "Item category Id is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveOrEdit = e => {
    e.preventDefault();
    if (!validateForm()) return;

    if (Edit) {
      dispatch({
        type: UPDATE_PRDOCTYPE_REQUEST,
        payload: { formData, isActive, Id: Edit.id },
      });
    } else {
      dispatch({
        type: ADD_PRDOCTYPE_REQUEST,
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
    setSelectItemCategory(data?.category);
    setFormData({
      pr_doc_type: data?.pr_doc_type || "",
      pr_doc_type_description: data?.pr_doc_type_description || "",
      item_category_id: data?.category?.value || "",
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
        Header: "Pr Doc Type",
        accessor: "pr_doc_type",
      },
      {
        Header: "Pr Doc Type Description",
        accessor: "pr_doc_type_description",
      },
      {
        Header: "Item Category Id",
        accessor: "category.label",
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
                    name: "pr_doc_type_master",
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
            {prDocTypePermission && prDocTypePermission?.can_edit ? (
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  openModal(cellProps.row.original);
                  setOptionItemCategory(prDocType?.category);
                }}
              >
                <i className="mdi mdi-pencil-box font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
              </Link>
            ) : null}
            {prDocTypePermission && prDocTypePermission?.can_delete ? (
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
    [prDocType, dispatch, prDocTypePermission]
  );

  document.title = "Detergent | PR Doc Type";
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
            breadcrumbItem="PR Doc Type"
          />
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={
                prDocType.prDocTypes && prDocType.prDocTypes.length > 0
                  ? prDocType.prDocTypes
                  : []
              }
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                prDocTypePermission && prDocTypePermission?.can_add
                  ? "Add Doc Type"
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
                  <Label htmlFor="formrow-state-Input">Pr Doc Type</Label>
                  <Input
                    type="text"
                    name="pr_doc_type"
                    className={`form-control ${formErrors.pr_doc_type ? "is-invalid" : ""
                      }`}
                    id="formrow-state-Input"
                    placeholder="Please Enter Item Category Code"
                    value={formData?.pr_doc_type}
                    onChange={handleChange}
                  />
                  {formErrors.pr_doc_type && (
                    <div className="invalid-feedback">
                      {formErrors.pr_doc_type}
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
                    name="pr_doc_type_description"
                    className={`form-control ${formErrors.pr_doc_type_description ? "is-invalid" : ""
                      }`}
                    value={formData.pr_doc_type_description}
                    rows="3"
                    placeholder="Please Enter Pr Doc Type Description"
                    onChange={e => {
                      autoResizeTextarea(e.target);
                      setFormData(prevData => ({
                        ...prevData,
                        pr_doc_type_description: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        pr_doc_type_description: "",
                      }));
                    }}
                  />
                  {formErrors.pr_doc_type_description && (
                    <div className="invalid-feedback">
                      {formErrors.pr_doc_type_description}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="name">Item Category Id</Label>
                  <Select
                    value={selectItemCategory}
                    onChange={async selectItemCategory => {
                      setFormData(prevData => ({
                        ...prevData,
                        item_category_id: selectItemCategory?.value,
                      }));
                      setSelectItemCategory(selectItemCategory);
                    }}
                    options={optionItemCategory}
                  />
                  {formErrors.item_category_id && (
                    <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                      {formErrors.item_category_id}
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

export default PrDocType;
