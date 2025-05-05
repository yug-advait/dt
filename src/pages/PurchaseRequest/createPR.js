import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Button,
  Card,
  CardBody,
  Table,
  CardTitle,
  Col,
  Form,
  InputGroup,
  FormGroup,
  Input,
  Label,
  Row,
  Alert,
} from "reactstrap";
import Select from "react-select";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useLocation, useHistory } from "react-router-dom";
import debounce from "lodash/debounce";
import { ADD_PR_REQUEST } from "../../store/purchaseRequest/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import { getSelectData } from "helpers/Api/api_common";
import { getProductsByID } from "helpers/Api/api_products";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import { getPrDocTypeById } from "helpers/Api/api_prDocType";
import Loader from "../../components/Common/Loader";
import "../../assets/scss/custom/pages/__loader.scss";
import RequiredLabel from "components/Common/RequiredLabel";

const createPR = () => {
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
  const todayDate = moment(today).format("Do MMMM YYYY, h:mm a");
  const history = useHistory();
  const dispatch = useDispatch();
  const { addPr } = useSelector(state => state.purchaseRequest);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const location = useLocation();
  const { editPR } = location.state || {};
  const [toast, setToast] = useState(false);
  const [prPermission, setPrPermission] = useState();
  const [userData, setUserdata] = useState();
  const [toastMessage, setToastMessage] = useState();
  const [optionProductCode, setOptionProductCode] = useState([]);
  const [optionProductGroup, setOptionProductGroup] = useState([]);
  const [optionProductPlant, setOptionProductPlant] = useState([]);
  const [optionProductLocation, setOptionProductLocation] = useState([]);
  const [optionProductUOM, setOptionProductUOM] = useState([]);
  const [selectPRDocType, setSelectedPRDocType] = useState({});
  const [optionPRDocType, setOptionPRDocType] = useState([]);
  const [selectPurchaseGroup, setSelectedPurchaseGroup] = useState({});
  const [optionPurchaseGroup, setOptionPurchaseGroup] = useState([]);
  const [selectPurchaseOrganization, setSelectedPurchaseOrganization] =
    useState({});
  const [optionPurchaseOrganization, setOptionPurchaseOrganization] = useState(
    []
  );
  const [prDocDate, setPrDocDate] = useState(null);
  const [lineItems, setLineItems] = useState([
    {
      lineNo: 10,
      productCode: "",
      productGroup: "",
      productDesc: "",
      vendorProductDesc: "",
      quantity: "",
      uom: "",
      deliveryDate: "",
      warehouse: "",
      location: "",
      gst_classification_id: ""
    },
  ]);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
      const instance = flatpickrRef.current.flatpickr;
      if (instance.altInput) {
        instance.altInput.style.borderColor = formErrors.pr_date
          ? "red"
          : "#ced4da";
      }
    }
  }, [formErrors.pr_date]);

  const handleAddRowNested = () => {
    const newLineNo =
      lineItems.length > 0 ? parseInt(lineItems[lineItems.length - 1].lineNo) + parseInt(10) : 10;
    setLineItems([
      ...lineItems,
      {
        lineNo: newLineNo,
        productCode: "",
        productGroup: "",
        productDesc: "",
        vendorProductDesc: "",
        quantity: "",
        uom: "",
        deliveryDate: "",
        warehouse: "",
        location: "",
        gst_classification_id: ""
      },
    ]);
  };

  const handleRemoveRowNested = idx => {
    const newLineItems = [...lineItems];
    newLineItems.splice(idx, 1);
    setLineItems(newLineItems);
  };

  const handleInputChange = (index, fieldName, value) => {
    const newLineItems = [...lineItems];
    newLineItems[index][fieldName] = value;
    setLineItems(newLineItems);
    validateField(`${fieldName}-${index}`, value);
  };

  const handleInputPRDocChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectDocTypeData = await getSelectData(
          "pr_doc_type_description",
          inputValue,
          "pr_doc_type_master"
        );
        setOptionPRDocType(selectDocTypeData?.getDataByColNameData);
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
  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };
  const dropdownList = async () => {
    const selectDocTypeData = await getSelectData(
      "pr_doc_type_description",
      "",
      "pr_doc_type_master"
    );
    setOptionPRDocType(selectDocTypeData?.getDataByColNameData);
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
    const selectData = await getSelectData(
      "product_code",
      "",
      "product_master"
    );
    setOptionProductCode(selectData?.getDataByColNameData);
    const selectPGroupData = await getSelectData(
      "division_code",
      "",
      "product_grouping_division"
    );
    setOptionProductGroup(selectPGroupData?.getDataByColNameData);
    const selectPlantData = await getSelectData(
      "plant_code",
      "",
      "warehouse_master"
    );
    setOptionProductPlant(selectPlantData?.getDataByColNameData);
    const selectLocationData = await getSelectData("code", "", "location_code");
    setOptionProductLocation(selectLocationData?.getDataByColNameData);
    const selectUomData = await getSelectData(
      "uom_description",
      "",
      "unit_of_measure"
    );
    setOptionProductUOM(selectUomData?.getDataByColNameData);
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

  useEffect(() => {
    dropdownList();
    const userData = getUserData();
    setUserdata(userData?.user);
    var permissions = userData?.permissionList.filter(
      permission => permission.sub_menu_name === "pr"
    );
    setPrPermission(
      permissions.find(permission => permission.sub_menu_name === "pr")
    );

    if (addPr?.success === true) {
      // setLoading(false);
      setToast(true);
      setToastMessage(addPr?.message);
      setTimeout(() => {
        setLoading(false);
        setToast(false);
        history.push("/purchase_request");
      }, 1000);
    } else {
      setLoading(false);
      if (addPr?.success !== undefined && addPr?.message) {
        setToast(true);
        setToastMessage(addPr.message);
      }
      setTimeout(() => {
        setToast(false);
      }, 2000);
    }
  }, [addPr]);

  // const validateField = (fieldName, value) => {
  //   let error;
  //   if (!value || value === "") {
  //     error = "*";
  //   }
  //   setErrors(prevErrors => ({
  //     ...prevErrors,
  //     [fieldName]: error,
  //   }));
  // };
  const validateField = (fieldName, value) => {
    let error = value ? null : true; // Set error to true if value is empty
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };
  

  const validateForm = () => {
    const errorsdata = {};
    let isValid = true;
    if (!formData.pr_doc_type_id) {
      errorsdata.pr_doc_type_id = true; // Error flag instead of a message
      isValid = false;
    }
    if (!formData.pr_no) {
      errorsdata.pr_no = true;
      isValid = false;
    }
    if (!formData.purchase_group_id) {
      errorsdata.purchase_group_id = true;
      isValid = false;
    }
    if (!formData.purchase_organisation_id) {
      errorsdata.purchase_organisation_id = true;
      isValid = false;
    }
    if (!formData.pr_date) {
      // errorsdata.pr_date = "PR DOC Date is required";
      errorsdata.pr_date = "*";
    }
 
    lineItems.forEach((item, index) => {
      Object.keys(item).forEach(fieldName => {
        if (!item[fieldName] || item[fieldName] === "") {
          validateField(`${fieldName}-${index}`, item[fieldName]);
          isValid = false;
        }
      });
    });
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
      lineItems,
    };
    dispatch({
      type: ADD_PR_REQUEST,
      payload: Data,
    });
  };
  console.log("🚀 ~ createPR ~ lineItems:", lineItems)


  const handleCancel = () => {
    history.push("/purchase_request");
  };
  const flatpickrRef = useRef(null);
  document.title = "Detergent | Create PR";
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          {toast && (
            <div
              className="position-fixed top-0 end-0 p-3"
              style={{ zIndex: "1005" }}
            >
              <Alert color={addPr?.success ? "success" : "danger"} role="alert">
                {toastMessage}
              </Alert>
            </div>
          )}
          <Breadcrumbs
            titlePath="/purchase_request"
            title="PR"
            breadcrumbItem="Create PR"
          />
          {loading ? (
            <Loader />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <Col xs="12">
                      <Row data-repeater-item>
                        <Col lg="2" className="mb-2">
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                PR DOC Type
                              </Label>
                              {formErrors.pr_doc_type_id && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.pr_doc_type_id}
                                </div>
                              )}
                            </div>
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...provided,
                                  borderColor: formErrors.pr_doc_type_id
                                    ? "#f46a6a"
                                    : provided.borderColor,
                                  "&:hover": {
                                    borderColor: formErrors.pr_doc_type_id
                                      ? "green"
                                      : provided.borderColor,
                                  },
                                }),
                              }}
                              value={selectPRDocType}
                              options={optionPRDocType}
                              onChange={async selectPRDocType => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  pr_doc_type_id: selectPRDocType?.value,
                                }));
                                setSelectedPRDocType(selectPRDocType);
                                const getPrDocTypeData = await getPrDocTypeById(
                                  selectPRDocType?.value
                                );
                                setFormData(prevData => ({
                                  ...prevData,
                                  pr_no:
                                    getPrDocTypeData?.number_status == null
                                      ? getPrDocTypeData?.from_number
                                      : getPrDocTypeData?.pr_doc_type === "PR"
                                      ? createSeries(
                                          Number(
                                            getPrDocTypeData?.number_status
                                          ) + 1
                                        )
                                      : Number(
                                          getPrDocTypeData?.number_status
                                        ) + 1,
                                }));
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputPRDocChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>

                        <Col lg="2" className="mb-1">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Label
                              htmlFor="formrow-state-Input"
                              style={{ marginRight: "0.5rem" }}
                            >
                              PR NO.
                            </Label>
                            {formErrors.pr_no && (
                              <div
                                style={{
                                  color: "#f46a6a",
                                  fontSize: "1.25rem",
                                }}
                              >
                                {formErrors.pr_no}
                              </div>
                            )}
                          </div>
                          <div>{formData?.pr_no}</div>
                        </Col>
                        <Col lg="2" className="mb-2">
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Buyer Organisation
                              </Label>
                              {formErrors.purchase_organisation_id && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.purchase_organisation_id}
                                </div>
                              )}
                            </div>
                            <Select
                              styles={{
                                ...customStyles,
                                control: provided => ({
                                  ...provided,
                                  borderColor:
                                    formErrors.purchase_organisation_id
                                      ? "#f46a6a"
                                      : provided.borderColor, // Change border color based on error
                                  "&:hover": {
                                    borderColor:
                                      formErrors.purchase_organisation_id
                                        ? "#f46a6a"
                                        : provided.borderColor, // Change border color on hover if there's an error
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

                        <Col lg="2" className="mb-2">
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Buyer Group
                              </Label>
                              {formErrors.purchase_group_id && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.purchase_group_id}
                                </div>
                              )}
                            </div>
                            <Select
                              styles={{
                                ...customStyles,
                                control: provided => ({
                                  ...provided,
                                  borderColor: formErrors.purchase_group_id
                                    ? "#f46a6a"
                                    : provided.borderColor, // Change border color based on error
                                  "&:hover": {
                                    borderColor: formErrors.purchase_group_id
                                      ? "#f46a6a"
                                      : provided.borderColor, // Change border color on hover if there's an error
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

                        {/* <Col lg="2" className="mb-2">
                          <div className="">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                PR DOC Date
                              </Label>
                              {formErrors.pr_date && (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {formErrors.pr_date}
                                </div>
                              )}
                            </div>
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
                                        customFlatpickrStyles
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
                                      pr_date: moment(selectedDates[0]).format(
                                        "DD/MM/YYYY"
                                      ),
                                    }));
                                  }}
                                  value={moment(
                                    formData?.pr_date,
                                    "DD/MM/YYYY"
                                  ).toDate()}
                                />
                              </InputGroup>
                            </FormGroup>
                          </div>
                        </Col> */}
                        <Col lg="2" className="mb-2">
                          <div className="">
                            <RequiredLabel
                              htmlFor="formrow-state-Input"
                              label="PR DOC Date"
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
                                      pr_date: formattedDate,
                                    }));
                                    setPrDocDate(selectedDates[0]);
                                  }}
                                  value={moment(
                                    formData?.pr_date,
                                    "DD/MM/YYYY"
                                  ).toDate()}
                                />
                              </InputGroup>
                            </FormGroup>
                          </div>
                        </Col>
                        <Col lg="2" className="mb-2">
                          <Label htmlFor="formrow-state-Input">
                            System Date/Time
                          </Label>
                          <Label>{todayDate}</Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="2" className="mb-2">
                          <Label htmlFor="formrow-state-Input">
                            Requisitioner
                          </Label>
                          <div>
                            <Label>{userData?.first_name}</Label>
                          </div>
                        </Col>
                        <Col lg="3" className="mb-2">
                          <Label htmlFor="formrow-state-Input">
                            Department
                          </Label>
                          <div>
                            <Label>{userData?.department_code}</Label>
                          </div>
                        </Col>
                      </Row>
                      {editPR && (
                        <Row>
                          {/* <div className="col-lg-2 mb-2">
                          <label
                            htmlFor="formrow-state-Input"
                            className="form-label"
                          >
                            Created By
                          </label>
                          <p className="form-input form-label">Name1</p>
                        </div> */}
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
                    </Col>
                    <CardTitle className="mb-4"></CardTitle>
                    <Button
                      onClick={handleAddRowNested}
                      //color="primary"
                      className="mt-3 mt-lg-0 btn-custom-theme"
                    >
                      Add line Item
                    </Button>
                    <CardTitle className="mb-4"></CardTitle>
                    <Table style={{ width: "100%" }}>
                      <tbody>
                        {lineItems.map((item, idx) => (
                          <tr
                            id={`addr${idx}`}
                            key={idx}
                            style={{
                              borderBottom:
                                idx < lineItems.length - 1
                                  ? "2px #000"
                                  : "none",
                            }}
                          >
                            <td>
                              <Form
                                className="repeater mt-3"
                                encType="multipart/form-data"
                              >
                                <div data-repeater-list="group-a">
                                  <Row data-repeater-item>
                                    <Col lg="2" className="mb-2">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {idx === 0 ? (
                                          <Label
                                            htmlFor={`lineNo-${idx}`}
                                            style={{ marginRight: "0.5rem" }}
                                          >
                                            Line No.
                                          </Label>
                                        ) : (
                                          ""
                                        )}
                                        {errors[`lineNo-${idx}`] && (
                                          <div
                                            className="text-danger"
                                            style={{
                                              marginLeft: "0.5rem",
                                              fontSize: "1.25rem",
                                            }}
                                          >
                                            {errors[`lineNo-${idx}`]}
                                          </div>
                                        )}
                                      </div>
                                      <Input
                                        type="number"
                                        value={item.lineNo}
                                        onChange={e => {
                                          const value = e.target.value;
                                          if (
                                            value === "" ||
                                            (Number(value) > 0 &&
                                              Number.isInteger(Number(value)))
                                          ) {
                                            handleInputChange(
                                              idx,
                                              "lineNo",
                                              value
                                            );
                                          }
                                        }}
                                        id={`lineNo-${idx}`}
                                        name="lineNo"
                                        className="form-control-sm"
                                        min="1"
                                        style={{
                                          borderColor: errors[`lineNo-${idx}`]
                                            ? "#f46a6a"
                                            : undefined, // Red border for errors
                                        }}
                                      />
                                    </Col>

                                    <Col lg="2" className="mb-2">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {idx === 0 ? (
                                          <Label
                                            htmlFor={`productCode-${idx}`}
                                            style={{ marginRight: "0.5rem" }}
                                          >
                                            Product Code
                                          </Label>
                                        ) : null}

                                        {errors[`productCode-${idx}`] && (
                                          <div
                                            className="text-danger"
                                            style={{
                                              marginLeft: "0.5rem",
                                              fontSize: "1.25rem",
                                            }}
                                          >
                                            {errors[`productCode-${idx}`]}
                                          </div>
                                        )}
                                      </div>

                                      <Select
                                        styles={{
                                          ...customStyles,
                                          control: base => ({
                                            ...base,
                                            borderColor: errors[
                                              `productCode-${idx}`
                                            ]
                                              ? "red"
                                              : base.borderColor,
                                          }),
                                        }}
                                        value={item.productCode || ""}
                                        options={optionProductCode}
                                        onChange={async selectProducts => {
                                          handleInputChange(
                                            idx,
                                            "productCode",
                                            selectProducts
                                          );

                                          const getProductsData =
                                            await getProductsByID(
                                              selectProducts?.value
                                            );
                                            console.log("getProductsData",getProductsData)
                                          handleInputChange(
                                            idx,
                                            "productDesc",
                                            getProductsData?.product_description
                                          );
                                          handleInputChange(
                                            idx,
                                            "gst_classification_id",
                                            getProductsData?.gst_classification_id
                                          )
                                        }}
                                      />
                                    </Col>

                                    <Col lg="3" className="mb-3">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {idx == 0 ? (
                                          <Label
                                            htmlFor={`productDesc-${idx}`}
                                            style={{ marginRight: "0.5rem" }}
                                          >
                                            Product Name
                                          </Label>
                                        ) : (
                                          ""
                                        )}

                                        {errors[`productDesc-${idx}`] && (
                                          <div
                                            className="text-danger"
                                            style={{
                                              marginLeft: "0.5rem",
                                              fontSize: "1.25rem",
                                            }}
                                          >
                                            {errors[`productDesc-${idx}`]}
                                          </div>
                                        )}
                                      </div>

                                      <Input
                                        type="textarea"
                                        value={item.productDesc || ""}
                                        onChange={e =>
                                          handleInputChange(
                                            idx,
                                            "productDesc",
                                            e.target.value
                                          )
                                        }
                                        id={`productDesc-${idx}`}
                                        className={`form-control-sm ${
                                          errors[`productDesc-${idx}`]
                                            ? "border-danger"
                                            : ""
                                        }`} // Add border-danger class for errors
                                      />
                                    </Col>

                                    <Col lg="2" className="mb-2">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {idx == 0 ? (
                                          <Label
                                            htmlFor={`productGroup-${idx}`}
                                            style={{ marginRight: "0.5rem" }}
                                          >
                                            Product Group
                                          </Label>
                                        ) : (
                                          ""
                                        )}

                                        {errors[`productGroup-${idx}`] && (
                                          <div
                                            className="text-danger"
                                            style={{
                                              marginLeft: "0.5rem",
                                              fontSize: "1.25rem",
                                            }}
                                          >
                                            {errors[`productGroup-${idx}`]}
                                          </div>
                                        )}
                                      </div>

                                      <Select
                                        styles={{
                                          ...customStyles,
                                          control: (provided, state) => ({
                                            ...provided,
                                            borderColor: errors[
                                              `productGroup-${idx}`
                                            ]
                                              ? "#f46a6a"
                                              : provided.borderColor, // Set red border if there's an error
                                            boxShadow: "none",
                                            "&:hover": {
                                              borderColor: errors[
                                                `productGroup-${idx}`
                                              ]
                                                ? "#f46a6a"
                                                : provided.borderColor, // Maintain hover effect
                                            },
                                          }),
                                        }}
                                        value={item.productGroup || ""}
                                        options={optionProductGroup}
                                        onChange={selected =>
                                          handleInputChange(
                                            idx,
                                            "productGroup",
                                            selected
                                          )
                                        }
                                      />
                                    </Col>

                                    <Col lg="3" className="mb-3">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {idx == 0 ? (
                                          <Label
                                            htmlFor={`vendorProductDesc-${idx}`}
                                            style={{ marginRight: "0.5rem" }}
                                          >
                                            Vendor Desc
                                          </Label>
                                        ) : (
                                          ""
                                        )}

                                        {errors[`vendorProductDesc-${idx}`] && (
                                          <div
                                            className="text-danger"
                                            style={{
                                              marginLeft: "0.5rem",
                                              fontSize: "1.25rem",
                                            }}
                                          >
                                            {errors[`vendorProductDesc-${idx}`]}
                                          </div>
                                        )}
                                      </div>

                                      <Input
                                        type="textarea"
                                        value={item.vendorProductDesc || ""}
                                        onChange={e =>
                                          handleInputChange(
                                            idx,
                                            "vendorProductDesc",
                                            e.target.value
                                          )
                                        }
                                        id={`vendorProductDesc-${idx}`}
                                        className={`form-control-sm ${
                                          errors[`vendorProductDesc-${idx}`]
                                            ? "border-danger"
                                            : ""
                                        }`} // Add 'border-danger' class for error
                                        style={{
                                          borderColor: errors[
                                            `vendorProductDesc-${idx}`
                                          ]
                                            ? "#f46a6a"
                                            : undefined,
                                        }} // Set red border if there's an error
                                      />
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
                                            htmlFor={`quantity-${idx}`}
                                            style={{ marginRight: "0.5rem" }}
                                          >
                                            Qty.
                                          </Label>
                                        )}

                                        {errors[`quantity-${idx}`] && (
                                          <div
                                            className="text-danger"
                                            style={{
                                              marginLeft: "0.5rem",
                                              fontSize: "1.25rem",
                                            }}
                                          >
                                            {errors[`quantity-${idx}`]}
                                          </div>
                                        )}
                                      </div>

                                      <Input
                                        type="number"
                                        value={item.quantity || ""}
                                        onChange={e => {
                                          const value = e.target.value;
                                          // Ensure the value is a positive number greater than zero
                                          if (
                                            value === "" ||
                                            (Number(value) > 0 &&
                                              Number.isInteger(Number(value)))
                                          ) {
                                            handleInputChange(
                                              idx,
                                              "quantity",
                                              value
                                            );
                                          }
                                        }}
                                        id={`quantity-${idx}`}
                                        className={`form-control-sm ${
                                          errors[`quantity-${idx}`]
                                            ? "border-danger"
                                            : ""
                                        }`} // Add 'border-danger' class for error
                                        style={{
                                          borderColor: errors[`quantity-${idx}`]
                                            ? "#f46a6a"
                                            : undefined,
                                        }} // Set red border if there's an error
                                        min="1" // Ensures that the number cannot be decreased below 1 using the number input's arrows
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
                                            style={{ marginRight: "0.5rem" }}
                                          >
                                            UOM
                                          </Label>
                                        ) : (
                                          ""
                                        )}

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
                                          control: (provided, state) => ({
                                            ...provided,
                                            borderColor: errors[`uom-${idx}`]
                                              ? "#f46a6a"
                                              : provided.borderColor, // Change border color if there's an error
                                            boxShadow: state.isFocused
                                              ? `0 0 0 1px ${
                                                  errors[`uom-${idx}`]
                                                    ? "#f46a6a"
                                                    : "#80bdff"
                                                }`
                                              : provided.boxShadow, // Add box shadow
                                            "&:hover": {
                                              borderColor: errors[`uom-${idx}`]
                                                ? "#f46a6a"
                                                : provided.borderColor, // Change hover border color if there's an error
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

                                    {/* <Col lg="2" className="mb-2">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {idx == 0 ? (
                                          <Label
                                            htmlFor={`deliveryDate-${idx}`}
                                            style={{ marginRight: "0.5rem" }}
                                          >
                                            Delivery Date
                                          </Label>
                                        ) : (
                                          ""
                                        )}

                                        {errors[`deliveryDate-${idx}`] && (
                                          <div
                                            className="text-danger"
                                            style={{
                                              marginLeft: "0.5rem",
                                              fontSize: "1.25rem",
                                            }}
                                          >
                                            {errors[`deliveryDate-${idx}`]}
                                          </div>
                                        )}
                                      </div>

                                      <FormGroup>
                                        <InputGroup>
                                          <Flatpickr
                                            placeholder="dd M, yyyy"
                                            options={{
                                              altInput: true,
                                              altFormat: "j F, Y",
                                              dateFormat: "Y-m-d",
                                              minDate: "today",
                                            }}
                                            value={moment(
                                              item?.deliveryDate,
                                              "DD/MM/YYYY"
                                            ).toDate()}
                                            onChange={(
                                              selectedDates,
                                              dateStr,
                                              instance
                                            ) => {
                                              handleInputChange(
                                                idx,
                                                "deliveryDate",
                                                moment(selectedDates[0]).format(
                                                  "DD/MM/YYYY"
                                                )
                                              );
                                            }}
                                          />
                                        </InputGroup>
                                      </FormGroup>
                                    </Col> */}
                                    <Col lg="2" className="mb-2">
                                      <div className="">
                                        {idx == 0 ? (
                                          <RequiredLabel
                                            htmlFor={`deliveryDate-${idx}`}
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
                                                  (!item.deliveryDate ||
                                                    item.deliveryDate.trim() ===
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
                                                    prDocDate || "today",
                                                }}
                                                onOpen={(
                                                  selectedDates,
                                                  dateStr,
                                                  instance
                                                ) => {
                                                  if (prDocDate) {
                                                    instance.setDate(
                                                      prDocDate,
                                                      false
                                                    );
                                                    instance.jumpToDate(
                                                      prDocDate
                                                    );
                                                  }
                                                }}
                                                value={moment(
                                                  item?.deliveryDate,
                                                  "DD/MM/YYYY"
                                                ).toDate()}
                                                onChange={(
                                                  selectedDates,
                                                  dateStr
                                                ) => {
                                                  handleInputChange(
                                                    idx,
                                                    "deliveryDate",
                                                    moment(
                                                      selectedDates[0]
                                                    ).format("DD/MM/YYYY")
                                                  );
                                                }}
                                                className={`form-control ${
                                                  isSubmitted &&
                                                  (!item.deliveryDate ||
                                                    item.deliveryDate.trim() ===
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
                                    <Col lg="3" className="mb-3">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {idx === 0 ? (
                                          <Label
                                            htmlFor={`warehouse-${idx}`}
                                            style={{ marginRight: "0.5rem" }}
                                          >
                                            Warehouse
                                          </Label>
                                        ) : null}

                                        {errors[`warehouse-${idx}`] && (
                                          <div
                                            className="text-danger"
                                            style={{
                                              marginLeft: "0.5rem",
                                              fontSize: "1.25rem",
                                            }}
                                          >
                                            {errors[`warehouse-${idx}`]}
                                          </div>
                                        )}
                                      </div>

                                      <Select
                                        styles={{
                                          control: (base, state) => ({
                                            ...base,
                                            borderColor: errors[
                                              `warehouse-${idx}`
                                            ]
                                              ? "red"
                                              : base.borderColor,
                                          }),
                                        }}
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
                                    </Col>

                                    <Col lg="3" className="mb-3">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {idx === 0 ? (
                                          <Label
                                            htmlFor={`location-${idx}`}
                                            style={{ marginRight: "0.5rem" }}
                                          >
                                            Location
                                          </Label>
                                        ) : null}

                                        {errors[`location-${idx}`] && (
                                          <div
                                            className="text-danger"
                                            style={{
                                              marginLeft: "0.5rem",
                                              fontSize: "1.25rem",
                                            }}
                                          >
                                            {errors[`location-${idx}`]}
                                          </div>
                                        )}
                                      </div>

                                      <Select
                                        styles={{
                                          control: (base, state) => ({
                                            ...base,
                                            borderColor: errors[
                                              `location-${idx}`
                                            ]
                                              ? "red"
                                              : base.borderColor,
                                          }),
                                        }}
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
                                    </Col>

                                    <Col
                                      lg="1"
                                      className="align-self-center mb-1"
                                      style={{ marginTop: "-24px" }}
                                    >
                                      <Link
                                        to="#"
                                        onClick={() =>
                                          handleRemoveRowNested(idx)
                                        }
                                        className="text-danger"
                                      >
                                        <i
                                          className="mdi mdi-delete font-size-20"
                                          id="deletetooltip"
                                        />
                                      </Link>
                                    </Col>
                                  </Row>
                                </div>
                              </Form>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <CardTitle className="mb-4"></CardTitle>
                    <Col xs="12">
                      <Row data-repeater-item>
                        <Col lg="5" className="mb-5"></Col>
                        <Col lg="1" className="mb-1">
                          {prPermission && prPermission?.can_add && (
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
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default createPR;
