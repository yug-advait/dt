import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  UncontrolledTooltip,
  Input,
  Alert,
  Form,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "reactstrap";
import Select from "react-select";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import classnames from "classnames";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import { GET_PR_REQUEST } from "../../store/purchaseRequest/actionTypes";
import { updateApprovalStatus } from "helpers/Api/api_common";
import { useSelector, useDispatch } from "react-redux";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import {
  getSelectData,
  updateLineItemApiCall,
  deleteLineItemApiCall,
} from "helpers/Api/api_common";
import debounce from "lodash/debounce";
import DeleteModal from "components/Common/DeleteModal";

const PurchaseRequest = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { pr } = useSelector(state => state.purchaseRequest);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [activeTab, setActiveTab] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [reason, setReason] = useState('')
  const [modal, setModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [userId, setUserId] = useState({});
  const [selectProduct, setSelectedProduct] = useState({});
  const [prPermission, setPrPermission] = useState();
  const [poPermission, setPoPermission] = useState();
  const [rfqPermission, setRfqPermission] = useState();
  const [optionProduct, setOptionProduct] = useState([]);
  const [selectProductGroup, setSelectedProductGroup] = useState({});
  const [optionProductGroup, setOptionProductGroup] = useState([]);
  const [selectProductUom, setSelectedProductUom] = useState({});
  const [optionProductUOM, setOptionProductUOM] = useState([]);
  const [selectProductPlant, setSelectedProductPlant] = useState({});
  const [optionProductPlant, setOptionProductPlant] = useState([]);
  const [selectProductLocation, setSelectedProductLocation] = useState({});
  const [loading, setLoading] = useState(true);
  const [optionProductLocation, setOptionProductLocation] = useState([]);
  const [bulk, setBulk] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState("");
  const [formData, setFormData] = useState({
    line_item_number: "",
    product_description: "",
    vendor_prod_description: "",
    quantity: "",
    product_code: "",
    product_group: "",
    uom: "",
    warehouse: "",
    location: "",
    delivery_date: "",
  });

  const validateDeliveryDate = useCallback((selectedDate) => {
    const today = moment().startOf("day");
    const selected = moment(selectedDate).startOf("day");

    if (selected.isBefore(today)) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        delivery_date: "Delivery date cannot be before today",
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        delivery_date: "",
      }));
    }
  }, []);

  const handleDateChange = useCallback((selectedDates) => {
    const selectedDate = selectedDates[0];
    const formattedDate = moment(selectedDate).format("DD/MM/YYYY");

    if (formattedDate !== formData.delivery_date) {
      validateDeliveryDate(selectedDate);
      setFormData((prevData) => ({
        ...prevData,
        delivery_date: formattedDate,
      }));
    }
  }, [formData.delivery_date, validateDeliveryDate]);


  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };
  const dropdownList = async () => {
    const selectData = await getSelectData(
      "product_code",
      "",
      "product_master"
    );
    setOptionProduct(selectData?.getDataByColNameData);
    const selectPGroupData = await getSelectData(
      "division_code",
      "",
      "product_grouping_division"
    );
    setOptionProductGroup(selectPGroupData?.getDataByColNameData);
    const selectUomData = await getSelectData(
      "uom_description",
      "",
      "unit_of_measure"
    );
    setOptionProductUOM(selectUomData?.getDataByColNameData);
    const selectPlantData = await getSelectData(
      "plant_code",
      "",
      "warehouse_master"
    );
    setOptionProductPlant(selectPlantData?.getDataByColNameData);
    const selectLocationData = await getSelectData("code", "", "location_code");
    setOptionProductLocation(selectLocationData?.getDataByColNameData);
  };

  const handleInputProduct = useCallback(
    debounce(async inputValue => {
      try {
        const selectProduct = await getSelectData(
          "product_code",
          inputValue,
          "product_master"
        );
        setOptionProduct(selectProduct?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );
  const handleInputProductGroup = useCallback(
    debounce(async inputValue => {
      try {
        const selectProductGroup = await getSelectData(
          "plant_code",
          inputValue,
          "warehouse_master"
        );
        setOptionProductGroup(selectProductGroup?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    setLoading(false);
    dropdownList();
    const userData = getUserData();
    setUserId(userData?.user?.id)
    var permissions = userData?.permissionList.filter(
      permission =>
        permission.sub_menu_name === "pr" || permission.sub_menu_name === "po" || permission.sub_menu_name === "rfq"
    );
    setPrPermission(
      permissions.find(permission => permission.sub_menu_name === "pr")
    );
    setPoPermission(
      permissions.find(permission => permission.sub_menu_name === "po")
    );
    setRfqPermission(
      permissions.find(permission => permission.sub_menu_name === "rfq")
    );
    dispatch({
      type: GET_PR_REQUEST,
      payload: [],
    });
  }, [activeTab, toastMessage]);

  const handleClicks = () => {
    history.push({
      pathname: "/purchase_request/create",
      state: { editPR: "" },
    });
  };
  // const handleupdate = (row = null) => {
  //   history.push({
  //     pathname: "/purchase_request/edit",
  //     state: { editPR: row },
  //   });
  // };

  const approvalStatus = async (type, lineArray, approval_status, updatedby, reason) => {
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
        type: GET_PR_REQUEST,
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

  const handlePOClick = () => {
    history.push({
      pathname: "/purchase_order/create_po",
      state: { editPO: "", LineItem: selectedRows, selectedVendor: null, prPo: true },
    });
  };

  const handleApproveClick = () => {
    setShowModal(true);
    setBulk(true);
  };

  const handleRFQClick = () => {
    history.push({
      pathname: "rfq/create_rfq",
      state: { editRFQ: "", LineItem: selectedRows },
    });
  };

  const handleCheckboxChange = row => {
    setSelectedRows(prevSelected =>
      prevSelected.includes(row)
        ? prevSelected.filter(item => item !== row)
        : [...prevSelected, row]
    );
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.line_item_number) {
      errors.line_item_number = "Line Item Number is required.";
    }
    if (!formData.product_description) {
      errors.product_description = "Product Description is required.";
    }
    if (!formData.vendor_prod_description) {
      errors.vendor_prod_description = "Vendor Description is required.";
    }
    if (!formData.quantity) {
      errors.quantity = "Quantity is required.";
    }
    if (!formData.delivery_date) {
      errors.delivery_date = "Delivery Date is required.";
    } else {
      const today = moment().startOf("day");
      const selectedDate = moment(formData.delivery_date, "DD/MM/YYYY").startOf("day");

      if (selectedDate.isBefore(today)) {
        errors.delivery_date = "Delivery Date cannot be before today.";
      }
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
    const updateLineItemData = await updateLineItemApiCall(formData, "pr");
    setToast(true);
    setToastMessage(updateLineItemData?.message);
    setSelectedRows([]);
    dispatch({
      type: GET_PR_REQUEST,
      payload: [],
    });
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };
  const toggleTab = tab => {
    setActiveTab(tab);
    setSelectedRows([]);
  };

  const openModal = (data = null) => {
    setSelectedProduct(data?.product_code_value);
    setSelectedProductGroup(data?.product_group_code);
    setSelectedProductUom(data?.uom);
    setSelectedProductPlant(data?.warehouse_code);
    setSelectedProductLocation(data?.location_code);
    setFormData({
      id: data?.id,
      line_item_number: data?.line_item_number,
      product_description: data?.product_description,
      vendor_prod_description: data?.vendor_prod_description,
      quantity: data?.quantity,
      product_code: data?.product_code_value?.value,
      product_group: data?.product_group_code?.value,
      uom: data?.uom?.value,
      warehouse: data?.warehouse_code?.value,
      location: data?.location_code?.value,
      delivery_date: data.delivery_date
        ? moment(data.delivery_date).format("DD/MM/YYYY")
        : "",
    });
    setModal(true);
  };

  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };
  const onClickApproveStatus = item => {
    setRowData(item);
    setShowModal(true);
  };
  const handleDelete = async () => {
    try {
      setDeleteModal(false);
      const deleteLineItemData = await deleteLineItemApiCall(rowData?.id, "pr");
      setToast(true);
      setToastMessage(deleteLineItemData?.message);
      setSelectedRows([]);
      dispatch({
        type: GET_PR_REQUEST,
        payload: [],
      });
      setTimeout(() => {
        setToast(false);
      }, 2000);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Line Item Number",
        accessor: "line_item_number",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            {(activeTab === 1 || activeTab === 2) && (
              <Input
                type="checkbox"
                style={{ cursor: "pointer" }}
                checked={selectedRows.includes(row.original)}
                onChange={() => handleCheckboxChange(row.original)}
              />
            )}
            <span className={(activeTab === 1 || activeTab === 2) ? "ms-5" : ""}>
              {row.original.line_item_number}
            </span>{" "}
            {/* Added margin-left conditionally */}
          </div>
        ),
      },
      {
        Header: "PR Number",
        accessor: "pr_no",
        // Cell: (cellProps) => {
        //   return (
        //     <Link
        //       to="#"
        //       onClick={() => handleupdate(cellProps.row.original)}
        //     >
        //       {cellProps?.row.original?.pr_no}
        //     </Link>
        //   );
        // }
      },
      {
        Header: "Product Name",
        accessor: "product_description",
      },
      {
        Header: "Vendor Product Description",
        accessor: "vendor_prod_description",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Doc Date",
        accessor: "pr_date",
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
          prPermission &&
            (prPermission?.can_edit || prPermission?.can_delete) &&
            activeTab === 1 || activeTab === 2 || activeTab === 3
            ? "Actions"
            : "",
        accessor: "action",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              {prPermission && prPermission?.can_edit && activeTab === 1 ? (
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
              ) : null}

              {prPermission && prPermission?.can_delete && activeTab === 1 ? (
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
              ) : null}

              {(prPermission && prPermission?.can_approved) && activeTab != 4 && (
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
    [activeTab, selectedRows, rfqPermission, poPermission, prPermission]
  );

  document.title = "Detergent | Purchase Request";

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
                    <textarea
                      className="form-control"
                      placeholder="Please provide a reason..."
                      rows={3}
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="text-center mt-3">
                    {(activeTab === 1 || activeTab === 3) && (
                      <Button
                        type="button"
                        className="btn-custom-theme btn-lg me-2"
                        onClick={() =>
                          approvalStatus(
                            "pr",
                            bulk === true
                              ? selectedRows
                              : [{ id: rowData?.id }],
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
                            "pr",
                            bulk === true
                              ? selectedRows
                              : [{ id: rowData?.id }],
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
            <ModalHeader>Edit Purchase Request LineItem</ModalHeader>
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
                        name="line_item_number"
                        className={`form-control ${formErrors.line_item_number ? "is-invalid" : ""
                          }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Line Item Number"
                        value={formData?.line_item_number}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            line_item_number: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            line_item_number: "",
                          }));
                        }}
                      />
                      {formErrors.line_item_number && (
                        <div className="invalid-feedback">
                          {formErrors.line_item_number}
                        </div>
                      )}
                    </Col>
                    <Col md={12} className="mb-3">
                      <div className="">
                        <Label htmlFor="formrow-state-Input">
                          Product Code
                        </Label>
                        <Select
                          value={selectProduct}
                          options={optionProduct}
                          onChange={async selectProduct => {
                            setFormData(prevData => ({
                              ...prevData,
                              product_code: selectProduct?.value,
                            }));
                            setSelectedProduct(selectProduct);
                          }}
                          onInputChange={(inputValue, { action }) => {
                            handleInputProduct(inputValue);
                          }}
                        />
                        {formErrors.product_code && (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "80%",
                            }}
                          >
                            {formErrors.product_code}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={12} className="mb-3">
                      <div className="">
                        <Label htmlFor="formrow-state-Input">
                          Product Group
                        </Label>
                        <Select
                          value={selectProductGroup}
                          options={optionProductGroup}
                          onChange={async selectProductGroup => {
                            setFormData(prevData => ({
                              ...prevData,
                              product_group: selectProductGroup?.value,
                            }));
                            setSelectedProductGroup(selectProductGroup);
                          }}
                          onInputChange={(inputValue, { action }) => {
                            handleInputProductGroup(inputValue);
                          }}
                        />
                        {formErrors.product_group && (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "80%",
                            }}
                          >
                            {formErrors.product_group}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={12} className="mb-3">
                      <Label htmlFor="formrow-state-Input"> 
                        Product Name
                      </Label>
                      <Input
                        type="textarea"
                        name="product_description"
                        className={`form-control ${formErrors.product_description ? "is-invalid" : ""
                          }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Product Name"
                        value={formData?.product_description}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            product_description: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            product_description: "",
                          }));
                        }}
                      />
                      {formErrors.product_description && (
                        <div className="invalid-feedback">
                          {formErrors.product_description}
                        </div>
                      )}
                    </Col>
                    <Col md={12} className="mb-3">
                      <Label htmlFor="formrow-state-Input">
                        Vendor Description
                      </Label>
                      <Input
                        type="textarea"
                        name="vendor_prod_description"
                        className={`form-control ${formErrors.vendor_prod_description ? "is-invalid" : ""
                          }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Vendor Description"
                        value={formData?.vendor_prod_description}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            vendor_prod_description: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            vendor_prod_description: "",
                          }));
                        }}
                      />
                      {formErrors.vendor_prod_description && (
                        <div className="invalid-feedback">
                          {formErrors.vendor_prod_description}
                        </div>
                      )}
                    </Col>
                    <Col md={12} className="mb-3">
                      <div className="">
                        <Label htmlFor="formrow-state-Input">Uom</Label>
                        <Select
                          value={selectProductUom}
                          options={optionProductUOM}
                          onChange={async selectProductUom => {
                            setFormData(prevData => ({
                              ...prevData,
                              uom: selectProductUom?.value,
                            }));
                            setSelectedProductUom(selectProductUom);
                          }}
                        />
                        {formErrors.uom && (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "80%",
                            }}
                          >
                            {formErrors.uom}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={12} className="mb-3">
                      <div className="">
                        <Label htmlFor="formrow-state-Input">Warehouse</Label>
                        <Select
                          value={selectProductPlant}
                          options={optionProductPlant}
                          onChange={async selectProductPlant => {
                            setFormData(prevData => ({
                              ...prevData,
                              warehouse: selectProductPlant?.value,
                            }));
                            setSelectedProductPlant(selectProductPlant);
                          }}
                        />
                        {formErrors.warehouse && (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "80%",
                            }}
                          >
                            {formErrors.warehouse}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={12} className="mb-3">
                      <div className="">
                        <Label htmlFor="formrow-state-Input">Location</Label>
                        <Select
                          value={selectProductLocation}
                          options={optionProductLocation}
                          onChange={async selectProductLocation => {
                            setFormData(prevData => ({
                              ...prevData,
                              location: selectProductLocation?.value,
                            }));
                            setSelectedProductLocation(selectProductLocation);
                          }}
                        />
                        {formErrors.location && (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "80%",
                            }}
                          >
                            {formErrors.location}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={12} className="mb-3">
                      <div className="mb-3">
                        <Label htmlFor="formrow-state-Input">Quantity</Label>
                        <Input
                          type="number"
                          name="quantity"
                          className={`form-control ${formErrors.quantity ? "is-invalid" : ""
                            }`}
                          id="formrow-state-Input"
                          placeholder="Please Enter Quantity"
                          value={formData?.quantity}
                          onChange={e => {
                            setFormData(prevData => ({
                              ...prevData,
                              quantity: e.target.value,
                            }));
                            setFormErrors(prevErrors => ({
                              ...prevErrors,
                              quantity: "",
                            }));
                          }}
                        />
                        {formErrors.quantity && (
                          <div className="invalid-feedback">
                            {formErrors.quantity}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <div className="form-floating mb-3">
                        <Flatpickr
                          options={{
                            altInput: true,
                            altFormat: "j F, Y",
                            dateFormat: "Y-m-d",
                          }}
                          onChange={handleDateChange}
                          value={
                            formData.delivery_date
                              ? moment(
                                formData.delivery_date,
                                "DD/MM/YYYY"
                              ).toDate()
                              : null
                          }
                        />
                        <label htmlFor="delivery_date">Delivery date</label>
                        {formErrors.delivery_date && (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "80%",
                            }}
                          >
                            {formErrors.delivery_date}
                          </div>
                        )}
                      </div>
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
            title2="You won't be able to delete this!"
            className="mdi mdi-alert-circle-outline"
            saveTitle="Yes, delete it!"
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
          />
          <Breadcrumbs
            titlePath="#"
            title="PR"
            breadcrumbItem="Purchase Request"
          />
          <Card>
            <Row>
              <Col lg="12">
                <div className="custom-tabs-wrapper">
                  <ul className="custom-tab-nav">
                    {[
                      { id: 1, label: "Open PR" },
                      { id: 2, label: "Approved PR" },
                      { id: 3, label: "Rejected PR" },
                      { id: 4, label: "Closed PR" },
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
                ? pr?.openPrList && pr?.openPrList.length > 0
                  ? pr.openPrList
                  : []
                : activeTab === 2
                  ? pr?.approvedPrList && pr?.approvedPrList.length > 0
                    ? pr.approvedPrList
                    : []
                  : activeTab === 3
                    ? pr?.rejectedPrList && pr?.rejectedPrList.length > 0
                      ? pr.rejectedPrList
                      : []
                    : activeTab === 4
                      ? pr?.closePrList && pr?.closePrList.length > 0
                        ? pr.closePrList
                        : []
                      : []
            }
            setLoading={loading}
            isGlobalFilter={true}
            isAddOptions={true}
            handleClicks={handleClicks}
            handlePOClick={handlePOClick}
            handleApproveClick={handleApproveClick}
            handleRFQClick={handleRFQClick}
            showApproveButton={
              prPermission && prPermission?.can_approved && activeTab === 1
            }
            showRFQButton={
              rfqPermission && rfqPermission?.can_add && activeTab === 2
            }
            selectedRowsPO={selectedRows}
            selectedRows={selectedRows}
            showPOButton={
              poPermission && poPermission?.can_add && activeTab === 2
            }
            customPageSize={10}
            className="custom-header-css"
            addButtonLabel={
              prPermission && prPermission?.can_add
                ? "Add Purchase Request"
                : null
            }
            buttonSizes={
              selectedRows?.length > 0 && (activeTab === 2 || activeTab === 1)
                ? {
                  po: "2",
                  addButtonLabel:
                    prPermission &&
                      prPermission?.can_add &&
                      prPermission?.can_approved
                      ? "2"
                      : "2",
                }
                : { addButtonLabel: "8" }
            }
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default PurchaseRequest;
