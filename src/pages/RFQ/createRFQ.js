import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Button,
  Card,
  CardBody,
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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useHistory, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import "flatpickr/dist/themes/material_blue.css";
import { getSelectData } from "helpers/Api/api_common";
import { getRfqDocTypeById } from "helpers/Api/api_rfqDocType";
import { getPr } from "helpers/Api/api_pr";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import { productTechParameterByID } from "helpers/Api/api_products";
import { ADD_RFQ_REQUEST } from "../../store/RFQ/actionTypes";
import Loader from "../../components/Common/Loader";
import "../../assets/scss/custom/pages/__loader.scss";

const createRFQ = () => {
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

  const today = new Date();
  const todayDate = moment(today).format("Do MMMM YYYY, h:mm:ss A");
  const history = useHistory();
  const location = useLocation();
  const { editRFQ } = location.state || {};
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserdata] = useState();
  const [toastMessage, setToastMessage] = useState();
  const [poPermission, setPoPermission] = useState();
  const [optionDropDownItems, setOptionDropDownItems] = useState([]);
  const [selectVendorGroup, setSelectedVendorGroup] = useState();
  const [optionVendorGroup, setOptionVendorGroup] = useState([]);
  const [originalPRLineItemList, setOriginalPRLineItemList] = useState([]);
  const [minimizedRows, setMinimizedRows] = useState([]);
  const [selectRFQDocType, setSelectedRFQType] = useState({});
  const [optionRFQDocType, setoptionRFQDocType] = useState([]);
  const [PRLineItemList, setPRLineItemList] = useState([]);
  const { addRfq } = useSelector(state => state.rfq);
  const [selectedPRValues, setSelectedPRValues] = useState([]);

  useEffect(() => {
    if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
      const instance = flatpickrRef.current.flatpickr;
      if (instance.altInput) {
        instance.altInput.style.borderColor = formErrors.rfq_date
          ? "red"
          : "#ced4da";
      }
    }
  }, [formErrors.rfq_date]);
  
  const handleMinimizeRow = idx => {
    setMinimizedRows([...minimizedRows, idx]);
  };

  const handleMaximizeRow = idx => {
    setMinimizedRows(minimizedRows.filter(rowIdx => rowIdx !== idx));
  };

  const handleRemoveRowNested = idx => {
    const newLineItems = [...PRLineItemList];
    newLineItems.splice(idx, 1);
    setPRLineItemList(newLineItems);
  };
  const productTechParameter = async parameter_sets => {
    const response = await productTechParameterByID(parameter_sets);
    return response?.productTechParameterByID;
  };
  const dropdownList = async () => {
    var selectedRows = [];
    if (location.state && location.state?.LineItem.length > 0) {
      selectedRows = location?.state?.LineItem;
    } else {
      const getPRListData = await getPr();
      selectedRows = getPRListData?.approvedPrList;
    }
    const uniquePrNos = new Set();
    var uniqueRows = [];
    if (selectedRows.length > 0) {
      uniqueRows = selectedRows.filter(row => {
        if (!uniquePrNos.has(row.pr_no)) {
          uniquePrNos.add(row.pr_no);
          return true;
        }
        return false;
      });
    }
    // Map unique rows to the desired options format

    const options = uniqueRows.map(row => ({
      value: row.id,
      label: row.pr_no,
    }));
    setOptionDropDownItems(options);
    setSelectedPRValues(options);
    const selectedRowsData = await Promise.all(
      selectedRows.map(async (item, index) => {
        const technical_setData = JSON.parse(item?.technical_set_value);
        var TableDataList = [];
        var Techids = [];
        if (technical_setData) {
          Techids = Object.values(technical_setData).flatMap(item => item.id);
          TableDataList = await productTechParameter(Techids.join(","));
        }
        return {
          id: item?.id,
          pr_no: item?.pr_no,
          pr_id: item?.pr_id,
          rfqlineNo: 10 * (index + 1),
          rfq_quantity: "",
          product_id: item?.product_id,
          quantity: item?.quantity,
          product_code: item?.product_code,
          product: item?.product,
          techData: technical_setData,
          tableData: TableDataList,
          pr_line_item: item?.line_item_number,
          uom: item?.uom,
          delivery_date: item?.delivery_date,
          warehouse_id: item?.warehouse_id,
          storage_location_id: item?.storage_location_id,
          product_group_id: item?.product_group_id,
          vendor_prod_description: item?.vendor_prod_description,
        };
      })
    );

    if (selectedRowsData.length > 0) {
      setMinimizedRows(Array.from({ length: selectedRowsData.length }, (_, i) => i));
    }
    setPRLineItemList(selectedRowsData);

    const selectVendorGroupData = await getSelectData(
      "vendor_code",
      "",
      "vendor_master_search"
    );
    setOptionVendorGroup(selectVendorGroupData?.getDataByColNameData);

    const selectDocTypeData = await getSelectData(
      "rfq_doc_type_description",
      "",
      "rfq_doc_type_master"
    );
    setoptionRFQDocType(selectDocTypeData?.getDataByColNameData);
  };

  // const handleInputProductList = useCallback(
  //   debounce(async inputValue => {
  //     try {
  //       const selectProductListData = await getSelectData(
  //         "product_description",
  //         inputValue,
  //         "product_master"
  //       );
  //       setOptionProductList(selectProductListData?.getDataByColNameData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }, 300),
  //   []
  // );
  const handleInputVendorGroup = useCallback(
    debounce(async inputValue => {
      try {
        const selectVendorGroupData = await getSelectData(
          "vendor_code",
          inputValue,
          "vendor_master_search"
        );
        setOptionVendorGroup(selectVendorGroupData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const validateField = (fieldName, value) => {
    let error = value ? null : true;
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error,
    }));

  };

  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
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

  const handleInputChange = (index, fieldName, value) => {
    const newLineItems = [...PRLineItemList];
    newLineItems[index][fieldName] = value;
    setPRLineItemList(newLineItems);
    validateField(`${fieldName}-${index}`, value);
  };

  const handleInputChangeParameter = (index, fieldName, valueitems, value) => {
    const newLineItems = [...PRLineItemList];
    newLineItems[index][fieldName][valueitems[0]] = value;
    setPRLineItemList(newLineItems);
  };

  const selectedLabels = selectedPRValues.map(item => item.label);
  const prFilteredItems = PRLineItemList.filter(item =>
    selectedLabels.includes(item.pr_no)
  );
  useEffect(() => {
    dropdownList();
    const userData = getUserData();
    setUserdata(userData?.user);
    var permissions = userData?.permissionList.filter(
      permission => permission.sub_menu_name === "po"
    );
    setPoPermission(
      permissions.find(permission => permission.sub_menu_name === "po")
    );
    if (addRfq?.success === true) {
      // setLoading(false);
      setToast(true);
      setToastMessage(addRfq?.message);
      setTimeout(() => {
        setLoading(false);
        setToast(false);
        history.push("/rfq");
      }, 1000);
    } else {
      setLoading(false);
      if (addRfq?.success !== undefined && addRfq?.message) {
        setToast(true);
        setToastMessage(addRfq.message);
      }
      setTimeout(() => {
        setToast(false);
      }, 2000);
    }
  }, [addRfq]);

  useEffect(() => {
    if (PRLineItemList.length > 0 && originalPRLineItemList.length === 0) {
      setOriginalPRLineItemList([...PRLineItemList]);
    }
  }, [PRLineItemList]);

  const handleInputRFQDocChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectDocTypeData = await getSelectData(
          "rfq_doc_type_description",
          inputValue,
          "rfq_doc_type_master"
        );
        setoptionRFQDocType(selectDocTypeData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );
  const validateForm = () => {
    const errorsdata = {};
    let isValid = true;
    if (!formData.rfq_doc_type_id) {
      // errorsdata.rfq_doc_type_id = "PO DOC Type is required";
      errorsdata.rfq_doc_type_id = true;
      isValid = false;
    }
    if (!selectVendorGroup) {
      errorsdata.vendors = true;
      isValid = false;
      // errorsdata.vendors = "Vendors is required";
    }
    if (!formData.rfq_no) {
      errorsdata.rfq_no = true;
      isValid = false;
      // errorsdata.rfq_no = "RFQ NO. is required";
    }
    if (!formData.rfq_date) {
      errorsdata.rfq_date = "*";
      // errorsdata.rfq_date = "RFQ Date is required";
    }
    if (selectedPRValues.length == 0) {
      errorsdata.approved_prs = true;
      isValid = false;
    } else {
      PRLineItemList.forEach((item, index) => {
        Object.keys(item).forEach(fieldName => {
          if (
            `pr_no-${index}` === `${fieldName}-${index}` ||
            `rfqlineNo-${index}` === `${fieldName}-${index}` ||
            `rfq_quantity-${index}` === `${fieldName}-${index}`
          ) {
            if (item[fieldName] === "" || item[fieldName] < 0) {
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
      prFilteredItems,
    };
    dispatch({
      type: ADD_RFQ_REQUEST,
      payload: Data,
    });
  };

  const handleCancel = () => {
    history.push("/rfq");
  };

  const flatpickrRef = useRef(null);
  document.title = "Detergent | Create RFQ";

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
                color={addRfq?.success ? "success" : "danger"}
                role="alert"
              >
                {toastMessage}
              </Alert>
            </div>
          )}

          {/* BreadCrumbs */}
          <Breadcrumbs
            titlePath="/rfq"
            title="RFQ"
            breadcrumbItem="Create RFQ"
          />

          {/* RFQ Headers and Line Item */}
          {loading ? (
            <Loader />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <Col xs="12">
                      <Row data-repeater-item>
                        {/* RFQ Document Type */}
                        <Col md="2" className="mb-2">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                RFQ Doc. Type
                              </Label>
                              {formErrors.rfq_doc_type_id && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.rfq_doc_type_id}
                                </div>
                              )}
                            </div>
                            <Select
                              styles={{
                                ...customStyles,
                                control: provided => ({
                                  ...provided,
                                  borderColor: formErrors.rfq_doc_type_id
                                    ? "#f46a6a"
                                    : provided.borderColor, // Red border for errors
                                }),
                              }}
                              value={selectRFQDocType}
                              options={optionRFQDocType}
                              onChange={async selectRFQDocType => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  rfq_doc_type_id: selectRFQDocType?.value,
                                }));
                                setSelectedRFQType(selectRFQDocType);
                                const getRFQDocTypeData =
                                  await getRfqDocTypeById(
                                    selectRFQDocType?.value
                                  );
                                setFormData(prevData => ({
                                  ...prevData,
                                  rfq_no:
                                    getRFQDocTypeData?.number_status == null
                                      ? getRFQDocTypeData?.from_number
                                      : getRFQDocTypeData?.rfq_doc_type ===
                                        "RFQ"
                                        ? createSeries(
                                          Number(
                                            getRFQDocTypeData?.number_status
                                          ) + 1
                                        )
                                        : Number(
                                          getRFQDocTypeData?.number_status
                                        ) + 1,
                                }));
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputRFQDocChange(inputValue);
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
                                htmlFor="rfq_no"
                                style={{ marginRight: "0.5rem" }}
                              >
                                RFQ NO.
                              </Label>
                              {formErrors.rfq_no && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                    marginLeft: "0.5rem",
                                  }}
                                >
                                  {formErrors.rfq_no}
                                </div>
                              )}
                            </div>
                            <div>{formData?.rfq_no}</div>
                          </div>
                        </Col>

                        {/* Doc Date */}
                        <Col md="3" className="mb-2">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label htmlFor="formrow-state-Input">
                                RFQ Date
                              </Label>
                              {/* {formErrors.rfq_date && (
                                <div
                                  className="text-danger"
                                  style={{
                                    marginLeft: "0.5rem",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.rfq_date}
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
                                      rfq_date: moment(selectedDates[0]).format(
                                        "DD/MM/YYYY"
                                      ),
                                    }));
                                  }}
                                  value={moment(
                                    formData?.rfq_date,
                                    "DD/MM/YYYY"
                                  ).toDate()}
                                />
                              </InputGroup>
                            </FormGroup>
                          </div>
                        </Col>

                        <Col lg="2" className="mb-2">
                          <Label htmlFor="formrow-state-Input">
                            Created By
                          </Label>
                          <div>
                            <Label>{userData?.first_name}</Label>
                          </div>
                        </Col>
                      </Row>
                      {editRFQ && (
                        <Row>
                          <div className="col-lg-2 mb-2">
                            <label
                              htmlFor="formrow-state-Input"
                              className="form-label"
                            >
                              Approved By
                            </label>
                            <p className="form-input">Name2</p>
                          </div>
                        </Row>
                      )}

                      {/* Select Purchase Request */}
                      <Row>
                        <CardTitle className="mb-4"></CardTitle>
                        <Col lg="3">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Label>Approved PRs</Label>
                            {formErrors.approved_prs && (
                              <div
                                className="text-danger"
                                style={{
                                  marginLeft: "0.5rem",
                                  fontSize: "1.25rem",
                                }}
                              >
                                {formErrors.approved_prs}
                              </div>
                            )}
                          </div>
                          <Select
                            isMulti
                            multiple
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={selectedPRValues}
                            options={optionDropDownItems}
                            styles={{
                              control: provided => ({
                                ...provided,
                                borderColor: formErrors.approved_prs
                                  ? "#f46a6a"
                                  : provided.borderColor, // Red border for errors
                              }),
                            }}
                            onChange={async selectedPRValues => {
                              setSelectedPRValues(selectedPRValues);
                              const selectedLabels = selectedPRValues.map(
                                item => item.label
                              );
                              const prFilteredItems = originalPRLineItemList.filter(item =>
                                selectedLabels.includes(item.pr_no)
                              );
                              setPRLineItemList(prFilteredItems);
                            }}
                          ></Select>
                        </Col>
                      </Row>

                      {/* Selected Purchase Request Line Items*/}
                      <CardTitle className="mb-4"></CardTitle>
                      <Row>
                        <Col lg="12">
                          <div>
                            {/* <div style={{ height: "400px", overflowY: "auto" }}> */}
                            <Table style={{ width: "100%" }}>
                              <tbody>
                                {prFilteredItems.map((item, idx) => (
                                  <tr
                                    style={{
                                      borderBottom:
                                        idx < prFilteredItems.length - 1
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
                                            <Col lg="2" className="mb-1">
                                              {idx === 0 ? (
                                                <Label htmlFor={`pr_no-${idx}`}>
                                                  PR No.
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.pr_no}</p>
                                              {errors[`pr_no-${idx}`] && (
                                                <div className="text-danger">
                                                  {errors[`pr_no-${idx}`]}
                                                </div>
                                              )}
                                            </Col>
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`pr_line_item-${idx}`}
                                                >
                                                  PR Line No.
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <div>{item.pr_line_item}</div>
                                            </Col>
                                            <Col lg="2" className="mb-1">
                                              <div className="">
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  {idx === 0 ? (
                                                    <Label
                                                      htmlFor={`rfqlineNo-${idx}`}
                                                      style={{
                                                        marginRight: "0.5rem",
                                                      }}
                                                    >
                                                      RFQ Line No.
                                                    </Label>
                                                  ) : (
                                                    ""
                                                  )}
                                                  {errors[
                                                    `rfqlineNo-${idx}`
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
                                                          `rfqlineNo-${idx}`
                                                          ]
                                                        }
                                                      </div>
                                                    )}
                                                </div>
                                                <Input
                                                  type="number"
                                                  value={item.rfqlineNo}
                                                  onChange={e =>
                                                    handleInputChange(
                                                      idx,
                                                      "rfqlineNo",
                                                      e.target.value
                                                    )
                                                  }
                                                  id={`rfqlineNo-${idx}`}
                                                  name="rfqlineNo"
                                                  className="form-control-sm"
                                                  style={{
                                                    borderColor: errors[
                                                      `rfqlineNo-${idx}`
                                                    ]
                                                      ? "#f46a6a"
                                                      : undefined, // Red border for errors
                                                  }}
                                                />
                                              </div>
                                            </Col>

                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label htmlFor={`quantity-${idx}`}>
                                                  PR Qty.
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.quantity}</p>
                                              {errors[`quantity-${idx}`] && (
                                                <div className="text-danger">
                                                  {errors[`quantity-${idx}`]}
                                                </div>
                                              )}
                                            </Col>

                                            <Col lg="1" className="mb-1">
                                              <div>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  {idx === 0 ? (
                                                    <Label
                                                      htmlFor={`rfq_quantity-${idx}`}
                                                      style={{
                                                        marginRight: "0.5rem",
                                                      }}
                                                    >
                                                      RFQ Qty.
                                                    </Label>
                                                  ) : null}
                                                  {errors[`rfq_quantity-${idx}`] && (
                                                    <div
                                                      className="text-danger"
                                                      style={{
                                                        marginLeft: "0.5rem",
                                                        fontSize: "1.25rem",
                                                      }}
                                                    >
                                                      {errors[`rfq_quantity-${idx}`]}
                                                    </div>
                                                  )}
                                                </div>
                                                <Input
                                                  type="number"
                                                  value={item.rfq_quantity || ""}
                                                  onChange={(e) => {
                                                    const value = e.target.value;
                                                    const quantity = item?.quantity || 0; // PR Quantity

                                                    if (
                                                      value === "" || // Allow empty value for clearing input
                                                      (Number(value) > 0 &&
                                                        Number(value) <= quantity) // Ensure RFQ Qty <= PR Qty
                                                    ) {
                                                      handleInputChange(idx, "rfq_quantity", value);

                                                      if (errors[`rfq_quantity-${idx}`]) {
                                                        // Clear error if valid
                                                        setErrors((prev) => ({
                                                          ...prev,
                                                          [`rfq_quantity-${idx}`]: null,
                                                        }));
                                                      }
                                                    } else {
                                                      // Set error if validation fails
                                                      setErrors((prev) => ({
                                                        ...prev,
                                                        [`rfq_quantity-${idx}`]: ``,
                                                      }));
                                                    }
                                                  }}
                                                  id={`rfq_quantity-${idx}`}
                                                  name="rfq_quantity"
                                                  className="form-control-sm"
                                                  style={{
                                                    borderColor: errors[`rfq_quantity-${idx}`]
                                                      ? "#f46a6a"
                                                      : undefined, // Red border for errors
                                                  }}
                                                />
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
                                              <p>{item?.product_code}</p>
                                              {errors[
                                                `product_code-${idx}`
                                              ] && (
                                                  <div className="text-danger">
                                                    {
                                                      errors[
                                                      `product_code-${idx}`
                                                      ]
                                                    }
                                                  </div>
                                                )}
                                            </Col>

                                            <Col md="3" className="mb-2">
                                              <div className="">
                                                <Label htmlFor="formrow-state-Input">
                                                  Product Name
                                                </Label>
                                                <p>{item?.product?.label}</p>
                                                {/* <Select
                                                value={item?.product}
                                                options={optionProductList}
                                                isReadOnly={true}
                                                onChange={async selectProductList => {
                                                  handleInputChange(
                                                    idx,
                                                    "product",
                                                    selectProductList
                                                  );
                                                  const getProductData =
                                                    await getProductsByID(
                                                      selectProductList?.value
                                                    );
                                                  handleInputChange(
                                                    idx,
                                                    "product_code",
                                                    getProductData?.product_code
                                                  );
                                                  const technical_setData = JSON.parse(getProductData?.technical_set_value);
                                                  const Techids = Object.values(technical_setData).flatMap(item => item.id);
                                                  const TableDataList = await productTechParameter(Techids.join(","));  
                                                  handleInputChange(
                                                    idx,
                                                    "techData",
                                                    technical_setData
                                                  );
                                                  handleInputChange(
                                                    idx,
                                                    "tableData",
                                                    TableDataList
                                                  )}}
                                                onInputChange={(
                                                  inputValue,
                                                  { action }
                                                ) => {
                                                  handleInputProductList(
                                                    inputValue
                                                  );
                                                }}
                                              /> */}
                                                {formErrors.product_name && (
                                                  <div
                                                    style={{
                                                      color: "#f46a6a",
                                                      fontSize: "80%",
                                                    }}
                                                  >
                                                    {formErrors.product_name}
                                                  </div>
                                                )}
                                              </div>
                                            </Col>
                                            <Col
                                              lg="1"
                                              className="position-relative mb-1"
                                              style={{ position: "relative" }}
                                            >
                                              <div
                                                style={{
                                                  position: "absolute",
                                                  top: "-30px",
                                                  right: "0",
                                                  display: "flex",
                                                  gap: "4px",
                                                  borderBottom: "black",
                                                }}
                                              >
                                                <Link
                                                  to="#"
                                                  onClick={() =>
                                                    handleMinimizeRow(idx)
                                                  }
                                                  style={{
                                                    fontSize: "1.25rem",
                                                    border: "none",
                                                    padding: "1px",
                                                  }}
                                                >
                                                  <i
                                                    className="mdi mdi-window-minimize font-size-20"
                                                    id="minimizeTooltip"
                                                  />
                                                </Link>
                                                <Link
                                                  to="#"
                                                  onClick={() =>
                                                    handleMaximizeRow(idx)
                                                  }
                                                  style={{
                                                    fontSize: "1.25rem",
                                                    border: "none",
                                                    padding: "1px",
                                                  }}
                                                >
                                                  <i
                                                    className="mdi mdi-window-maximize font-size-20"
                                                    id="maximizeTooltip"
                                                  />
                                                </Link>
                                                <Link
                                                  to="#"
                                                  onClick={() =>
                                                    handleRemoveRowNested(idx)
                                                  }
                                                  style={{
                                                    fontSize: "1.25rem",
                                                    border: "none",
                                                    padding: "1px",
                                                    color: "red",
                                                  }}
                                                >
                                                  <i
                                                    className="mdi mdi-close font-size-20"
                                                    id="removeTooltip"
                                                  />
                                                </Link>
                                              </div>
                                            </Col>
                                          </Row>
                                          {minimizedRows.length > 0 &&
                                            minimizedRows.includes(idx) ? null : (
                                            <Row data-repeater-item>
                                              {item?.tableData?.length > 0 &&
                                                item?.tableData.map(
                                                  (items, index) => {
                                                    if (
                                                      items.types[0] ===
                                                      "datebox"
                                                    ) {
                                                      return (
                                                        <Col
                                                          key={index}
                                                          md={7}
                                                          className="mb-3"
                                                        >
                                                          <Label htmlFor="datebox">
                                                            {items?.labels[0]}
                                                          </Label>
                                                          <Flatpickr
                                                            placeholder="dd M, yyyy"
                                                            options={{
                                                              altInput: true,
                                                              altFormat:
                                                                "j F, Y",
                                                              dateFormat:
                                                                "Y-m-d",
                                                            }}
                                                            onChange={selectedDates => {
                                                              handleInputChangeParameter(
                                                                idx,
                                                                "techData",
                                                                [
                                                                  `datebox-${index}`,
                                                                ],
                                                                {
                                                                  id: items
                                                                    ?.items[0]
                                                                    ?.id,
                                                                  type: items
                                                                    ?.types[0],
                                                                  label: moment(
                                                                    selectedDates[0]
                                                                  ).format(
                                                                    "DD/MM/YYYY"
                                                                  ),
                                                                }
                                                              );
                                                            }}
                                                            value={moment(
                                                              item?.techData?.[
                                                                `datebox-${index}`
                                                              ] == null
                                                                ? items
                                                                  ?.values[0]
                                                                : item
                                                                  ?.techData?.[
                                                                  `datebox-${index}`
                                                                ]?.label,
                                                              "DD/MM/YYYY"
                                                            ).toDate()}
                                                          />
                                                          {formErrors?.[
                                                            `datebox-${index}`
                                                          ] && (
                                                              <div
                                                                style={{
                                                                  color:
                                                                    "#f46a6a",
                                                                  fontSize: "80%",
                                                                }}
                                                              >
                                                                {
                                                                  formErrors?.[
                                                                  `datebox-${index}`
                                                                  ]
                                                                }
                                                              </div>
                                                            )}
                                                        </Col>
                                                      );
                                                    } else if (
                                                      items.types[0] ===
                                                      "textfield"
                                                    ) {
                                                      return (
                                                        <Col
                                                          key={index}
                                                          md={7}
                                                          className="mb-3"
                                                        >
                                                          <Label
                                                            htmlFor={`textfield-${index}`}
                                                          >
                                                            {items?.labels[0]}
                                                          </Label>
                                                          <Input
                                                            type="text"
                                                            id={`textfield-${index}`}
                                                            name={`textfield-${index}`}
                                                            value={
                                                              item?.techData?.[
                                                                `textfield-${index}`
                                                              ] == null
                                                                ? items
                                                                  ?.values[0]
                                                                : item
                                                                  ?.techData?.[
                                                                  `textfield-${index}`
                                                                ]?.label
                                                            }
                                                            onChange={event => {
                                                              handleInputChangeParameter(
                                                                idx,
                                                                "techData",
                                                                [
                                                                  `textfield-${index}`,
                                                                ],
                                                                {
                                                                  id: items
                                                                    ?.items[0]
                                                                    ?.id,
                                                                  type: items
                                                                    ?.types[0],
                                                                  label:
                                                                    event.target
                                                                      ?.value,
                                                                }
                                                              );
                                                            }}
                                                            placeholder="Please Enter Text Field"
                                                          />
                                                          {formErrors?.[
                                                            `textfield-${index}`
                                                          ] && (
                                                              <div
                                                                style={{
                                                                  color:
                                                                    "#f46a6a",
                                                                  fontSize: "80%",
                                                                }}
                                                              >
                                                                {
                                                                  formErrors?.[
                                                                  `textfield-${index}`
                                                                  ]
                                                                }
                                                              </div>
                                                            )}
                                                        </Col>
                                                      );
                                                    } else if (
                                                      items.types[0] ===
                                                      "dropdown"
                                                    ) {
                                                      return (
                                                        <Col
                                                          key={index}
                                                          md={7}
                                                          className="mb-3"
                                                        >
                                                          <label htmlFor="dropdown">
                                                            {items?.labels[0]}
                                                          </label>
                                                          <Select
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            options={
                                                              items?.items
                                                            }
                                                            onChange={async selectedTechSet => {
                                                              handleInputChangeParameter(
                                                                idx,
                                                                "techData",
                                                                [
                                                                  `dropdown-${index}`,
                                                                ],
                                                                {
                                                                  id: items
                                                                    ?.items[0]
                                                                    ?.id,
                                                                  type: items
                                                                    ?.types[0],
                                                                  dropdown:
                                                                    selectedTechSet,
                                                                }
                                                              );
                                                            }}
                                                            value={
                                                              item?.techData?.[
                                                                `dropdown-${index}`
                                                              ] == null
                                                                ? items
                                                                  ?.values[0]
                                                                : item
                                                                  ?.techData?.[
                                                                  `dropdown-${index}`
                                                                ]?.dropdown
                                                            }
                                                          ></Select>
                                                          {formErrors?.[
                                                            `dropdown-${index}`
                                                          ] && (
                                                              <div
                                                                style={{
                                                                  color:
                                                                    "#f46a6a",
                                                                  fontSize: "80%",
                                                                }}
                                                              >
                                                                {
                                                                  formErrors?.[
                                                                  `dropdown-${index}`
                                                                  ]
                                                                }
                                                              </div>
                                                            )}
                                                        </Col>
                                                      );
                                                    } else if (
                                                      items.types[0] ===
                                                      "textarea"
                                                    ) {
                                                      return (
                                                        <Col
                                                          key={index}
                                                          md={7}
                                                          className="mb-3"
                                                        >
                                                          <Label
                                                            htmlFor={`textarea-${index}`}
                                                          >
                                                            {items?.labels[0]}
                                                          </Label>
                                                          <Input
                                                            type="textarea"
                                                            id={`textarea-${index}`}
                                                            name={`textarea-${index}`}
                                                            className={`form-control ${formErrors.textarea
                                                                ? "is-invalid"
                                                                : ""
                                                              }`}
                                                            value={
                                                              item?.techData?.[
                                                                `textarea-${index}`
                                                              ] == null
                                                                ? items
                                                                  ?.values[0]
                                                                : item
                                                                  ?.techData?.[
                                                                  `textarea-${index}`
                                                                ]?.label
                                                            }
                                                            onChange={event => {
                                                              handleInputChangeParameter(
                                                                idx,
                                                                "techData",
                                                                [
                                                                  `textarea-${index}`,
                                                                ],
                                                                {
                                                                  id: items
                                                                    ?.items[0]
                                                                    ?.id,
                                                                  type: items
                                                                    ?.types[0],
                                                                  label:
                                                                    event.target
                                                                      ?.value,
                                                                }
                                                              );
                                                            }}
                                                            rows="1"
                                                            placeholder="Please Enter Text Area"
                                                          />
                                                        </Col>
                                                      );
                                                    } else if (
                                                      items.types[0] ===
                                                      "dateTime"
                                                    ) {
                                                      return (
                                                        <Col
                                                          key={index}
                                                          md={7}
                                                          className="mb-3"
                                                        >
                                                          <Label htmlFor="dateTime">
                                                            {items?.labels[0]}
                                                          </Label>
                                                          <Flatpickr
                                                            placeholder="dd M, yyyy HH:mm"
                                                            options={{
                                                              altInput: true,
                                                              altFormat:
                                                                "j F, Y h:i K",
                                                              dateFormat:
                                                                "Y-m-d h:i K",
                                                              enableTime: true,
                                                              time_24hr: false,
                                                            }}
                                                            onChange={selectedDates => {
                                                              handleInputChangeParameter(
                                                                idx,
                                                                "techData",
                                                                [
                                                                  `dateTime-${index}`,
                                                                ],
                                                                {
                                                                  id: items
                                                                    ?.items[0]
                                                                    ?.id,
                                                                  type: items
                                                                    ?.types[0],
                                                                  label: moment(
                                                                    selectedDates[0]
                                                                  ).format(
                                                                    "DD/MM/YYYY hh:mm A"
                                                                  ),
                                                                }
                                                              );
                                                            }}
                                                            value={moment(
                                                              item?.techData?.[
                                                                `dateTime-${index}`
                                                              ] == null
                                                                ? items
                                                                  ?.values[0]
                                                                : item
                                                                  ?.techData?.[
                                                                  `dateTime-${index}`
                                                                ]?.label,
                                                              "DD/MM/YYYY hh:mm A"
                                                            ).toDate()}
                                                          />
                                                          {formErrors?.[
                                                            `dateTime-${index}`
                                                          ] && (
                                                              <div
                                                                style={{
                                                                  color:
                                                                    "#f46a6a",
                                                                  fontSize: "80%",
                                                                }}
                                                              >
                                                                {
                                                                  formErrors?.[
                                                                  `dateTime-${index}`
                                                                  ]
                                                                }
                                                              </div>
                                                            )}
                                                        </Col>
                                                      );
                                                    } else if (
                                                      items.types[0] ===
                                                      "timebox"
                                                    ) {
                                                      return (
                                                        <Col
                                                          key={index}
                                                          md={7}
                                                          className="mb-3"
                                                        >
                                                          <Label htmlFor="timebox">
                                                            {items?.labels[0]}
                                                          </Label>
                                                          <Flatpickr
                                                            placeholder="HH:mm"
                                                            options={{
                                                              enableTime: true,
                                                              noCalendar: true,
                                                              dateFormat:
                                                                "h:i K",
                                                              altFormat:
                                                                "h:i K",
                                                              time_24hr: false,
                                                            }}
                                                            onChange={selectedDates => {
                                                              handleInputChangeParameter(
                                                                idx,
                                                                "techData",
                                                                [
                                                                  `timebox-${index}`,
                                                                ],
                                                                {
                                                                  id: items
                                                                    ?.items[0]
                                                                    ?.id,
                                                                  type: items
                                                                    ?.types[0],
                                                                  label: moment(
                                                                    selectedDates[0]
                                                                  ).format(
                                                                    "hh:mm A"
                                                                  ),
                                                                }
                                                              );
                                                            }}
                                                            value={moment(
                                                              item?.techData?.[
                                                                `timebox-${index}`
                                                              ] == null
                                                                ? items
                                                                  ?.values[0]
                                                                : item
                                                                  ?.techData?.[
                                                                  `timebox-${index}`
                                                                ]?.label,
                                                              "hh:mm A"
                                                            ).toDate()}
                                                          />
                                                          {formErrors?.[
                                                            `timebox-${index}`
                                                          ] && (
                                                              <div
                                                                style={{
                                                                  color:
                                                                    "#f46a6a",
                                                                  fontSize: "80%",
                                                                }}
                                                              >
                                                                {
                                                                  formErrors?.[
                                                                  `timebox-${index}`
                                                                  ]
                                                                }
                                                              </div>
                                                            )}
                                                        </Col>
                                                      );
                                                    } else if (
                                                      items.types[0] ===
                                                      "urlbox"
                                                    ) {
                                                      return (
                                                        <Col
                                                          key={index}
                                                          md={7}
                                                          className="mb-3"
                                                        >
                                                          <Label htmlFor="textarea">
                                                            {items?.labels[0]}
                                                          </Label>
                                                          <Input
                                                            type="text"
                                                            id="urlbox"
                                                            name="urlbox"
                                                            className={`form-control ${formErrors.urlbox
                                                                ? "is-invalid"
                                                                : ""
                                                              }`}
                                                            placeholder="Please Enter Url"
                                                            value={
                                                              item?.techData?.[
                                                                `urlbox-${index}`
                                                              ] == null
                                                                ? items
                                                                  ?.values[0]
                                                                : item
                                                                  ?.techData?.[
                                                                  `urlbox-${index}`
                                                                ]?.label
                                                            }
                                                            onChange={event => {
                                                              handleInputChangeParameter(
                                                                idx,
                                                                "techData",
                                                                [
                                                                  `urlbox-${index}`,
                                                                ],
                                                                {
                                                                  id: items
                                                                    ?.items[0]
                                                                    ?.id,
                                                                  type: items
                                                                    ?.types[0],
                                                                  label:
                                                                    event.target
                                                                      ?.value,
                                                                }
                                                              );
                                                            }}
                                                          />
                                                          {formErrors?.[
                                                            `urlbox-${index}`
                                                          ] && (
                                                              <div className="invalid-feedback">
                                                                {
                                                                  formErrors?.[
                                                                  `urlbox-${index}`
                                                                  ]
                                                                }
                                                              </div>
                                                            )}
                                                        </Col>
                                                      );
                                                    } else if (
                                                      items.types[0] ===
                                                      "emailbox"
                                                    ) {
                                                      return (
                                                        <Col
                                                          key={index}
                                                          md={7}
                                                          className="mb-3"
                                                        >
                                                          <Label htmlFor="email">
                                                            {items?.labels[0]}
                                                          </Label>
                                                          <Input
                                                            type="email"
                                                            id="emailbox"
                                                            name="emailbox"
                                                            className={`form-control ${formErrors.emailbox
                                                                ? "is-invalid"
                                                                : ""
                                                              }`}
                                                            placeholder="Please Enter Email"
                                                            value={
                                                              item?.techData?.[
                                                                `emailbox-${index}`
                                                              ] == null
                                                                ? items
                                                                  ?.values[0]
                                                                : item
                                                                  ?.techData?.[
                                                                  `emailbox-${index}`
                                                                ]?.label
                                                            }
                                                            onChange={event => {
                                                              handleInputChangeParameter(
                                                                idx,
                                                                "techData",
                                                                [
                                                                  `emailbox-${index}`,
                                                                ],
                                                                {
                                                                  id: items
                                                                    ?.items[0]
                                                                    ?.id,
                                                                  type: items
                                                                    ?.types[0],
                                                                  label:
                                                                    event.target
                                                                      .value,
                                                                }
                                                              );
                                                            }}
                                                          />
                                                          {formErrors?.[
                                                            `emailbox-${index}`
                                                          ] && (
                                                              <div className="invalid-feedback">
                                                                {
                                                                  formErrors?.[
                                                                  `emailbox-${index}`
                                                                  ]
                                                                }
                                                              </div>
                                                            )}
                                                        </Col>
                                                      );
                                                    } else if (
                                                      items.types[0] ===
                                                      "colorbox"
                                                    ) {
                                                      return (
                                                        <Col
                                                          key={index}
                                                          md={7}
                                                          className="mb-3"
                                                        >
                                                          <Label htmlFor="email">
                                                            {items?.labels[0]}
                                                          </Label>
                                                          <Input
                                                            type="color"
                                                            id="colorbox"
                                                            name="colorbox"
                                                            className={`form-control ${formErrors.colorbox
                                                                ? "is-invalid"
                                                                : ""
                                                              }`}
                                                            value={
                                                              item?.techData?.[
                                                                `colorbox-${index}`
                                                              ] == null
                                                                ? items
                                                                  ?.values[0]
                                                                : item
                                                                  ?.techData?.[
                                                                  `colorbox-${index}`
                                                                ]?.label
                                                            }
                                                            onChange={event => {
                                                              handleInputChangeParameter(
                                                                idx,
                                                                "techData",
                                                                [
                                                                  `colorbox-${index}`,
                                                                ],
                                                                {
                                                                  id: items
                                                                    ?.items[0]
                                                                    ?.id,
                                                                  type: items
                                                                    ?.types[0],
                                                                  label:
                                                                    event.target
                                                                      .value,
                                                                }
                                                              );
                                                            }}
                                                          />
                                                          {formErrors?.[
                                                            `colorbox-${index}`
                                                          ] && (
                                                              <div className="invalid-feedback">
                                                                {
                                                                  formErrors?.[
                                                                  `colorbox-${index}`
                                                                  ]
                                                                }
                                                              </div>
                                                            )}
                                                        </Col>
                                                      );
                                                    } else if (
                                                      items.types[0] ===
                                                      "numberbox"
                                                    ) {
                                                      return (
                                                        <Col
                                                          key={index}
                                                          md={7}
                                                          className="mb-3"
                                                        >
                                                          <Label htmlFor="email">
                                                            {items?.labels[0]}
                                                          </Label>
                                                          <Input
                                                            type="number"
                                                            id="numberbox"
                                                            name="numberbox"
                                                            className={`form-control ${formErrors.numberbox
                                                                ? "is-invalid"
                                                                : ""
                                                              }`}
                                                            placeholder="Please Enter Number"
                                                            value={
                                                              item?.techData?.[
                                                                `numberbox-${index}`
                                                              ] == null
                                                                ? items
                                                                  ?.values[0]
                                                                : item
                                                                  ?.techData?.[
                                                                  `numberbox-${index}`
                                                                ]?.label
                                                            }
                                                            onChange={event => {
                                                              handleInputChangeParameter(
                                                                idx,
                                                                "techData",
                                                                [
                                                                  `numberbox-${index}`,
                                                                ],
                                                                {
                                                                  id: items
                                                                    ?.items[0]
                                                                    ?.id,
                                                                  type: items
                                                                    ?.types[0],
                                                                  label:
                                                                    event.target
                                                                      .value,
                                                                }
                                                              );
                                                            }}
                                                          />
                                                          {formErrors?.[
                                                            `numberbox-${index}`
                                                          ] && (
                                                              <div className="invalid-feedback">
                                                                {
                                                                  formErrors?.[
                                                                  `numberbox-${index}`
                                                                  ]
                                                                }
                                                              </div>
                                                            )}
                                                        </Col>
                                                      );
                                                    } else if (
                                                      items.types[0] ===
                                                      "multipleselect"
                                                    ) {
                                                      return (
                                                        <Col
                                                          key={index}
                                                          md={7}
                                                          className="mb-3"
                                                        >
                                                          <label htmlFor="multiselect">
                                                            {items?.labels[0]}
                                                          </label>
                                                          <Select
                                                            isMulti
                                                            multiple
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            options={
                                                              items?.items
                                                            }
                                                            onChange={async selectedTechSet => {
                                                              handleInputChangeParameter(
                                                                idx,
                                                                "techData",
                                                                [
                                                                  `multipleselect-${index}`,
                                                                ],
                                                                {
                                                                  id: items
                                                                    ?.items[0]
                                                                    ?.id,
                                                                  type: items
                                                                    ?.types[0],
                                                                  default_value:
                                                                    selectedTechSet[0]
                                                                      ?.default_value,
                                                                  multipleselect:
                                                                    selectedTechSet,
                                                                }
                                                              );
                                                            }}
                                                            value={
                                                              item?.techData?.[
                                                                `multipleselect-${index}`
                                                              ] == null
                                                                ? items
                                                                  ?.values[0]
                                                                : item
                                                                  ?.techData?.[
                                                                  `multipleselect-${index}`
                                                                ]
                                                                  ?.multipleselect
                                                            }
                                                          ></Select>
                                                        </Col>
                                                      );
                                                    } else {
                                                      return null; // Return null for items that do not match any condition
                                                    }
                                                  }
                                                )}
                                            </Row>
                                          )}
                                        </div>
                                      </Form>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </CardBody>
                  <Card>
                    <CardBody>
                      <Row>
                        <Col md="3" className="mb-2">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Vendors
                              </Label>
                              {formErrors.vendors && (
                                <div
                                  className="text-danger"
                                  style={{
                                    marginLeft: "0.5rem",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.vendors}
                                </div>
                              )}
                            </div>
                            <Select
                              // styles={customStyles}
                              isMulti
                              multiple
                              value={selectVendorGroup}
                              options={optionVendorGroup}
                              onChange={async selectVendorGroup => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  vendors: selectVendorGroup,
                                }));
                                setSelectedVendorGroup(selectVendorGroup);
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputVendorGroup(inputValue);
                              }}
                              styles={{
                                control: provided => ({
                                  ...provided,
                                  borderColor: formErrors.vendors
                                    ? "#f46a6a"
                                    : provided.borderColor, // Red border for errors
                                }),
                              }}
                            />
                          </div>
                        </Col>

                        <Col md="1"></Col>
                        <Col md="3" className="mb-2">
                          <Label htmlFor="formrow-state-Input">
                            Created Date:{""}
                          </Label>
                          <div>
                            <Label>{todayDate}</Label>
                          </div>
                        </Col>
                        {/* <Col md="3" className="mb-2">
                        <Label htmlFor="formrow-state-Input">
                          Issued On Date:{" "}
                        </Label>
                        <div>
                          <Label>{todayDate}</Label>
                        </div>
                      </Col> */}
                      </Row>
                      {/* <Row className="mt-5">
                      <Col md="1">
                        <Button //color="primary">Email</Button>
                      </Col>
                      <Col md="10">
                        <Button //color="primary">PDF</Button>
                      </Col>
                      <Col md="1">
                        <Button //color="primary">Print</Button>
                      </Col>
                    </Row> */}
                    </CardBody>
                  </Card>
                  <Col xs="12">
                    <Row data-repeater-item>
                      <Col lg="5" className="mb-5"></Col>
                      <Col lg="1" className="mb-1">
                        {poPermission && poPermission?.can_add && (
                          <Button
                            disabled={loading}
                            onClick={() => handleSave()}
                            //color="primary"
                            className="mt-5 mt-lg-2 btn-custom-size btn-custom-theme"
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

export default createRFQ;
