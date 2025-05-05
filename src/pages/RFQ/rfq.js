
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  UncontrolledTooltip,
  Modal,
  ModalBody,
  Label,
  ModalHeader,
  Form,
  Button,
  Alert,
} from "reactstrap";
import Select from "react-select";
import { getSelectData } from "helpers/Api/api_common";
import debounce from "lodash/debounce";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { useHistory, Link } from "react-router-dom";
import classnames from "classnames";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import { GET_RFQ_REQUEST } from "../../store/RFQ/actionTypes";
import { updateApprovalStatus } from "helpers/Api/api_common";
import { useSelector, useDispatch } from "react-redux";
import {
  updateLineItemApiCall,
  deleteLineItemApiCall,
} from "helpers/Api/api_common";
import moment from "moment";
import { productTechParameterByID } from "helpers/Api/api_products";
import { getProductsByID } from "helpers/Api/api_products";
import DeleteModal from "components/Common/DeleteModal";
import { Skeleton, Box } from "@mui/material";

const rfq = () => {
  const history = useHistory();
  const { rfq } = useSelector(state => state.rfq);
  const dispatch = useDispatch();
  const [toast, setToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [userId, setUserId] = useState({});
  const [toastMessage, setToastMessage] = useState();
  const [reason, setReason] = useState("");
  const [userData, setUserdata] = useState();
  const [activeTab, setActiveTab] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsPO, setSelectedRowsPO] = useState([]);
  const [allData, setAllData] = useState([]);
  const [modal, setModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [poPermission, setPoPermission] = useState();
  const [rfqPermission, setRfqPermission] = useState();
  const [optionProductList, setOptionProductList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [cell, setCell] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [rowData, setRowData] = useState("");
  const [bulk, setBulk] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    rfq_line_item_no: "",
    rfq_no: "",
    rfq_date: "",
    delivery_date: "",
    vendor_prod_description: "",
    rfq_quantity: "",
    product_code: "",
    tech_ids: [],
    technical_set_value: [],
    tableData: [],
  });

  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };
  const handleSave = (vendorList, cell) => {
    setAllData(allData.length > 0 ? allData : rfq?.receivedQuotationList)
    const selectedVendor = vendorList.find(v => v.isChecked);
    setShowModal(false);
    const updatedRow = {
      ...cell.row.original,
      vendor_list: vendorList,
    };
    // Update the entire data list
    setAllData(prevData => {
      const updatedData = [...prevData];
      updatedData[cell.row.index] = updatedRow; // Replace the specific row
      return updatedData;
    });
    setSelectedVendor(vendorList);

    if (!selectedVendor) {
      setSelectedRowsPO(prevSelected =>
        prevSelected.filter(item => item !== cell.row.original)
      );
    }
  };

  useEffect(() => {
    setLoading(false);
    const userData = getUserData();
    setUserdata(userData);
    setUserId(userData?.user?.id);
    var permissions = userData?.permissionList.filter(
      permission =>
        permission.sub_menu_name === "po" || permission.sub_menu_name === "rfq"
    );
    setPoPermission(
      permissions.find(permission => permission.sub_menu_name === "po")
    );
    setRfqPermission(
      permissions.find(permission => permission.sub_menu_name === "rfq")
    );
    dispatch({
      type: GET_RFQ_REQUEST,
      payload: [],
    });
  }, [activeTab, toastMessage]);

  const handleClicks = () => {
    history.push({
      pathname: "/rfq/create_rfq",
      state: { editRFQ: "", LineItem: [] },
    });
  };

  const handleInputChangeParameter = (section, labelId, data) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [section]: {
        ...prevFormData[section],
        [labelId]: data,
      },
    }));
  };

  const approvalStatus = async (
    type,
    lineArray,
    approval_status,
    updatedby,
    reason
  ) => {
    setApproveModal(false);
    const approvalStatus = await updateApprovalStatus(
      type,
      lineArray,
      approval_status,
      updatedby,
      reason
    );
    setToast(true);
    if (approvalStatus?.success) {
      dispatch({
        type: GET_RFQ_REQUEST,
        payload: [],
      });
      setToastMessage(approvalStatus?.message);
      setSelectedRows([]);
    } else {
      setToastMessage("Status Not Update");
    }
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };

  const toggleTab = tab => {
    setActiveTab(tab);
    setSelectedRows([]);
  };

  const openModal = async (data = null) => {
    const TableDataList = await productTechParameter(data?.tech_ids.join(","));
    setFormData({
      id: data?.id,
      rfq_line_item_no: data?.rfq_line_item_no,
      rfq_no: data?.rfq_no,
      rfq_date: data?.rfq_date,
      delivery_date: data?.delivery_date,
      vendor_prod_description: data?.vendor_prod_description,
      rfq_quantity: data?.rfq_quantity,
      product: data?.product,
      product_code: data?.product_code,
      tech_ids: data?.tech_ids,
      technical_set_value: data?.technical_set_value,
      tableData: TableDataList,
      updatedby: userData?.user?.id,
    });

    setModal(true);
  };
  const handleCheckboxVendorChange = index => {
    const updatedVendors = vendorList.map((vendor, idx) => ({
      ...vendor,
      isChecked: idx === index ? !vendor.isChecked : false, // Toggle the selected vendor and uncheck others
    }));
    setVendorList(updatedVendors); // Update the state with the new vendor list
  };

  const handleCheckboxChange = row => {
    setSelectedRows(prevSelected =>
      prevSelected.includes(row)
        ? prevSelected.filter(item => item !== row)
        : [...prevSelected, row]
    );
  };
  const handleCheckboxPOChange = row => {
    if (!row.vendor_list.some(vendor => vendor.isChecked)) {
      alert("Please select a vendor before proceeding."); // Show a popup message
      return;
    }
    setSelectedRowsPO(prevSelected =>
      prevSelected.includes(row)
        ? prevSelected.filter(item => item !== row)
        : [...prevSelected, row]
    );
  };

  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };

  const handlePOClick = async () => {
    const approvalStatus = await updateApprovalStatus(
      "vendor_rfq",
      selectedRowsPO,
      2
    );
    setToast(true);
    if (approvalStatus?.success) {
      setToastMessage("PO created successfully");
      setTimeout(() => {
        setToast(false);
        history.push({
          pathname: "purchase_order",
          state: { activeTab: 1 },
        });
      }, 1000);
    } else {
      setToastMessage("Status Not Update");
    }
  };

  const handleApproveClick = () => {
    setApproveModal(true);
    setBulk(true);
  };

  const onClickApproveStatus = item => {
    setRowData(item);
    setApproveModal(true);
  };

  const handleDelete = async () => {
    try {
      setDeleteModal(false);
      const deleteLineItemData = await deleteLineItemApiCall(
        rowData?.id,
        "rfq"
      );
      setToast(true);
      setToastMessage(deleteLineItemData?.message);
      setSelectedRows([]);
      dispatch({
        type: GET_RFQ_REQUEST,
        payload: [],
      });
      setTimeout(() => {
        setToast(false);
      }, 2000);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.rfq_line_item_no) {
      errors.rfq_line_item_no = "Line Item Number is required.";
    }
    if (!formData.rfq_quantity) {
      errors.rfq_quantity = "RFQ Quantity is required.";
    }
    if (!formData.product) {
      errors.product_name = "Product Name is required.";
    }
    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setModal(false);
    const updateLineItemData = await updateLineItemApiCall(formData, "rfq");
    setToast(true);
    setToastMessage(updateLineItemData?.message);
    setSelectedRows([]);
    dispatch({
      type: GET_RFQ_REQUEST,
      payload: [],
    });
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };

  const productTechParameter = async parameter_sets => {
    const response = await productTechParameterByID(parameter_sets);
    return response?.productTechParameterByID;
  };

  const handleShowVendorModal = (vendorListData, cell) => {
    setVendorList(vendorListData);
    setCell(cell);
    setShowModal(true);
  };

  const handleInputProductList = useCallback(
    debounce(async inputValue => {
      try {
        const selectProductListData = await getSelectData(
          "product_description",
          inputValue,
          "product_master"
        );
        setOptionProductList(selectProductListData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const getTableData = () => {
    if (activeTab === 1) {
      return rfq?.openRfqList?.length > 0 ? rfq.openRfqList : [];
    }
    if (activeTab === 2) {
      return rfq?.approvedRfqList?.length > 0 ? rfq?.approvedRfqList : [];
    }
    if (activeTab === 3) {
      return rfq?.rejectedRfqList?.length > 0 ? rfq.rejectedRfqList : [];
    }
    if (activeTab === 4) {
      return rfq?.closeRfqList?.length > 0 ? rfq.closeRfqList : [];
    }
    if (activeTab === 5 && selectedVendor) {
      return allData;
    }
    if (activeTab === 5) {
      return rfq?.receivedQuotationList?.length > 0 ? rfq.receivedQuotationList : [];
    }
    return [];
  };

  const renderSkeletonRows = () => {
    return Array.from(new Array(5)).map((_, index) => (
      <tr key={index}>
        <td><Skeleton variant="text" width="80%" /></td>
        <td><Skeleton variant="text" width="80%" /></td>
        <td><Skeleton variant="text" width="80%" /></td>
        <td><Skeleton variant="text" width="50%" /></td>
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
    // Base columns that are always present
    const baseColumns = [
      {
        Header: "Rfq No.",
        accessor: "rfq_no",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            {activeTab === 1 && (
              <Input
                type="checkbox"
                style={{ cursor: "pointer" }}
                checked={selectedRows.includes(row.original)}
                disabled={false}
                onChange={() => handleCheckboxChange(row.original)}
              />
            )}
            {activeTab === 5 && (
              <Input
                type="checkbox"
                style={{ cursor: "pointer" }}
                checked={selectedRowsPO.includes(row.original)}
                onChange={() => handleCheckboxPOChange(row.original)}
              />
            )}
            <span className={activeTab === 1 || activeTab === 5 ? "ms-5" : ""}>
              {row.original.rfq_no}
            </span>
          </div>
        ),
      },
      {
        Header: "Line Item Number",
        accessor: "rfq_line_item_no",
      },
      {
        Header: "Product Code",
        accessor: "product_code",
      },
      {
        Header: "Vendor",
        accessor: "vendor_list",
        Cell: ({ value, cell }) => {
          const vendorCount = value?.length;
          return (
            <div className="d-flex gap-3">
              {vendorCount}
              <Link
                to="#"
                className="text-success"
                onClick={() =>
                  handleShowVendorModal(cell.row.original.vendor_list, cell)
                }
              >
                <i className="mdi mdi-eye font-size-18" id="viewtooltip" />
                <UncontrolledTooltip placement="top" target="viewtooltip">
                  View
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
      ...(activeTab === 2 || activeTab === 3
        ? [
          {
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
          },
        ]
        : []),
      {
        Header: "Actions",
        accessor: "action",
        disableFilters: true,
        Cell: cellProps => (
          <div className="d-flex gap-3">
            {rfqPermission && rfqPermission?.can_edit && activeTab === 1 && (
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
            {rfqPermission && rfqPermission?.can_delete && activeTab === 1 && (
              <Link
                to="#"
                onClick={() => onClickDelete(cellProps.row.original)}
                className="text-danger"
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>
            )}
            {rfqPermission &&
              rfqPermission?.can_approved &&
              activeTab !== 4 &&
              activeTab !== 5 && (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => onClickApproveStatus(cellProps.row.original)}
                >
                  <i
                    className="mdi mdi-sticker-check-outline font-size-18"
                    id="approvetooltip"
                  />
                  <UncontrolledTooltip placement="top" target="approvetooltip">
                    Approve/Reject
                  </UncontrolledTooltip>
                </Link>
              )}
            <Link
              to={{
                pathname: "/rfq/rfq_details",
                state: { rfq_id: cellProps.row.original?.rfq_id },
              }}
              className="text-success"
            >
              <i
                className="mdi mdi-email-check font-size-18"
                id="printtooltip"
              />
              <UncontrolledTooltip placement="top" target="printtooltip">
                Email/Pdf/Print
              </UncontrolledTooltip>
            </Link>
          </div>
        ),
      },
    ];

    if (activeTab != 5) {
      baseColumns.splice(
        4,
        0,
        {
          Header: "Rfq Quantity",
          accessor: "rfq_quantity",
        },
        {
          Header: "Vendor Product Description",
          accessor: "vendor_prod_description",
        },
        {
          Header: "Rfq Date",
          accessor: "rfq_date",
          Cell: ({ value }) => {
            const formattedDate = moment(value).format("DD/MM/YYYY");
            return <div>{formattedDate}</div>;
          },
        },
        {
          Header: "Delivery Date",
          accessor: "delivery_date",
          Cell: ({ value }) => {
            const formattedDate = moment(value).format("DD/MM/YYYY");
            return <div>{formattedDate}</div>;
          },
        }
      );
    }

    return baseColumns;
  }, [activeTab, selectedRows, selectedRowsPO, rfqPermission]);

  document.title = "Detergent | RFQ";

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
            isOpen={approveModal}
            toggle={() => setApproveModal(false)}
            centered={true}
          >
            <ModalHeader toggle={() => setApproveModal(false)} />
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
              <Row>
                <Col>
                  <div className="text-center mt-3">
                    {(activeTab === 1 || activeTab === 3) && (
                      <button
                        type="button"
                        className="btn btn-custom-theme btn-lg me-2"
                        onClick={() =>
                          approvalStatus(
                            "rfq",
                            bulk == true ? selectedRows : [{ id: rowData?.id }],
                            1,
                            userId,
                            reason
                          )
                        }
                      >
                        Approve
                      </button>
                    )}
                    {(activeTab === 1 ||
                      activeTab === 2 ||
                      activeTab === 5) && (
                        <button
                          type="button"
                          className="btn btn-danger btn-lg me-2"
                          onClick={() => {
                            if (activeTab === 5) {
                              approvalStatus(
                                "vendor_rfq",
                                bulk === true ? selectedRows : [rowData],
                                2,
                                userId,
                                reason
                              );
                            } else {
                              approvalStatus(
                                "rfq",
                                bulk === true
                                  ? selectedRows
                                  : [{ id: rowData?.id }],
                                2,
                                userId,
                                reason
                              );
                            }
                          }}
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
            <ModalHeader>Edit RFQ LineItem</ModalHeader>
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
                        RFQ Line Number
                      </Label>
                      <Input
                        type="Number"
                        name="rfq_line_item_no"
                        className={`form-control ${formErrors.rfq_line_item_no ? "is-invalid" : ""
                          }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Line Item Number"
                        value={formData?.rfq_line_item_no}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            rfq_line_item_no: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            rfq_line_item_no: "",
                          }));
                        }}
                      />
                      {formErrors.rfq_line_item_no && (
                        <div className="invalid-feedback">
                          {formErrors.rfq_line_item_no}
                        </div>
                      )}
                    </Col>
                    <Col md={12} className="mb-3">
                      <Label htmlFor="formrow-state-Input">RFQ Quantity</Label>
                      <Input
                        type="number"
                        name="rfq_quantity"
                        className={`form-control ${formErrors.rfq_quantity ? "is-invalid" : ""
                          }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter RFQ Quantity"
                        value={formData?.rfq_quantity}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            rfq_quantity: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            rfq_quantity: "",
                          }));
                        }}
                      />
                      {formErrors.rfq_quantity && (
                        <div className="invalid-feedback">
                          {formErrors.rfq_quantity}
                        </div>
                      )}
                    </Col>
                    <Col md={12} className="mb-3">
                      <div className="">
                        <Label htmlFor="formrow-state-Input">
                          Product Name
                        </Label>
                        <Select
                          value={formData?.product}
                          options={optionProductList}
                          onChange={async selectProductList => {
                            setFormData(prevData => ({
                              ...prevData,
                              product: selectProductList,
                            }));
                            const getProductData = await getProductsByID(
                              selectProductList?.value
                            );
                            const technical_setData = JSON.parse(
                              getProductData?.technical_set_value
                            );
                            const Techids = Object.values(
                              technical_setData
                            ).flatMap(item => item.id);
                            const TableDataList = await productTechParameter(
                              Techids.join(",")
                            );
                            setFormData(prevData => ({
                              ...prevData,
                              tableData: TableDataList,
                            }));
                            setFormData(prevData => ({
                              ...prevData,
                              technical_set_value: technical_setData,
                            }));
                          }}
                          onInputChange={(inputValue, { action }) => {
                            handleInputProductList(inputValue);
                          }}
                        />
                        {formErrors.product_name && (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "80%",
                            }}
                          >
                            {formErrors.product_name}
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    {formData?.tableData?.length > 0 &&
                      formData?.tableData.map((items, index) => {
                        const itemType = items.types[0];
                        const labelId = `${itemType}-${index}`;
                        const commonProps = {
                          value:
                            formData?.technical_set_value[labelId]?.label ??
                            items?.values[0],
                          onChange: event => {
                            const value = event.target?.value ?? event;
                            handleInputChangeParameter(
                              "technical_set_value",
                              labelId,
                              {
                                id: items?.items[0]?.id,
                                type: items?.types[0],
                                label: value,
                              }
                            );
                          },
                        };
                        const renderInputField = () => {
                          switch (itemType) {
                            case "datebox":
                              return (
                                <Flatpickr
                                  placeholder="dd M, yyyy"
                                  options={{
                                    altInput: true,
                                    altFormat: "j F, Y",
                                    dateFormat: "Y-m-d",
                                  }}
                                  onChange={selectedDates => {
                                    handleInputChangeParameter(
                                      "technical_set_value",
                                      labelId,
                                      {
                                        id: items?.items[0]?.id,
                                        type: items?.types[0],
                                        label: moment(selectedDates[0]).format(
                                          "DD/MM/YYYY"
                                        ),
                                      }
                                    );
                                  }}
                                  value={moment(
                                    commonProps.value,
                                    "DD/MM/YYYY"
                                  ).toDate()}
                                />
                              );
                            case "textfield":
                              return (
                                <Input
                                  type="text"
                                  id={`textfield-${index}`}
                                  name={`textfield-${index}`}
                                  {...commonProps}
                                  placeholder="Please Enter Text Field"
                                />
                              );
                            case "dropdown":
                              return (
                                <Select
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  options={items?.items}
                                  value={
                                    formData?.technical_set_value[labelId] ==
                                      null
                                      ? items?.values[0]
                                      : formData?.technical_set_value[labelId]
                                        ?.dropdown
                                  }
                                  onChange={selectedSet => {
                                    handleInputChangeParameter(
                                      "technical_set_value",
                                      labelId,
                                      {
                                        id: items?.items[0]?.id,
                                        type: items?.types[0],
                                        dropdown: selectedSet,
                                      }
                                    );
                                  }}
                                />
                              );
                            case "textarea":
                              return (
                                <Input
                                  type="textarea"
                                  id={`textarea-${index}`}
                                  name={`textarea-${index}`}
                                  {...commonProps}
                                  rows="1"
                                  placeholder="Please Enter Text Area"
                                />
                              );
                            case "dateTime":
                              return (
                                <Flatpickr
                                  placeholder="dd M, yyyy HH:mm"
                                  options={{
                                    altInput: true,
                                    altFormat: "j F, Y h:i K",
                                    dateFormat: "Y-m-d h:i K",
                                    enableTime: true,
                                    time_24hr: false,
                                  }}
                                  onChange={selectedDates => {
                                    handleInputChangeParameter(
                                      "technical_set_value",
                                      labelId,
                                      {
                                        id: items?.items[0]?.id,
                                        type: items?.types[0],
                                        label: moment(selectedDates[0]).format(
                                          "DD/MM/YYYY hh:mm A"
                                        ),
                                      }
                                    );
                                  }}
                                  value={moment(
                                    commonProps.value,
                                    "DD/MM/YYYY hh:mm A"
                                  ).toDate()}
                                />
                              );
                            case "timebox":
                              return (
                                <Flatpickr
                                  placeholder="HH:mm"
                                  options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: "h:i K",
                                    altFormat: "h:i K",
                                    time_24hr: false,
                                  }}
                                  onChange={selectedDates => {
                                    handleInputChangeParameter(
                                      "technical_set_value",
                                      labelId,
                                      {
                                        id: items?.items[0]?.id,
                                        type: items?.types[0],
                                        label: moment(selectedDates[0]).format(
                                          "hh:mm A"
                                        ),
                                      }
                                    );
                                  }}
                                  value={moment(
                                    commonProps.value,
                                    "hh:mm A"
                                  ).toDate()}
                                />
                              );
                            case "urlbox":
                              return (
                                <Input
                                  type="text"
                                  id="urlbox"
                                  name="urlbox"
                                  {...commonProps}
                                  placeholder="Please Enter Url"
                                />
                              );
                            case "emailbox":
                              return (
                                <Input
                                  type="email"
                                  id="emailbox"
                                  name="emailbox"
                                  {...commonProps}
                                  placeholder="Please Enter Email"
                                />
                              );
                            case "colorbox":
                              return (
                                <Input
                                  type="color"
                                  id="colorbox"
                                  name="colorbox"
                                  {...commonProps}
                                />
                              );
                            case "numberbox":
                              return (
                                <Input
                                  type="number"
                                  id="numberbox"
                                  name="numberbox"
                                  {...commonProps}
                                  placeholder="Please Enter Number"
                                />
                              );
                            case "multipleselect":
                              return (
                                <Select
                                  isMulti
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  options={items?.items}
                                  value={
                                    formData?.technical_set_value[labelId] ==
                                      null
                                      ? items?.values[0]
                                      : formData?.technical_set_value[labelId]
                                        ?.multipleselect
                                  }
                                  onChange={selectedSet => {
                                    handleInputChangeParameter(
                                      "technical_set_value",
                                      labelId,
                                      {
                                        id: items?.items[0]?.id,
                                        type: items?.types[0],
                                        default_value:
                                          selectedSet[0]?.default_value,
                                        multipleselect: selectedSet,
                                      }
                                    );
                                  }}
                                />
                              );
                            default:
                              return null;
                          }
                        };

                        return (
                          <Col key={index} md={6} className="mb-3">
                            <Label htmlFor={`${itemType}-${index}`}>
                              {items?.labels[0]}
                            </Label>
                            {renderInputField()}
                            {formErrors?.[`${itemType}-${index}`] && (
                              <div
                                style={{ color: "#f46a6a", fontSize: "80%" }}
                              >
                                {formErrors?.[`${itemType}-${index}`]}
                              </div>
                            )}
                          </Col>
                        );
                      })}
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
            </ModalBody>
          </Modal>

          <Modal isOpen={showModal} toggle={() => setShowModal(false)} centered>
            <ModalHeader toggle={() => setShowModal(false)}>
              {activeTab === 5 ? "Quotation Details" : "Vendors Information"}
            </ModalHeader>
            <ModalBody>
              {vendorList.length > 0 ? (
                activeTab === 5 ? (
                  <div>
                    {vendorList.map((vendor, index) => (
                      <div
                        key={index}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "10px",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <label style={{ display: "flex", alignItems: "center" }}>
                          <input
                            type="checkbox"
                            style={{ marginRight: "8px" }}
                            checked={vendor.isChecked}
                            onChange={() => handleCheckboxVendorChange(index)}
                          />
                          {vendor.label}
                        </label>
                        <div>
                          <div>Quotation Price: {vendor.quotation_price}</div>
                          <div>Unit Price: {vendor.unit_price}</div>
                          <div>
                            Delivery Date:{" "}
                            {moment(vendor.delivery_date).format("DD/MM/YYYY")}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-custom-theme btn-lg me-3"
                      onClick={() =>
                        handleSave(
                          vendorList,
                          cell
                        )
                      }
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <ul>
                    {vendorList.map((vendor, index) => (
                      <li
                        key={index}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        {vendor.label}
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                <p>No vendors available</p>
              )}
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

          <Breadcrumbs titlePath="#" title="RFQ" breadcrumbItem="RFQ" />
          <Card>
            <Row>
              <Col lg="12">
                <div className="wizard clearfix">
                  <div className="steps clearfix">
                    <ul className="nav nav-tabs nav-justified">
                      <li
                        className={classnames({
                          current: activeTab === 1,
                        })}
                      >
                        <a
                          style={{
                            fontWeight: activeTab === 1 ? "bold" : "normal",
                            textAlign: "center",
                          }}
                          className={classnames({
                            active: activeTab === 1,
                          })}
                          onClick={() => {
                            toggleTab(1);
                          }}
                        >
                          <span className="number">1</span> Open RFQ
                        </a>
                      </li>
                      <li
                        className={classnames({
                          current: activeTab === 2,
                        })}
                      >
                        <a
                          style={{
                            fontWeight: activeTab === 2 ? "bold" : "normal",
                            textAlign: "center",
                          }}
                          className={classnames({
                            active: activeTab === 2,
                          })}
                          onClick={() => {
                            toggleTab(2);
                          }}
                        >
                          <span className="number">2</span> Approved RFQ
                        </a>
                      </li>
                      <li
                        className={classnames({
                          current: activeTab === 3,
                        })}
                      >
                        <a
                          style={{
                            fontWeight: activeTab === 3 ? "bold" : "normal",
                            textAlign: "center",
                          }}
                          className={classnames({
                            active: activeTab === 3,
                          })}
                          onClick={() => {
                            toggleTab(3);
                          }}
                        >
                          <span className="number">3</span> Rejected RFQ
                        </a>
                      </li>
                      <li
                        className={classnames({
                          current: activeTab === 4,
                        })}
                      >
                        <a
                          style={{
                            fontWeight: activeTab === 4 ? "bold" : "normal",
                            textAlign: "center",
                          }}
                          className={classnames({
                            active: activeTab === 4,
                          })}
                          onClick={() => {
                            toggleTab(4);
                          }}
                        >
                          <span className="number">4</span> Closed RFQ
                        </a>
                      </li>
                      <li
                        className={classnames({
                          current: activeTab === 5,
                        })}
                      >
                        <a
                          style={{
                            fontWeight: activeTab === 5 ? "bold" : "normal",
                            textAlign: "center",
                          }}
                          className={classnames({
                            active: activeTab === 5,
                          })}
                          onClick={() => {
                            toggleTab(5);
                          }}
                        >
                          <span className="number">5</span> Received Quatation
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {loading ? (
            <table className="table">
              <thead>
                <tr>
                  <th><Skeleton variant="text" width="80%" /></th>
                  <th><Skeleton variant="text" width="80%" /></th>
                  <th><Skeleton variant="text" width="80%" /></th>
                  <th><Skeleton variant="text" width="80%" /></th>
                  <th><Skeleton variant="text" width="80%" /></th>
                </tr>
              </thead>
              <tbody>
                {renderSkeletonRows()}
              </tbody>
            </table>
          ) : (
            <TableContainer
              columns={columns}
              data={getTableData()} // Using the refactored function
              isGlobalFilter={true}
              isAddOptions={true}
              handleClicks={handleClicks}
              customPageSize={10}
              className="custom-header-css"
              addButtonLabel={
                rfqPermission && rfqPermission?.can_add ? "Add RFQ" : null
              }
              selectedRows={selectedRows}
              selectedRowsPO={selectedRowsPO}
              showPOButtonQuotation={
                poPermission && poPermission?.can_add && activeTab === 5
              }
              showApproveButton={
                rfqPermission && rfqPermission?.can_approved && activeTab === 1
              }
              handlePOClick={handlePOClick}
              buttonSizes={
                selectedRowsPO.length > 0 && activeTab === 5
                  ? {
                    PO: "6",
                    addButtonLabel:
                      poPermission &&
                        poPermission?.can_add &&
                        poPermission?.can_approved &&
                        poPermission?.can_add
                        ? "2"
                        : "4",
                  }
                  : { addButtonLabel: "4" }
              }
              handleApproveClick={handleApproveClick}
              handleCheckboxChange={handleCheckboxChange}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default rfq;
