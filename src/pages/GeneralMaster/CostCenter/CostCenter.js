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
import InvoiceDownloader from "../../../components/InvoiceFormat"; // Import the new component
import moment from "moment";
import {
  ADD_COSTCENTER_REQUEST,
  GET_COSTCENTER_REQUEST,
  UPDATE_COSTCENTER_REQUEST,
  DELETE_COSTCENTER_REQUEST,
} from "../../../store/costCenter/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { getSelectData } from "helpers/Api/api_common";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const CostCenter = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { costcenter, addCostCenter, updateCostCenter, listCostCenter, deleteCostCenter } = useSelector(
    state => state.costCenter
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
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [costcenterPermission, setCostCenterPermission] = useState();
  const [formData, setFormData] = useState({
    cost_center_code: "",
    cost_center_description: "",
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
    const costProfit = location.pathname == "/products/cost_center" ? 'cost_center' : 'profit_center'
    var permissions = userData?.permissionList?.filter(
      permission =>
        permission.sub_menu_name === costProfit
    );
    setCostCenterPermission(
      permissions.find(permission => permission.sub_menu_name === costProfit)
    );
    dispatch({
      type: GET_COSTCENTER_REQUEST,
      payload: {
        cost_profit_type: location.pathname == "/products/cost_center" ? 'c' : 'p'
      },
    });
  }, []);

  useEffect(() => {
    if (listCostCenter) {
      setLoading(false)
    }
    if (addCostCenter) {
      setToastMessage(location.pathname === "/products/cost_center" ? 'Cost Center Added Successfully ' : 'Profit Center Added Successfully');
      dispatch({
        type: GET_COSTCENTER_REQUEST,
        payload: {
          cost_profit_type: location.pathname == "/products/cost_center" ? 'c' : 'p'
        },
      });
      setToast(true);
    }
    if (updateCostCenter) {
      setToastMessage(location.pathname === "/products/cost_center" ? 'Cost Center Updated Successfully ' : 'Profit Center Updated Successfully');
      dispatch({
        type: GET_COSTCENTER_REQUEST,
        payload: {
          cost_profit_type: location.pathname == "/products/cost_center" ? 'c' : 'p'
        },
      });
      setToast(true);
    }
    if (deleteCostCenter) {
      setToastMessage(location.pathname === "/products/cost_center" ? 'Cost Center Deleted Successfully ' : 'Profit Center Deleted Successfully');
      dispatch({
        type: GET_COSTCENTER_REQUEST,
        payload: {
          cost_profit_type: location.pathname == "/products/cost_center" ? 'c' : 'p'
        },
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage(location.pathname === "/products/cost_center" ? 'Cost Center Updated Successfully ' : 'Profit Center Updated Successfully');
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_COSTCENTER_REQUEST,
        payload: {
          cost_profit_type: location.pathname == "/products/cost_center" ? 'c' : 'p'
        },
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addCostCenter, updateCostCenter, listCostCenter, updateCommon, deleteCostCenter, toast]);

  const handleClicks = async () => {
    const selectData = await getSelectData('country_name', "", 'country')
    setOptionCountry(selectData?.getDataByColNameData)
    setSelectedCountry({})
    setFormData({
      cost_center_code: "",
      cost_center_description: "",
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
        type: DELETE_COSTCENTER_REQUEST,
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

    if (name === 'cost_center_code') {
      if (value.length > 4) {
        newValue = value.slice(0, 4);
        setFormErrors({
          ...formErrors,
          cost_center_code: "Code cannot be more than 4 characters"
        });
      } else {
        setFormErrors({
          ...formErrors,
          cost_center_code: ""
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
    if (!formData.cost_center_code.trim()) {
      errors.cost_center_code = "Code is required";
    } else if (formData.cost_center_code.trim().length > 4) {
      errors.cost_center_code = "Code cannot be more than 4 characters"
    }
    if (!formData.cost_center_description.trim()) {
      errors.cost_center_description = "Description is required";
    } else if (formData.cost_center_description.trim().length > 50) {
      errors.cost_center_description = "Description cannot be more than 50 characters"
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
          selectCountry,
          isActive,
          cost_profit_type: location.pathname == "/products/cost_center" ? 'c' : 'p',
          Id,
        };
        dispatch({
          type: UPDATE_COSTCENTER_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          cost_profit_type: location.pathname == "/products/cost_center" ? 'c' : 'p',
          selectCountry,
          isActive,
        };
        dispatch({
          type: ADD_COSTCENTER_REQUEST,
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
    setSelectedCountry(data?.country)
    setFormData({
      cost_center_code: data?.cost_center_code || "",
      cost_center_description: data?.cost_center_description || "",
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
        Header: "Code",
        accessor: "cost_center_code",
      },
      {
        Header: "Description",
        accessor: "cost_center_description",
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
                        name: "cost_center",
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
              {costcenterPermission && costcenterPermission?.can_edit ? (
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
              {costcenterPermission && costcenterPermission?.can_delete ? (
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
    [status, costcenterPermission]
  );

  document.title = location.pathname === "/products/cost_center" ? 'Detergent | Cost Center' : 'Detergent | Profit Center';
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
          <Breadcrumbs titlePath="#" title="Master" breadcrumbItem={location.pathname === "/products/cost_center" ? 'Cost Center' : 'Profit Center'} />
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={costcenter && costcenter.length > 0 ? costcenter : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                costcenterPermission && costcenterPermission.can_add
                  ? (location.pathname === "/products/cost_center" ? 'Add Cost Center' : 'Add Profit Center')
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
                    <Label htmlFor="formrow-state-Input">Code</Label>
                    <Input
                      type="text"
                      name="cost_center_code"
                      className={`form-control ${formErrors.cost_center_code ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Code"
                      value={formData?.cost_center_code}
                      onChange={handleChange}
                    />
                    {formErrors.cost_center_code && (
                      <div className="invalid-feedback">
                        {formErrors.cost_center_code}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="countryDescription">Description</Label>
                  <Input
                    type="textarea"
                    id="countryDescription"
                    name="cost_center_description"
                    className={`form-control ${formErrors.cost_center_description ? "is-invalid" : ""
                      }`}
                    value={formData.cost_center_description}
                    rows="3"
                    placeholder="Please Enter Description"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        cost_center_description: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        cost_center_description: "",
                      }));
                    }}
                  />
                  {formErrors.cost_center_description && (
                    <div className="invalid-feedback">
                      {formErrors.cost_center_description}
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

export default CostCenter;