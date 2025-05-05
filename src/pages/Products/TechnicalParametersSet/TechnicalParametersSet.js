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
  Alert,
} from "reactstrap";
import { Link } from "react-router-dom";
import Select from "react-select";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
  ADD_TECHSET_REQUEST,
  GET_TECHSET_REQUEST,
  UPDATE_TECHSET_REQUEST,
  DELETE_TECHSET_REQUEST,
} from "../../../store/technicalParameterSet/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { getSelectData } from "helpers/Api/api_common";
import "flatpickr/dist/themes/material_blue.css";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
import moment from "moment";
const TechnicalParametersSet = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { techset, addtechSet, updatetechSet, deletetechSet, listtechSet } = useSelector((state) => state.techset);
  const { updateCommon } = useSelector((state) => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [optionDropDownItems, setOptionDropDownItems] = useState([]);
  const [selectedTechSet, setSelectedTechSet] = useState([]);
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [formErrors, setFormErrors] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [Edit, setEdit] = useState(null);
  const [technicalParametersSetPermission, setTechnicalParametersSetPermission] = useState();

  const [formData, setFormData] = useState({
    label: "",
  });
  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };

  useEffect(() => {
    const userData = getUserData();
    const permissions = userData?.permissionList?.filter(
      (permission) =>
        permission.sub_menu_name === "technical_parameters_set"
    );
    setTechnicalParametersSetPermission(
      permissions.find(
        (permission) => permission.sub_menu_name === "technical_parameters_set"
      )
    );
    dropdownList();
    dispatch({
      type: GET_TECHSET_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listtechSet) {
      setLoading(false)
    }
    if (addtechSet) {
      setToastMessage("Technical Parameters Set Added Successfully");
      dispatch({
        type: GET_TECHSET_REQUEST,
      });
      setToast(true);
    }
    if (updatetechSet) {
      setToastMessage("Technical Parameters Set Updated Successfully");
      dispatch({
        type: GET_TECHSET_REQUEST,
      });
      setToast(true);
    }
    if (deletetechSet) {
      setToastMessage("Technical Parameters Set Deleted Successfully");
      dispatch({
        type: GET_TECHSET_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Technical Parameters Set Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_TECHSET_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addtechSet, updatetechSet, updateCommon, deletetechSet, listtechSet, toast]);

  const handleClicks = () => {
    setSelectedTechSet([])
    setFormData({
      label: "",
    });
    setModal(true);
  };

  const onClickDelete = (item) => {
    setRowData(item);
    setDeleteModal(true);
  };

  const createSet = () => { };

  const handleCheckboxChange = row => {
    setSelectedRows(prevSelected =>
      prevSelected.includes(row)
        ? prevSelected.filter(item => item !== row)
        : [...prevSelected, row]
    );
  };

  const handleDelete = async () => {
    try {
      dispatch({
        type: DELETE_TECHSET_REQUEST,
        payload: rowData.id,
      });
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const dropdownList = async () => {
    const selectData = await getSelectData(
      "type",
      "",
      "technical_parameters_master_search"
    );
    setOptionDropDownItems(selectData?.getDataByColNameData);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "label" && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        label: "Label cannot be more than 50 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        label: ""
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errorsdata = {};
    let isValid = true;
    if (!formData.label.trim()) {
      errorsdata.label = "Label is required";
      isValid = false;
    } else if (formData.label.length > 50) {
      errorsdata.label = "Label cannot be more than 50 characters";
      isValid = false;
    }

    if (selectedTechSet.length === 0) {
      errorsdata.tech_set = "Technical Parameter Set is required";
      isValid = false;
    }

    setFormErrors(errorsdata);
    // return isValid;
    if (isValid) {
      return true;
    } else {
      return isValid;
    }
  };

  const handleSaveOrEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const valueString = selectedTechSet.map((item) => item.value).join(", ");
      if (Edit) {
        const Id = Edit.id;
        const Data = {
          set_label: formData?.label,
          parameter_sets: valueString,
          Id,
        };
        dispatch({
          type: UPDATE_TECHSET_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          set_label: formData?.label,
          parameter_sets: valueString,
        };
        dispatch({
          type: ADD_TECHSET_REQUEST,
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
    const parameter_sets = data?.parameter_sets.split(",");
    const newArray = data?.labels.map((label, index) => ({
      value: parameter_sets[index],
      label: `${label}-${data?.types[index]}`,
    }));
    setEdit(data);
    setRowData(data);
    setSelectedTechSet(newArray);
    setFormData({
      label: data?.set_label || "",
    });
    setModal(true);
  };

  const resetForm = () => {
    setFormErrors({})
    setSelectedTechSet([])
    setFormData({
      label: "",
    });
    setEdit(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Set Name",
        accessor: "set_label",
      },
      {
        Header: "Parameter Set Labels",
        accessor: "labels",
        Cell: ({ value }) => (
          <div>
            {value.map((item, index) => (
              <div key={index}>
                <span>{index + 1}. </span>
                <span>{item}</span>
                <br />
              </div>
            ))}
          </div>
        ),
      },
      {
        Header: "Parameter Set Types",
        accessor: "types",
        Cell: ({ value }) => (
          <div>
            {value.map((item, index) => (
              <div key={index}>
                <span>{index + 1}. </span>
                <span>{item}</span>
                <br />
              </div>
            ))}
          </div>
        ),
      },
      {
        Header: "Created On",
        accessor: "createdon",
        Cell: ({ value }) => <div>{moment(value).format("DD/MM/YYYY")}</div>,
      },
      {
        Header: "Status",
        accessor: "isactive",
        Cell: (cellProps) => (
          <div className="form-check form-switch mb-3" dir="ltr">
            <input
              type="checkbox"
              className="form-check-input"
              checked={cellProps.row.original.isactive}
              onClick={() => {
                dispatch({
                  type: STATUS_REQUEST,
                  payload: {
                    name: "technical_parameters_sets",
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
        Cell: (cellProps) => (
          <div className="d-flex gap-3">
            {technicalParametersSetPermission?.can_edit && (
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
            )}
            {technicalParametersSetPermission?.can_delete && (
              <Link
                to="#"
                className="text-danger"
                onClick={() => onClickDelete(cellProps.row.original)}
              >
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>
            )}
          </div>
        ),
      },
    ],
    [dispatch, technicalParametersSetPermission]
  );

  document.title = "Detergent | Technical Parameters Set";
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
            title="Products"
            breadcrumbItem="Technical Parameters Set"
          />
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={techset && techset.length > 0 ? techset : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                technicalParametersSetPermission && technicalParametersSetPermission?.can_add
                  ? "Add Technical Parameters Set"
                  : null
              }
              handleClicks={handleClicks}
              selectedRows={selectedRows}
              handleCheckboxChange={handleCheckboxChange}
              createSet={createSet}
              showCreateSet={true}
              buttonSizes={
                selectedRows.length > 0
                  ? {
                    createSet: "5",
                    addButtonLabel: "3",
                  }
                  : { addButtonLabel: "8" }
              }
            />
          )}
        </div>
        <Modal isOpen={modal} centered>
          <div className="modal-header">
            {Edit
              ? "Edit Technical Parameter Set"
              : "Add Technical Parameter Set"}
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
                <Col md={12} className="">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Label</Label>
                    <Input
                      type="text"
                      name="label"
                      className={`form-control ${formErrors.label ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Label"
                      value={formData?.label}
                      onChange={handleChange}
                    />
                    {formErrors.label && (
                      <div className="invalid-feedback">{formErrors.label}</div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="">
                  <Label>Technical Parameter Set</Label>
                  <Select
                    isMulti
                    multiple
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={selectedTechSet}
                    options={optionDropDownItems}
                    onChange={async selectedTechSet => {
                      setSelectedTechSet(selectedTechSet);
                    }}
                  ></Select>
                  {formErrors.tech_set && (
                    <div style={{
                      color: "#f46a6a",
                      fontSize: "80%",
                    }}>{formErrors.tech_set}</div>
                  )}
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

export default TechnicalParametersSet;