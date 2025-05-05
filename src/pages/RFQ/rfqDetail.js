import React, { useEffect, useState } from "react";
import {
  Card,
  Label,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Alert,
  UncontrolledTooltip,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useLocation } from "react-router-dom";
import AdvaitLogo from "../../assets/images/Advaitlogo.png";
import "../../assets/scss/custom/pages/__rfqdetail.scss"; // Import custom CSS
import { getRfqDetail,rfqSendMail } from "helpers/Api/api_rfq";
import { productTechParameterByID } from "helpers/Api/api_products";
import moment from "moment";
import html2pdf from "html2pdf.js";
import Loader from "../../components/Common/Loader";
import "../../assets/scss/custom/pages/__loader.scss";

const RfqDetail = () => {
  const [rfqData, setRfqData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [tableDataLists, setTableDataLists] = useState({});
  const location = useLocation();
  const { rfq_id } = location.state || {};

  const getUserData = () => {
    if (localStorage?.getItem("authUser")) {
      const obj = JSON?.parse(localStorage?.getItem("authUser"));
      return obj;
    }
  };

  const fetchProductTechParameter = async parameter_sets => {
    const response = await productTechParameterByID(parameter_sets);
    return response?.productTechParameterByID;
  };

  const fetchRfqDetail = async rfq_id => {
    try {
      const response = await getRfqDetail(rfq_id);
      setRfqData(response);
      const tableDataPromises = response.lineitem_list.map(async item => {
        const Techids = Object.values(item.technical_set_value).flatMap(
          val => val.id
        );
        const TableDataList = await fetchProductTechParameter(
          Techids.join(",")
        );
        return { id: item.rfq_line_item_no, data: TableDataList };
      });


      const resolvedTableDataLists = await Promise.all(tableDataPromises);
      const tableDataMap = resolvedTableDataLists.reduce(
        (acc, { id, data }) => {
          acc[id] = data;
          return acc;
        },
        {}
      );

      setTableDataLists(tableDataMap);
    } catch (error) {
      setRfqData([]);
      console.error("Error fetching RFQ details:", error);
    }
  };

  useEffect(() => {
    const userData = getUserData();
    if (location.state && location.state?.rfq_id) {
      fetchRfqDetail(rfq_id);
    }
  }, [location.state]);

  const printInvoice = () => {
    window.print();
  };
  const pdfInvoice = () => {
    const element = document.getElementById("printableArea");
    const currentDate = moment().format("YYYY_MM_DD");
    const currentTime = moment().format("X");
    const rfqNo = rfqData?.rfq_no || "N/A";
    const filename = `RFQ_${rfqNo}_${currentDate}_${currentTime}.pdf`;

    const opt = {
      margin: 0.5,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  const emailPdf = () => {
    const element = document.getElementById("printableArea");
    const currentDate = moment().format("YYYY_MM_DD");
    const currentTime = moment().format("X");
    const rfqNo = rfqData?.rfq_no || "N/A";
    const filename = `RFQ_${rfqNo}_${currentDate}_${currentTime}.pdf`;
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

  return (
    <React.Fragment>
      <div className="page-content">
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
        <Container fluid>
          <Breadcrumbs
            titlePath="/rfq"
            title="RFQ"
            breadcrumbItem="RFQ Detail"
          />
          {loading ? (
            <Loader />
          ) : (
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div id="printableArea">
                      <div className="watermark">Draft</div>
                      <div className="invoice-title">
                        <h4 className="float-end font-size-16">
                          RFQ No: {rfqData?.rfq_no || "N/A"}
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "1rem",
                          }}
                        >
                          <img src={AdvaitLogo} alt="logo" height="20" />
                          <span
                            style={{
                              fontSize: "1rem",
                              fontWeight: "bold",
                              color: "#333",
                              marginLeft: "0.5rem",
                            }}
                          >
                            Advait
                          </span>
                        </div>
                      </div>
                      <hr />
                      <Row>
                        <Col sm="6">
                          <address>
                            <strong>RFQ Doc Type :</strong>{" "}
                            {rfqData?.rfq_doc_type_description || "N/A"}
                            <br />
                          </address>
                        </Col>
                        <Col sm="6" className="text-sm-end">
                          <address>
                            <strong>Created By :</strong> Detergent
                            <br />
                          </address>
                        </Col>
                        <Col sm="6">
                          <address>
                            <strong>RFQ Date :</strong>{" "}
                            {moment(rfqData?.rfq_date).format("DD/MM/YYYY")}
                            <br />
                          </address>
                        </Col>
                        <Col sm="6" className="text-sm-end">
                          <address>
                            <strong>Created Date : </strong>{" "}
                            {moment(rfqData?.createdon).format("DD/MM/YYYY")}
                            <br />
                          </address>
                        </Col>
                        <Col sm="6">
                          <address>
                            <strong>Issued On Date :</strong>
                            <br />
                          </address>
                        </Col>
                      </Row>
                      <div className="py-2 mt-3">
                        <h3 className="font-size-15 font-weight-bold">
                          Line Items
                        </h3>
                      </div>
                      <div className="table-responsive">
                        <Table className="table-nowrap">
                          <thead>
                            <tr>
                              <th style={{ width: "70px" }}>No.</th>
                              <th>PR Line No.</th>
                              <th>RFQ Line No.</th>
                              <th>PR Qty.</th>
                              <th>RFQ Qty.</th>
                              <th>Prod Code</th>
                              <th>Product Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rfqData?.lineitem_list?.map((item, index) => {
                              const TableDataList =
                                tableDataLists[item.rfq_line_item_no] || [];
                              return (
                                <React.Fragment key={index}>
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.pr_line_item_no}</td>
                                    <td>{item.rfq_line_item_no}</td>
                                    <td>{item.pr_quantity}</td>
                                    <td>{item.rfq_quantity}</td>
                                    <td>{item.product_code}</td>
                                    <td>{item.product?.label}</td>
                                  </tr>
                                  <tr>
                                    <td colSpan="7">
                                      <div className="table-responsive">
                                        <Table>
                                          <thead>
                                            <tr>
                                              <th>Tech Parameter</th>
                                              <th>Value</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {TableDataList?.map(
                                              (items, subIndex) => {
                                                const itemType = items.types[0];
                                                const itemLabel =
                                                  items?.labels[0];
                                                const labelId = `${itemType}-${subIndex}`;
                                                let value = "";
                                                switch (itemType) {
                                                  case "datebox":
                                                  case "textfield":
                                                  case "textarea":
                                                  case "dateTime":
                                                  case "timebox":
                                                  case "urlbox":
                                                  case "emailbox":
                                                  case "colorbox":
                                                  case "numberbox":
                                                    value =
                                                      item?.technical_set_value[
                                                        labelId
                                                      ]?.label || "N/A";
                                                    break;
                                                  case "dropdown":
                                                    value =
                                                      item?.technical_set_value[
                                                        labelId
                                                      ]?.dropdown?.label ||
                                                      "N/A";
                                                    break;
                                                  case "multipleselect":
                                                    value =
                                                      item?.technical_set_value[
                                                        labelId
                                                      ]?.multipleselect == ""
                                                        ? []
                                                        : item?.technical_set_value[
                                                            labelId
                                                          ]?.multipleselect
                                                            ?.map(v => v.label)
                                                            .join(", ") ||
                                                          "N/A";
                                                    break;
                                                  default:
                                                    value = "N/A";
                                                    break;
                                                }

                                                return (
                                                  <tr key={subIndex}>
                                                    <td>
                                                      <Label htmlFor={labelId}>
                                                        {itemLabel}
                                                      </Label>
                                                    </td>
                                                    <td>{value}</td>
                                                  </tr>
                                                );
                                              }
                                            )}
                                          </tbody>
                                        </Table>
                                      </div>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                      <Row>
                        <Col sm="6">
                          <address>
                            <strong>Vendors :</strong>{" "}
                            {rfqData?.vendor_list
                              ?.map(vendor => vendor.label)
                              .join(", ")}
                            <br />
                          </address>
                        </Col>
                        <Col sm="6" className="text-sm-end">
                          <address>
                            <strong>RFQ Approver :</strong>{" "}
                            {rfqData?.approvedname || "N/A"}
                            <br />
                          </address>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                  <CardBody>
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

export default RfqDetail;
