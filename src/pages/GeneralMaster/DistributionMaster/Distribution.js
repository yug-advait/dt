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
  ADD_DISTRIBUTION_REQUEST,
  GET_DISTRIBUTION_REQUEST,
  UPDATE_DISTRIBUTION_REQUEST,
  DELETE_DISTRIBUTION_REQUEST,
} from "../../../store/distribution/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
const Distribution = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { distribution, addDistribution,listDistribution, updateDistribution, deleteDistribution, error } = useSelector(
    state => state.distribution
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
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    distribution_code: "",
    distribution_description: "",
    isactive: isActive
  });

  useEffect( () => {
    dispatch({
      type: GET_DISTRIBUTION_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listDistribution) {
      setLoading(false)
    }
    if (addDistribution) {
      setToastMessage("Distribution Added Successfully");
      dispatch({
        type: GET_DISTRIBUTION_REQUEST,
      });
      setToast(true);
    }
    if (updateDistribution) {
      setToastMessage("Distribution Updated Successfully");
      dispatch({
        type: GET_DISTRIBUTION_REQUEST,
      });
      setToast(true);
    }
    if (deleteDistribution) {
      setToastMessage("Distribution Deleted Successfully");
      dispatch({
        type: GET_DISTRIBUTION_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Distribution Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      })
      dispatch({
        type: GET_DISTRIBUTION_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addDistribution, updateDistribution,updateCommon, deleteDistribution, toast]);

  const handleClicks = () => {
    setFormData({
      distribution_code: "",
      distribution_description: "",
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
        type: DELETE_DISTRIBUTION_REQUEST,
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

    if (name === 'distribution_code' && value.length > 2) {
      newValue = value.slice(0, 2); 
      setFormErrors({
        ...formErrors,
        distribution_code: "Distribution Code cannot be more than 2 characters"
      });
    } else {
     
      setFormErrors({
        ...formErrors,
        distribution_code: ""
      });
    }

    if (name === 'distribution_description' && value.length > 50) {
      newValue = value.slice(0, 50); 
      setFormErrors({
        ...formErrors,
        distribution_description: "Distribution Description cannot be more than 50 characters"
      });
    } else {
     
      setFormErrors({
        ...formErrors,
        distribution_description: ""
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.distribution_code.trim()) {
      errors.distribution_code = "Distribution Code is required";
    } else if (formData.distribution_code.length > 2) {
      errors.distribution_code = "Distribution Code cannot be more than 2 characters"
    }

    if (!formData.distribution_description.trim()) {
      errors.distribution_description = "Distribution Description is required";
    } else if (formData.distribution_description.length > 50) {
      errors.distribution_description = "Distribution Description cannot be more than 50 characters"
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
          isActive,
          Id,
        };
        dispatch({
          type: UPDATE_DISTRIBUTION_REQUEST,
          payload: StateData,
        });
      } else {
        const StateData = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_DISTRIBUTION_REQUEST,
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
   setFormData({
    distribution_code: data?.distribution_code,
    distribution_description: data?.distribution_description,
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
        Header: "Distribution Code",
        accessor: "distribution_code",
      },
      {
        Header: "Distribution Description",
        accessor: "distribution_description",
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
                        name: "distribution_methods",
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

  document.title = "Detergent | Distribution";
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
          <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="Distribution" />
          {loading ? (
            <Loader />
          ) : (
          <TableContainer
            columns={columns}
            data={distribution && distribution.length > 0 ? distribution : []}
            isGlobalFilter={true}
            isAddOptions={true}
            customPageSize={10}
            className="custom-header-css"
            addButtonLabel={"Add Distribution"}
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
                    <Label htmlFor="formrow-state-Input">Distribution Code</Label>
                    <Input
                      type="text"
                      name="distribution_code"
                      className={`form-control ${
                        formErrors.distribution_code ? "is-invalid" : ""
                      }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Distribution Code"
                      value={formData?.distribution_code}
                      onChange={handleChange}
                    />
                    {formErrors.distribution_code && (
                      <div className="invalid-feedback">
                        {formErrors.distribution_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="countryDescription">Distribution Description</Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="distribution_description"
                    className={`form-control ${
                      formErrors.distribution_description ? "is-invalid" : ""
                    }`}
                    value={formData.distribution_description}
                    rows="3"
                    placeholder="Please Enter Distribution Description"
                    onChange={handleChange}
                  />
                  {formErrors.distribution_description && (
                    <div className="invalid-feedback">
                      {formErrors.distribution_description}
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

export default Distribution;
