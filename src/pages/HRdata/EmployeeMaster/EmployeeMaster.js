import React, { useEffect, useMemo, useState } from "react";
import {
  UncontrolledTooltip,
  Alert,
} from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
  GET_EMPLOYEEMASTER_REQUEST,
  DELETE_EMPLOYEEMASTER_REQUEST,
} from "../../../store/employeeMaster/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
import ViewModal from "components/Common/ViewModal";

const EmployeeMaster = () => {
  const history = useHistory()
  const dispatch = useDispatch();
  const {
    listEmployee,
    employeemaster,
    deleteEmployeeMaster,
    error,
  } = useSelector(state => state.employeeMaster);
  const [loading, setLoading] = useState(true);
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [status, setStatus] = useState("");
  const [employeeMasterPermission, setEmployeeMasterPermission] = useState();

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
        permission.sub_menu_name === "employee_master"
    );
    setEmployeeMasterPermission(
      permissions.find(permission => permission.sub_menu_name === "employee_master")
    );
    dispatch({
      type: GET_EMPLOYEEMASTER_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listEmployee) {
      setLoading(false)
    }
    if (deleteEmployeeMaster) {
      setToastMessage("Employee Master Deleted Successfully");
      dispatch({
        type: GET_EMPLOYEEMASTER_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Employee Master Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_EMPLOYEEMASTER_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    listEmployee,
    updateCommon,
    deleteEmployeeMaster,
    toast,
  ]);

  const handleClicks = () => {
    history.push({
      pathname: '/hrdata/employee_master/add',
      state: { editEmployee: '' }
    });
  };

  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      dispatch({
        type: DELETE_EMPLOYEEMASTER_REQUEST,
        payload: rowData.id,
      });
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const columns = useMemo(
    () => [
      {
        Header: "Employee Code",
        accessor: "employee_code",
      },
      {
        Header: "First Name",
        accessor: "firstname",
      },
      {
        Header: "Last Name",
        accessor: "lastname",
      },
      {
        Header: "Telephone",
        accessor: "telephone",
      },
      {
        Header: "Mobile",
        accessor: "mobile",
      },
      {
        Header: "Actions",
        accessor: "action",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              <ViewModal
                title="Employee Details"
                fields={
                  [
                  { label: "Employee Code", value: cellProps.row.original.employee_code },
                  { label: "First Name", value: cellProps.row.original.firstname },
                  { label: "Last Name", value: cellProps.row.original.lastname },
                  { label: "Telephone", value: cellProps.row.original.telephone },
                  { label: "Mobile", value: cellProps.row.original.mobile },
                  { label: "Email", value: cellProps.row.original.email_id },
                  { label: "Valid From", value: cellProps.row.original.valid_from },
                  { label: "Valid To", value: cellProps.row.original.valid_to },
                  { label: "Company", value: cellProps.row.original.company?.label },
                  { label: "Previous Account Number", value: cellProps.row.original.previous_account_no },
                  { label: "Sales Organisation", value: cellProps.row.original.salesorg?.label },
                  { label: "Distribution Channel", value: cellProps.row.original.distribution?.label },
                  { label: "Division", value: cellProps.row.original.division?.label },
                  { label: "Sales Office", value: cellProps.row.original.salesoffice?.label },
                  { label: "Sales Group", value: cellProps.row.original.salesgroup?.label },
                  { label: "Supervisor", value: cellProps.row.original.supervisor?.label },
                  { label: "Home/Office Address", value: cellProps.row.original.home_office_address },
                  { label: "Satellite/Office Address", value: cellProps.row.original.satellite_office_address },
                  { label: "Calender", value: cellProps.row.original.calender?.label },
                  { label: "Designation", value: cellProps.row.original.designation?.label },
                  { label: "10th %", value: cellProps.row.original.tenth_std_percentage },
                  { label: "12th %", value: cellProps.row.original.twelfth_std_percentage },
                  { label: "Stream", value: cellProps.row.original.stream_of_education },
                  { label: "Bachelor Degree", value: cellProps.row.original.bachelors_degree },
                  { label: "University (Bachelors)", value: cellProps.row.original.university_for_bachelors },
                  { label: "Masters Degree", value: cellProps.row.original.masters_degree },
                  { label: "University (Masters)", value: cellProps.row.original.university_for_masters },
                  { label: "PhD Subject", value: cellProps.row.original.phd_degree_subject },
                  { label: "Bachelor %", value: cellProps.row.original.bachelors_percentage },
                  { label: "Masters %", value: cellProps.row.original.masters_percentage },
                  { label: "Address", value: cellProps.row.original.address_data_1 },
                  { label: "Country", value: cellProps.row.original.country?.label },
                  { label: "State", value: cellProps.row.original.state?.label },
                  { label: "City", value: cellProps.row.original.city },
                  { label: "Pincode", value: cellProps.row.original.pincode },
                  { label: "Currency", value: cellProps.row.original.currency?.label },
                  { label: "Procurement Block", value: cellProps.row.original.procurement_block ? "true" : "false" },
                  { label: "Billing Block", value: cellProps.row.original.billing_block ? "true" : "false" },
                  { label: "Deletion Block", value: cellProps.row.original.deletion_block ? "true" : "false" },
                  { label: "Bank Name", value: cellProps.row.original.bank_name },
                  { label: "IFSC", value: cellProps.row.original.ifsc_code },
                  { label: "PAN", value: cellProps.row.original.pan_number },
                  { label: "AADHAR", value: cellProps.row.original.aadhar_card },
                  { label: "Block Indicator", value: cellProps.row.original.block_indicator ? "true" : "false" },
                  { label: "Challenge Indicator", value: cellProps.row.original.challenge_indicator ? "true" : "false" },
                  { label: "Created On", value: moment(cellProps.row.original.createdon).format("DD/MM/YYYY") },
                  { label: "Status", value: cellProps.row.original.isactive ? "Active" : "Inactive" },
                ]
              }
                onEdit={() => {
                  history.push({
                    pathname: "/hrdata/employee_master/edit",
                    state: { editEmployee: cellProps.row.original },
                  });
                }}
              />
  
              {employeeMasterPermission?.can_edit && (
                <Link
                  to={{
                    pathname: "/hrdata/employee_master/edit",
                    state: { editEmployee: cellProps.row.original }
                  }}
                  className="text-success"
                >
                  <i className="mdi mdi-pencil-box font-size-18" id={`edit-${cellProps.row.original.id}`} />
                  <UncontrolledTooltip placement="top" target={`edit-${cellProps.row.original.id}`}>
                    Edit
                  </UncontrolledTooltip>
                </Link>
              )}
  
              {employeeMasterPermission?.can_delete && (
                <Link
                  to="#"
                  className="text-danger"
                  onClick={() => onClickDelete(cellProps.row.original)}
                >
                  <i className="mdi mdi-delete font-size-18" id={`delete-${cellProps.row.original.id}`} />
                  <UncontrolledTooltip placement="top" target={`delete-${cellProps.row.original.id}`}>
                    Delete
                  </UncontrolledTooltip>
                </Link>
              )}
            </div>
          );
        },
      },
    ],
    [status, employeeMasterPermission]
  );
  

  document.title = "Detergent | Employee Master";
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
          <Breadcrumbs titlePath="#" title="HR Data" breadcrumbItem="Employee Master" />

          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={employeemaster.employees && employeemaster?.employees.length > 0 ? employeemaster.employees : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                employeeMasterPermission && employeeMasterPermission?.can_add
                  ? "Add Employee Master"
                  : null
              }
              handleClicks={handleClicks}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default EmployeeMaster;
