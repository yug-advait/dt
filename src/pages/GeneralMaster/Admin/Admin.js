import React, { useEffect, useMemo, useState } from "react";
import {
  UncontrolledTooltip,
  Alert,
} from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import ViewModal from "components/Common/ViewModal";
import {
  GET_ADMINS_REQUEST,
  DELETE_ADMINS_REQUEST,
} from "../../../store/admins/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
const Admin = () => {
  const history = useHistory()
  const dispatch = useDispatch();
  const {
    admins,
    deleteAdmins,
    listAdmins,
    error,
  } = useSelector(state => state.admins);

  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [adminPermission, setAdminPermission] = useState();
  const [viewData, setViewData] = useState(null);

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
        permission.sub_menu_name === "admins"
    );
    setAdminPermission(
      permissions.find(permission => permission.sub_menu_name === "admins")
    );
    dispatch({
      type: GET_ADMINS_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listAdmins) {
      setLoading(false)
    }
    if (deleteAdmins) {
      setToastMessage("Admin Deleted Successfully");
      dispatch({
        type: GET_ADMINS_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Admin Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_ADMINS_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    updateCommon,
    deleteAdmins,
    listAdmins,
    toast,
  ]);

  const handleClicks = () => {
    history.push({
      pathname: '/master/admins/add',
      state: { editAdmin: '' }
    });
  };
  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      dispatch({
        type: DELETE_ADMINS_REQUEST,
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
        Header: "First Name",
        accessor: "first_name",
        Cell: ({ row }) => {
          const Name = row?.original?.title + row?.original?.first_name;
          return <div>{Name}</div>
        }
      },
      {
        Header: "Last Name",
        accessor: "last_name",
      },
      {
        Header: "Department",
        accessor: "department.label",
      },
      // {
      //   Header: "Language",
      //   accessor: "language.label",
      // },
      // {
      //   Header: "Time Zone",
      //   accessor: "time_zone",
      // },
      // {
      //   Header: "Function Name",
      //   accessor: "function_name",
      // },
      {
        Header: "Telephone",
        accessor: "telephone",
      },
      {
        Header: "Mobile",
        accessor: "mobile",
      },
      {
        Header: "Email",
        accessor: "email_id",
      },
      // {
      //   Header: "Valid From",
      //   accessor: "valid_from",
      //   Cell: ({ value }) => {
      //     const valid_from = moment(value).format("DD/MM/YYYY");
      //     return <div>{valid_from}</div>;
      //   },
      // },
      // {
      //   Header: "Valid To",
      //   accessor: "valid_to",
      //   Cell: ({ value }) => {
      //     const valid_to = moment(value).format("DD/MM/YYYY");
      //     return <div>{valid_to}</div>;
      //   },
      // },
      // {
      //   Header: "User Group",
      //   accessor: "user_group.label",
      // },
      // {
      //   Header: "Company",
      //   accessor: "company.label",
      // },
      // {
      //   Header: "Sales Organisation",
      //   accessor: "salesorg.label",
      // },
      // {
      //   Header: "Distribution Channel",
      //   accessor: "distribution.label",
      // },
      // {
      //   Header: "Division",
      //   accessor: "division.label",
      // },
      // {
      //   Header: "Sales Office",
      //   accessor: "salesoffice.label",
      // },
      // {
      //   Header: "Sales Group",
      //   accessor: "salesgroup.label",
      // },
      // {
      //   Header: "Employee Code",
      //   accessor: "employee.label",
      // },
      // {
      //   Header: "Address",
      //   accessor: "address_data_1",
      // },
      {
        Header: "Country",
        accessor: "country.label",
      },
      {
        Header: "State",
        accessor: "state.label",
      },
      {
        Header: "City",
        accessor: "city",
      },
      // {
      //   Header: "Pincode",
      //   accessor: "pincode",
      // },
      // {
      //   Header: "Created On",
      //   accessor: "createdon",
      //   Cell: ({ value }) => {
      //     const formattedDate = moment(value).format("DD/MM/YYYY");
      //     return <div>{formattedDate}</div>;
      //   },
      // },
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
                        name: "admin_master",
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
          const rowData = cellProps.row.original;
          const viewFields = [
            { label: "First Name", value: rowData.title + " " + rowData.first_name },
            { label: "Last Name", value: rowData.last_name },
            { label: "Department", value: rowData.department?.label },
            { label: "Language", value: rowData.language?.label },
            { label: "Time Zone", value: rowData.time_zone },
            { label: "Function Name", value: rowData.function_name },
            { label: "Telephone", value: rowData.telephone },
            { label: "Mobile", value: rowData.mobile },
            { label: "Email", value: rowData.email_id },
            { label: "Valid From", value: rowData.valid_from },
            { label: "Valid To", value: rowData.valid_to },
            { label: "User Group", value: rowData.user_group?.label },
            { label: "Company", value: rowData.company?.label },
            { label: "Sales Organisation", value: rowData.salesorg?.label },
            { label: "Distribution Channel", value: rowData.distribution?.label },
            { label: "Division", value: rowData.division?.label },
            { label: "Sales Office", value: rowData.salesoffice?.label },
            { label: "Sales Group", value: rowData.salesgroup?.label },
            { label: "Employee Code", value: rowData.employee?.label },
            { label: "Address", value: rowData.address_data_1 },
            { label: "Country", value: rowData.country?.label },
            { label: "State", value: rowData.state?.label },
            { label: "City", value: rowData.city },
            { label: "Pincode", value: rowData.pincode },
            { label: "Created On", value: rowData.createdon },
            { label: "Status", value: rowData.isactive ? "Active" : "Inactive" }
          ];

          return (
            <div className="d-flex gap-3">
              <ViewModal 
                title="Admin Details" 
                fields={viewFields}
                onEdit={() => {
                  history.push({
                    pathname: "/master/admins/edit",
                    state: { editAdmin: rowData }
                  });
                }}
              />
              {adminPermission && adminPermission?.can_edit ? (
                <Link
                  to={{
                    pathname: "/master/admins/edit",
                    state: { editAdmin: cellProps.row.original }
                  }}
                  className="text-success"
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

              {adminPermission && adminPermission?.can_delete ? (
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
    [status, adminPermission]
  );

  document.title = "Detergent | Admins";
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
          <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="Admins" />
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={admins?.admins && admins?.admins.length > 0 ? admins?.admins : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                adminPermission && adminPermission?.can_add
                  ? "Add Admins"
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

export default Admin;
