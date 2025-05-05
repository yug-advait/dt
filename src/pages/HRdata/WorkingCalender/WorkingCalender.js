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
  Alert,
} from "reactstrap";
import { Link } from "react-router-dom";
import Select from "react-select";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import { getSelectData } from "helpers/Api/api_common";
import DeleteModal from "components/Common/DeleteModal";
import debounce from "lodash/debounce";
import {
  ADD_WORKINGCALENDER_REQUEST,
  GET_WORKINGCALENDER_REQUEST,
  UPDATE_WORKINGCALENDER_REQUEST,
  DELETE_WORKINGCALENDER_REQUEST,
} from "../../../store/workingCalender/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const WorkingCalender = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const {
    listWorkingCalender,
    workingcalender,
    addworkingCalender,
    updateworkingCalender,
    deleteworkingCalender,
    error,
  } = useSelector(state => state.workingCalender);
  const [loading, setLoading] = useState(true);
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [optionCountry, setOptionCountry] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectCountry, setSelectedCountry] = useState({});
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [workingCalenderPermission, setWorkingCalenderPermission] = useState();
  const [formData, setFormData] = useState({
    country_id: "",
    calender_id: "",
    calender_description: "",
    calender_indicator: false,
    week_day_monday: false,
    week_day_tuesday: false,
    week_day_wednesday: false,
    week_day_thursday: false,
    week_day_friday: false,
    week_day_saturday: false,
    week_day_sunday: false,
    isactive: isActive,
  });


  const countryState = async () => {
    const selectData = await getSelectData("country_name", "", "country");
    setOptionCountry(selectData?.getDataByColNameData);
  };

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
        permission.sub_menu_name === "working_calendar"
    );
    setWorkingCalenderPermission(
      permissions.find(permission => permission.sub_menu_name === "working_calendar")
    );
    countryState();
    dispatch({
      type: GET_WORKINGCALENDER_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listWorkingCalender) {
      setLoading(false)
    }
    if (addworkingCalender) {
      setToastMessage("Working Calender Added Successfully");
      dispatch({
        type: GET_WORKINGCALENDER_REQUEST,
      });
      setToast(true);
    }
    if (updateworkingCalender) {
      setToastMessage("Working Calender Updated Successfully");
      dispatch({
        type: GET_WORKINGCALENDER_REQUEST,
      });
      setToast(true);
    }
    if (deleteworkingCalender) {
      setToastMessage("Working Calender Deleted Successfully");
      dispatch({
        type: GET_WORKINGCALENDER_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Working Calender Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_WORKINGCALENDER_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    listWorkingCalender,
    addworkingCalender,
    updateworkingCalender,
    updateCommon,
    deleteworkingCalender,
    toast,
  ]);

  const handleClicks = () => {
    setEdit(null);
    setRowData("");
    setSelectedCountry({})
    setFormData({
      country_id: "",
      calender_id: "",
      calender_description: "",
      calender_indicator: false,
      week_day_monday: false,
      week_day_tuesday: false,
      week_day_wednesday: false,
      week_day_thursday: false,
      week_day_friday: false,
      week_day_saturday: false,
      week_day_sunday: false,
      isactive: true,
    });
    setModal(true);
  };
  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      dispatch({
        type: DELETE_WORKINGCALENDER_REQUEST,
        payload: rowData.id,
      });
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleInputChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectData = await getSelectData(
          "country_name",
          inputValue,
          "country"
        );
        setOptionCountry(selectData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'calender_id' && value.length > 2) {
      newValue = value.slice(0, 2);
      setFormErrors({
        ...formErrors,
        calender_id: "Calendar ID cannot be more than 2 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        calender_id: ""
      });
    }
    if (name === 'calender_description' && value.length > 50) {
      newValue = value.slice(0, 50);
      setFormErrors({
        ...formErrors,
        calender_description: "Calendar Description cannot be more than 50 characters"
      });
    } else {

      setFormErrors({
        ...formErrors,
        calender_description: ""
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (Object.keys(selectCountry).length === 0) {
      errors.country = "Country is required";
    }
    if (!formData.calender_id) {
      errors.calender_id = "Calendar ID is required";
    } else if (formData.calender_id.length > 2) {
      errors.calender_id = "Calendar ID cannot be more than 2 characters"
    }

    if (!formData.calender_description) {
      errors.calender_description = "Calender Description is required";
    }
    else if (formData.calender_description.length > 50) {
      errors.calender_description = "Calendar ID cannot be more than 50 characters"
    }

    // if (!formData?.calender_indicator) {
    //   errors.calendar_indicator = "Calendar Indicator is required";
    // }

    // if (!mondayChecked) {
    //   errors.week_day_monday = "Monday is required";
    // }

    // if (!tuesdayChecked) {
    //   errors.week_day_tuesday = "Tuesday is required";
    // }

    // if (!wednesdayChecked) {
    //   errors.week_day_wednesday = "Wednesday is required";
    // }

    // if (!thursdayChecked) {
    //   errors.week_day_thursday = "Thursday is required";
    // }

    // if (!fridayChecked) {
    //   errors.week_day_friday = "Friday is required";
    // }

    // if (!saturdayChecked) {
    //   errors.week_day_saturday = "Saturday is required";
    // }

    // if (!sundayChecked) {
    //   errors.week_day_sunday = "Sunday is required";
    // }
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
          type: UPDATE_WORKINGCALENDER_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_WORKINGCALENDER_REQUEST,
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
    setEdit(data);
    setRowData(data);
    setSelectedCountry(data?.country)
    setFormData({
      country_id: data?.country.value || "",
      calender_id: data?.calender_id || "",
      calender_description: data?.calender_description || "",
      calender_indicator: data?.calender_indicator || false,
      week_day_monday: data?.week_day_monday || false,
      week_day_tuesday: data?.week_day_tuesday || false,
      week_day_wednesday: data?.week_day_wednesday || false,
      week_day_thursday: data?.week_day_thursday || false,
      week_day_friday: data?.week_day_friday || false,
      week_day_saturday: data?.week_day_saturday || false,
      week_day_sunday: data?.week_day_sunday || false,
      isactive: data?.isactive || true,
    });
    setModal(true);
    if (data) {
      setIsActive(data.isactive);
    }
  };

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
        Header: "Calender Id",
        accessor: "calender_id",
      },
      {
        Header: "Calender Description",
        accessor: "calender_description",
      },
      {
        Header: "Calender Indicator",
        accessor: "calender_indicator",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Monday",
        accessor: "week_day_monday",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Tuesday",
        accessor: "week_day_tuesday",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Wednesday",
        accessor: "week_day_wednesday",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Thursday",
        accessor: "week_day_thursday",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Friday",
        accessor: "week_day_friday",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Saturday",
        accessor: "week_day_saturday",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Sunday",
        accessor: "week_day_sunday",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Created On",
        accessor: "createdon",
        Cell: ({ value }) => {
          const formattedDate = moment(value).format("DD/MM/YYYY");
          return <div>{formattedDate}</div>;
        },
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
                        name: "working_calender",
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
              {workingCalenderPermission && workingCalenderPermission?.can_edit ? (
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

              {workingCalenderPermission && workingCalenderPermission?.can_delete ? (
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
    [status, workingCalenderPermission]
  );

  document.title = "Detergent | Working Calender";
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
          <Breadcrumbs titlePath="#" title="HR Data" breadcrumbItem="Working Calender" />

          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={workingcalender && workingcalender.length > 0 ? workingcalender : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                workingCalenderPermission && workingCalenderPermission?.can_add
                  ? "Add Working Calender"
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
                  <div className="">
                    <Label htmlFor="formrow-state-Input">Country Name</Label>
                    <Select
                      value={selectCountry}
                      onChange={selectCountry => {
                        setSelectedCountry(selectCountry);
                        setFormData(prevData => ({
                          ...prevData,
                          country_id: selectCountry?.value,
                        }));
                      }}
                      onInputChange={(inputValue, { action }) => {
                        setInputValue(inputValue);
                        handleInputChange(inputValue);
                      }}
                      options={optionCountry}
                    />
                    {formErrors.country && (
                      <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                        {formErrors.country}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="countryDescription">
                    Calender Id
                  </Label>
                  <Input
                    type="number"
                    id="countryDescription"
                    name="calender_id"
                    className={`form-control ${formErrors.calender_id ? "is-invalid" : ""
                      }`}
                    value={formData.calender_id}
                    rows="3"
                    placeholder="Please Enter Calender Id"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        calender_id: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        calender_id: "", // Clear error when user starts typing
                      }));
                    }}
                  />
                  {formErrors.calender_id && (
                    <div className="invalid-feedback">
                      {formErrors.calender_id}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <div className="">
                    <Label htmlFor="formrow-state-Input">
                      Calender Description
                    </Label>
                    <Input
                      type="textarea"
                      name="calender_description"
                      className={`form-control ${formErrors.calender_description ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Calender Description"
                      value={formData?.calender_description}
                      onChange={handleChange}
                    />
                    {formErrors.calender_description && (
                      <div className="invalid-feedback">
                        {formErrors.calender_description}
                      </div>
                    )}
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-floating mb-3">
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input input-mini"
                        id="calender_indicator"
                        value="checked"
                        checked={formData?.calender_indicator}
                        onChange={(e) => {
                          setFormData(prevData => ({
                            ...prevData,
                            calender_indicator: e.target.checked,
                          }))
                          // setFormErrors(prevErrors => ({
                          //   ...prevErrors,
                          //   calender_indicator: "",
                          // }))
                        }
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="calender_indicator"
                      >
                        Calender Indicator
                      </label>
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-floating mb-3">
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input input-mini"
                        id="week_day_monday"
                        value="checked"
                        checked={formData?.week_day_monday}
                        onChange={(e) => {
                          setFormData(prevData => ({
                            ...prevData,
                            week_day_monday: e.target.checked,
                          }))
                          // setFormErrors(prevErrors => ({
                          //   ...prevErrors,
                          //   week_day_monday: "",
                          // }))
                        }
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="week_day_monday"
                      >
                        Week Day Monday
                      </label>
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-floating mb-3">
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input input-mini"
                        id="week_day_tuesday"
                        value="checked"
                        checked={formData?.week_day_tuesday}
                        onChange={(e) => {
                          setFormData(prevData => ({
                            ...prevData,
                            week_day_tuesday: e.target.checked,
                          }))
                          // setFormErrors(prevErrors => ({
                          //   ...prevErrors,
                          //   week_day_tuesday: "",
                          // }))
                        }
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="week_day_tuesday"
                      >
                        Week Day Tuesday
                      </label>
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-floating mb-3">
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input input-mini"
                        id="week_day_wednesday"
                        value="checked"
                        checked={formData?.week_day_wednesday}
                        onChange={(e) => {
                          setFormData(prevData => ({
                            ...prevData,
                            week_day_wednesday: e.target.checked,
                          }))
                          // setFormErrors(prevErrors => ({
                          //   ...prevErrors,
                          //   week_day_wednesday: "",
                          // }))
                        }
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="week_day_wednesday"
                      >
                        Week Day Wednesday
                      </label>
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-floating mb-3">
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input input-mini"
                        id="week_day_thursday"
                        value="checked"
                        checked={formData?.week_day_thursday}
                        onChange={(e) => {
                          setFormData(prevData => ({
                            ...prevData,
                            week_day_thursday: e.target.checked,
                          }))
                          // setFormErrors(prevErrors => ({
                          //   ...prevErrors,
                          //   week_day_thursday: "",
                          // }))
                        }
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="week_day_thursday"
                      >
                        Week Day Thursday
                      </label>
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-floating mb-3">
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input input-mini"
                        id="week_day_friday"
                        value="checked"
                        checked={formData?.week_day_friday}
                        onChange={(e) => {
                          setFormData(prevData => ({
                            ...prevData,
                            week_day_friday: e.target.checked,
                          }))
                          // setFormErrors(prevErrors => ({
                          //   ...prevErrors,
                          //   week_day_friday: "",
                          // }))
                        }
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="week_day_friday"
                      >
                        Week Day Friday
                      </label>
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-floating mb-3">
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input input-mini"
                        id="week_day_saturday"
                        value="checked"
                        checked={formData?.week_day_saturday}
                        onChange={(e) => {
                          setFormData(prevData => ({
                            ...prevData,
                            week_day_saturday: e.target.checked,
                          }))
                          // setFormErrors(prevErrors => ({
                          //   ...prevErrors,
                          //   week_day_saturday: "",
                          // }))
                        }
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="week_day_saturday"
                      >
                        Week Day Saturday
                      </label>
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="form-floating mb-3">
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input input-mini"
                        id="week_day_sunday"
                        value="checked"
                        checked={formData?.week_day_sunday}
                        onChange={(e) => {
                          setFormData(prevData => ({
                            ...prevData,
                            week_day_sunday: e.target.checked,
                          }))
                          // setFormErrors(prevErrors => ({
                          //   ...prevErrors,
                          //   week_day_sunday: "",
                          // }))
                        }
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="week_day_sunday"
                      >
                        Week Day Sunday
                      </label>
                    </div>
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

export default WorkingCalender;
