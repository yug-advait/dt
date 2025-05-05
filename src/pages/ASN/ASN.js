import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  UncontrolledTooltip,
  Modal,
  ModalBody,
  Label,
  FormGroup,
  ModalFooter,
  ModalHeader,
  Form,
  Button,
  Alert,
} from "reactstrap";
import "flatpickr/dist/themes/material_blue.css";
import { useHistory, Link } from "react-router-dom";
import classnames from "classnames";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import { GET_ASN_REQUEST } from "../../store/ASN/actionTypes";
import { updateApprovalStatus } from "helpers/Api/api_common";
import { vehicalDroupdown } from "helpers/Api/api_asn";
import { useSelector, useDispatch } from "react-redux";
import {
  updateLineItemApiCall,
  deleteLineItemApiCall,
} from "helpers/Api/api_common";
import moment from "moment";
import DeleteModal from "components/Common/DeleteModal";
const ASN = () => {
  const history = useHistory();
  const { asn } = useSelector(state => state.asn);
  const dispatch = useDispatch();
  const [toast, setToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [gateEntryPermission, setGateEntryPermission] = useState();
  const [activeTab, setActiveTab] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [allData, setAllData] = useState([]);
  const [extBatches, setExtBatches] = useState([]);
  const [userId, setUserId] = useState({});
  const [optionvehicalType, setOptionvehicalType] = useState([]);
  const [selectvehicaltype, setSelectvehicaltype] = useState(null);
  const [reason, setReason] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [modal, setModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [asnPermission, setAsnPermission] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState("");
  const [bulk, setBulk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    del_line_item: "",
    sequence_no: "",
    delivery_quantity: "",
    putaway_quantity: "",
    open_delivery_quantity: "",
  });

  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };
  const handleShowModal = data => {
    setShowModal(true);
    setBatches(data?.batch_numbers);
    setExtBatches(data?.external_batch_numbers);
  };

  const handlevehicalDroupdown = async () => {
    const vehicalDroupdownData = await vehicalDroupdown();
    setOptionvehicalType(vehicalDroupdownData)
  }

  useEffect(() => {
    dispatch({
      type: GET_ASN_REQUEST,
      payload: [],
    });
    setLoading(false);
    handlevehicalDroupdown()
    const userData = getUserData();
    setUserId(userData?.user?.id)
    var permissions = userData?.permissionList.filter(
      permission => permission.sub_menu_name === "asn" || permission.sub_menu_name === "gate_entry"
    );
    setAsnPermission(
      permissions.find(permission => permission.sub_menu_name === "asn")
    );
    setGateEntryPermission(
      permissions.find(permission => permission.sub_menu_name === "gate_entry")
    );
  }, [activeTab, toastMessage, selectvehicaltype]);


  const handleClicks = () => {
    history.push({
      pathname: "/asn/create_asn",
      state: { editASN: "", LineItem: [] },
    });
  };
  const handleGateEntryClick = () => {
    history.push({
      pathname: "/gate_entry/create_gate_entry",
      state: { editGateEntry: "", LineItem: selectedRows, GateInbound: true, selectvehicaltype: selectvehicaltype },
    });
  };
  const handlevehicaltypeChange = (selectedOption) => {
    setSelectedRows(asn.approvedAsnList)
    setAllData(asn.approvedAsnList)
    setSelectvehicaltype(selectedOption);
    // Filter the array based on vehical_no
    const filteredData = asn.approvedAsnList.filter(
      item => item.vehical_no == selectedOption.label
    );
    setSelectedRows(filteredData);
    setAllData(filteredData)
  }

  const approvalStatus = async (type, lineArray, approval_status, updatedby, reason) => {
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
        type: GET_ASN_REQUEST,
        payload: [],
      });
      setToastMessage(approvalStatus?.message);
      setSelectedRows([]);
      setSelectedVendor(null)
    } else {
      setToastMessage("Status Not Update");
    }
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };


  const toggleTab = tab => {
    setSelectedRows([]);
    setActiveTab(tab);
    setSelectvehicaltype("");
    if (tab == 2) {
      setSelectedRows(asn?.approvedAsnList);
    }
  };

  const openModal = (data = null) => {
    setFormData({
      id: data?.id,
      del_line_item: data?.del_line_item,
      sequence_no: data?.sequence_no,
      delivery_quantity: data?.delivery_quantity,
      putaway_quantity: data?.putaway_quantity,
      open_delivery_quantity: data?.open_delivery_quantity,
    });
    setModal(true);
  };

  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
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
        "asn"
      );
      setToast(true);
      setToastMessage(deleteLineItemData?.message);
      setSelectedRows([]);
      setSelectedVendor(null)
      dispatch({
        type: GET_ASN_REQUEST,
        payload: [],
      });
      setTimeout(() => {
        setToast(false);
      }, 2000);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const handleCheckboxChange = row => {
    setSelectedVendor(null)
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

  const validateForm = () => {
    const errors = {};

    if (!formData.del_line_item) {
      errors.del_line_item = "Line Item Number is required.";
    }
    if (!formData.delivery_quantity) {
      errors.delivery_quantity = "Delivery Quantity is required.";
    }
    if (!formData.putaway_quantity) {
      errors.putaway_quantity = "Putaway Quantity is required.";
    }
    if (!formData.open_delivery_quantity) {
      errors.open_delivery_quantity = "Open Delivery Quantity is required.";
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
    const updateLineItemData = await updateLineItemApiCall(formData, "asn");
    setToast(true);
    setToastMessage(updateLineItemData?.message);
    setSelectedRows([]);
    setSelectedVendor(null)
    dispatch({
      type: GET_ASN_REQUEST,
      payload: [],
    });
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };

  const getTableData = () => {
    if (activeTab === 1) {
      return asn?.openAsnList?.length > 0 ? asn.openAsnList : [];
    }
    if (activeTab === 2 && selectvehicaltype) {
      return allData;
    }
    if (activeTab === 2) {
      return asn?.approvedAsnList?.length > 0 ? asn?.approvedAsnList : [];
    }
    if (activeTab === 3) {
      return asn?.rejectedAsnList?.length > 0 ? asn.rejectedAsnList : [];
    }
    if (activeTab === 4) {
      return asn?.waitingForGrn?.length > 0 ? asn.waitingForGrn : [];
    }
    if (activeTab === 5) {
      return asn?.closeAsnList?.length > 0 ? asn.closeAsnList : [];
    }
    return [];
  };


  const columns = useMemo(
    () => [
      {
        Header: "Line Item Number",
        accessor: "del_line_item",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            {(activeTab === 1 || (activeTab === 2 && selectvehicaltype !== '')) && (
              <Input
                type="checkbox"
                style={{ cursor: "pointer" }}
                checked={selectedRows.includes(row.original)}
                onChange={() => handleCheckboxChange(row.original)}
              />
            )}
            <span className={(activeTab === 1 || activeTab === 2) ? "ms-5" : ""}>
              {row.original.del_line_item}
            </span>
          </div>
        ),
      },
      {
        Header: "Product Description",
        accessor: "product_description",
      },
      {
        Header: "ASN Number",
        accessor: "asn_no",
      },
      {
        Header: "Vendor",
        accessor: "vendor_code.label",
      },
      {
        Header: "Vehicle No.",
        accessor: "vehical_no",
      },
      {
        Header: "Transporter Name",
        accessor: "transpotar_name",
      },
      {
        Header: "Vendor Product Description",
        accessor: "vendor_prod_description",
      },
      {
        Header: "ASN Quantity",
        accessor: "delivery_quantity",
      },
      {
        Header: "Batch Number",
        accessor: "batch_count",
        Cell: cellProps => {
          const { batch_count, batch_numbers } = cellProps.row.original;

          return (
            <div className="d-flex gap-3">
              {batch_count}
              {batch_count > 0 && (
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
        Header: "Eway Bill Date",
        accessor: "eway_bill_date",
        Cell: ({ value }) => {
          const formattedDate = moment(value).format("DD/MM/YYYY");
          if (!value) {
            return <div></div>
          }
          return <div>{formattedDate}</div>;
        },
      },
      {
        Header: "Eway Bill NO.",
        accessor: "eway_bill_no",
      },
      {
        Header: "ASN Date",
        accessor: "asn_date",
        Cell: ({ value }) => {
          const formattedDate = moment(value).format("DD/MM/YYYY");
          return <div>{formattedDate}</div>;
        },
      },
      // {
      //   Header: "Delivery Date",
      //   accessor: "delivery_date",
      //   Cell: ({ value }) => {
      //     const formattedDate = moment(value).format("DD/MM/YYYY");
      //     return <div>{formattedDate}</div>;
      //   },
      // },
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
                        onClick={(e) => {
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
          Header:
            asnPermission &&
            (asnPermission?.can_edit || asnPermission?.can_delete || asnPermission?.can_approved) &&
            activeTab === 1 || activeTab === 2 || activeTab === 3
              ? "Actions"
              : "",
          accessor: "action",
          disableFilters: true,
          Cell: cellProps => {
            const handleInvoiceClick = () => {
              const invoiceUrl = cellProps.row.original?.supplier_invoice;
              if (invoiceUrl) {
                window.open(invoiceUrl, "_blank"); // Opens the URL in a new tab
              } else {
                alert("Invoice URL not available."); // Optional fallback if URL is missing
              }
            };
        
            return (
              <div className="d-flex gap-3">
                {asnPermission && asnPermission?.can_edit && activeTab === 1 && (
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
        
                {asnPermission &&
                  asnPermission?.can_delete &&
                  activeTab === 1 && (
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
        
                {(asnPermission && asnPermission?.can_approved) &&
                  activeTab !== 4 && activeTab !== 5 && (
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
        
                {cellProps.row.original?.supplier_invoice && (
                  <Link
                    to="#"
                    className="text-primary"
                    onClick={handleInvoiceClick}
                  >
                    <i
                      className="mdi mdi-file-document-outline font-size-18"
                      id="invoicetooltip"
                    />
                    <UncontrolledTooltip placement="top" target="invoicetooltip">
                      Supplier Invoice
                    </UncontrolledTooltip>
                  </Link> 
                )}
              </div>
            );
          },
        } ,     
    ],
    [activeTab, selectedRows, selectvehicaltype, asnPermission]
  );


  document.title = "Detergent | ASN";

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
                        className="btn-custom-theme btn-lg me-2"
                        onClick={() =>
                          approvalStatus(
                            "asn",
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
                    {(activeTab === 1 || activeTab === 2) && (
                      <button
                        type="button"
                        className="btn btn-danger btn-lg me-2"
                        onClick={() =>
                          approvalStatus(
                            "asn",
                            bulk == true ? selectedRows : [{ id: rowData?.id }],
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
            <ModalHeader>Edit ASN LineItem</ModalHeader>
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
                        name="del_line_item"
                        className={`form-control ${formErrors.del_line_item ? "is-invalid" : ""
                          }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Line Item Number"
                        value={formData?.del_line_item}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            del_line_item: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            del_line_item: "",
                          }));
                        }}
                      />
                      {formErrors.del_line_item && (
                        <div className="invalid-feedback">
                          {formErrors.del_line_item}
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
                      <Label htmlFor="formrow-state-Input">
                        Delivery Quantity
                      </Label>
                      <Input
                        type="Number"
                        name="delivery_quantity"
                        className={`form-control ${formErrors.delivery_quantity ? "is-invalid" : ""
                          }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Delivery Quantity"
                        value={formData?.delivery_quantity}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            delivery_quantity: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            delivery_quantity: "",
                          }));
                        }}
                      />
                      {formErrors.delivery_quantity && (
                        <div className="invalid-feedback">
                          {formErrors.delivery_quantity}
                        </div>
                      )}
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <Button
                      //color="primary"
                      type="submit"
                      className="btn btn-custom-theme "
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
                      {batch.serialNumbers
                        .split(",")
                        .map((serialNumber, serialIndex) => (
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

          <DeleteModal
            show={deleteModal}
            title1="Are you sure?"
            title2="You won't be able to delete this!"
            className="mdi mdi-alert-circle-outline"
            saveTitle="Yes, delete it!"
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
          />

          <Breadcrumbs titlePath="#" title="ASN" breadcrumbItem="ASN" />
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
                          <span className="number">1</span> Open ASN
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
                          <span className="number">2</span> Approved ASN
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
                          <span className="number">3</span> Rejected ASN
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
                          <span className="number">4</span> Waiting For GRN
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
                          <span className="number">5</span> Closed ASN
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
          <TableContainer
            columns={columns}
            data={getTableData()} // Using the refactored function
            isGlobalFilter={true}
            isLoading={loading}
            handleClicks={handleClicks}
            customPageSize={10}
            className="custom-header-css"
            addGateButtonLabel={"Create Gate Inbound"}
            selectedRows={selectedRows}
            handleCheckboxChange={handleCheckboxChange}
            handleApproveClick={handleApproveClick}
            showApproveButton={
              asnPermission && asnPermission?.can_approved && activeTab === 1
            }
            showGateEntryButton={
              gateEntryPermission &&
              gateEntryPermission?.can_add &&
              activeTab === 2
            }
            handleGateEntryClick={handleGateEntryClick}
            optionvehicalType={optionvehicalType}
            selectvehicaltype={selectvehicaltype}
            handlevehicaltypeChange={handlevehicaltypeChange}
            showVechicalNoButton={activeTab === 2}
            setSelectvehicaltype={setSelectvehicaltype} 
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ASN;
