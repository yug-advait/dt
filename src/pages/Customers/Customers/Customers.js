import React, { useEffect, useMemo, useState } from "react";
import { UncontrolledTooltip, Alert } from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import ViewModal from "components/Common/ViewModal";
import {
  GET_CUSTOMERS_REQUEST,
  DELETE_CUSTOMERS_REQUEST,
} from "../../../store/customers/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const Customers = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { listCustomer, customers, deletecustomers, error } = useSelector(
    state => state.customers
  );
  const [loading, setLoading] = useState(true);
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [customerPermission, setCustomerPermission] = useState();
  const [status, setStatus] = useState("");

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
        permission.sub_menu_name === "customers"
    );
    setCustomerPermission(
      permissions.find(permission => permission.sub_menu_name === "customers")
    );
    dispatch({
      type: GET_CUSTOMERS_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listCustomer) {
      setLoading(false)
    }
    if (deletecustomers) {
      setToastMessage("Customers Deleted Successfully");
      dispatch({
        type: GET_CUSTOMERS_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Customers Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_CUSTOMERS_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [updateCommon, listCustomer, deletecustomers, toast]);

  const handleClicks = () => {
    history.push({
      pathname: '/customers/add',
      state: { editCustomer: '' }
    });
  };
  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      dispatch({
        type: DELETE_CUSTOMERS_REQUEST,
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
        Header: "Customer Code",
        accessor: "customer_code",
      },
      // {
      //   Header: "Customer Group",
      //   accessor: "customergroup.label",
      // },
      // {
      //   Header: "Account Group",
      //   accessor: "account_group.label",
      // },
      // {
      //   Header: "Vendor Code",
      //   accessor: "vendor.label",
      // },
      // {
      //   Header: "Ext Cust Code1",
      //   accessor: "ext_cust_cd_1",
      // },
      // {
      //   Header: "Legal Entity Name",
      //   accessor: "customer_legal_entity",
      // },
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
      {
        Header: "Company",
        accessor: "company.label",
      },
      // {
      //   Header: "Previous Account Number",
      //   accessor: "previous_account_no",
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
      //   accessor: "address_1",
      // },
      // {
      //   Header: "Country",
      //   accessor: "country.label",
      // },
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
      //   Header: "Currency",
      //   accessor: "currency.label",
      // },
      // {
      //   Header: "Order Block",
      //   accessor: "order_block",
      //   Cell: ({ value }) => {
      //     const valueList = value === false ? "false" : "true";
      //     return <div>{valueList}</div>;
      //   },
      // },
      // {
      //   Header: "Delivery Block",
      //   accessor: "delivery_block",
      //   Cell: ({ value }) => {
      //     const valueList = value === false ? "false" : "true";
      //     return <div>{valueList}</div>;
      //   },
      // },
      // {
      //   Header: "Billing Block",
      //   accessor: "billing_block",
      //   Cell: ({ value }) => {
      //     const valueList = value === false ? "false" : "true";
      //     return <div>{valueList}</div>;
      //   },
      // },
      // {
      //   Header: "Deletion Indicator",
      //   accessor: "deletion_block",
      //   Cell: ({ value }) => {
      //     const valueList = value === false ? "false" : "true";
      //     return <div>{valueList}</div>;
      //   },
      // },
      // {
      //   Header: "Credit Block",
      //   accessor: "credit_block",
      //   Cell: ({ value }) => {
      //     const valueList = value === false ? "false" : "true";
      //     return <div>{valueList}</div>;
      //   },
      // },
      // {
      //   Header: "Credit Limit Amount",
      //   accessor: "credit_limit_amount",
      // },
      // {
      //   Header: "Payment Terms",
      //   accessor: "payment_term.label",
      // },
      // {
      //   Header: "Inco Terms",
      //   accessor: "inco_term.label",
      // },
      // {
      //   Header: "Inco Terms Desc",
      //   accessor: "inco_term_desc.label",
      // },
      // {
      //   Header: "Bank Name",
      //   accessor: "bank_name",
      // },
      // {
      //   Header: "Bank Address",
      //   accessor: "bank_address",
      // },
      // {
      //   Header: "Ifsc Code",
      //   accessor: "ifsc_code",
      // },
      // {
      //   Header: "Swift Code",
      //   accessor: "swift_code",
      // },
      // {
      //   Header: "Bank Account Number",
      //   accessor: "bank_account_number",
      // },
      // {
      //   Header: "Bank Account Holder Name",
      //   accessor: "bank_account_holdername",
      // },
      // {
      //   Header: "Bank Branch Code",
      //   accessor: "bank_branch_code",
      // },
      // {
      //   Header: "Iban Number",
      //   accessor: "iban_number",
      // },
      // {
      //   Header: "Pan Number",
      //   accessor: "pan_number",
      // },
      // {
      //   Header: "TAN",
      //   accessor: "tan",
      // },
      // {
      //   Header: "TIN",
      //   accessor: "tin",
      // },
      // {
      //   Header: "GSTIN",
      //   accessor: "gstin",
      // },
      // {
      //   Header: "Tax Id 1",
      //   accessor: "tax_id_1",
      // },
      // {
      //   Header: "IEC Code",
      //   accessor: "iec_code",
      // },
      // {
      //   Header: "SEZ/EOU/DTA",
      //   accessor: "sez_eou_dta.label",
      // },
      // {
      //   Header: "POD Indicator",
      //   accessor: "pod_indicator",
      //   Cell: ({ value }) => {
      //     const valueList = value === false ? "false" : "true";
      //     return <div>{valueList}</div>;
      //   },
      // },
      // {
      //   Header: "Customer Classification",
      //   accessor: "customer_classification",
      // },
      // {
      //   Header: "CustGrp1",
      //   accessor: "cust_grp1.label",
      // },
      // {
      //   Header: "Delivery Plant 1",
      //   accessor: "deliveryplant1.label",
      // },
      // {
      //   Header: "Revenue Indicator",
      //   accessor: "revenue_indicator",
      //   Cell: ({ value }) => {
      //     const valueList = value === false ? "false" : "true";
      //     return <div>{valueList}</div>;
      //   },
      // },
      // {
      //   Header: "Text1",
      //   accessor: "text1",
      // },
      // {
      //   Header: "GST Indicator",
      //   accessor: "gst_indicator",
      //   Cell: ({ value }) => {
      //     const valueList = value === false ? "false" : "true";
      //     return <div>{valueList}</div>;
      //   },
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
                        name: "customer",
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
              {/* View Icon/Button */}
              <ViewModal
                title="Customer Details"
                fields={[
                  { label: "Customer Code", value: cellProps.row.original.customer_code },
                  { label: "First Name", value: cellProps.row.original.firstname },
                  { label: "Last Name", value: cellProps.row.original.lastname },
                  { label: "Email", value: cellProps.row.original.email_id },
                  { label: "Mobile", value: cellProps.row.original.mobile },
                  { label: "Telephone", value: cellProps.row.original.telephone },
                  { label: "Company", value: cellProps.row.original.company?.label },
                  { label: "State", value: cellProps.row.original.state?.label },
                  { label: "City", value: cellProps.row.original.city },
                  { label: "Address", value: cellProps.row.original.address_1 },
                  { label: "Pincode", value: cellProps.row.original.pincode },
                  { label: "Customer Group", value: cellProps.row.original.customergroup?.label },
                  { label: "Account Group", value: cellProps.row.original.account_group?.label },
                  { label: "Sales Organisation", value: cellProps.row.original.salesorg?.label },
                  { label: "Distribution Channel", value: cellProps.row.original.distribution?.label },
                  { label: "Division", value: cellProps.row.original.division?.label },
                  { label: "Sales Office", value: cellProps.row.original.salesoffice?.label },
                  { label: "Sales Group", value: cellProps.row.original.salesgroup?.label },
                  { label: "Currency", value: cellProps.row.original.currency?.label },
                  { label: "Payment Terms", value: cellProps.row.original.payment_term?.label },
                  { label: "Inco Terms", value: cellProps.row.original.inco_term?.label },
                  { label: "Bank Name", value: cellProps.row.original.bank_name },
                  { label: "Bank Account Number", value: cellProps.row.original.bank_account_number },
                  { label: "Ifsc Code", value: cellProps.row.original.ifsc_code },
                  { label: "Pan Number", value: cellProps.row.original.pan_number },
                  { label: "GSTIN", value: cellProps.row.original.gstin },
                  { label: "Valid From", value: cellProps.row.original.valid_from },
                  { label: "Valid To", value: cellProps.row.original.valid_to },
                  { label: "Order Block", value: cellProps.row.original.order_block?.toString() },
                  { label: "Delivery Block", value: cellProps.row.original.delivery_block?.toString() },
                  { label: "Billing Block", value: cellProps.row.original.billing_block?.toString() },
                  { label: "Credit Block", value: cellProps.row.original.credit_block?.toString() },
                  { label: "GST Indicator", value: cellProps.row.original.gst_indicator?.toString() }
                ]}
                onEdit={() => {
                  history.push({
                    pathname: "/customers/edit",
                    state: { editCustomer: cellProps.row.original },
                  });
                }}
              />

              {customerPermission && customerPermission?.can_edit ? (
                <Link
                  to={{
                    pathname: "/customers/edit",
                    state: { editCustomer: cellProps.row.original },
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
              {customerPermission && customerPermission?.can_delete ? (
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
    [status, customerPermission]
  );

  document.title = "Detergent | Customers";
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
          <Breadcrumbs
            titlePath="#"
            title="Customers"
            breadcrumbItem="Customers"
          />

          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={
                customers?.customer && customers?.customer.length > 0
                  ? customers?.customer
                  : []
              }
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                customerPermission && customerPermission?.can_add
                  ? "Add Customers"
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

export default Customers;
