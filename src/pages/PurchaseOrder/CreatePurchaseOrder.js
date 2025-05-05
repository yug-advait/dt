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
import { getWithholdingTaxTypes } from "helpers/Api/api_withholdingTaxType";
import { getPoDocTypeById } from "helpers/Api/api_poDocType";
import { getVendorByID } from "helpers/Api/api_vendor";
import { getCompanyLegalEntityByID } from "helpers/Api/api_companyLegalEntity";
import { getPr } from "helpers/Api/api_pr";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import { ADD_PO_REQUEST } from "../../store/purchaseOrder/actionTypes";
import Loader from "../../components/Common/Loader";
import "../../assets/scss/custom/pages/__loader.scss";
import RequiredLabel from "components/Common/RequiredLabel";


const CreatePurchaseOrder = () => {
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

  const customFlatpickrStyles = {
    height: "27px",
    padding: "0.25rem 0.5rem",
    fontSize: "0.875rem",
  };
  const today = new Date();
  const todayDate = moment(today).format("Do MMMM YYYY, h:mm:ss A");
  const history = useHistory();
  const location = useLocation();
  const { editPO, prPo } = location.state || {};
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserdata] = useState();
  const [toastMessage, setToastMessage] = useState();
  const [poPermission, setPoPermission] = useState();
  const [optionProductUOM, setOptionProductUOM] = useState([]);
  const [optionWithholdingTax, setOptionWithholdingTax] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [optionDropDownItems, setOptionDropDownItems] = useState([]);
  // State to hold the original list
  const [originalPRLineItemList, setOriginalPRLineItemList] = useState([]);
  const [selectPODocType, setSelectedPODocType] = useState({});
  const [optionPODocType, setOptionPODocType] = useState([]);
  const [selectVendorGroup, setSelectedVendorGroup] = useState({});
  const [optionVendorGroup, setOptionVendorGroup] = useState([]);
  const [selectCompanyCode, setSelectedCompanyCode] = useState({});
  const [optionCompanyCode, setOptionCompanyCode] = useState([]);
  const [selectPurchaseGroup, setSelectedPurchaseGroup] = useState({});
  const [optionProductPlant, setOptionProductPlant] = useState([]);
  const [optionProductLocation, setOptionProductLocation] = useState([]);
  const [optionPurchaseGroup, setOptionPurchaseGroup] = useState([]);
  const [selectPurchaseOrganization, setSelectedPurchaseOrganization] =
    useState({});
  const [optionPurchaseOrganization, setOptionPurchaseOrganization] = useState(
    []
  );
  const [PRLineItemList, setPRLineItemList] = useState([]);
  const { addPo } = useSelector(state => state.purchaseOrder);
  const [selectedPRValues, setSelectedPRValues] = useState([]);
  const [poDocDate, setPoDocDate] = useState(null);

  useEffect(() => {
    if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
      const instance = flatpickrRef.current.flatpickr;
      if (instance.altInput) {
        instance.altInput.style.borderColor = formErrors.po_date
          ? "red"
          : "#ced4da";
      }
    }
  }, [formErrors.po_date]);

  useEffect(() => {
    if (optionProductPlant.length > 0 || optionProductLocation.length > 0) {
      setPRLineItemList((prev) =>
        prev.map((item, index) => ({
          ...item,
          warehouse: item.warehouse || optionProductPlant[0],
          location: item.location || optionProductLocation[0],
        }))
      );
    }
  }, [optionProductPlant, optionProductLocation]);

  function createSeries(...numbers) {
    // Map each number to a string with leading zeros
    const formattedNumbers = numbers.map(num =>
      num.toString().padStart(10, "0")
    );
    // Join the formatted numbers with a specified separator (e.g., comma)
    const seriesString = formattedNumbers.join(", ");
    return seriesString;
  }

  const dropdownList = async () => {
    var selectedRows = [];
    if (location.state && location.state?.LineItem.length > 0) {
      selectedRows = location?.state?.LineItem;
      setSelectedVendorGroup(location?.state?.selectedVendor);
      setFormData(prevData => ({
        ...prevData,
        vendor_code: location?.state?.selectedVendor?.value,
      }));
      var getVendorData;
      if (location?.state?.selectedVendor) {
        getVendorData = await getVendorByID(
          location?.state?.selectedVendor?.value
        );
      }
      setFormData(prevData => ({
        ...prevData,
        vendor_name: getVendorData?.legal_entity_name,
      }));
    } else {
      const getPOListData = await getPr();
      selectedRows = getPOListData?.approvedPrList;
    }
    const uniquePrNos = new Set();
    const uniqueRows = selectedRows.filter(row => {
      if (prPo == true) {
        if (!uniquePrNos.has(row.pr_no)) {
          uniquePrNos.add(row.pr_no);
          return true;
        }
      } else {
        if (!uniquePrNos.has(row.rfq_no)) {
          uniquePrNos.add(row.rfq_no);
          return true;
        }
      }
      return false;
    });
    // Map unique rows to the desired options format
    const options = uniqueRows.map(row => ({
      value: row.id,
      label: prPo == true ? row.pr_no : row.rfq_no,
    }));
    setOptionDropDownItems(options);
    setSelectedPRValues(options);

    const selectPlantData = await getSelectData(
      "plant_code",
      "",
      "warehouse_master"
    );
    setOptionProductPlant(selectPlantData?.getDataByColNameData);
    const selectLocationData = await getSelectData("code", "", "location_code");
    setOptionProductLocation(selectLocationData?.getDataByColNameData);

    const selectedRowsData = selectedRows.map((item, index) => {
      return {
        id: item?.id,
        rfq_no: prPo == true ? item.pr_no : item?.rfq_no,
        rfq_id: prPo == true ? item.pr_id : item?.rfq_id,
        rfq_line_item_id: prPo == true ? item.id : item?.rfq_line_item_id,
        line_item_number: item?.line_item_number,
        polineNo: 10 * (index + 1),
        product_id: item?.product_id,
        product_group_id: item?.product_group_id,
        product_description: item?.product_description,
        vendor_prod_description: item?.vendor_prod_description,
        po_quantity: "",
        quantity: item?.quantity,
        uom: item?.uom,
        net_price: "",
        total_net_value: "",
        product_code: item?.product_code,
        hsn: item?.hsn_sac_code,
        tax_per: item?.gst_rate || "",
        tax_amount: 0,
        total_line_item_price: 0,
        delivery_date: moment(item?.delivery_date).format("DD/MM/YYYY"),
        location: item?.location_code,
        warehouse: item?.warehouse_code,
        gl_account_id: item?.gl_account_id,
        free_of_charge: false,
        rfq_line_item_no: item?.line_item_number,
        product_description: item?.product_description,
        vendor_prod_description: item?.vendor_prod_description,
        gst_classification_id: item?.gst_classification_id,
      };
    });
    setPRLineItemList(selectedRowsData);

    const selectDocTypeData = await getSelectData(
      "po_doc_type_description",
      "",
      "po_doc_type_master"
    );
    setOptionPODocType(selectDocTypeData?.getDataByColNameData);

    const selectVendorGroupData = await getSelectData(
      "vendor_code",
      "",
      "vendor_master_search"
    );
    setOptionVendorGroup(selectVendorGroupData?.getDataByColNameData);

    const selectCompanyCodeData = await getSelectData(
      "company_code",
      "",
      "company_legal_entity_search"
    );
    setOptionCompanyCode(selectCompanyCodeData?.getDataByColNameData);

    const defaultCompany = selectCompanyCodeData?.getDataByColNameData?.[0];
    if (defaultCompany) {
      setSelectedCompanyCode(defaultCompany);
      setFormData(prevData => ({
        ...prevData,
        company_code: defaultCompany.value,
      }));
    }

    const selectPOrgData = await getSelectData(
      "purchase_organisation",
      "",
      "purchase_organisation"
    );
    setOptionPurchaseOrganization(selectPOrgData?.getDataByColNameData);

    const selectPurchaseGroupData = await getSelectData(
      "purchase_group_code",
      "",
      "purchase_group"
    );
    setOptionPurchaseGroup(selectPurchaseGroupData?.getDataByColNameData);
    const selectUomData = await getSelectData(
      "uom_description",
      "",
      "unit_of_measure"
    );
    setOptionProductUOM(selectUomData?.getDataByColNameData);

    const selectWithholdingTaxData = await getWithholdingTaxTypes();
    if (selectWithholdingTaxData) {
      const optionWithholdingTaxData = selectWithholdingTaxData?.map(item => {
        return {
          id: item.id,
          value: item.withholding_tax_percentage,
          label:
            item.withholding_tax_code +
            " - " +
            item.withholding_tax_percentage +
            "%",
        };
      });
      setOptionWithholdingTax(optionWithholdingTaxData);
    }
  };

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

  const handleInputChange = (index, fieldName, value) => {
    const newLineItems = [...PRLineItemList];
    newLineItems[index][fieldName] = value;
    setPRLineItemList(newLineItems);
    validateField(`${fieldName}-${index}`, value);
    const totalAmount = prFilteredItems.reduce((sum, item) => {
      return (
        sum + (item.total_net_value == "" ? 0 : Number(item.total_net_value))
      );
    }, 0);
    setFormData(prevData => ({
      ...prevData,
      total_amount: totalAmount,
    }));
    const totalTaxAmount = prFilteredItems.reduce((sum, item) => {
      return sum + (item.tax_amount == "" ? 0 : Number(item.tax_amount));
    }, 0);

    setFormData(prevData => ({
      ...prevData,
      total_tax_amount: totalTaxAmount,
    }));
  };
  const selectedLabels = selectedPRValues.map(item => item.label);
  const prFilteredItems = PRLineItemList.filter(item =>
    selectedLabels.includes(item.rfq_no)
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
    if (addPo?.success === true) {
      // setLoading(false);
      setToast(true);
      setToastMessage(addPo?.message);
      setTimeout(() => {
        setLoading(false);
        setToast(false);
        history.push({
          pathname: "/purchase_order",
          state: { activeTab: prPo == true ? 2 : 1 },
        });
      }, 1000);
    } else {
      setLoading(false);
      if (addPo?.success !== undefined && addPo?.message) {
        setToast(true);
        setToastMessage(addPo.message);
      }
      setTimeout(() => {
        setToast(false);
      }, 2000);
    }
  }, [addPo]);

  // Ensure that the original list is set when the component mounts
  useEffect(() => {
    if (PRLineItemList.length > 0 && originalPRLineItemList.length === 0) {
      setOriginalPRLineItemList([...PRLineItemList]);
    }
  }, [PRLineItemList]);

  const handleInputPODocChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectDocTypeData = await getSelectData(
          "po_doc_type_description",
          inputValue,
          "po_doc_type_master"
        );
        setOptionPODocType(selectDocTypeData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );
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
  const handleInputCompanyCode = useCallback(
    debounce(async inputValue => {
      try {
        const selectCompanyCodeData = await getSelectData(
          "company_code",
          inputValue,
          "company_legal_entity_search"
        );
        setOptionCompanyCode(selectCompanyCodeData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const handleInputPrOrgChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectPOrgData = await getSelectData(
          "purchase_organisation",
          inputValue,
          "purchase_organisation"
        );
        setOptionPurchaseOrganization(selectPOrgData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );
  const handleInputPrGrpChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectPurchaseGroupData = await getSelectData(
          "purchase_group_code",
          inputValue,
          "purchase_group"
        );
        setOptionPurchaseGroup(selectPurchaseGroupData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const validateForm = () => {
    const errorsdata = {};
    let isValid = true;
    if (!formData.po_doc_type_id) {
      errorsdata.po_doc_type_id = true; // Error flag instead of message
      isValid = false;
    }
    if (!formData.vendor_code) {
      errorsdata.vendor_code = true;
      isValid = false;
    }
    if (!formData.po_no) {
      errorsdata.po_no = true;
      isValid = false;
    }
    if (!formData.company_code) {
      errorsdata.company_code = true;
      isValid = false;
    }
    if (!formData.vendor_name) {
      errorsdata.vendor_name = true;
      isValid = false;
    }
    // if (!formData.company_name) {
    //   errorsdata.company_name = true;
    //   isValid = false;
    // }
    if (!formData.purchase_group_id) {
      errorsdata.purchase_group_id = true;
      isValid = false;
    }
    if (!formData.purchase_organisation_id) {
      errorsdata.purchase_organisation_id = true;
      isValid = false;
    }
    if (!formData.po_date) {
      // errorsdata.po_date = "DOC Date is required";
      errorsdata.po_date = "*";
    }
    if (selectedPRValues.length == 0) {
      errorsdata.approved_prs = true;
      isValid = false;
    } else {
      PRLineItemList.forEach((item, index) => {
        Object.keys(item).forEach(fieldName => {
          if (
            `rfq_no-${index}` === `${fieldName}-${index}` ||
            `polineNo-${index}` === `${fieldName}-${index}` ||
            `po_quantity-${index}` === `${fieldName}-${index}` ||
            `uom-${index}` === `${fieldName}-${index}` ||
            `net_price-${index}` === `${fieldName}-${index}` ||
            `total_net_value-${index}` === `${fieldName}-${index}` ||
            // `tax_per-${index}` === `${fieldName}-${index}` ||
            `delivery_date_-${index}` === `${fieldName}-${index}`
          ) {
            //if (!item[fieldName] || item[fieldName] === "" || value < 0) {
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
      setFormErrors(errorsdata);
      return Object.keys(errorsdata).length === 0;
    } else {
      return isValid;
    }
  };
  const handleSave = () => {
    setIsSubmitted(true);
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const Data = {
      formData,
      prFilteredItems,
      prPo,
    };
    dispatch({
      type: ADD_PO_REQUEST,
      payload: Data,
    });
  };

  const handleCancel = () => {
    history.push("/purchase_request");
  };
  const flatpickrRef = useRef(null);
  document.title = "Detergent | Create PO";

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
              <Alert color={addPo?.success ? "success" : "danger"} role="alert">
                {toastMessage}
              </Alert>
            </div>
          )}

          {/* BreadCrumbs */}
          <Breadcrumbs
            titlePath="/purchase_order"
            title="PO"
            breadcrumbItem="Create PO"
          />

          {/* PO Headers and Line Item */}
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
                          <div>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                PO Doc. Type
                              </Label>
                              {formErrors.po_doc_type_id && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                    marginLeft: "0.5rem",
                                  }}
                                >
                                  {formErrors.po_doc_type_id}
                                </div>
                              )}
                            </div>
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...provided,
                                  borderColor: formErrors.po_doc_type_id
                                    ? "#f46a6a"
                                    : provided.borderColor,
                                  "&:hover": {
                                    borderColor: formErrors.po_doc_type_id
                                      ? "green"
                                      : provided.borderColor,
                                  },
                                }),
                              }}
                              value={selectPODocType}
                              options={optionPODocType}
                              onChange={async selectPODocType => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  po_doc_type_id: selectPODocType?.value,
                                }));
                                setSelectedPODocType(selectPODocType);
                                const getPODocTypeData = await getPoDocTypeById(
                                  selectPODocType?.value
                                );
                                setFormData(prevData => ({
                                  ...prevData,
                                  po_no:
                                    getPODocTypeData?.number_status == null
                                      ? getPODocTypeData?.from_number
                                      : getPODocTypeData?.po_doc_type == "PO"
                                        ? createSeries(
                                          Number(
                                            getPODocTypeData?.number_status
                                          ) + 1
                                        )
                                        : Number(
                                          getPODocTypeData?.number_status
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
                              htmlFor="po_no"
                              style={{ marginRight: "0.5rem" }}
                            >
                              PO NO.
                            </Label>
                            {formErrors.po_no && (
                              <div
                                style={{
                                  color: "#f46a6a",
                                  fontSize: "1.25rem",
                                }}
                              >
                                {formErrors.po_no}
                              </div>
                            )}
                          </div>
                          <div>{formData?.po_no}</div>
                        </Col>
                        <Col md="2" className="mb-2">
                          <div className="">
                            <RequiredLabel
                              htmlFor="formrow-state-Input"
                              label="DOC Date"
                            />
                            <FormGroup className="mb-4">
                              <InputGroup>
                                <Flatpickr
                                  ref={flatpickrRef}
                                  placeholder="dd M, yyyy"
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
                                    if (instance.altInput)
                                      Object.assign(
                                        instance.altInput.style,
                                        customFlatpickrStyles
                                      );
                                  }}
                                  onChange={(selectedDates, dateStr) => {
                                    const formattedDate = moment(
                                      selectedDates[0]
                                    ).format("DD/MM/YYYY");
                                    setFormData(prevData => ({
                                      ...prevData,
                                      po_date: formattedDate,
                                    }));
                                    setPoDocDate(selectedDates[0]);
                                  }}
                                  value={moment(
                                    formData?.po_date,
                                    "DD/MM/YYYY"
                                  ).toDate()}
                                />
                              </InputGroup>
                            </FormGroup>
                          </div>
                        </Col>

                        {/* Vendor Code */}
                        <Col md="2" className="mb-2">
                          <div>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Vendor Code/Name
                              </Label>
                              {formErrors.vendor_code && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                    marginLeft: "0.5rem",
                                  }}
                                >
                                  {formErrors.vendor_code}
                                </div>
                              )}
                            </div>
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...provided,
                                  borderColor: formErrors.vendor_code
                                    ? "#f46a6a"
                                    : provided.borderColor,
                                  "&:hover": {
                                    borderColor: formErrors.vendor_code
                                      ? "green"
                                      : provided.borderColor,
                                  },
                                }),
                              }}
                              value={selectVendorGroup}
                              options={optionVendorGroup}
                              onChange={async selectVendorGroup => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  vendor_code: selectVendorGroup?.value,
                                }));
                                setSelectedVendorGroup(selectVendorGroup);
                                const getVendorData = await getVendorByID(
                                  selectVendorGroup?.value
                                );
                                setFormData(prevData => ({
                                  ...prevData,
                                  vendor_name: getVendorData?.legal_entity_name,
                                }));
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputVendorGroup(inputValue);
                              }}
                            />
                          </div>
                        </Col>

                        {/* Vendor Name */}
                        {/* <Col md="2" className="mb-1">
                        <Label htmlFor="vendorName">Vendor Name</Label>
                        <div>{formData?.vendor_name}</div>
                        {formErrors.vendor_name && (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "80%",
                            }}
                          >
                            {formErrors.vendor_name}
                          </div>
                        )}
                      </Col> */}

                        {/* Company Code */}
                        <Col md="2" className="mb-2">
                          <div>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Company Code/Name
                              </Label>
                              {formErrors.company_code && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                    marginLeft: "0.5rem",
                                  }}
                                >
                                  {formErrors.company_code}
                                </div>
                              )}
                            </div>
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...provided,
                                  borderColor: formErrors.company_code
                                    ? "#f46a6a"
                                    : provided.borderColor,
                                  "&:hover": {
                                    borderColor: formErrors.company_code
                                      ? "green"
                                      : provided.borderColor,
                                  },
                                }),
                              }}
                              value={selectCompanyCode}
                              options={optionCompanyCode}
                              onChange={async selectCompanyCode => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  company_code: selectCompanyCode?.value,
                                }));
                                setSelectedCompanyCode(selectCompanyCode);
                                // const getCompanyData =
                                //   await getCompanyLegalEntityByID(
                                //     selectCompanyCode?.value
                                //   );
                                // setFormData(prevData => ({
                                //   ...prevData,
                                //   company_name: getCompanyData?.company_name,
                                // }));
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputCompanyCode(inputValue);
                              }}
                            />
                          </div>
                        </Col>

                        <Col md="2" className="mb-1">
                          <Label htmlFor="totalPoTaxAmount">
                            System Date/Time
                          </Label>
                          <Label>{todayDate}</Label>
                        </Col>

                        {/* Company Name */}
                        {/* <Col md="2" className="mb-1">
                        <Label htmlFor="companyName">Company Name</Label>
                        <div>{formData?.company_name}</div>
                        {formErrors.company_name && (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "80%",
                            }}
                          >
                            {formErrors.company_name}
                          </div>
                        )}
                      </Col> */}

                        {/* Purchase Group */}
                        <Col md="2" className="mb-2">
                          <div>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Purchase Group
                              </Label>
                              {formErrors.purchase_group_id && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                    marginLeft: "0.5rem",
                                  }}
                                >
                                  {formErrors.purchase_group_id}
                                </div>
                              )}
                            </div>
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...provided,
                                  borderColor: formErrors.purchase_group_id
                                    ? "#f46a6a"
                                    : provided.borderColor,
                                  "&:hover": {
                                    borderColor: formErrors.purchase_group_id
                                      ? "green"
                                      : provided.borderColor,
                                  },
                                }),
                              }}
                              value={selectPurchaseGroup}
                              options={optionPurchaseGroup}
                              onChange={async selectPurchaseGroup => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  purchase_group_id: selectPurchaseGroup?.value,
                                }));
                                setSelectedPurchaseGroup(selectPurchaseGroup);
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputPrGrpChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>

                        {/* Purchase Organisation */}
                        <Col md="2" className="mb-2">
                          <div>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Purchase Organisation
                              </Label>
                              {formErrors.purchase_organisation_id && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                    marginLeft: "0.5rem",
                                  }}
                                >
                                  {formErrors.purchase_organisation_id}
                                </div>
                              )}
                            </div>
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...provided,
                                  borderColor:
                                    formErrors.purchase_organisation_id
                                      ? "#f46a6a"
                                      : provided.borderColor,
                                  "&:hover": {
                                    borderColor:
                                      formErrors.purchase_organisation_id
                                        ? "green"
                                        : provided.borderColor,
                                  },
                                }),
                              }}
                              value={selectPurchaseOrganization}
                              options={optionPurchaseOrganization}
                              onChange={async selectPurchaseOrganization => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  purchase_organisation_id:
                                    selectPurchaseOrganization?.value,
                                }));
                                setSelectedPurchaseOrganization(
                                  selectPurchaseOrganization
                                );
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputPrOrgChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>

                        {/* Total PO Amount */}
                        <Col md="2" className="mb-1">
                          <Label htmlFor="totalPoAmount">Total Amount</Label>
                          <div>{formData?.total_amount}</div>
                        </Col>

                        {/* Total PO Tax Amount */}
                        <Col md="2" className="mb-1">
                          <Label htmlFor="totalPoTaxAmount">
                            Total Tax Amount
                          </Label>
                          <div>{formData?.total_tax_amount}</div>
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
                      </Row>
                      {editPO && (
                        <Row>
                          <div className="col-lg-2 mb-2">
                            <label
                              htmlFor="formrow-state-Input"
                              className="form-label"
                            >
                              Created By
                            </label>
                            <p className="form-input form-label">Name1</p>
                          </div>
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
                            <Label>
                              Approved {prPo == true ? "PRs" : "RFQs"}{" "}
                            </Label>
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
                                selectedLabels.includes(item.rfq_no)
                              );
                              // Update quotationLineItemList to reflect changes
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
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`rfq_no-${idx}`}
                                                >
                                                  {prPo == true
                                                    ? "PR No."
                                                    : "RFQ No."}
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.rfq_no}</p>
                                              {errors[`rfq_no-${idx}`] && (
                                                <div className="text-danger">
                                                  {errors[`rfq_no-${idx}`]}
                                                </div>
                                              )}
                                            </Col>
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`rfq_line_item_no-${idx}`}
                                                >
                                                  {prPo == true ? "PR" : "RFQ"}{" "}
                                                  Line
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <div>{item.rfq_line_item_no}</div>
                                            </Col>
                                            <Col lg="2" className="mb-1">
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {idx === 0 ? (
                                                  <Label
                                                    htmlFor={`polineNo-${idx}`}
                                                    style={{
                                                      marginRight: "0.5rem",
                                                    }}
                                                  >
                                                    PO Line No
                                                  </Label>
                                                ) : null}

                                                {errors[`polineNo-${idx}`] && (
                                                  <div
                                                    className="text-danger"
                                                    style={{
                                                      marginLeft: "0.5rem",
                                                      fontSize: "1.25rem",
                                                    }}
                                                  >
                                                    {errors[`polineNo-${idx}`]}
                                                  </div>
                                                )}
                                              </div>

                                              <Input
                                                type="number"
                                                value={item.polineNo}
                                                onChange={e =>
                                                  handleInputChange(
                                                    idx,
                                                    "polineNo",
                                                    e.target.value
                                                  )
                                                }
                                                id={`polineNo-${idx}`}
                                                name="polineNo"
                                                className="form-control-sm"
                                                style={{
                                                  borderColor: errors[
                                                    `polineNo-${idx}`
                                                  ]
                                                    ? "#f46a6a"
                                                    : undefined, // Red border for errors
                                                }}
                                              />
                                            </Col>

                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label htmlFor={`quantity-${idx}`}>
                                                  {prPo === true ? "PR " : "Rfq "}Qty.
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.quantity}</p>
                                              {errors[`quantity-${idx}`] && (
                                                <div className="text-danger">{errors[`quantity-${idx}`]}</div>
                                              )}
                                            </Col>

                                            <Col lg="1" className="mb-1">
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {idx === 0 ? (
                                                  <Label
                                                    htmlFor={`po_quantity-${idx}`}
                                                    style={{
                                                      marginRight: "0.5rem",
                                                    }}
                                                  >
                                                    PO Qty.
                                                  </Label>
                                                ) : null}

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

                                              <Input
                                                type="number"
                                                value={item.po_quantity || ""}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  const quantity = item?.quantity || 0; // PR Quantity

                                                  if (
                                                    value === "" || // Allow empty value for clearing input
                                                    (Number(value) > 0 &&
                                                      Number(value) <= quantity && // Ensure PO Qty <= PR Qty
                                                      Number.isInteger(Number(value)))
                                                  ) {
                                                    handleInputChange(idx, "po_quantity", value);
                                                    if (errors[`po_quantity-${idx}`]) {
                                                      // Clear error if valid
                                                      setErrors((prev) => ({
                                                        ...prev,
                                                        [`po_quantity-${idx}`]: null,
                                                      }));
                                                    }
                                                  } else {
                                                    // Set error if validation fails
                                                    setErrors((prev) => ({
                                                      ...prev,
                                                      [`po_quantity-${idx}`]: ``,
                                                    }));
                                                  }
                                                }}
                                                id={`po_quantity-${idx}`}
                                                className="form-control-sm"
                                                min="1" // Ensures that the number cannot be decreased below 1 using the number input's arrows
                                                style={{
                                                  borderColor: errors[`po_quantity-${idx}`]
                                                    ? "#f46a6a"
                                                    : undefined, // Red border for errors
                                                }}
                                              />
                                            </Col>

                                            <Col lg="2" className="mb-1">
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {idx === 0 ? (
                                                  <Label
                                                    htmlFor={`uom-${idx}`}
                                                    style={{
                                                      marginRight: "0.5rem",
                                                    }}
                                                  >
                                                    UOM
                                                  </Label>
                                                ) : null}

                                                {errors[`uom-${idx}`] && (
                                                  <div
                                                    className="text-danger"
                                                    style={{
                                                      marginLeft: "0.5rem",
                                                      fontSize: "1.25rem",
                                                    }}
                                                  >
                                                    {errors[`uom-${idx}`]}
                                                  </div>
                                                )}
                                              </div>

                                              <Select
                                                styles={{
                                                  ...customStyles,
                                                  control: provided => ({
                                                    ...provided,
                                                    borderColor: errors[
                                                      `uom-${idx}`
                                                    ]
                                                      ? "#f46a6a"
                                                      : provided.borderColor, // Red border for errors
                                                    "&:hover": {
                                                      borderColor: errors[
                                                        `uom-${idx}`
                                                      ]
                                                        ? "green"
                                                        : provided.borderColor,
                                                    },
                                                  }),
                                                }}
                                                value={item.uom || ""}
                                                options={optionProductUOM}
                                                onChange={selected =>
                                                  handleInputChange(
                                                    idx,
                                                    "uom",
                                                    selected
                                                  )
                                                }
                                              />
                                            </Col>

                                            <Col lg="2" className="mb-1">
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {idx === 0 ? (
                                                  <Label
                                                    htmlFor={`net_price-${idx}`}
                                                    style={{
                                                      marginRight: "0.5rem",
                                                    }}
                                                  >
                                                    Net Price
                                                  </Label>
                                                ) : null}

                                                {errors[`net_price-${idx}`] && (
                                                  <div
                                                    className="text-danger"
                                                    style={{
                                                      marginLeft: "0.5rem",
                                                      fontSize: "1.25rem",
                                                    }}
                                                  >
                                                    {errors[`net_price-${idx}`]}
                                                  </div>
                                                )}
                                              </div>

                                              <Input
                                                type="number"
                                                value={item.net_price}
                                                readOnly={item.free_of_charge}
                                                onChange={e => {
                                                  const value = e.target.value;
                                                  if (
                                                    value === "" ||
                                                    (Number(value) > 0 &&
                                                      Number.isFinite(
                                                        Number(value)
                                                      ))
                                                  ) {
                                                    handleInputChange(
                                                      idx,
                                                      "net_price",
                                                      value
                                                    );
                                                  }
                                                }}
                                                id={`net_price-${idx}`}
                                                name="net_price"
                                                className="form-control-sm"
                                                style={{
                                                  borderColor: errors[
                                                    `net_price-${idx}`
                                                  ]
                                                    ? "#f46a6a"
                                                    : undefined, // Red border for errors
                                                }}
                                              />
                                            </Col>

                                            <Col lg="2" className="mb-1">
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {idx === 0 ? (
                                                  <Label
                                                    htmlFor={`total_net_value-${idx}`}
                                                    style={{
                                                      marginRight: "0.5rem",
                                                    }}
                                                  >
                                                    Net Value
                                                  </Label>
                                                ) : null}

                                                {errors[
                                                  `total_net_value-${idx}`
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
                                                        `total_net_value-${idx}`
                                                        ]
                                                      }
                                                    </div>
                                                  )}
                                              </div>

                                              <Input
                                                type="number"
                                                value={item.total_net_value}
                                                readOnly={item.free_of_charge}
                                                onChange={e => {
                                                  const value = e.target.value;
                                                  const netValue = Number(value);
                                                  const taxRate = Number(item?.tax_per || 0);

                                                  if (
                                                    value === "" ||
                                                    (netValue > 0 && Number.isFinite(netValue))
                                                  ) {
                                                    const taxAmount = (netValue * taxRate) / 100;
                                                    const totalLineItemPrice = netValue + taxAmount;

                                                    handleInputChange(
                                                      idx,
                                                      "total_net_value",
                                                      value
                                                    );
                                                    handleInputChange(
                                                      idx,
                                                      "tax_amount",
                                                      taxAmount
                                                    );
                                                    handleInputChange(
                                                      idx,
                                                      "total_line_item_price",
                                                      totalLineItemPrice
                                                    );
                                                  }
                                                }}
                                                id={`total_net_value-${idx}`}
                                                name="total_net_value"
                                                className="form-control-sm"
                                                style={{
                                                  borderColor: errors[
                                                    `total_net_value-${idx}`
                                                  ]
                                                    ? "#f46a6a"
                                                    : undefined, // Red border for errors
                                                }}
                                              />
                                            </Col>

                                            <Col lg="1" className="mb-1">
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {idx === 0 ? (
                                                  <Label
                                                    htmlFor={`tax_per-${idx}`}
                                                    style={{
                                                      marginRight: "0.5rem",
                                                    }}
                                                  >
                                                    Tax %
                                                  </Label>
                                                ) : null}

                                              </div>
                                              <p>{item?.tax_per ?? "0"}</p>
                                            </Col>

                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`tax_amount-${idx}`}
                                                >
                                                  Tax Amt
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.tax_amount ?? "0.00"}</p>
                                            </Col>
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label htmlFor={`tax_amount-${idx}`}>
                                                  Total Price
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>
                                                {item?.total_line_item_price
                                                  ? Number(item.total_line_item_price).toFixed(2)
                                                  : "0.00"}
                                              </p>
                                            </Col>
                                            <Col lg="2" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`product_code-${idx}`}
                                                >
                                                  Prod Code/Name
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{`${item?.product_code} - ${item?.product_description}`}</p>
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
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label htmlFor={`hsn-${idx}`}>
                                                  HSN Code
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.hsn}</p>
                                              {errors[`hsn-${idx}`] && (
                                                <div className="text-danger">
                                                  {errors[`hsn-${idx}`]}
                                                </div>
                                              )}
                                            </Col>
                                            {/* <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`product_description-${idx}`}
                                                >
                                                  Prod Desc
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <div>
                                                {item.product_description}
                                              </div>
                                            </Col> */}
                                            <Col lg="2" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`vendor_prod_description-${idx}`}
                                                >
                                                  Vendor Prod Desc
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <div>
                                                {item.vendor_prod_description}
                                              </div>
                                            </Col>
                                            {/* <Col lg="2" className="mb-2">
                                              <div className="">
                                                {idx == 0 ? (
                                                  <Label htmlFor={`delivery_date-${idx}`}>
                                                    Delivery Date
                                                  </Label>
                                                ) : (
                                                  ""
                                                )}
                                                <FormGroup>
                                                  <InputGroup>
                                                    <Flatpickr
                                                      placeholder="dd M, yyyy"
                                                      options={{
                                                        altInput: true,
                                                        altFormat: "j F, Y",
                                                        dateFormat: "Y-m-d",
                                                      }}
                                                      value={moment(item?.delivery_date, "DD/MM/YYYY").toDate()}
                                                      onChange={selectedDates => {
                                                        const selectedDate = moment(selectedDates[0]).format("DD/MM/YYYY");
                                                        const docDate = moment(formData?.po_date, "DD/MM/YYYY");

                                                        if (moment(selectedDates[0]).isBefore(docDate)) {
                                                          // Set an error for this field
                                                          setFormErrors(prevErrors => ({
                                                            ...prevErrors,
                                                            [`delivery_date_${idx}`]: "Delivery Date cannot be before Document Date.",
                                                          }));
                                                        } else {
                                                          // Clear the error and update the state
                                                          setFormErrors(prevErrors => ({
                                                            ...prevErrors,
                                                            [`delivery_date_${idx}`]: undefined,
                                                          }));
                                                          handleInputChange(idx, "delivery_date", selectedDate);
                                                        }
                                                      }}
                                                    />
                                                  </InputGroup>
                                                  {formErrors[`delivery_date_${idx}`] && (
                                                    <div style={{ color: "#f46a6a", fontSize: "0.875rem" }}>
                                                      {formErrors[`delivery_date_${idx}`]}
                                                    </div>
                                                  )}
                                                </FormGroup>
                                              </div>
                                            </Col> */}

                                            <Col lg="2" className="mb-2">
                                              <div className="">
                                                {idx == 0 ? (
                                                  <RequiredLabel
                                                    htmlFor={`delivery_date_-${idx}`}
                                                    label="Delivery Date"
                                                  />
                                                ) : (
                                                  ""
                                                )}
                                                <FormGroup>
                                                  <InputGroup>
                                                    <div
                                                      style={{
                                                        border:
                                                          isSubmitted &&
                                                            (!item.delivery_date_ ||
                                                              item.delivery_date_.trim() ===
                                                              "")
                                                            ? "1px solid rgba(255, 0, 0, 0.6)"
                                                            : "none",
                                                        borderRadius: "0.26rem",
                                                      }}
                                                    >
                                                      <Flatpickr
                                                        placeholder="dd M, yyyy"
                                                        options={{
                                                          altInput: true,
                                                          altFormat: "j F, Y",
                                                          dateFormat: "Y-m-d",
                                                          minDate:
                                                            poDocDate || "today",
                                                        }}
                                                        onOpen={(
                                                          selectedDates,
                                                          dateStr,
                                                          instance
                                                        ) => {
                                                          if (poDocDate) {
                                                            instance.setDate(
                                                              poDocDate,
                                                              false
                                                            );
                                                            instance.jumpToDate(
                                                              poDocDate
                                                            );
                                                          }
                                                        }}
                                                        value={moment(
                                                          item?.delivery_date_,
                                                          "DD/MM/YYYY"
                                                        ).toDate()}
                                                        onChange={(
                                                          selectedDates,
                                                          dateStr
                                                        ) => {
                                                          handleInputChange(
                                                            idx,
                                                            "delivery_date_",
                                                            moment(
                                                              selectedDates[0]
                                                            ).format("DD/MM/YYYY")
                                                          );
                                                        }}
                                                        className={`form-control ${isSubmitted &&
                                                          (!item.delivery_date_ ||
                                                            item.delivery_date_.trim() ===
                                                            "")
                                                          ? "border-danger"
                                                          : ""
                                                          }`}
                                                      />
                                                    </div>
                                                  </InputGroup>
                                                </FormGroup>
                                              </div>
                                            </Col>


                                            <Col lg="2" className="mb-3">
                                              <div className="">
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  {idx === 0 ? (
                                                    <Label
                                                      htmlFor={`warehouse-${idx}`}
                                                      style={{
                                                        marginRight: "0.5rem",
                                                      }}
                                                    >
                                                      Plant
                                                    </Label>
                                                  ) : null}
                                                </div>

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
                                                  options={
                                                    optionProductLocation
                                                  }
                                                  onChange={selected =>
                                                    handleInputChange(
                                                      idx,
                                                      "location",
                                                      selected
                                                    )
                                                  }
                                                />
                                              </div>
                                            </Col>

                                            {/* <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`free_of_charge-${idx}`}
                                                >
                                                  Free Charge
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <Input
                                                type="checkbox"
                                                checked={item.free_of_charge}
                                                onChange={e => {
                                                  handleInputChange(
                                                    idx,
                                                    "free_of_charge",
                                                    e.target.checked
                                                  );
                                                  handleInputChange(
                                                    idx,
                                                    "total_net_value",
                                                    e.target.checked == true
                                                      ? 0
                                                      : ""
                                                  );
                                                  handleInputChange(
                                                    idx,
                                                    "tax_amount",
                                                    e.target.checked == true
                                                      ? 0
                                                      : ""
                                                  );
                                                  handleInputChange(
                                                    idx,
                                                    "net_price",
                                                    e.target.checked == true
                                                      ? 0
                                                      : ""
                                                  );
                                                  handleInputChange(
                                                    idx,
                                                    "total_line_item_price",
                                                    e.target.checked == true
                                                      ? 0
                                                      : item?.total_line_item_price
                                                  );
                                                  if (
                                                    e.target.checked == false
                                                  ) {
                                                    handleInputChange(
                                                      idx,
                                                      "tax_per",
                                                      ""
                                                    );
                                                  }
                                                }}
                                                id={`free_of_charge-${idx}`}
                                                name="free_of_charge"
                                              />
                                              {errors[`free_of_charge-${idx}`] && (
                                            <div className="text-danger">
                                              {errors[`free_of_charge-${idx}`]}
                                            </div>
                                          )}
                                            </Col> */}
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label htmlFor={`free_of_charge-${idx}`}>Free Charge</Label>
                                              ) : (
                                                ""
                                              )}
                                              <div>
                                                <Input
                                                  type="checkbox"
                                                  className="ms-2"
                                                  checked={item.free_of_charge}
                                                  onChange={e => {
                                                    handleInputChange(idx, "free_of_charge", e.target.checked);
                                                    handleInputChange(idx, "total_net_value", e.target.checked ? 0 : "");
                                                    handleInputChange(idx, "tax_amount", e.target.checked ? 0 : "");
                                                    handleInputChange(idx, "net_price", e.target.checked ? 0 : "");
                                                    handleInputChange(idx, "total_line_item_price", e.target.checked ? 0 : item?.total_line_item_price);
                                                    if (e.target.checked == false) {
                                                      handleInputChange(idx, "tax_per", "");
                                                    }
                                                  }}
                                                  id={`free_of_charge-${idx}`}
                                                  name="free_of_charge"
                                                />
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
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </CardBody>
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

export default CreatePurchaseOrder;
