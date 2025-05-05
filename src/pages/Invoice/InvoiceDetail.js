import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Table, UncontrolledTooltip } from "reactstrap";
import { map } from "lodash";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import logo from "../../assets/images/Advaitlogo.png";
import { rfqSendMail } from "helpers/Api/api_rfq";
import moment from "moment";
import html2pdf from "html2pdf.js";

const InvoiceDetail = () => {
  const { state } = useLocation();
  const { invoiceData } = state || {};
  const history = useHistory();
  const printInvoice = () => {
    window.print();
  };
  const pdfInvoice = () => {
    const element = document.getElementById("printableArea");
    const currentDate = moment().format("YYYY_MM_DD");
    const currentTime = moment().format("X");
    const filename = `${invoiceData?.invoice_no}_${currentDate}_${currentTime}.pdf`;

    const opt = {
      margin: 0.5,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };

    html2pdf().from(element).set(opt).save();
  };

  const emailPdf = () => {
    const element = document.getElementById("printableArea");
    const currentDate = moment().format("YYYY_MM_DD");
    const currentTime = moment().format("X");
    const filename = `${invoiceData?.invoice_no}_${currentTime}.pdf`;
    html2pdf()
      .from(element)
      .toPdf()
      .get("pdf")
      .then(async (pdf) => {
        const pdfBlob = pdf.output("blob");
        try {
          setLoading(true);
          const response = await rfqSendMail(pdfBlob, filename);
          if (response?.success) {
            setLoading(false)
            setToast(true)
            setToastMessage(response?.message);
          } else {
            setToastMessage("Failed to send email.");
          }
        } catch (error) {
          setToastMessage("Email sending failed.");
        }

        setTimeout(() => {
          setToast(false);
        }, 2000);
      })
      .catch((error) => {
        setToastMessage("PDF generation failed.");
      });
  };
  // Meta title
  document.title = "Detergent | Invoice Details";
  if (!invoiceData) {
    history.push("/list_invoices");
    return <div className="text-center">No Invoice Data Available</div>;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs titlePath="/list_invoices" title="Invoices" breadcrumbItem="Invoice Detail" />

          <Row>
            <Col lg="12">
              <Card>
                <div id="printableArea">
                  <CardBody >
                    {/* Invoice Header */}
                    <div className="invoice-title d-flex justify-content-between align-items-center">
                      <h4 className="font-size-18">Invoice # {invoiceData?.invoice_no}</h4>
                      <div>
                        <img src={logo} alt="logo" height="20" />
                      </div>
                    </div>
                    <hr />

                    {/* Billing & Shipping Details */}
                    <Row>
                      <Col sm="6">
                        <h6 className="mb-3">Billed To:</h6>
                        <address>
                          {map(invoiceData.billing_address, (line, index) => (
                            <div key={index}>{line}</div>
                          ))}
                        </address>
                      </Col>
                      <Col sm="6" className="text-sm-end">
                        <h6 className="mb-3">Shipped To:</h6>
                        <address>
                          {map(invoiceData.billing_address, (line, index) => (
                            <div key={index}>{line}</div>
                          ))}
                        </address>
                      </Col>
                    </Row>

                    {/* Invoice Items */}
                    <Row>
                      <Col sm="6" className="mt-3">
                        <h6>Invoice Date:</h6>
                        <p>{moment(invoiceData.invoice_date).format("DD/MM/YYYY")}</p>
                      </Col>
                    </Row>

                    {/* Table Section */}
                    <div className="py-3 mt-4">
                      <h5 className="font-size-16 font-weight-bold">Invoice Items</h5>
                      <div className="table-responsive">
                        <Table bordered className="table-nowrap">
                          <thead className="table-light">
                            <tr>
                              <th>GRN Line</th>
                              {/* <th>PO Line</th> */}
                              <th>Name</th>
                              <th>HSN/SAC</th>
                              <th>UOM</th>
                              {/* <th>Warehouse</th>
                            <th>Location</th> */}
                              <th>Order Qty.</th>
                              {/* <th>IR Qty.</th> */}
                              <th>Qty.</th>
                              <th>Net Price</th>
                              {/* <th>Tax %</th> */}
                              <th>Tax Amount</th>
                              <th>Net Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {map(invoiceData?.invoiced_details, (item, key) => (
                              <tr key={key}>
                                <td>{item.grn_line_item}</td>
                                {/* <td>{item.po_line_item}</td> */}
                                <td>{item.product_description}</td>
                                <td>{item.hsn?.label}</td>
                                <td>{item.uom?.label}</td>
                                {/* <td>{item.warehouse?.label}</td>
                              <td>{item.storage_location?.label}</td> */}
                                <td>{item.order_qty}</td>
                                {/* <td>{item.ir_quantity}</td> */}
                                <td>{item.quantity}</td>
                                <td>{item.net_price}</td>
                                {/* <td>{item.tax_per}</td> */}
                                <td>{item.tax_amount}</td>
                                <td>{item.net_value}</td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan="7" className="text-end"></td>
                              <td style={{ fontWeight: "bold" }}> Total Tax : {invoiceData?.total_tax_amount}</td>
                              <td style={{ fontWeight: "bold" }}> Total Amount : {invoiceData?.total_amount}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </CardBody>
                </div>
                {/* Buttons */}
                <div className="d-print-none mt-4">
                  <div className="d-print-none d-flex justify-content-center mt-3">
                    <div className="float-end">
                      {/* <Link
                          to="#"
                          onClick={printInvoice}
                          className="btn-custom-theme me-1"
                          id="printtooltip"
                        >
                          <i className="fa fa-print" />
                          <UncontrolledTooltip
                            placement="top"
                            target="printtooltip"
                          >
                            Print
                          </UncontrolledTooltip>
                        </Link> */}
                      <Link
                        to="#"
                        onClick={pdfInvoice}
                        className="btn btn-custom-theme me-1"
                        id="pdfttooltip"
                      >
                        <i className="fas fa-file-pdf" />
                        <UncontrolledTooltip
                          placement="top"
                          target="pdfttooltip"
                        >
                          PDF
                        </UncontrolledTooltip>
                      </Link>{" "}
                      <Link
                        to="#"
                        onClick={emailPdf}
                        className="btn btn-custom-theme me-1"
                        id="emailtooltip"
                      >
                        <i className="mdi mdi-email-check" />
                        <UncontrolledTooltip
                          placement="top"
                          target="emailtooltip"
                        >
                          Email
                        </UncontrolledTooltip>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default InvoiceDetail;
