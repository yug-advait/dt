import React, { useState, useEffect } from 'react';
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Table,
    UncontrolledTooltip,
    Badge,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Spinner,
    Modal,
    ModalHeader,
    ModalFooter,
    ModalBody
} from "reactstrap";
import Typography from '@mui/material/Typography';
// import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Breadcrumbs from "./Breadcrumb";
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { getInvoiceModal, getInvoiceNo } from 'helpers/Api/api_invoiceModal';

const InvoiceModal = () => {
    const location = useLocation();
    const { type, row } = location.state || {};
    console.log("🚀 ~ InvoiceModal ~ type:", type)
    console.log("🚀 ~ InvoiceModal ~ row:", row)
    const history = useHistory();

    // State for API data and loading status
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    console.log("🚀 ~ InvoiceModal ~ invoiceData:", invoiceData)
    const [billToModal, setBillToModal] = useState(false);
    const toggleBillToModal = () => setBillToModal(!billToModal);
    const [invoiceNo, setInvoiceNo] = useState("");
    const [gstRate, setGstRate] = useState(0); // Add state for GST rate


    // Form state
    const [formValues, setFormValues] = useState({
        purchaseNo: "",
        invoiceNo: "",
        supplierNo: "",
        dispatchDocNo: "",
        vehicleNo: "",
        deliveryTerms: "",
        dispatchThrough: "",
        termsPayment: "",
        partyAccName: "",
        partyAccBalance: 0,
        purchaseLedger: "",
        customerAccBalance: 0,
        date: new Date().toISOString().split('T')[0], // Default to today's date
        items: [],
        total: 0,
        gstDetails: ""
    });

    // Extract data passed from the table component
    useEffect(() => {
        // Check if we have data in the location state
        if (location.state && location.state.row) {
            const rowData = location.state.row;
            const invoiceType = location.state.type || "PO"; // Default to PO if not specified

            console.log("Received data:", rowData);
            console.log("Invoice type:", invoiceType);

            // Fetch invoice details from API using the ID from row data
            fetchInvoiceDetails(invoiceType, rowData.po_id);
        }
    }, [location]);

    // Update form data when API response is received
    useEffect(() => {
        if (invoiceData) {
            populateFormData(invoiceData);
        }
    }, [invoiceData]);

    useEffect(() => {
        const fetchInvoice = async () => {
            const data = await getInvoiceNo();
            console.log("🚀 ~ fetchInvoice ~ data:", data)
            if (data) {
                setInvoiceNo(data);
            }

        };

        fetchInvoice();
    }, []);

    const fetchInvoiceDetails = async (invoiceType, id) => {
        if (!id) {
            setApiError("No invoice ID provided");
            return;
        }

        setIsLoading(true);
        setApiError(null);

        try {
            // Use the imported API function instead of direct fetch
            const data = await getInvoiceModal(invoiceType, id);


            if (!data || !Array.isArray(data) || data.length === 0) {
                throw new Error("Failed to fetch invoice data or empty response");
            }

            // Set the first item in the array as our invoice data
            setInvoiceData(data[0]);
            setGstRate(data[0].gst_rate || 0);
            console.log("🚀 ~ fetchInvoiceDetails ~ data:", data)
            console.log("🚀 ~ fetchInvoiceDetails ~ data?.gst_rate:", data?.gst_rate)
            console.log("Line Items:", data?.[0]?.line_item);


        } catch (error) {
            console.error("Error fetching invoice details:", error);
            setApiError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to populate form data from API response
    const populateFormData = (data) => {
        // Convert line items to the format expected by the form
        const items = data.line_item.map(item => ({
            id: item.id,
            name: item.product_description,
            quantity: item.po_quantity,
            hsn_code: item.hsn_code,
            unit: item.unit,
            ratePerKg: item.net_price,
            gst_rate: item.gst_rate,
            amount: (item.po_quantity * item.net_price)
        }));

        // Calculate total from items
        const total = items.reduce((sum, item) => sum + item.amount, 0);

        // Update form values
        setFormValues({
            ...formValues,
            purchaseNo: data.po_no,
            partyAccName: data.bill_to?.label || "",
            purchaseLedger: data.bill_to?.label || "",
            items: items,
            total: total,
            gstDetails: data.bill_to?.gstin || ""
        });
    };

    // Function to update item field values and recalculate amount
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formValues.items];
        updatedItems[index][field] = value;

        // If quantity or rate changes, recalculate the amount
        if (field === 'quantity' || field === 'ratePerKg') {
            console.log("🚀 ~ handleItemChange ~ updatedItems:", updatedItems)
            updatedItems[index].amount =
                updatedItems[index].quantity * updatedItems[index].ratePerKg;
        }
                console.log("🚀 ~ handleItemChange ~ updatedItems[index].ratePerKg:", updatedItems[index].ratePerKg)
                console.log("🚀 ~ handleItemChange ~ updatedItems[index].quantity:", updatedItems[index].quantity)

        // Recalculate total
        const newTotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);

        setFormValues({
            ...formValues,
            items: updatedItems,
            total: newTotal
        });
    };

    const invoiceTypeDisplay = type === "PO" ? "Purchase" : "Sales";
    document.title = `Detergent | ${invoiceTypeDisplay} Invoice`;

    // Handle cancel button
    const handleCancel = () => {
        history.goBack();
    };

    // Handle save actions
    const handleSave = (finalize = false) => {
        // Here you would implement the API call to save the invoice
        console.log("Saving invoice with data:", formValues);
        console.log("Finalized:", finalize);

        // Show a success message (replace with actual API call)
        alert(`Invoice ${finalize ? 'finalized' : 'saved as draft'}`);
    };

    // const gstData = [
    //     {
    //         hsn: "28151110",
    //         taxableValue: 12500,
    //         cgstRate: 9,
    //         cgstAmount: 1125,
    //         sgstRate: 9,
    //         sgstAmount: 1125,
    //         taxTotal: 2250,
    //     },
    //     {
    //         hsn: "28362020",
    //         taxableValue: 7000,
    //         cgstRate: 9,
    //         cgstAmount: 630,
    //         sgstRate: 9,
    //         sgstAmount: 630,
    //         taxTotal: 1260,
    //     },
    //     {
    //         hsn: "33029011",
    //         taxableValue: 39600,
    //         cgstRate: 9,
    //         cgstAmount: 3564,
    //         sgstRate: 9,
    //         sgstAmount: 3564,
    //         taxTotal: 7128,
    //     },
    //     {
    //         hsn: "34023100",
    //         taxableValue: 9460,
    //         cgstRate: 9,
    //         cgstAmount: 851.4,
    //         sgstRate: 9,
    //         sgstAmount: 851.4,
    //         taxTotal: 1702.8,
    //     },
    //     {
    //         hsn: "34021190",
    //         taxableValue: 26840,
    //         cgstRate: 9,
    //         cgstAmount: 2415.6,
    //         sgstRate: 9,
    //         sgstAmount: 2415.6,
    //         taxTotal: 4831.2,
    //     },
    //     {
    //         hsn: "28391900",
    //         taxableValue: 8127,
    //         cgstRate: 9,
    //         cgstAmount: 731.43,
    //         sgstRate: 9,
    //         sgstAmount: 731.43,
    //         taxTotal: 1462.86,
    //     },
    // ];

    const gstData = invoiceData?.line_item.map((item) => {
        const gstRate = parseFloat(item.gst_rate || 0);
        const taxableValue = parseFloat(item.net_value || 0);
        const halfRate = gstRate / 2;

        const cgstAmount = taxableValue * (halfRate / 100);
        const sgstAmount = taxableValue * (halfRate / 100);
        const totalTax = cgstAmount + sgstAmount;

        return {
            hsn: item.hsn_code || '—',
            taxableValue,
            cgstRate: halfRate,
            cgstAmount,
            sgstRate: halfRate,
            sgstAmount,
            taxTotal: totalTax
        };
    });
    console.log("🚀 ~ gstData ~ gstData:", gstData)

    // For totals
    const totalTaxable = gstData?.reduce((sum, row) => sum + row.taxableValue, 0);
    const totalCgst = gstData?.reduce((sum, row) => sum + row.cgstAmount, 0);
    const totalSgst = gstData?.reduce((sum, row) => sum + row.sgstAmount, 0);
    const totalTax = totalCgst + totalSgst;



    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs
                        title={invoiceTypeDisplay}
                        breadcrumbItem={`${invoiceTypeDisplay} #${formValues.purchaseNo}`}
                    />

                    <Modal isOpen={billToModal} toggle={toggleBillToModal} size="lg">
                        <ModalHeader toggle={toggleBillToModal}>
                            <i className="fas fa-building me-2"></i>
                            Bill-to Details
                        </ModalHeader>
                        <ModalBody>
                            {!invoiceData || !invoiceData.bill_to ? (
                                <div className="text-center text-muted py-4">
                                    <i className="fas fa-info-circle fa-2x mb-3"></i>
                                    <p>No billing details available.</p>
                                </div>
                            ) : (
                                <Form>
                                    <Card>
                                        <CardBody>
                                            <Row>
                                                <Col md={6}>
                                                    <h6 className="mb-3 text-primary">Company Information</h6>
                                                    <FormGroup row>
                                                        <Label sm={4}>Company Name:</Label>
                                                        <Col sm={8}>
                                                            <Input
                                                                type="text"
                                                                bsSize="sm"
                                                                value={invoiceData.bill_to.label || ''}
                                                                onChange={(e) => {
                                                                    const updatedInvoiceData = { ...invoiceData };
                                                                    updatedInvoiceData.bill_to = {
                                                                        ...updatedInvoiceData.bill_to,
                                                                        label: e.target.value
                                                                    };
                                                                    setInvoiceData(updatedInvoiceData);

                                                                    // Update form value for party name as well
                                                                    setFormValues({
                                                                        ...formValues,
                                                                        partyAccName: e.target.value
                                                                    });
                                                                }}
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Label sm={4}>Vendor Code:</Label>
                                                        <Col sm={8}>
                                                            <Input
                                                                type="text"
                                                                bsSize="sm"
                                                                value={invoiceData.bill_to.vendor_code || ''}
                                                                onChange={(e) => {
                                                                    const updatedInvoiceData = { ...invoiceData };
                                                                    updatedInvoiceData.bill_to = {
                                                                        ...updatedInvoiceData.bill_to,
                                                                        vendor_code: e.target.value
                                                                    };
                                                                    setInvoiceData(updatedInvoiceData);

                                                                    // Update supplier number in form as well
                                                                    setFormValues({
                                                                        ...formValues,
                                                                        supplierNo: e.target.value
                                                                    });
                                                                }}
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Label sm={4}>GSTIN:</Label>
                                                        <Col sm={8}>
                                                            <Input
                                                                type="text"
                                                                bsSize="sm"
                                                                value={invoiceData.bill_to.gstin || ''}
                                                                onChange={(e) => {
                                                                    const updatedInvoiceData = { ...invoiceData };
                                                                    updatedInvoiceData.bill_to = {
                                                                        ...updatedInvoiceData.bill_to,
                                                                        gstin: e.target.value
                                                                    };
                                                                    setInvoiceData(updatedInvoiceData);

                                                                    // Update GST details in form as well
                                                                    setFormValues({
                                                                        ...formValues,
                                                                        gstDetails: e.target.value
                                                                    });
                                                                }}
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Label sm={4}>PAN:</Label>
                                                        <Col sm={8}>
                                                            <Input
                                                                type="text"
                                                                bsSize="sm"
                                                                value={invoiceData.bill_to.pan || ''}
                                                                onChange={(e) => {
                                                                    const updatedInvoiceData = { ...invoiceData };
                                                                    updatedInvoiceData.bill_to = {
                                                                        ...updatedInvoiceData.bill_to,
                                                                        pan: e.target.value
                                                                    };
                                                                    setInvoiceData(updatedInvoiceData);
                                                                }}
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <h6 className="mb-3 text-primary">Contact Information</h6>
                                                    <FormGroup row>
                                                        <Label sm={4}>Email:</Label>
                                                        <Col sm={8}>
                                                            <Input
                                                                type="email"
                                                                bsSize="sm"
                                                                value={invoiceData.bill_to.email || ''}
                                                                onChange={(e) => {
                                                                    const updatedInvoiceData = { ...invoiceData };
                                                                    updatedInvoiceData.bill_to = {
                                                                        ...updatedInvoiceData.bill_to,
                                                                        email: e.target.value
                                                                    };
                                                                    setInvoiceData(updatedInvoiceData);
                                                                }}
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Label sm={4}>Mobile:</Label>
                                                        <Col sm={8}>
                                                            <Input
                                                                type="tel"
                                                                bsSize="sm"
                                                                value={invoiceData.bill_to.mobile || ''}
                                                                onChange={(e) => {
                                                                    const updatedInvoiceData = { ...invoiceData };
                                                                    updatedInvoiceData.bill_to = {
                                                                        ...updatedInvoiceData.bill_to,
                                                                        mobile: e.target.value
                                                                    };
                                                                    setInvoiceData(updatedInvoiceData);
                                                                }}
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <hr className="my-3" />

                                            <Row>
                                                <Col md={12}>
                                                    <h6 className="mb-3 text-primary">Address</h6>
                                                    <FormGroup row>
                                                        <Label sm={3}>Billing Address:</Label>
                                                        <Col sm={9}>
                                                            <Input
                                                                type="textarea"
                                                                bsSize="sm"
                                                                value={invoiceData.bill_to.address || ''}
                                                                rows={3}
                                                                onChange={(e) => {
                                                                    const updatedInvoiceData = { ...invoiceData };
                                                                    updatedInvoiceData.bill_to = {
                                                                        ...updatedInvoiceData.bill_to,
                                                                        address: e.target.value
                                                                    };
                                                                    setInvoiceData(updatedInvoiceData);
                                                                }}
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                    <Row>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <Label>City</Label>
                                                                <Input
                                                                    type="text"
                                                                    bsSize="sm"
                                                                    value={invoiceData.bill_to.city || ''}
                                                                    onChange={(e) => {
                                                                        const updatedInvoiceData = { ...invoiceData };
                                                                        updatedInvoiceData.bill_to = {
                                                                            ...updatedInvoiceData.bill_to,
                                                                            city: e.target.value
                                                                        };
                                                                        setInvoiceData(updatedInvoiceData);
                                                                    }}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <Label>State</Label>
                                                                <Input
                                                                    type="text"
                                                                    bsSize="sm"
                                                                    value={invoiceData.bill_to.state || ''}
                                                                    onChange={(e) => {
                                                                        const updatedInvoiceData = { ...invoiceData };
                                                                        updatedInvoiceData.bill_to = {
                                                                            ...updatedInvoiceData.bill_to,
                                                                            state: e.target.value
                                                                        };
                                                                        setInvoiceData(updatedInvoiceData);
                                                                    }}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <Label>Pincode</Label>
                                                                <Input
                                                                    type="text"
                                                                    bsSize="sm"
                                                                    value={invoiceData.bill_to.pincode || ''}
                                                                    onChange={(e) => {
                                                                        const updatedInvoiceData = { ...invoiceData };
                                                                        updatedInvoiceData.bill_to = {
                                                                            ...updatedInvoiceData.bill_to,
                                                                            pincode: e.target.value
                                                                        };
                                                                        setInvoiceData(updatedInvoiceData);
                                                                    }}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <FormGroup row>
                                                        <Label sm={3}>Shipping Address:</Label>
                                                        <Col sm={9}>
                                                            <Input
                                                                type="textarea"
                                                                bsSize="sm"
                                                                value={invoiceData.ship_to.address || ''}
                                                                rows={3}
                                                                onChange={(e) => {
                                                                    const updatedInvoiceData = { ...invoiceData };
                                                                    updatedInvoiceData.bill_to = {
                                                                        ...updatedInvoiceData.bill_to,
                                                                        address: e.target.value
                                                                    };
                                                                    setInvoiceData(updatedInvoiceData);
                                                                }}
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <FormGroup row className="mt-3">
                                                <Label sm={2}>Notes:</Label>
                                                <Col sm={10}>
                                                    <Input
                                                        type="textarea"
                                                        bsSize="sm"
                                                        value={invoiceData.bill_to.note || ''}
                                                        rows={3}
                                                        onChange={(e) => {
                                                            const updatedInvoiceData = { ...invoiceData };
                                                            updatedInvoiceData.bill_to = {
                                                                ...updatedInvoiceData.bill_to,
                                                                note: e.target.value
                                                            };
                                                            setInvoiceData(updatedInvoiceData);
                                                        }}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </CardBody>
                                    </Card>
                                </Form>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={toggleBillToModal}>
                                <i className="fas fa-save me-1"></i> Save Changes
                            </Button>
                            <Button color="secondary" onClick={toggleBillToModal}>
                                Close
                            </Button>
                        </ModalFooter>
                    </Modal>

                    {isLoading ? (
                        <div className="text-center my-5">
                            <Spinner color="primary" />
                            <p className="mt-2">Loading invoice details...</p>
                        </div>
                    ) : apiError ? (
                        <div className="alert alert-danger">
                            Error loading invoice: {apiError}
                        </div>
                    ) : (
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        {/* Purchase Info Header Section */}
                                        <h5 className="text-secondary">{invoiceTypeDisplay} Information</h5>
                                        <Row className="mb-4">
                                            <Col sm={6}>
                                                <div className="mb-3">
                                                    <Row className="">
                                                        <Col sm={5}>
                                                            <p className="font-weight-bold mb-0">Invoice No:</p>
                                                        </Col>
                                                        <Col sm={7}>
                                                            <p className="form-control-plaintext mb-0">{invoiceNo}</p>
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2">
                                                        <Col sm={5}>
                                                            <p className="font-weight-bold mb-0">Supplier No:</p>
                                                        </Col>
                                                        <Col sm={7}>
                                                            <Input
                                                                type="number"
                                                                bsSize="sm"
                                                                value={formValues.supplierNo}
                                                                onChange={(e) => setFormValues({ ...formValues, supplierNo: e.target.value })}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2">
                                                        <Col sm={5}>
                                                            <p className="font-weight-bold mb-0">Party Acc Name:</p>
                                                        </Col>
                                                        <Col sm={7}>
                                                            <div className="d-flex">
                                                                <Col sm={7}>
                                                                    <p className="form-control-plaintext mb-0">{formValues.partyAccName}</p>
                                                                </Col>
                                                                <Button
                                                                    color="light"
                                                                    size="sm"
                                                                    id="view-bill-to-details"
                                                                    onClick={toggleBillToModal}
                                                                    title="View Bill-to Details"
                                                                >
                                                                    <i className="fas fa-eye"></i>
                                                                </Button>
                                                                <UncontrolledTooltip placement="top" target="view-bill-to-details">
                                                                    View Bill-to Details
                                                                </UncontrolledTooltip>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2">
                                                        <Col sm={5}>
                                                            <p className="font-weight-bold mb-0">Current Balance (Party):</p>
                                                        </Col>
                                                        <Col sm={7}>
                                                            <Input
                                                                type="number"
                                                                bsSize="sm"
                                                                value={formValues.partyAccBalance}
                                                                step="0.01"
                                                                onChange={(e) => setFormValues({ ...formValues, partyAccBalance: parseFloat(e.target.value) || 0 })}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2">
                                                        <Col sm={5}>
                                                            <p className="font-weight-bold mb-0">{invoiceTypeDisplay} Ledger Name:</p>
                                                        </Col>
                                                        <Col sm={7}>
                                                            <div className="d-flex">
                                                                <Col sm={7}>
                                                                    <p className="form-control-plaintext mb-0">{formValues.purchaseLedger}</p>
                                                                </Col>
                                                                <Button
                                                                    color="light"
                                                                    size="sm"
                                                                    id="view-bill-to-details"
                                                                    onClick={toggleBillToModal}
                                                                    title="View Bill-to Details"
                                                                >
                                                                    <i className="fas fa-eye"></i>
                                                                </Button>
                                                                <UncontrolledTooltip placement="top" target="view-bill-to-details">
                                                                    View Bill-to Details
                                                                </UncontrolledTooltip>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2">
                                                        <Col sm={5}>
                                                            <p className="font-weight-bold mb-0">Current Balance (Vendor):</p>
                                                        </Col>
                                                        <Col sm={7}>
                                                            <Input
                                                                type="number"
                                                                bsSize="sm"
                                                                value={formValues.customerAccBalance}
                                                                step="0.01"
                                                                onChange={(e) => setFormValues({ ...formValues, customerAccBalance: parseFloat(e.target.value) || 0 })}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                            <Col sm={6} className="">
                                                <div className="mb-3">
                                                    <Row className="mb-2 justify-content-end">
                                                        <Col sm={5} className="text-end">
                                                            <p className="font-weight-bold mb-0">Date:</p>
                                                        </Col>
                                                        <Col sm={7}>
                                                            <Input
                                                                type="date"
                                                                bsSize="sm"
                                                                value={formValues.date}
                                                                onChange={(e) => setFormValues({ ...formValues, date: e.target.value })}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2 justify-content-end">
                                                        <Col sm={5} className="text-end">
                                                            <p className="font-weight-bold mb-0">Terms of Payment:</p>
                                                        </Col>
                                                        <Col sm={7}>
                                                            <Input
                                                                type="text"
                                                                bsSize="sm"
                                                                value={formValues.termsPayment}
                                                                onChange={(e) => setFormValues({ ...formValues, termsPayment: e.target.value })}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2 justify-content-end">
                                                        <Col sm={5} className="text-end">
                                                            <p className="font-weight-bold mb-0">Dispatch Doc No:</p>
                                                        </Col>
                                                        <Col sm={7}>
                                                            <Input
                                                                type="text"
                                                                bsSize="sm"
                                                                value={formValues.dispatchDocNo}
                                                                onChange={(e) => setFormValues({ ...formValues, dispatchDocNo: e.target.value })}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2 justify-content-end">
                                                        <Col sm={5} className="text-end">
                                                            <p className="font-weight-bold mb-0">Dispatch Through:</p>
                                                        </Col>
                                                        <Col sm={7}>
                                                            <Input
                                                                type="text"
                                                                bsSize="sm"
                                                                value={formValues.dispatchThrough}
                                                                onChange={(e) => setFormValues({ ...formValues, dispatchThrough: e.target.value })}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2 justify-content-end">
                                                        <Col sm={5} className="text-end">
                                                            <p className="font-weight-bold mb-0">Vehicle No:</p>
                                                        </Col>
                                                        <Col sm={7}>
                                                            <Input
                                                                type="text"
                                                                bsSize="sm"
                                                                value={formValues.vehicleNo}
                                                                onChange={(e) => setFormValues({ ...formValues, vehicleNo: e.target.value })}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2 justify-content-end">
                                                        <Col sm={5} className="text-end">
                                                            <p className="font-weight-bold mb-0">Terms of Delivery:</p>
                                                        </Col>
                                                        <Col sm={7}>
                                                            <Input
                                                                type="textarea"
                                                                bsSize="sm"
                                                                value={formValues.deliveryTerms}
                                                                onChange={(e) => setFormValues({ ...formValues, deliveryTerms: e.target.value })}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>

                                        <hr className="my-4" />

                                        {/* Line Items Section */}
                                        <h5 className="text-secondary">Line Items</h5>
                                        <div className="mb-4">
                                            <Row className="mb-2 fw-bold align-items-center">
                                                <Col sm={6}>
                                                    <Label className="mb-0">Name of Items</Label>
                                                </Col>
                                                <Col sm={6}>
                                                    <Row>
                                                        <Col sm={2}>
                                                            <Label className="mb-0">HSN/SAC</Label>
                                                        </Col>
                                                        <Col sm={2}>
                                                            <Label className="mb-0">Quntity</Label>
                                                        </Col>
                                                        <Col sm={2}>
                                                            <Label className="mb-0">Rate</Label>
                                                        </Col>
                                                        <Col sm={2}>
                                                            <Label className="mb-0">Unit</Label>
                                                        </Col>
                                                        <Col sm={2}>
                                                            <Label className="mb-0">Amount</Label>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>

                                            {formValues.items.map((item, index) => (
                                                <Card key={item.id} className="mb-3">
                                                    <CardBody>
                                                        <Row className="align-items-center">
                                                            <Col sm={6}>
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <span className="me-2">{index + 1}.</span>
                                                                    <Input
                                                                        type="text"
                                                                        bsSize="sm"
                                                                        value={item.name}
                                                                        onChange={(e) =>
                                                                            handleItemChange(index, 'name', e.target.value)
                                                                        }
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col sm={6}>
                                                                <Row>
                                                                    <Col sm={2}>
                                                                        <p className="form-control-plaintext mb-0">{item.hsn_code}</p>
                                                                    </Col>
                                                                    <Col sm={2}>
                                                                        <Input
                                                                            type="number"
                                                                            bsSize="sm"
                                                                            value={item.quantity}
                                                                            min="0"
                                                                            onChange={(e) =>
                                                                                handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)
                                                                            }
                                                                        />
                                                                    </Col>
                                                                    <Col sm={2}>
                                                                        <Input
                                                                            type="number"
                                                                            bsSize="sm"
                                                                            value={item.ratePerKg}
                                                                            step="0.01"
                                                                            min="0"
                                                                            onChange={(e) =>
                                                                                handleItemChange(index, 'ratePerKg', parseFloat(e.target.value) || 0)
                                                                            }
                                                                        />
                                                                    </Col>
                                                                    <Col sm={2}>
                                                                        <p className="form-control-plaintext mb-0">{item.unit}</p>
                                                                    </Col>
                                                                    <Col sm={2}>
                                                                        {item.amount.toFixed(2)}
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            ))}

                                            <Row className="mt-3 fw-bold">
                                                <Col sm={6} className="text-end">
                                                    Totals:
                                                </Col>
                                                <Col sm={6}>
                                                    <Row>
                                                        <Col sm={2}>
                                                        </Col>
                                                        <Col sm={2}>
                                                            {formValues.items.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                                                        </Col>
                                                        <Col sm={2}>
                                                        </Col>
                                                        <Col sm={2}>
                                                        </Col>
                                                        <Col sm={2}>
                                                            {formValues.total.toFixed(2)}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>

                                            <div className="mt-4 text-sm font-bold">
                                                Amount Chargeable (In Words): <span className="italic font-bold">
                                                    Eighteen Thousand Six Hundred Thirty Four and Eighty Six Paise Only
                                                </span>
                                            </div>

                                            <hr className="my-4" />

                                        </div>

                                        {/* <div className="p-0 w-screen">
                                            <h4 className="text-xl font-bold mb-4">Invoice Tax Summary</h4>
                                            <table className="w-full border border-gray-300 text-sm text-center"
                                                style={{ width: '100%' }}>
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="border p-2" rowSpan="2">HSN/SAC</th>
                                                        <th className="border p-2" rowSpan="2">Taxable Value (₹)</th>
                                                        <th className="border p-2" colSpan="2">CGST</th>
                                                        <th className="border p-2" colSpan="2">SGST/UTGST</th>
                                                        <th className="border p-2" rowSpan="2">Total Tax Amount (₹)</th>
                                                    </tr>
                                                    <tr>
                                                        <th className="border p-2">Rate</th>
                                                        <th className="border p-2">Amount (₹)</th>
                                                        <th className="border p-2">Rate</th>
                                                        <th className="border p-2">Amount (₹)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {gstData.map((row, i) => (
                                                        <tr key={i}>
                                                            <td className="border p-2">{row.hsn}</td>
                                                            <td className="border p-2">{row.taxableValue.toFixed(2)}</td>
                                                            <td className="border p-2">{row.cgstRate}%</td>
                                                            <td className="border p-2">{row.cgstAmount.toFixed(2)}</td>
                                                            <td className="border p-2">{row.sgstRate}%</td>
                                                            <td className="border p-2">{row.sgstAmount.toFixed(2)}</td>
                                                            <td className="border p-2">{row.taxTotal.toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                    <tr className="font-semibold bg-gray-50">
                                                        <td className="border p-2">Total</td>
                                                        <td className="border p-2">{totalTaxable.toFixed(2)}</td>
                                                        <td className="border p-2">–</td>
                                                        <td className="border p-2">{totalCgst.toFixed(2)}</td>
                                                        <td className="border p-2">–</td>
                                                        <td className="border p-2">{totalSgst.toFixed(2)}</td>
                                                        <td className="border p-2">{totalTax.toFixed(2)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div> */}
                                        {gstData && (
                                            <>
                                                <Typography variant="h6" className="mt-8 mb-2">GST Calculation</Typography>

                                                <Table className="rounded-md border">
                                                    <TableHead className="bg-gray-100">
                                                        <TableRow>
                                                            <TableCell className="border-r text-xs">HSN Code</TableCell>
                                                            <TableCell className="border-r text-xs">Taxable Value</TableCell>
                                                            <TableCell className="border-r text-xs">CGST Rate (%)</TableCell>
                                                            <TableCell className="border-r text-xs">CGST Amount</TableCell>
                                                            <TableCell className="border-r text-xs">SGST Rate (%)</TableCell>
                                                            <TableCell className="border-r text-xs">SGST Amount</TableCell>
                                                            <TableCell className="text-xs">Total Tax Amount</TableCell>
                                                        </TableRow>
                                                    </TableHead>

                                                    <TableBody>
                                                        {invoiceData.line_item.map((item, index) => {
                                                            const gstRate = parseFloat(item.gst_rate || 0);
                                                            const halfRate = gstRate / 2;
                                                            const taxableValue = parseFloat(item.net_value || 0);

                                                            const cgstAmount = +(taxableValue * (halfRate / 100)).toFixed(2);
                                                            const sgstAmount = +(taxableValue * (halfRate / 100)).toFixed(2);
                                                            const totalTaxAmount = +(cgstAmount + sgstAmount).toFixed(2);

                                                            return (
                                                                <TableRow key={index}>
                                                                    <TableCell className="border-r text-xs">{item.hsn_code || "—"}</TableCell>
                                                                    <TableCell className="border-r text-xs">{taxableValue.toFixed(2)}</TableCell>
                                                                    <TableCell className="border-r text-xs">{halfRate.toFixed(2)}</TableCell>
                                                                    <TableCell className="border-r text-xs">{cgstAmount.toFixed(2)}</TableCell>
                                                                    <TableCell className="border-r text-xs">{halfRate.toFixed(2)}</TableCell>
                                                                    <TableCell className="border-r text-xs">{sgstAmount.toFixed(2)}</TableCell>
                                                                    <TableCell className="text-xs">{totalTaxAmount.toFixed(2)}</TableCell>
                                                                </TableRow>
                                                            );
                                                        })}

                                                        {/* Totals Row */}
                                                        <TableRow className="bg-gray-50 font-semibold">
                                                            <TableCell className="text-xs">Total</TableCell>
                                                            <TableCell className="text-xs">
                                                                {invoiceData?.line_item
                                                                    .reduce((sum, item) => sum + parseFloat(item.net_value || 0), 0)
                                                                    .toFixed(2)}
                                                            </TableCell>
                                                            <TableCell colSpan={2} className="text-xs">
                                                                CGST:{" "}
                                                                {invoiceData?.line_item
                                                                    .reduce((sum, item) => sum + (parseFloat(item.net_value || 0) * (parseFloat(item.gst_rate || 0) / 2 / 100)), 0)
                                                                    .toFixed(2)}
                                                            </TableCell>
                                                            <TableCell colSpan={2} className="text-xs">
                                                                SGST:{" "}
                                                                {invoiceData?.line_item
                                                                    .reduce((sum, item) => sum + (parseFloat(item.net_value || 0) * (parseFloat(item.gst_rate || 0) / 2 / 100)), 0)
                                                                    .toFixed(2)}
                                                            </TableCell>
                                                            <TableCell className="text-xs">
                                                                {(invoiceData?.line_item
                                                                    .reduce((sum, item) => {
                                                                        const rate = parseFloat(item.gst_rate || 0) / 2;
                                                                        const val = parseFloat(item.net_value || 0);
                                                                        return sum + (val * (rate / 100)) * 2;
                                                                    }, 0))?.toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </>
                                        )}

                                        <div className="mt-4 text-sm font-bold">
                                            Tax Amount (In Words): <span className="italic font-bold">
                                                Eighteen Thousand Six Hundred Thirty Four and Eighty Six Paise Only
                                            </span>
                                        </div>
                                        {/* Invoice Actions */}
                                        <Row className="mt-4">
                                            <Col sm={12} className="text-end">
                                                <Button color="secondary" className="me-2" onClick={handleCancel}>
                                                    <i className="fas fa-times"></i> Cancel
                                                </Button>
                                                <Button color="primary" className="me-2" onClick={() => handleSave(false)}>
                                                    <i className="fas fa-save"></i> Save as Draft
                                                </Button>
                                                <Button color="success" onClick={() => handleSave(true)}>
                                                    <i className="fas fa-check"></i> Save and Finalize
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default InvoiceModal;