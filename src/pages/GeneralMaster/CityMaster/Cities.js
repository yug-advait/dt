import React, { useEffect, useMemo, useState,useCallback  } from "react";
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
  ADD_CITIES_REQUEST,
  GET_CITIES_REQUEST,
  UPDATE_CITIES_REQUEST,
  DELETE_CITIES_REQUEST,
} from "../../../store/cities/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { getSelectData, getRelatedRecords } from "helpers/Api/api_common";
import { useSelector, useDispatch } from "react-redux";
const Cities = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { cities, addCities, updateCities, deleteCities, error } = useSelector(
    state => state.cities
  );
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [rowData, setRowData] = useState("")
  const [toastMessage, setToastMessage] = useState()
  const [optionCountry, setOptionCountry] = useState([])
  const [selectState, setSelectedState] = useState({});
  const [optionState, setOptionState] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [selectCountry, setSelectedCountry] = useState({})
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    city_code: "",
    city_name: "",
    city_description: "", 
    state_id: "", 
    country_id:"", 
    isactive: isActive
  });

  useEffect( () => {
    dispatch({
      type: GET_CITIES_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (addCities) {
      setToastMessage("Cities Added Successfully");
      dispatch({
        type: GET_CITIES_REQUEST,
      });
      setToast(true);
    }
    if (updateCities) {
      setToastMessage("Cities Updated Successfully");
      dispatch({
        type: GET_CITIES_REQUEST,
      });
      setToast(true);
    }
    if (deleteCities) {
      setToastMessage("Cities Deleted Successfully");
      dispatch({
        type: GET_CITIES_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Cities Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_CITIES_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addCities, updateCities, updateCommon, deleteCities, toast]);

  const handleClicks = async () => {
    const selectData = await getSelectData('country_name', "", 'country')
    setOptionCountry(selectData?.getDataByColNameData)
    setSelectedCountry({})
    setFormData({
      city_code: "",
      city_name: "",
      city_description: "", 
      state_id: "", 
      country_id:"", 
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
        type: DELETE_CITIES_REQUEST,
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (Object.keys(selectCountry).length === 0) {
      errors.country = "Country Name is required";
    }
    if (Object.keys(selectState).length === 0) {
      errors.state_id = "State Name is required";
    }
    if (!formData.city_code) {
      errors.city_code = "City Code is required";
    }
    if (!formData.city_name) {
      errors.city_name = "City Name is required";
    }
    if (!formData.city_description) {
      errors.city_description = "City Description is required";
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
          type: UPDATE_CITIES_REQUEST,
          payload: StateData,
        });
      } else {
        const StateData = {
          formData,
          selectCountry,
          isActive,
        };
        dispatch({
          type: ADD_CITIES_REQUEST,
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
    setSelectedState(data?.states)
    setFormData({
    city_code:data?.city_code || "",
    city_name:data?.city_name || "",
    city_description:data?.city_description || "",
    state_id:data?.state_id || "",
    country_id:data?.country_id || "",
    isactive: data?.isactive || true,
    })
    
    setModal(true)
    if (data) {
      setIsActive(data.isactive)
    }
  }

  const resetForm = () => {
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
        accessor: "states.label",
      },
      {
        Header: "City Code",
        accessor: "city_code"
      },
      {
        Header: "City Name",
        accessor: "city_name"
      },
      {
        Header: "City Discription",
        accessor: "city_description"
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
                        name: "cities",
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

  document.title = "Detergent | Cities";
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
          <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="Cities" />
          <TableContainer
            columns={columns}
            data={cities && cities.length > 0 ? cities : []}
            isGlobalFilter={true}
            isAddOptions={true}
            customPageSize={10}
            className="custom-header-css"
            addButtonLabel={"Add Cities"}
            handleClicks={handleClicks}
          />
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
                    <Label htmlFor="formrow-state-Input">Country Name</Label>
                    <Select
                      value={selectCountry}
                      onChange={async selectCountry => {
                        setOptionState([]);
                        setSelectedState({});
                        setSelectedCountry(selectCountry);
                        setFormData(prevData => ({
                          ...prevData,
                          country_id: selectCountry?.value,
                        }));
                        const selectStateData = await getRelatedRecords(
                          "states",
                          "state_name_alias",
                          "country_id",
                          selectCountry?.value
                        );
                        setOptionState(selectStateData?.getRelatedRecordsData);
                      }}
                      onInputChange={(inputValue, { action }) => {
                        handleInputChange(inputValue);
                      }}
                      options={optionCountry}
                    />
                    {formErrors.country && (
                      <div style={{color:'#f46a6a',fontSize:'80%'}}>
                        {formErrors.country}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">State Name</Label>
                    <Select
                      value={selectState}
                      onChange={selectState => {
                        setSelectedState(selectState);
                        setFormData(prevData => ({
                          ...prevData,
                          state_id: selectState?.value,
                        }));
                      }}
                      options={optionState}
                    />
                    {formErrors.state_id && (
                      <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                        {formErrors.state_id}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">City Name</Label>
                    <Input
                      type="text"
                      name="city_name"
                      className={`form-control ${
                        formErrors.city_name ? "is-invalid" : ""
                      }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter city Name"
                      value={formData?.city_name}
                      onChange={handleChange}
                    />
                    {formErrors.city_name && (
                      <div className="invalid-feedback">{formErrors.city_name}</div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">City Code</Label>
                    <Input
                      type="text"
                      name="city_code"
                      className={`form-control ${
                        formErrors.city_code ? "is-invalid" : ""
                      }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter City Code"
                      value={formData?.city_code}
                      onChange={handleChange}
                    />
                    {formErrors.city_code && (
                      <div className="invalid-feedback">{formErrors.city_code}</div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <div className="mb-3">
                    <Label htmlFor="formrow-state-Input">City Description</Label>
                    <Input
                      type="text"
                      name="city_description"
                      className={`form-control ${
                        formErrors.city_description ? "is-invalid" : ""
                      }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Description"
                      value={formData?.city_description}
                      onChange={handleChange}
                    />
                    {formErrors.city_description && (
                      <div className="invalid-feedback">{formErrors.city_description}</div>
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

export default Cities;
