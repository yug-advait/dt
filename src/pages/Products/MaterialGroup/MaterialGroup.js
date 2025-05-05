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
  ADD_MATERIALGROUP_REQUEST,
  GET_MATERIALGROUP_REQUEST,
  UPDATE_MATERIALGROUP_REQUEST,
  DELETE_MATERIALGROUP_REQUEST,
} from "../../../store/materialGroup/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
import moment from "moment";
const MaterialGroup = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { materialgroup, addmaterialGroup, updatematerialGroup, deletematerialGroup, listmaterialGroup, error } = useSelector(
    state => state.materialGroup
  );
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [rowData, setRowData] = useState("")
  const [toastMessage, setToastMessage] = useState()
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [materialGroupPermission, setMaterialGroupPermission] = useState();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    matgrp: "",
    matgrp_description: "",
    matgrp_type_id: "",
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
        permission.sub_menu_name === "material_groups"
    );
    setMaterialGroupPermission(
      permissions.find(permission => permission.sub_menu_name === "material_groups")
    );
    dispatch({
      type: GET_MATERIALGROUP_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listmaterialGroup) {
      setLoading(false)
    }
    if (addmaterialGroup) {
      setToastMessage("Material Group Added Successfully");
      dispatch({
        type: GET_MATERIALGROUP_REQUEST,
      });
      setToast(true);
    }
    if (updatematerialGroup) {
      setToastMessage("Material Group Updated Successfully");
      dispatch({
        type: GET_MATERIALGROUP_REQUEST,
      });
      setToast(true);
    }
    if (deletematerialGroup) {
      setToastMessage("Material Group Deleted Successfully");
      dispatch({
        type: GET_MATERIALGROUP_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Material Group Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      })
      dispatch({
        type: GET_MATERIALGROUP_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addmaterialGroup, updatematerialGroup, updateCommon, deletematerialGroup, listmaterialGroup, toast]);

  const handleClicks = () => {
    setFormData({
      matgrp: "",
      matgrp_description: "",
      matgrp_type_id: "",
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
        type: DELETE_MATERIALGROUP_REQUEST,
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

    if (name === 'matgrp' && value.length > 4) {
      newValue = value.slice(0, 4);
      setFormErrors({
        ...formErrors,
        matgrp: "Material Group cannot be more than 4 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        matgrp: ""
      });
    }
    if (name === 'matgrp_description' && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        matgrp_description: "Material Group Description cannot be more than 50 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        matgrp_description: ""
      });
    }
    if (name === 'matgrp_type_id' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        matgrp_type_id: "Material Group Type Id cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        matgrp_type_id: ""
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.matgrp.trim()) {
      errors.matgrp = "Material Group is required";
    } else if (formData.matgrp.length > 4) {
      errors.matgrp = "Material Group cannot be more than 4 characters";
    }

    if (!formData.matgrp_description.trim()) {
      errors.matgrp_description = "Material Group Description is required";
    } else if (formData.matgrp_description.length > 50) {
      errors.matgrp_description = "Material Group Description cannot be more than 50 characters";
    }

    if (!formData.matgrp_type_id) {
      errors.matgrp_type_id = "Material Group Type Id is required";
    } else if (formData.matgrp_type_id.length > 10) {
      errors.matgrp_type_id = "Material Group Type Id cannot be more than 10 characters";
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
          type: UPDATE_MATERIALGROUP_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_MATERIALGROUP_REQUEST,
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
      matgrp: data?.matgrp || "",
      matgrp_description: data?.matgrp_description || "",
      matgrp_type_id: data?.matgrp_type_id || "",
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
        Header: "Material Group",
        accessor: "matgrp",
      },
      {
        Header: "Material Group Description",
        accessor: "matgrp_description",
      },
      {
        Header: "Material Group Type Id",
        accessor: "matgrp_type_id",
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
                        name: "material_group",
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
              {materialGroupPermission && materialGroupPermission?.can_edit ? (
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
              {materialGroupPermission && materialGroupPermission?.can_delete ? (
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
    [status, materialGroupPermission]
  );

  document.title = "Detergent | Material Group";
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
          <Breadcrumbs titlePath="#" title="Products" breadcrumbItem="Material Group" />
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={materialgroup && materialgroup.length > 0 ? materialgroup : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                materialGroupPermission && materialGroupPermission?.can_add
                  ? "Add Material Group"
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
                    <Label htmlFor="formrow-state-Input">Material Group</Label>
                    <Input
                      type="text"
                      name="matgrp"
                      className={`form-control ${formErrors.matgrp ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Material Group"
                      value={formData?.matgrp}
                      onChange={handleChange}
                    />
                    {formErrors.matgrp && (
                      <div className="invalid-feedback">
                        {formErrors.matgrp}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="name">Material Type Group Description</Label>
                  <Input
                    type="textarea"
                    id="name"
                    name="matgrp_description"
                    className={`form-control ${formErrors.matgrp_description ? "is-invalid" : ""
                      }`}
                    value={formData.matgrp_description}
                    rows="3"
                    placeholder="Please Enter Material Group Description"
                    onChange={handleChange}
                  />
                  {formErrors.matgrp_description && (
                    <div className="invalid-feedback">
                      {formErrors.matgrp_description}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Material Group Type Id</Label>
                    <Input
                      type="number"
                      name="matgrp_type_id"
                      className={`form-control ${formErrors.matgrp_type_id ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Material Group Type Id"
                      value={formData?.matgrp_type_id}
                      onChange={handleChange}
                    />
                    {formErrors.matgrp_type_id && (
                      <div className="invalid-feedback">
                        {formErrors.matgrp_type_id}
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

export default MaterialGroup;
