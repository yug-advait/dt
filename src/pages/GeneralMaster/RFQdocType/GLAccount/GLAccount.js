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
  ADD_GLACCOUNT_REQUEST,
  GET_GLACCOUNT_REQUEST,
  UPDATE_GLACCOUNT_REQUEST,
  DELETE_GLACCOUNT_REQUEST,
} from "../../../store/glAccount/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { getSelectData } from "helpers/Api/api_common";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
import { useSelector, useDispatch } from "react-redux";
const GLAccount = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { glaccount, addGLAccount, listGLAAccount, updateGLAccount, deleteGLAccount, error } = useSelector(
    state => state.GLAccount
  );
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [rowData, setRowData] = useState("")
  const [toastMessage, setToastMessage] = useState()
  const [optionCountry, setOptionCountry] = useState([])
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [selectCountry, setSelectedCountry] = useState({})
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [glAccountPermission, setGlAccountPermission] = useState();
  const [formData, setFormData] = useState({
    gl_account_code: "",
    gl_account_description: "",
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
        permission.sub_menu_name === "gl_account"
    );
    setGlAccountPermission(
      permissions.find(permission => permission.sub_menu_name === "gl_account")
    );
    dispatch({
      type: GET_GLACCOUNT_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listGLAAccount) {
      setLoading(false)
    }
    if (addGLAccount) {
      setToastMessage("GL Account Added Successfully");
      dispatch({
        type: GET_GLACCOUNT_REQUEST,
      });
      setToast(true);
    }
    if (updateGLAccount) {
      setToastMessage("GL Account Updated Successfully");
      dispatch({
        type: GET_GLACCOUNT_REQUEST,
      });
      setToast(true);
    }
    if (deleteGLAccount) {
      setToastMessage("GL Account Deleted Successfully");
      dispatch({
        type: GET_GLACCOUNT_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("GL Account Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_GLACCOUNT_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addGLAccount, updateGLAccount, listGLAAccount, updateCommon, deleteGLAccount, toast]);

  const handleClicks = async () => {
    const selectData = await getSelectData('country_name', "", 'country')
    setOptionCountry(selectData?.getDataByColNameData)
    setSelectedCountry({})
    setFormData({
      gl_account_code: "",
      gl_account_description: "",
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
        type: DELETE_GLACCOUNT_REQUEST,
        payload: rowData.id,
      });
      setDeleteModal(false)
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  // const handleInputChange = useCallback(
  //   debounce(async (inputValue) => {
  //     try {
  //       const selectData = await getSelectData('country_name', inputValue, 'country');
  //       setOptionCountry(selectData?.getDataByColNameData);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   }, 300),
  //   []
  // );

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check if the GL Account Code length exceeds 4 characters
    if (name === 'gl_account_code' && value.length > 4) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        gl_account_code: "GL Account Code must be 4 characters or less",
      }));
    } else {
      // Clear the error if the length is within the limit
      setFormErrors(prevErrors => ({
        ...prevErrors,
        gl_account_code: "",
      }));
    }
  };


  const validateForm = () => {
    const errors = {};
    if (!formData.gl_account_code.trim()) {
      errors.gl_account_code = "GL Account Code is required";
    }
    else if (formData.gl_account_code.length > 4) {
      errors.gl_account_code = "GL Account Code must be 4 characters or less";
    }
    if (!formData.gl_account_description.trim()) {
      errors.gl_account_description = "GL Account Description is required";
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
          type: UPDATE_GLACCOUNT_REQUEST,
          payload: StateData,
        });
      } else {
        const StateData = {
          formData,
          selectCountry,
          isActive,
        };
        dispatch({
          type: ADD_GLACCOUNT_REQUEST,
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
      gl_account_code: data?.gl_account_code || "",
      gl_account_description: data?.gl_account_description || "",
      isactive: data?.isactive,
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
        Header: "Code",
        accessor: "gl_account_code",
      },
      {
        Header: "Description",
        accessor: "gl_account_description",
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
                        name: "gl_account",
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
              {glAccountPermission && glAccountPermission?.can_edit ? (
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
              {glAccountPermission && glAccountPermission?.can_delete ? (
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
    [status, glAccountPermission]
  );

  document.title = "Detergent | GL Account";
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
          <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="GL Account" />
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={glaccount && glaccount.length > 0 ? glaccount : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                glAccountPermission && glAccountPermission?.can_add
                  ? "Add GL Account"
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
                    <Label htmlFor="formrow-state-Input">GL Account Code</Label>
                    <Input
                      type="text"
                      name="gl_account_code"
                      className={`form-control ${formErrors.gl_account_code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter GL Account"
                      value={formData?.gl_account_code}
                      onChange={handleChange}
                    />
                    {formErrors.gl_account_code && (
                      <div className="invalid-feedback">
                        {formErrors.gl_account_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="countryDescription">GL Account Description</Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="gl_account_description"
                    className={`form-control ${formErrors.gl_account_description ? "is-invalid" : ""
                      }`}
                    value={formData.gl_account_description}
                    rows="3"
                    placeholder="Please Enter GL Account Description"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        gl_account_description: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        gl_account_description: "", // Clear error when user starts typing
                      }));
                    }}
                  />
                  {formErrors.gl_account_description && (
                    <div className="invalid-feedback">
                      {formErrors.gl_account_description}
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

export default GLAccount;
