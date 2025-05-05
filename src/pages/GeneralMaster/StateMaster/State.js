import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import Select from "react-select"
import debounce from 'lodash/debounce'
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import moment from "moment";
import {
  ADD_STATES_REQUEST,
  GET_STATES_REQUEST,
  UPDATE_STATES_REQUEST,
  DELETE_STATES_REQUEST,
} from "../../../store/state/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { getSelectData } from "helpers/Api/api_common";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const States = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { states, addStates, updateStates, deleteStates, listStates, error } = useSelector(
    state => state.states
  );
  const [loading, setLoading] = useState(true);
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [rowData, setRowData] = useState("")
  const [toastMessage, setToastMessage] = useState()
  const [optionCountry, setOptionCountry] = useState([])
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [selectCountry, setSelectedCountry] = useState({})
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [statePermission, setStatePermission] = useState();
  const [formData, setFormData] = useState({
    state_name_alias: "",
    state_code: "",
    state_description: "",
    external_state_id_1: "",
    external_state_id_2: "",
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
        permission.sub_menu_name === "states"
    );
    setStatePermission(
      permissions.find(permission => permission.sub_menu_name === "states")
    );
    dispatch({
      type: GET_STATES_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listStates) {
      setLoading(false)
    }
    if (addStates) {
      setToastMessage("State Added Successfully");
      dispatch({
        type: GET_STATES_REQUEST,
      });
      setToast(true);
    }
    if (updateStates) {
      setToastMessage("State Updated Successfully");
      dispatch({
        type: GET_STATES_REQUEST,
      });
      setToast(true);
    }
    if (deleteStates) {
      setToastMessage("State Deleted Successfully");
      dispatch({
        type: GET_STATES_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("State Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_STATES_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addStates, updateStates, updateCommon, deleteStates, listStates, toast]);

  const handleClicks = async () => {
    const selectData = await getSelectData('country_name', "", 'country')
    setOptionCountry(selectData?.getDataByColNameData)
    setSelectedCountry({})
    setFormData({
      state_name_alias: "",
      state_code: "",
      state_description: "",
      external_state_id_1: "",
      external_state_id_2: "",
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
        type: DELETE_STATES_REQUEST,
        payload: rowData.id,
      });
      setDeleteModal(false)
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleInputChange = useCallback(
    debounce(async (inputValue) => {
      try {
        const selectData = await getSelectData('country_name', inputValue, 'country');
        setOptionCountry(selectData?.getDataByColNameData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, 300),
    []
  );

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'state_name_alias' && value.length > 50) {
      setFormErrors({
        ...formErrors,
        state_name_alias: "Name cannot be more than 50 characters"
      });
    }else {
      setFormErrors({
        ...formErrors,
        state_name_alias: ""
      });
    }
    if (name === 'state_description' && value.length > 50) {
      setFormErrors({
        ...formErrors,
        state_description: "Description cannot be more than 50 characters"
      });
    }else {
      setFormErrors({
        ...formErrors,
        state_description: ""
      });
    }
    if (name === 'state_code') {
      if (value.length > 3) {
        newValue = value.slice(0, 3);
        setFormErrors({
          ...formErrors,
          state_code: "State Code cannot be more than 3 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          state_code: ""
        });
      }
    }
    if (name === 'external_state_id_1') {
      if (value.length > 3) {
        newValue = value.slice(0, 3);
        setFormErrors({
          ...formErrors,
          external_state_id_1: "External State Id Code 1 cannot be more than 3 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          external_state_id_1: ""
        });
      }
    }
    if (name === 'external_state_id_2') {
      if (value.length > 3) {
        newValue = value.slice(0, 3);
        setFormErrors({
          ...formErrors,
          external_state_id_2: "External State Id Code 2 cannot be more than 3 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          external_state_id_2: ""
        });
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.state_name_alias.trim()) {
      errors.state_name_alias = "State Name is required";
    }
    else if (formData.state_name_alias.length > 50) {
      errors.state_name_alias = "State Name cannot be more than 50 characters"
    }
    if (!formData.state_code) {
      errors.state_code = "State Code is required";
    } else if (formData.state_code.length > 3) {
      errors.state_code = "State cannot be more than 3 characters"
    }
    if (Object.keys(selectCountry).length === 0) {
      errors.country = "Country Name is required";
    }
    if (!formData.external_state_id_1) {
      errors.external_state_id_1 = "External State ID 1 is required";
    } else if (formData.external_state_id_1.length > 3) {
      errors.external_state_id_1 = "State cannot be more than 3 characters"
    }
    if (!formData.external_state_id_2) {
      errors.external_state_id_2 = "External State ID 2  is required";
    } else if (formData.external_state_id_2.length > 3) {
      errors.external_state_id_2 = "State cannot be more than 3 characters"
    }

    if (!formData.state_description.trim()) {
      errors.state_description = "State description is required";
    }
    else if (formData.state_description.length > 50) {
      errors.state_description = "State Description cannot be more than 50 characters"
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
        const StateData = {
          formData,
          selectCountry,
          isActive,
          Id,
        };
        dispatch({
          type: UPDATE_STATES_REQUEST,
          payload: StateData,
        });
      } else {
        const StateData = {
          formData,
          selectCountry,
          isActive,
        };
        dispatch({
          type: ADD_STATES_REQUEST,
          payload: StateData,
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
    setSelectedCountry(data?.country)
    setFormData({
      state_name_alias: data?.state_name_alias,
      state_code: data?.state_code,
      state_description: data?.state_description,
      external_state_id_1: data?.external_state_id_1,
      external_state_id_2: data?.external_state_id_2,
      isactive: data?.isactive,
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
        Header: "Country",
        accessor: "country.label",
      },
      {
        Header: "State",
        accessor: "state_name_alias",
      },
      {
        Header: "State Code",
        accessor: "state_code",
      },
      {
        Header: "Description",
        accessor: "state_description",
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
                        name: "states",
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
              {statePermission && statePermission?.can_edit ? (
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

              {statePermission && statePermission?.can_delete ? (
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
    [status, statePermission]
  );

  document.title = "Detergent | State";
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
          <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="States" />

          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={states && states.length > 0 ? states : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                statePermission && statePermission?.can_add
                  ? "Add State"
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
                <Col md={4} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">State Name</Label>
                    <Input
                      type="text"
                      name="state_name_alias"
                      className={`form-control ${formErrors.state_name_alias ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter here"
                      value={formData?.state_name_alias}
                      onChange={handleChange}
                    />
                    {formErrors.state_name_alias && (
                      <div className="invalid-feedback">
                        {formErrors.state_name_alias}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">State Code</Label>
                    <Input
                      type="text"
                      name="state_code"
                      className={`form-control ${formErrors.state_code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter here"
                      value={formData?.state_code}
                      onChange={handleChange}
                    />
                    {formErrors.state_code && (
                      <div className="invalid-feedback">
                        {formErrors.state_code}
                      </div>
                    )}
                  </div>
                </Col>
                
                <Col md={4} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">Country Name</Label>
                    <Select
                      value={selectCountry}
                      onChange={(selectCountry) => setSelectedCountry(selectCountry)}
                      onInputChange={(inputValue, { action }) => {
                        setInputValue(inputValue);
                        handleInputChange(inputValue);
                      }}
                      options={optionCountry}
                    />
                    {formErrors.country && (
                      <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                        {formErrors.country}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="countryDescription">State Description</Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="state_description"
                    className={`form-control ${formErrors.state_description ? "is-invalid" : ""
                      }`}
                    value={formData.state_description}
                    rows="3"
                    placeholder="Enter Country Description"
                    onChange={handleChange}
                  />
                  {formErrors.state_description && (
                    <div className="invalid-feedback">
                      {formErrors.state_description}
                    </div>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">External State ID Code 1</Label>
                    <Input
                      type="text"
                      name="external_state_id_1"
                      className={`form-control ${formErrors.external_state_id_1 ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter here"
                      value={formData?.external_state_id_1}
                      onChange={handleChange}
                    />
                    {formErrors.external_state_id_1 && (
                      <div className="invalid-feedback">
                        {formErrors.external_state_id_1}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">External State ID Code 2</Label>
                    <Input
                      type="text"
                      name="external_state_id_2"
                      className={`form-control ${formErrors.external_state_id_2 ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter here"
                      value={formData?.external_state_id_2}
                      onChange={handleChange}
                    />
                    {formErrors.external_state_id_2 && (
                      <div className="invalid-feedback">
                        {formErrors.external_state_id_2}
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

export default States;
