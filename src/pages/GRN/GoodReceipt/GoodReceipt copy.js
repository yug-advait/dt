import React, { useEffect, useMemo, useState} from "react";
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
import { useHistory, Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import { updateApprovalStatus } from "helpers/Api/api_common";
import { vehicalDroupdown } from "helpers/Api/api_asn";
import { GET_GOODRECEIPT_REQUEST } from "../../../store/goodReceipt/actionTypes";
import {
  updateLineItemApiCall,
  deleteLineItemApiCall,
} from "helpers/Api/api_common";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
const GoodReceipt = () => {
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const {
    goodreceipt,
    addGoodReceipt,
    updateGoodReceipt,
    deleteGoodReceipt,
    error,
  } = useSelector(state => state.goodreceipt);

  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [allData, setAllData] = useState([]);
  const [rowData, setRowData] = useState("");
  const [toastMessage, setToastMessage] = useState();
  const [gateEntryPermission, setGateEntryPermission] = useState();
  const [grnPermission, setGrnPermission] = useState();
  const [isActive, setIsActive] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [optionvehicalType, setOptionvehicalType] = useState([]);
  const [selectvehicaltype, setSelectvehicaltype] = useState("");
  const [reason, setReason] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [approveModal, setApproveModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [bulk, setBulk] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [userId, setUserId] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [Edit, setEdit] = useState(null);
  const [formData, setFormData] = useState({
    sequence_no: "",
    del_line_item: "",
    grn_quantity: "",
  });
  useEffect(() => {
    dispatch({
      type: GET_GOODRECEIPT_REQUEST,
      payload: [],
    });
  }, [activeTab,toastMessage,selectvehicaltype]);

  const handlevehicalDroupdown = async () => {
    const vehicalDroupdownData = await vehicalDroupdown();
    setOptionvehicalType(vehicalDroupdownData);
  };


  useEffect(() => {
    const userData = getUserData();
    setUserId(userData?.user?.id);
    var permissions = userData?.permissionList.filter(
      permission => permission.sub_menu_name === "grn" || permission.sub_menu_name === "gate_entry"
    );
    setGrnPermission(
      permissions.find(permission => permission.sub_menu_name === "grn")
    );
    setGateEntryPermission(
      permissions.find(permission => permission.sub_menu_name === "gate_entry")
    );
    handlevehicalDroupdown();
    if (updateGoodReceipt) {
      setToastMessage("Good Receipt Updated Successfully");
      dispatch({
        type: GET_GOODRECEIPT_REQUEST,
      });
      setToast(true);
    }
    if (deleteGoodReceipt) {
      setToastMessage("Good Receipt Deleted Successfully");
      dispatch({
        type: GET_GOODRECEIPT_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Good Receipt Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_GOODRECEIPT_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [
    addGoodReceipt,
    updateGoodReceipt,
    updateCommon,
    deleteGoodReceipt,
    toast,
  ]);

  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };

  const handleClicks = () => {
    history.push({
      pathname: "/grn/good_receipt/create_good_receipt",
      state: { editGRN: "", LineItem: [] },
    });
  };

  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setDeleteModal(false);
      const deleteLineItemData = await deleteLineItemApiCall(
        rowData?.id,
        "grn"
      );
      setToast(true);
      setToastMessage(deleteLineItemData?.message);
      dispatch({
        type: GET_GOODRECEIPT_REQUEST,
        payload: [],
      });
      setTimeout(() => {
        setToast(false);
      }, 2000);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const toggleTab = tab => {
    setSelectedRows([]);
    setActiveTab(tab);
    setSelectvehicaltype("");
    if (tab == 2) {
      setSelectedRows(goodreceipt.approvedGrnList);
    }
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
      setToastMessage(approvalStatus?.message);
      dispatch({
        type: GET_GOODRECEIPT_REQUEST,
        payload: [],
      });
    } else {
      setToastMessage("Status Not Update");
    }
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };

  const onClickApproveStatus = item => {
    setRowData(item);
    setApproveModal(true);
  };

  const handleApproveClick = () => {
    setApproveModal(true);
    setBulk(true);
  };

  const handleShowModal = data => {
    setShowModal(true);
    setBatches(data?.batch_numbers);
  };

  const handleCheckboxChange = row => {
    setSelectedVendor(null);
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
      type: GET_GOODRECEIPT_REQUEST,
      payload: [],
    });
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };

  const openModal = (data = null) => {
    setEdit(data);
    setRowData(data);
    setFormData({
      id: data?.id || "",
      sequence_no: data?.sequence_no || "",
      del_line_item: data?.del_line_item || "",
      grn_quantity: data?.grn_quantity || "",
      delivery_quantity: data?.delivery_quantity || "",
      putaway_quantity: data?.putaway_quantity || "",
      open_delivery_quantity: data?.open_delivery_quantity || "",
      isactive: data?.isactive || true,
    });
    setModal(true);
    if (data) {
      setIsActive(data.isactive);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.sequence_no) {
      errors.sequence_no = "Sequence Number is required.";
    }
    if (!formData.del_line_item) {
      errors.del_line_item = "Line Item is required.";
    }
    if (!formData.grn_quantity) {
      errors.grn_quantity = "grn_quantity is required.";
    }
    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };
  const handleGateEntryClick = () => {
    history.push({
      pathname: "/gate_entry/create_gate_entry",
      state: { editGateEntry: "", LineItem: selectedRows, GateInbound: false,selectvehicaltype:selectvehicaltype },
    });
  };

  const handlevehicaltypeChange = selectedOption => {
    setSelectedRows(goodreceipt.approvedGrnList)
    setAllData(goodreceipt.approvedGrnList)
    setSelectvehicaltype(selectedOption);
    // Filter the array based on vehical_no
    const filteredData = goodreceipt.approvedGrnList.filter(
      item => item.vehical_no == selectedOption.label
    );
    setSelectedRows(filteredData);
    setAllData(filteredData)
  };
  const getTableData = () => {
    if (activeTab === 1) {
      return goodreceipt?.openGrnList?.length > 0 ? goodreceipt.openGrnList : [];
    }
    if (activeTab === 2 && selectvehicaltype) {
      return allData;
    }
    if (activeTab === 2) {
      return goodreceipt?.approvedGrnList?.length > 0 ? goodreceipt.approvedGrnList : [];
    }
    if (activeTab === 3) {
      return goodreceipt?.rejectedGrnList?.length > 0 ? goodreceipt.rejectedGrnList : [];
    }
    if (activeTab === 4) {
      return goodreceipt?.closeGrnList?.length > 0 ? goodreceipt.closeGrnList : [];
    }
    return [];
  };

  const columns = useMemo(() => [
      {
        Header: "GRN Number",
        accessor: "grn_no",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            {(activeTab === 1 ||
              (activeTab === 2 && selectvehicaltype !== "")) && (
              <Input
                type="checkbox"
                style={{ cursor: "pointer" }}
                checked={selectedRows.includes(row.original)}
                onChange={() => handleCheckboxChange(row.original)}
              />
            )}

            <span className={activeTab === 1 || activeTab === 2 ? "ms-3" : ""}>
              {row.original.grn_no}
            </span>
          </div>
        ),
      },
      {
        Header: "Line Item Number",
        accessor: "del_line_item",
      },
      {
        Header: "Product Description",
        accessor: "product_description",
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
        accessor: "transporter_name",
      },
      {
        Header: "Vendor Product Description",
        accessor: "vendor_prod_description",
      },
      {
        Header: "Quantity",
        accessor: "grn_quantity",
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
      },
      ...(activeTab === 2 || activeTab === 3  ? [{
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
      }] : []),
      {
        Header: activeTab === 1 || activeTab === 2 || activeTab === 3
          ? "Actions"
          : "",
        accessor: "action",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
               {grnPermission && grnPermission?.can_edit && activeTab === 1 && (
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
              {grnPermission &&
                grnPermission?.can_delete &&
                activeTab === 1 && (
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
              )}
              {(grnPermission && grnPermission?.can_approved) && activeTab !== 4 && (
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
            </div>
          );
        },
      },
  ],
  [activeTab, grnPermission, selectvehicaltype, selectedRows]
);
  document.title = "Detergent | Good Receipt";
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
                      <Button
                        type="button"
                        className="btn-custom-theme btn-lg me-2"
                        onClick={() =>
                          approvalStatus(
                            "grn",
                            bulk == true ? selectedRows : [{ id: rowData?.id }],
                            1,
                            userId,
                            reason
                          )
                        }
                      >
                        Approve
                      </Button>
                    )}
                    {(activeTab === 1 || activeTab === 2) && (
                      <button
                        type="button"
                        className="btn btn-danger btn-lg me-2"
                        onClick={() =>
                          approvalStatus(
                            "grn",
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

          <Modal isOpen={modal} centered>
            <ModalHeader>Edit GRN LineItem</ModalHeader>
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
                        className={`form-control ${
                          formErrors.del_line_item ? "is-invalid" : ""
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
                        className={`form-control ${
                          formErrors.sequence_no ? "is-invalid" : ""
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
                        name="grn_quantity"
                        className={`form-control ${
                          formErrors.grn_quantity ? "is-invalid" : ""
                        }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter GRN Quantity"
                        value={formData?.grn_quantity}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            grn_quantity: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            grn_quantity: "",
                          }));
                        }}
                      />
                      {formErrors.grn_quantity && (
                        <div className="invalid-feedback">
                          {formErrors.grn_quantity}
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
                        className={`form-control ${
                          formErrors.delivery_quantity ? "is-invalid" : ""
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
                    <Col md={12} className="mb-3">
                      <Label htmlFor="formrow-state-Input">
                        Putaway Quantity
                      </Label>
                      <Input
                        type="Number"
                        name="putaway_quantity"
                        className={`form-control ${
                          formErrors.putaway_quantity ? "is-invalid" : ""
                        }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Delivery Quantity"
                        value={formData?.putaway_quantity}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            putaway_quantity: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            putaway_quantity: "",
                          }));
                        }}
                      />
                      {formErrors.putaway_quantity && (
                        <div className="invalid-feedback">
                          {formErrors.putaway_quantity}
                        </div>
                      )}
                    </Col>
                    <Col md={12} className="mb-3">
                      <Label htmlFor="formrow-state-Input">
                        Open Delivery Quantity
                      </Label>
                      <Input
                        type="Number"
                        name="open_delivery_quantity"
                        className={`form-control ${
                          formErrors.open_delivery_quantity ? "is-invalid" : ""
                        }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Delivery Quantity"
                        value={formData?.open_delivery_quantity}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            open_delivery_quantity: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            open_delivery_quantity: "",
                          }));
                        }}
                      />
                      {formErrors.open_delivery_quantity && (
                        <div className="invalid-feedback">
                          {formErrors.open_delivery_quantity}
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
            title="GRN"
            breadcrumbItem="Good Receipt"
          />

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
                          <span className="number">1</span> Open GRN
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
                          <span className="number">2</span> Approved GRN
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
                          <span className="number">3</span> Rejected GRN
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
                          <span className="number">4</span> Closed GRN
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
            isAddOptions={grnPermission && grnPermission?.can_add}
            customPageSize={10}
            className="custom-header-css"
            addButtonLabel={"Create GRN"}
            addGateButtonLabel={"Create Gate Outbound"}
            handleClicks={handleClicks}
            selectedRows={selectedRows}
            handleCheckboxChange={handleCheckboxChange}
            handleApproveClick={handleApproveClick}
            showGateEntryButton={
              gateEntryPermission &&
              gateEntryPermission?.can_add &&
              activeTab === 2
            }
            handleGateEntryClick={handleGateEntryClick}
            optionvehicalType={optionvehicalType}
            selectvehicaltype={selectvehicaltype}
            handlevehicaltypeChange={handlevehicaltypeChange}
            showApproveButton={
              grnPermission && grnPermission?.can_approved && activeTab === 1
            }
            showVechicalNoButton={activeTab === 2}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default GoodReceipt;
