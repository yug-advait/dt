import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  UncontrolledTooltip,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Input,
  Table,
  Label,
  FormGroup,
} from "reactstrap";
import { useHistory, Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import { productTechParameterByID } from "helpers/Api/api_products";
import { GET_GOODRECEIPT_REQUEST } from "../../../store/goodReceipt/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
const QualityCheckList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    goodreceipt,
  } = useSelector(state => state.goodreceipt);
  const [invoicePermission, setInvoicePermission] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedGrn, setSelectedGrn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [isTechParaModalOpen, setIsTechParaModalOpen] = useState(false);
  const [selectedTechPara, setSelectedTechPara] = useState({});
  const [tableDataLists, setTableDataLists] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dispatch({
      type: GET_GOODRECEIPT_REQUEST,
      payload: [],
    });
    setLoading(false);
  }, []);

  const fetchProductTechParameter = async parameter_sets => {
    const response = await productTechParameterByID(parameter_sets);
    return response?.productTechParameterByID;
  };
  const toggleTechParaModal = async techParaData => {
    const TableDataList = await fetchProductTechParameter(techParaData?.tech_ids.join(","));
    setTableDataLists(TableDataList);
    setSelectedTechPara(techParaData?.technical_set_value);
    setIsTechParaModalOpen(!isTechParaModalOpen);
  };
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

  const handleShowModal = data => {
    setShowModal(true);
    setBatches(data?.batch_numbers);
  };

  const handleCheckboxChange = row => {
    setSelectedVendor(null);
    setSelectedGrn(null);
    const vendor = row.vendor_code;
    const poNo = row.po_number;

    setSelectedRows(prevSelected => {
      if (prevSelected.includes(row)) {
        if (prevSelected.length === 1) {
          setSelectedVendor(null);
        }
        return prevSelected.filter(item => item !== row);
      } else {
        if ((!selectedVendor || selectedVendor?.label === vendor?.label) &&
          ((!selectedGrn || selectedGrn === poNo))) {
          setSelectedVendor(vendor);
          setSelectedGrn(poNo);
          return [...prevSelected, row];
        }
        return prevSelected;
      }
    });
  };

  const handleInvoice = () => {
    history.push({
      pathname: "/create_invoice",
      state: {
        LineItem: selectedRows,
      },
    });
  };
  const getTableData = () => {
    return goodreceipt?.qualityCheck?.length > 0
      ? goodreceipt.qualityCheck
      : [];
  };

  const columns = useMemo(
    () => [
      {
        Header: "GRN Number",
        accessor: "grn_no",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <Input
              type="checkbox"
              style={{ cursor: "pointer" }}
              checked={selectedRows.includes(row.original)}
              onChange={() => handleCheckboxChange(row.original)}
            />
            <span className="ms-2">{row.original.grn_no}</span>
          </div>
        ),
      },
      {
        Header: "GRN Line Item No.",
        accessor: "del_line_item",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <span className="ms-4">{row.original.del_line_item}</span>
          </div>
        ),
      },
      {
        Header: "PO Number",
        accessor: "po_number",
      },

      {
        Header: "Vendor Desc",
        accessor: "vendor_prod_description",
      },
      {
        Header: "Vendor",
        accessor: "vendor_code.label",
      },
      {
        Header: "GRN Qty",
        accessor: "grn_quantity",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <span className="ms-3">{row.original.grn_quantity}</span>
          </div>
        ),
      },
      {
        Header: "Damaged Qty.",
        accessor: "damaged_quantity",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <span className="ms-3">
              {row.original.damage_quantity || "0"}
            </span>
          </div>
        ),
      },
      {
        Header: "Cancelled Qty.",
        accessor: "cancelled_quantity",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <span className="ms-3">
              {row.original.cancel_quantity || "0"}
            </span>
          </div>
        ),
      },
      {
        Header: "Product Description",
        accessor: "product_description",
      },
      {
        Header: "Tech. Para.",
        accessor: "tech_para",
        Cell: ({ row }) => (
          <div className="d-flex gap-3">
            <Link
              to="#"
              onClick={() => toggleTechParaModal(row.original)}
              className="text-success"
            >
              <i
                className="mdi mdi-eye font-size-18"
                id="techParaTooltip"
              />
              <UncontrolledTooltip
                placement="top"
                target="techParaTooltip"
              >
                View Tech Parameters
              </UncontrolledTooltip>
            </Link>
          </div>
        ),
      },
      {
        Header: "Vehicle No.",
        accessor: "vehical_no",
      },
      {
        Header: "Transporter Name",
        accessor: "transporter_name",
      },
      {
        Header: "Batch Number",
        accessor: "batch_count",
        Cell: cellProps => {
          const { batch_numbers } = cellProps.row.original;

          return (
            <div className="d-flex gap-3">
              {batch_numbers?.length}
              {batch_numbers?.length > 0 && (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => handleShowModal(cellProps.row.original)}
                >
                  <i className="mdi mdi-eye font-size-18" id="viewtooltip" />
                  <UncontrolledTooltip placement="top" target="viewtooltip">
                    View
                  </UncontrolledTooltip>
                </Link>
              )}
            </div>
          );
        },
      },
      {
        Header: "GRN Date",
        accessor: "grn_date",
        Cell: ({ value }) => {
          const formattedDate = moment(value).format("DD/MM/YYYY");
          return <div>{formattedDate}</div>;
        },
      },
      {
        Header: "Delivery Date",
        accessor: "delivery_gr_date",
        Cell: ({ value }) => {
          const formattedDate = moment(value).format("DD/MM/YYYY");
          return <div>{formattedDate}</div>;
        },
      }
    ],
    [selectedRows]
  );
  document.title = "Detergent | Quality Check";
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Modal isOpen={showModal} toggle={() => setShowModal(false)} centered>
            <ModalHeader toggle={() => setShowModal(false)}>
              Batch Information
            </ModalHeader>
            <ModalBody>
              {batches?.map((batch, index) => (
                <Row key={index}>
                  <Col md="3">
                    <FormGroup>
                      <Label for={`batch_number-${index}`}>
                        Internal Number
                      </Label>
                      <div>{batch.batch_number}</div>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label for={`external_batch_number-${index}`}>
                        External Number
                      </Label>
                      <div>{batch.external_batch_number}</div>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label for={`batch_qty-${index}`}>Quantity</Label>
                      <div>{batch.batch_qty}</div>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Serial No.</Label>
                      {batch?.serialNumbers
                        ?.split(",")
                        ?.map((serialNumber, serialIndex) => (
                          <div key={serialIndex}>{serialNumber}</div>
                        ))}
                    </FormGroup>
                  </Col>
                </Row>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={isTechParaModalOpen}
            toggle={() => setIsTechParaModalOpen(false)}
          >
            <ModalHeader toggle={() => setIsTechParaModalOpen(false)}>
              Technical Parameters
            </ModalHeader>
            <ModalBody>
              <React.Fragment>
                <div className="table-responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th>Tech Parameter</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableDataLists?.map((items, subIndex) => {
                        const itemType = items.types;
                        const itemLabel = items?.labels[0];
                        const labelId = `${itemType}-${subIndex}`;
                        let value = "";
                        switch (itemType[0]) {
                          case "datebox":
                          case "textfield":
                          case "textarea":
                          case "dateTime":
                          case "timebox":
                          case "urlbox":
                          case "emailbox":
                          case "colorbox":
                          case "numberbox":
                            value = selectedTechPara[labelId]?.label || "N/A";
                            break;
                          case "dropdown":
                            value =
                              selectedTechPara[labelId]?.dropdown?.label ||
                              "N/A";
                            break;
                          case "multipleselect":
                            value =
                              selectedTechPara[labelId]?.label
                                ?.multipleselect == ""
                                ? []
                                : selectedTechPara[labelId]?.multipleselect
                                  ?.map(v => v.label)
                                  .join(", ") || "N/A";
                            break;
                          default:
                            value = "N/A";
                            break;
                        } 

                        return (
                          <tr key={subIndex}>
                            <td>
                              <Label htmlFor={labelId}>{itemLabel}</Label>
                            </td>
                            <td>{value}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </React.Fragment>
            </ModalBody>
          </Modal>

          <Breadcrumbs
            titlePath="/grn/good_receipt"
            title="GRN"
            breadcrumbItem="Quality Check"
          />

          <TableContainer
            columns={columns}
            data={getTableData()}
            isLoading={loading}
            isGlobalFilter={false}
            isAddOptions={false}
            customPageSize={10}
            className="custom-header-css"
            addButtonLabel={"Create GRN"}
            handleInvoice={handleInvoice}
            showInvoice={true}
            selectedRows={selectedRows}
            handleCheckboxChange={handleCheckboxChange}
            buttonSizes={{
              GRN: 4,
              QC: selectedRows.length > 0 ? 6 : 0,
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default QualityCheckList;
