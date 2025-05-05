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
  UncontrolledTooltip,
  FormGroup,
  Input,
  Form,
  Label,
  Row,
  Alert,
  Table,
} from "reactstrap";
import Select from "react-select";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useHistory, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import "flatpickr/dist/themes/material_blue.css";
import { getSelectData } from "helpers/Api/api_common";
import { getDataBySerialNo } from "helpers/Api/api_asn";
import { GET_ASN_REQUEST } from "../../store/ASN/actionTypes";
import { getAsnDocTypeById } from "helpers/Api/api_asnDocType";
import { getPo } from "helpers/Api/api_po";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import { ADD_ASN_REQUEST } from "../../store/ASN/actionTypes";
import Loader from "../../components/Common/Loader";
import "../../assets/scss/custom/pages/__loader.scss";

const createASN = () => {
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
  const [batchNumber, setBatchNumber] = useState(0);
  const [LineItemData, setLineItemData] = useState(0);
  const [LineItemIndex, setLineItemIndex] = useState(0);
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
  // const [asnPermission, setAsnPermission] = useState();
  const [originalPOLineItemList, setOriginalPOLineItemList] = useState([]);
  const [optionDropDownItems, setOptionDropDownItems] = useState([]);
  const [selectPODocType, setSelectedPODocType] = useState({});
  const [optionPODocType, setOptionPODocType] = useState([]);
  const [POLineItemList, setPOLineItemList] = useState([]);
  const { addAsn } = useSelector(state => state.asn);
  const [selectedPOValues, setSelectedPOValues] = useState([]);
  const [optionProductLocation, setOptionProductLocation] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
      if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
        const instance = flatpickrRef.current.flatpickr;
        if (instance.altInput) {
          instance.altInput.style.borderColor = formErrors.asn_date
            ? "red"
            : "#ced4da";
        }
      }
    }, [formErrors.asn_date]);

  const dropdownList = async () => {
    var selectedRows = [];
    if (location.state && location.state?.LineItem.length > 0) {
      selectedRows = location?.state?.LineItem;
    } else {
      const getPOListData = await getPo();
      selectedRows = getPOListData?.openPoList;
    }
    const uniquePrNos = new Set();
    const uniqueRows = selectedRows.filter(row => {
      if (!uniquePrNos.has(row.po_no)) {
        uniquePrNos.add(row.po_no);
        return true;
      }
      return false;
    });
    // Map unique rows to the desired options format
    const options = uniqueRows.map(row => ({
      value: row.id,
      label: row.po_no,
    }));

    setOptionDropDownItems(options);
    setSelectedPOValues(options);
    setFormData(prevData => ({
      ...prevData,
      po_no: options,
    }));
    const selectedRowsData = selectedRows.map((item, index) => {
      setFormData(prevData => ({
        ...prevData,
        vendor_prod_description: item?.vendor_prod_description,
      }));
      setFormData(prevData => ({
        ...prevData,
        vendor_code: item?.vendor_code,
      }));
      return {
        id: item?.id,
        po_no: item?.po_no,
        po_id: item?.po_id,
        pr_id: item?.pr_id,
        pr_line_item: item?.pr_line_item,
        polineNo: item?.po_line_item,
        del_line_item: 10 * (index + 1),
        product_id: item?.product_id,
        product_group_id: item?.product_group_id,
        product_description: item?.product_description,
        vendor_prod_description: item?.vendor_prod_description,
        eway_bill_no: "",
        eway_bill_date: null,
        user_name: item?.user_name,
        transpotar_name: "",
        vehical_no: "",
        po_quantity: item?.po_quantity,
        delivery_quantity: item?.po_quantity,
        putaway_quantity: item?.po_quantity,
        open_delivery_quantity: item?.po_quantity,
        sequence_no: "",
        uom: item?.uom,
        delivery_gr_date: moment(item?.delivery_date).format("DD/MM/YYYY"),
        product_code: item?.product_code,
        delivery_date: item?.delivery_date,
        location: item?.location_code,
        warehouse: item?.warehouse_code,
        batch_No: false,
        batchNoList: [],
      };
    });
    setPOLineItemList(selectedRowsData);

    const selectDocTypeData = await getSelectData(
      "asn_doc_type",
      "",
      "asn_doc_type_master"
    );
    setOptionPODocType(selectDocTypeData?.getDataByColNameData);

    const selectLocationData = await getSelectData("code", "", "location_code");
    setOptionProductLocation(selectLocationData?.getDataByColNameData);
  };

  const selectedLabels = selectedPOValues.map(item => item.label);
  const poFilteredItems = POLineItemList.filter(item =>
    selectedLabels.includes(item.po_no)
  );
  const handleBatchNumberChange = e => {
    setBatches([]);
    const value = parseInt(e.target.value, 10);
    setBatchNumber(value);
    if (LineItemData?.delivery_quantity >= value) {
      setErrors(prevErrors => ({
        ...prevErrors,
        ["batch_split"]: "",
      }));
      for (var i = 0; i < value; i++) {
        setBatches(prevBatches => [
          ...prevBatches,
          {
            [`batch_number`]: "",
            [`external_batch_number`]: "",
            [`batch_qty`]: 0,
            [`checkbox`]: false,
            serialNumbers: [],
          },
        ]);
      }
    } else {
      setBatches([]);
      setErrors(prevErrors => ({
        ...prevErrors,
        ["batch_split"]: "Batch Split Number is not greater than Delivery Qty",
      }));
    }
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFormData(prevData => ({
      ...prevData,
      supplier_invoice: file,
    }));
  };

  const handleInputChanges = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleCheckboxChange = (index, e, value) => {
    const newBatches = [...batches];
    if (e.target.checked) {
      const newQty = parseInt(value, 10);
      if (newQty > newBatches[index].serialNumbers.length) {
        for (let i = newBatches[index].serialNumbers.length; i < newQty; i++) {
          newBatches[index].serialNumbers.push("");
        }
      } else {
        newBatches[index].serialNumbers = newBatches[index].serialNumbers.slice(
          0,
          newQty
        );
      }
    } else {
      newBatches[index].serialNumbers = [];
    }
    setBatches(newBatches);
  };

  const handleSerialNumberChange = (batchIndex, serialIndex, value) => {
    const newBatches = [...batches];
    newBatches[batchIndex].serialNumbers[serialIndex] = value;
    setBatches(newBatches);
  };

  const handleShowModal = idx => {
    setShowModal(true);
    setBatches(
      poFilteredItems[idx]?.batchNoList?.length > 0
        ? poFilteredItems[idx]?.batchNoList
        : []
    );
    setBatchNumber(
      poFilteredItems[idx]?.batch_No == true
        ? poFilteredItems[idx]?.batch_split
        : 0
    );
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setBatches([]);
    setBatchNumber(0);
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

  const PoNumber = formData?.po_no == undefined ? [] : formData?.po_no;
  const Polabels = PoNumber.map(po => po.label);

  const handleInputChange = (index, fieldName, value) => {
    const newLineItems = [...POLineItemList];
    newLineItems[index][fieldName] = value;
    setPOLineItemList(newLineItems);
    validateField(`${fieldName}-${index}`, value);
  };

  const handleBatchNumberFieldChange = (index, field, value) => {
    const newBatches = [...batches];
    newBatches[index][field] = value;
    setBatches(newBatches);
  };

  const handleRemoveBatch = index => {
    setBatchNumber(Number(batchNumber) - 1);
    const newBatches = [...batches];
    newBatches.splice(index, 1);
    setBatches(newBatches);
  };

  function createSeries(...numbers) {
    // Map each number to a string with leading zeros
    const formattedNumbers = numbers.map(num =>
      num.toString().padStart(10, "0")
    );
    // Join the formatted numbers with a specified separator (e.g., comma)
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
    // var permissions = userData?.permissionList.filter(
    //   permission => permission.sub_menu_name === "asn"
    // );
    // setAsnPermission(
    //   permissions.find(permission => permission.sub_menu_name === "asn")
    // );
    if (addAsn?.success === true) {
      // setLoading(false);
      setToast(true);
      setToastMessage(addAsn?.message);
      dispatch({
        type: GET_ASN_REQUEST,
        payload: [],
      });
      setTimeout(() => {
        setLoading(false);
        setToast(false);
        history.push("/vendor/detail");
      }, 1000);
    } else {
      setLoading(false);
      if (addAsn?.success !== undefined && addAsn?.message) {
        setToast(true);
        setToastMessage(addAsn.message);
      }
      setTimeout(() => {
        setToast(false);
      }, 2000);
    }
  }, [addAsn]);

  useEffect(() => {
    if (POLineItemList.length > 0 && originalPOLineItemList.length === 0) {
      setOriginalPOLineItemList([...POLineItemList]);
    }
  }, [POLineItemList]);

  const handleInputPODocChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectDocTypeData = await getSelectData(
          "asn_doc_type",
          inputValue,
          "asn_doc_type_master"
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
    if (!formData.asn_doc_type_id) {
      errorsdata.asn_doc_type_id = true; // Error flag instead of "*"
      isValid = false;
    }
    if (!formData.asn_no) {
      errorsdata.asn_no = true;
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
    if (!formData.vendor_del_no) {
      errorsdata.vendor_del_no = true;
      isValid = false;
    }
    if (Polabels.length === 0) {
      errorsdata.po_no = true;
      isValid = false;
    }
    if (!formData.asn_doc_type_desc) {
      errorsdata.asn_doc_type_desc = true;
      isValid = false;
    }
    if (!formData.vendor_prod_description) {
      errorsdata.vendor_prod_description = true;
      isValid = false;
    }
    if (!formData.asn_date) {
      errorsdata.asn_date = "*";
    }
    if (!formData.vehical_no) {
      errorsdata.vehical_no = true;
      isValid = false;
    }
    if (!formData.transpotar_name) {
      errorsdata.transpotar_name = true;
      isValid = false;
    }
    if (!selectedFile) {
      errorsdata.supplier_invoice = true;
      isValid = false;
    }

    if (selectedPOValues.length === 0) {
      errorsdata.approved_pos = true;
      isValid = false;
    } else {
      POLineItemList.forEach((item, index) => {
        Object.keys(item).forEach((fieldName) => {
          if (
            [`po_no-${index}`, `polineNo-${index}`, `po_quantity-${index}`].includes(
              `${fieldName}-${index}`
            )
          ) {
            if (
              item[fieldName] === "" ||
              item[fieldName] < 0 ||
              item[fieldName] === false
            ) {
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
      poFilteredItems,
    };

    dispatch({
      type: ADD_ASN_REQUEST,
      payload: Data,
    });
  };

  const handleCancel = () => {
    history.push("/vendor/detail");
  };

  const validateBatchForm = () => {
    let isValid = true;
    if (LineItemData?.delivery_quantity >= batchNumber) {
      setErrors(prevErrors => ({
        ...prevErrors,
        ["batch_split"]: "",
      }));
    } else {
      setBatches([]);
      setErrors(prevErrors => ({
        ...prevErrors,
        ["batch_split"]: "Batch Split Number is not greater than Delivery Qty",
      }));
      isValid = false;
    }
    batches.forEach((item, index) => {
      Object.keys(item).forEach(fieldName => {
        if (
          `batch_number-${index}` === `${fieldName}-${index}` ||
          `batch_qty-${index}` === `${fieldName}-${index}` ||
          `external_batch_number-${index}` === `${fieldName}-${index}`
        ) {
          if (item[fieldName] === "" || item[fieldName] <= 0) {
            setErrors(prevErrors => ({
              ...prevErrors,
              [`${fieldName}-${index}`]: "This field is required",
            }));
            isValid = false;
          } else {
            setErrors(prevErrors => ({
              ...prevErrors,
              [`${fieldName}-${index}`]: "",
            }));
          }
        }
        if (fieldName == "serialNumbers") {
          item[fieldName].forEach(async (serialNumber, serialIndex) => {
            if (
              `serialNumbers-${index}-${serialIndex}` ===
              `${fieldName}-${index}-${serialIndex}`
            ) {
              if (
                errors[`serialNumbers-${index}-${serialIndex}`] ==
                "Serial Number exist"
              ) {
                setErrors(prevErrors => ({
                  ...prevErrors,
                  [`${fieldName}-${index}-${serialIndex}`]:
                    "Serial Number exist",
                }));
                isValid = false;
              } else {
                setErrors(prevErrors => ({
                  ...prevErrors,
                  [`${fieldName}-${index}-${serialIndex}`]: "",
                }));
              }
            }
          });
        }
      });
    });

    const sumBatchQty = batches.reduce((sum, item) => {
      return sum + (item.batch_qty == "" ? 0 : Number(item.batch_qty));
    }, 0);

    if (sumBatchQty > LineItemData?.delivery_quantity) {
      setErrors(prevErrors => ({
        ...prevErrors,
        ["batch_split"]:
          "Number of All Quantity is always equal to Available Quantity",
      }));
      isValid = false;
    }
    return isValid;
  };

  const handleSaveBatch = () => {
    if (!validateBatchForm()) {
      return;
    }
    handleInputChange(LineItemIndex, "batchNoList", batches);
    handleInputChange(LineItemIndex, "batch_No", true);
    handleInputChange(LineItemIndex, "external_batch_number", true);
    handleInputChange(LineItemIndex, "batch_split", batchNumber);
    handleCloseModal();
  };

    const flatpickrRef = useRef(null);
  document.title = "Detergent | Create ASN";
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
                color={addAsn?.success ? "success" : "success"}
                role="alert"
              >
                {toastMessage}
              </Alert>
            </div>
          )}

          {/* BreadCrumbs */}
          <Breadcrumbs
            titlePath="/vendor/detail"
            title="Vendor Dashboard"
            breadcrumbItem="Create ASN"
          />

          {/* ASN Headers and Line Item */}
          {loading ? (
            <Loader />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <Col xs="12">
                      <Row data-repeater-item>
                        <Col md="2" className="mb-2">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                ASN Doc. Type
                              </Label>
                              {formErrors.asn_doc_type_id && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.asn_doc_type_id}
                                </div>
                              )}
                            </div>

                            <Select
                              styles={{
                                ...customStyles,
                                control: provided => ({
                                  ...provided,
                                  borderColor: formErrors.asn_doc_type_id
                                    ? "#f46a6a"
                                    : provided.borderColor, // Red border for errors
                                }),
                              }}
                              value={selectPODocType}
                              options={optionPODocType}
                              onChange={async selectPODocType => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  asn_doc_type_id: selectPODocType?.value,
                                }));
                                setSelectedPODocType(selectPODocType);
                                const getAsnDocTypeData =
                                  await getAsnDocTypeById(
                                    selectPODocType?.value
                                  );
                                setFormData(prevData => ({
                                  ...prevData,
                                  asn_doc_type_desc:
                                    getAsnDocTypeData?.po_doc_type_description
                                      ?.label,
                                }));
                                setFormData(prevData => ({
                                  ...prevData,
                                  delivery_no:
                                    getAsnDocTypeData?.number_status == null
                                      ? getAsnDocTypeData?.from_number
                                      : getAsnDocTypeData?.asn_doc_type ===
                                        "IBPO"
                                        ? createSeries(
                                          Number(
                                            getAsnDocTypeData?.number_status
                                          ) + 1
                                        )
                                        : Number(
                                          getAsnDocTypeData?.number_status
                                        ) + 1,
                                }));
                                setFormData(prevData => ({
                                  ...prevData,
                                  asn_no:
                                    getAsnDocTypeData?.number_status == null
                                      ? getAsnDocTypeData?.from_number
                                      : getAsnDocTypeData?.asn_doc_type ===
                                        "IBPO"
                                        ? createSeries(
                                          Number(
                                            getAsnDocTypeData?.number_status
                                          ) + 1
                                        )
                                        : Number(
                                          getAsnDocTypeData?.number_status
                                        ) + 1,
                                }));
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputPODocChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>

                        <Col md="2" className="mb-1">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Label
                              htmlFor="asn_doc_type_desc"
                              style={{ marginRight: "0.5rem" }}
                            >
                              ASN Doc Type Desc.
                            </Label>
                            {formErrors.asn_doc_type_desc && (
                              <div
                                style={{
                                  color: "#f46a6a",
                                  fontSize: "1.25rem",
                                }}
                              >
                                {formErrors.asn_doc_type_desc}
                              </div>
                            )}
                          </div>
                          <p>{formData?.asn_doc_type_desc}</p>
                        </Col>
                        <Col md="2" className="mb-1">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Label
                              htmlFor="delivery_no"
                              style={{ marginRight: "0.5rem" }}
                            >
                              Inbound Del. NO.
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
                          <Label htmlFor="po_no">No(s).</Label>
                          <p>{Polabels.join(", ")}</p>
                          {formErrors.po_no && (
                            <div
                              style={{
                                color: "#f46a6a",
                                fontSize: "80%",
                              }}
                            >
                              {formErrors.po_no}
                            </div>
                          )}
                        </Col>

                        <Col md="2" className="mb-1">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Label
                              htmlFor="asn_no"
                              style={{ marginRight: "0.5rem" }}
                            >
                              ASN NO.
                            </Label>
                            {formErrors.asn_no && (
                              <div
                                style={{
                                  color: "#f46a6a",
                                  fontSize: "1.25rem",
                                }}
                              >
                                {formErrors.asn_no}
                              </div>
                            )}
                          </div>
                          <div>{formData?.asn_no}</div>
                          {/* <Input
                          type="text"
                          id="asn_no"
                          name="untyped-input"
                          className="form-control-sm"
                          onChange={event => {
                            setFormData(prevData => ({
                              ...prevData,
                              asn_no: event.target.value,
                            }));
                          }}
                        /> */}
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
                              {/* {formErrors.asn_date && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.asn_date}
                                </div>
                              )} */}
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
                                      asn_date: moment(selectedDates[0]).format(
                                        "DD/MM/YYYY"
                                      ),
                                    }));
                                  }}
                                  value={moment(
                                    formData?.asn_date,
                                    "DD/MM/YYYY"
                                  ).toDate()}
                                />
                              </InputGroup>
                            </FormGroup>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="2" className="mb-1">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="vendor_del_no"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Vendor Delivery No.
                              </Label>
                              {formErrors.vendor_del_no && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "1.25rem" }}
                                >
                                  {formErrors.vendor_del_no}
                                </div>
                              )}
                            </div>
                            <Input
                              type="text"
                              id="vendor_del_no"
                              name="vendor_del_no"
                              value={formData?.vendor_del_no || ""}
                              onChange={e => handleInputChanges(e)}
                              style={{
                                borderColor: formErrors.vendor_del_no
                                  ? "#f46a6a"
                                  : undefined, // Red border on error
                              }}
                            />
                          </div>
                        </Col>

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

                        {/* Vendor Description */}
                        {/* <Col md="2" className="mb-1">
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
                        </Col> */}

                        <Col md="2" className="mb-1">
                          <Label htmlFor="formrow-state-Input">
                            Eway Bill No.
                          </Label>
                          <Input
                            type="text"
                            id="eway_bill_no"
                            name="eway_bill_no"
                            value={formData?.eway_bill_no || ""}
                            onChange={e => handleInputChanges(e)}
                          />
                          {formErrors.eway_bill_no && (
                            <div
                              style={{
                                color: "#f46a6a",
                                fontSize: "80%",
                              }}
                            >
                              {formErrors.eway_bill_no}
                            </div>
                          )}
                        </Col>

                        <Col md="2" className="mb-2">
                          <div className="">
                            <Label htmlFor="formrow-state-Input">
                              Eway Bill Date
                            </Label>
                            <FormGroup className="mb-4">
                              <InputGroup>
                                <Flatpickr
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
                                      eway_bill_date: moment(
                                        selectedDates[0]
                                      ).format("DD/MM/YYYY"),
                                    }));
                                  }}
                                  value={moment(
                                    formData?.eway_bill_date,
                                    "DD/MM/YYYY"
                                  ).toDate()}
                                />
                              </InputGroup>
                              {formErrors.eway_bill_date && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "80%",
                                  }}
                                >
                                  {formErrors.eway_bill_date}
                                </div>
                              )}
                            </FormGroup>
                          </div>
                        </Col>

                        <Col md="2" className="mb-1">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Label htmlFor="formrow-state-Input">
                              Transporter Name
                            </Label>
                            {formErrors.transpotar_name && (
                              <div
                                className="text-danger"
                                style={{ fontSize: "1.25rem" }}
                              >
                                {formErrors.transpotar_name}
                              </div>
                            )}
                          </div>
                          <Input
                            type="text"
                            id="transpotar_name"
                            name="transpotar_name"
                            style={{
                              borderColor: formErrors.transpotar_name
                                ? "#f46a6a"
                                : undefined, // Red border on error
                            }}
                            value={formData?.transpotar_name || ""}
                            onChange={e => handleInputChanges(e)}
                          />
                        </Col>

                        <Col md="2" className="mb-1">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Label htmlFor="formrow-state-Input">
                              Vehicle No.
                            </Label>
                            {formErrors.vehical_no && (
                              <div
                                className="text-danger"
                                style={{ fontSize: "1.25rem" }}
                              >
                                {formErrors.vehical_no}
                              </div>
                            )}
                          </div>
                          <Input
                            type="text"
                            id="vehical_no"
                            name="vehical_no"
                            value={formData?.vehical_no || ""}
                            style={{
                              borderColor: formErrors.vehical_no
                                ? "#f46a6a"
                                : undefined, // Red border on error
                            }}
                            onChange={e => handleInputChanges(e)}
                          />
                        </Col>


                        <Col md="2" className="mb-1">
                          <Label htmlFor="totalPoTaxAmount">
                            System Date/Time
                          </Label>
                          <Label>{todayDate}</Label>
                        </Col>

                        <Col lg="2" className="mb-2">
                          <Label htmlFor="formrow-state-Input">
                            Requisitioner
                          </Label>
                          <div>
                            <Label>{userData?.first_name}</Label>
                          </div>
                        </Col>
                        {/* <Col lg="3" className="mb-2">
                          <Label htmlFor="formrow-state-Input">
                            Department
                          </Label>
                          <div>
                            <Label>{userData?.department_code}</Label>
                          </div>
                        </Col> */}
                        <Col md="2" className="mb-1">
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Label htmlFor="formrow-state-Input">Supplier Invoice</Label>
                          </div>
                          <Input
                            type="file"
                            id="supplier_invoice"
                            name="supplier_invoice"
                            style={{
                              borderColor: formErrors.supplier_invoice
                                ? "#f46a6a"
                                : undefined, // Red border on error
                            }}
                            onChange={handleFileUpload}
                          />
                        </Col>

                      </Row>

                      <Row>
                        <CardTitle className="mb-4"></CardTitle>
                        <Col lg="3">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Label>Approved POs</Label>
                            {formErrors.approved_pos && (
                              <div
                                className="text-danger"
                                style={{
                                  marginLeft: "0.5rem",
                                  fontSize: "1.25rem",
                                }}
                              >
                                {formErrors.approved_pos}
                              </div>
                            )}
                          </div>
                          <Select
                            isMulti
                            multiple
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={selectedPOValues}
                            options={optionDropDownItems}
                            onChange={async selectedPOValues => {
                              setSelectedPOValues(selectedPOValues);
                              setFormData(prevData => ({
                                ...prevData,
                                po_no: selectedPOValues,
                              }));
                              const selectedLabels = selectedPOValues.map(
                                item => item.label
                              );
                              const poFilteredItems =
                                originalPOLineItemList.filter(item =>
                                  selectedLabels.includes(item.po_no)
                                );
                              setPOLineItemList(poFilteredItems);
                            }}
                            styles={{
                              control: provided => ({
                                ...provided,
                                borderColor: formErrors.approved_pos
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
                              {poFilteredItems.map((item, idx) => (
                                <tr
                                  style={{
                                    borderBottom:
                                      idx < poFilteredItems.length - 1
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
                                                htmlFor={`polineNo-${idx}`}
                                              >
                                                PO Line No.
                                              </Label>
                                            ) : (
                                              ""
                                            )}
                                            <p>{item?.polineNo}</p>
                                            {errors[`polineNo-${idx}`] && (
                                              <div className="text-danger">
                                                {errors[`polineNo-${idx}`]}
                                              </div>
                                            )}
                                          </Col>
                                          <Col lg="1" className="mb-1">
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              {idx === 0 && (
                                                <Label
                                                  htmlFor={`sequence_no-${idx}`}
                                                  style={{
                                                    marginRight: "0.5rem",
                                                  }}
                                                >
                                                  Seq. No.
                                                </Label>
                                              )}
                                              {/* {errors[`sequence_no-${idx}`] && (
                                                <div
                                                  className="text-danger"
                                                  style={{
                                                    fontSize: "1.25rem",
                                                  }}
                                                >
                                                  {errors[`sequence_no-${idx}`]}
                                                </div>
                                              )} */}
                                            </div>
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
                                          </Col>
                                          <Col lg="1" className="mb-1">
                                            <div className="">
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {idx === 0 && (
                                                  <Label
                                                    htmlFor={`delivery_quantity-${idx}`}
                                                    style={{
                                                      marginRight: "0.5rem",
                                                    }}
                                                  >
                                                    Del. Qty.
                                                  </Label>
                                                )}
                                                {errors[`delivery_quantity-${idx}`] && (
                                                  <div
                                                    className="text-danger"
                                                    style={{
                                                      marginLeft: "0.5rem",
                                                      fontSize: "1.25rem",
                                                    }}
                                                  >
                                                    {errors[`delivery_quantity-${idx}`]}
                                                  </div>
                                                )}
                                              </div>
                                              <Input
                                                type="number"
                                                value={item.delivery_quantity || ""}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  const poQty = item?.po_quantity || 0; // PO Quantity

                                                  if (
                                                    value === "" || // Allow clearing the input
                                                    (Number(value) > 0 &&
                                                      Number(value) <= poQty) // Ensure Delivery Qty <= PO Qty
                                                  ) {
                                                    handleInputChange(idx, "delivery_quantity", value);

                                                    if (errors[`delivery_quantity-${idx}`]) {
                                                      // Clear error if valid
                                                      setErrors((prev) => ({
                                                        ...prev,
                                                        [`delivery_quantity-${idx}`]: null,
                                                      }));
                                                    }
                                                  } else {
                                                    // Set error if validation fails
                                                    setErrors((prev) => ({
                                                      ...prev,
                                                      [`delivery_quantity-${idx}`]: ``,
                                                    }));
                                                  }
                                                }}
                                                id={`delivery_quantity-${idx}`}
                                                className="form-control-sm"
                                                min="1"
                                                style={{
                                                  borderColor: errors[`delivery_quantity-${idx}`]
                                                    ? "#f46a6a"
                                                    : undefined, // Red border for errors
                                                }}
                                              />
                                            </div>
                                          </Col>

                                          <Col lg="1" className="mb-1">
                                            <div className="">
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {idx === 0 && (
                                                  <Label
                                                    htmlFor={`po_quantity-${idx}`}
                                                    style={{
                                                      marginRight: "0.5rem",
                                                    }}
                                                  >
                                                    PO Qty.
                                                  </Label>
                                                )}
                                                {errors[`po_quantity-${idx}`] && (
                                                  <div
                                                    className="text-danger"
                                                    style={{
                                                      marginLeft: "0.5rem",
                                                      fontSize: "1.25rem",
                                                    }}
                                                  >
                                                    {errors[`po_quantity-${idx}`]}
                                                  </div>
                                                )}
                                              </div>
                                              <p>{item?.po_quantity}</p>
                                            </div>
                                          </Col>


                                          {/* <Col lg="1" className="mb-1">
                                          <div className="">
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              {idx === 0 && (
                                                <Label
                                                  htmlFor={`putaway_quantity-${idx}`}
                                                  style={{
                                                    marginRight: "0.5rem",
                                                  }}
                                                >
                                                  Put Qty.
                                                </Label>
                                              )}
                                              {errors[
                                                `putaway_quantity-${idx}`
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
                                                      `putaway_quantity-${idx}`
                                                    ]
                                                  }
                                                </div>
                                              )}
                                            </div>
                                            <Input
                                              type="number"
                                              value={
                                                item.putaway_quantity || ""
                                              }
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
                                                    "putaway_quantity",
                                                    value
                                                  );
                                                }
                                              }}
                                              id={`putaway_quantity-${idx}`}
                                              className="form-control-sm"
                                              min="1"
                                              style={{
                                                borderColor: errors[
                                                  `putaway_quantity-${idx}`
                                                ]
                                                  ? "#f46a6a"
                                                  : undefined, // Red border for errors
                                              }}
                                            />
                                          </div>
                                        </Col>

                                        <Col lg="2" className="mb-1">
                                          <div className="">
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              {idx === 0 && (
                                                <Label
                                                  htmlFor={`open_delivery_quantity-${idx}`}
                                                  style={{
                                                    marginRight: "0.5rem",
                                                  }}
                                                >
                                                  Open Qty.
                                                </Label>
                                              )}
                                              {errors[
                                                `open_delivery_quantity-${idx}`
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
                                                      `open_delivery_quantity-${idx}`
                                                    ]
                                                  }
                                                </div>
                                              )}
                                            </div>
                                            <Input
                                              type="number"
                                              value={
                                                item.open_delivery_quantity ||
                                                ""
                                              }
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
                                                    "open_delivery_quantity",
                                                    value
                                                  );
                                                }
                                              }}
                                              id={`open_delivery_quantity-${idx}`}
                                              className="form-control-sm"
                                              min="1"
                                              style={{
                                                borderColor: errors[
                                                  `open_delivery_quantity-${idx}`
                                                ]
                                                  ? "#f46a6a"
                                                  : undefined, // Red border for errors
                                              }}
                                            />
                                          </div>
                                        </Col> */}

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
                                              {errors[`uom-${idx}`] && (
                                                <div className="text-danger">
                                                  {errors[`uom-${idx}`]}
                                                </div>
                                              )}
                                            </div>
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
                                            <p>{item?.product_code}</p>
                                            {errors[`product_code-${idx}`] && (
                                              <div className="text-danger">
                                                {errors[`product_code-${idx}`]}
                                              </div>
                                            )}
                                          </Col>
                                          <Col lg="1" className="mb-1">
                                            {idx === 0 ? (
                                              <Label
                                                htmlFor={`batch_No-${idx}`}
                                              >
                                                Batch No.
                                              </Label>
                                            ) : (
                                              ""
                                            )}
                                            <div>
                                            <Button
                                              style={{ borderRadius: "20px" }}
                                              color="success"
                                              onClick={() => {
                                                setLineItemData(item);
                                                setLineItemIndex(idx);
                                                handleShowModal(idx);
                                              }}
                                            >
                                              +
                                            </Button>
                                            </div>
                                            {errors[`batch_No-${idx}`] && (
                                              <div className="text-danger">
                                                {errors[`batch_No-${idx}`]}
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
                                              <p>{item.warehouse?.label}</p>
                                              {/* <Select
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
                                            /> */}
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
                        style={{ maxWidth: "50%" }}
                      >
                        <ModalHeader toggle={handleCloseModal}>
                          Batch Split
                        </ModalHeader>
                        <ModalBody>
                          <Row>
                            <Col md="6">
                              <Label for="batch_split">
                                {" "}
                                Available Qty {LineItemData?.delivery_quantity}
                              </Label>
                              <FormGroup>
                                <Label for="batch_split">
                                  Number of Batches
                                </Label>
                                <Input
                                  type="number"
                                  id="batch_split"
                                  value={batchNumber}
                                  onChange={handleBatchNumberChange}
                                  min="0"
                                />
                                {errors?.batch_split && (
                                  <div className="text-danger">
                                    {errors?.batch_split}
                                  </div>
                                )}
                              </FormGroup>
                            </Col>
                          </Row>

                          {batches?.map((batch, index) => (
                            <Row key={index}>
                              <Col md="3">
                                <FormGroup>
                                  <Label for={`batch_number-${index}`}>
                                    Internal Number
                                  </Label>
                                  <Input
                                    type="text"
                                    id={`batch_number-${index}`}
                                    value={batch.batch_number}
                                    onChange={e =>
                                      handleBatchNumberFieldChange(
                                        index,
                                        "batch_number",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {errors[`batch_number-${index}`] && (
                                    <div className="text-danger">
                                      {errors[`batch_number-${index}`]}
                                    </div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col md="3">
                                <FormGroup>
                                  <Label for={`external_batch_number-${index}`}>
                                    External Number
                                  </Label>
                                  <Input
                                    type="text"
                                    id={`external_batch_number-${index}`}
                                    value={batch.external_batch_number}
                                    onChange={e =>
                                      handleBatchNumberFieldChange(
                                        index,
                                        "external_batch_number",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {errors[`external_batch_number-${index}`] && (
                                    <div className="text-danger">
                                      {errors[`external_batch_number-${index}`]}
                                    </div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col md="2">
                                <FormGroup>
                                  <Label for={`batch_qty-${index}`}>
                                    Quantity
                                  </Label>
                                  <Input
                                    type="number"
                                    id={`batch_qty-${index}`}
                                    value={batch.batch_qty}
                                    onChange={e =>
                                      handleBatchNumberFieldChange(
                                        index,
                                        "batch_qty",
                                        e.target.value
                                      )
                                    }
                                    min="0"
                                  />
                                  {errors[`batch_qty-${index}`] && (
                                    <div className="text-danger">
                                      {errors[`batch_qty-${index}`]}
                                    </div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col md="3">
                                <FormGroup check>
                                  <Label check>
                                    {Number(batch.batch_qty) != 0 ? (
                                      <Input
                                        type="checkbox"
                                        checked={batch.checkbox}
                                        onChange={e => {
                                          handleBatchNumberFieldChange(
                                            index,
                                            "checkbox",
                                            e.target.checked
                                          );
                                          handleCheckboxChange(
                                            index,
                                            e,
                                            batch.batch_qty
                                          );
                                        }}
                                      />
                                    ) : (
                                      ""
                                    )}
                                    Serial No.
                                  </Label>
                                </FormGroup>
                                {batch.checkbox == true
                                  ? batch.serialNumbers.map(
                                    (serialNumber, serialIndex) => (
                                      <FormGroup key={serialIndex}>
                                        <Input
                                          type="text"
                                          id={`serialNumbers-${index}-${serialIndex}`}
                                          value={serialNumber}
                                          onChange={async e => {
                                            handleSerialNumberChange(
                                              index,
                                              serialIndex,
                                              e.target.value
                                            );
                                            const serialNoFlag =
                                              await getDataBySerialNo(
                                                "serial_number",
                                                e.target.value,
                                                "batch_master"
                                              );
                                            if (serialNoFlag?.serial) {
                                              setErrors(prevErrors => ({
                                                ...prevErrors,
                                                [`serialNumbers-${index}-${serialIndex}`]:
                                                  "Serial Number exist",
                                              }));
                                            } else {
                                              setErrors(prevErrors => ({
                                                ...prevErrors,
                                                [`serialNumbers-${index}-${serialIndex}`]:
                                                  "",
                                              }));
                                            }
                                          }}
                                        />
                                        {errors[
                                          `serialNumbers-${index}-${serialIndex}`
                                        ] && (
                                            <div className="text-danger">
                                              {
                                                errors[
                                                `serialNumbers-${index}-${serialIndex}`
                                                ]
                                              }
                                            </div>
                                          )}
                                      </FormGroup>
                                    )
                                  )
                                  : ""}
                              </Col>

                              <Col md="1">
                                <Link
                                  to="#"
                                  onClick={e => handleRemoveBatch(index)}
                                  className="text-danger"
                                >
                                  <i
                                    className="mdi mdi-delete font-size-18"
                                    id="deletetooltip"
                                  />
                                  <UncontrolledTooltip
                                    placement="top"
                                    target="deletetooltip"
                                  >
                                    Delete
                                  </UncontrolledTooltip>
                                </Link>
                              </Col>
                            </Row>
                          ))}
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="success"
                            onClick={() => handleSaveBatch()}
                          >
                            Save
                          </Button>
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
                        {/* {asnPermission && asnPermission?.can_add && ( */}
                        <Button
                          disabled={loading}
                          onClick={() => handleSave()}
                          color="success"
                          className="mt-5 mt-lg-2 btn-custom-size"
                        >
                          Save
                        </Button>
                        {/* )} */}
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

export default createASN;
