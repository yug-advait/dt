import React, { useEffect, useMemo, useState } from "react";
import { useHistory  } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import { GET_INVOICE_REQUEST } from "../../store/invoice/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
const InvoiceList = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true);
  const {
    invoices,
  } = useSelector(state => state.invoice);
  const [invoicePermission, setInvoicePermission] = useState();
  useEffect(() => {
    dispatch({
      type: GET_INVOICE_REQUEST,
      payload: [],
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    const userData = getUserData();
    var permissions = userData?.permissionList.filter(
      permission =>
        permission.sub_menu_name === "invoice" 
    );
    setInvoicePermission(
      permissions.find(permission => permission.sub_menu_name === "invoice")
    );
  }, []);

  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };

  

  const columns = useMemo(
    () => [
      {
        Header: "Invoice No.",
        accessor: "invoice_no",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <span
              role="button"
              className="ms-3"
              style={{ textDecoration: "underline", cursor: "pointer", color: "inherit" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "blue")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
              onClick={() => {
                // Push to the detail page with the original row data
                history.push("/detail_invoices", { invoiceData: row.original });
              }}
            >
              {row.original.invoice_no}
            </span>
          </div>
        ),
      },
      {
        Header: "Supplier Invoice No.",
        accessor: "supplier_invoice_no",
      },
      {
        Header: "PO Reference",
        accessor: "reference",
      },
      {
        Header: "Invoice Date",
        accessor: "invoice_date",
        Cell: ({ value }) => {
          const formattedDate = moment(value).format("DD/MM/YYYY");
          return <div>{formattedDate}</div>;
        },
      },
      {
        Header: "Total Amount",
        accessor: "total_amount",
      },
      {
        Header: "Total Tax Amount",
        accessor: "total_tax_amount",
      },
      {
        Header: "Vendor",
        accessor: "vendor.label",
      }
    ],
    []
  );
  document.title = "Detergent | Invoices";
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            titlePath="/list_invoices"
            title="Invoice"
            breadcrumbItem="Invoices"
          />

          <TableContainer
            columns={columns}
            data={invoices?.invoicesMastersData.length>0 ? invoices?.invoicesMastersData : [] }
            isLoading={loading}
            isGlobalFilter={false}
            isAddOptions={false}
            customPageSize={10}
            className="custom-header-css"
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default InvoiceList;
