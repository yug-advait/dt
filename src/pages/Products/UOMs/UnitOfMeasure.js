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
  ADD_UNITOFMEASURE_REQUEST,
  GET_UNITOFMEASURE_REQUEST,
  UPDATE_UNITOFMEASURE_REQUEST,
  DELETE_UNITOFMEASURE_REQUEST,
} from "../../../store/unitOfMeasure/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
const UnitOfMeasure = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { unitofmeasure,listuom, addunitOfMeasure, updateunitOfMeasure, deleteunitOfMeasure, error } = useSelector(
    state => state.unitOfMeasure
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
  const [aliasUom, setAliasUom] = useState([]);
    const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    uom_code: "",
    commercial_uom_code: "",
    uom_description: "",
    commercial_uom_description: "",
    iso_code_for_uom: "",
    decimal_allowed_upto: "",
    alias_uom_1: "",
    alias_uom_2: "",
    alias_uom_3: "",
    alias_uom_4: "",
    isactive: isActive
  });

  useEffect( () => {
    dispatch({
      type: GET_UNITOFMEASURE_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listuom) {
      setLoading(false)
    }
    if (addunitOfMeasure) {
      setToastMessage("Unit Of Measure Added Successfully");
      dispatch({
        type: GET_UNITOFMEASURE_REQUEST,
      });
      setToast(true);
    }
    if (updateunitOfMeasure) {
      setToastMessage("Unit Of Measure Updated Successfully");
      dispatch({
        type: GET_UNITOFMEASURE_REQUEST,
      });
      setToast(true);
    }
    if (deleteunitOfMeasure) {
      setToastMessage("Unit Of Measure Deleted Successfully");
      dispatch({
        type: GET_UNITOFMEASURE_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Unit Of Measure Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      })
      dispatch({
        type: GET_UNITOFMEASURE_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addunitOfMeasure, updateunitOfMeasure, updateCommon, deleteunitOfMeasure, toast]);

  const handleClicks = () => {
    setFormData({
        uom_description: "",
        uom_code: "",
        commercial_uom_code: "",
        commercial_uom_description: "",
        iso_code_for_uom: "",
        decimal_allowed_upto: "",
        alias_uom_1: "",
        alias_uom_2: "",
        alias_uom_3: "",
        alias_uom_4: "",
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
        type: DELETE_UNITOFMEASURE_REQUEST,
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

    if (name === 'uom_code' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        uom_code: "UOM Code cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        uom_code: ""
      });
    }

    if (name === 'commercial_uom_code' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        commercial_uom_code: "Commercial UOM Code cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        commercial_uom_code: ""
      });
    }

    if (name === 'uom_description' && value.length > 70) {
      newValue = value.slice(0, 70);
      setFormErrors({
        ...formErrors,
        uom_description: "UOM Description cannot be more than 70 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        uom_description: ""
      });
    }

    if (name === 'commercial_uom_description' && value.length > 70) {
      newValue = value.slice(0, 70);
      setFormErrors({
        ...formErrors,
        commercial_uom_description: "Commercial UOM Description cannot be more than 70 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        commercial_uom_description: ""
      });
    }

    if (name === 'iso_code_for_uom' && value.length > 10) {
      newValue = value.slice(0, 10);
      setFormErrors({
        ...formErrors,
        iso_code_for_uom: "ISO Code for UOM cannot be more than 10 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        iso_code_for_uom: ""
      });
    }

    if (name === 'decimal_allowed_upto' && value.length > 5) {
      newValue = value.slice(0, 5);
      setFormErrors({
        ...formErrors,
        decimal_allowed_upto: "Decimal Allowed Upto cannot be more than 5 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        decimal_allowed_upto: ""
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {}; 
    if (!formData.uom_code.trim()) {
      errors.uom_code = "UOM Code is required";
    } else if (formData.uom_code.length > 10)
      errors.uom_code = "UOM Code cannot be more than 10 characters";

    if (!formData.commercial_uom_code) {
      errors.commercial_uom_code = "Commercial UOM Code is required";
    } else if (formData.commercial_uom_code.length > 10)
      errors.commercial_uom_code = "Commercial UOM Code cannot be more than 10 characters";

    if (!formData.uom_description.trim()) {
      errors.uom_description = "UOM Description is required";
    } else if (formData.uom_description.length > 70)
      errors.uom_description = "UOM Description cannot be more than 70 characters";

    if (!formData.commercial_uom_description.trim()) {
      errors.commercial_uom_description = "Commercial UOM Description is required";
    } else if (formData.commercial_uom_description.length > 70)
      errors.commercial_uom_description = "Commercial UOM Description cannot be more than 70 characters";

    if (!formData.iso_code_for_uom.trim()) {
      errors.iso_code_for_uom = "ISO Code For UOM is required";
    } else if (formData.iso_code_for_uom.length > 10)
      errors.iso_code_for_uom = "ISO Code For UOM cannot be more than 10 characters";

    if (!formData.decimal_allowed_upto) {
      errors.decimal_allowed_upto = "Decimal Allowed Upto is required";
    } else if (formData.decimal_allowed_upto.length > 5)
      errors.decimal_allowed_upto = "Decimal Allowed Upto cannot be more than 5 characters";

    if (!formData.alias_uom_1) {
      errors.alias_uom_1 = "Alias UOM 1 is required";
    } else if (formData.alias_uom_1.length > 10)
      errors.alias_uom_1 = "Alias UOM 1 cannot be more than 10 characters";
    aliasUom.forEach((_, idx) => {
      const fieldName = `alias_uom_${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Alias UOM ${idx + 2} is required`;
      } else if (value.length > 10) {
        errors[fieldName] = `Alias UOM ${idx + 2} cannot exceed 10 characters`;
      }
    });

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
          type: UPDATE_UNITOFMEASURE_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_UNITOFMEASURE_REQUEST,
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
    uom_code:data?.uom_code || "",
    commercial_uom_code:data?.commercial_uom_code || "",
    uom_description:data?.uom_description || "",
    commercial_uom_description:data?.commercial_uom_description || "",
    iso_code_for_uom:data?.iso_code_for_uom || "",
    decimal_allowed_upto:data?.decimal_allowed_upto || "",
    alias_uom_1:data?.alias_uom_1 || "",
    alias_uom_2:data?.alias_uom_2 || "",
    alias_uom_3:data?.alias_uom_3 || "",
    alias_uom_4:data?.alias_uom_4 || "",
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

  const handleAddRowNestedAliasUom = () => {
    if (aliasUom.length < 3) {
      const newItem = { name1: "" };
      setAliasUom([...aliasUom, newItem]);
    }
  };

  const handleRemoveRowNestedAliasUom = idx => {
    setFormData(prevData => ({
      ...prevData,
      ["alias_uom_" + (idx + 2)]: "",
    }));
    const updatedRows = [...aliasUom];
    updatedRows.splice(idx, 1);
    setAliasUom(updatedRows);
  };

  const columns = useMemo(
    () => [
      {
        Header: "UOM Code",
        accessor: "uom_code",
      },
      {
        Header: "Commercial UOM Code",
        accessor: "commercial_uom_code",
      },
      {
        Header: "UOM Description",
        accessor: "uom_description",
      },
      {
        Header: "Commercial UOM Description",
        accessor: "commercial_uom_description",
      },
      {
        Header: "ISO Code For UOM",
        accessor: "iso_code_for_uom",
      },
      {
        Header: "Decimal Upto",
        accessor: "decimal_allowed_upto",
      },
      {
        Header: "Alias UOM 1",
        accessor: "alias_uom_1",
      },
      // {
      //   Header: "Alias UOM 2",
      //   accessor: "alias_uom_2",
      // },
      // {
      //   Header: "Alias UOM 3",
      //   accessor: "alias_uom_3",
      // },
      // {
      //   Header: "Alias UOM 4",
      //   accessor: "alias_uom_4",
      // },
      // {
      //   Header: "Created On",
      //   accessor: "createdon",
      //   Cell: ({ value }) => {
      //     const formattedDate = moment(value).format('DD/MM/YYYY');
      //     return <div>{formattedDate}</div>
      //   }
      // },
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
                        name: "unit_of_measure",
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
            </div>
          );
        },
      },
    ],
    [status]
  );

  document.title = "Detergent | Unit Of Measure";
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
          <Breadcrumbs titlePath="#" title="Products" breadcrumbItem="Unit Of Measure" />
          {loading ? (
            <Loader />
          ) : (
          <TableContainer
            columns={columns}
            data={unitofmeasure && unitofmeasure.length > 0 ? unitofmeasure : []}
            isGlobalFilter={true}
            isAddOptions={true}
            customPageSize={10}
            className="custom-header-css"
            addButtonLabel={"Add Unit Of Measure"}
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
                    <Label htmlFor="formrow-state-Input">UOM Code</Label>
                    <Input
                      type="text"
                      name="uom_code"
                      className={`form-control ${
                        formErrors.uom_code ? "is-invalid" : ""
                      }`}
                      id="formrow-state-Input"
                      placeholder="Enter Here"
                      value={formData?.uom_code}
                      onChange={handleChange}
                    />
                    {formErrors.uom_code && (
                      <div className="invalid-feedback">
                        {formErrors.uom_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <Label htmlFor="name">Commercial Code</Label>
                  <Input
                    type="text"
                    id="name"
                    name="commercial_uom_code"
                    className={`form-control ${
                      formErrors.commercial_uom_code ? "is-invalid" : ""
                    }`}
                    value={formData.commercial_uom_code}
                    placeholder="Enter Here"
                    onChange={handleChange}
                  />
                  {formErrors.commercial_uom_code && (
                    <div className="invalid-feedback">
                      {formErrors.commercial_uom_code}
                    </div>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">UOM Description</Label>
                    <Input
                      type="textarea"
                      name="uom_description"
                      className={`form-control ${
                        formErrors.uom_description ? "is-invalid" : ""
                      }`}
                      id="formrow-state-Input"
                      placeholder="Enter Here"
                      value={formData?.uom_description}
                      onChange={handleChange}
                    />
                    {formErrors.uom_description && (
                      <div className="invalid-feedback">
                        {formErrors.uom_description}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Commercial UOM Description</Label>
                    <Input
                      type="text"
                      name="commercial_uom_description"
                      className={`form-control ${
                        formErrors.commercial_uom_description ? "is-invalid" : ""
                      }`}
                      id="formrow-state-Input"
                      placeholder="Enter Here"
                      value={formData?.commercial_uom_description}
                      onChange={handleChange}
                    />
                    {formErrors.commercial_uom_description && (
                      <div className="invalid-feedback">
                        {formErrors.commercial_uom_description}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">ISO Code</Label>
                    <Input
                      type="text"
                      name="iso_code_for_uom"
                      className={`form-control ${
                        formErrors.iso_code_for_uom ? "is-invalid" : ""
                      }`}
                      id="formrow-state-Input"
                      placeholder="Enter Here"
                      value={formData?.iso_code_for_uom}
                      onChange={handleChange}
                    />
                    {formErrors.iso_code_for_uom && (
                      <div className="invalid-feedback">
                        {formErrors.iso_code_for_uom}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Decimal Allowed Upto</Label>
                    <Input
                      type="number"
                      name="decimal_allowed_upto"
                      className={`form-control ${
                        formErrors.decimal_allowed_upto ? "is-invalid" : ""
                      }`}
                      id="formrow-state-Input"
                      placeholder="Enter Here"
                      value={formData?.decimal_allowed_upto}
                      onChange={handleChange}
                    />
                    {formErrors.decimal_allowed_upto && (
                      <div className="invalid-feedback">
                        {formErrors.decimal_allowed_upto}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label>Alias UOM </Label>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr id="addrMain" key="">
                        <td>
                          <Row className="inner mb-3 ">
                            <Col md="9" className="col-4">
                              <Input
                                type="text"
                                value={formData.alias_uom_1}
                                onChange={e => {
                                  setFormData(prevData => ({
                                    ...prevData,
                                    alias_uom_1: e.target.value,
                                  }));
                                  setFormErrors(prevErrors => ({
                                    ...prevErrors,
                                    alias_uom_1: "",
                                  }));
                                }}
                                className="inner form-control"
                                placeholder="Enter Here"
                              />
                              {formErrors.alias_uom_1 && (
                                <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                                  {formErrors.alias_uom_1}
                                </div>
                              )}
                            </Col>
                            <Col md="3" className="col-2">
                              <Button
                                onClick={handleAddRowNestedAliasUom}
                                color="primary"
                              >
                                Add
                              </Button>
                            </Col>
                          </Row>
                        </td>
                      </tr>
                      {aliasUom.map((item1, idx) => (
                        <tr id={"nested" + idx} key={idx}>
                          <td>
                            <Row className="inner mb-3">
                              <Col md="9" className="col-8">
                                <Input
                                  type="text"
                                  value={formData?.[`alias_uom_${idx + 2}`]}
                                  onChange={e => {
                                    setFormData(prevData => ({
                                      ...prevData,
                                      [`alias_uom_${idx + 2}`]: e.target.value,
                                    }));
                                  }}
                                  className={`inner form-control ${
                                    formErrors[`alias_uom_${idx + 2}`] ? "is-invalid" : ""
                                  }`}
                                  placeholder={`Enter Here`}
                                />
                                {formErrors[`alias_uom_${idx + 2}`] && (
                                  <div className="invalid-feedback">
                                    {formErrors?.[`alias_uom_${idx + 2}`]}
                                  </div>
                                )}
                              </Col>
                              <Col md="3" className="col-4">
                                <Button
                                  onClick={() => handleRemoveRowNestedAliasUom(idx)}
                                  color="danger"
                                  className="btn-block inner"
                                  style={{ width: "100%" }}
                                >
                                  {" "}
                                  Delete
                                </Button>
                              </Col>
                            </Row>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
              <div className="mt-2">
                <Button
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

export default UnitOfMeasure;
