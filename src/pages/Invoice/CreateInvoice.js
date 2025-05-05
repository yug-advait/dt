import React, { useEffect, useState, useCallback,useRef } from "react";
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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import { ADD_INVOICE_REQUEST,GET_INVOICE_FAIL } from "../../store/invoice/actionTypes";
import Loader from "../../components/Common/Loader";
import "../../assets/scss/custom/pages/__loader.scss";

const CreateInvoice = () => {
  const dispatch = useDispatch();
  const flatpickrRef = useRef(null);
  const history = useHistory();
  const location = useLocation();
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  // const [invoicePermission, setInvoicePermission] = useState();
  const [originalLineItemList, setOriginalLineItemList] = useState([]);
  const [LineItemList, setLineItemList] = useState([]);
  const { addInvoice } = useSelector(state => state.invoice);
  const [selectedValues, setSelectedValues] = useState([]);

  const dropdownList = async () => {
    var selectedRows = [];
    if (location.state && location.state?.LineItem.length > 0) {
      selectedRows = location?.state?.LineItem;
    }
    const uniquePrNos = new Set();
    const uniqueRows = selectedRows.filter(row => {
      if (!uniquePrNos.has(row.grn_no)) {
        uniquePrNos.add(row.grn_no);
        return true;
      }
    });
    // Map unique rows to the desired options format
    const options = uniqueRows.map(row => ({
      value: row.id,
      label: row.grn_no,
    }));
    setSelectedValues(options);
    const totalAmount = selectedRows.reduce((sum, item) => {
      return (
        sum + (Number(item?.po_quantity) * Number(item?.net_price) == "" ? 0 : Number(item?.po_quantity) * Number(item?.net_price))
      );
    }, 0);
    setFormData(prevData => ({
      ...prevData,
      total_amount: Number(totalAmount.toFixed(2)),
    }));
    const totalTaxAmount = selectedRows.reduce((sum, item) => {
      return sum + (Number(item.net_price) == "" ? 0 : ((Number(item?.grn_quantity) * Number(item?.net_price)) * (item?.tax_per))/100);
    }, 0);

    setFormData(prevData => ({
      ...prevData,
      total_tax_amount: Number(totalTaxAmount.toFixed(2)),
    }));
    setFormData(prevData => ({
      ...prevData,
      remark: '',
    }));
    setFormData(prevData => ({
      ...prevData,
      supplier_invoice_no: '',
    }));
    setFormData(prevData => ({
      ...prevData,
      reference: selectedRows[0]?.po_number,
    }));
    setFormData(prevData => ({
      ...prevData,
      vendor_id: selectedRows[0]?.vendor_code?.value,
    }));
    const selectedRowsData = selectedRows.map((item, index) => {
      return {
        id: item?.id,
        vendor_id:item?.vendor_code?.value,
        grn_line_item: item?.del_line_item,
        po_number:item?.po_number,
        po_line_item: item?.po_line_item,
        po_quantity: item?.po_quantity,
        net_price:item?.net_price,
        net_value:Number(item?.grn_quantity) * Number(item?.net_price),
        quantity:item?.grn_quantity,
        grn_quantity:item?.grn_quantity,
        damage_quantity:item?.damage_quantity,
        ir_quantity:item?.grn_quantity,
        uom: item?.uom,
        tax_per:item?.tax_per,
        tax_amount: ((Number(item?.grn_quantity) * Number(item?.net_price)) * (item?.tax_per))/100,
        tax_code:item?.tax_code,
        product_code: item?.product_code,
        hsn: item?.hsn,
        product_description: item?.product_description,
        order_qty:item?.po_quantity,
        grn_no: item.grn_no,
        warehouse: item?.warehouse_code,
        location: item?.location_code,
        with_holding_tax_id: item?.with_holding_tax_id,
        product_id: item?.product_id,
        delivery_date: moment(item?.delivery_date).format("DD/MM/YYYY")
      };
    });
    setLineItemList(selectedRowsData);
  };

  const validateField = (fieldName, value) => {
    let error;
    if (fieldName != "tax_amount") {
      if (value === "" || value < 0) {
        error = "*";
      }
      setErrors(prevErrors => ({
        ...prevErrors,
        [fieldName]: error,
      }));
    }
  };

  const handleDateChange = useCallback((selectedDates) => {
    const selectedDate = selectedDates[0];
    const formattedDate = moment(selectedDate).format("DD/MM/YYYY");
    if (formattedDate !== formData.invoice_date) {
      setFormData((prevData) => ({
        ...prevData,
        invoice_date: formattedDate
      }));
    }
  }, [formData.invoice_date]);


  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };
  const selectedLabels = selectedValues.map(item => item.label);
  const filteredItems = LineItemList.filter(item =>
    selectedLabels.includes(item.grn_no)
  );

  useEffect(() => {
    dropdownList();
    const userData = getUserData();
    // var permissions = userData?.permissionList.filter(
    //   permission => permission.sub_menu_name === "invoice"
    // );
    // setInvoicePermission(
    //   permissions.find(permission => permission.sub_menu_name === "invoice")
    // );
    if (addInvoice?.success === true) {
      // setLoading(false);
      setToast(true);
      setToastMessage(addInvoice?.message);
      setTimeout(() => {
        setLoading(false);
        setToast(false);
        history.push({
          pathname: "/list_invoices"
        });
      }, 1000);
    } else {
      setLoading(false);
      if (addInvoice?.success !== undefined && addInvoice?.message) {
      setToast(true);
      setToastMessage(addInvoice?.message);
      dispatch({
        type: GET_INVOICE_FAIL,
      });
      setTimeout(() => {
        setToast(false);
      }, 2000);
    }
    }
  }, [addInvoice]);
  useEffect(() => {
    if (LineItemList.length > 0 && originalLineItemList.length === 0) {
      setOriginalLineItemList([...LineItemList]);
    }
  }, [LineItemList]);

  useEffect(() => {
    if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
      const instance = flatpickrRef.current.flatpickr;
      if (instance.altInput) {
        instance.altInput.style.borderColor = formErrors.invoice_date ? 'red' : '#ced4da'; // Red if there's an error
      }
    }
  }, [formErrors.invoice_date]);

  const validateForm = () => {
    const errorsdata = {};
    let isValid = true;
    if (!formData.invoice_date){
      errorsdata.invoice_date = "*";
    }     
    if (!formData.reference){
      errorsdata.reference = "*";
    }     
    if (!formData.supplier_invoice_no){
      errorsdata.supplier_invoice_no = "*";
    }     
    if (selectedValues.length == 0) {
      errorsdata.approved_prs = "*";
    } else {
      LineItemList.forEach((item, index) => {
        Object.keys(item).forEach(fieldName => {
          if (
            `grn_no-${index}` === `${fieldName}-${index}` ||
            `grn_line_item-${index}` === `${fieldName}-${index}` ||
            `po_quantity-${index}` === `${fieldName}-${index}` ||
            `uom-${index}` === `${fieldName}-${index}` ||
            `net_price-${index}` === `${fieldName}-${index}` ||
            `net_value-${index}` === `${fieldName}-${index}` ||
            `tax_per-${index}` === `${fieldName}-${index}`
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
      setFormErrors(errorsdata);
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
      filteredItems
    };
    dispatch({
      type: ADD_INVOICE_REQUEST,
      payload: Data,
    });
  };

  const handleCancel = () => {
    history.push("/list_invoices");
  };

  document.title = "Detergent | Create Invoice";

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
              <Alert color={addInvoice?.success ? "success" : "danger"} role="alert">
                {toastMessage}
              </Alert>
            </div>
          )}

          {/* BreadCrumbs */}
          <Breadcrumbs
            titlePath="/list_invoices"
            title="Invoice"
            breadcrumbItem="Create Invoice"
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
                        <Col md="2" className="mb-2">
                          <div className="">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Label
                                htmlFor="formrow-state-Input"
                                style={{ marginRight: "0.5rem" }}
                              >
                                Invoice Date
                              </Label>
                            </div>
                            <FormGroup className="mb-4">
                              <InputGroup>
                                <Flatpickr
                                  placeholder="dd M,yyyy"
                                  ref={flatpickrRef}
                                  options={{
                                    altInput: true,
                                    altFormat: "j F, Y",
                                    dateFormat: "Y-m-d",
                                    minDate: "today",
                                  }}
                                  onChange={handleDateChange}
                                  value={moment(
                                    formData?.invoice_date,
                                    "DD/MM/YYYY"
                                  ).toDate()}
                                  onReady={(selectedDates, dateStr, instance) => {
                                    if (instance.altInput) {
                                      Object.assign(instance.altInput.style, {
                                        borderColor: formErrors.invoice_date ? 'red' : '#ced4da',
                                      });
                                    }
                                  }}
                                  onOpen={(selectedDates, dateStr, instance) => {
                                    if (instance.altInput) {
                                      instance.altInput.style.borderColor = !formData.invoice_date ? 'red' : '#ced4da';
                                    }
                                  }}
                                />
                              </InputGroup>
                            </FormGroup>
                          </div>
                        </Col>

                        <Col md="2" className="mb-1">
                          <Label htmlFor="totalPoAmount">Reference</Label>
                          <div>{formData?.reference}</div>

                          {/* <Input
                            type="text"
                            id="reference"
                            value={formData?.reference || ""}
                            style={{
                              borderColor: formErrors.reference
                                ? "red"
                                : "#ced4da",
                            }}
                            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                          /> */}
                        </Col>
                        <Col md="2" className="mb-1">
                          <Label htmlFor="totalPoAmount">Supplier Invoice NO.</Label>
                          <Input
                            type="text"
                            id="reference"
                            value={formData?.supplier_invoice_no || ""}
                            style={{
                              borderColor: formErrors.supplier_invoice_no
                                ? "red"
                                : "#ced4da",
                            }}
                            onChange={(e) => setFormData({ ...formData, supplier_invoice_no: e.target.value })}
                          />
                        </Col>
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
                        <Col md="2" className="mb-1">
                          <Label htmlFor="remark">Remark</Label>
                          <Input
                            type="textarea"
                            id="remark"
                            value={formData?.remark || ""}
                            onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                          />
                        </Col> 

                      </Row>
                    
                      {/* Select Purchase Request */}
                      <Row>
                        <CardTitle className="mb-4"></CardTitle>
                      </Row>

                      {/* Selected Purchase Request Line Items*/}
                      <CardTitle className="mb-4"></CardTitle>
                      <Row>
                        <Col lg="12">
                          <div>
                            {/* <div style={{ height: "400px", overflowY: "auto" }}> */}
                            <Table style={{ width: "100%" }}>
                              <tbody>
                                {filteredItems.map((item, idx) => (
                                  <tr
                                    style={{
                                      borderBottom:
                                        idx < filteredItems.length - 1
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
                                                <Label htmlFor={`po_line_item-${idx}`}>
                                                  PO Line
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.po_line_item}</p>
                                              {errors[`po_line_item-${idx}`] && (
                                                <div className="text-danger">
                                                  {errors[`po_line_item-${idx}`]}
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
                                              <p>{item?.product_code?.label}</p>
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
                                              <p>{item?.hsn?.label}</p>
                                              {errors[`hsn-${idx}`] && (
                                                <div className="text-danger">
                                                  {errors[`hsn-${idx}`]}
                                                </div>
                                              )}
                                            </Col>
                                            <Col lg="1" className="mb-1">
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
                                            </Col>
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label htmlFor={`quantity-${idx}`}>
                                                  Quantity
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
                                           
                                            <Col lg="2" className="mb-1">
                                              {idx === 0 ? (
                                                <Label htmlFor={`po_number-${idx}`}>
                                                  PO No
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.po_number}</p>
                                              {errors[`po_number-${idx}`] && (
                                                <div className="text-danger">
                                                  {errors[`po_number-${idx}`]}
                                                </div>
                                              )}
                                            </Col>
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`net_price-${idx}`}
                                                >
                                                Net Price
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <div>
                                                {item.net_price}
                                              </div>
                                            </Col>
                                            <Col lg="2" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`net_value-${idx}`}
                                                >
                                                  Net Value
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <div>
                                                {item.net_value}
                                              </div>
                                            </Col>
                                           
                                           
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`grn_quantity-${idx}`}
                                                >
                                                  GRN Qty.
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.grn_quantity}</p>
                                              {errors[`grn_quantity-${idx}`] && (
                                                <div className="text-danger">
                                                  {errors[`grn_quantity-${idx}`]}
                                                </div>
                                              )}
                                            </Col>

                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`ir_quantity-${idx}`}
                                                >
                                                  IR Qty.
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.ir_quantity}</p>
                                              {errors[`ir_quantity-${idx}`] && (
                                                <div className="text-danger">
                                                  {errors[`ir_quantity-${idx}`]}
                                                </div>
                                              )}
                                            </Col>
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label htmlFor={`grn_line_item-${idx}`}>
                                                  GRN Line
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.grn_line_item}</p>
                                              {errors[`grn_line_item-${idx}`] && (
                                                <div className="text-danger">
                                                  {errors[`grn_line_item-${idx}`]}
                                                </div>
                                              )}
                                            </Col>
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`order_qty-${idx}`}
                                                >
                                                  Order Qty.
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <div>
                                                {item.order_qty}
                                              </div>
                                            </Col>
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
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
                                            </Col>
                                            {/* <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`damage_quantity-${idx}`}
                                                >
                                                 Dmg Qty.
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <div>
                                                {item.damage_quantity}
                                              </div>
                                            </Col> */}
                                            <Col lg="2" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`grn_no-${idx}`}
                                                >
                                                  GRN No.
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <div>
                                                {item.grn_no}
                                              </div>
                                            </Col>
                                          
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label htmlFor={`tax_per-${idx}`}>
                                                   Tax %
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.tax_per}</p>
                                              {errors[`tax_per-${idx}`] && (
                                                <div className="text-danger">
                                                  {errors[`tax_per-${idx}`]}
                                                </div>
                                              )}
                                            </Col>
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`tax_code-${idx}`}
                                                >
                                                  Tax Code
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.tax_code}</p>
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
                                              <p>{item?.tax_amount}</p>
                                            </Col>
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`warehouse-${idx}`}
                                                >
                                                  Plant
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.warehouse?.label}</p>
                                            </Col>
                                            <Col lg="1" className="mb-1">
                                              {idx === 0 ? (
                                                <Label
                                                  htmlFor={`location-${idx}`}
                                                >
                                                  Location
                                                </Label>
                                              ) : (
                                                ""
                                              )}
                                              <p>{item?.location?.label}</p>
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
                        {/* {poPermission && poPermission?.can_add && ( */}
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

export default CreateInvoice;
