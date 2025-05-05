import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  UncontrolledTooltip,
  Card,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Input,
  Alert,
  Label,
  FormGroup,
} from "reactstrap";
import classnames from "classnames";
import { useHistory, Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../../src/components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import { updateApprovalStatus } from "helpers/Api/api_common";
import {
  GET_GATEENTRY_REQUEST,
} from "../../store/gateEntry/actionTypes";
import {
  updateLineItemApiCall,
} from "helpers/Api/api_common";
import { STATUS_REQUEST } from "../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
const GateEntry = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const {
    gateEntry,
    addGateEntry,
    updateGateEntry,
    deleteGateEntry,
    error,
  } = useSelector(state => state.gateEntry);
  const history = useHistory();
  const { updateCommon } = useSelector(state => state.commons);
  const location = useLocation();
  const { GateInbound } = location.state || {};
  const [toast, setToast] = useState(false);
  const [activeTab, setActiveTab] = useState(GateInbound == true || GateInbound == undefined ? 1 : 2);
  const [allData, setAllData] = useState([]);
  const [reason, setReason] = useState('')
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [approveModal, setApproveModal] = useState(false);
  const [bulk, setBulk] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    sequence_no: "",
    asn_line_item: "",
    asn_grn_quantity: ""
  });

  useEffect(() => {
    dispatch({
      type: GET_GATEENTRY_REQUEST,
      payload: [],
    });
    setLoading(false);
  }, [toastMessage,activeTab]);
  useEffect(() => {
    if (updateGateEntry) {
      setToastMessage("Gate Entry Updated Successfully");
      dispatch({
        type: GET_GATEENTRY_REQUEST,
      });
      setToast(true);
    }
    if (deleteGateEntry) {
      setToastMessage("Gate Entry Deleted Successfully");
      dispatch({
        type: GET_GATEENTRY_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Gate Entry Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_GATEENTRY_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    addGateEntry,
    updateGateEntry,
    updateCommon,
    deleteGateEntry,
    toast,
  ]);

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
    if (tab == 1) {
      setAllData(
        gateEntry?.openGrnList && gateEntry?.openGrnList.length > 0 ? gateEntry.openGrnList : []
      );
    } else if (tab == 2) {
      setAllData(
        gateEntry?.closeGateEntryList && gateEntry?.closeGateEntryList.length > 0
          ? gateEntry.closeGateEntryList
          : []
      );
    } else if (tab == 3) {
      setAllData(
        gateEntry?.gateInClosedList && gateEntry?.gateInClosedList.length > 0 ? gateEntry.gateInClosedList : []
      );
    }
    setSelectedRows([]);
  };

  const approvalStatus = async (type, lineArray, approval_status) => {
    setApproveModal(false);
    const approvalStatus = await updateApprovalStatus(
      type,
      lineArray,
      approval_status
    );
    setToast(true);
    if (approvalStatus?.success) {
      setToastMessage(approvalStatus?.message);
      dispatch({
        type: GET_GATEENTRY_REQUEST,
        payload: [],
      });
    } else {
      setToastMessage("Status Not Update");
    }
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };

  const handleCheckboxChange = row => {
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

  const handleGRNClick = () => {
    history.push({
      pathname: "/grn/good_receipt/create_good_receipt",
      // pathname: "/grn/quality_check",
      state: { LineItem: selectedRows },
    });
  };

  const handleShowModal = data => {
    setShowModal(true);
    setBatches(data?.batch_numbers);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setModal(false);
    const updateLineItemData = await updateLineItemApiCall(formData, "grn");
    setToast(true);
    setToastMessage(updateLineItemData?.message);
    dispatch({
      type: GET_GATEENTRY_REQUEST,
      payload: [],
    });
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.sequence_no) {
      errors.sequence_no = "Sequence Number is required.";
    }
    if (!formData.asn_line_item) {
      errors.asn_line_item = "Line Item is required.";
    }
    if (!formData.asn_grn_quantity) {
      errors.asn_grn_quantity = "asn_grn_quantity is required.";
    }
    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const columns = useMemo(
    () => [
      {
        Header: "Gate Pass No",
        accessor: "gate_pass_no",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            {(activeTab === 1) &&
              (
                <Input
                  type="checkbox"
                  style={{ cursor: "pointer" }}
                  checked={selectedRows.includes(row.original)}
                  onChange={() => handleCheckboxChange(row.original)}
                />
              )}
            <span
              className={"ms-3"}
            >
              {row.original.gate_pass_no}
            </span>
          </div>
        ),
      },
      ...(activeTab === 1 ? [{
        Header: "ASN No",
        accessor: "asn_no",
      }] : []),
      ...(activeTab === 2 ? [{
        Header: "GRN No",
        accessor: "grn_no",
      }] : []),
      {
        Header: "Vendor",
        accessor: "vendor_code.label",
      },
      {
        Header: activeTab === 1 ? "ASN Quantity" : "GRN Quantity",
        accessor: "asn_grn_quantity",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <span className="ms-5">
              {row.original.asn_grn_quantity}
            </span>
          </div>
        ),
      },
      {
        Header: "Gate Quantity",
        accessor: "gate_quantity",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <span className="ms-5">
              {row.original.gate_quantity}
            </span>
          </div>
        ),
      },
      {
        Header: "Gate Item Number",
        accessor: "gate_line_item",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <span className={(activeTab === 1) ? "ms-5" : ""}>
              {row.original.gate_line_item}
            </span>
          </div>
        ),
      },
      ...(activeTab === 1 ? [{
        Header: "ASN Line Item",
        accessor: "del_line_item",
      }] : []),
      ...(activeTab === 2 ? [{
        Header: "GRN Line Item",
        accessor: "grn_line_item",
      }] : []),
      {
        Header: "Product Description",
        accessor: "product_description",
      },
      ...(activeTab === 1 ? [{
        Header: "In Date",
        accessor: "in_date",
        Cell: ({ value }) => {
          const formattedDate = moment(value).format("DD/MM/YYYY");
          return <div>{formattedDate}</div>;
        },
      }] : []),
      ...(activeTab === 2 ? [{
        Header: "Out Date",
        accessor: "out_date",
        Cell: ({ value }) => {
          const formattedDate = moment(value).format("DD/MM/YYYY");
          return <div>{formattedDate}</div>;
        },
      }] : []),
      ...(activeTab === 1 ? [{
        Header: "Time In",
        accessor: "time_in",
      }] : []),
      ...(activeTab === 2 ? [{
        Header: "Time Out",
        accessor: "time_out",
      }] : []),
      {
        Header: "Gate No",
        accessor: "gate_no.label",
      },
      {
        Header: "Driver Name",
        accessor: "driver_name",
      },
      {
        Header: "Driver contact",
        accessor: "driver_contact",
      },
      {
        Header: "License NO",
        accessor: "license_no",
      },
      {
        Header: "Batch Number",
        accessor: "batch_count",
        Cell: cellProps => {
          const { batch_count, batch_numbers } = cellProps.row.original;

          return (
            <div className="d-flex gap-3">
              {batch_numbers.length}
              {batch_numbers.length > 0 && (
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
        Header: "Delivery Date",
        accessor: "delivery_gr_date",
        Cell: ({ value }) => {
          const formattedDate = moment(value).format("DD/MM/YYYY");
          return <div>{formattedDate}</div>;
        },
      },
    ],
    [selectedRows, activeTab]
  );

  document.title = "Detergent | Gate Entry";
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
                            "grn",
                            bulk == true ? selectedRows : [{ id: rowData?.id }],
                            1
                          )
                        }
                      >
                        Approve
                      </button>
                    )}
                    {(activeTab === 1 || activeTab === 2) && (
                      <button
                        type="button"
                        className="btn btn-danger btn-lg me-2"
                        onClick={() =>
                          approvalStatus(
                            "grn",
                            bulk == true ? selectedRows : [{ id: rowData?.id }],
                            2
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
                      <Label for={`external_batch_number-${index}`}>External Number</Label>
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

          <Modal isOpen={modal} centered>
            <ModalHeader>Edit Gate Entry LineItem</ModalHeader>
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
                        name="gate_line_item"
                        className={`form-control ${formErrors.gate_line_item ? "is-invalid" : ""
                          }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Line Item Number"
                        value={formData?.gate_line_item}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            gate_line_item: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            gate_line_item: "",
                          }));
                        }}
                      />
                      {formErrors.gate_line_item && (
                        <div className="invalid-feedback">
                          {formErrors.gate_line_item}
                        </div>
                      )}
                    </Col>
                    <Col md={12} className="mb-3">
                      <Label htmlFor="formrow-state-Input">
                        Sequence Number
                      </Label>
                      <Input
                        type="Number"
                        name="sequence_no"
                        className={`form-control ${formErrors.sequence_no ? "is-invalid" : ""
                          }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Sequence Number"
                        value={formData?.sequence_no}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            sequence_no: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            sequence_no: "",
                          }));
                        }}
                      />
                      {formErrors.sequence_no && (
                        <div className="invalid-feedback">
                          {formErrors.sequence_no}
                        </div>
                      )}
                    </Col>

                    <Col md={12} className="mb-3">
                      <Label htmlFor="formrow-state-Input">GRN Quantity</Label>
                      <Input
                        type="Number"
                        name="asn_grn_quantity"
                        className={`form-control ${formErrors.asn_grn_quantity ? "is-invalid" : ""
                          }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter GRN Quantity"
                        value={formData?.asn_grn_quantity}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            asn_grn_quantity: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            asn_grn_quantity: "",
                          }));
                        }}
                      />
                      {formErrors.asn_grn_quantity && (
                        <div className="invalid-feedback">
                          {formErrors.asn_grn_quantity}
                        </div>
                      )}
                    </Col>
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
          <Breadcrumbs
            titlePath="#"
            title="Gate Entry"
            breadcrumbItem="Gate Entry"
          />

          <Card>
            <Row>
              <Col lg="12">
                <div className="custom-tabs-wrapper">
                  <ul className="custom-tab-nav">
                    {[
                      { id: 1, label: "Gate Inbound" },
                      { id: 2, label: "Gate Outbound" },
                      { id: 3, label: "Gate Inound Closed" },
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

          <TableContainer
            columns={columns}
            data={
              activeTab === 1
                ? gateEntry?.gateInList &&
                  gateEntry?.gateInList.length > 0
                  ? gateEntry?.gateInList
                  : allData
                : activeTab === 2
                  ? gateEntry?.gateOutList &&
                    gateEntry?.gateOutList.length > 0
                    ? gateEntry?.gateOutList
                    : allData
                  : activeTab === 3
                    ? gateEntry?.gateInClosedList &&
                      gateEntry?.gateInClosedList.length > 0
                      ? gateEntry?.gateInClosedList
                      : allData
                    : allData
            }
            isLoading={loading}
            showGRNButton={
              activeTab === 1
            }
            handleGRNClick={handleGRNClick}
            isGlobalFilter={true}
            isAddOptions={true}
            customPageSize={10}
            className="custom-header-css"
            selectedRows={selectedRows}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default GateEntry;
