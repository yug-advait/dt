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
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useHistory, Link, useLocation } from "react-router-dom";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { getSelectData, updateLineItemApiCall } from "helpers/Api/api_common";
import { getGoodReceipt } from "helpers/Api/api_goodReceipt";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import { productTechParameterByID } from "helpers/Api/api_products";
import "../../../assets/scss/custom/pages/__loader.scss";

const QualityCheck = () => {
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
  const [minimizedRows, setMinimizedRows] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [qcPermission, setQCPermission] = useState();
  const [optionDropDownItems, setOptionDropDownItems] = useState([]);
  const [GRNLineItemList, setGRNLineItemList] = useState([]);
  const [selectedGRNValues, setselectedGRNValues] = useState([]);
  const [optionProductPlant, setOptionProductPlant] = useState([]);
  const [optionProductLocation, setOptionProductLocation] = useState([]);
  const [originalGRNLineItemList, setOriginalGRNLineItemList] = useState([]);

  const productTechParameter = async parameter_sets => {
    const response = await productTechParameterByID(parameter_sets);
    return response?.productTechParameterByID;
  };

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
      if (!uniquePrNos.has(row.grn_no)) {
        uniquePrNos.add(row.grn_no);
        return true;
      }
      return false;
    });
    // Map unique rows to the desired options format
    const options = uniqueRows?.map(row => ({
      value: row.id,
      label: row.grn_no,
    }));
    setOptionDropDownItems(options);
    setselectedGRNValues(options);
    const selectedRowsData = await Promise.all(
      selectedRows.map(async (item, index) => {
        const technical_setData = item?.technical_set_value;
        var TableDataList = [];
        var Techids = [];
        if (technical_setData) {
          Techids = Object.values(technical_setData).flatMap(item => item.id);
          TableDataList = await productTechParameter(Techids.join(","));
        }
        return {
          id: item?.id,
          grn_no: item?.grn_no,
          asn_grn_id: item?.grn_id,
          asn_grn_line_item: item?.del_line_item,
          product_id: item?.product_id,
          product_group_id: item?.product_group_id,
          product_description: item?.product_description,
          vendor_prod_description: item?.vendor_prod_description,
          asn_grn_quantity: item?.grn_quantity,
          cancel_quantity: "",
          damage_quantity: "",
          delivery_quantity: item?.delivery_quantity,
          putaway_quantity: item?.putaway_quantity,
          open_delivery_quantity: item?.open_delivery_quantity,
          grn_quantity: item?.grn_quantity,
          uom: item?.uom,
          delivery_gr_date: moment(item?.delivery_gr_date).format("DD/MM/YYYY"),
          product_code: item?.product_code,
          location: item?.location_code,
          warehouse: item?.warehouse_code,
          batch_count: item?.batch_count,
          batch_numbers: item?.batch_numbers,
          techData: technical_setData,
          tableData: TableDataList,
        };
      })
    );
    if (selectedRowsData.length > 0) {
      setMinimizedRows(Array.from({ length: selectedRowsData.length }, (_, i) => i));
    }
    setGRNLineItemList(selectedRowsData);

    const selectPlantData = await getSelectData(
      "plant_code",
      "",
      "warehouse_master"
    );
    setOptionProductPlant(selectPlantData?.getDataByColNameData);

    const selectLocationData = await getSelectData("code", "", "location_code");
    setOptionProductLocation(selectLocationData?.getDataByColNameData);
  };

  const handleMinimizeRow = idx => {
    setMinimizedRows([...minimizedRows, idx]);
  };

  const handleMaximizeRow = idx => {
    setMinimizedRows(minimizedRows.filter(rowIdx => rowIdx !== idx));
  };

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
    let error;
    if (value === "" || value < 0) {
      error = "*";
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleInputChange = (index, fieldName, value) => {
    const newLineItems = [...GRNLineItemList];
    newLineItems[index][fieldName] = value;
    setGRNLineItemList(newLineItems);
    validateField(`${fieldName}-${index}`, value);
  };
  const handleInputChangeParameter = (index, fieldName, valueitems, value) => {
    const newLineItems = [...GRNLineItemList];
    newLineItems[index][fieldName][valueitems[0]] = value;
    setGRNLineItemList(newLineItems);
  };

  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };

  useEffect(() => {
    dropdownList();
    const userData = getUserData();
    var permissions = userData?.permissionList?.filter(
      permission => permission.sub_menu_name === "quality_check"
    );
    setQCPermission(
      permissions.find(permission => permission.sub_menu_name === "quality_check")
    );
  }, []);

  useEffect(() => {
    if (GRNLineItemList.length > 0 && originalGRNLineItemList.length === 0) {
      setOriginalGRNLineItemList([...GRNLineItemList]);
    }
  }, [GRNLineItemList]);
  const validateForm = () => {
    const errorsdata = {};
    let isValid = true;
    if (selectedGRNValues.length === 0) {
      errorsdata.approved_asns_grns = true; // Error flag instead of "*"
      isValid = false;
    } else {
      GRNLineItemList.forEach((item, index) => {
        Object.keys(item).forEach((fieldName) => {
          if (
            `cancel_quantity-${index}` === `${fieldName}-${index}` ||
            `damage_quantity-${index}` === `${fieldName}-${index}`
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
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const updateLineItemData = await updateLineItemApiCall(grnFilteredItems, "qc_check");
    setToast(true);
    // setLoading(false);
    setToastMessage(updateLineItemData?.message);
    setTimeout(() => {
      setLoading(false);
      setToast(false);
      history.push({
        pathname: "/grn/quality_check_list",
        state: { activeTab: 1 },
      });
    }, 2000);
  };

  const handleCancel = () => {
    history.push("/grn/good_receipt");
  };

  document.title = "Detergent | Quality Check";
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
                color={"success"}
                role="alert"
              >
                {toastMessage}
              </Alert>
            </div>
          )}

          {/* BreadCrumbs */}
          <Breadcrumbs
            titlePath="/grn/good_receipt"
            title="GRN"
            breadcrumbItem="Quality Check"
          />

          {/*  Headers and Line Item */}
          {loading ? (
            <Loader />
          ) : (
            <Card>
              <CardBody>
                <Row>
                  <Col lg="3">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Label>Approved GRNs</Label>
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
                        const selectedLabels = selectedGRNValues.map(
                          item => item.label
                        );
                        const grnFilteredItems = originalGRNLineItemList.filter(
                          item => selectedLabels.includes(item.grn_no)
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
                                      {idx === 0 ? (
                                        <Label
                                          htmlFor={`asn_grn_line_item-${idx}`}
                                        >
                                          {"GRN LineNo."}
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
                                        <p>{item?.putaway_quantity}</p>
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
                                        <p>{item?.open_delivery_quantity}</p>
                                      </div>
                                    </Col>
                                    <Col lg="1" className="mb-1">
                                      <div className="">
                                        {idx == 0 ? (
                                          <Label
                                            htmlFor={`grn_quantity-${idx}`}
                                          >
                                            GRN Qty.
                                          </Label>
                                        ) : (
                                          ""
                                        )}
                                        <p>{item?.grn_quantity}</p>
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
                                              htmlFor={`damage_quantity-${idx}`}
                                              style={{
                                                marginRight: "0.5rem",
                                              }}
                                            >
                                              Damage Qty.
                                            </Label>
                                          )}
                                          {errors[`damage_quantity-${idx}`] && (
                                            <div
                                              className="text-danger"
                                              style={{
                                                fontSize: "1.25rem",
                                              }}
                                            ></div>
                                          )}
                                        </div>
                                        <Input
                                          type="number"
                                          max={item?.grn_quantity}
                                          min="0"
                                          value={item.damage_quantity || ""}
                                          onChange={e => {
                                            const value = e.target.value;
                                            if (
                                              value === "" ||
                                              (Number(value) >= 0 &&
                                                Number.isInteger(Number(value)) &&
                                                Number(value) <= item?.grn_quantity)
                                            ) {
                                              handleInputChange(
                                                idx,
                                                "damage_quantity",
                                                value
                                              );
                                            }
                                          }}
                                          id={`damage_quantity-${idx}`}
                                          className="form-control-sm"
                                          style={{
                                            borderColor: errors[
                                              `damage_quantity-${idx}`
                                            ]
                                              ? "#f46a6a"
                                              : undefined, // Red border on error
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
                                              htmlFor={`cancel_quantity-${idx}`}
                                              style={{
                                                marginRight: "0.5rem",
                                              }}
                                            >
                                              Cancel Qty.
                                            </Label>
                                          )}
                                          {errors[`cancel_quantity-${idx}`] && (
                                            <div
                                              className="text-danger"
                                              style={{
                                                fontSize: "1.25rem",
                                              }}
                                            ></div>
                                          )}
                                        </div>
                                        <Input
                                          type="number"
                                          max={item?.grn_quantity}
                                          min="0"
                                          value={item.cancel_quantity || ""}
                                          onChange={e => {
                                            const value = e.target.value;
                                            if (
                                              value === "" ||
                                              (Number(value) >= 0 &&
                                                Number.isInteger(Number(value)) &&
                                                Number(value) <= item?.grn_quantity)
                                            ) {
                                              handleInputChange(
                                                idx,
                                                "cancel_quantity",
                                                value
                                              );
                                            }
                                          }}
                                          id={`cancel_quantity-${idx}`}
                                          className="form-control-sm"
                                          style={{
                                            borderColor: errors[
                                              `cancel_quantity-${idx}`
                                            ]
                                              ? "#f46a6a"
                                              : undefined,
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
                                        <Label htmlFor={`product_code-${idx}`}>
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
                                      {errors[`product_description-${idx}`] && (
                                        <div className="text-danger">
                                          {errors[`product_description-${idx}`]}
                                        </div>
                                      )}
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
                                          onClick={() => handleMinimizeRow(idx)}
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
                                          onClick={() => handleMaximizeRow(idx)}
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
                                      </div>
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
                                      {errors[`delivery_gr_date-${idx}`] && (
                                        <div className="text-danger">
                                          {errors[`delivery_gr_date-${idx}`]}
                                        </div>
                                      )}
                                    </Col>
                                    <Col lg="2" className="mb-1">
                                      {idx === 0 ? (
                                        <Label htmlFor={`batch_count-${idx}`}>
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
                                          <Label htmlFor={`warehouse-${idx}`}>
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
                                          <Label htmlFor={`location-${idx}`}>
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
                                  {minimizedRows.length > 0 &&
                                    minimizedRows.includes(idx) ? null : (
                                    <Row data-repeater-item>
                                      {item?.tableData?.length > 0 &&
                                        item?.tableData.map((items, index) => {
                                          if (items.types[0] === "datebox") {
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
                                                    altFormat: "j F, Y",
                                                    dateFormat: "Y-m-d",
                                                  }}
                                                  onChange={selectedDates => {
                                                    handleInputChangeParameter(
                                                      idx,
                                                      "techData",
                                                      [`datebox-${index}`],
                                                      {
                                                        id: items?.items[0]?.id,
                                                        type: items?.types[0],
                                                        label: moment(
                                                          selectedDates[0]
                                                        ).format("DD/MM/YYYY"),
                                                      }
                                                    );
                                                  }}
                                                  value={moment(
                                                    item?.techData?.[
                                                      `datebox-${index}`
                                                    ] == null
                                                      ? items?.values[0]
                                                      : item?.techData?.[
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
                                                        color: "#f46a6a",
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
                                            items.types[0] === "textfield"
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
                                                      ? items?.values[0]
                                                      : item?.techData?.[
                                                        `textfield-${index}`
                                                      ]?.label
                                                  }
                                                  onChange={event => {
                                                    handleInputChangeParameter(
                                                      idx,
                                                      "techData",
                                                      [`textfield-${index}`],
                                                      {
                                                        id: items?.items[0]?.id,
                                                        type: items?.types[0],
                                                        label:
                                                          event.target?.value,
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
                                                        color: "#f46a6a",
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
                                            items.types[0] === "dropdown"
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
                                                  options={items?.items}
                                                  onChange={async selectedTechSet => {
                                                    handleInputChangeParameter(
                                                      idx,
                                                      "techData",
                                                      [`dropdown-${index}`],
                                                      {
                                                        id: items?.items[0]?.id,
                                                        type: items?.types[0],
                                                        dropdown:
                                                          selectedTechSet,
                                                      }
                                                    );
                                                  }}
                                                  value={
                                                    item?.techData?.[
                                                      `dropdown-${index}`
                                                    ] == null
                                                      ? items?.values[0]
                                                      : item?.techData?.[
                                                        `dropdown-${index}`
                                                      ]?.dropdown
                                                  }
                                                ></Select>
                                                {formErrors?.[
                                                  `dropdown-${index}`
                                                ] && (
                                                    <div
                                                      style={{
                                                        color: "#f46a6a",
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
                                            items.types[0] === "textarea"
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
                                                      ? items?.values[0]
                                                      : item?.techData?.[
                                                        `textarea-${index}`
                                                      ]?.label
                                                  }
                                                  onChange={event => {
                                                    handleInputChangeParameter(
                                                      idx,
                                                      "techData",
                                                      [`textarea-${index}`],
                                                      {
                                                        id: items?.items[0]?.id,
                                                        type: items?.types[0],
                                                        label:
                                                          event.target?.value,
                                                      }
                                                    );
                                                  }}
                                                  rows="1"
                                                  placeholder="Please Enter Text Area"
                                                />
                                              </Col>
                                            );
                                          } else if (
                                            items.types[0] === "dateTime"
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
                                                    altFormat: "j F, Y h:i K",
                                                    dateFormat: "Y-m-d h:i K",
                                                    enableTime: true,
                                                    time_24hr: false,
                                                  }}
                                                  onChange={selectedDates => {
                                                    handleInputChangeParameter(
                                                      idx,
                                                      "techData",
                                                      [`dateTime-${index}`],
                                                      {
                                                        id: items?.items[0]?.id,
                                                        type: items?.types[0],
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
                                                      ? items?.values[0]
                                                      : item?.techData?.[
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
                                                        color: "#f46a6a",
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
                                            items.types[0] === "timebox"
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
                                                    dateFormat: "h:i K",
                                                    altFormat: "h:i K",
                                                    time_24hr: false,
                                                  }}
                                                  onChange={selectedDates => {
                                                    handleInputChangeParameter(
                                                      idx,
                                                      "techData",
                                                      [`timebox-${index}`],
                                                      {
                                                        id: items?.items[0]?.id,
                                                        type: items?.types[0],
                                                        label: moment(
                                                          selectedDates[0]
                                                        ).format("hh:mm A"),
                                                      }
                                                    );
                                                  }}
                                                  value={moment(
                                                    item?.techData?.[
                                                      `timebox-${index}`
                                                    ] == null
                                                      ? items?.values[0]
                                                      : item?.techData?.[
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
                                                        color: "#f46a6a",
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
                                            items.types[0] === "urlbox"
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
                                                      ? items?.values[0]
                                                      : item?.techData?.[
                                                        `urlbox-${index}`
                                                      ]?.label
                                                  }
                                                  onChange={event => {
                                                    handleInputChangeParameter(
                                                      idx,
                                                      "techData",
                                                      [`urlbox-${index}`],
                                                      {
                                                        id: items?.items[0]?.id,
                                                        type: items?.types[0],
                                                        label:
                                                          event.target?.value,
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
                                            items.types[0] === "emailbox"
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
                                                      ? items?.values[0]
                                                      : item?.techData?.[
                                                        `emailbox-${index}`
                                                      ]?.label
                                                  }
                                                  onChange={event => {
                                                    handleInputChangeParameter(
                                                      idx,
                                                      "techData",
                                                      [`emailbox-${index}`],
                                                      {
                                                        id: items?.items[0]?.id,
                                                        type: items?.types[0],
                                                        label:
                                                          event.target.value,
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
                                            items.types[0] === "colorbox"
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
                                                      ? items?.values[0]
                                                      : item?.techData?.[
                                                        `colorbox-${index}`
                                                      ]?.label
                                                  }
                                                  onChange={event => {
                                                    handleInputChangeParameter(
                                                      idx,
                                                      "techData",
                                                      [`colorbox-${index}`],
                                                      {
                                                        id: items?.items[0]?.id,
                                                        type: items?.types[0],
                                                        label:
                                                          event.target.value,
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
                                            items.types[0] === "numberbox"
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
                                                      ? items?.values[0]
                                                      : item?.techData?.[
                                                        `numberbox-${index}`
                                                      ]?.label
                                                  }
                                                  onChange={event => {
                                                    handleInputChangeParameter(
                                                      idx,
                                                      "techData",
                                                      [`numberbox-${index}`],
                                                      {
                                                        id: items?.items[0]?.id,
                                                        type: items?.types[0],
                                                        label:
                                                          event.target.value,
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
                                            items.types[0] === "multipleselect"
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
                                                  options={items?.items}
                                                  onChange={async selectedTechSet => {
                                                    handleInputChangeParameter(
                                                      idx,
                                                      "techData",
                                                      [
                                                        `multipleselect-${index}`,
                                                      ],
                                                      {
                                                        id: items?.items[0]?.id,
                                                        type: items?.types[0],
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
                                                      ? items?.values[0]
                                                      : item?.techData?.[
                                                        `multipleselect-${index}`
                                                      ]?.multipleselect
                                                  }
                                                ></Select>
                                              </Col>
                                            );
                                          } else {
                                            return null;
                                          }
                                        })}
                                    </Row>
                                  )}
                                </div>
                              </Form>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <Modal isOpen={showModal} toggle={handleCloseModal} centered>
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
                            <Label for={`batch_qty-${index}`}>Quantity</Label>
                            <div>{batch.batch_qty}</div>
                          </FormGroup>
                        </Col>
                        <Col md="3">
                          <FormGroup>
                            <Label>Serial No.</Label>
                            {batch.serialNumbers
                              .split(",")
                              .map((serialNumber, serialIndex) => (
                                <div key={serialIndex}>{serialNumber}</div>
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
              </CardBody>
              <CardTitle className="mb-4"></CardTitle>
              <Col xs="12">
                <Row data-repeater-item>
                  <Col lg="5" className="mb-5"></Col>
                  <Col lg="1" className="mb-1">
                    {qcPermission && qcPermission?.can_add && (
                      <Button
                        disabled={loading}
                        onClick={() => handleSave()}
                        //color="primary"
                        className="btn-custom-theme mt-5 mt-lg-2 btn-custom-size"
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
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default QualityCheck;
