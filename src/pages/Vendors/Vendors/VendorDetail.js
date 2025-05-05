import React, { useEffect, useMemo, useState, useCallback } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
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
import classnames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import TableContainer from "components/Common/TableContainer";
import { Link, useHistory, useLocation } from "react-router-dom";
import debounce from "lodash/debounce";
import { getSelectData, updateLineItemApiCall } from "helpers/Api/api_common";
import { getProductsByID } from "helpers/Api/api_products";
import { productTechParameterByID } from "helpers/Api/api_products";
import { GET_VENDORDASHBOARD_REQUEST } from "store/vendorDashboard/actionTypes";
import moment from "moment";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const VendorDetail = ({ vendor }) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [toast, setToast] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [selectPoStatus, setSelectPoStatus] = useState(1);
  const [userData, setUserdata] = useState();
  const [modal, setModal] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [activeSubTab, setActiveSubTab] = useState(1);
  const [allData, setAllData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    rfq_quantity: "",
    quotation_price: "",
    unit_price: "",
    delivery_date: "",
    product_technical_parameters: "",
    notes: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [optionProductList, setOptionProductList] = useState([]);
  const { vendorDashboard } = useSelector(state => state.vendorDashboard);

  const validateDeliveryDate = useCallback(selectedDate => {
    const today = moment().startOf("day");
    const selected = moment(selectedDate).startOf("day");

    if (selected.isBefore(today)) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        delivery_date: "Delivery date cannot be before today",
      }));
    } else {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        delivery_date: "",
      }));
    }
  }, []);

  const handleDateChange = useCallback(
    selectedDates => {
      const selectedDate = selectedDates[0];
      const formattedDate = moment(selectedDate).format("DD/MM/YYYY");

      if (formattedDate !== formData.delivery_date) {
        validateDeliveryDate(selectedDate);
        setFormData(prevData => ({
          ...prevData,
          delivery_date: formattedDate,
        }));
      }
    },
    [formData.delivery_date, validateDeliveryDate]
  );

  const onClickDelete = item => {
    setRowData(item);
    setDeleteModal(true);
  };

  const resetForm = () => {
    setFormErrors({})
    };

  useEffect(() => {
    const userData = getUserData();
    setUserdata(userData);
    dispatch({
      type: GET_VENDORDASHBOARD_REQUEST,
      payload: {type:1},
    });
    toggleTab(activeTab);
  }, [activeTab, activeSubTab]);

  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };
  const handleInputProductList = useCallback(
    debounce(async inputValue => {
      try {
        const selectProductListData = await getSelectData(
          "product_description",
          inputValue,
          "product_master"
        );
        setOptionProductList(selectProductListData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const toggleTab = tab => {
    setSelectedRows([])
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
    if (tab == 1) {
      setAllData([]);
    } else if (tab == 2) {
      setAllData(
        vendorDashboard?.poQuotationList &&
          vendorDashboard?.poQuotationList.length > 0
          ? vendorDashboard.poQuotationList
          : []
      );
    } else if (tab == 3) {
      setAllData([]);
    }
  };

  const toggleSubTab = subTab => {
    setActiveSubTab(subTab);
    if (activeTab === 1) {
      if (subTab === 1) {
        setAllData();
      } else if (subTab === 2) {
        setAllData();
      } else if (subTab === 3) {
        setAllData();
      }
    }
  };

  const handleInputChangeParameter = (section, labelId, data) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [section]: {
        ...prevFormData[section],
        [labelId]: data,
      },
    }));
  };

  const productTechParameter = async parameter_sets => {
    const response = await productTechParameterByID(parameter_sets);
    return response?.productTechParameterByID;
  };
  const handlePoStatusChange = async (e) => {
    setSelectPoStatus(e.target.value)
        dispatch({
      type: GET_VENDORDASHBOARD_REQUEST,
      payload: {type:e.target.value}
    });
  };

  
  const openModal = async (data = null) => {
    const TableDataList = await productTechParameter(data?.tech_ids?.join(","));
    const delDate = moment(data?.delivery_date).format("DD/MM/YYYY");
    setFormData({
      rfq_quantity: data?.rfq_quantity,
      quotation_price: data?.quotation_price,
      unit_price: data?.unit_price,
      product: data?.product,
      product_group_id: data?.product_group_id,
      delivery_date: delDate,
      tech_ids: data?.tech_ids,
      technical_set_value: data?.technical_set_value,
      vendor_id: userData?.user?.id,
      rfq_id: data?.rfq_id,
      rfq_line_item_id: data?.id,
      notes: "",
      warehouse_id: data?.warehouse_id,
      storage_location_id: data?.storage_location_id,
      uom: data?.uom?.value,
      createdby: data?.createdby,
      tableData: TableDataList,
    });
    setModal(true);
  };
  const validateForm = () => {
    const errors = {};

    if (formData.quotation_price === "") {
      errors.quotation_price = "Quotation Price is required.";
    } else if (formData.quotation_price <= 0) {
      errors.quotation_price = "Quotation Price must be greater than 0.";
    }
    
    if (!formData.rfq_quantity) {
      errors.rfq_quantity = " RFQ Quantity is required.";
    }

    if (formData.unit_price === "") {
      errors.unit_price = "Unit Price is required.";
    } else if (formData.unit_price <= 0) {
      errors.unit_price = "Unit Price must be greater than 0.";
    }
    
    if (!formData.delivery_date) {
      errors.delivery_date = "Delivery Date is required.";
    } else {
      const today = moment().startOf("day");
      const selectedDate = moment(formData.delivery_date, "DD/MM/YYYY").startOf(
        "day"
      );
      if (selectedDate.isBefore(today)) {
        errors.delivery_date = "Delivery Date cannot be before today.";
      }
    }
    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async value => {
    if (!validateForm()) {
      return;
    }
    setModal(false);
    if (value == "Submit") {
      const updateLineItemData = await updateLineItemApiCall(
        formData,
        "vendor_rfq"
      );
      setToast(true);
      setToastMessage(updateLineItemData?.message);
      dispatch({
        type: GET_VENDORDASHBOARD_REQUEST,
        payload: {type:1}
      });
      toggleSubTab(2);
      classnames({
        active: activeSubTab === 2,
      });
    } else {
      const updateLineItemData = await updateLineItemApiCall(formData, "rfq_save");
      setToast(true);
      setToastMessage(updateLineItemData?.message);
      dispatch({
        type: GET_VENDORDASHBOARD_REQUEST,
        payload: {type:1},
      });
      toggleSubTab(1);
      classnames({
        active: activeSubTab === 1,
      });
    }
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };

  const handleASNClick = () => {
    history.push({
      pathname: "/asn/create_asn",
      state: { editASN: "", LineItem: selectedRows },
    });
  };
  const handleCheckboxChange = (row) => {
    const user = row.user_name;
  
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(row)) {
        const updatedSelection = prevSelected.filter((item) => item !== row);

        if (updatedSelection.length === 0) {
          setSelectedUser(null);
        }
        return updatedSelection;
      } else {
        if (!selectedUser || selectedUser?.label === user?.label) {
          setSelectedUser(user);
          return [...prevSelected, row];
        }

        return prevSelected;
      }
    });
  };
  
  const columns = useMemo(
    () => [
      ...(activeTab === 2
        ? [
          {
            Header: "PO No",  
            accessor: "po_no", Cell: ({ row }) => (
              <div className="d-flex align-items-center">
                { selectPoStatus == 1 ?
                  <Input
                    type="checkbox"
                    style={{ cursor: "pointer" }}
                    checked={selectedRows.includes(row.original)}
                    onChange={() => handleCheckboxChange(row.original)}
                  />
                  : null
                }
                <span className={(activeTab === 2) ? "ms-3" : ""}>
                  {row.original.po_no}
                </span>
              </div>
            ),
          },
          {
            Header: "User",
            accessor: "user_name.label",
          },
          {
            Header: "Net Value",
            accessor: "net_value",
          },
          {
            Header: "Net Price",
            accessor: "net_price",
          },
          {
            Header: "Product Name",
            accessor: "product_description",
          },
          {
            Header: "PO Date",   
            accessor: "po_date",
            Cell: ({ value }) => {
              const formattedDate = moment(value).format("DD/MM/YYYY");
              return <div>{formattedDate}</div>;
            },
          },
          {
            Header: "PO Line Item Number",  
            accessor: "po_line_item",
          },
          {
            Header: "PO Quantity",  
            accessor: "po_quantity",
          },
        ]
        : [
          {
            Header: "Rfq No.",   
            accessor: "rfq_no",
            Cell: ({ row }) => (
              <div className="d-flex align-items-center">{row.original.rfq_no}</div>
            ),
          },
          ...(activeTab === 1 &&(activeSubTab == 1 || activeSubTab==2 ||activeSubTab==3) 
            ? [
              {
                Header: "User",
                accessor: "first_name",
              },
            ]
            : []),
          {
            Header: "Line Item Number",
            accessor: "rfq_line_item_no",
          },
          {
            Header: "Quantity",
            accessor: "rfq_quantity",
          },
        ]),
      {
        Header: "Vendor Product Desc",
        accessor: "vendor_prod_description",
      },
      {
        Header: "Delivery Date",
        accessor: "delivery_date",
        Cell: ({ value }) => {
          const formattedDate = moment(value).format("DD/MM/YYYY");
          return <div>{formattedDate}</div>;
        },
      },
      ...(activeTab === 1 && (activeSubTab === 3 || activeSubTab === 2)
        ? [
          {
            Header: "Product Name",
            accessor: "product.label",
          },
          {
            Header: "Quotation Price",
            accessor: "quotation_price",
          },
          {
            Header: "Unit Price",
            accessor: "unit_price",
          },
        ]
        : []),
      ...(activeTab === 1 && activeSubTab == 1
        ? [
          {
            Header: "Product Name",
            accessor: "product.label",
          },
          {
            Header: "Actions",
            accessor: "action",
            disableFilters: true,
            Cell: cellProps => (
              <div className="d-flex gap-3">
                {cellProps.row.original.quotation_count == 0 && (
                  <Link
                    to="#"
                    className="text-success"
                    onClick={() => openModal(cellProps.row.original)}
                  >
                    <i
                      style={{ marginTop: "7px" }}
                      className="fas fa-plus-circle font-size-15"
                      id="addtooltip"
                    />
                    <UncontrolledTooltip placement="top" target="addtooltip">
                      Add
                    </UncontrolledTooltip>
                  </Link>
                )}
              </div>
            ),
          },
        ]
        : []),
    ],
    [activeTab,selectPoStatus, activeSubTab, selectedRows, userData]
  );

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
          <Breadcrumbs
            titlePath="#"
            title="Vendor"
            breadcrumbItem="Vendor RFQ Details"
          />
          <Modal isOpen={modal} centered>
            <ModalHeader>Add Quatation</ModalHeader>
            <button
              type="button"
              onClick={() => {
                setModal(false);
                resetForm();
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <ModalBody>
              <div className="modal-body">
                <Form>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Label htmlFor="formrow-state-Input">Quantity</Label>
                      <Input
                        type="Number"
                        name="rfq_quantity"
                        className={`form-control ${formErrors.rfq_quantity ? "is-invalid" : ""
                          }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Rfq Quantity"
                        value={formData?.rfq_quantity}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            rfq_quantity: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            rfq_quantity: "",
                          }));
                        }}
                        readOnly
                      />
                      {formErrors.rfq_quantity && (
                        <div className="invalid-feedback">
                          {formErrors.rfq_quantity}
                        </div>
                      )}
                    </Col>
                    <Col md={12} className="mb-3">
                      <Label htmlFor="formrow-state-Input">
                        Quotation Price
                      </Label>
                      <Input
                        type="Number"
                        name="quotation_price"
                        className={`form-control ${formErrors.quotation_price ? "is-invalid" : ""
                          }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Quotation Prize"
                        value={formData?.quotation_price}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            quotation_price: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            quotation_price: "",
                          }));
                        }}
                      />
                      {formErrors.quotation_price && (
                        <div className="invalid-feedback">
                          {formErrors.quotation_price}
                        </div>
                      )}
                    </Col>
                    <Col md={12} className="mb-3">
                      <Label htmlFor="formrow-state-Input">Unit Price</Label>
                      <Input
                        type="Number"
                        name="unit_price"
                        className={`form-control ${formErrors.unit_price ? "is-invalid" : ""
                          }`}
                        id="formrow-state-Input"
                        placeholder="Please Enter Line Item Number"
                        value={formData?.unit_price}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            unit_price: e.target.value,
                          }));
                          setFormErrors(prevErrors => ({
                            ...prevErrors,
                            unit_price: "",
                          }));
                        }}
                      />
                      {formErrors.unit_price && (
                        <div className="invalid-feedback">
                          {formErrors.unit_price}
                        </div>
                      )}
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
                    <Col md={12} className="mb-3">
                      <div className="">
                        <Label htmlFor="formrow-state-Input">
                          Product Name
                        </Label>
                        <Select
                          value={formData?.product}
                          options={optionProductList}
                          onChange={async selectProductList => {
                            setFormData(prevData => ({
                              ...prevData,
                              product: selectProductList,
                            }));
                            const getProductData = await getProductsByID(
                              selectProductList?.value
                            );
                            const technical_setData = JSON.parse(
                              getProductData?.technical_set_value
                            );
                            const Techids = Object.values(
                              technical_setData
                            ).flatMap(item => item.id);
                            const TableDataList = await productTechParameter(
                              Techids.join(",")
                            );
                            setFormData(prevData => ({
                              ...prevData,
                              tableData: TableDataList,
                            }));
                            setFormData(prevData => ({
                              ...prevData,
                              technical_set_value: technical_setData,
                            }));
                          }}
                          onInputChange={(inputValue, { action }) => {
                            handleInputProductList(inputValue);
                          }}
                          isDisabled={true}
                        />
                      </div>
                    </Col>
                  </Row>
                  {formData?.tableData?.length > 0 &&
                    formData?.tableData.map((items, index) => {
                      const itemType = items.types[0];
                      const labelId = `${itemType}-${index}`;
                      const commonPropsupper = {
                        value:
                          formData?.technical_set_value[labelId]?.upper_limit ??
                          items?.upper_limits[0],
                        onChange: event => {
                          const value = event.target?.value ?? event;
                          handleInputChangeParameter(
                            "technical_set_value",
                            labelId,
                            {
                              id: items?.items[0]?.id,
                              type: items?.types[0],
                              label: items?.values[0],
                              upper_limit: value,
                              lower_limit: items?.lower_limits[0],
                            }
                          );
                        },
                      };
                      const commonPropslower = {
                        value:
                          formData?.technical_set_value[labelId]?.lower_limit ??
                          items?.lower_limits[0],
                        onChange: event => {
                          const value = event.target?.value ?? event;
                          handleInputChangeParameter(
                            "technical_set_value",
                            labelId,
                            {
                              id: items?.items[0]?.id,
                              type: items?.types[0],
                              label: items?.values[0],
                              upper_limit: items?.upper_limits[0],
                              lower_limit: value,
                            }
                          );
                        },
                      };
                      const commonProps = {
                        value:
                          formData?.technical_set_value[labelId]?.label ??
                          items?.values[0],
                        onChange: event => {
                          const value = event.target?.value ?? event;
                          handleInputChangeParameter(
                            "technical_set_value",
                            labelId,
                            {
                              id: items?.items[0]?.id,
                              type: items?.types[0],
                              label: value,
                              upper_limit: items?.upper_limits[0],
                              lower_limit: items?.lower_limits[0],
                            }
                          );
                        },
                      };
                      const renderInputField = () => {
                        switch (itemType) {
                          case "datebox":
                            return (
                              <Row>
                                <Col md={12} className="mb-3">
                                  <Flatpickr
                                    placeholder="dd M, yyyy"
                                    options={{
                                      altInput: true,
                                      altFormat: "j F, Y",
                                      dateFormat: "Y-m-d",
                                    }}
                                    onChange={selectedDates => {
                                      handleInputChangeParameter(
                                        "technical_set_value",
                                        labelId,
                                        {
                                          id: items?.items[0]?.id,
                                          type: items?.types[0],
                                          label: moment(
                                            selectedDates[0]
                                          ).format("DD/MM/YYYY"),
                                          upper_limit: items?.upper_limits[0],
                                          lower_limit: items?.lower_limits[0],
                                        }
                                      );
                                    }}
                                    value={moment(
                                      commonProps.value,
                                      "DD/MM/YYYY"
                                    ).toDate()}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Upper Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="upper_limit"
                                    className={`form-control ${formErrors.upper_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropsupper}
                                  />
                                </Col>

                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Lower Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="lower_limit"
                                    className={`form-control ${formErrors.lower_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropslower}
                                  />
                                </Col>
                              </Row>
                            );
                          case "textfield":
                            return (
                              <Row>
                                <Col md={12} className="mb-3">
                                  <Input
                                    type="text"
                                    id={`textfield-${index}`}
                                    name={`textfield-${index}`}
                                    {...commonProps}
                                    placeholder="Please Enter Text Field"
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Upper Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="upper_limit"
                                    className={`form-control ${formErrors.upper_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropsupper}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Lower Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="lower_limit"
                                    className={`form-control ${formErrors.lower_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropslower}
                                  />
                                </Col>
                              </Row>
                            );
                          case "dropdown":
                            return (
                              <Row>
                                <Col md={12} className="mb-3">
                                  <Select
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    options={items?.items}
                                    value={
                                      formData?.technical_set_value[labelId] ==
                                        null
                                        ? items?.values[0]
                                        : formData?.technical_set_value[labelId]
                                          ?.dropdown
                                    }
                                    onChange={selectedSet => {
                                      handleInputChangeParameter(
                                        "technical_set_value",
                                        labelId,
                                        {
                                          id: items?.items[0]?.id,
                                          type: items?.types[0],
                                          dropdown: selectedSet,
                                          upper_limit:
                                            formData?.technical_set_value[
                                              labelId
                                            ]?.upper_limit ??
                                            items?.upper_limits[0],
                                          lower_limit:
                                            formData?.technical_set_value[
                                              labelId
                                            ]?.lower_limit ??
                                            items?.lower_limits[0],
                                        }
                                      );
                                    }}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Upper Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="upper_limit"
                                    className={`form-control ${formErrors.upper_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    value={
                                      formData?.technical_set_value[labelId]
                                        ?.upper_limit ?? items?.upper_limits[0]
                                    }
                                    onChange={event => {
                                      const value =
                                        event.target?.value ?? event;
                                      handleInputChangeParameter(
                                        "technical_set_value",
                                        labelId,
                                        {
                                          id: items?.items[0]?.id,
                                          type: items?.types[0],
                                          dropdown: items?.dropdown,
                                          upper_limit: value,
                                          lower_limit:
                                            formData?.technical_set_value[
                                              labelId
                                            ]?.lower_limit ??
                                            items?.lower_limits[0],
                                        }
                                      );
                                    }}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Lower Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="lower_limit"
                                    className={`form-control ${formErrors.lower_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    value={
                                      formData?.technical_set_value[labelId]
                                        ?.lower_limit ?? items?.lower_limits[0]
                                    }
                                    onChange={event => {
                                      const value =
                                        event.target?.value ?? event;
                                      handleInputChangeParameter(
                                        "technical_set_value",
                                        labelId,
                                        {
                                          id: items?.items[0]?.id,
                                          type: items?.types[0],
                                          dropdown: items?.dropdown,
                                          upper_limit:
                                            formData?.technical_set_value[
                                              labelId
                                            ]?.upper_limit ??
                                            items?.upper_limits[0],
                                          lower_limit: value,
                                        }
                                      );
                                    }}
                                  />
                                </Col>
                              </Row>
                            );
                          case "textarea":
                            return (
                              <Row>
                                <Col md={12} className="mb-3">
                                  <Input
                                    type="textarea"
                                    id={`textarea-${index}`}
                                    name={`textarea-${index}`}
                                    {...commonProps}
                                    rows="1"
                                    placeholder="Please Enter Text Area"
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Upper Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="upper_limit"
                                    className={`form-control ${formErrors.upper_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropsupper}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Lower Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="lower_limit"
                                    className={`form-control ${formErrors.lower_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropslower}
                                  />
                                </Col>
                              </Row>
                            );
                          case "dateTime":
                            return (
                              <Row>
                                <Col md={12} className="mb-3">
                                  <Flatpickr
                                    placeholder="dd M, yyyy HH:mm"
                                    options={{
                                      altInput: true,
                                      altFormat: "j F, Y h:i K",
                                      dateFormat: "Y-m-d h:i K",
                                      enableTime: true,
                                      time_24hr: false,
                                    }}
                                    onChange={selectedDates => {
                                      handleInputChangeParameter(
                                        "technical_set_value",
                                        labelId,
                                        {
                                          id: items?.items[0]?.id,
                                          type: items?.types[0],
                                          label: moment(
                                            selectedDates[0]
                                          ).format("DD/MM/YYYY hh:mm A"),
                                          upper_limit: items?.upper_limits[0],
                                          lower_limit: items?.lower_limits[0],
                                        }
                                      );
                                    }}
                                    value={moment(
                                      commonProps.value,
                                      "DD/MM/YYYY hh:mm A"
                                    ).toDate()}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Upper Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="upper_limit"
                                    className={`form-control ${formErrors.upper_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropsupper}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Lower Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="lower_limit"
                                    className={`form-control ${formErrors.lower_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropslower}
                                  />
                                </Col>
                              </Row>
                            );
                          case "timebox":
                            return (
                              <Row>
                                <Col md={12} className="mb-3">
                                  {" "}
                                  <Flatpickr
                                    placeholder="HH:mm"
                                    options={{
                                      enableTime: true,
                                      noCalendar: true,
                                      dateFormat: "h:i K",
                                      altFormat: "h:i K",
                                      time_24hr: false,
                                    }}
                                    onChange={selectedDates => {
                                      handleInputChangeParameter(
                                        "technical_set_value",
                                        labelId,
                                        {
                                          id: items?.items[0]?.id,
                                          type: items?.types[0],
                                          label: moment(
                                            selectedDates[0]
                                          ).format("hh:mm A"),
                                          upper_limit: items?.upper_limits[0],
                                          lower_limit: items?.lower_limits[0],
                                        }
                                      );
                                    }}
                                    value={moment(
                                      commonProps.value,
                                      "hh:mm A"
                                    ).toDate()}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Upper Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="upper_limit"
                                    className={`form-control ${formErrors.upper_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropsupper}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Lower Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="lower_limit"
                                    className={`form-control ${formErrors.lower_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropslower}
                                  />
                                </Col>
                              </Row>
                            );
                          case "urlbox":
                            return (
                              <Row>
                                <Col md={12} className="mb-3">
                                  <Input
                                    type="text"
                                    id="urlbox"
                                    name="urlbox"
                                    {...commonProps}
                                    placeholder="Please Enter Url"
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Upper Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="upper_limit"
                                    className={`form-control ${formErrors.upper_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropsupper}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Lower Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="lower_limit"
                                    className={`form-control ${formErrors.lower_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropslower}
                                  />
                                </Col>
                              </Row>
                            );
                          case "emailbox":
                            return (
                              <Row>
                                <Col md={12} className="mb-3">
                                  <Input
                                    type="email"
                                    id="emailbox"
                                    name="emailbox"
                                    {...commonProps}
                                    placeholder="Please Enter Email"
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Upper Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="upper_limit"
                                    className={`form-control ${formErrors.upper_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropsupper}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Lower Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="lower_limit"
                                    className={`form-control ${formErrors.lower_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropslower}
                                  />
                                </Col>
                              </Row>
                            );
                          case "colorbox":
                            return (
                              <Row>
                                <Col md={12} className="mb-3">
                                  <Input
                                    type="color"
                                    id="colorbox"
                                    name="colorbox"
                                    {...commonProps}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Upper Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="upper_limit"
                                    className={`form-control ${formErrors.upper_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropsupper}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Lower Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="lower_limit"
                                    className={`form-control ${formErrors.lower_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropslower}
                                  />
                                </Col>
                              </Row>
                            );
                          case "numberbox":
                            return (
                              <Row>
                                <Col md={12} className="mb-3">
                                  <Input
                                    type="number"
                                    id="numberbox"
                                    name="numberbox"
                                    {...commonProps}
                                    placeholder="Please Enter Number"
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Upper Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="upper_limit"
                                    className={`form-control ${formErrors.upper_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropsupper}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Lower Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="lower_limit"
                                    className={`form-control ${formErrors.lower_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    {...commonPropslower}
                                  />
                                </Col>
                              </Row>
                            );
                          case "multipleselect":
                            return (
                              <Row>
                                <Col md={12} className="mb-3">
                                  {" "}
                                  <Select
                                    isMulti
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    options={items?.items}
                                    value={
                                      formData?.technical_set_value[labelId] ==
                                        null
                                        ? items?.values[0]
                                        : formData?.technical_set_value[labelId]
                                          ?.multipleselect
                                    }
                                    onChange={selectedSet => {
                                      handleInputChangeParameter(
                                        "technical_set_value",
                                        labelId,
                                        {
                                          id: items?.items[0]?.id,
                                          type: items?.types[0],
                                          default_value:
                                            selectedSet[0]?.default_value,
                                          multipleselect: selectedSet,
                                          upper_limit:
                                            formData?.technical_set_value[
                                              labelId
                                            ]?.upper_limit ??
                                            items?.upper_limits[0],
                                          lower_limit:
                                            formData?.technical_set_value[
                                              labelId
                                            ]?.lower_limit ??
                                            items?.lower_limits[0],
                                        }
                                      );
                                    }}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Upper Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="upper_limit"
                                    className={`form-control ${formErrors.upper_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    value={
                                      formData?.technical_set_value[labelId]
                                        ?.upper_limit ?? items?.upper_limits[0]
                                    }
                                    onChange={event => {
                                      const value =
                                        event.target?.value ?? event;
                                      handleInputChangeParameter(
                                        "technical_set_value",
                                        labelId,
                                        {
                                          id: items?.items[0]?.id,
                                          type: items?.types[0],
                                          multipleselect: items?.multipleselect,
                                          upper_limit: value,
                                          lower_limit:
                                            formData?.technical_set_value[
                                              labelId
                                            ]?.lower_limit ??
                                            items?.lower_limits[0],
                                        }
                                      );
                                    }}
                                  />
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Label htmlFor="formrow-state-Input">
                                    Lower Limit
                                  </Label>
                                  <Input
                                    type="Number"
                                    name="lower_limit"
                                    className={`form-control ${formErrors.lower_limit ? "is-invalid" : ""
                                      }`}
                                    id="formrow-state-Input"
                                    value={
                                      formData?.technical_set_value[labelId]
                                        ?.lower_limit ?? items?.lower_limits[0]
                                    }
                                    onChange={event => {
                                      const value =
                                        event.target?.value ?? event;
                                      handleInputChangeParameter(
                                        "technical_set_value",
                                        labelId,
                                        {
                                          id: items?.items[0]?.id,
                                          type: items?.types[0],
                                          multipleselect: items?.multipleselect,
                                          upper_limit:
                                            formData?.technical_set_value[
                                              labelId
                                            ]?.upper_limit ??
                                            items?.upper_limits[0],
                                          lower_limit: value,
                                        }
                                      );
                                    }}
                                  />
                                </Col>
                              </Row>
                            );
                          default:
                            return null;
                        }
                      };
                      return (
                        <Col key={index} md={12} className="mb-3">
                          <Label htmlFor={`${itemType}-${index}`}>
                            {items?.labels[0]}
                          </Label>
                          {renderInputField()}
                          {formErrors?.[`${itemType}-${index}`] && (
                            <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                              {formErrors?.[`${itemType}-${index}`]}
                            </div>
                          )}
                        </Col>
                      );
                    })}

                  <Col md={12} className="mb-3">
                    <Label htmlFor="formrow-state-Input">Notes</Label>
                    <Input
                      type="textarea"
                      name="notes"
                      className={`form-control ${formErrors.notes ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Notes"
                      value={formData?.notes}
                      onChange={e => {
                        setFormData(prevData => ({
                          ...prevData,
                          notes: e.target.value,
                        }));
                        setFormErrors(prevErrors => ({
                          ...prevErrors,
                          notes: "",
                        }));
                      }}
                    />
                    {formErrors.notes && (
                      <div className="invalid-feedback">{formErrors.notes}</div>
                    )}
                  </Col>
                  <Row>
                    <Col md={6} className="mb-3 d-flex justify-content-end">
                      <Button
                        onClick={() => {
                          handleSubmit("Save");
                        }}
                        color="secondary"
                        type="button"
                        className="btn btn-secondary w-100"
                      >
                        Save
                      </Button>
                    </Col>
                    <Col md={6} className="mb-3 d-flex justify-content-start">
                      <Button
                        //color="primary"
                        onClick={() => {
                          handleSubmit("Submit");
                        }}
                        className="btn-custom-theme w-100"
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </ModalBody>
          </Modal>
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
                          <span className="number">1</span> Quotation
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
                          <span className="number">2</span> PO
                        </a>
                      </li>
                      {/* <li
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
                          <span className="number">3</span> Invoices
                        </a>
                      </li> */}
                    </ul>
                  </div>
                </div>
                {activeTab === 1 && (
                  <div className="wizard clearfix mt-1">
                    <div className="steps clearfix">
                      <ul className="nav nav-tabs nav-justified">
                        <li
                          className={classnames({
                            current: activeSubTab === 1,
                          })}
                        >
                          <a
                            style={{
                              fontWeight:
                                activeSubTab === 1 ? "bold" : "normal",
                              textAlign: "center",
                            }}
                            className={classnames({
                              active: activeSubTab === 1,
                            })}
                            onClick={() => {
                              toggleSubTab(1);
                            }}
                          >
                            <span className="number">1</span> Pending
                          </a>
                        </li>
                        <li
                          className={classnames({
                            current: activeSubTab === 2,
                          })}
                        >
                          <a
                            style={{
                              fontWeight:
                                activeSubTab === 2 ? "bold" : "normal",
                              textAlign: "center",
                            }}
                            className={classnames({
                              active: activeSubTab === 2,
                            })}
                            onClick={() => {
                              toggleSubTab(2);
                            }}
                          >
                            <span className="number">2</span>Waiting For
                            Approval
                          </a>
                        </li>
                        <li
                          className={classnames({
                            current: activeSubTab === 3,
                          })}
                        >
                          <a
                            style={{
                              fontWeight:
                                activeSubTab === 3 ? "bold" : "normal",
                              textAlign: "center",
                            }}
                            className={classnames({
                              active: activeSubTab === 3,
                            })}
                            onClick={() => {
                              toggleSubTab(3);
                            }}
                          >
                            <span className="number">3</span> Rejected
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </Card>
          <TableContainer
            columns={columns}
            data={
              activeTab === 1
                ? activeSubTab === 1
                  ? vendorDashboard?.pendingQuotation || []
                  : activeSubTab === 2
                    ? vendorDashboard?.waitingQuotation || []
                    : activeSubTab === 3
                      ? vendorDashboard?.rejectedQuotation || []
                      : []
                : activeTab === 2  ? vendorDashboard?.poQuotationList 
                : allData
            } 
            buttonSizes={
              {
                ASN: "2"
              }
            }
            isGlobalFilter={true}
            isAddOptions={true}
            handleCheckboxChange={handleCheckboxChange}
            showASNButton={activeTab === 2}
            handleASNClick={handleASNClick}
            selectPoStatus={selectPoStatus}
            handlePoStatusChange={handlePoStatusChange}
            customPageSize={10}
            className="custom-header-css"
            selectedRows={selectedRows}
            showPoStatus={activeTab === 2}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default VendorDetail;
