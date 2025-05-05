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
  ADD_MATERIALTYPE_REQUEST,
  GET_MATERIALTYPE_REQUEST,
  UPDATE_MATERIALTYPE_REQUEST,
  DELETE_MATERIALTYPE_REQUEST,
} from "../../../store/materialType/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
import moment from "moment";
const MaterialType = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { materialtype, addmaterialType, updatematerialType, deletematerialType, listmaterialType } = useSelector(
    state => state.materialType
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
  const [materialTypePermission, setMaterialTypePermission] = useState();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    material_type: "",
    material_type_description: "",
    from_number: "",
    to_number: "",
    status: "",
    prefix: "",
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
        permission.sub_menu_name === "material_types"
    );
    setMaterialTypePermission(
      permissions.find(permission => permission.sub_menu_name === "material_types")
    );
    dispatch({
      type: GET_MATERIALTYPE_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listmaterialType) {
      setLoading(false)
    }
    if (addmaterialType) {
      setToastMessage("Material Type Added Successfully");
      dispatch({
        type: GET_MATERIALTYPE_REQUEST,
      });
      setToast(true);
    }
    if (updatematerialType) {
      setToastMessage("Material Type Updated Successfully");
      dispatch({
        type: GET_MATERIALTYPE_REQUEST,
      });
      setToast(true);
    }
    if (deletematerialType) {
      setToastMessage("Material Type Deleted Successfully");
      dispatch({
        type: GET_MATERIALTYPE_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Material Type Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      })
      dispatch({
        type: GET_MATERIALTYPE_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addmaterialType, updatematerialType, updateCommon, deletematerialType, listmaterialType, toast]);

  const handleClicks = () => {
    setFormData({
      material_type: "",
      material_type_description: "",
      from_number: "",
      to_number: "",
      status: "",
      prefix: "",
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
        type: DELETE_MATERIALTYPE_REQUEST,
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

    if (name === 'material_type' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        material_type: "Material Type cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        material_type: ""
      });
    }
    if (name === 'material_type_description' && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        material_type_description: "Material Type Description cannot be more than 50 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        material_type_description: ""
      });
    }
    if (name === 'from_number' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        from_number: "From number cannot be more than 10 characters"
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
        to_number: "To number cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        to_number: ""
      });
    }
    if (name === 'status' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        status: "Status cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        status: ""
      });
    }
    if (name === 'prefix' && value.length > 5) {
      newValue = value.slice(0, 5);
      setFormErrors({
        ...formErrors,
        prefix: "Prefix cannot be more than 5 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        prefix: ""
      });
    }
    setFormData({
      ...formData,
      [name]: value.toString(),
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.material_type.trim())
      errors.material_type = "Material Type is required";
    else if (formData.material_type.length > 10)
      errors.material_type = "Material Type cannot be more than 10 characters";

    if (!formData.material_type_description.trim())
      errors.material_type_description = "Material Type Description is required";
    else if (formData.material_type_description.length > 50)
      errors.material_type_description = "Material Type Description cannot be more than 50 characters";

    if (!formData.from_number)
      errors.from_number = "From number is required";
    else if (formData.from_number.length > 10)
      errors.from_number = "From number cannot be more than 10 characters";

    if (!formData.to_number)
      errors.to_number = "To Number is required";
    else if (formData.to_number.length > 10)
      errors.to_number = "To number cannot be more than 10 characters";

    if (Number(formData.to_number) <= Number(formData.from_number))
      errors.to_number = "To Number must be greater than From Number";

    if (!formData.status)
      errors.status = "Status is required";
    else if (formData.status.length > 10)
      errors.status = "Status cannot be more than 10 characters";

    if (!formData.prefix)
      errors.prefix = "Prefix is required";
    else if (formData.prefix.length > 5)
      errors.prefix = "Prefix cannot be more than 5 characters";

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
          type: UPDATE_MATERIALTYPE_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_MATERIALTYPE_REQUEST,
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
    setEdit(data)
    setRowData(data)
    setFormData({
      material_type: data?.material_type || "",
      material_type_description: data?.material_type_description || "",
      from_number: data?.from_number || "",
      to_number: data?.to_number || "",
      status: data?.status || "",
      prefix: data?.prefix || "",
      isactive: data?.isactive || true,
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
        Header: "Material Type",
        accessor: "material_type",
      },
      {
        Header: "Material Type Description",
        accessor: "material_type_description",
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
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Prefix",
        accessor: "prefix",
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
                        name: "material_type",
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
              {materialTypePermission && materialTypePermission?.can_edit ? (
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
              {materialTypePermission && materialTypePermission?.can_delete ? (
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
    [status, materialTypePermission]
  );

  document.title = "Detergent | Material Type";
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
          <Breadcrumbs titlePath="#" title="Products" breadcrumbItem="Material Type" />
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={materialtype && materialtype.length > 0 ? materialtype : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                materialTypePermission && materialTypePermission?.can_add
                  ? "Add Material Type"
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
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Material Type</Label>
                    <Input
                      type="text"
                      name="material_type"
                      className={`form-control ${formErrors.material_type ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter Material Type"
                      value={formData?.material_type}
                      onChange={handleChange}
                    />
                    {formErrors.material_type && (
                      <div className="invalid-feedback">
                        {formErrors.material_type}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <Label htmlFor="name">Material Type Description</Label>
                  <Input
                    type="textarea"
                    id="name"
                    name="material_type_description"
                    className={`form-control ${formErrors.material_type_description ? "is-invalid" : ""
                      }`}
                    value={formData.material_type_description}
                    rows="2"
                    placeholder="Enter Material Type Description"
                    onChange={handleChange}
                  />
                  {formErrors.material_type_description && (
                    <div className="invalid-feedback">
                      {formErrors.material_type_description}
                    </div>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">From Number</Label>
                    <Input
                      type="number"
                      name="from_number"
                      className={`form-control ${formErrors.from_number ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter From Number"
                      value={formData?.from_number}
                      onChange={handleChange}
                    />
                    {formErrors.from_number && (
                      <div className="invalid-feedback">
                        {formErrors.from_number}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">To Number</Label>
                    <Input
                      type="number"
                      name="to_number"
                      className={`form-control ${formErrors.to_number ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter To Number"
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
                    <Label htmlFor="formrow-state-Input">Status</Label>
                    <Input
                      type="number"
                      name="status"
                      className={`form-control ${formErrors.status ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter status"
                      value={formData?.status}
                      onChange={handleChange}
                    />
                    {formErrors.status && (
                      <div className="invalid-feedback">
                        {formErrors.status}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Prefix</Label>
                    <Input
                      type="text"
                      name="prefix"
                      className={`form-control ${formErrors.prefix ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter Prefix"
                      value={formData?.prefix}
                      onChange={handleChange}
                    />
                    {formErrors.prefix && (
                      <div className="invalid-feedback">
                        {formErrors.prefix}
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

export default MaterialType;
