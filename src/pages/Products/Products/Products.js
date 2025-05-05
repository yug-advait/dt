import React, { useEffect, useMemo, useState } from "react";
import { UncontrolledTooltip, Alert } from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
  GET_PRODUCTS_REQUEST,
  DELETE_PRODUCTS_REQUEST,
} from "../../../store/products/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
const Products = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { products, deleteproducts, listproduct } = useSelector(
    state => state.products
  );
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [productPermission, setProductPermission] = useState();

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
        permission.sub_menu_name === "products"
    );
    setProductPermission(
      permissions.find(permission => permission.sub_menu_name === "products")
    );
    dispatch({
      type: GET_PRODUCTS_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listproduct) {
      setLoading(false)
    }
    if (deleteproducts) {
      setToastMessage("Products Deleted Successfully");
      dispatch({
        type: GET_PRODUCTS_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Products Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_PRODUCTS_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [updateCommon, deleteproducts, listproduct, toast]);

  const handleClicks = () => {
    history.push({
      pathname: '/products/add',
      state: { editProduct: '' }
    });
  };
  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      dispatch({
        type: DELETE_PRODUCTS_REQUEST,
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
        Header: "Material Type",
        accessor: "material_type.label",
      },
      {
        Header: "Product Code",
        accessor: "product_code",
      },
      {
        Header: "Product Name",
        accessor: "product_description",
      },
      {
        Header: "Base UoM",
        accessor: "base_uom",
      },
      {
        Header: "Sales UoM",
        accessor: "sales_uom",
      },
      {
        Header: "Conversion Factor Sales",
        accessor: "conversion_factor_sales",
      },
      {
        Header: "WH UoM",
        accessor: "wh_uom",
      },
      {
        Header: "Conversion Factor WH UoM",
        accessor: "conversion_factor_wh_uom",
      },
      {
        Header: "Prodn UoM",
        accessor: "prodn_uom",
      },
      {
        Header: "Conversion Factor Prod UoM",
        accessor: "conversion_factor_prod_uom",
      },
      {
        Header: "Procurement UoM",
        accessor: "procurement_uom",
      },
      {
        Header: "Conversion Factor Procurement UoM",
        accessor: "conversion_factor_procurement_uom",
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
        Header: "Plant Code",
        accessor: "plant.label",
      },
      {
        Header: "Company",
        accessor: "company.label",
      },
      {
        Header: "Sales Organisation",
        accessor: "sales_organisation_id",
      },
      {
        Header: "Distribution Channel",
        accessor: "distribution.label",
      },
      {
        Header: "Division",
        accessor: "division.label",
      },
      {
        Header: "EAN/UPC Number",
        accessor: "ean_upc_number",
      },
      {
        Header: "HSN Code",
        accessor: "hsn.label",
      },
      {
        Header: "SAC Code",
        accessor: "sac.label",
      },
      {
        Header: "Material Allowed for Indicator",
        accessor: "material_allowed_indicator",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Gross Weight",
        accessor: "gross_weight",
      },
      {
        Header: "Gross Weight UoM",
        accessor: "gross_weight_uom",
      },
      {
        Header: "Net Weight",
        accessor: "net_weight",
      },
      {
        Header: "Net Weight UoM",
        accessor: "net_weight_uom",
      },
      {
        Header: "Volume",
        accessor: "volume",
      },
      {
        Header: "Volume UoM",
        accessor: "volume_uom",
      },
      {
        Header: "Length",
        accessor: "length",
      },
      {
        Header: "Length UoM",
        accessor: "length_uom",
      },
      {
        Header: "Breadth",
        accessor: "breadth",
      },
      {
        Header: "Breadth UoM",
        accessor: "breadth_uom",
      },
      {
        Header: "Height",
        accessor: "height",
      },
      {
        Header: "Height UoM",
        accessor: "height_uom",
      },
      {
        Header: "Material Group",
        accessor: "materialgroup1.label",
      },
      {
        Header: "Product Hierarchy",
        accessor: "producthierarchy.label",
      },
      {
        Header: "Sales Long Text Description",
        accessor: "sales_long_text_description",
      },
      {
        Header: "Batch Indicator",
        accessor: "batch_indicator",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Serial Number Indicator",
        accessor: "serial_number_indicator",
        Cell: ({ value }) => {
          const valueList = value === false ? "false" : "true";
          return <div>{valueList}</div>;
        },
      },
      {
        Header: "Shelf Life of Product",
        accessor: "shelf_life_product",
      },
      {
        Header: "Shelf Life UoM",
        accessor: "shelf_life_uom",
      },
      {
        Header: "Profit Centre",
        accessor: "profit_centre",
      },
      {
        Header: "Work Centre",
        accessor: "work_centre",
      },
      {
        Header: "Standard Price per unit",
        accessor: "standard_price_per_unit",
      },
      {
        Header: "Moving Avg Price per unit",
        accessor: "moving_avg_price_per_unit",
      },
      {
        Header: "Currency",
        accessor: "currency.label",
      },
      {
        Header: "Unrestricted",
        accessor: "unrestricted",
      },
      {
        Header: "Restricted-Use Stock",
        accessor: "restricted_use_stock",
      },
      {
        Header: "Quality Inspection",
        accessor: "quality_inspection",
      },
      {
        Header: "Blocked",
        accessor: "blocked",
      },
      {
        Header: "Returns",
        accessor: "returns",
      },
      {
        Header: "Stock in transfer",
        accessor: "stock_in_transfer",
      },
      {
        Header: "In transfer (plant)",
        accessor: "in_transfer_plant",
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
                        name: "product_master",
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
              {productPermission && productPermission?.can_edit ? (
                <Link
                  to={{
                    pathname: "/products/edit",
                    state: { editProduct: cellProps.row.original }
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
              {productPermission && productPermission?.can_delete ? (
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
    [status, productPermission]
  );

  document.title = "Detergent | Products";
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
            title="Products"
            breadcrumbItem="Products"
          />
          {loading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={products?.products && products?.products.length > 0 ? products?.products : []}
              isGlobalFilter={true}
              isAddOptions={true}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                productPermission && productPermission?.can_add
                  ? "Add Products"
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

export default Products;
