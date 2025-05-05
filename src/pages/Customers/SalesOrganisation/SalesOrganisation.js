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
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Select from "react-select";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
  ADD_SALESORGANISATION_REQUEST,
  GET_SALESORGANISATION_REQUEST,
  UPDATE_SALESORGANISATION_REQUEST,
  DELETE_SALESORGANISATION_REQUEST,
} from "../../../store/salesOrganisation/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const SalesOrganisation = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const {
    salesorganisation,
    addSalesOrganisation,
    updateSalesOrganisation,
    listSalesOrganisation,
    deleteSalesOrganisation,
    error,
  } = useSelector(state => state.salesorganisation);
  const [loading, setLoading] = useState(true);
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectDivision, setSelectedDivision] = useState({});
  const [optionDivision, setOptionDivision] = useState([]);
  const [selectDistribution, setSelectedDistribution] = useState({});
  const [optionDistribution, setOptionDistribution] = useState([]);
  const [selectSalesOffice, setSelectedSalesOffice] = useState({});
  const [optionSalesOffice, setOptionSalesOffice] = useState([]);
  const [salesOrganisationPermission, setsalesOrganisationPermission] = useState();
  const [formData, setFormData] = useState({
    sales_office: "",
    sales_organisation: "",
    distribution_id: "",
    division_id: "",
    isactive: isActive,
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
        permission.sub_menu_name === "sales_organisation"
    );
    setsalesOrganisationPermission(
      permissions.find(permission => permission.sub_menu_name === "sales_organisation")
    );
    dispatch({
      type: GET_SALESORGANISATION_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (addSalesOrganisation) {
      setToastMessage("Sales Organisation Added Successfully");
      dispatch({
        type: GET_SALESORGANISATION_REQUEST,
      });
      setToast(true);
    }
    if (updateSalesOrganisation) {
      setToastMessage("Sales Organisation Updated Successfully");
      dispatch({
        type: GET_SALESORGANISATION_REQUEST,
      });
      setToast(true);
    }
    if (listSalesOrganisation) {
      setLoading(false)
      setOptionDistribution(salesorganisation?.distributions)
      setOptionDivision(salesorganisation?.divisions)
      setOptionSalesOffice(salesorganisation?.salesOffices)
    }
    if (deleteSalesOrganisation) {
      setToastMessage("Sales Organisation Deleted Successfully");
      dispatch({
        type: GET_SALESORGANISATION_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Sales Organisation Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_SALESORGANISATION_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    addSalesOrganisation,
    updateSalesOrganisation,
    listSalesOrganisation,
    updateCommon,
    deleteSalesOrganisation,
    toast,
  ]);

  const handleClicks = () => {
    setSelectedDistribution({})
    setSelectedDivision({})
    setSelectedSalesOffice({})
    setFormData({
      sales_office: "",
      sales_organisation: "",
      distribution_id: "",
      division_id: "",
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
        type: DELETE_SALESORGANISATION_REQUEST,
        payload: rowData.id,
      });
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'sales_organisation' && value.length > 50) {
      setFormErrors({
        ...formErrors,
        sales_organisation: "Sales Organisation cannot be more than 50 characters"
      });
    }else {
      setFormErrors({
        ...formErrors,
        sales_organisation: ""
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.sales_organisation) {
      errors.sales_organisation = "Sales Organisation is required";
    }
    else if (formData.sales_organisation.length > 50) {
      errors.sales_organisation = "Bank Account Number cannot be more than 50 characters"
    }
    if (!formData.distribution_id) {
      errors.distribution_id = "Distribution is required";
    }
    if (!formData.division_id) {
      errors.division_id = "Division is required";
    }
    if (!formData.sales_office) {
      errors.sales_office = "Sales Office is required";
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
          Id,
        };
        dispatch({
          type: UPDATE_SALESORGANISATION_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_SALESORGANISATION_REQUEST,
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
    setSelectedDistribution(data?.distribution)
    setSelectedDivision(data?.division)
    setSelectedSalesOffice(data?.sales_office)
    setRowData(data);
    setFormData({
      sales_organisation: data?.sales_organisation || "",
      distribution_id: data?.distribution?.value || "",
      division_id: data?.division?.value || "",
      sales_office: data?.sales_office?.value || "",
      isactive: data?.isactive,
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
        Header: "Sales Organisation",
        accessor: "sales_organisation",
      },
      {
        Header: "Distribution",
        accessor: "distribution.label",
      },
      {
        Header: "Division",
        accessor: "division.label",
      },
      {
        Header: "Sales Office",
        accessor: "sales_office.label",
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
                        name: "sales_organisation",
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
              {salesOrganisationPermission && salesOrganisationPermission?.can_edit ? (
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
              {salesOrganisationPermission && salesOrganisationPermission?.can_delete ? (
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
    [status, salesOrganisationPermission]
  );

  document.title = "Detergent | Sales Organisation";
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
          <Breadcrumbs titlePath="#" title="Customers" breadcrumbItem="Sales Organisation" />

          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={salesorganisation.salesOrg && salesorganisation.salesOrg.length > 0 ? salesorganisation.salesOrg : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                salesOrganisationPermission && salesOrganisationPermission?.can_add
                  ? "Add Sales Organisation"
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
                    <Label htmlFor="formrow-state-Input">Sales Organisation</Label>
                    <Input
                      type="text"
                      name="sales_organisation"
                      className={`form-control ${formErrors.sales_organisation ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Sales Organisation"
                      value={formData?.sales_organisation}
                      onChange={handleChange}
                    />
                    {formErrors.sales_organisation && (
                      <div className="invalid-feedback">
                        {formErrors.sales_organisation}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="name">Distribution</Label>
                  <Select
                    value={selectDistribution}
                    onChange={async selectDistribution => {
                      setSelectedDistribution(selectDistribution)
                      setFormData(prevData => ({
                        ...prevData,
                        distribution_id: selectDistribution?.value,
                      }));
                    }}
                    options={optionDistribution}
                  />
                  {formErrors.distribution_id && (
                    <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                      {formErrors.distribution_id}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="name">Division</Label>
                  <Select
                    value={selectDivision}
                    onChange={async selectDivision => {
                      setSelectedDivision(selectDivision)
                      setFormData(prevData => ({
                        ...prevData,
                        division_id: selectDivision?.value,
                      }));
                    }}
                    options={optionDivision}
                  />
                  {formErrors.division_id && (
                    <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                      {formErrors.division_id}
                    </div>
                  )}
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="name">Sales Office</Label>
                  <Select
                    value={selectSalesOffice}
                    onChange={async selectSalesOffice => {
                      setSelectedSalesOffice(selectSalesOffice)
                      setFormData(prevData => ({
                        ...prevData,
                        sales_office: selectSalesOffice?.value,
                      }));
                    }}
                    options={optionSalesOffice}
                  />
                  {formErrors.sales_office && (
                    <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                      {formErrors.sales_office}
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

export default SalesOrganisation;
