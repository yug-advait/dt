import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useHistory, Link, useLocation } from "react-router-dom";
import {
  Alert,
  Input,
  Card,
  Row,
  Col,
  UncontrolledTooltip,
  Form,
  Label,
  Modal,
  FormGroup,
  ModalHeader,
  ModalBody,
  Button,
} from "reactstrap";
import Select from "react-select";
import TableContainer from "components/Common/TableContainer";
import {
  getSelectData,
  deleteLineItemApiCall,
} from "helpers/Api/api_common";
import { GET_PO_REQUEST } from "../../store/purchaseOrder/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  updateApprovalStatus,
  updateApprovalRequest,
} from "helpers/Api/api_common";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getWithholdingTaxTypes } from "helpers/Api/api_withholdingTaxType";
import DeleteModal from "components/Common/DeleteModal";
import { Skeleton, Box } from "@mui/material";
import "./purchaseOrder.css";
import { updatePoApiCall } from "helpers/Api/api_po";

const PurchaseOrder = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [activeTab, setActiveTab] = useState(2);
  const [asnPermission, setAsnPermission] = useState();
  const [poPermission, setPoPermission] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsPO, setSelectedRowsPO] = useState([]);
  const [approvalManager, setApprovalManager] = useState("");
  const [optionApprovalManager, setOptionApprovalManager] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectProductUom, setSelectedProductUom] = useState({});
  const [optionProductUOM, setOptionProductUOM] = useState([]);
  const [userId, setUserId] = useState({});
  const [userData, setUserData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [allData, setAllData] = useState([]);
  const [selectWithholdingTax, setSelectedWithholdingTax] = useState({});
  const [optionWithholdingTax, setOptionWithholdingTax] = useState([]);
  const [modal, setModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [bulk, setBulk] = useState(false);
  const [maxPriceBand, setMaxPriceBand] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [rowData, setRowData] = useState("");
  const { po } = useSelector(state => state.purchaseOrder);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    po_line_item: "",
    product_description: "",
    vendor_prod_description: "",
    uom: "",
    po_quantity: "",
    delivery_date: "",
    with_holding_tax: "",
    withholding_tax_percentage: "",
    net_price: "",
    net_value: "",
    tax_amount: "",
  });

  const validateDeliveryDate = useCallback(selectedDate => {
    const today = moment().startOf("day");
    const selected = moment(selectedDate).startOf("day");

    if (selected.isBefore(today)) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        delivery_date: "Delivery date cannot be before today",
      }));
    } else {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        delivery_date: "",
      }));
    }
  }, []);

  const handleDateChange = useCallback(
    selectedDates => {
      const selectedDate = selectedDates[0];
      const formattedDate = moment(selectedDate).format("DD/MM/YYYY");

      if (formattedDate !== formData.delivery_date) {
        validateDeliveryDate(selectedDate);
        setFormData(prevData => ({
          ...prevData,
          delivery_date: formattedDate,
        }));
      }
    },
    [formData.delivery_date, validateDeliveryDate]
  );

  useEffect(() => {
    setLoading(false);
    dispatch({
      type: GET_PO_REQUEST,
      payload: [],
    });
    dropdownList();
    const userIdData = getUserData();
    setUserId(userIdData?.user?.id);
    setUserData(userIdData?.user);
    setOptionApprovalManager(userIdData?.user?.approval_ids);
    var permissions = userIdData?.permissionList.filter(
      permission =>
        permission.sub_menu_name === "po" || permission.sub_menu_name === "asn"
    );
    setPoPermission(
      permissions.find(permission => permission.sub_menu_name === "po")
    );
    setAsnPermission(
      permissions.find(permission => permission.sub_menu_name === "asn")
    );
    if (location.state && location.state?.activeTab) {
      setActiveTab(location.state?.activeTab);
    }
  }, [toastMessage]);

  const handleClicks = () => {
    history.push({
      pathname: "/purchase_order/create_direct_po",
      state: { editPO: "", LineItem: [], selectedVendor: null, prPo: true },
    });
  };

  const sendApproval = async (type, lineArray, request_status) => {
    const errors = {};
    if (approvalManager == "") {
      errors.approvalManager = "Please select an Approval Manager";
      setFormErrors(errors);
      return;
    }
    const approvalRequest = await updateApprovalRequest(
      type,
      lineArray,
      request_status,
      approvalManager?.value,
      userId
    );
    setToast(true);
    setShowModal(false);
    setActiveTab(activeTab);
    if (approvalRequest?.success) {
      setToastMessage(approvalRequest?.message);
      setSelectedRows([]);
    }
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };

  const approvalStatus = async (
    type,
    lineArray,
    approval_status,
    updatedby,
    reason
  ) => {
    setShowModal(false);
    const approvalStatus = await updateApprovalStatus(
      type,
      lineArray,
      approval_status,
      updatedby,
      reason
    );
    setToast(true);
    if (approvalStatus?.success) {
      setToastMessage(approvalStatus?.message);
      setSelectedRows([]);
      dispatch({
        type: GET_PO_REQUEST,
        payload: [],
      });
    } else {
      setToastMessage("Status Not Update");
    }
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };

  const handleApproveClick = () => {
    setApprovalManager([]);
    setShowModal(true);
    setBulk(true);
  };

  const handleASNClick = () => {
    history.push({
      pathname: "/asn/create_asn",
      state: { editASN: "", LineItem: selectedRows },
    });
  };

  const handleCheckboxChange = row => {
    setMaxPriceBand(0);
    const isChecked = selectedRows.includes(row);
    if (isChecked) {
      setMaxPriceBand(maxPriceBand - row?.net_value);
    } else {
      setMaxPriceBand(maxPriceBand + row?.net_value);
    }
    setSelectedRowsPO([]);
    const vendor = row.vendor_code;

    setSelectedRows(prevSelected => {
      if (prevSelected.includes(row)) {
        if (prevSelected.length === 1) {
          setSelectedVendor(null);
        }
        return prevSelected.filter(item => item !== row);
      } else {
        if (!selectedVendor || selectedVendor?.label === vendor?.label) {
          setSelectedVendor(vendor);
          return [...prevSelected, row];
        }
        return prevSelected;
      }
    });
  };

  const handleCheckboxPOChange = row => {
    setSelectedRows([]);
    const vendor = row.vendor_code;
    setSelectedRowsPO(prevSelected => {
      if (prevSelected.includes(row)) {
        if (prevSelected.length === 1) {
          setSelectedVendor(null);
        }
        return prevSelected.filter(item => item !== row);
      } else {
        if (!selectedVendor || selectedVendor?.label === vendor?.label) {
          setSelectedVendor(vendor);
          return [...prevSelected, row];
        }
        return prevSelected;
      }
    });
  };

  const handlePOClick = () => {
    history.push({
      pathname: "/purchase_order/create_po",
      state: {
        editPO: "",
        LineItem: selectedRowsPO,
        selectedVendor: selectedVendor,
        prPo: false,
      },
    });
  };

  const openModal = (data = null) => {
    setSelectedRows([]);
    setSelectedProductUom(data?.uom);
    setSelectedWithholdingTax(data?.with_holding_tax);
    setFormData({
      id: data?.id,
      po_line_item: data?.po_line_item,
      uom: data?.uom?.value,
      product_description: data?.product_description,
      vendor_prod_description: data?.vendor_prod_description,
      po_quantity: data?.po_quantity,
      net_price: data?.net_price,
      net_value: data?.net_value,
      net_value: data?.net_value,
      tax_amount: data?.tax_amount,
      with_holding_tax: data?.with_holding_tax?.id,
      withholding_tax_percentage: data?.with_holding_tax?.value,
      delivery_date: data.delivery_date
        ? moment(data.delivery_date).format("DD/MM/YYYY")
        : "",
    });
    setModal(true);
  };

  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };
  const onClickApproveStatus = item => {
    setApprovalManager([]);
    setMaxPriceBand(item.net_value);
    setRowData(item);
    setShowModal(true);
  };
  const handleDelete = async () => {
    try {
      setDeleteModal(false);
      const deleteLineItemData = await deleteLineItemApiCall(rowData?.id, "po");
      setToast(true);
      setToastMessage(deleteLineItemData?.message);
      dispatch({
        type: GET_PO_REQUEST,
        payload: [],
      });
      setTimeout(() => {
        setToast(false);
      }, 2000);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    setSelectedVendor(null);
  };

  const toggleTab = tab => {
    dispatch({
      type: GET_PO_REQUEST,
      payload: [],
    });
    setMaxPriceBand(0);
    setSelectedRows([]);
    setSelectedRowsPO([]);
    setSelectedVendor(null);
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
    if (tab == 2) {
      setAllData(
        po?.openPoList && po?.openPoList.length > 0 ? po.openPoList : []
      );
    } else if (tab == 1) {
      setAllData(
        po?.poQuotationList && po?.poQuotationList.length > 0
          ? po.poQuotationList
          : []
      );
    } else if (tab == 3) {
      setAllData(
        po?.approvedPoList && po?.approvedPoList.length > 0
          ? po.approvedPoList
          : []
      );
    } else if (tab == 4) {
      setAllData(
        po?.rejectedPoList && po?.rejectedPoList.length > 0
          ? po.rejectedPoList
          : []
      );
    } else if (tab == 5) {
      setAllData(
        po?.closePoList && po?.closePoList.length > 0 ? po.closePoList : []
      );
    }
  };

  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };

  const dropdownList = async () => {
    const selectUomData = await getSelectData(
      "uom_description",
      "",
      "unit_of_measure"
    );
    setOptionProductUOM(selectUomData?.getDataByColNameData);

    const selectWithholdingTaxData = await getWithholdingTaxTypes();
    var optionWithholdingTaxData = [];
    if (selectWithholdingTaxData) {
      optionWithholdingTaxData = selectWithholdingTaxData.map(item => {
        return {
          id: item.id,
          value: item.withholding_tax_percentage,
          label:
            item.withholding_tax_code +
            " - " +
            item.withholding_tax_percentage +
            "%",
        };
      });
    }
    setOptionWithholdingTax(optionWithholdingTaxData);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.po_line_item) {
      errors.po_line_item = "PO Line Item Number is required.";
    }
    // if (!formData.product_description) {
    //   errors.product_description = "Product Description is required.";
    // }
    if (!formData.vendor_prod_description) {
      errors.vendor_prod_description = "Vendor Description is required.";
    }
    if (!formData.po_quantity) {
      errors.po_quantity = " PO Quantity is required.";
    }
    if (!formData.net_price) {
      errors.net_price = " Net Price is required.";
    }
    if (!formData.net_value) {
      errors.net_value = " Net Value is required.";
    }
    if (!formData.net_value) {
      errors.net_value = "Net Value is required.";
    }
    if (!formData.tax_amount) {
      errors.tax_amount = "Tax Amount is required.";
    }
    // if (!formData.with_holding_tax) {
    //   errors.with_holding_tax = "Tax % required.";
    // }
    if (!formData.delivery_date) {
      errors.delivery_date = "Delivery Date is required.";
    } else {
      const today = moment().startOf("day");
      const selectedDate = moment(formData.delivery_date, "DD/MM/YYYY").startOf(
        "day"
      );

      if (selectedDate.isBefore(today)) {
        errors.delivery_date = "Delivery Date cannot be before today.";
      }
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async e => {
    setSelectedRowsPO([]);
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setModal(false);
    const updateLineItemData = await updatePoApiCall(formData);
    setToast(true);
    setToastMessage(updateLineItemData?.message);
    dispatch({
      type: GET_PO_REQUEST,
      payload: [],
    });
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };

  const renderSkeletonRows = () => {
    return Array.from(new Array(5)).map((_, index) => (
      <tr key={index}>
        <td>
          <Skeleton variant="text" width="80%" />
        </td>
        <td>
          <Skeleton variant="text" width="80%" />
        </td>
        <td>
          <Skeleton variant="text" width="80%" />
        </td>
        <td>
          <Skeleton variant="text" width="50%" />
        </td>
        <td>
          <Box display="flex" gap={2}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
        </td>
      </tr>
    ));
  };

  const columns = useMemo(() => {
    const commonColumns = [
      {
        Header: "Product Name",
        accessor: "product_description",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            {/* No checkbox in Product Description for Pending PO tab */}
            <span>{row.original.product_description}</span>
          </div>
        ),
      },
      {
        Header: "Vendor Product Description",
        accessor: "vendor_prod_description",
      },
      {
        Header: "Vendor",
        accessor: "vendor_code.label",
      },
    ];

    // Add specific columns for Pending PO tab (activeTab === 2)
    if (activeTab === 1) {
      // Add RFQ No with checkbox at the first position
      commonColumns.unshift(
        {
          Header: "RFQ No",
          accessor: "rfq_no",
          Cell: ({ row }) => (
            <div className="d-flex align-items-center">
              {poPermission &&
                poPermission?.can_add === true &&
                activeTab === 1 && (
                  <Input
                    type="checkbox"
                    style={{ cursor: "pointer" }}
                    checked={selectedRowsPO.includes(row.original)}
                    onChange={() => handleCheckboxPOChange(row.original)}
                    disabled={
                      selectedRowsPO.length > 0 &&
                      row.original.vendor_code.label !== selectedVendor?.label
                    }
                  />
                )}
              <span className={activeTab === 1 ? "ms-3" : ""}>
                {row.original.rfq_no}
              </span>
            </div>
          ),
        },
        {
          Header: "Line Item Number",
          accessor: "line_item_number",
        },
        {
          Header: "RFQ Quantity",
          accessor: "quantity",
        },
        {
          Header: "Quotation Price",
          accessor: "quotation_price",
        },
        {
          Header: "Unit Price",
          accessor: "unit_price",
        }
      );
    }

    if (activeTab !== 1) {
      // Add these columns only if the active tab is not "Pending PO"
      commonColumns.unshift(
        {
          Header: "Line Item No.",
          accessor: "po_line_item",
          Cell: ({ row }) => (
            <div className="d-flex align-items-center">
              {poPermission &&
                activeTab === 2 &&
                row.original?.request_status != 1 && (
                  <Input
                    type="checkbox"
                    style={{ cursor: "pointer" }}
                    checked={selectedRows.includes(row.original)}
                    onChange={() => handleCheckboxChange(row.original)}
                    disabled={
                      selectedRows.length > 0 &&
                      row.original.vendor_code.label !== selectedVendor?.label
                    }
                  />
                )}
              <span className={activeTab === 2 ? "ms-5" : "ms-1"}>
                {row.original.po_line_item}
              </span>
            </div>
          ),
        },
        {
          Header: "PO Number",
          accessor: "po_no",
          Cell: ({ row }) => (
            <div className="d-flex align-items-center">
              <span
                role="button"
                className="ms-3"
                style={{ textDecoration: "underline", cursor: "pointer", color: "inherit" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "blue")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                onClick={() => {
                  history.push("/Invoice/purchase",   
                    { row: row.original, type: "PO"}
                  );
                }}
              >
                {row.original.po_no}
              </span>
            </div>
          ),
        },
        {
          Header: "Net Value",
          accessor: "net_value",
        },
        {
          Header: "Net Price",
          accessor: "net_price",
        },
        {
          Header: "PO Quantity",
          accessor: "po_quantity",
        }
      );
    }

    // Add PO Date column only if activeTab is not 2 and place it second last
    if (activeTab !== 1) {
      commonColumns.push({
        Header: "PO Date",
        accessor: "po_date",
        Cell: ({ value }) => {
          const formattedDate = moment(value).format("DD/MM/YYYY");
          return <div>{formattedDate}</div>;
        },
      });
    }

    // Add Delivery Date as a common column
    commonColumns.push({
      Header: "Delivery Date",
      accessor: "delivery_date",
      Cell: ({ value }) => {
        const formattedDate = moment(value).format("DD/MM/YYYY");
        return <div>{formattedDate}</div>;
      },
    });

    if (activeTab === 3 || activeTab === 4) {
      commonColumns.push({
        Header: "Reason",
        accessor: "reason",
        Cell: ({ row }) => {
          const reason = row.original.reason || "No Reason";
          const words = reason.split(" ");
          const shouldTruncate = words?.length > 5;

          return (
            <div>
              {shouldTruncate ? (
                <>
                  {words.slice(0, 5).join(" ")}...
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      setSelectedReason(reason);
                      toggleModal();
                    }}
                  >
                    Read more
                  </a>
                </>
              ) : (
                reason
              )}
            </div>
          );
        },
      });
    }
    // Add Actions column as the last column if permissions allow and activeTab is not 2 or 5
    if (activeTab !== 1 && activeTab !== 5) {
      commonColumns.push({
        Header:
          (poPermission &&
            (poPermission?.can_edit || poPermission?.can_delete) &&
            activeTab === 2) ||
          activeTab === 3 ||
          activeTab === 4
            ? "Actions"
            : "",
        accessor: "action",
        disableFilters: true,
        Cell: cellProps => (
          <div className="d-flex gap-3">
            {[0].includes(cellProps.row.original?.request_status) &&
              poPermission &&
              poPermission?.can_edit &&
              activeTab === 2 && (
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
              )}
            {[0].includes(cellProps.row.original?.request_status) &&
              poPermission &&
              poPermission?.can_delete &&
              activeTab === 2 && (
                <Link
                  to="#"
                  onClick={() => onClickDelete(cellProps.row.original)}
                  className="text-danger"
                >
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                  />
                  <UncontrolledTooltip placement="top" target="deletetooltip">
                    Delete
                  </UncontrolledTooltip>
                </Link>
              )}
            {poPermission &&
              poPermission?.can_approved &&
              userData?.can_approved &&
              activeTab !== 5 && (
                <>
                  {[1, 2, 3].includes(
                    cellProps.row.original?.request_status
                  ) ? (
                    <Link to="#" className="text-success">
                      <i
                        className="mdi mdi-send font-size-18"
                        id={`request_nametooltip_${cellProps.row.index}`}
                      />
                      <UncontrolledTooltip
                        placement="top"
                        target={`request_nametooltip_${cellProps.row.index}`}
                      >
                        {"Approval Request Sent To " +
                          cellProps.row.original?.request_name}
                      </UncontrolledTooltip>
                    </Link>
                  ) : (
                    <Link
                      to="#"
                      className="text-success"
                      onClick={() =>
                        onClickApproveStatus(cellProps.row.original)
                      }
                    >
                      <i
                        className="mdi mdi-sticker-check-outline font-size-18"
                        id={`approvetooltip_${cellProps.row.index}`}
                      />
                      <UncontrolledTooltip
                        placement="top"
                        target={`approvetooltip_${cellProps.row.index}`}
                      >
                        Approve/Reject
                      </UncontrolledTooltip>
                    </Link>
                  )}
                </>
              )}
          </div>
        ),
      });
    }

    return commonColumns;
  }, [
    activeTab,
    selectedRows,
    selectedRowsPO,
    selectedVendor,
    poPermission,
    asnPermission,
  ]);

  document.title = "Detergent | Purchase Order";
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

          <Modal isOpen={isModalOpen} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Full Reason</ModalHeader>
            <ModalBody>{selectedReason}</ModalBody>
          </Modal>

          <Modal
            isOpen={showModal}
            toggle={() => setShowModal(false)}
            centered={true}
          >
            <ModalHeader toggle={() => setShowModal(false)} />
            <ModalBody className="py-3 px-5">
              <Row>
                <Col lg={12}>
                  <div className="text-center">
                    <i
                      className="mdi mdi-information-outline"
                      style={{ fontSize: "9em", color: "orange" }}
                    />
                    <h2>Do you want to Approve or Reject?</h2>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="text-center mt-3">
                    <textarea
                      className="form-control"
                      placeholder="Please provide a reason..."
                      rows={3}
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>
              {maxPriceBand > userData?.max_price_band && (
                <>
                  <Row>
                    <Col>
                      <div className="text-center mt-3">
                        <FormGroup>
                          <Label for="approvalManager">Approval Manager</Label>
                          <Select
                            // isMulti
                            multiple
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={approvalManager}
                            options={optionApprovalManager}
                            onChange={async approvalManager => {
                              setApprovalManager(approvalManager);
                            }}
                          ></Select>
                          {formErrors.approvalManager && (
                            <div
                              style={{
                                color: "#f46a6a",
                                fontSize: "80%",
                              }}
                            >
                              {formErrors.approvalManager}
                            </div>
                          )}
                        </FormGroup>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="text-center mt-3">
                        <Button
                          type="button"
                          className="btn-custom-theme btn-lg me-2"
                          onClick={() =>
                            sendApproval(
                              "po",
                              bulk == true
                                ? selectedRows
                                : [{ id: rowData?.id }],
                              1
                            )
                          }
                        >
                          Send Approval
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </>
              )}
              <Row>
                <Col>
                  <div className="text-center mt-3">
                    {(activeTab === 2 || activeTab === 4) &&
                      maxPriceBand <= userData?.max_price_band && (
                        <Button
                          type="button"
                          className="btn-custom-theme btn-lg me-2"
                          onClick={() =>
                            approvalStatus(
                              "po",
                              bulk == true
                                ? selectedRows
                                : [{ id: rowData?.id }],
                              1,
                              userId,
                              reason
                            )
                          }
                        >
                          Approve
                        </Button>
                      )}
                    {(activeTab === 2 || activeTab === 3) &&
                      maxPriceBand <= userData?.max_price_band && (
                        <button
                          type="button"
                          className="btn btn-danger btn-lg me-2"
                          onClick={() =>
                            approvalStatus(
                              "po",
                              bulk == true
                                ? selectedRows
                                : [{ id: rowData?.id }],
                              2,
                              userId,
                              reason
                            )
                          }
                        >
                          Reject
                        </button>
                      )}
                  </div>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
          <Modal isOpen={modal} centered>
            <ModalHeader>Edit Purchase Order LineItem</ModalHeader>
            <button
              type="button"
              onClick={() => {
                setModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <ModalBody>
              <div className="modal-body">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Label htmlFor="formrow-state-Input">
                        Line Item Number
                      </Label>
                      <Input
                        type="Number"
                        name="po_line_item"
                        className={`form-control ${
                          formErrors.po_line_item ? "is-invalid" : ""
                        }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Line Item Number"
                        value={formData?.po_line_item}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            po_line_item: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            po_line_item: "",
                          }));
                        }}
                      />
                      {formErrors.po_line_item && (
                        <div className="invalid-feedback">
                          {formErrors.po_line_item}
                        </div>
                      )}
                    </Col>
                    {/* <Col md={12} className="mb-3">
                      <Label htmlFor="formrow-state-Input">
                        Product Description
                      </Label>
                      <Input
                        type="textarea"
                        name="product_description"
                        className={`form-control ${
                          formErrors.product_description ? "is-invalid" : ""
                        }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Product Description"
                        value={formData?.product_description}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            product_description: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            product_description: "",
                          }));
                        }}
                      />
                      {formErrors.product_description && (
                        <div className="invalid-feedback">
                          {formErrors.product_description}
                        </div>
                      )}
                    </Col> */}
                    <Col md={12} className="mb-3">
                      <Label htmlFor="formrow-state-Input">
                        Vendor Description
                      </Label>
                      <Input
                        type="textarea"
                        name="vendor_prod_description"
                        className={`form-control ${
                          formErrors.vendor_prod_description ? "is-invalid" : ""
                        }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Vendor Description"
                        value={formData?.vendor_prod_description}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            vendor_prod_description: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            vendor_prod_description: "",
                          }));
                        }}
                      />
                      {formErrors.vendor_prod_description && (
                        <div className="invalid-feedback">
                          {formErrors.vendor_prod_description}
                        </div>
                      )}
                    </Col>
                    <Col md={12} className="mb-3">
                      <div className="">
                        <Label htmlFor="formrow-state-Input">Uom</Label>
                        <Select
                          value={selectProductUom}
                          options={optionProductUOM}
                          onChange={async selectProductUom => {
                            setFormData(prevData => ({
                              ...prevData,
                              uom: selectProductUom?.value,
                            }));
                            setSelectedProductUom(selectProductUom);
                          }}
                        />
                        {formErrors.uom && (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "80%",
                            }}
                          >
                            {formErrors.uom}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={12} className="mb-3">
                      <div className="mb-3">
                        <Label htmlFor="formrow-state-Input">
                          {" "}
                          PO Quantity
                        </Label>
                        <Input
                          type="number"
                          name="po_quantity"
                          className={`form-control ${
                            formErrors.po_quantity ? "is-invalid" : ""
                          }`}
                          id="formrow-state-Input"
                          placeholder="Please Enter po_quantity"
                          value={formData?.po_quantity}
                          onChange={e => {
                            setFormData(prevData => ({
                              ...prevData,
                              po_quantity: e.target.value,
                            }));
                            setFormErrors(prevErrors => ({
                              ...prevErrors,
                              po_quantity: "",
                            }));
                          }}
                        />
                        {formErrors.po_quantity && (
                          <div className="invalid-feedback">
                            {formErrors.po_quantity}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={12} className="mb-3">
                      <div className="mb-3">
                        <Label htmlFor="formrow-state-Input"> Net Price</Label>
                        <Input
                          type="number"
                          name="net_price"
                          className={`form-control ${
                            formErrors.net_price ? "is-invalid" : ""
                          }`}
                          id="formrow-state-Input"
                          placeholder="Please Enter Net Price"
                          value={formData?.net_price}
                          onChange={e => {
                            setFormData(prevData => ({
                              ...prevData,
                              net_price: e.target.value,
                            }));
                            setFormErrors(prevErrors => ({
                              ...prevErrors,
                              net_price: "",
                            }));
                          }}
                        />
                        {formErrors.net_price && (
                          <div className="invalid-feedback">
                            {formErrors.net_price}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={12} className="mb-3">
                      <div className="mb-3">
                        <Label htmlFor="formrow-state-Input"> Net Value</Label>
                        <Input
                          type="number"
                          name="net_value"
                          className={`form-control ${
                            formErrors.net_value ? "is-invalid" : ""
                          }`}
                          id="formrow-state-Input"
                          placeholder="Please Enter Net Price"
                          value={formData?.net_value}
                          onChange={e => {
                            setFormData(prevData => ({
                              ...prevData,
                              net_value: e.target.value,
                            }));
                            setFormErrors(prevErrors => ({
                              ...prevErrors,
                              net_value: "",
                            }));
                          }}
                        />
                        {formErrors.net_value && (
                          <div className="invalid-feedback">
                            {formErrors.net_value}
                          </div>
                        )}
                      </div>
                    </Col>
                    {/* <Col md={12} className="mb-3">
                      <div className="">
                        <Label htmlFor="formrow-state-Input">Tax %</Label>
                        <Select
                          value={selectWithholdingTax}
                          options={optionWithholdingTax}
                          onChange={async selectWithholdingTax => {
                            setFormData(prevData => ({
                              ...prevData,
                              withholding_tax_percentage:
                                selectWithholdingTax?.value,
                            }));
                            setFormData(prevData => ({
                              ...prevData,
                              with_holding_tax: selectWithholdingTax?.id,
                            }));
                            setFormData(prevData => ({
                              ...prevData,
                              tax_amount:
                                formData?.net_value != "" &&
                                selectWithholdingTax != ""
                                  ? (formData?.net_value *
                                      selectWithholdingTax?.value) /
                                    100
                                  : 0,
                            }));
                            setSelectedWithholdingTax(selectWithholdingTax);
                          }}
                        />
                        {formErrors.withholding_tax_percentage && (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "80%",
                            }}
                          >
                            {formErrors.withholding_tax_percentage}
                          </div>
                        )}
                      </div>
                    </Col> */}
                    {/* <Col md={12} className="mb-3">
                      <div className="">
                        <Label htmlFor="formrow-state-Input">
                          Tax Amount :{" "}
                        </Label>
                        {formData?.tax_amount}
                      </div>
                    </Col> */}
                    <Col md={6} className="mb-3">
                      <div className="form-floating mb-3">
                        <Flatpickr
                          options={{
                            altInput: true,
                            altFormat: "j F, Y",
                            dateFormat: "Y-m-d",
                          }}
                          onChange={handleDateChange}
                          value={
                            formData.delivery_date
                              ? moment(
                                  formData.delivery_date,
                                  "DD/MM/YYYY"
                                ).toDate()
                              : null
                          }
                        />
                        <label htmlFor="delivery_date">Delivery date</label>
                        {formErrors.delivery_date && (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "80%",
                            }}
                          >
                            {formErrors.delivery_date}
                          </div>
                        )}
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
            </ModalBody>
          </Modal>
          <DeleteModal
            show={deleteModal}
            title1="Are you sure?"
            title2="You won't be able to delete this!"
            className="mdi mdi-alert-circle-outline"
            saveTitle="Yes, delete it!"
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
          />
          <Breadcrumbs
            titlePath="#"
            title="PO"
            breadcrumbItem="Purchase Order"
          />
          <Card>
            <Row>
              <Col lg="12">
                <div className="custom-tabs-wrapper">
                  <ul className="custom-tab-nav">
                    {[
                      { id: 2, label: "Open PO" },
                      { id: 3, label: "Approved PO" },
                      { id: 4, label: "Rejected PO" },
                      { id: 5, label: "Closed PO" },
                    ].map((tab, index) => (
                      <li key={tab.id} className="custom-tab-item">
                        <button
                          className={`custom-tab-link ${
                            activeTab === tab.id ? "active" : ""
                          }`}
                          onClick={() => toggleTab(tab.id)}
                        >
                          <span className="tab-index">{index + 1}</span>
                          {tab.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Table Container */}

          {loading ? (
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <Skeleton variant="text" width="80%" />
                  </th>
                  <th>
                    <Skeleton variant="text" width="80%" />
                  </th>
                  <th>
                    <Skeleton variant="text" width="80%" />
                  </th>
                  <th>
                    <Skeleton variant="text" width="80%" />
                  </th>
                  <th>
                    <Skeleton variant="text" width="80%" />
                  </th>
                </tr>
              </thead>
              <tbody>{renderSkeletonRows()}</tbody>
            </table>
          ) : (
            <TableContainer
              columns={columns}
              data={
                activeTab === 1
                  ? po?.poQuotationList && po?.poQuotationList.length > 0
                    ? po.poQuotationList
                    : []
                  : activeTab === 2
                  ? po?.openPoList && po?.openPoList.length > 0
                    ? po.openPoList
                    : []
                  : activeTab === 3
                  ? po?.approvedPoList && po?.approvedPoList.length > 0
                    ? po.approvedPoList
                    : []
                  : activeTab === 4
                  ? po?.rejectedPoList && po?.rejectedPoList.length > 0
                    ? po.rejectedPoList
                    : []
                  : allData
              }
              isGlobalFilter={true}
              isApprovalRequest={po?.approvalRequested == 0 ? false : true}
              isAddOptions={true}
              handleClicks={handleClicks}
              showASNButton={
                asnPermission && asnPermission?.can_add && activeTab === 3
              }
              handleASNClick={handleASNClick}
              showApproveButton={
                poPermission &&
                userData?.can_approved &&
                poPermission?.can_approved &&
                activeTab === 2
              }
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                poPermission && poPermission?.can_add && activeTab !== 1
                  ? "Add Purchase Order"
                  : null
              }
              buttonSizes={
                selectedRows.length > 0 && activeTab === 3
                  ? {
                      ASN: "2",
                      addButtonLabel:
                        poPermission &&
                        poPermission?.can_add &&
                        userData?.can_approved &&
                        poPermission?.can_approved &&
                        poPermission?.can_add
                          ? "2"
                          : "4",
                    }
                  : { addButtonLabel: "3" }
              }
              selectedRowsPO={selectedRowsPO}
              selectedRows={selectedRows}
              handlePOClick={handlePOClick}
              showPOButton={
                poPermission && poPermission?.can_add && activeTab === 1
              }
              handleApproveClick={handleApproveClick}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default PurchaseOrder;
