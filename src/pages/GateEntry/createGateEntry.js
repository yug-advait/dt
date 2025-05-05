import React, { useEffect, useState, useCallback } from "react";
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
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import "flatpickr/dist/themes/material_blue.css";
import { getSelectData } from "helpers/Api/api_common";
import { getGateEntryDocTypeById } from "helpers/Api/api_gateEntryDocType";
import { getGoodReceipt } from "helpers/Api/api_goodReceipt";
import moment from "moment";
import { ADD_GATEENTRY_REQUEST } from "../../store/gateEntry/actionTypes";
import Loader from "../../components/Common/Loader";
import "../../assets/scss/custom/pages/__loader.scss";

const createGateEntry = () => {
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
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const today = new Date();
  const [userData, setUserdata] = useState();
  const todayDate = moment(today).format("Do MMMM YYYY, h:mm:ss A");
  const history = useHistory();
  const location = useLocation();
  const { GateInbound, selectvehicaltype } = location.state;
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [grnPermission, setGrnPermission] = useState();
  const [optionDropDownItems, setOptionDropDownItems] = useState([]);
  const [selectGateEntryDocType, setSelectedGateEntryDocType] = useState({});
  const [optionGateEntryDocType, setOptionGateEntryDocType] = useState([]);
  const [GRNLineItemList, setGRNLineItemList] = useState([]);
  const { addGateEntry } = useSelector(state => state.gateEntry);
  const [selectedGRNValues, setselectedGRNValues] = useState([]);
  const [optionProductPlant, setOptionProductPlant] = useState([]);
  const [optionProductLocation, setOptionProductLocation] = useState([]);
  const [selectGateNo, setSelectedGateNo] = useState({});
  const [optionGateNo, setOptionGateNo] = useState([]);
  const [originalGRNLineItemList, setOriginalGRNLineItemList] = useState([]);
  const [selectPurpose, setSelectedPurpose] = useState({});
  const [optionPurpose, setOptionPurpose] = useState([]);
  const [selectGatePassType, setSelectedGatePassType] = useState({});
  const [optionGatePassType, setOptionGatePassType] = useState([]);
  const [selectGatePassStatus, setSelectedGatePassStatus] = useState({});
  const [optionGatePassStatus, setOptionGatePassStatus] = useState([]);
  const dropdownList = async () => {
    var selectedRows = [];
    if (location.state && location.state?.LineItem.length > 0) {
      selectedRows = location?.state?.LineItem;
    } else {
      const getGoodReceiptListData = await getGoodReceipt();
      selectedRows = getGoodReceiptListData?.openGrnList;
    }
    const uniquePrNos = new Set();
    const uniqueRows = selectedRows?.filter(row => {
      if (GateInbound == true) {
        if (!uniquePrNos.has(row.asn_no)) {
          uniquePrNos.add(row.asn_no);
          return true;
        }
      } else {
        if (!uniquePrNos.has(row.grn_no)) {
          uniquePrNos.add(row.grn_no);
          return true;
        }
      }
      return false;
    });
    // Map unique rows to the desired options format
    const options = uniqueRows?.map(row => ({
      value: row.id,
      label: GateInbound == true ? row.asn_no : row.grn_no,
    }));
    setOptionDropDownItems(options);
    setselectedGRNValues(options);
    setFormData(prevData => ({
      ...prevData,
      grn_no: options,
    }));
    const selectedRowsData = selectedRows?.map((item, index) => {
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
        grn_no: GateInbound == true ? item?.asn_no : item?.grn_no,
        asn_grn_id: GateInbound == true ? item?.asn_id : item?.grn_id,
        po_line_item_id: item?.po_line_item_id,
        asn_grn_line_item: item?.del_line_item,
        gate_line_item: 10 * (index + 1),
        product_id: item?.product_id,
        product_group_id: item?.product_group_id,
        product_description: item?.product_description,
        vendor_prod_description: item?.vendor_prod_description,
        asn_grn_quantity: GateInbound == true ? item?.delivery_quantity : item?.grn_quantity,
        gate_quantity: "",
        delivery_quantity: item?.delivery_quantity,
        putaway_quantity: GateInbound == true ? item?.delivery_quantity : item?.putaway_quantity,
        open_delivery_quantity:
          GateInbound == true ? item?.delivery_quantity : item?.open_delivery_quantity,
        sequence_no: "",
        uom: item?.uom,
        delivery_gr_date: moment(item?.delivery_gr_date).format("DD/MM/YYYY"),
        product_code: item?.product_code,
        location: item?.location_code,
        warehouse: item?.warehouse_code,
        batch_count: item?.batch_count,
        batch_numbers: item?.batch_numbers,
      };
    });
    setGRNLineItemList(selectedRowsData);

    const selectDocTypeData = await getSelectData(
      "gate_entry_doc_type",
      "",
      "gate_entry_doc_type_master"
    );
    setOptionGateEntryDocType(selectDocTypeData?.getDataByColNameData);

    const selectPlantData = await getSelectData(
      "plant_code",
      "",
      "warehouse_master"
    );
    setOptionProductPlant(selectPlantData?.getDataByColNameData);
    const selectGateNoData = await getSelectData(
      "key",
      "GateNo",
      "site_settings"
    );
    setOptionGateNo(selectGateNoData?.getDataByColNameData);

    const selectPurposeData = await getSelectData(
      "key",
      "Purpose",
      "site_settings"
    );
    setOptionPurpose(selectPurposeData?.getDataByColNameData);

    const selectGatePassTypeData = await getSelectData(
      "key",
      "GatePassType",
      "site_settings"
    );
    setOptionGatePassType(selectGatePassTypeData?.getDataByColNameData);

    const selectGatePassStatusData = await getSelectData(
      "key",
      "GPStatus",
      "site_settings"
    );
    setOptionGatePassStatus(selectGatePassStatusData?.getDataByColNameData);

    const selectLocationData = await getSelectData("code", "", "location_code");
    setOptionProductLocation(selectLocationData?.getDataByColNameData);
  };

  const handleInputGateNoChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectGateNoData = await getSelectData(
          "key",
          "GateNo",
          "site_settings"
        );
        setOptionGateNo(selectGateNoData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const handleInputPurposeChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectPurposeData = await getSelectData(
          "key",
          "Purpose",
          "site_settings"
        );
        setOptionPurpose(selectPurposeData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const handleInputGatePassTypeChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectGatePassTypeData = await getSelectData(
          "key",
          "GatePassType",
          "site_settings"
        );
        setOptionGatePassType(selectGatePassTypeData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );
  const handleInputGatePassStatusChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectGatePassStatusData = await getSelectData(
          "key",
          "GPStatus",
          "site_settings"
        );
        setOptionGatePassStatus(selectGatePassStatusData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const selectedLabels = selectedGRNValues?.map(item => item.label);
  const grnFilteredItems = GRNLineItemList?.filter(item =>
    selectedLabels.includes(item.grn_no)
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

  const GRNNumber = formData?.grn_no == undefined ? [] : formData?.grn_no;
  const Grnlabels = GRNNumber?.map(po => po.label);

  const handleInputChange = (index, fieldName, value) => {
    const newLineItems = [...GRNLineItemList];
    newLineItems[index][fieldName] = value;
    setGRNLineItemList(newLineItems);
    validateField(`${fieldName}-${index}`, value);
  };

  const handleInputChanges = e => {
    const { name, value } = e.target;

    if (name === "driver_contact" || name === "contact_no") {
      if (Number(value) < 0) {
        setFormErrors(prevErrors => ({
          ...prevErrors,
          [name]: true
        }))
        return;
      }
      else {
        setFormErrors(prevErrors => ({
          ...prevErrors,
          [name]: false
        }))
      }
    }
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  function createSeries(...numbers) {
    const formattedNumbers = numbers?.map(num =>
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
    setFormData(prevData => ({
      ...prevData,
      vehical_number: selectvehicaltype?.label,
    }));
    setFormData(prevData => ({
      ...prevData,
      transporter_name: selectvehicaltype?.transporter,
    }));
    if (GateInbound == true) {
      setFormData(prevData => ({
        ...prevData,
        in_date: moment(today).format("Do MMMM YYYY"),
      }));
      setFormData(prevData => ({
        ...prevData,
        time_in: moment(today).format("h:mm:ss A"),
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        out_date: moment(today).format("Do MMMM YYYY"),
      }));
      setFormData(prevData => ({
        ...prevData,
        time_out: moment(today).format("h:mm:ss A"),
      }));
    }
    const userData = getUserData();
    setUserdata(userData?.user);
    var permissions = userData?.permissionList?.filter(
      permission => permission.sub_menu_name === "grn"
    );
    setGrnPermission(
      permissions.find(permission => permission.sub_menu_name === "grn")
    );
    if (addGateEntry?.success === true) {
      // setLoading(false);
      setToast(true);
      setToastMessage(addGateEntry?.message);
      setTimeout(() => {
        setLoading(false);
        setToast(false);
        history.push({
          pathname: "/gate_entry",
          state: { GateInbound: GateInbound },
        });
      }, 1000);
    } else {
      setLoading(false);
      if (addGateEntry?.success !== undefined && addGateEntry?.message) {
        setToast(true);
        setToastMessage(addGateEntry.message);
      }
      setTimeout(() => {
        setToast(false);
      }, 2000);
    }
  }, [addGateEntry]);

  useEffect(() => {
    if (GRNLineItemList.length > 0 && originalGRNLineItemList.length === 0) {
      setOriginalGRNLineItemList([...GRNLineItemList]);
    }
  }, [GRNLineItemList]);

  const handleInputGRNDocChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectDocTypeData = await getSelectData(
          "gate_entry_doc_type",
          inputValue,
          "gate_entry_doc_type_master"
        );
        setOptionGateEntryDocType(selectDocTypeData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const handleError = (idx, field, message) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${field}-${idx}`]: message,
    }));
  };

  const validateForm = () => {
    const errorsdata = {};
    let isValid = true;
    if (!formData.gate_doc_type_id) {
      errorsdata.gate_doc_type_id = true; // Error flag instead of "*"
      isValid = false;
    }
    if (!formData.purpose) {
      errorsdata.purpose = true;
      isValid = false;
    }
    if (!formData.gate_pass_status) {
      errorsdata.gate_pass_status = true;
      isValid = false;
    }
    if (!formData.gate_no) {
      errorsdata.gate_no = true;
      isValid = false;
    }
    if (!formData.contact_person) {
      errorsdata.contact_person = true;
      isValid = false;
    }
    if (!formData.gate_pass_type) {
      errorsdata.gate_pass_type = true;
      isValid = false;
    }
    if (!formData.vehical_number) {
      errorsdata.vehical_number = true;
      isValid = false;
    }
    if (!formData.driver_name) {
      errorsdata.driver_name = true;
      isValid = false;
    }
    if (!formData.driver_contact || Number(formData.driver_contact) < 0) {
      errorsdata.driver_contact = true;
      isValid = false;
    }
    if (!formData.license_no) {
      errorsdata.license_no = true;
      isValid = false;
    }
    if (!formData.transporter_name) {
      errorsdata.transporter_name = true;
      isValid = false;
    }
    if (!formData.vehical_type) {
      errorsdata.vehical_type = true;
      isValid = false;
    }
    if (!formData.contact_no || Number(formData.contact_no) < 0) {
      errorsdata.contact_no = true;
      isValid = false;
    }
    if (!formData.vehical_owner) {
      errorsdata.vehical_owner = true;
      isValid = false;
    }
    if (!formData.remarks) {
      errorsdata.remarks = true;
      isValid = false;
    }
    if (!formData.security_memo) {
      errorsdata.security_memo = true;
      isValid = false;
    }
    if (!formData.vendor_code) {
      errorsdata.vendor_code = true;
      isValid = false;
    }
    if (Grnlabels.length === 0) {
      errorsdata.grn_no = true;
      isValid = false;
    }
    if (!formData.gate_pass_no) {
      errorsdata.gate_pass_no = true;
      isValid = false;
    }


    if (GateInbound == true) {
      if (!formData.in_date) {
        errorsdata.in_date = "*";
        // errorsdata.in_date = "In Date is required";
      }
      if (!formData.time_in) {
        // errorsdata.time_in = "In Time is required";
        errorsdata.time_in = "*";
      }
    } else {
      if (!formData.out_date) {
        // errorsdata.out_date = "Out Date is required";
        errorsdata.out_date = "*";
      }
      if (!formData.time_out) {
        errorsdata.time_out = "*";
        // errorsdata.time_out = "Out Time is required";
      }
    }
    if (selectedGRNValues.length === 0) {
      errorsdata.approved_asns_grns = true;
      isValid = false;
    } else {
      GRNLineItemList.forEach((item, index) => {
        Object.keys(item).forEach((fieldName) => {
          if (`gate_quantity-${index}` === `${fieldName}-${index}`) {
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
      GateInbound,
      grnFilteredItems,
    };
    dispatch({
      type: ADD_GATEENTRY_REQUEST,
      payload: Data,
    });
  };

  const handleCancel = () => {
    history.push("/gate_entry");
  };

  document.title =
    "Detergent | Create Gate " + (GateInbound === true ? "InBound" : "OutBound");
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
                color={addGateEntry?.success ? "success" : "danger"}
                role="alert"
              >
                {toastMessage}
              </Alert>
            </div>
          )}

          {/* BreadCrumbs */}
          <Breadcrumbs
            titlePath="/gate_entry"
            title={GateInbound == true ? "Gate InBound" : "Gate OutBound"}
            breadcrumbItem={
              GateInbound == true ? "Gate InBound" : "Gate OutBound"
            }
          />

          {/*  Headers and Line Item */}
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
                                Gate Entry Doc. Type
                              </Label>
                              {formErrors.gate_doc_type_id && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.gate_doc_type_id}
                                </div>
                              )}
                            </div>
                            <Select
                              styles={{
                                ...customStyles,
                                control: (base, state) => ({
                                  ...base,
                                  borderColor: formErrors.gate_doc_type_id
                                    ? "#f46a6a"
                                    : base.borderColor, // Red border on error
                                }),
                              }}
                              value={selectGateEntryDocType}
                              options={optionGateEntryDocType}
                              onChange={async selectGateEntryDocType => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  gate_doc_type_id:
                                    selectGateEntryDocType?.value,
                                }));
                                setSelectedGateEntryDocType(
                                  selectGateEntryDocType
                                );
                                const getGateEntryDocTypeData =
                                  await getGateEntryDocTypeById(
                                    selectGateEntryDocType?.value
                                  );
                                setFormData(prevData => ({
                                  ...prevData,
                                  gate_pass_no:
                                    getGateEntryDocTypeData?.number_status ==
                                      null
                                      ? getGateEntryDocTypeData?.from_number
                                      : getGateEntryDocTypeData?.gate_entry_doc_type ==
                                        "GAST"
                                        ? createSeries(
                                          Number(
                                            getGateEntryDocTypeData?.number_status
                                          ) + 1
                                        )
                                        : Number(
                                          getGateEntryDocTypeData?.number_status
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
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Label
                              htmlFor="gate_pass_no"
                              style={{ marginRight: "0.5rem" }}
                            >
                              Gate Pass No.
                            </Label>
                            {formErrors.gate_pass_no && (
                              <div
                                style={{
                                  color: "#f46a6a",
                                  fontSize: "1.25rem",
                                }}
                              >
                                {formErrors.gate_pass_no}
                              </div>
                            )}
                          </div>
                          <p>{formData?.gate_pass_no}</p>
                        </Col>

                        <Col lg="2" className="mb-2">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Gate No.
                              </Label>
                              {formErrors.gate_no && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.gate_no}
                                </div>
                              )}
                            </div>
                            <Select
                              styles={{
                                ...customStyles,
                                control: (base, state) => ({
                                  ...base,
                                  borderColor: formErrors.gate_no
                                    ? "#f46a6a"
                                    : base.borderColor, // Red border on error
                                }),
                              }}
                              value={selectGateNo}
                              options={optionGateNo}
                              onChange={async selectGateNo => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  gate_no: selectGateNo?.value,
                                }));
                                setSelectedGateNo(selectGateNo);
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputGateNoChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>

                        <Col lg="2" className="mb-2">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Purpose
                              </Label>
                              {formErrors.purpose && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.purpose}
                                </div>
                              )}
                            </div>
                            <Select
                              styles={{
                                ...customStyles,
                                control: (base, state) => ({
                                  ...base,
                                  borderColor: formErrors.purpose
                                    ? "#f46a6a"
                                    : base.borderColor, // Red border on error
                                }),
                              }}
                              value={selectPurpose}
                              options={optionPurpose}
                              onChange={async selectPurpose => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  purpose: selectPurpose?.value,
                                }));
                                setSelectedPurpose(selectPurpose);
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputPurposeChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>

                        <Col md="2" className="mb-1">
                          <Label htmlFor="grn_no">Reference No.</Label>
                          <p>{Grnlabels.join(", ")}</p>
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

                      <Row>
                        <Col md="2" className="mb-1">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="contact_person"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Contact Person
                              </Label>
                              {formErrors.contact_person && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.contact_person}
                                </div>
                              )}
                            </div>
                            <Input
                              type="text"
                              id="contact_person"
                              name="contact_person"
                              value={formData?.contact_person || ""}
                              onChange={e => handleInputChanges(e)}
                              style={{
                                borderColor: formErrors.contact_person
                                  ? "#f46a6a"
                                  : undefined, // Red border on error
                              }}
                            />
                          </div>
                        </Col>

                        <Col lg="2" className="mb-2">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="gate_pass_type"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Gate Pass Type
                              </Label>
                              {formErrors.gate_pass_type && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.gate_pass_type}
                                </div>
                              )}
                            </div>
                            <Select
                              styles={{
                                ...customStyles,
                                control: base => ({
                                  ...base,
                                  borderColor: formErrors.gate_pass_type
                                    ? "#f46a6a"
                                    : base.borderColor, // Red border on error
                                  "&:hover": {
                                    borderColor: formErrors.gate_pass_type
                                      ? "#f46a6a"
                                      : base.borderColor, // Maintain red border on hover
                                  },
                                }),
                              }}
                              value={selectGatePassType}
                              options={optionGatePassType}
                              onChange={async selectGatePassType => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  gate_pass_type: selectGatePassType?.value,
                                }));
                                setSelectedGatePassType(selectGatePassType);
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputGatePassTypeChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>

                        <Col lg="2" className="mb-2">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="gate_pass_status"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Gate Pass Status
                              </Label>
                              {formErrors.gate_pass_status && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.gate_pass_status}
                                </div>
                              )}
                            </div>
                            <Select
                              styles={{
                                ...customStyles,
                                control: base => ({
                                  ...base,
                                  borderColor: formErrors.gate_pass_status
                                    ? "#f46a6a"
                                    : base.borderColor, // Red border on error
                                  "&:hover": {
                                    borderColor: formErrors.gate_pass_status
                                      ? "#f46a6a"
                                      : base.borderColor, // Maintain red border on hover
                                  },
                                }),
                              }}
                              value={selectGatePassStatus}
                              options={optionGatePassStatus}
                              onChange={async selectGatePassStatus => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  gate_pass_status: selectGatePassStatus?.value,
                                }));
                                setSelectedGatePassStatus(selectGatePassStatus);
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputGatePassStatusChange(inputValue);
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
                                htmlFor="security_memo"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Security Memo
                              </Label>
                              {formErrors.security_memo && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.security_memo}
                                </div>
                              )}
                            </div>
                            <Input
                              type="text"
                              id="security_memo"
                              name="security_memo"
                              value={formData?.security_memo || ""}
                              onChange={e => handleInputChanges(e)}
                              style={{
                                borderColor: formErrors.security_memo
                                  ? "#f46a6a"
                                  : undefined, // Red border on error
                              }}
                            />
                          </div>
                        </Col>
                        <Col lg="2" className="mb-2">
                          <Label htmlFor="formrow-state-Input">
                            Requisitioner
                          </Label>
                          <div>
                            <Label>{userData?.first_name}</Label>
                          </div>
                        </Col>

                        <Col md="2" className="mb-1">
                          <Label htmlFor="System_Date/Time">
                            System Date/Time
                          </Label>
                          <Label>{todayDate}</Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="2" className="mb-1">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="vehical_number"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Vehicle No.
                              </Label>
                              {formErrors.vehical_number && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.vehical_number}
                                </div>
                              )}
                            </div>
                            <Label>{formData?.vehical_number}</Label>
                            {/* <Input
                            type="text"
                            id="vehical_number"
                            name="vehical_number"
                            value={formData?.vehical_number || ""}
                            onChange={e => handleInputChanges(e)}
                            style={{
                              borderColor: formErrors.vehical_number
                                ? "#f46a6a"
                                : undefined, // Red border on error
                            }}
                          /> */}
                          </div>
                        </Col>

                        <Col md="2" className="mb-1">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="vehical_type"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Vehical Type
                              </Label>
                              {formErrors.vehical_type && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.vehical_type}
                                </div>
                              )}
                            </div>
                            <Input
                              type="text"
                              id="vehical_type"
                              name="vehical_type"
                              value={formData?.vehical_type || ""}
                              onChange={e => handleInputChanges(e)}
                              style={{
                                borderColor: formErrors.vehical_type
                                  ? "#f46a6a"
                                  : undefined, // Red border on error
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
                                htmlFor="driver_name"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Driver Name
                              </Label>
                              {formErrors.driver_name && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.driver_name}
                                </div>
                              )}
                            </div>
                            <Input
                              type="text"
                              id="driver_name"
                              name="driver_name"
                              value={formData?.driver_name || ""}
                              onChange={e => handleInputChanges(e)}
                              style={{
                                borderColor: formErrors.driver_name
                                  ? "#f46a6a"
                                  : undefined, // Red border on error
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
                                htmlFor="driver_contact"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Driver Contact
                              </Label>
                              {formErrors.driver_contact && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.driver_contact}
                                </div>
                              )}
                            </div>
                            <Input
                              type="number"
                              id="driver_contact"
                              name="driver_contact"
                              min="0"
                              value={formData?.driver_contact || ""}
                              onChange={e => handleInputChanges(e)}
                              style={{
                                borderColor: formErrors.driver_contact
                                  ? "#f46a6a"
                                  : undefined, // Red border on error
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
                                htmlFor="license_no"
                                style={{ marginRight: "0.5rem" }}
                              >
                                License No.
                              </Label>
                              {formErrors.license_no && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.license_no}
                                </div>
                              )}
                            </div>
                            <Input
                              type="text"
                              id="license_no"
                              name="license_no"
                              value={formData?.license_no || ""}
                              onChange={e => handleInputChanges(e)}
                              style={{
                                borderColor: formErrors.license_no
                                  ? "#f46a6a"
                                  : undefined, // Red border on error
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
                                htmlFor="transporter_name"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Transporter Name
                              </Label>
                              {formErrors.transporter_name && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.transporter_name}
                                </div>
                              )}
                            </div>
                            <Label>{formData?.transporter_name}</Label>
                            {/* <Input
                            type="text"
                            id="transporter_name"
                            name="transporter_name"
                            value={formData?.transporter_name || ""}
                            onChange={e => handleInputChanges(e)}
                            style={{
                              borderColor: formErrors.transporter_name
                                ? "#f46a6a"
                                : undefined, // Red border on error
                            }}
                          /> */}
                          </div>
                        </Col>

                        <Col md="2" className="mb-1">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="contact_no"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Contact No.
                              </Label>
                              {formErrors.contact_no && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.contact_no}
                                </div>
                              )}
                            </div>
                            <Input
                              type="number"
                              id="contact_no"
                              name="contact_no"
                              min="0"
                              value={formData?.contact_no || ""}
                              onChange={e => handleInputChanges(e)}
                              style={{
                                borderColor: formErrors.contact_no
                                  ? "#f46a6a"
                                  : undefined, // Red border on error
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
                                htmlFor="vehical_owner"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Vehical Owner
                              </Label>
                              {formErrors.vehical_owner && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.vehical_owner}
                                </div>
                              )}
                            </div>
                            <Input
                              type="text"
                              id="vehical_owner"
                              name="vehical_owner"
                              value={formData?.vehical_owner || ""}
                              onChange={e => handleInputChanges(e)}
                              style={{
                                borderColor: formErrors.vehical_owner
                                  ? "#f46a6a"
                                  : undefined, // Red border on error
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
                                htmlFor="remarks"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Remarks
                              </Label>
                              {formErrors.remarks && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.remarks}
                                </div>
                              )}
                            </div>
                            <Input
                              type="text"
                              id="remarks"
                              name="remarks"
                              value={formData?.remarks || ""}
                              onChange={e => handleInputChanges(e)}
                              style={{
                                borderColor: formErrors.remarks
                                  ? "#f46a6a"
                                  : undefined, // Red border on error
                              }}
                            />
                          </div>
                        </Col>
                        {GateInbound == true ? (
                          <>
                            {" "}
                            <Col md="2" className="mb-2">
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Label
                                    htmlFor="formrow-in-date-Input"
                                    style={{ marginRight: "0.5rem" }}
                                  >
                                    In Date
                                  </Label>
                                  {formErrors.in_date && (
                                    <div
                                      style={{
                                        color: "#f46a6a",
                                        fontSize: "1.25rem",
                                      }}
                                    >
                                      {formErrors.in_date}
                                    </div>
                                  )}
                                </div>
                                <Label>{formData?.in_date}</Label>
                              </div>
                            </Col>
                            <Col md="2" className="mb-2">
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Label
                                    htmlFor="formrow-time-in-Input"
                                    style={{ marginRight: "0.5rem" }}
                                  >
                                    Time In
                                  </Label>
                                  {formErrors.time_in && (
                                    <div
                                      style={{
                                        color: "#f46a6a",
                                        fontSize: "1.25rem",
                                      }}
                                    >
                                      {formErrors.time_in}
                                    </div>
                                  )}
                                </div>
                                <Label>{formData?.time_in}</Label>
                              </div>
                            </Col>
                          </>
                        ) : (
                          <>
                            <Col md="2" className="mb-2">
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Label
                                    htmlFor="formrow-out-date-Input"
                                    style={{ marginRight: "0.5rem" }}
                                  >
                                    Out Date
                                  </Label>
                                  {formErrors.out_date && (
                                    <div
                                      style={{
                                        color: "#f46a6a",
                                        fontSize: "1.25rem",
                                      }}
                                    >
                                      {formErrors.out_date}
                                    </div>
                                  )}
                                </div>
                                <Label>{formData?.out_date}</Label>
                              </div>
                            </Col>
                            <Col md="2" className="mb-2">
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Label
                                    htmlFor="formrow-time-out-Input"
                                    style={{ marginRight: "0.5rem" }}
                                  >
                                    Time Out
                                  </Label>
                                  {formErrors.time_out && (
                                    <div
                                      style={{
                                        color: "#f46a6a",
                                        fontSize: "1.25rem",
                                      }}
                                    >
                                      {formErrors.time_out}
                                    </div>
                                  )}
                                </div>
                                <Label>{formData?.time_out}</Label>
                              </div>
                            </Col>
                          </>
                        )}
                      </Row>
                      <Row>
                        <CardTitle className="mb-4"></CardTitle>
                        <Col lg="3">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Label>
                              Approved {GateInbound == true ? "ASNs" : "GRNs"}
                            </Label>
                            {formErrors.approved_asns_grns && (
                              <div
                                className="text-danger"
                                style={{
                                  marginLeft: "0.5rem",
                                  fontSize: "1.25rem",
                                }}
                              >
                                {formErrors.approved_asns_grns}
                              </div>
                            )}
                          </div>
                          <Select
                            isMulti
                            multiple
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={selectedGRNValues}
                            options={optionDropDownItems}
                            onChange={async selectedGRNValues => {
                              setselectedGRNValues(selectedGRNValues);
                              setFormData(prevData => ({
                                ...prevData,
                                grn_no: selectedGRNValues,
                              }));
                              const selectedLabels = selectedGRNValues.map(
                                item => item.label
                              );
                              const grnFilteredItems = originalGRNLineItemList.filter(item =>
                                selectedLabels.includes(item.grn_no)
                              );
                              setGRNLineItemList(grnFilteredItems);
                            }}
                            styles={{
                              control: provided => ({
                                ...provided,
                                borderColor: formErrors.approved_asns_grns
                                  ? "#f46a6a"
                                  : provided.borderColor, // Red border for errors
                              }),
                            }}
                          ></Select>
                        </Col>
                      </Row>

                      <CardTitle className="mb-4"></CardTitle>

                      <Row>
                        <Col lg="12">
                          <Table style={{ width: "100%" }}>
                            <tbody>
                              {grnFilteredItems?.map((item, idx) => (
                                <tr
                                  style={{
                                    borderBottom:
                                      idx < grnFilteredItems.length - 1
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
                                                {idx === 0 && (
                                                  <Label
                                                    htmlFor={`gate_line_item-${idx}`}
                                                    style={{
                                                      marginRight: "0.5rem",
                                                    }}
                                                  >
                                                    Line No.
                                                  </Label>
                                                )}
                                                {errors[
                                                  `gate_line_item-${idx}`
                                                ] && (
                                                    <div
                                                      className="text-danger"
                                                      style={{
                                                        fontSize: "1.25rem",
                                                      }}
                                                    >
                                                      {
                                                        errors[
                                                        `gate_line_item-${idx}`
                                                        ]
                                                      }
                                                    </div>
                                                  )}
                                              </div>
                                              <Input
                                                type="number"
                                                value={item.gate_line_item}
                                                onChange={e =>
                                                  handleInputChange(
                                                    idx,
                                                    "gate_line_item",
                                                    e.target.value
                                                  )
                                                }
                                                id={`gate_line_item-${idx}`}
                                                name="gate_line_item"
                                                className="form-control-sm"
                                                style={{
                                                  borderColor: errors[
                                                    `gate_line_item-${idx}`
                                                  ]
                                                    ? "#f46a6a"
                                                    : undefined, // Red border on error
                                                }}
                                              />
                                            </div>
                                          </Col>

                                          <Col lg="1" className="mb-1">
                                            {idx === 0 ? (
                                              <Label
                                                htmlFor={`asn_grn_line_item-${idx}`}
                                              >
                                                {GateInbound == true ? "ASN LineNo." : "GRN LineNo."}
                                              </Label>
                                            ) : (
                                              ""
                                            )}
                                            <p>{item?.asn_grn_line_item}</p>
                                            {errors[`asn_grn_line_item-${idx}`] && (
                                              <div className="text-danger">
                                                {errors[`asn_grn_line_item-${idx}`]}
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
                                                >
                                                  Seq. No.
                                                </Label>
                                              )}
                                              {errors[`sequence_no-${idx}`] && (
                                                <div
                                                  className="text-danger"
                                                  style={{
                                                    fontSize: "1.25rem",
                                                  }}
                                                >
                                                  {errors[`sequence_no-${idx}`]}
                                                </div>
                                              )}
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
                                              {idx == 0 ? (
                                                <Label
                                                  htmlFor={`delivery_quantity-${idx}`}
                                                >
                                                  Del. Qty.
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.delivery_quantity}</p>
                                            </div>
                                          </Col>
                                          {GateInbound != true ? (
                                            <>
                                              <Col lg="1" className="mb-1">
                                                <div className="">
                                                  {idx == 0 ? (
                                                    <Label
                                                      htmlFor={`putaway_quantity-${idx}`}
                                                    >
                                                      Put Qty.
                                                    </Label>
                                                  ) : (
                                                    ""
                                                  )}
                                                  <p>
                                                    {item?.putaway_quantity}
                                                  </p>
                                                </div>
                                              </Col>
                                              <Col lg="1" className="mb-1">
                                                <div className="">
                                                  {idx == 0 ? (
                                                    <Label
                                                      htmlFor={`open_delivery_quantity-${idx}`}
                                                    >
                                                      Open Qty.
                                                    </Label>
                                                  ) : (
                                                    ""
                                                  )}
                                                  <p>
                                                    {
                                                      item?.open_delivery_quantity
                                                    }
                                                  </p>
                                                </div>
                                              </Col>{" "}
                                            </>
                                          ) : null}

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
                                                    htmlFor={`gate_quantity-${idx}`}
                                                    style={{
                                                      marginRight: "0.5rem",
                                                    }}
                                                  >
                                                    Quantity
                                                  </Label>
                                                )}
                                                {errors[`gate_quantity-${idx}`] && (
                                                  <div
                                                    className="text-danger"
                                                    style={{
                                                      fontSize: "1.25rem",
                                                    }}
                                                  >
                                                    {errors[`gate_quantity-${idx}`]}
                                                  </div>
                                                )}
                                              </div>
                                              <Input
                                                type="number"
                                                value={item.gate_quantity || ""}
                                                onChange={(e) => {
                                                  const value = e.target.value;

                                                  // Validation: Ensure quantity is not more than Del Qty
                                                  if (
                                                    value === "" ||
                                                    (Number(value) > 0 &&
                                                      Number.isInteger(Number(value)) &&
                                                      Number(value) <= item.delivery_quantity)
                                                  ) {
                                                    handleInputChange(idx, "gate_quantity", value);
                                                  } else {
                                                    // Show an error message if the value exceeds Del Qty
                                                    handleError(
                                                      idx,
                                                      `gate_quantity`,
                                                      ``
                                                    );
                                                  }
                                                }}
                                                id={`gate_quantity-${idx}`}
                                                className="form-control-sm"
                                                min="1"
                                                style={{
                                                  borderColor: errors[`gate_quantity-${idx}`] ? "#f46a6a" : undefined, // Red border on error
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
                        {/* {grnPermission && grnPermission?.can_add && ( */}
                        <Button
                          disabled={loading}
                          onClick={() => handleSave()}
                          color="primary"
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

export default createGateEntry;
