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
  ADD_QUALITYCHECK_REQUEST,
  GET_QUALITYCHECK_REQUEST,
  UPDATE_QUALITYCHECK_REQUEST,
  DELETE_QUALITYCHECK_REQUEST,
} from "../../../store/QualityCheck/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
const QualityCheck = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const {
    qualitycheck,
    addQualityCheck,
    updateQualityCheck,
    deleteQualityCheck,
    error,
  } = useSelector(state => state.workingCalender);

  const aaaa = useSelector(state => state);


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
  const [formData, setFormData] = useState({
    quality_desc: "",
    quality_code: "",
    isactive: isActive,
  });

  useEffect(() => {
    dispatch({
      type: GET_QUALITYCHECK_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (addQualityCheck) {
      setToastMessage("Quality Check Added Successfully");
      dispatch({
        type: GET_QUALITYCHECK_REQUEST,
      });
      setToast(true);
    }
    if (updateQualityCheck) {
      setToastMessage("Quality Check Updated Successfully");
      dispatch({
        type: GET_QUALITYCHECK_REQUEST,
      });
      setToast(true);
    }
    if (deleteQualityCheck) {
      setToastMessage("Quality Check Deleted Successfully");
      dispatch({
        type: GET_QUALITYCHECK_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Quality Check Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_QUALITYCHECK_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    addQualityCheck,
    updateQualityCheck,
    updateCommon,
    deleteQualityCheck,
    toast,
  ]);

  const handleClicks = () => {
    setFormData({
      quality_desc: "",
      quality_code: "",
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
        type: DELETE_QUALITYCHECK_REQUEST,
        payload: rowData.id,
      });
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.quality_code) {
      errors.quality_code = "Quality Check Code is required";
    }
    if (!formData.quality_desc) {
      errors.quality_desc = "Quality Check Description is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  console.log("aa", formErrors)
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
          type: UPDATE_QUALITYCHECK_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_QUALITYCHECK_REQUEST,
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
    setFormData({
      quality_code: data?.quality_code || "",
      quality_desc: data?.quality_desc || "",
      isactive: data?.isactive || true,
    });
    setModal(true);
    if (data) {
      setIsActive(data.isactive);
    }
  };

  const resetForm = () => {
    setErrors({});
    setEdit(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Quality Code",
        accessor: "quality_code",
      },
      {
        Header: "Quality Description",
        accessor: "quality_desc",
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
          <Breadcrumbs titlePath="#" title="GRN" breadcrumbItem="Quality Check" />
          <TableContainer
            columns={columns}
            data={[]}
            isGlobalFilter={true}
            isAddOptions={true}
            customPageSize={10}
            className="custom-header-css"
            addButtonLabel={"Add Quality Check"}
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
                  <Label htmlFor="countryDescription">
                   Quality Check Code
                  </Label>
                  <Input
                    type="text"
                    id="countryDescription"
                    name="quality_code"
                    className={`form-control ${formErrors.quality_code ? "is-invalid" : ""
                      }`}
                    value={formData.quality_code}
                    rows="3"
                    placeholder="Please Enter Quality Check Code"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        quality_code: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        quality_code: "", // Clear error when user starts typing
                      }));
                    }}
                  />
                  {formErrors.quality_code && (
                    <div className="invalid-feedback">
                      {formErrors.quality_code}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <div className="">
                    <Label htmlFor="formrow-state-Input">
                      Quality Check Description
                    </Label>
                    <Input
                      type="textarea"
                      name="quality_desc"
                      className={`form-control ${formErrors.quality_desc ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Quality Check Description"
                      value={formData?.quality_desc}
                      onChange={handleChange}
                    />
                    {formErrors.quality_desc && (
                      <div className="invalid-feedback">
                        {formErrors.quality_desc}
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

export default QualityCheck;
