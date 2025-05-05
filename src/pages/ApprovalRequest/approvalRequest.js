import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Input,
  Row,
  Col,
  UncontrolledTooltip,
  FormGroup,
  Modal,
  Label,
  ModalHeader,
  ModalBody,
  Button,
} from "reactstrap";
import Select from "react-select";
import TableContainer from "components/Common/TableContainer";
import { GET_PO_REQUEST } from "../../store/purchaseOrder/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  updateApprovalRequest,
  updateApprovalStatus,
} from "helpers/Api/api_common";
import "flatpickr/dist/themes/material_blue.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
const PurchaseOrder = () => {
  const dispatch = useDispatch();
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [asnPermission, setAsnPermission] = useState();
  const [poPermission, setPoPermission] = useState();
  const [maxPriceBand, setMaxPriceBand] = useState(0);
  const [approvalManager, setApprovalManager] = useState("");
  const [optionApprovalManager, setOptionApprovalManager] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [userId, setUserId] = useState({});
  const [userData, setUserData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [bulk, setBulk] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [rowData, setRowData] = useState("");
  const { po } = useSelector(state => state.purchaseOrder);
  useEffect(() => {
    setSelectedRows([]);
    dispatch({
      type: GET_PO_REQUEST,
      payload: [],
    });
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
  }, [toastMessage]);

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
      dispatch({
        type: GET_PO_REQUEST,
        payload: [],
      });
      setToastMessage(approvalStatus?.message);
    }
    setTimeout(() => {
      setToast(false);
    }, 2000);
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
    if (approvalRequest?.success) {
      dispatch({
        type: GET_PO_REQUEST,
        payload: [],
      });
      setToastMessage(approvalRequest?.message);
      setSelectedRows([]);
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

  const handleCheckboxChange = row => {
    setMaxPriceBand(0);
    const isChecked = selectedRows.includes(row);
    if (isChecked) {
      setMaxPriceBand(maxPriceBand - row?.net_value);
    } else {
      setMaxPriceBand(maxPriceBand + row?.net_value);
    }
    setSelectedRows(prevSelected => {
      if (prevSelected.includes(row)) {
        return prevSelected.filter(item => item !== row);
      } else {
        return [...prevSelected, row];
      }
    });
  };
  const onClickApproveStatus = item => {
    setApprovalManager([]);
    setMaxPriceBand(item.net_value);
    setRowData(item);
    setShowModal(true);
  };

  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };

  const columns = useMemo(() => {
    const commonColumns = [
      {
        Header: "Product Description",
        accessor: "product_description",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
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
    commonColumns.unshift(
      {
        Header: "Line Item Number",
        accessor: "po_line_item",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <Input
              type="checkbox"
              style={{ cursor: "pointer" }}
              checked={selectedRows.includes(row.original)}
              onChange={() => handleCheckboxChange(row.original)}
            />
            <span className={"ms-5"}>{row.original.po_line_item}</span>
          </div>
        ),
      },
      {
        Header: "PO Number",
        accessor: "po_no",
      },
      {
        Header: "Net Value",
        accessor: "net_value",
      },
      {
        Header: "Request From",
        accessor: "request_name",
      },
      {
        Header: "Quantity",
        accessor: "po_quantity",
      }
    );
    commonColumns.push({
      Header: "PO Date",
      accessor: "po_date",
      Cell: ({ value }) => {
        const formattedDate = moment(value).format("DD/MM/YYYY");
        return <div>{formattedDate}</div>;
      },
    });

    commonColumns.push({
      Header: "Delivery Date",
      accessor: "delivery_date",
      Cell: ({ value }) => {
        const formattedDate = moment(value).format("DD/MM/YYYY");
        return <div>{formattedDate}</div>;
      },
    });
    commonColumns.push({
      Header: "Actions",
      accessor: "action",
      disableFilters: true,
      Cell: cellProps => (
        <div className="d-flex gap-3">
          <>
            <Link to="#" className="text-success">
              <i
                className="mdi mdi-send font-size-18"
                id="request_nametooltip"
              />
              <UncontrolledTooltip placement="top" target="request_nametooltip">
                Request come from {cellProps.row.original?.request_name}
              </UncontrolledTooltip>
            </Link>
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
          </>
        </div>
      ),
    });
    return commonColumns;
  }, [selectedRows, poPermission, asnPermission]);

  document.title = "Detergent | Approval Request";
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
                    {maxPriceBand <= userData?.max_price_band && (
                      <Button
                        type="button"
                        className="btn-custom-theme btn-lg me-2"
                        onClick={() =>
                          approvalStatus(
                            "approval_request",
                            bulk == true ? selectedRows : [{ id: rowData?.id }],
                            1,
                            userId,
                            ""
                          )
                        }
                      >
                        Approve
                      </Button>
                    )}
                    {maxPriceBand <= userData?.max_price_band && (
                      <button
                        type="button"
                        className="btn btn-danger btn-lg me-2"
                        onClick={() =>
                          approvalStatus(
                            "approval_request",
                            bulk == true ? selectedRows : [{ id: rowData?.id }],
                            2,
                            userId,
                            ""
                          )
                        }
                      >
                        Reject
                      </button>
                    )}
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
            </ModalBody>
          </Modal>
          <Breadcrumbs
            titlePath="#"
            title="PO"
            breadcrumbItem="Approval Request"
          />

          {/* Table Container */}
          <TableContainer
            columns={columns}
            data={
              po?.approvalRequestedList && po?.approvalRequestedList.length > 0
                ? po.approvalRequestedList
                : []
            }
            isGlobalFilter={true}
            showApproveButton={true}
            customPageSize={10}
            className="custom-header-css"
            selectedRows={selectedRows}
            handleApproveClick={handleApproveClick}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default PurchaseOrder;
