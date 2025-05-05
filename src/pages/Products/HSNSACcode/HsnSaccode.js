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
import Select from "react-select";
import {
  ADD_HSNSAC_REQUEST,
  GET_HSNSAC_REQUEST,
  UPDATE_HSNSAC_REQUEST,
  DELETE_HSNSAC_REQUEST,
} from "../../../store/HsnSaccode/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
import moment from "moment";
const HsnSaccode = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { hsnsac, addhsnsac, updatehsnsac, listhsncode, deletehsnsac } = useSelector(
    state => state.hsnsac
  );
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectCategoryType, setSelectedCategoryType] = useState({});
  const [rowData, setRowData] = useState("")
  const [toastMessage, setToastMessage] = useState()
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [hsnSacPermission, setHsnSacPermission] = useState();
  const [formData, setFormData] = useState({
    chapter: "",
    heading: "",
    sub_heading: "",
    tariff_item: "",
    hsn_sac_code: "",
    hsn_sac_category: "",
    hsn_sac_description: "",
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
    const hsnSacCode = location.pathname == "/products/hsn_code" ? 'hsn_code' : 'sac_code'
    var permissions = userData?.permissionList?.filter(
      permission =>
        permission.sub_menu_name === hsnSacCode
    );
    setHsnSacPermission(
      permissions.find(permission => permission.sub_menu_name === hsnSacCode)
    );
    dispatch({
      type: GET_HSNSAC_REQUEST,
      payload: {
        hsn_sac_type: location.pathname == "/products/hsn_code" ? 'h' : 's'
      },
    });
  }, []);

  useEffect(() => {
    if (listhsncode) {
      setLoading(false)
    }
    if (addhsnsac) {
      setToastMessage("HSN SAC Added Successfully");
      dispatch({
        type: GET_HSNSAC_REQUEST,
        payload: {
          hsn_sac_type: location.pathname == "/products/hsn_code" ? 'h' : 's'
        },
      });
      setToast(true);
    }
    if (updatehsnsac) {
      setToastMessage("HSN SAC Updated Successfully");
      dispatch({
        type: GET_HSNSAC_REQUEST,
        payload: {
          hsn_sac_type: location.pathname == "/products/hsn_code" ? 'h' : 's'
        },
      });
      setToast(true);
    }
    if (deletehsnsac) {
      setToastMessage("HSN SAC Deleted Successfully");
      dispatch({
        type: GET_HSNSAC_REQUEST,
        payload: {
          hsn_sac_type: location.pathname == "/products/hsn_code" ? 'h' : 's'
        },
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("HSN SAC Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      })
      dispatch({
        type: GET_HSNSAC_REQUEST,
        payload: {
          hsn_sac_type: location.pathname == "/products/hsn_code" ? 'h' : 's'
        },
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addhsnsac, updatehsnsac, updateCommon, listhsncode, deletehsnsac, toast]);

  const handleClicks = () => {
    setFormData({
      chapter: "",
      heading: "",
      sub_heading: "",
      tariff_item: "",
      hsn_sac_code: "",
      hsn_sac_category: "",
      hsn_sac_description: "",
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
        type: DELETE_HSNSAC_REQUEST,
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

    if (name === 'chapter' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        chapter: "Chapter cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        chapter: ""
      });
    }
    if (name === 'heading' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        heading: "Heading cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        heading: ""
      });
    }
    if (name === 'sub_heading' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        sub_heading: "Sub Heading cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        sub_heading: ""
      });
    }
    if (name === 'tariff_item' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        tariff_item: "Tariff Item cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        tariff_item: ""
      });
    }

    if (name === 'hsn_sac_code' && value.length > 8) {
      newValue = value.slice(0, 8);
      setFormErrors({
        ...formErrors,
        hsn_sac_code: "HSN SAC Code cannot be more than 8 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        hsn_sac_code: ""
      });
    }

    if (name === 'hsn_sac_description' && value.length > 100) {
      newValue = value.slice(0, 100);
      setFormErrors({
        ...formErrors,
        hsn_sac_description: "HSN SAC Description cannot be more than 8 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        hsn_sac_description: ""
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.chapter.trim()) {
      errors.chapter = "Chapter is required";
    }
    else if (formData.chapter.length > 10) {
      errors.chapter = "Chapter cannot be more than 10 characters"
    }
    if (!formData.heading) {
      errors.heading = "Heading is required";
    }
    else if (formData.heading.length > 10) {
      errors.heading = "Heading cannot be more than 10 characters"
    }
    if (!formData.sub_heading.trim()) {
      errors.sub_heading = "Sub Heading is required";
    }
    else if (formData.sub_heading.length > 10) {
      errors.sub_heading = "Sub Heading cannot be more than 10 characters"
    }
    if (!formData.tariff_item.trim()) {
      errors.tariff_item = "Tariff Item is required";
    }
    else if (formData.tariff_item.length > 10) {
      errors.tariff_item = "Tariff Item cannot be more than 10 characters"
    }
    if (!formData.hsn_sac_code) {
      errors.hsn_sac_code = "Hsn Sac Code is required";
    } else if (formData.hsn_sac_code.trim().length > 8) {
      errors.hsn_sac_code = "Hsn Sac Code cannot be more than 8 characters"
    }
    if (Object.keys(selectCategoryType).length === 0) {
      errors.hsn_sac_category = "Hsn Sac Category is required";
    }
    if (!formData.hsn_sac_description) {
      errors.hsn_sac_description = "Hsn Sac Description is required";
    } else if (formData.hsn_sac_description.trim().length > 100) {
      errors.hsn_sac_description = "Hsn Sac Description cannot be more than 100 characters"
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
          hsn_sac_type: location.pathname == "/products/hsn_code" ? 'h' : 's',
          Id,
        };
        dispatch({
          type: UPDATE_HSNSAC_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          hsn_sac_type: location.pathname == "/products/hsn_code" ? 'h' : 's',
          isActive,
        };
        dispatch({
          type: ADD_HSNSAC_REQUEST,
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
    setSelectedCategoryType({ value: data?.hsn_sac_category, label: data?.hsn_sac_category == "P" ? "Product" : "Service" })
    setFormData({
      chapter: data?.chapter || "",
      heading: data?.heading || "",
      sub_heading: data?.sub_heading || "",
      tariff_item: data?.tariff_item || "",
      hsn_sac_code: data?.hsn_sac_code || "",
      hsn_sac_category: data?.hsn_sac_category || "",
      hsn_sac_description: data?.hsn_sac_description || "",
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
        Header: "Chapter",
        accessor: "chapter",
      },
      {
        Header: "Heading",
        accessor: "heading",
      },
      {
        Header: "Sub Heading",
        accessor: "sub_heading",
      },
      {
        Header: "Tariff Item",
        accessor: "tariff_item",
      },
      {
        Header: location.pathname === "/products/hsn_code" ? 'HSN Code' : 'SAC Code',
        accessor: "hsn_sac_code",
      },
      {
        Header: location.pathname === "/products/hsn_code" ? 'HSN Category' : 'SAC Category',
        accessor: "hsn_sac_category",
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
                        name: "hsn_saccode",
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
              {hsnSacPermission && hsnSacPermission?.can_edit ? (
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

              {hsnSacPermission && hsnSacPermission?.can_delete ? (
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
    [status, hsnSacPermission]
  );

  document.title = location.pathname === "/products/hsn_code" ? 'Detergent | HSN' : 'Detergent | SAC';
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
          <Breadcrumbs titlePath="#" title="Products" breadcrumbItem={location.pathname === "/products/hsn_code" ? 'HSN Code' : 'SAC Code'} />
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={hsnsac && hsnsac.length > 0 ? hsnsac : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={location.pathname === "/products/hsn_code" ?
                hsnSacPermission && hsnSacPermission?.can_add ? 'Add HSN Code' : null : hsnSacPermission && hsnSacPermission?.can_add ? 'SAC Code' : null}
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
                    <Label htmlFor="formrow-state-Input">Chapter</Label>
                    <Input
                      type="text"
                      name="chapter"
                      className={`form-control ${formErrors.chapter ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter Here"
                      value={formData?.chapter}
                      onChange={handleChange}
                    />
                    {formErrors.chapter && (
                      <div className="invalid-feedback">
                        {formErrors.chapter}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <Label htmlFor="name">Heading</Label>
                  <Input
                    type="text"
                    id="name"
                    name="heading"
                    className={`form-control ${formErrors.heading ? "is-invalid" : ""
                      }`}
                    value={formData.heading}
                    placeholder="Enter Here"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        heading: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        heading: "",
                      }));
                    }}
                  />
                  {formErrors.heading && (
                    <div className="invalid-feedback">
                      {formErrors.heading}
                    </div>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Sub Heading</Label>
                    <Input
                      type="text"
                      name="sub_heading"
                      className={`form-control ${formErrors.sub_heading ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter Here"
                      value={formData?.sub_heading}
                      onChange={handleChange}
                    />
                    {formErrors.sub_heading && (
                      <div className="invalid-feedback">
                        {formErrors.sub_heading}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Tariff Item</Label>
                    <Input
                      type="text"
                      name="tariff_item"
                      className={`form-control ${formErrors.tariff_item ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter Here"
                      value={formData?.tariff_item}
                      onChange={handleChange}
                    />
                    {formErrors.tariff_item && (
                      <div className="invalid-feedback">
                        {formErrors.tariff_item}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">{location.pathname === "/products/hsn_code" ? 'HSN Code' : 'SAC Code'}</Label>
                    <Input
                      type="text"
                      name="hsn_sac_code"
                      className={`form-control ${formErrors.hsn_sac_code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder={location.pathname === "/products/hsn_code" ? 'Enter HSN Code' : 'Enter SAC Code'}
                      value={formData?.hsn_sac_code}
                      onChange={handleChange}
                    />
                    {formErrors.hsn_sac_code && (
                      <div className="invalid-feedback">
                        {formErrors.hsn_sac_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="">
                    <Label htmlFor="formrow-state-Input">
                      {location.pathname === "/products/hsn_code" ? 'HSN Category' : 'SAC Category'}
                    </Label>
                    <Select
                      value={selectCategoryType}
                      onChange={async selectCategoryType => {
                        setSelectedCategoryType(selectCategoryType)
                        setFormData(prevData => ({
                          ...prevData,
                          hsn_sac_category: selectCategoryType?.value,
                        }));
                      }}
                      options={[{ value: "P", label: "Product" }, { value: "S", label: "Service" }]}
                    />
                    {formErrors.hsn_sac_category && (
                      <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                        {formErrors.hsn_sac_category}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">{location.pathname === "/products/hsn_code" ? 'HSN Description' : 'SAC Description'}</Label>
                    <Input
                      type="textarea"
                      name="hsn_sac_description"
                      className={`form-control ${formErrors.hsn_sac_description ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder={location.pathname === "/products/hsn_code" ? 'Enter HSN Description' : 'Enter SAC Description'}
                      value={formData?.hsn_sac_description}
                      onChange={handleChange}
                    />
                    {formErrors.hsn_sac_description && (
                      <div className="invalid-feedback">
                        {formErrors.hsn_sac_description}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="">
                  <div className="form-check form-switch mb-3" dir="ltr">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="customSwitchsizesm"
                      checked={isActive}
                      onClick={() => {
                        setIsActive(!isActive);
                        setFormData({
                          ...formData,
                          ['isactive']: !isActive,
                      });
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
              <div className="mt-2">
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

export default HsnSaccode;
