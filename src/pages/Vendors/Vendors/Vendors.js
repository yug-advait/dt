import React, { useEffect, useMemo, useState } from "react";
import { UncontrolledTooltip, Alert } from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
  GET_VENDOR_REQUEST,
  DELETE_VENDOR_REQUEST,
} from "../../../store/vendor/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const Vendors = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { vendor, listVendor, deleteVendor, error } = useSelector(state => state.vendor);
  const [loading, setLoading] = useState(true);
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [vendorPermission, setVendorPermission] = useState();

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
        permission.sub_menu_name === "vendors"
    );
    setVendorPermission(
      permissions.find(permission => permission.sub_menu_name === "vendors")
    );
    dispatch({
      type: GET_VENDOR_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listVendor) {
      setLoading(false)
    }
    if (deleteVendor) {
      setToastMessage("Vendor Deleted Successfully");
      dispatch({
        type: GET_VENDOR_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Vendor Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_VENDOR_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [updateCommon, listVendor, deleteVendor, toast]);

  const handleClicks = () => {
    history.push({
      pathname: '/vendor/add',
      state: { editState: '' }
    });
  };

  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      dispatch({
        type: DELETE_VENDOR_REQUEST,
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
        Header: "Vendor Code",
        accessor: "vendor_code",
      },
      {
        Header: "Legal Entity Name ",
        accessor: "legal_entity_name",
      },
      {
        Header: "Account Group",
        accessor: "account_group.label",
      },
      {
        Header: "Customer",
        accessor: "customer_id",
      },
      {
        Header: "Previous Account Number",
        accessor: "previous_account_number",
      },
      {
        Header: "Ext Vendor Code1",
        accessor: "ext_vendor_code1",
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
        Header: "Email",
        accessor: "email_id",
      },
      {
        Header: "Valid From",
        accessor: "valid_from",
        Cell: ({ value }) => {
          const valid_from = moment(value).format("DD/MM/YYYY");
          return <div>{valid_from}</div>;
        },
      },
      {
        Header: "Valid To",
        accessor: "valid_to",
        Cell: ({ value }) => {
          const valid_to = moment(value).format("DD/MM/YYYY");
          return <div>{valid_to}</div>;
        },
      },
      {
        Header: "Company",
        accessor: "company.label",
      },
      {
        Header: "Purchase Organisation",
        accessor: "purchase_organisation.label",
      },
      {
        Header: "Purchase Group",
        accessor: "purchase_group.label",
      },
      {
        Header: "Employee",
        accessor: "employee.label",
      },
      {
        Header: "Address",
        accessor: "address_1",
      },
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
      {
        Header: "Pincode",
        accessor: "pincode",
      },
      {
        Header: "Currency",
        accessor: "currency.label",
      },
      {
        Header: "Procurement Block",
        accessor: "procurement_block",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Delivery Block",
        accessor: "delivery_block",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Billing Block",
        accessor: "billing_block",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Payment Terms",
        accessor: "payment_term.label",
      },
      {
        Header: "Inco Term",
        accessor: "inco_term.label",
      },
      {
        Header: "Bank Name",
        accessor: "bank_name",
      },
      {
        Header: "Bank Address",
        accessor: "bank_address",
      },
      {
        Header: "Ifsc Code",
        accessor: "ifsc_code",
      },
      {
        Header: "Swift Code",
        accessor: "swift_code",
      },
      {
        Header: "Bank Account Number",
        accessor: "bank_account_number",
      },
      {
        Header: "Bank Account Holder Name",
        accessor: "bank_account_holdername",
      },
      {
        Header: "Bank Branch Code",
        accessor: "bank_branch_code",
      },
      {
        Header: "Iban Number",
        accessor: "iban_number",
      },
      {
        Header: "Registration Number",
        accessor: "registration_number",
      },
      {
        Header: "Pan Number",
        accessor: "pan_number",
      },
      {
        Header: "Tan",
        accessor: "tan",
      },
      {
        Header: "Tin",
        accessor: "tin",
      },
      {
        Header: "GSTIN",
        accessor: "gstin",
      },
      {
        Header: "Aadhar",
        accessor: "aadhar_number",
      },
      {
        Header: "Udyog",
        accessor: "udyog_number",
      },
      {
        Header: "Tax Id 1",
        accessor: "tax_id_1",
      },
      {
        Header: "Iec Code",
        accessor: "iec_code",
      },
      {
        Header: "Location Code",
        accessor: "location_code.label",
      },
      {
        Header: "POD Indicator",
        accessor: "pod_indicator",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Vendor Classification",
        accessor: "vendor_classification",
      },
      {
        Header: "Vendor Group",
        accessor: "vendor_group.label",
      },
      {
        Header: "Revenue Indicator",
        accessor: "revenue_indicator.label",
      },
      {
        Header: "Text1",
        accessor: "text1",
      },
      {
        Header: "GST Indicator",
        accessor: "tax_indicator.label",
      },
      {
        Header: "Withholding Tax Type",
        accessor: "withholding_tax_type.label",
      },
      {
        Header: "Delivery Lead Time",
        accessor: "delivery_lead_time",
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
                        name: "vendor_master",
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
              {vendorPermission && vendorPermission?.can_edit ? (
                <Link
                  to={{
                    pathname: "/vendor/edit",
                    state: { editState: cellProps.row.original }
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

              {vendorPermission && vendorPermission?.can_delete ? (
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
    [vendorPermission]
  );

  document.title = "Detergent | Vendors";
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
          <Breadcrumbs titlePath="#" title="Vendors" breadcrumbItem="Vendors" />

          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={
                vendor?.vendors && vendor?.vendors.length > 0
                  ? vendor?.vendors
                  : []
              }
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                vendorPermission && vendorPermission?.can_add
                  ? "Add Vendors"
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

export default Vendors;
