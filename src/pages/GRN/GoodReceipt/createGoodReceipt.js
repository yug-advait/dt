import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CardTitle,
  Col,
  InputGroup,
  FormGroup,
  Input,
  Form,
  Label,
  Row,
  Alert,
  Table,
} from "reactstrap";
import Select from "react-select";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import "flatpickr/dist/themes/material_blue.css";
import { getSelectData } from "helpers/Api/api_common";
import { getGrnDocTypeById } from "helpers/Api/api_grnDocType";
import { getGateEntry } from "helpers/Api/api_gateEntry";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import { ADD_GOODRECEIPT_REQUEST } from "../../../store/goodReceipt/actionTypes";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const createGoodReceipt = () => {
  // Custom Styles
  const customStyles = {
    control: provided => ({
      ...provided,
      minHeight: "27px",
      height: "27px",
      fontSize: "0.875rem",
      padding: "0.25rem 0.5rem",
    }),

    valueContainer: provided => ({
      ...provided,
      padding: "0 0.5rem",
    }),

    input: provided => ({
      ...provided,
      margin: "0",
      padding: "0",
    }),

    indicatorSeparator: provided => ({
      ...provided,
      display: "none",
    }),

    dropdownIndicator: provided => ({
      ...provided,
      padding: "0",
    }),
  };

  const customFlatPickerStyles = {
    height: "27px",
    padding: "0.25rem, 0.5rem",
    fontSize: "0.875rem",
  };
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const today = new Date();
  const [userData, setUserdata] = useState();
  const todayDate = moment(today).format("Do MMMM YYYY, h:mm:ss A");
  const history = useHistory();
  const location = useLocation();
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [grnPermission, setGrnPermission] = useState();
  const [optionDropDownItems, setOptionDropDownItems] = useState([]);
  const [selectGRNDocType, setSelectedGRNDocType] = useState({});
  const [optionPODocType, setOptionPODocType] = useState([]);
  const [originalASNLineItemList, setOriginalASNLineItemList] = useState([]);
  const [ASNLineItemList, setASNLineItemList] = useState([]);
  const { addGoodReceipt } = useSelector(state => state.goodreceipt);
  const [selectedASNValues, setselectedASNValues] = useState([]);
  const [optionProductPlant, setOptionProductPlant] = useState([]);
  const [optionProductLocation, setOptionProductLocation] = useState([]);

  useEffect(() => {
    if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
      const instance = flatpickrRef.current.flatpickr;
      if (instance.altInput) {
        instance.altInput.style.borderColor = formErrors.grn_date
          ? "red"
          : "#ced4da";
      }
    }
  }, [formErrors.grn_date]);

  const dropdownList = async () => {
    var selectedRows = [];
    if (location.state && location.state?.LineItem.length > 0) {
      selectedRows = location?.state?.LineItem;
    } else {
      const getInboundListData = await getGateEntry();
      selectedRows = getInboundListData?.gateInList;
    }
    const uniquePrNos = new Set();
    const uniqueRows = selectedRows.filter(row => {
      if (!uniquePrNos.has(row.asn_no)) {
        uniquePrNos.add(row.asn_no);
        return true;
      }
      return false;
    });
    // Map unique rows to the desired options format
    const options = uniqueRows.map(row => ({
      value: row.id,
      label: row.asn_no,
    }));
    setOptionDropDownItems(options);
    setselectedASNValues(options);
    setFormData(prevData => ({
      ...prevData,
      asn_no: options,
    }));
    const selectedRowsData = selectedRows.map((item, index) => {
      setFormData(prevData => ({
        ...prevData,
        vendor_prod_description: item?.vendor_code?.legal_entity_name,
      }));
      setFormData(prevData => ({
        ...prevData,
        vendor_code: item?.vendor_code,
      }));
      return {
        id: item?.id,
        asn_grn_line_id: item?.asn_grn_line_id,
        po_line_item_id: item?.po_line_item_id,
        asn_no: item?.asn_no,
        asn_id: item?.asn_grn_id,
        asn_line_item: item?.del_line_item,
        del_line_item: 10 * (index + 1),
        product_id: item?.product_id,
        product_group_id: item?.product_group_id,
        product_description: item?.product_description,
        vendor_prod_description: item?.vendor_code?.legal_entity_name,
        grn_quantity: "",
        delivery_quantity: item?.delivery_quantity,
        putaway_quantity: item?.putaway_quantity,
        open_delivery_quantity: item?.open_delivery_quantity,
        sequence_no: "",
        uom: item?.uom,
        delivery_gr_date: moment(item?.delivery_gr_date).format("DD/MM/YYYY"),
        product_code: item?.product_code,
        location: item?.location_code,
        warehouse: item?.warehouse_code,
        batch_count: item?.batch_numbers.length,
        batch_numbers: item?.batch_numbers,
      };
    });
    setASNLineItemList(selectedRowsData);

    const selectDocTypeData = await getSelectData(
      "grn_doc_type",
      "",
      "grn_doc_type_master"
    );
    setOptionPODocType(selectDocTypeData?.getDataByColNameData);

    const selectPlantData = await getSelectData(
      "plant_code",
      "",
      "warehouse_master"
    );
    setOptionProductPlant(selectPlantData?.getDataByColNameData);

    const selectLocationData = await getSelectData("code", "", "location_code");
    setOptionProductLocation(selectLocationData?.getDataByColNameData);
  };

  const selectedLabels = selectedASNValues.map(item => item.label);
  const asnFilteredItems = ASNLineItemList.filter(item =>
    selectedLabels.includes(item.asn_no)
  );

  const handleShowModal = data => {
    setShowModal(true);
    setBatches(data?.batch_numbers);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setBatches([]);
    setErrors(prevErrors => ({
      ...prevErrors,
      ["batch_split"]: "",
    }));
  };

  const validateField = (fieldName, value) => {
    let error = value ? null : true; // Set error to true if value is empty
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleError = (idx, field, message) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${field}-${idx}`]: message,
    }));
  };

  const ASNNumber = formData?.asn_no == undefined ? [] : formData?.asn_no;
  const Asnlabels = ASNNumber.map(po => po.label);

  const handleInputChange = (index, fieldName, value) => {
    const newLineItems = [...ASNLineItemList];
    newLineItems[index][fieldName] = value;
    setASNLineItemList(newLineItems);
    validateField(`${fieldName}-${index}`, value);
  };

  function createSeries(...numbers) {
    const formattedNumbers = numbers.map(num =>
      num.toString().padStart(10, "0")
    );
    const seriesString = formattedNumbers.join(", ");
    return seriesString;
  }

  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };

  useEffect(() => {
    dropdownList();
    const userData = getUserData();
    setUserdata(userData?.user);
    var permissions = userData?.permissionList.filter(
      permission => permission.sub_menu_name === "grn"
    );
    setGrnPermission(
      permissions.find(permission => permission.sub_menu_name === "grn")
    );
    if (addGoodReceipt?.success === true) {
      // setLoading(false);
      setToast(true);
      setToastMessage(addGoodReceipt?.message);
      setTimeout(() => {
        setLoading(false);
        setToast(false);
        history.push({
          pathname: "/grn/good_receipt",
          state: { activeTab: 1 },
        });
      }, 1000);
    } else {
      setLoading(false);
      if (addGoodReceipt?.success !== undefined && addGoodReceipt?.message) {
        setToast(true);
        setToastMessage(addGoodReceipt.message);
      }
      setTimeout(() => {
        setToast(false);
      }, 2000);
    }
  }, [addGoodReceipt]);

  useEffect(() => {
    if (ASNLineItemList.length > 0 && originalASNLineItemList.length === 0) {
      setOriginalASNLineItemList([...ASNLineItemList]);
    }
  }, [ASNLineItemList]);

  const handleInputGRNDocChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectDocTypeData = await getSelectData(
          "grn_doc_type",
          inputValue,
          "grn_doc_type_master"
        );
        setOptionPODocType(selectDocTypeData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const validateForm = () => {
    const errorsdata = {};
    let isValid = true;
    if (!formData.grn_doc_type_id) {
      errorsdata.grn_doc_type_id = true; // Error flag instead of "*"
      isValid = false;
    }
    if (!formData.grn_no) {
      errorsdata.grn_no = true;
      isValid = false;
    }
    if (!formData.delivery_no) {
      errorsdata.delivery_no = true;
      isValid = false;
    }
    if (!formData.vendor_code) {
      errorsdata.vendor_code = true;
      isValid = false;
    }
    if (Asnlabels.length === 0) {
      errorsdata.asn_no = true;
      isValid = false;
    }
    if (!formData.grn_doc_type_desc) {
      errorsdata.grn_doc_type_desc = true;
      isValid = false;
    }
    if (!formData.vendor_prod_description) {
      errorsdata.vendor_prod_description = true;
      isValid = false;
    }
    if (!formData.grn_date) {
      errorsdata.grn_date = "*";
      // errorsdata.grn_date = "DOC Date is required";
    }

    if (selectedASNValues.length === 0) {
      errorsdata.approved_asns = true;
      isValid = false;
    } else {
      ASNLineItemList.forEach((item, index) => {
        Object.keys(item).forEach((fieldName) => {
          if (`grn_quantity-${index}` === `${fieldName}-${index}`) {
            if (item[fieldName] === "" || item[fieldName] < 0 || item[fieldName] === false) {
              validateField(`${fieldName}-${index}`, item[fieldName]);
              isValid = false;
            }
          }
        });
      });
    }
    setFormErrors(errorsdata);
    if (isValid) {
      // Save form data
      return Object.keys(errorsdata).length === 0;
    } else {
      return isValid;
    }
  };
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const Data = {
      formData,
      asnFilteredItems,
    };
    dispatch({
      type: ADD_GOODRECEIPT_REQUEST,
      payload: Data,
    });
  };

  const handleCancel = () => {
    history.push({
      pathname: "/grn/good_receipt",
      state: { activeTab: 1 },
    });
  };

  const flatpickrRef = useRef(null);
  document.title = "Detergent | Create GRN";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          {/* Toast  */}
          {toast && (
            <div
              className="position-fixed top-0 end-0 p-3"
              style={{ zIndex: "1005" }}
            >
              <Alert
                color={addGoodReceipt?.success ? "success" : "danger"}
                role="alert"
              >
                {toastMessage}
              </Alert>
            </div>
          )}

          {/* BreadCrumbs */}
          <Breadcrumbs
            titlePath="/grn/good_receipt"
            title="Good Receipt"
            breadcrumbItem="Good Receipt"
          />

          {/*Headers and Line Item */}
          {loading ? (
            <Loader />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <Col xs="12">
                      <Row data-repeater-item>
                        {/* PO Document Type */}
                        <Col md="2" className="mb-2">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                GRN Doc. Type
                              </Label>
                              {formErrors.grn_doc_type_id && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.grn_doc_type_id}
                                </div>
                              )}
                            </div>

                            <Select
                              styles={{
                                ...customStyles,
                                control: provided => ({
                                  ...provided,
                                  borderColor: formErrors.grn_doc_type_id
                                    ? "#f46a6a"
                                    : provided.borderColor, // Red border for errors
                                }),
                              }}
                              value={selectGRNDocType}
                              options={optionPODocType}
                              onChange={async selectGRNDocType => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  grn_doc_type_id: selectGRNDocType?.value,
                                }));
                                setSelectedGRNDocType(selectGRNDocType);
                                const getGrnDocTypeData =
                                  await getGrnDocTypeById(
                                    selectGRNDocType?.value
                                  );
                                setFormData(prevData => ({
                                  ...prevData,
                                  grn_doc_type_desc:
                                    getGrnDocTypeData?.grn_doctype_description,
                                }));
                                setFormData(prevData => ({
                                  ...prevData,
                                  delivery_no:
                                    getGrnDocTypeData?.number_status == null
                                      ? getGrnDocTypeData?.from_number
                                      : getGrnDocTypeData?.grn_doc_type ===
                                        "GBPO"
                                        ? createSeries(
                                          Number(
                                            getGrnDocTypeData?.number_status
                                          ) + 1
                                        )
                                        : Number(
                                          getGrnDocTypeData?.number_status
                                        ) + 1,
                                }));
                                setFormData(prevData => ({
                                  ...prevData,
                                  grn_no:
                                    getGrnDocTypeData?.number_status == null
                                      ? getGrnDocTypeData?.from_number
                                      : getGrnDocTypeData?.grn_doc_type ===
                                        "GBPO"
                                        ? createSeries(
                                          Number(
                                            getGrnDocTypeData?.number_status
                                          ) + 1
                                        )
                                        : Number(
                                          getGrnDocTypeData?.number_status
                                        ) + 1,
                                }));
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputGRNDocChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>

                        <Col md="2" className="mb-1">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="grn_doc_type_desc"
                                style={{ marginRight: "0.5rem" }}
                              >
                                GRN Doc Type Desc.
                              </Label>
                              {formErrors.grn_doc_type_desc && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.grn_doc_type_desc}
                                </div>
                              )}
                            </div>
                            <p>{formData?.grn_doc_type_desc}</p>
                          </div>
                        </Col>

                        <Col md="2" className="mb-1">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Label
                              htmlFor="delivery_no"
                              style={{ marginRight: "0.5rem" }}
                            >
                              Delivery NO.
                            </Label>
                            {formErrors.delivery_no && (
                              <div
                                style={{
                                  color: "#f46a6a",
                                  fontSize: "1.25rem",
                                }}
                              >
                                {formErrors.delivery_no}
                              </div>
                            )}
                          </div>
                          <p>{formData?.delivery_no}</p>
                        </Col>

                        <Col md="2" className="mb-1">
                          <Label htmlFor="asn_no">No(s).</Label>
                          <p>{Asnlabels.join(", ")}</p>
                          {formErrors.asn_no && (
                            <div
                              style={{
                                color: "#f46a6a",
                                fontSize: "80%",
                              }}
                            >
                              {formErrors.asn_no}
                            </div>
                          )}
                        </Col>

                        <Col md="2" className="mb-1">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Label
                              htmlFor="grn_no"
                              style={{ marginRight: "0.5rem" }}
                            >
                              GRN NO.
                            </Label>
                            {formErrors.grn_no && (
                              <div
                                style={{
                                  color: "#f46a6a",
                                  fontSize: "1.25rem",
                                }}
                              >
                                {formErrors.grn_no}
                              </div>
                            )}
                          </div>
                          <div>{formData?.grn_no}</div>
                        </Col>

                        {/* Doc Date */}
                        <Col md="2" className="mb-2">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Doc Date
                              </Label>
                              {/* {formErrors.grn_date && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.grn_date}
                                </div> 
                              )}*/}
                            </div>
                            <FormGroup className="mb-4">
                              <InputGroup>
                                <Flatpickr
                                  ref={flatpickrRef}
                                  placeholder="dd M,yyyy"
                                  options={{
                                    altInput: true,
                                    altFormat: "j F, Y",
                                    dateFormat: "Y-m-d",
                                    minDate: "today",
                                  }}
                                  onReady={(
                                    selectedDates,
                                    dateStr,
                                    instance
                                  ) => {
                                    if (instance.altInput) {
                                      Object.assign(
                                        instance.altInput.style,
                                        customFlatPickerStyles
                                      );
                                    }
                                  }}
                                  onChange={(
                                    selectedDates,
                                    dateStr,
                                    instance
                                  ) => {
                                    setFormData(prevData => ({
                                      ...prevData,
                                      grn_date: moment(selectedDates[0]).format(
                                        "DD/MM/YYYY"
                                      ),
                                    }));
                                  }}
                                  value={moment(
                                    formData?.grn_date,
                                    "DD/MM/YYYY"
                                  ).toDate()}
                                />
                              </InputGroup>
                            </FormGroup>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        {/* Vendor Code */}
                        <Col md="2" className="mb-2">
                          <div className="">
                            <Label htmlFor="formrow-state-Input">
                              Vendor Code
                            </Label>
                            <p>{formData?.vendor_code?.label}</p>
                            {formErrors.vendor_code && (
                              <div
                                style={{
                                  color: "#f46a6a",
                                  fontSize: "80%",
                                }}
                              >
                                {formErrors.vendor_code}
                              </div>
                            )}
                          </div>
                        </Col>

                        <Col md="2" className="mb-1">
                          <Label htmlFor="vendorName">Vendor Description</Label>
                          <p>{formData?.vendor_prod_description}</p>
                          {formErrors.vendor_prod_description && (
                            <div
                              style={{
                                color: "#f46a6a",
                                fontSize: "80%",
                              }}
                            >
                              {formErrors.vendor_prod_description}
                            </div>
                          )}
                        </Col>
                        <Col lg="2" className="mb-2">
                          <Label htmlFor="formrow-state-Input">
                            Requisitioner
                          </Label>
                          <div>
                            <Label>{userData?.first_name}</Label>
                          </div>
                        </Col>
                        <Col lg="2" className="mb-2">
                          <Label htmlFor="formrow-state-Input">
                            Department
                          </Label>
                          <div>
                            <Label>{userData?.department_code}</Label>
                          </div>
                        </Col>
                        <Col md="3" className="mb-1">
                          <Label htmlFor="System_Date/Time">
                            System Date/Time
                          </Label>
                          <div>
                            <Label>{todayDate}</Label>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <CardTitle className="mb-4"></CardTitle>
                        <Col lg="3">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Label>ASNs</Label>
                            {formErrors.approved_asns && (
                              <div
                                className="text-danger"
                                style={{
                                  marginLeft: "0.5rem",
                                  fontSize: "1.25rem",
                                }}
                              >
                                {formErrors.approved_asns}
                              </div>
                            )}
                          </div>
                          <Select
                            isMulti
                            multiple
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={selectedASNValues}
                            options={optionDropDownItems}
                            onChange={async selectedASNValues => {
                              setselectedASNValues(selectedASNValues);
                              setFormData(prevData => ({
                                ...prevData,
                                asn_no: selectedASNValues,
                              }));
                              const selectedLabels = selectedASNValues.map(
                                item => item.label
                              );
                              const asnFilteredItems = originalASNLineItemList.filter(item =>
                                selectedLabels.includes(item.asn_no)
                              );
                              setASNLineItemList(asnFilteredItems);
                            }}
                            styles={{
                              control: provided => ({
                                ...provided,
                                borderColor: formErrors.approved_asns
                                  ? "#f46a6a"
                                  : provided.borderColor, // Red border for errors
                              }),
                            }}
                          ></Select>
                        </Col>
                      </Row>

                      {/* Selected ASN Request Line Items*/}
                      <CardTitle className="mb-4"></CardTitle>
                      <Row>
                        <Col lg="12">
                          <Table style={{ width: "100%" }}>
                            <tbody>
                              {asnFilteredItems.map((item, idx) => (
                                <tr
                                  style={{
                                    borderBottom:
                                      idx < asnFilteredItems.length - 1
                                        ? "2px #000"
                                        : "none",
                                  }}
                                  id={`addr${idx}`}
                                  key={idx}
                                >
                                  <td>
                                    <Form
                                      className="repeater mt-3"
                                      encType="multipart/form-data"
                                    >
                                      <div data-repeater-list="group-a">
                                        <Row data-repeater-item>
                                          <Col lg="1" className="mb-1">
                                            <div className="">
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {idx === 0 ? (
                                                  <Label
                                                    htmlFor={`del_line_item-${idx}`}
                                                    style={{
                                                      marginRight: "0.5rem",
                                                    }}
                                                  >
                                                    Line No.
                                                  </Label>
                                                ) : (
                                                  ""
                                                )}
                                                {errors[
                                                  `del_line_item-${idx}`
                                                ] && (
                                                    <div
                                                      className="text-danger"
                                                      style={{
                                                        marginLeft: "0.5rem",
                                                        fontSize: "1.25rem",
                                                      }}
                                                    >
                                                      {
                                                        errors[
                                                        `del_line_item-${idx}`
                                                        ]
                                                      }
                                                    </div>
                                                  )}
                                              </div>
                                              <Input
                                                type="number"
                                                value={item.del_line_item}
                                                onChange={e =>
                                                  handleInputChange(
                                                    idx,
                                                    "del_line_item",
                                                    e.target.value
                                                  )
                                                }
                                                id={`del_line_item-${idx}`}
                                                name="del_line_item"
                                                className="form-control-sm"
                                                style={{
                                                  borderColor: errors[
                                                    `del_line_item-${idx}`
                                                  ]
                                                    ? "#f46a6a"
                                                    : undefined, // Red border for errors
                                                }}
                                              />
                                            </div>
                                          </Col>

                                          <Col lg="1" className="mb-1">
                                            {idx === 0 ? (
                                              <Label
                                                htmlFor={`asn_line_item-${idx}`}
                                              >
                                                ASN Line No.
                                              </Label>
                                            ) : (
                                              ""
                                            )}
                                            <p>{item?.asn_line_item}</p>
                                            {errors[`asn_line_item-${idx}`] && (
                                              <div className="text-danger">
                                                {errors[`asn_line_item-${idx}`]}
                                              </div>
                                            )}
                                          </Col>
                                          <Col lg="1" className="mb-1">
                                            {idx === 0 && (
                                              <Label
                                                htmlFor={`sequence_no-${idx}`}
                                              >
                                                Seq. No.
                                              </Label>
                                            )}
                                            <Input
                                              type="number"
                                              value={item.sequence_no || ""}
                                              onChange={e => {
                                                const value = e.target.value;
                                                if (
                                                  value === "" ||
                                                  (Number(value) > 0 &&
                                                    Number.isInteger(
                                                      Number(value)
                                                    ))
                                                ) {
                                                  handleInputChange(
                                                    idx,
                                                    "sequence_no",
                                                    value
                                                  );
                                                }
                                              }}
                                              id={`sequence_no-${idx}`}
                                              className="form-control-sm"
                                              min="1"
                                            />
                                            {errors[`sequence_no-${idx}`] && (
                                              <div className="text-danger">
                                                {errors[`sequence_no-${idx}`]}
                                              </div>
                                            )}
                                          </Col>
                                          <Col lg="1" className="mb-1">
                                            <div className="">
                                              {idx == 0 ? (
                                                <Label htmlFor={`delivery_quantity-${idx}`}>
                                                  Del Qty.
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.delivery_quantity}</p>
                                            </div>
                                          </Col>

                                          <Col lg="1" className="mb-1">
                                            <div className="">
                                              <div style={{ display: "flex", alignItems: "center" }}>
                                                {idx === 0 && (
                                                  <Label htmlFor={`putaway_quantity-${idx}`} style={{ marginRight: "0.5rem" }}>
                                                    Put Qty
                                                  </Label>
                                                )}
                                                {errors[`putaway_quantity-${idx}`] && (
                                                  <div className="text-danger" style={{ fontSize: "1.25rem" }}>
                                                    {errors[`putaway_quantity-${idx}`]}
                                                  </div>
                                                )}
                                              </div>
                                              <Input
                                                type="number"
                                                value={item.putaway_quantity}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  if (
                                                    value === "" ||
                                                    (Number(value) > 0 &&
                                                      Number.isInteger(Number(value)) &&
                                                      Number(value) <= item.delivery_quantity)
                                                  ) {
                                                    handleInputChange(idx, "putaway_quantity", value);
                                                  } else {
                                                    handleError(
                                                      idx,
                                                      "putaway_quantity",
                                                      ``
                                                    );
                                                  }
                                                }}
                                                id={`putaway_quantity-${idx}`}
                                                className="form-control-sm"
                                                min="1"
                                                style={{
                                                  borderColor: errors[`putaway_quantity-${idx}`] ? "#f46a6a" : undefined,
                                                }}
                                              />
                                            </div>
                                          </Col>

                                          <Col lg="2" className="mb-1">
                                            <div className="">
                                              <div style={{ display: "flex", alignItems: "center" }}>
                                                {idx === 0 && (
                                                  <Label htmlFor={`open_delivery_quantity-${idx}`} style={{ marginRight: "0.5rem" }}>
                                                    Open Qty.
                                                  </Label>
                                                )}
                                                {errors[`open_delivery_quantity-${idx}`] && (
                                                  <div className="text-danger" style={{ fontSize: "1.25rem" }}>
                                                    {errors[`open_delivery_quantity-${idx}`]}
                                                  </div>
                                                )}
                                              </div>
                                              <Input
                                                type="number"
                                                value={item.open_delivery_quantity || ""}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  if (
                                                    value === "" ||
                                                    (Number(value) > 0 &&
                                                      Number.isInteger(Number(value)) &&
                                                      Number(value) <= item.delivery_quantity)
                                                  ) {
                                                    handleInputChange(idx, "open_delivery_quantity", value);
                                                  } else {
                                                    handleError(
                                                      idx,
                                                      "open_delivery_quantity",
                                                      ``
                                                    );
                                                  }
                                                }}
                                                id={`open_delivery_quantity-${idx}`}
                                                className="form-control-sm"
                                                min="1"
                                                style={{
                                                  borderColor: errors[`open_delivery_quantity-${idx}`] ? "#f46a6a" : undefined,
                                                }}
                                              />
                                            </div>
                                          </Col>

                                          <Col lg="1" className="mb-1">
                                            <div className="">
                                              <div style={{ display: "flex", alignItems: "center" }}>
                                                {idx === 0 && (
                                                  <Label htmlFor={`grn_quantity-${idx}`} style={{ marginRight: "0.5rem" }}>
                                                    Quantity
                                                  </Label>
                                                )}
                                                {errors[`grn_quantity-${idx}`] && (
                                                  <div className="text-danger" style={{ marginLeft: "0.5rem", fontSize: "1.25rem" }}>
                                                    {errors[`grn_quantity-${idx}`]}
                                                  </div>
                                                )}
                                              </div>
                                              <Input
                                                type="number"
                                                value={item.grn_quantity || ""}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  if (
                                                    value === "" ||
                                                    (Number(value) > 0 &&
                                                      Number.isInteger(Number(value)) &&
                                                      Number(value) <= item.delivery_quantity)
                                                  ) {
                                                    handleInputChange(idx, "grn_quantity", value);
                                                  } else {
                                                    handleError(
                                                      idx,
                                                      "grn_quantity",
                                                      ``
                                                    );
                                                  }
                                                }}
                                                id={`grn_quantity-${idx}`}
                                                className="form-control-sm"
                                                min="1"
                                                style={{
                                                  borderColor: errors[`grn_quantity-${idx}`] ? "#f46a6a" : undefined,
                                                }}
                                              />
                                            </div>
                                          </Col>


                                          <Col lg="1" className="mb-1">
                                            <div className="">
                                              {idx == 0 ? (
                                                <Label htmlFor={`uom-${idx}`}>
                                                  UOM
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.uom?.label}</p>
                                            </div>
                                          </Col>

                                          <Col lg="1" className="mb-1">
                                            {idx === 0 ? (
                                              <Label
                                                htmlFor={`product_code-${idx}`}
                                              >
                                                Prod Code
                                              </Label>
                                            ) : (
                                              ""
                                            )}
                                            <p>{item?.product_code?.label}</p>
                                            {errors[`product_code-${idx}`] && (
                                              <div className="text-danger">
                                                {errors[`product_code-${idx}`]}
                                              </div>
                                            )}
                                          </Col>

                                          <Col lg="2" className="mb-1">
                                            {idx === 0 ? (
                                              <Label
                                                htmlFor={`product_description-${idx}`}
                                              >
                                                Product Des
                                              </Label>
                                            ) : (
                                              ""
                                            )}
                                            <p>{item?.product_description}</p>
                                            {errors[
                                              `product_description-${idx}`
                                            ] && (
                                                <div className="text-danger">
                                                  {
                                                    errors[
                                                    `product_description-${idx}`
                                                    ]
                                                  }
                                                </div>
                                              )}
                                          </Col>
                                          <Col lg="2" className="mb-1">
                                            {idx === 0 ? (
                                              <Label
                                                htmlFor={`batch_count-${idx}`}
                                              >
                                                Batch Information.
                                              </Label>
                                            ) : (
                                              ""
                                            )}
                                            <p>{item?.batch_count}</p>
                                            {item?.batch_count > 0 && (
                                              <div
                                                style={{
                                                  borderRadius: "20px",
                                                  cursor: "pointer",
                                                }}
                                                className="text-success"
                                                onClick={() => {
                                                  handleShowModal(item);
                                                }}
                                              >
                                                <i className="mdi mdi-eye font-size-18" />
                                              </div>
                                            )}
                                            {errors[`batch_count-${idx}`] && (
                                              <div className="text-danger">
                                                {errors[`batch_count-${idx}`]}
                                              </div>
                                            )}
                                          </Col>
                                          <Col lg="1" className="mb-1">
                                            {idx === 0 ? (
                                              <Label
                                                htmlFor={`delivery_gr_date-${idx}`}
                                              >
                                                Del GR Date
                                              </Label>
                                            ) : (
                                              ""
                                            )}
                                            <p>{item?.delivery_gr_date}</p>
                                            {errors[
                                              `delivery_gr_date-${idx}`
                                            ] && (
                                                <div className="text-danger">
                                                  {
                                                    errors[
                                                    `delivery_gr_date-${idx}`
                                                    ]
                                                  }
                                                </div>
                                              )}
                                          </Col>
                                          <Col lg="2" className="mb-3">
                                            <div className="">
                                              {idx == 0 ? (
                                                <Label
                                                  htmlFor={`warehouse-${idx}`}
                                                >
                                                  Plant
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <Select
                                                styles={customStyles}
                                                value={item.warehouse || ""}
                                                options={optionProductPlant}
                                                onChange={selected =>
                                                  handleInputChange(
                                                    idx,
                                                    "warehouse",
                                                    selected
                                                  )
                                                }
                                              />
                                              {errors[`warehouse-${idx}`] && (
                                                <div className="text-danger">
                                                  {errors[`warehouse-${idx}`]}
                                                </div>
                                              )}
                                            </div>
                                          </Col>
                                          <Col lg="2" className="mb-3">
                                            <div className="">
                                              {idx == 0 ? (
                                                <Label
                                                  htmlFor={`location-${idx}`}
                                                >
                                                  Location
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <Select
                                                styles={customStyles}
                                                value={item.location || ""}
                                                options={optionProductLocation}
                                                onChange={selected =>
                                                  handleInputChange(
                                                    idx,
                                                    "location",
                                                    selected
                                                  )
                                                }
                                              />
                                              {errors[`location-${idx}`] && (
                                                <div className="text-danger">
                                                  {errors[`location-${idx}`]}
                                                </div>
                                              )}
                                            </div>
                                          </Col>
                                        </Row>
                                      </div>
                                    </Form>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                      {/* Plus Button */}
                      <Modal
                        isOpen={showModal}
                        toggle={handleCloseModal}
                        centered
                      >
                        <ModalHeader toggle={handleCloseModal}>
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
                                  <Label for={`batch_qty-${index}`}>
                                    Quantity
                                  </Label>
                                  <div>{batch.batch_qty}</div>
                                </FormGroup>
                              </Col>
                              <Col md="3">
                                <FormGroup>
                                  <Label>Serial No.</Label>
                                  {batch.serialNumbers
                                    .split(",")
                                    .map((serialNumber, serialIndex) => (
                                      <div key={serialIndex}>
                                        {serialNumber}
                                      </div>
                                    ))}
                                </FormGroup>
                              </Col>
                            </Row>
                          ))}
                        </ModalBody>
                        <ModalFooter>
                          <Button color="danger" onClick={handleCloseModal}>
                            Close
                          </Button>
                        </ModalFooter>
                      </Modal>
                    </Col>
                  </CardBody>
                  <CardTitle className="mb-4"></CardTitle>
                  <Col xs="12">
                    <Row data-repeater-item>
                      <Col lg="5" className="mb-5"></Col>
                      <Col lg="1" className="mb-1">
                        {grnPermission && grnPermission?.can_add && (
                          <Button
                            disabled={loading}
                            onClick={() => handleSave()}
                            //color="primary"
                            className="mt-5 mt-lg-2 btn-custom-size"
                          >
                            Save
                          </Button>
                        )}
                      </Col>
                      <Col lg="1" className="mb-1">
                        <Button
                          onClick={() => handleCancel()}
                          color="danger"
                          className="mt-5 mt-lg-2 btn-custom-size"
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col lg="5" className="mb-5"></Col>
                    </Row>
                  </Col>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default createGoodReceipt;
