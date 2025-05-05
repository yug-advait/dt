import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useHistory, Link } from 'react-router-dom';
import { Row, Col, Card, Input, Alert, Modal, ModalHeader, ModalBody, Button, UncontrolledTooltip, Form } from "reactstrap";
import TableContainer from "components/Common/TableContainer";
import { GET_SALES_ORDER_REQUEST } from "../../store/salesOrderMaster/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import classnames from "classnames";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import DeleteModal from "components/Common/DeleteModal";
import { debounce } from "lodash";
import { getSelectData, updateLineItemApiCall, deleteLineItemApiCall, updateApprovalStatus } from "helpers/Api/api_common";
import RequiredLabel from "components/Common/RequiredLabel";
import { Skeleton, Box } from "@mui/material";


const SalesOrderMaster = () => {

    const dispatch = useDispatch();
    const { salesOrders } = useSelector(state => state.salesOrders);
    const history = useHistory();

    const [toast, setToast] = useState(false);
    const [toastMessage, setToastMessage] = useState();
    const [activeTab, setActiveTab] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [reason, setReason] = useState('');
    const [editData, setEditData] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [selectProduct, setSelectedProduct] = useState({});
    const [optionProduct, setOptionProduct] = useState([]);
    const [selectProductUom, setSelectProductUom] = useState({});
    const [optionProductUom, setOptionProductUom] = useState([]);
    const [selectProductPlant, setSelectProductPlant] = useState({});
    const [optionProductPlant, setOptionProductPlant] = useState([]);
    const [selectProductLocation, setSelectProductLocation] = useState({});
    const [optionProductLocation, setOptionProductLocation] = useState([]);
    const [salesOrderPermission, setSalesOrderPermission] = useState();
    const [deliveryOrderPermission, setDeliveryOrderPermission] = useState();
    const [bulk, setBulk] = useState(false);
    const [modal, setModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isModalOpen, setIsModelOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [rowData, setRowData] = useState("");
    const [selectedShip, setSelectedShip] = useState(null);
    const [selectedSold, setSelectedSold] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        sales_order_line_item_no: "",
        product_code: "",
        product_description: "",
        customer_prod_description: "",
        so_quantity: "",
        uom_id: "",
        warehouse_id: "",
        location_id: "",
        delivery_date: ""
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const flatpickrRef = useRef(null);

    const getUserData = () => {
        if (localStorage.getItem("authUser")) {
            const obj = JSON.parse(localStorage.getItem("authUser"));
            return obj;
        }
    };

    useEffect(() => {
        setLoading(false);
        dropDownList();
        const userData = getUserData();
        var permissions = userData?.permissionList.filter(
            permission =>
                permission.sub_menu_name === "so" || permission.sub_menu_name === "deliveryOrder"
        );
        setSalesOrderPermission(
            permissions.find(permission => permission.sub_menu_name === "so")
        );
        setDeliveryOrderPermission(
            permissions.find(permission => permission.sub_menu_name === "deliveryOrder")
        );
        dispatch({
            type: GET_SALES_ORDER_REQUEST,
            payload: []
        });
    }, [activeTab]);

    useEffect(() => {
        if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
            const instance = flatpickrRef.current.flatpickr;
            if (instance.altInput) {
                instance.altInput.style.borderColor = formErrors.delivery_date ? 'red' : '#ced4da'; // Red if there's an error
            }
        }
    }, [formErrors.delivery_date]);

    const handleSalesOrderClick = () => {
        history.push({ pathname: '/sales_orders/create', state: { editSalesOrder: "", direct: true } });
    }

    const handleDeliveryOrderClick = () => {
        history.push({
            pathname: 'delivery_orders/create',
            state: { editSalesOrder: "", LineItem: selectedRows },
        });
    };

    const handleCheckboxChange = (row) => {
        const ship = row.ship_to_customer;
        const sold = row.bill_to_customer;

        setSelectedRows((prevSelected) => {
            const isSelected = prevSelected.some((item) => item.id === row.id);

            if (isSelected) {
                const updatedSelection = prevSelected.filter((item) => item.id !== row.id);
                if (updatedSelection.length === 0) {
                    setSelectedShip(null);
                    setSelectedSold(null);
                }
                return updatedSelection;
            } else {
                if (
                    (!selectedShip && !selectedSold) ||
                    (selectedShip?.id === ship?.id && selectedSold?.id === sold?.id)
                ) {
                    setSelectedShip(ship);
                    setSelectedSold(sold);
                    return [...prevSelected, row];
                }
                return prevSelected;
            }
        });
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

    const approvalStatus = async (type, lineArray, approval_status, updatedby, reason) => {
        setShowModal(false);
        const approvalStatusData = await updateApprovalStatus(type, lineArray, approval_status, updatedby, reason);
        setToast(true);

        if (approvalStatusData?.success) {
            setToastMessage(approvalStatusData?.message);
            setSelectedRows([]);
            setSelectedShip(null);
            setSelectedSold(null);
            dispatch({
                type: GET_SALES_ORDER_REQUEST,
                payload: [],
            })
        }
        else
            setToastMessage("Status Not Update");
        setTimeout(() => {
            setToast(false);
        }, 2000)
    };

    const handleApproveClick = () => {
        setShowModal(true);
        setBulk(true)
    }

    const validateForm = () => {
        const errors = {};
        if (!formData.sales_order_line_item_no)
            errors.sales_order_line_item_no = "Sales Order Line Item Number is required";

        if (!formData.uom_id)
            errors.uom_id = "UOM is required";

        if (!formData.warehouse_id)
            errors.warehouse_id = "Warehouse is required";

        if (!formData.location_id)
            errors.location_id = "Location is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async e => {
        setIsSubmitted(true);
        e.preventDefault();
        if (!validateForm())
            return;
        setModal(false);
        const updateLineItemData = await updateLineItemApiCall(formData, "sales_order");
        setToast(true);
        setToastMessage(updateLineItemData?.message);
        setSelectedRows([]);
        setSelectedShip(null);
        setSelectedSold(null);
        dispatch({
            type: GET_SALES_ORDER_REQUEST,
            payload: []
        });
        setTimeout(() => {
            setToast(false);
        }, 2000);
    }

    const toggleTab = tab => {
        setSelectedShip(null);
        setSelectedSold(null);
        if (tab == 1) {
            setBulk(true)
        } else {
            setBulk(false)
        }
        setActiveTab(tab);
        setSelectedRows([]);
    };

    const toggleModal = () => setIsModelOpen(!isModalOpen);

    const getTableData = () => {
        if (activeTab === 1) {
            return salesOrders?.openSalesOrderList?.length > 0 ? salesOrders.openSalesOrderList : [];
        }
        if (activeTab === 2) {
            return salesOrders?.approvedSalesOrderList?.length > 0 ? salesOrders?.approvedSalesOrderList : [];
        }
        if (activeTab === 3) {
            return salesOrders?.rejectedSalesOrderList?.length > 0 ? salesOrders.rejectedSalesOrderList : [];
        }
        if (activeTab === 4) {
            return salesOrders?.closeSalesOrderList?.length > 0 ? salesOrders.closeSalesOrderList : [];
        }
        return [];
    };

    const handleDateChange = useCallback((selectedDates) => {
        const selectedDate = selectedDates[0];
        const formattedDate = moment(selectedDate).format("DD/MM/YYYY");

        if (formattedDate !== formData.delivery_date) {
            setFormData((prevData) => ({
                ...prevData,
                delivery_date: formattedDate
            }));
        }
        // }, [formData.delivery_date, validateDeliveryDate]);
    }, [formData.delivery_date]);

    const dropDownList = async () => {
        const selectProduct = await getSelectData("product_code", "", "product_master");
        setOptionProduct(selectProduct?.getDataByColNameData);

        const selectUOM = await getSelectData("uom_description", "", "unit_of_measure");
        setOptionProductUom(selectUOM?.getDataByColNameData);

        const selectPlantData = await getSelectData("plant_code", "", "warehouse_master");
        setOptionProductPlant(selectPlantData?.getDataByColNameData);

        const selectLocationData = await getSelectData("code", "", "location_code");
        setOptionProductLocation(selectLocationData?.getDataByColNameData);
    }

    const handleInputProduct = useCallback(
        debounce(async inputValue => {
            try {
                const selectProduct = await getSelectData("product_code", inputValue, "product_master");
                setOptionProduct(selectProduct?.getDataByColNameData);
            }
            catch (error) {
                console.error("Error in fetching data : ", error);
            }
        }, 300), []
    );

    const openModal = (data = null) => {
        setEditData(data);
        setSelectedProduct(data?.product_code_value);
        setSelectProductUom(data?.uom);
        setSelectProductPlant(data?.warehouse_id);
        setSelectProductLocation(data?.location_code);
        setFormData({
            id: data?.id,
            sales_order_line_item_no: data?.sales_order_line_item_no,
            product_description: data?.product_description,
            // customer_prod_description: data?.customer_prod_description,
            so_quantity: data?.so_quantity,
            product_code: data?.product_code_value?.value,
            uom_id: data?.uom?.value,
            warehouse_id: data?.warehouse_id?.value,
            location_id: data?.location_code?.value,
            delivery_date: data?.delivery_date ? moment(data?.delivery_date).format("DD/MM/YYYY") : ""
        });
        setModal(true);
    }

    const onClickDelete = item => {
        setRowData(item);
        setDeleteModal(true);
    }

    const onClickApproveStatus = item => {
        setRowData(item);
        setShowModal(true);
    }

    const handleDelete = async () => {
        try {
            setDeleteModal(false);
            const deleteLineItemData = await deleteLineItemApiCall(rowData?.id, "sales_order");
            setToast(true);
            setToastMessage(deleteLineItemData?.message);
            setSelectedRows([]);
            setSelectedShip(null);
            setSelectedSold(null);
            dispatch({
                type: GET_SALES_ORDER_REQUEST,
                payload: [],
            });
            setTimeout(() => {
                setToast(false);
            }, 2000);
        }
        catch (error) {
            console.error("Error deleting data:", error);
        }
    }

    const columns = useMemo(
        () => [
            {
                Header: "Sales Order Number",
                accessor: "so_number",
                Cell: ({ row }) => (
                    <div className="d-flex align-items-center">
                        {(activeTab === 1 || (activeTab === 2 && salesOrderPermission?.can_add)) && (
                            <Input
                                type="checkbox"
                                style={{ cursor: "pointer" }}
                                checked={selectedRows.includes(row.original)}
                                onChange={() => handleCheckboxChange(row.original)}
                            />
                        )}
                        <span
                            role="button"
                            style={{ textDecoration: "underline", cursor: "pointer", color: "inherit" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "blue")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                            className={(activeTab === 1 || activeTab === 2) ? "ms-3" : ""}
                            onClick={() => {
                                history.push("/Invoice/sales",   
                                //   { row: row.original, type: "PO"}
                                );
                              }}
                        >
                            {row.original.so_number}
                        </span>
                    </div>

                ),
            },
            // {
            //     Header: "Inquiry Number",
            //     accessor: "inquiry_number.label"
            // },
            // {
            //     Header: "Quotation Number",
            //     accessor: "quotation_number.label"
            // },
            {
                Header: "Line Item No.",
                accessor: "sales_order_line_item_no",
                Cell: ({ row }) => (
                    <div className="text-center">
                        <span>{row.original.sales_order_line_item_no}</span>
                    </div>
                ),
            },
            {
                Header: "Ship To Customer",
                accessor: "ship_to_customer.label"
            },
            {
                Header: "Bill To Customer",
                accessor: "bill_to_customer.label"
            },
            // {
            //     Header: "Sold To Customer",
            //     accessor: "sold_to_customer.label"
            // },
            {
                Header: "Payer Customer",
                accessor: "payer_customer.label"
            },
            {
                Header: "Product Name",
                accessor: "product_description",
            },
            // {
            //     Header: "Cust Product Desc",
            //     accessor: "customer_prod_description",
            // },
            {
                Header: "Quantity",
                accessor: "so_quantity",
            },
            {
                Header: "Taxes",
                accessor: "so_tax_amount",
            },
            {
                Header: "Discount",
                accessor: "so_discount",
            },
            {
                Header: "Unit Price",
                accessor: "so_unit_price",
            },
            // {
            //     Header: "Total Net Value",
            //     accessor: "so_net_total",
            // },
            {
                Header: "Sales Doc Date",
                accessor: "so_doc_date",
                Cell: ({ value }) => {
                    const formattedDate = moment(value).format("DD/MM/YYYY");
                    return <div>{formattedDate}</div>;
                },
            },
            // {
            //     Header: "Delivery Date",
            //     accessor: "delivery_date",
            //     Cell: ({ value }) => {
            //         const formattedDate = moment(value).format("DD/MM/YYYY");
            //         return <div>{formattedDate}</div>;
            //     },
            // },
            {
                Header: "Created At",
                accessor: "createdon",
                Cell: ({ value }) => {
                    const formattedDate = moment(value).format("DD/MM/YYYY");
                    return <div>{formattedDate}</div>;
                },
            },
            ...(activeTab === 2 || activeTab === 3 ? [
                {
                    Header: "Reason",
                    accessor: "reason",
                    Cell: ({ row }) => {
                        const reason = row.original.reason || "No Reason";
                        const words = reason.split(" ");
                        const shouldTruncate = words?.length > 5;

                        return (
                            <div>
                                {
                                    shouldTruncate ? (
                                        <>
                                            {words.splice(0, 5).join(" ")}...
                                            <a href="#" onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedReason(reason);
                                                toggleModal();
                                            }}>Read More</a>
                                        </>
                                    ) : (reason)
                                }
                            </div>
                        )
                    }
                }
            ] : []),
            {
                Header:
                    salesOrderPermission &&
                        (activeTab >= 1 && activeTab <= 3) &&
                        (salesOrderPermission.can_edit || salesOrderPermission.can_delete)
                        ? "Actions"
                        : "",
                accessor: "action",
                disableFilters: true,
                Cell: cellProps => {
                    return (
                        <div className="d-flex gap-3">
                            {salesOrderPermission && salesOrderPermission?.can_edit && activeTab === 1 ? (
                                <Link to="#" className="text-success" onClick={() => openModal(cellProps.row.original)} >
                                    <i className="mdi mdi-pencil-box font-size-18" id="edittooltip" />
                                    <UncontrolledTooltip placement="top" target="edittooltip">Edit</UncontrolledTooltip>
                                </Link>
                            ) : null}

                            {salesOrderPermission && salesOrderPermission?.can_delete && activeTab === 1 ? (
                                <Link to="#" className="text-danger" onClick={() => onClickDelete(cellProps.row.original)} >
                                    <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                                    <UncontrolledTooltip placement="top" target="deletetooltip">Delete</UncontrolledTooltip>
                                </Link>
                            ) : null}

                            {(salesOrderPermission && salesOrderPermission?.can_approved) && activeTab != 4 && (
                                <Link to="#" className="text-success" onClick={() => onClickApproveStatus(cellProps.row.original)} >
                                    <i className="mdi mdi-sticker-check-outline font-size-18" id="approvetooltip" />
                                    <UncontrolledTooltip placement="top" target="approvetooltip">Approve/Reject</UncontrolledTooltip>
                                </Link>
                            )}
                        </div>
                    )
                }
            }
        ],
        [activeTab, selectedRows, salesOrderPermission]
    );
    document.title = "Detergent | Sales Order"
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    {
                        toast && (
                            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: "1005" }}>
                                <Alert color="success" role="alert">
                                    {toastMessage}
                                </Alert>
                            </div>
                        )
                    }

                    <Modal isOpen={isModalOpen} toggle={toggleModal}>
                        <ModalHeader toggle={toggleModal}>Full Reason</ModalHeader>
                        <ModalBody>{selectedReason}</ModalBody>
                    </Modal>

                    <Modal isOpen={showModal} toggle={() => setShowModal(false)} centered={true}>
                        <ModalHeader toggle={() => setShowModal(false)} />
                        <ModalBody className="py-3 px-5">

                            <Row>
                                <Col>
                                    <div className="text-center">
                                        <i className="mdi mdi-information-outline" style={{ fontSize: "9em", color: "orange" }} />
                                        <h2>Do you want to Approve or Reject?</h2>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="text-center mt-3">
                                        <textarea className="form-control" placeholder="Please provide a reason" rows={3} value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="text-center mt-3">
                                        {(activeTab === 1 || activeTab === 3) && (
                                            <Button type="button" className="btn-custom-theme btn-lg me-2"
                                                onClick={() => approvalStatus("sales_order", bulk === true ? selectedRows :
                                                    [{ id: rowData?.id }], 1, 1, reason)}>
                                                Approve
                                            </Button>
                                        )}
                                        {(activeTab === 1 || activeTab === 2) && (
                                            <Button type="button" className="btn btn-danger btn-lg me-2"
                                                onClick={() => approvalStatus("sales_order", bulk === true ? selectedRows :
                                                    [{ id: rowData?.id }], 2, 1, reason)}>
                                                Reject
                                            </Button>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </ModalBody>
                    </Modal>

                    <Modal isOpen={modal} centered>
                        <ModalHeader>Edit Sales Order Line Item</ModalHeader>
                        <button type="button" onClick={() => { setModal(false); }} className="close" data-dismiss="modal" aria-label="close">
                            <span aria-hidden='true'>&times;</span>
                        </button>
                        <ModalBody>
                            <div className="modal-body">
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={12} className="mb-3">
                                            <RequiredLabel htmlFor="formrow-state-Input" label="Line Item Number" />
                                            <Input type="Number" name="sales_order_line_item_no" id="formrow-state-Input"
                                                value={formData?.sales_order_line_item_no}
                                                className={`form-control ${formErrors.sales_order_line_item_no ? "is-invalid" : ""}`}
                                                style={{
                                                    borderColor: formErrors.sales_order_line_item_no ? 'red' : '#ced4da',
                                                }}
                                                placeholder="Please Enter Line Item Number"
                                                onChange={e => {
                                                    setFormData(prevData => ({
                                                        ...prevData,
                                                        sales_order_line_item_no: e.target.value
                                                    }));
                                                    setFormErrors(prevErrors => ({
                                                        ...prevErrors,
                                                        sales_order_line_item_no: ""
                                                    }));
                                                }}
                                            />
                                        </Col>

                                        {/* Product Code */}
                                        {/* <Col md={6} className="mb-3">
                                            <div className="">
                                                <RequiredLabel htmlFor="formrow-state-Input" label="Product Code"  />
                                                <Select value={selectProduct} options={optionProduct}
                                                    styles={{
                                                        control: (provided) => ({
                                                            ...provided,
                                                            borderColor: formErrors.product_code ? 'red' : provided.borderColor, // Add red border if validation error exists
                                                        }),
                                                    }}
                                                    onChange={async selectProduct => {
                                                        setFormData(prevData => ({
                                                            ...prevData,
                                                            product_code: selectProduct?.value
                                                        }));
                                                        setSelectedProduct(selectProduct);
                                                    }}
                                                    onInputChange={(inputValue, { action }) => {
                                                        handleInputProduct(inputValue)
                                                    }}
                                                />
                                            </div>
                                        </Col> */}

                                        {/* Product Description */}
                                        {/* <Col md={12} className="mb-3">
                                            <RequiredLabel htmlFor="formrow-state-Input" label="Product Description"  />
                                            <Input type="textarea" name="product_description" id="formrow-state-Input"
                                                placeholder="Please Enter Product Description"
                                                value={formData?.product_description}
                                                className={`form-control ${formErrors.quantity ? "is-invalid" : ""}`}
                                                style={{
                                                    borderColor: formErrors.product_description ? 'red' : '#ced4da', // Set border color based on error
                                                }}
                                                onChange={e => {
                                                    setFormData(prevData => ({
                                                        ...prevData,
                                                        product_description: e.target.value
                                                    }));
                                                    setFormErrors(prevErrors => ({
                                                        ...prevErrors,
                                                        product_description: ""
                                                    }));
                                                }}
                                            />
                                        </Col> */}

                                        {/* Customer Product Description */}
                                        {/* <Col md={12} className="mb-3">
                                            <RequiredLabel htmlFor="formrow-state-Input" label="Customer Product Description"  />
                                            <Input type="textarea" name="customer_prod_description" id="formrow-state-Input"
                                                placeholder="Please Enter Customer Product Description"
                                                value={formData?.customer_prod_description}
                                                className={`form-control ${formErrors.product_description ? "is-invalid" : ""}`}
                                                style={{
                                                    borderColor: formErrors.product_description ? 'red' : '#ced4da', // Set border color based on error
                                                }}
                                                onChange={e => {
                                                    setFormData(prevData => ({
                                                        ...prevData,
                                                        customer_prod_description: e.target.value
                                                    }));
                                                    setFormErrors(prevErrors => ({
                                                        ...prevErrors,
                                                        customer_prod_description: ""
                                                    }));
                                                }} />
                                        </Col> */}

                                        <Col md={12} className="mb-3">
                                            <div className="">
                                                <RequiredLabel htmlFor="formrow-state-Input" label="UOM" />
                                                <Select value={selectProductUom} options={optionProductUom}
                                                    styles={{
                                                        control: (provided) => ({
                                                            ...provided,
                                                            borderColor: formErrors.uom_id ? 'red' : provided.borderColor,
                                                        }),
                                                    }}
                                                    onChange={async selectProductUom => {
                                                        setFormData(prevData => ({
                                                            ...prevData,
                                                            uom_id: selectProductUom?.value,
                                                        }));
                                                        setSelectProductUom(selectProductUom);
                                                    }}
                                                />
                                                {formErrors.uom_id && (
                                                    <div style={{ color: "#f46a6a", fontSize: "80%" }}>{formErrors.uom_id}</div>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md={12} className="mb-3">
                                            <div className="">
                                                <RequiredLabel htmlFor="formrow-state-Input" label="Warehouse" />
                                                <Select value={selectProductPlant} options={optionProductPlant}
                                                    styles={{
                                                        control: (provided) => ({
                                                            ...provided,
                                                            borderColor: formErrors.warehouse_id ? 'red' : provided.borderColor,
                                                        }),
                                                    }}
                                                    onChange={async selectProductPlant => {
                                                        setFormData(prevData => ({
                                                            ...prevData,
                                                            warehouse_id: selectProductPlant?.value
                                                        }));
                                                        setSelectProductPlant(selectProductPlant);
                                                    }} />
                                                {formErrors.warehouse_id && (
                                                    <div style={{ color: "#f46a6a", fontSize: "80%" }}>{formErrors.warehouse_id}</div>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md={12} className="mb-3">
                                            <div className="">
                                                <RequiredLabel htmlFor="formrow-state-Input" label="Location" />
                                                <Select value={selectProductLocation} options={optionProductLocation}
                                                    styles={{
                                                        control: (provided) => ({
                                                            ...provided,
                                                            borderColor: formErrors.location_id ? 'red' : provided.borderColor,
                                                        }),
                                                    }}
                                                    onChange={async selectProductLocation => {
                                                        setFormData(prevData => ({
                                                            ...prevData,
                                                            location_id: selectProductLocation?.value
                                                        }));
                                                        setSelectProductLocation(selectProductLocation);
                                                    }}
                                                />
                                                {formErrors.location_id && (
                                                    <div style={{ color: "#f46a6a", fontSize: "80%" }}>{formErrors.location_id}</div>
                                                )}
                                            </div>
                                        </Col>

                                        {/* Quantity */}
                                        {/* <Col md={6} className="mb-3">
                                            <div className="mb-3">
                                                <RequiredLabel htmlFor="formrow-state-Input" label="Quantity"  />
                                                <Input type="Number" name="so_quantity" id="formrow-state-Input" placeholder="Please Enter Quantity" value={formData?.so_quantity}
                                                    className={`form-control ${formErrors.so_quantity ? "is-invalid" : ""}`}
                                                    style={{
                                                        borderColor: formErrors.so_quantity ? 'red' : '#ced4da', // Set border color based on error
                                                    }}
                                                    onChange={e => {
                                                        setFormData(prevData => ({
                                                            ...prevData,
                                                            so_quantity: e.target.value
                                                        }));
                                                        setFormErrors(prevErrors => ({
                                                            ...prevErrors,
                                                            so_quantity: "",
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </Col> */}

                                        {/* Delivery Date */}
                                        {/* <Col md={6} className="mb-3">
                                            <div className="form-floating mb-3">
                                                <Flatpickr
                                                    ref={flatpickrRef}
                                                    options={{ altInput: true, altFormat: "j F, Y", dateFormat: "Y-m-d", clickOpens: false }}
                                                    onChange={handleDateChange}
                                                    value={formData.delivery_date ? moment(formData.delivery_date, "DD/MM/YYYY").toDate() : null}
                                                    onReady={(selectedDates, dateStr, instance) => {
                                                        if (instance.altInput) {
                                                            Object.assign(instance.altInput.style, {
                                                                borderColor: formErrors.delivery_date ? 'red' : '#ced4da', // Border updates based on validation error
                                                            });
                                                        }
                                                    }}
                                                    onOpen={(selectedDates, dateStr, instance) => {
                                                        if (instance.altInput) {
                                                            instance.altInput.style.borderColor = !formData.delivery_date ? 'red' : '#ced4da'; // Ensure border updates when date picker opens
                                                        }
                                                    }}
                                                />
                                                <RequiredLabel htmlFor="delivery_date" label="Delivery Date"  />
                                                {formErrors.delivery_date && (
                                                    <div style={{ color: "#f46a6a", fontSize: "80%" }}>{formErrors.delivery_date}</div>
                                                )}
                                            </div>
                                        </Col> */}
                                    </Row>

                                    <div className="mt-3">
                                        <Button type="submit" className="btn-custom-theme">Save</Button>
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
                    <Breadcrumbs titlePath="#" title="SO" breadcrumbItem="Sales Order" />
                    <Card>
                        <Row>
                            <Col lg="12">
                                <div className="custom-tabs-wrapper">
                                    <ul className="custom-tab-nav">
                                        {[
                                            { id: 1, label: "Open SO" },
                                            { id: 2, label: "Approved SO" },
                                            { id: 3, label: "Rejected SO" },
                                            { id: 4, label: "Closed SO" },
                                        ].map((tab, index) => (
                                            <li key={tab.id} className="custom-tab-item">
                                                <button
                                                    className={`custom-tab-link ${activeTab === tab.id ? "active" : ""
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
                            setLoading={loading}
                            columns={columns}
                            data={getTableData()}
                            isGlobalFilter={true}
                            isAddOptions={true}
                            handleSalesOrderClick={handleSalesOrderClick}
                            showSalesOrderButton={true}
                            handleDeliveryOrderClick={handleDeliveryOrderClick}
                            handleApproveClick={handleApproveClick}
                            customPageSize={10}
                            className="custom-header-css"
                            buttonSizes={selectedRows.length > 0 && activeTab === 1 ? { salesOrder: "5", addButtonLabel: "4" } : { addButtonLabel: "8" }}
                            selectedRows={selectedRows}
                            handleCheckboxChange={(row) => {
                                if (
                                    activeTab === 1 ||
                                    (activeTab === 2 && salesOrderPermission?.can_add)
                                ) {
                                    handleCheckboxChange(row);
                                }
                            }}
                            showApproveButton={
                                salesOrderPermission && salesOrderPermission?.can_approved && selectedRows.length > 0 && activeTab === 1
                            }
                        />
                    )}
                </div>
            </div>
        </React.Fragment>
    )
}

export default SalesOrderMaster