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
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import "flatpickr/dist/themes/material_blue.css";
import moment from "moment";
import Flatpickr from "react-flatpickr";
import Loader from "components/Common/Loader";

import { getSelectData } from "helpers/Api/api_common";
import { getWithholdingTaxTypes } from "helpers/Api/api_withholdingTaxType";
import { getSalesOrderDocTypeById } from "helpers/Api/api_salesOrderDocType";
import {
  getCustomers,
  getCustomerAddress,
} from "helpers/Api/api_customers";
import {
  getCompanyLegalEntityByID,
  getCompanyLegalEntity,
} from "helpers/Api/api_companyLegalEntity";
import {
  getEmployeeMaster,
  getEmployeeByID,
} from "helpers/Api/api_employeeMaster";

import {
  ADD_SALES_ORDER_REQUEST,
} from "store/salesOrderMaster/actionTypes";
import RequiredLabel from "components/Common/RequiredLabel";
import { getProductsByID } from "helpers/Api/api_products";

const CreateSalesOrder = () => {
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
  const dispatch = useDispatch();

  const { addSalesOrders } = useSelector(state => state.salesOrders);

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [loading, setLoading] = useState(false);

  const [optionProductUOM, setOptionProductUOM] = useState([]);
  const [optionWarehouse, setOptionWarehouse] = useState([]);
  const [optionLocation, setOptionLocation] = useState([]);
  const [optionItemCategory, setOptionItemCategory] = useState([]);
  const [optionWithholdingTax, setOptionWithholdingTax] = useState([]);
  const [optionDropDownItems, setOptionDropDownItems] = useState([]);

  const [selectSODocType, setSelectedSODocType] = useState({});
  const [optionSODocType, setOptionSODocType] = useState([]);
  const [selectCompanyCode, setSelectedCompanyCode] = useState({});
  const [optionCompanyCode, setOptionCompanyCode] = useState([]);

  const [selectSalesGroup, setSelectedSalesGroup] = useState({});
  const [optionSalesGroup, setOptionSalesGroup] = useState([]);

  const [selectSalesOrganization, setSelectedSalesOrganization] = useState({});
  const [optionSalesOrganization, setOptionSalesOrganization] = useState([]);

  const [selectSalesDistrict, setSelectedSalesDistrict] = useState({});
  const [optionSalesDistrict, setOptionSalesDistrict] = useState([]);

  const [selectSalesOffice, setSelectedSalesOffice] = useState({});
  const [optionSalesOffice, setOptionSalesOffice] = useState([]);

  const [optionProductCode, setOptionProductCode] = useState([]);

  const [quotationLineItemList, setQuotationLineItemList] = useState([{
    sales_order_line_item_no: 10,
    so_quantity: "",
    so_unit_price: "",
    so_sub_total: 0,
    so_discount: "",
    so_net_value: "",
    so_tax_amount: 0,
    return_item: false,
    total_so_amount: 0,
    total_so_tax_amount: 0,
    total_so_quantity: 0,
    total_so_discount: 0,
    so_net_total: 0,
  }]);
  const [selectedQuotationValues, setSelectedQuotationValues] = useState([]);
  const [originalQuotationLineItemList, setOriginalQuotationLineItemList] = useState([]);
  const [selectSoldToCustomer, setSelectedSoldToCustomer] = useState({});
  const [optionSoldToCustomer, setOptionSoldToCustomer] = useState([]);

  const [selectShipToCustomer, setSelectedShipToCustomer] = useState({});
  const [optionShipToCustomer, setOptionShipToCustomer] = useState([]);

  const [optionBillToCustomer, setOptionBillToCustomer] = useState([]);
  const [optionPayerCustomer, setOptionPayerCustomer] = useState([]);

  const [selectDistribution, setSelectedDistribution] = useState({});
  const [optionDistribution, setOptionDistribution] = useState([]);

  const [selectDivision, setSelectedDivision] = useState({});
  const [optionDivision, setOptionDivision] = useState([]);

  const [selectSalesEmployeeCode, setSelectedSalesEmployeeCode] = useState({});
  const [optionSalesEmployeeCode, setOptionSalesEmployeeCode] = useState([]);

  const [shipToCustomerAddress, setShipToCustomerAddress] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);

  const flatpickrRef = useRef(null);
  const direct = location.state?.direct;

  useEffect(() => {
    if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
      const instance = flatpickrRef.current.flatpickr;
      if (instance.altInput) {
        instance.altInput.style.borderColor = formErrors.so_doc_date
          ? "red"
          : "#ced4da";
      }
    }
  }, [formErrors.so_doc_date]);

  useEffect(() => {
    if (
      quotationLineItemList.length > 0 &&
      originalQuotationLineItemList.length === 0
    ) {
      setOriginalQuotationLineItemList([...quotationLineItemList]);
    }
  }, [quotationLineItemList]);

  useEffect(() => {
    dropdownList();
    if (addSalesOrders?.success === true) {
      setToast(true);
      setToastMessage(addSalesOrders?.message);

      setTimeout(() => {
        setLoading(false);
        setToast(false);
        history.push("/sales_order");
      }, 2000);
    }
  }, [addSalesOrders]);

  useEffect(() => {
    if (optionWarehouse.length > 0 || optionLocation.length > 0) {
      setQuotationLineItemList((prev) =>
        prev.map((item, index) => ({
          ...item,
          warehouse_id: item.warehouse_id || optionWarehouse[0],
          location_id: item.location_id || optionLocation[0],
        }))
      );
    }
  }, [optionWarehouse, optionLocation]);

  const dropdownList = async () => {
    // var selectedRows = [];
    // if (
    //   location.state &&
    //   Array.isArray(location.state?.LineItem) &&
    //   location.state.LineItem.length > 0
    // )
    //   selectedRows = location?.state?.LineItem;
    // else {
    //   // const getQuotationListData = await getQuotationMaster();
    //   // selectedRows = getQuotationListData?.approvedQuotationList;
    // }
    // const uniqueQuotationNos = new Set();
    // const uniqueRows = selectedRows.filter(row => {
    //   if (!uniqueQuotationNos.has(row.quotation_number)) {
    //     uniqueQuotationNos.add(row.quotation_number);
    //     return true;
    //   }
    //   return false;
    // });
    // const options = uniqueRows.map(row => ({
    //   value: row.id,
    //   label: row.quotation_number,
    // }));

    // if (!direct) {
    //   const optionSoldToCustomerData = selectedRows.map(row => ({
    //     id: row.sold_to_customer.id,
    //     value: row.sold_to_customer.value,
    //     label: row.sold_to_customer.label,
    //   }));

    //   setOptionSoldToCustomer(optionSoldToCustomerData);

    //   const optionShipToCustomerData = selectedRows.map(row => ({
    //     id: row.ship_to_customer.id,
    //     value: row.ship_to_customer.value,
    //     label: row.ship_to_customer.label,
    //   }));
    //   setOptionShipToCustomer(optionShipToCustomerData);
    // }

    // if (direct) {
    //   setOptionDropDownItems(options);
    //   setSelectedQuotationValues(options);
    //   // setSelectedSoldToCustomer(selectedRows[0]?.sold_to_customer);
    //   // setSelectedShipToCustomer(selectedRows[0]?.ship_to_customer);
    // }

    // fetchShipToCustomerAddress(selectedRows[0]?.ship_to_customer?.id);
    // setFormData(prevData => ({
    //   ...prevData,
    //   customer_ship_to_id: selectedRows[0]?.ship_to_customer?.id,
    //   customer_sold_to_id: selectedRows[0]?.sold_to_customer?.id,
    //   cust_quotation_id: selectedRows[0]?.cust_inquiry_id,
    // }));
    // const selectedRowsData = selectedRows.map((item, index) => {
    //   return {
    //     id: item?.id,
    //     inquiry_master_id: item?.inquiry_master_id,
    //     inquiry_number: item?.inquiry_number,
    //     inquiry_details_id: item?.inquiry_details_id,
    //     inquiry_line_item_no: item?.inquiry_line_item_number,
    //     quotation_master_id: item?.quotation_master_id,
    //     quotation_number: item?.quotation_number,
    //     quotation_line_item_no: item?.quotation_line_item_no,
    //     product_id: item?.product_code_value.value,
    //     product_code: item?.product_code_value.label,
    //     product_description: item?.product_description,
    //     customer_prod_description: item?.customer_prod_description,
    //     ship_to_customer: item?.ship_to_customer,
    //     sold_to_customer: item?.sold_to_customer,
    //     bill_to_customer: item?.bill_to_customer,
    //     payer_customer: item?.payer_customer,
    //     profit_center: item?.profit_center,
    //     quantity: item?.quantity,
    //     tax_per: item?.tax_type,
    //     uom_id: item?.uom,
    //     warehouse_id: item?.warehouse,
    //     location_id: item?.location,
    //     item_category_id: item?.item_category,
    //     delivery_date: item?.delivery_date,
    //     hsn_id: item?.hsn,
    //     sac_id: item?.sac,
    //     sales_order_line_item_no: 10 * (index + 1),
    //     so_quantity: "",
    //     so_unit_price: "",
    //     so_sub_total: 0,
    //     so_discount: "",
    //     so_net_value: "",
    //     so_tax_amount: 0,
    //     return_item: false,
    //     total_so_amount: 0,
    //     total_so_tax_amount: 0,
    //     total_so_quantity: 0,
    //     total_so_discount: 0,
    //     so_net_total: 0,
    //   };
    // });
    // setQuotationLineItemList(selectedRowsData);

    const selectSalesOrderDocTypeData = await getSelectData(
      "sales_order_doc_type_description",
      "",
      "sales_order_doc_type_master"
    );
    setOptionSODocType(selectSalesOrderDocTypeData?.getDataByColNameData);

    const selectSalesOrganisationData = await getSelectData(
      "sales_organisation",
      "",
      "sales_organisation"
    );
    setOptionSalesOrganization(
      selectSalesOrganisationData?.getDataByColNameData
    );

    const selectSalesGroupData = await getSelectData(
      "sales_group_code",
      "",
      "sales_group"
    );
    setOptionSalesGroup(selectSalesGroupData?.getDataByColNameData);

    const selectSalesDistrictData = await getSelectData(
      "sales_district_short_code",
      "",
      "sales_district"
    );
    setOptionSalesDistrict(selectSalesDistrictData?.getDataByColNameData);

    const selectSalesOfficeData = await getSelectData(
      "sales_office_code",
      "",
      "sales_office"
    );
    setOptionSalesOffice(selectSalesOfficeData?.getDataByColNameData);

    const selectUomData = await getSelectData(
      "uom_description",
      "",
      "unit_of_measure"
    );
    setOptionProductUOM(selectUomData?.getDataByColNameData);

    const selectWarehouseData = await getSelectData(
      "plant_code",
      "",
      "warehouse_master"
    );
    setOptionWarehouse(selectWarehouseData?.getDataByColNameData);

    const selectLocation = await getSelectData(
      "code", 
      "", 
      "location_code"
    );
    setOptionLocation(selectLocation?.getDataByColNameData);

    const selectItemCategory = await getSelectData(
      "item_category_description",
      "",
      "item_categories_master"
    );
    setOptionItemCategory(selectItemCategory?.getDataByColNameData);

    const selectDivsionData = await getSelectData(
      "division_code",
      "",
      "product_grouping_division"
    );
    setOptionDivision(selectDivsionData?.getDataByColNameData);

    const selectDistributionData = await getSelectData(
      "distribution_code",
      "",
      "distribution_methods"
    );
    setOptionDistribution(selectDistributionData?.getDataByColNameData);

    const selectWithholdingTaxData = await getWithholdingTaxTypes();
    const optionWithholdingTaxData = selectWithholdingTaxData?.map(item => {
      return {
        value: item.withholding_tax_percentage,
        label:
          item.withholding_tax_code +
          " - " +
          item.withholding_tax_percentage +
          "%",
      };
    });
    setOptionWithholdingTax(optionWithholdingTaxData);

    const selectData = await getSelectData(
      "product_code",
      "",
      "product_master"
    );
    const selectProductCodeData = selectData?.getDataByColNameData?.map(item => {
      return {
        value: item.value,
        label: item.label + " - " + item.name,
      }
    }
    )
    setOptionProductCode(selectProductCodeData);

    if (direct) {
      const customerData = await getCustomers();
      const selectSoldToCustomerData = customerData?.customer || [];
      const optionSoldToCustomerData = selectSoldToCustomerData.map(item => {
        const customerName = `${item.title} ${item.firstname} ${item.lastname}`;
        return {
          id: item.id,
          value: item.customer_code,
          label: `${item.customer_code} - ${customerName}`,
        };
      });
      setOptionSoldToCustomer(optionSoldToCustomerData);
    }

    const billToCustomerData = await getCustomers();
    const selectBillToCustomerData = billToCustomerData?.customer || [];
    const optionBillToCustomerData = selectBillToCustomerData.map(item => {
      const customerName = `${item?.title} ${item?.firstname} ${item?.lastname}`;
      return {
        id: item.id,
        value: item.customer_code,
        label: `${item.customer_code} - ${customerName}`,
      };
    });
    setOptionBillToCustomer(optionBillToCustomerData);

    const payerCustomerData = await getCustomers();
    const selectPayerCustomerData = payerCustomerData?.customer || [];
    const optionPayerCustomerData = selectPayerCustomerData.map(item => {
      const customerName = `${item?.title} ${item?.firstname} ${item?.lastname}`;
      return {
        id: item.id,
        value: item.customer_code,
        label: `${item.customer_code} - ${customerName}`,
      };
    });
    setOptionPayerCustomer(optionPayerCustomerData);

    const salesEmployeeCodeData = await getEmployeeMaster();
    const selectSalesEmployeeData = salesEmployeeCodeData.employees;
    const optionSalesEmployeeCodeData = selectSalesEmployeeData.map(item => {
      const salesEmployeeName = `${item.title} ${item.firstname} ${item.lastname}`;
      return {
        id: item.id,
        value: item.employee_code,
        label: `${item.employee_code} - ${salesEmployeeName}`,
      };
    });
    setOptionSalesEmployeeCode(optionSalesEmployeeCodeData);

    const companyData = await getCompanyLegalEntity();
    const optionCompanyData = companyData.map(item => {
      return {
        id: item.id,
        value: item.company_code,
        label: `${item.company_code} - ${item.company_name}`,
      };
    });
    setOptionCompanyCode(optionCompanyData);
    const defaultCompany = optionCompanyData?.[0];
    if (defaultCompany) {
      setSelectedCompanyCode(defaultCompany);
      setFormData(prevData => ({
        ...prevData,
        company_id: defaultCompany.id,
      }));
    }
  };

  const handleSoldToChange = async (selectedSoldTo) => {
    if (!selectedSoldTo) return;

    setSelectedSoldToCustomer(selectedSoldTo);
    setSelectedShipToCustomer(selectedSoldTo);
    setSelectedQuotationValues([]);
    setOptionShipToCustomer([]);
    setOptionDropDownItems([]);

    await fetchShipToCustomerAddress(selectedSoldTo.id);
    setFormData(prevData => ({
      ...prevData,
      customer_sold_to_id: selectedSoldTo.id,
      customer_ship_to_id: selectedSoldTo.id,
      cust_quotation_id: null,
    }));


    // const getQuotationListData = await getQuotationMaster();

    const selectedRows = [];

    const filteredQuotationList = selectedRows.filter(
      (item) => item.sold_to_customer.id === selectedSoldTo.id
    );

    const uniqueShipToCustomers = Array.from(
      new Map(
        filteredQuotationList.map((item) => [
          item.ship_to_customer.id,
          {
            id: item.ship_to_customer.id,
            value: item.ship_to_customer.value,
            label: item.ship_to_customer.label,
          },
        ])
      ).values()
    );

    const uniqueApprovedQuotations = Array.from(
      new Map(
        filteredQuotationList.map((item) => [
          item.quotation_number,
          { value: item.id, label: item.quotation_number },
        ])
      ).values()
    );

    // setQuotationLineItemList(selectedRows);
    setOptionShipToCustomer(uniqueShipToCustomers);
    setOptionDropDownItems(uniqueApprovedQuotations);

    if (uniqueShipToCustomers.length === 1) {
      setSelectedShipToCustomer(uniqueShipToCustomers[0]);
      fetchShipToCustomerAddress(uniqueShipToCustomers[0].id);
      setFormData(prevData => ({
        ...prevData,
        customer_sold_to_id: selectedSoldTo.id,
        customer_ship_to_id: uniqueShipToCustomers[0].id,
        ship_to_address: uniqueShipToCustomers[0].id,
        cust_quotation_id: uniqueShipToCustomers[0]?.id,
        // selected_quotation_values: [],
      }));
    }
  };

  const handleReturnItemChange = (index, checked) => {
    const updatedRowsData = quotationLineItemList.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          return_item: checked,
        };
      }
      return item;
    });
    setQuotationLineItemList([...updatedRowsData]);
  };

  const validateField = (fieldName, value) => {
    let error;
    if (value === "" || value < 0) {
      error = "This field is required";
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const fetchShipToCustomerAddress = async (customer_id) => {
    if (!customer_id) return;

    try {
      const customerAddressData = await getCustomerAddress(customer_id);
      const address = customerAddressData?.customer_address || "Address not found";

      setShipToCustomerAddress(address);
      setFormData(prevData => ({
        ...prevData,
        ship_to_address: address,
      }));
    } catch (error) {
      console.error("Error fetching customer address:", error);
    }
  };

  const selectedLabels = selectedQuotationValues.map(item => item.label);
  // const so_details = quotationLineItemList.filter(item =>
  //   selectedLabels.includes(item.quotation_number)
  // );

  const handleInputSODocChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectSalesOrderDocTypeData = await getSelectData(
          "sales_order_doc_type_description",
          inputValue,
          "sales_order_doc_type_master"
        );
        setOptionSODocType(selectSalesOrderDocTypeData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const handleInputDivisionChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectDivsionData = await getSelectData(
          "division_code",
          "",
          "product_grouping_division"
        );
        setOptionDivision(selectDivsionData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const handleInputDistributionChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectDistributionData = await getSelectData(
          "distribution_code",
          "",
          "distribution_methods"
        );
        setOptionDistribution(selectDistributionData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const handleInputSalesOrganisationChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectSalesOrganisationData = await getSelectData(
          "sales_organisation",
          inputValue,
          "sales_organisation"
        );
        setOptionSalesOrganization(
          selectSalesOrganisationData?.getDataByColNameData
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const handleInputSalesDistrictChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectSalesDistrictData = await getSelectData(
          "sales_district_short_code",
          inputValue,
          "sales_district"
        );
        setOptionSalesDistrict(selectSalesDistrictData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const handleInputSalesGroupChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectSalesGroupData = await getSelectData(
          "sales_group_code",
          inputValue,
          "sales_group"
        );
        setOptionSalesGroup(selectSalesGroupData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const handleInputSalesOfficeChange = useCallback(
    debounce(async inputValue => {
      try {
        const selectSalesOfficeData = await getSelectData(
          "sales_office_code",
          inputValue,
          "sales_office"
        );
        setOptionSalesOffice(selectSalesOfficeData?.getDataByColNameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const handleInputSalesEmployeeCode = useCallback(
    debounce(async inputValue => {
      try {
        const salesEmployeeCodeData = await getEmployeeMaster();
        const selectSalesEmployeeData = salesEmployeeCodeData.employees;
        const optionSalesEmployeeCodeData = selectSalesEmployeeData.map(
          item => {
            const salesEmployeeName = `${item.title} ${item.firstname} ${item.lastname}`;
            return {
              id: item.id,
              value: item.employee_code,
              label: `${item.employee_code} - ${salesEmployeeName}`,
            };
          }
        );
        setOptionSalesEmployeeCode(optionSalesEmployeeCodeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  const handleInputCompanyCode = useCallback(
    debounce(async inputValue => {
      try {
        const companyData = await getCompanyLegalEntity();
        const optionCompanyData = companyData.map(item => {
          return {
            id: item.id,
            value: item.company_code,
            label: `${item.company_code} - ${item.company_name}`,
          };
        });
        setOptionCompanyCode(optionCompanyData);
      } catch (error) {
        console.error("Error fetching Company data:", error);
      }
    })
  );

  const validateForm = () => {
    const errorsdata = {};
    let isValid = true;

    if (!formData.so_doc_type_id) {
      errorsdata.so_doc_type_id = "SO DOC Type is required";
    }
    if (!formData.so_number) {
      errorsdata.so_number = "Sales Order No. is required";
    }
    if (!formData.company_id) {
      errorsdata.company_id = "Company Code is required";
    }
    if (!formData.customer_sold_to_id) {
      errorsdata.customer_sold_to_id = "Sold To Customer is required";
    }
    if (!formData.customer_ship_to_id) {
      errorsdata.customer_ship_to_id = "Ship To Customer is required";
    }
    if (!formData.ship_to_address) {
      errorsdata.ship_to_address = "Ship To Address is required";
    }
    if (!formData.sales_group_id) {
      errorsdata.sales_group_id = "Sales Group is required";
    }
    if (!formData.sales_organisation_id) {
      errorsdata.sales_organisation_id = "Sales Organisation is required";
    }
    if (!formData.sales_district_id) {
      errorsdata.sales_district_id = "Sales District is required";
    }
    if (!formData.sales_office_id) {
      errorsdata.sales_office_id = "Sales Office is required";
    }
    if (!formData.sales_employee_id) {
      errorsdata.sales_employee_id = "Sales Employee Code is required";
    }
    if (!formData.distribution_id) {
      errorsdata.distribution_id = "Distribution is required";
    }
    if (!formData.division_id) {
      errorsdata.division_id = "Division is required";
    }
    if (!formData.so_doc_date) {
      errorsdata.so_doc_date = "DOC Date is required";
    }
    if (!formData.total_so_quantity) {
      errorsdata.total_so_quantity = "Total SO Quantity is required";
    }
    if (!formData.total_so_amount) {
      errorsdata.total_so_amount = "Total SO Amount is required";
    }
    if (formData.total_so_discount === undefined || formData.total_so_discount === "") {
      errorsdata.total_so_discount = "Total SO Discount is required";
    } else if (formData.total_so_discount < 0) {
      errorsdata.total_so_discount = "Total Discount cannot be negative";
    }
    if (!formData.so_net_total) {
      errorsdata.so_net_total = "SO Net Total is required";
    }

    // if (selectedQuotationValues.length == 0) {
    //   errorsdata.approved_qos = "*";
    //   isValid = false;
    // } else {
    quotationLineItemList.forEach((item, index) => {
      Object.keys(item).forEach(fieldName => {
        if (
          [`sales_order_line_item_no`, `so_quantity`, `so_unit_price`, `so_discount`, `location_id`, `tax_per`].includes(fieldName)
        ) {
          if (item[fieldName] === "" || item[fieldName] < 0) {
            validateField(`${fieldName}-${index}`, item[fieldName]);
            isValid = false;
          }
        }
      });
    });
    // }

    setFormErrors(errorsdata);
    return isValid && Object.keys(errorsdata).length === 0;
  };

  const handleSave = () => {
    setIsSubmitted(true);

    if (quotationLineItemList.length === 0) {
      setToast(true);
      setToastMessage("Please add at least one line item before submitting.");
      setTimeout(() => setToast(false), 2000);
      return;
    }

    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const so_data = {
      formData,
      so_details: quotationLineItemList,
    };
    dispatch({
      type: ADD_SALES_ORDER_REQUEST,
      payload: so_data,
    });
  };

  const handleAddRowNested = () => {
    const newLineNo =
      quotationLineItemList.length > 0 ? parseInt(quotationLineItemList[quotationLineItemList.length - 1].sales_order_line_item_no) + parseInt(10) : 10;
    setQuotationLineItemList([
      ...quotationLineItemList,
      {
        sales_order_line_item_no: newLineNo,
        quotation_number: "",
        quantity: "",
        so_quantity: "",
        so_sub_total: "",
        tax_per: "",
        so_tax_amount: "",
        so_discount: "",
        so_net_value: "",
        product_code: "",
        product_description: "",
        customer_prod_description: "",
        hsn_id: "",
        sac_id: "",
        profit_center: "",
        uom_id: "",
        bill_to_customer: "",
        payer_customer: "",
        warehouse_id: "",
        location_id: "",
        item_category_id: "",
      },
    ]);
  };

  const handleRemoveRowNested = idx => {
    const newLineItems = [...quotationLineItemList];
    newLineItems.splice(idx, 1)
    setQuotationLineItemList(newLineItems);

    // Recalculate totals from newLineItems (after deletion)
    const totalQuantity = newLineItems.reduce((sum, item) => {
      return sum + (item.so_quantity === "" ? 0 : Number(item.so_quantity));
    }, 0);

    const totalAmount = newLineItems.reduce((sum, item) => {
      return sum + (item.so_sub_total === "" ? 0 : Number(item.so_sub_total));
    }, 0);

    const totalDiscount = newLineItems.reduce((sum, item) => {
      return sum + (item.so_discount === "" ? 0 : Number(item.so_discount));
    }, 0);

    const totalTaxAmount = newLineItems.reduce((sum, item) => {
      return sum + (item.so_tax_amount === "" ? 0 : Number(item.so_tax_amount));
    }, 0);

    const netTotal = newLineItems.reduce((sum, item) => {
      return sum + (item.so_net_value === "" ? 0 : Number(item.so_net_value));
    }, 0);

    // Update formData
    setFormData(prevData => ({
      ...prevData,
      total_so_quantity: totalQuantity,
      total_so_amount: totalAmount,
      total_so_discount: totalDiscount,
      total_so_tax_amount: totalTaxAmount,
      so_net_total: netTotal,
    }));

  };

  const handleInputChange = (index, fieldName, value) => {
    const newLineItems = [...quotationLineItemList];
    newLineItems[index][fieldName] = value;
    setQuotationLineItemList(newLineItems);
    validateField(`${fieldName}-${index}`, value);

    const totalQuantity = quotationLineItemList.reduce((sum, item) => {
      return sum + (item.so_quantity == "" ? 0 : Number(item.so_quantity));
    }, 0);

    setFormData(prevData => ({
      ...prevData,
      total_so_quantity: totalQuantity,
    }));

    const totalAmount = quotationLineItemList.reduce((sum, item) => {
      return sum + (item.so_sub_total == "" ? 0 : Number(item.so_sub_total));
    }, 0);

    setFormData(prevData => ({
      ...prevData,
      total_so_amount: totalAmount,
    }));

    const totalDiscount = quotationLineItemList.reduce((sum, item) => {
      return sum + (item.so_discount == "" ? 0 : Number(item.so_discount));
    }, 0);

    setFormData(prevData => ({
      ...prevData,
      total_so_discount: totalDiscount,
    }));

    const totalTaxAmount = quotationLineItemList.reduce((sum, item) => {
      return sum + (item.so_tax_amount == "" ? 0 : Number(item.so_tax_amount));
    }, 0);

    setFormData(prevData => ({
      ...prevData,
      total_so_tax_amount: totalTaxAmount,
    }));

    const netTotal = quotationLineItemList.reduce((sum, item) => {
      return (
        sum +
        (item.so_net_value == "" ? 0 : Number(item.so_net_value))
      );
    }, 0);

    setFormData(prevData => ({
      ...prevData,
      so_net_total: Number(netTotal),
    }));
  };

  const handleCancel = () => {
    history.push("/sales_order");
  };

  document.title = "Detergent | Create Sales Order";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          {toast && (
            <div
              className="position-fixed top-0 end-0 p-3"
              style={{ zIndex: "1005" }}
            >
              <Alert color={addSalesOrders?.success ? "success" : "danger"} role="alert">
                {toastMessage}
              </Alert>
            </div>
          )}
          <Breadcrumbs
            titlePath="/sales_order"
            title="SO"
            breadcrumbItem="Create Sales Order"
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
                        <Col md="2" className="mb-2">
                          <div className="">
                            <RequiredLabel
                              htmlFor="formrow-state-Input"
                              label="Sales Order Doc. Type"
                            />
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...customStyles.control(provided, state),
                                  borderColor:
                                    isSubmitted &&
                                      (!selectSODocType || !selectSODocType.value)
                                      ? "red"
                                      : provided.borderColor,
                                }),
                              }}
                              value={selectSODocType}
                              options={optionSODocType}
                              onChange={async selectSODocType => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  so_doc_type_id: selectSODocType?.value,
                                }));
                                setSelectedSODocType(selectSODocType);

                                const getSalesDocTypeData =
                                  await getSalesOrderDocTypeById(
                                    selectSODocType.value
                                  );
                                const incrementNumberStatus = numberStatus => {
                                  if (numberStatus === null) {
                                    return null;
                                  }
                                  const incremented = (
                                    parseInt(numberStatus, 10) + 1
                                  )
                                    .toString()
                                    .padStart(numberStatus.length, "0");
                                  return incremented;
                                };

                                const salesOrderNumber =
                                  getSalesDocTypeData?.number_status === null
                                    ? getSalesDocTypeData?.from_number
                                    : getSalesDocTypeData?.sales_order_doc_type ===
                                      selectSODocType.label
                                      ? incrementNumberStatus(
                                        getSalesDocTypeData?.number_status
                                      )
                                      : incrementNumberStatus(
                                        getSalesDocTypeData?.number_status
                                      );

                                setFormData(prevData => ({
                                  ...prevData,
                                  so_number: salesOrderNumber,
                                }));
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputSODocChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>
                        <Col md="2" className="mb-1">
                          <RequiredLabel
                            htmlFor="so_number"
                            label="Sales Order No."
                          />
                          <div>
                            <Label>{formData?.so_number}</Label>
                          </div>
                        </Col>
                        <Col md="2" className="mb-2">
                          <div className="">
                            <RequiredLabel
                              htmlFor="formrow-state-Input"
                              label="Doc Date"
                            />
                            <FormGroup className="mb-4">
                              <InputGroup>
                                <Flatpickr
                                  ref={flatpickrRef}
                                  placeholder="DD/MM/YYYY"
                                  options={{
                                    altInput: true,
                                    altFormat: "F j, Y",
                                    dateFormat: "DD/MM/YYYY",
                                    minDate: "today",
                                  }}
                                  onReady={(selectedDates, dateStr, instance) => {
                                    if (instance.altInput) {
                                      Object.assign(instance.altInput.style, {
                                        ...customFlatPickerStyles,
                                        borderColor: formErrors.inquiry_date
                                          ? "red"
                                          : "#ced4da",
                                      });
                                    }
                                  }}
                                  onChange={(
                                    selectedDates,
                                    dateStr,
                                    instance
                                  ) => {
                                    setFormData(prevData => ({
                                      ...prevData,
                                      so_doc_date: moment(
                                        selectedDates[0]
                                      ).format("DD/MM/YYYY"),
                                    }));
                                  }}
                                  value={moment(
                                    formData?.so_doc_date,
                                    "DD/MM/YYYY"
                                  ).toDate()}
                                />
                              </InputGroup>
                            </FormGroup>
                          </div>
                        </Col>
                        <Col md="2" className="mb-2">
                          <div className="">
                            <RequiredLabel
                              htmlFor="formrow-state-Input"
                              label="Ship To"
                            />
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...customStyles.control(provided, state),
                                  borderColor:
                                    isSubmitted &&
                                      (!selectSoldToCustomer ||
                                        !selectSoldToCustomer.value)
                                      ? "red"
                                      : provided.borderColor,
                                }),
                              }}
                              value={selectSoldToCustomer}
                              options={optionSoldToCustomer}
                              onChange={handleSoldToChange}
                            />
                          </div>
                        </Col>
                        {/* <Col md="2" className="mb-2">
                          <div className="">
                            <RequiredLabel
                              htmlFor="formrow-state-Input"
                              label="Ship To"
                            />
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...customStyles.control(provided, state),
                                  borderColor:
                                    isSubmitted &&
                                      (!selectShipToCustomer ||
                                        !selectShipToCustomer.value)
                                      ? "red"
                                      : provided.borderColor,
                                }),
                              }}
                              value={selectShipToCustomer}
                              options={optionShipToCustomer}
                              isDisabled={false}
                              onChange={async selectShipToCustomer => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  customer_ship_to_id: selectShipToCustomer?.id,
                                }));
                                setSelectedShipToCustomer(selectShipToCustomer);
                              }}
                            />
                          </div>
                        </Col> */}
                        <Col md="2" className="mb-1">
                          <RequiredLabel
                            htmlFor="shipToCustomerAddress"
                            label="Ship To Address"
                          />
                          <div>
                            <Label>{formData?.ship_to_address}</Label>
                          </div>
                        </Col>
                        <Col md="2" className="mb-2">
                          <div className="">
                            <RequiredLabel
                              htmlFor="formrow-state-Input"
                              label="Company"
                            />
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...customStyles.control(provided, state),
                                  borderColor:
                                    isSubmitted &&
                                      (!selectCompanyCode ||
                                        !selectCompanyCode.value)
                                      ? "red"
                                      : provided.borderColor,
                                }),
                              }}
                              value={selectCompanyCode}
                              options={optionCompanyCode}
                              onChange={async selectCompanyCode => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  company_id: selectCompanyCode?.id,
                                }));
                                setSelectedCompanyCode(selectCompanyCode);
                                const getCompanyData =
                                  await getCompanyLegalEntityByID(
                                    selectCompanyCode?.id
                                  );
                                setFormData(prevData => ({
                                  ...prevData,
                                  company_id: getCompanyData?.id,
                                }));
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputCompanyCode(inputValue);
                              }}
                            />
                          </div>
                        </Col>
                        <Col md="2" className="mb-2">
                          <div className="">
                            <RequiredLabel
                              htmlFor="formrow-state-Input"
                              label="Sales Employee Code"
                            />
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...customStyles.control(provided, state),
                                  borderColor:
                                    isSubmitted &&
                                      (!selectSalesEmployeeCode ||
                                        !selectSalesEmployeeCode.value)
                                      ? "red"
                                      : provided.borderColor,
                                }),
                              }}
                              value={selectSalesEmployeeCode}
                              options={optionSalesEmployeeCode}
                              onChange={async selectSalesEmployeeCode => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  sales_employee_id: selectSalesEmployeeCode?.id,
                                }));
                                setSelectedSalesEmployeeCode(
                                  selectSalesEmployeeCode
                                );
                                const getSalesEmployeeCode =
                                  await getEmployeeByID(
                                    selectSalesEmployeeCode?.id
                                  );
                                setFormData(prevData => ({
                                  ...prevData,
                                  sales_employee_id: getSalesEmployeeCode?.id,
                                }));
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputSalesEmployeeCode(inputValue);
                              }}
                            />
                          </div>
                        </Col>
                        <Col lg="2" className="mb-2">
                          <div className="">
                            <RequiredLabel
                              htmlFor="formrow-state-Input"
                              label="Distribution Channel"
                            />
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...customStyles.control(provided, state),
                                  borderColor:
                                    isSubmitted &&
                                      (!selectDistribution ||
                                        !selectDistribution.value)
                                      ? "red"
                                      : provided.borderColor,
                                }),
                              }}
                              value={selectDistribution}
                              options={optionDistribution}
                              onChange={async selectDistribution => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  distribution_id: selectDistribution?.value,
                                }));
                                setSelectedDistribution(selectDistribution);
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputDistributionChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>
                        <Col lg="2" className="mb-2">
                          <div className="">
                            <RequiredLabel
                              htmlFor="formrow-state-Input"
                              label="Division"
                            />
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...customStyles.control(provided, state),
                                  borderColor:
                                    isSubmitted &&
                                      (!selectDivision || !selectDivision.value)
                                      ? "red"
                                      : provided.borderColor,
                                }),
                              }}
                              value={selectDivision}
                              options={optionDivision}
                              onChange={async selectDivision => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  division_id: selectDivision?.value,
                                }));
                                setSelectedDivision(selectDivision);
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputDivisionChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>
                        <Col md="2" className="mb-2">
                          <div className="">
                            <RequiredLabel
                              htmlFor="formrow-state-Input"
                              label="Sales Organisation"
                            />
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...customStyles.control(provided, state),
                                  borderColor:
                                    isSubmitted &&
                                      (!selectSalesOrganization ||
                                        !selectSalesOrganization.value)
                                      ? "red"
                                      : provided.borderColor,
                                }),
                              }}
                              value={selectSalesOrganization}
                              options={optionSalesOrganization}
                              onChange={async selectSalesOrganization => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  sales_organisation_id:
                                    selectSalesOrganization?.value,
                                }));
                                setSelectedSalesOrganization(
                                  selectSalesOrganization
                                );
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputSalesOrganisationChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>
                        <Col md="2" className="mb-2">
                          <div className="">
                            <RequiredLabel
                              htmlFor="formrow-state-Input"
                              label="Sales Group"
                            />
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...customStyles.control(provided, state),
                                  borderColor:
                                    isSubmitted &&
                                      (!selectSalesGroup || !selectSalesGroup.value)
                                      ? "red"
                                      : provided.borderColor,
                                }),
                              }}
                              value={selectSalesGroup}
                              options={optionSalesGroup}
                              onChange={async selectSalesGroup => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  sales_group_id: selectSalesGroup?.value,
                                }));
                                setSelectedSalesGroup(selectSalesGroup);
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputSalesGroupChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>
                        <Col md="2" className="mb-2">
                          <div className="">
                            <RequiredLabel
                              htmlFor="formrow-state-Input"
                              label="Sales Office"
                            />
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...customStyles.control(provided, state),
                                  borderColor:
                                    isSubmitted &&
                                      (!selectSalesOffice ||
                                        !selectSalesOffice.value)
                                      ? "red"
                                      : provided.borderColor,
                                }),
                              }}
                              value={selectSalesOffice}
                              options={optionSalesOffice}
                              onChange={async selectSalesOffice => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  sales_office_id: selectSalesOffice?.value,
                                }));
                                setSelectedSalesOffice(selectSalesOffice);
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputSalesOfficeChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>
                        <Col md="2" className="mb-2">
                          <div className="">
                            <RequiredLabel
                              htmlFor="formrow-state-Input"
                              label="Sales District"
                            />
                            <Select
                              styles={{
                                ...customStyles,
                                control: (provided, state) => ({
                                  ...customStyles.control(provided, state),
                                  borderColor:
                                    isSubmitted &&
                                      (!selectSalesDistrict ||
                                        !selectSalesDistrict.value)
                                      ? "red"
                                      : provided.borderColor,
                                }),
                              }}
                              value={selectSalesDistrict}
                              options={optionSalesDistrict}
                              onChange={async selectSalesDistrict => {
                                setFormData(prevData => ({
                                  ...prevData,
                                  sales_district_id: selectSalesDistrict?.value,
                                }));
                                setSelectedSalesDistrict(selectSalesDistrict);
                              }}
                              onInputChange={(inputValue, { action }) => {
                                handleInputSalesDistrictChange(inputValue);
                              }}
                            />
                          </div>
                        </Col>
                        <Col md="2" className="mb-1">
                          <RequiredLabel
                            htmlFor="totalSalesOrderQuantity"
                            label="Total Quantity"
                          />
                          <div>
                            <Label>{formData?.total_so_quantity}</Label>
                          </div>
                        </Col>
                        <Col md="2" className="mb-1">
                          <RequiredLabel
                            htmlFor="totalSalesOrderAmount"
                            label="Total Amount"
                          />
                          <div>
                            <Label>{formData?.total_so_amount}</Label>
                          </div>
                        </Col>
                        <Col md="2" className="mb-1">
                          <RequiredLabel
                            htmlFor="totalSalesOrderDiscount"
                            label="Total Discount"
                          />
                          <div>
                            <Label>{formData?.total_so_discount}</Label>
                          </div>
                        </Col>
                        <Col md="2" className="mb-1">
                          <RequiredLabel
                            htmlFor="totalSalesOrderTaxAmount"
                            label="Total Tax Amount"
                          />
                          <div>
                            <Label>{formData?.total_so_tax_amount}</Label>
                          </div>
                        </Col>
                        <Col md="2" className="mb-1">
                          <RequiredLabel
                            htmlFor="totalSalesOrderNetAmount"
                            label="Net Total"
                          />
                          <div>
                            <Label>{formData?.so_net_total}</Label>
                          </div>
                        </Col>
                        <Col md="3" className="mb-1">
                          <Label htmlFor="systemDateTime">
                            Created on Date
                          </Label>
                          <Label>{todayDate}</Label>
                        </Col>
                      </Row>

                      <Row>
                        <CardTitle className="mb-4"></CardTitle>
                        <Col lg="3">
                          {/* {optionDropDownItems && optionDropDownItems.length > 0 ? (
                            <>
                              <Label>Approved Quotations</Label>
                              <Select
                                isMulti
                                multiple
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={{
                                  control: provided => ({
                                    ...provided,
                                    borderColor: formErrors.approved_qos
                                      ? "#f46a6a"
                                      : provided.borderColor,
                                  }),
                                }}
                                value={selectedQuotationValues}
                                options={optionDropDownItems}
                                onChange={async selectedQuotationValues => {
                                  setSelectedQuotationValues(selectedQuotationValues);
                                  const selectedLabels = selectedQuotationValues.map(
                                    item => item.label
                                  );
                                  const so_details = originalQuotationLineItemList.filter(item =>
                                    selectedLabels.includes(item.quotation_number)
                                  );
                                  setQuotationLineItemList(so_details);
                                }}
                              />
                            </>
                          ) : ( */}
                          <Button
                            //color="primary"
                            className="mt-3 mt-lg-0 btn-custom-theme"
                            onClick={handleAddRowNested}
                          >
                            Add Line Item
                          </Button>
                          {/* )} */}
                        </Col>
                      </Row>

                      <CardTitle className="mb-4"></CardTitle>
                      <Row>
                        <Col lg="12">
                          <Table style={{ width: "100%" }}>
                            <tbody>
                              {quotationLineItemList.map((item, idx) => (
                                <tr id={`addr${idx}`} key={idx}>
                                  <td>
                                    <Form
                                      className="repeater mt-3"
                                      encType="multipart/form-data"
                                    >
                                      <div data-repeater-list="group-a">
                                        <Row data-repeater-item>

                                          <Col lg="1" className="mb-1">
                                            {idx === 0 ? (
                                              <RequiredLabel
                                                htmlFor={`sales_order_line_item_no-${idx}`}
                                                label="Line No."
                                              />
                                            ) : (
                                              ""
                                            )}
                                            <Input
                                              type="number"
                                              min="1"
                                              value={
                                                item.sales_order_line_item_no
                                              }
                                              onChange={e => {
                                                const value = e.target.value;
                                                if (value > 0) {
                                                  handleInputChange(idx, "sales_order_line_item_no", value);
                                                }
                                              }}
                                              id={`sales_order_line_item_no-${idx}`}
                                              name="sales_order_line_item_no"
                                              className="form-control-sm"
                                              style={{
                                                borderColor: errors[
                                                  `sales_order_line_item_no-${idx}`
                                                ]
                                                  ? "red"
                                                  : "#ced4da",
                                              }}
                                            />
                                          </Col>
                                          <Col lg="2" className="mb-1">
                                            {idx === 0 ? (
                                              <RequiredLabel
                                                htmlFor={`product_code-${idx}`}
                                                label="Product Code/Name"
                                              />
                                            ) : (
                                              ""
                                            )}
                                            <Select
                                              styles={{
                                                ...customStyles,
                                                control: (provided, state) => ({
                                                  ...customStyles.control(
                                                    provided,
                                                    state
                                                  ),
                                                  borderColor:
                                                    isSubmitted &&
                                                      (!item.productCode ||
                                                        !item.productCode.value)
                                                      ? "red"
                                                      : provided.borderColor,
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
                                                const gstRate = Number(getProductsData?.gst_rate || 0);

                                                handleInputChange(
                                                  idx,
                                                  "product_description",
                                                  getProductsData?.product_description
                                                );
                                                handleInputChange(
                                                  idx,
                                                  "tax_per",
                                                  gstRate
                                                )
                                                handleInputChange(
                                                  idx,
                                                  "hsn",
                                                  getProductsData?.hsn_sac_code
                                                )
                                                if (getProductsData?.uom) {
                                                  handleInputChange(idx, "uom_id", getProductsData.uom);
                                                }
                                              }}
                                            />
                                          </Col>
                                          <Col lg="1" className="mb-1">
                                            {idx === 0 && (
                                              <RequiredLabel
                                                htmlFor={`so_quantity-${idx}`}
                                                label="SO Qty."
                                              />
                                            )}
                                            <Input
                                              type="number"
                                              max={item?.quantity}
                                              min="1"
                                              value={item.so_quantity || ""}
                                              id={`so_quantity-${idx}`}
                                              className="form-control-sm"
                                              style={{
                                                borderColor: isSubmitted &&
                                                  (!item.so_quantity)
                                                  ? "red"
                                                  : "#ced4da",
                                              }}
                                              onChange={e => {
                                                const value = e.target.value;
                                                const qty = Number(value);
                                                const unitPrice = Number(item?.so_unit_price || 0);
                                                const taxRate = Number(item?.tax_per || 0);
                                                const discount = Number(item?.so_discount || 0);

                                                if (value === "" ||
                                                  (qty > 0 && Number.isInteger(qty))) {
                                                  const subTotal = qty * unitPrice;
                                                  const taxAmount = (subTotal * taxRate) / 100;
                                                  const netValue = subTotal + taxAmount - discount;

                                                  handleInputChange(idx, "so_quantity", value);
                                                  handleInputChange(
                                                    idx,
                                                    "so_sub_total",
                                                    subTotal
                                                  );
                                                  handleInputChange(
                                                    idx,
                                                    "so_tax_amount",
                                                    taxAmount
                                                  );
                                                  handleInputChange(
                                                    idx,
                                                    "so_net_value",
                                                    netValue.toFixed(2)
                                                  );
                                                }
                                              }}
                                            />
                                          </Col>
                                          <Col lg="1" className="mb-1">
                                            {idx === 0 ? (
                                              <RequiredLabel
                                                htmlFor={`so_unit_price-${idx}`}
                                                label="Unit Price"
                                              />
                                            ) : (
                                              ""
                                            )}
                                            <Input
                                              type="number"
                                              min="1"
                                              value={
                                                quotationLineItemList[idx]
                                                  .so_unit_price || ""
                                              }
                                              onChange={e => {
                                                const price = Number(e.target.value);
                                                const qty = Number(item?.so_quantity || 0);
                                                const taxRate = Number(item?.tax_per || 0);
                                                const discount = Number(item?.so_discount || 0);

                                                if (price > 0) {
                                                  const subTotal = qty * price;
                                                  const taxAmount = (subTotal * taxRate) / 100;
                                                  const netValue = subTotal + taxAmount - discount;

                                                  handleInputChange(idx, "so_unit_price", price);
                                                  handleInputChange(idx, "so_sub_total", subTotal);
                                                  handleInputChange(idx, "so_tax_amount", taxAmount);
                                                  handleInputChange(idx, "so_net_value", netValue.toFixed(2));
                                                } else {
                                                  handleInputChange(idx, "so_unit_price", "");
                                                  handleInputChange(idx, "so_sub_total", "");
                                                  handleInputChange(idx, "so_tax_amount", "");
                                                  handleInputChange(idx, "so_net_value", "");
                                                }
                                              }}
                                              id={`so_unit_price-${idx}`}
                                              name="so_unit_price"
                                              className="form-control-sm"
                                              style={{
                                                borderColor: isSubmitted &&
                                                  (!quotationLineItemList[idx]
                                                    .so_unit_price)
                                                  ? "red"
                                                  : "#ced4da",
                                              }}
                                            />
                                          </Col>
                                          <Col lg="1" className="mb-1">
                                            {idx === 0 ? (
                                              <Label
                                                htmlFor={`so_sub_total-${idx}`}
                                              >
                                                Sub Total
                                              </Label>
                                            ) : (
                                              ""
                                            )}
                                            <p>{item?.so_sub_total}</p>
                                          </Col>
                                          <Col lg="1" className="mb-1">
                                            {idx == 0 ? (
                                              <RequiredLabel
                                                htmlFor={`tax_per-${idx}`}
                                                label="Tax %"
                                              />
                                            ) : null}
                                            <p>{item?.tax_per ?? "0"}</p>
                                          </Col>
                                          <Col lg="1" className="mb-1">
                                            {idx === 0 ? (
                                              <RequiredLabel
                                                htmlFor={`so_tax_amount-${idx}`}
                                                label="Tax Amount"
                                              />
                                            ) : (
                                              ""
                                            )}
                                            <p>{item?.so_tax_amount ?? "0.00"}</p>
                                          </Col>
                                          <Col lg="1" className="mb-1">
                                            {idx === 0 ? (
                                              <RequiredLabel
                                                htmlFor={`so_discount-${idx}`}
                                                label="Discount"
                                              />
                                            ) : (
                                              ""
                                            )}
                                            <Input
                                              type="number"
                                              min="0"
                                              value={item.so_discount}
                                              onChange={e => {
                                                const discountValue = parseFloat(e.target.value)
                                                const subTotal = parseFloat(item?.so_sub_total) || 0;
                                                const taxAmount = parseFloat(item?.so_tax_amount) || 0;

                                                if (discountValue < 0) {
                                                  setErrors((prevErrors) => ({
                                                    ...prevErrors,
                                                    [`so_discount-${idx}`]: "Discount cannot be negative.",
                                                  }));
                                                } else if (discountValue > (subTotal + taxAmount)) {
                                                  setErrors((prevErrors) => ({
                                                    ...prevErrors,
                                                    [`so_discount-${idx}`]: "Discount cannot exceed net value.",
                                                  }));
                                                } else {
                                                  const netValue = subTotal + taxAmount - discountValue;
                                                  setErrors((prevErrors) => ({
                                                    ...prevErrors,
                                                    [`so_discount-${idx}`]: undefined,
                                                  }));
                                                  {
                                                    handleInputChange(
                                                      idx,
                                                      "so_discount",
                                                      discountValue
                                                    );
                                                    handleInputChange(
                                                      idx,
                                                      "so_net_value",
                                                      netValue.toFixed(2)
                                                    );
                                                    handleInputChange(
                                                      idx,
                                                      "total_discount",
                                                      discountValue
                                                    );
                                                  }
                                                }
                                              }}
                                              id={`so_discount-${idx}`}
                                              name="so_discount"
                                              className="form-control-sm"
                                              style={{
                                                borderColor: errors[
                                                  `so_discount-${idx}`
                                                ]
                                                  ? "red"
                                                  : "#ced4da",
                                              }}
                                            />
                                          </Col>
                                          <Col lg="1" className="mb-1">
                                            {idx === 0 ? (
                                              <Label
                                                htmlFor={`so_net_value-${idx}`}
                                              >
                                                Net Value
                                              </Label>
                                            ) : (
                                              ""
                                            )}
                                            <p>{Number(item?.so_net_value)}</p>
                                          </Col>
                                          {/* <Col lg="2" className="mb-1">
                                            {idx === 0 ? (
                                              <RequiredLabel
                                                htmlFor={`product_description-${idx}`}
                                                label="Prod Desc."
                                              />
                                            ) : (
                                              ""
                                            )}
                                            <Input
                                              type="textarea"
                                              value={item.product_description || ""}
                                              onChange={e =>
                                                handleInputChange(
                                                  idx,
                                                  "product_description",
                                                  e.target.value
                                                )
                                              }
                                              id={`product_description-${idx}`}
                                              className={isSubmitted && (!item.product_description)
                                                ? "border-danger"
                                                : ""
                                              }
                                            />
                                          </Col> */}
                                          <Col lg="2" className="mb-1">
                                            {idx === 0 ? (
                                              <RequiredLabel
                                                htmlFor={`hsn-${idx}`}
                                                label="HSN/SAC"
                                              />
                                            ) : null}
                                            <p>{item?.hsn}</p>
                                          </Col>
                                          {/* <Col lg="2" className="mb-1">
                                            {idx === 0 ? (
                                              <RequiredLabel
                                                htmlFor={`profit_center-${idx}`}
                                                label="Profit Center"
                                              />
                                            ) : (
                                              ""
                                            )}
                                            <Input
                                              type="text"
                                              value={item.profit_center || ""}
                                              onChange={e =>
                                                handleInputChange(
                                                  idx,
                                                  "profit_center",
                                                  e.target.value
                                                )
                                              }
                                              id={`profit_center-${idx}`}
                                              className="form-control-sm"
                                              style={{
                                                borderColor: isSubmitted &&
                                                  (!item.profit_center)
                                                  ? "red"
                                                  : "#ced4da",
                                              }}
                                            />
                                          </Col> */}
                                          <Col lg="2" className="mb-1">
                                            <div className="">
                                              {idx == 0 ? (
                                                <RequiredLabel
                                                  htmlFor={`uom_id-${idx}`}
                                                  label="UOM"
                                                />
                                              ) : (
                                                ""
                                              )}
                                              <Select
                                                styles={{
                                                  ...customStyles,
                                                  control: (provided, state) => ({
                                                    ...customStyles.control(
                                                      provided,
                                                      state
                                                    ),
                                                    borderColor: isSubmitted &&
                                                      (!item.uom_id ||
                                                        !item.uom_id.value)
                                                      ? "red"
                                                      : provided.borderColor,
                                                  }),
                                                }}
                                                value={item.uom_id || ""}
                                                options={optionProductUOM}
                                                onChange={selected =>
                                                  handleInputChange(
                                                    idx,
                                                    "uom_id",
                                                    selected
                                                  )
                                                }
                                              />
                                            </div>
                                          </Col>
                                          <Col md="2" className="mb-2">
                                            <div className="">
                                              {idx == 0 ? (
                                                <RequiredLabel
                                                  htmlFor="formrow-state-Input"
                                                  label="Bill To Code"
                                                />
                                              ) : (
                                                ""
                                              )}
                                              <Select
                                                styles={{
                                                  ...customStyles,
                                                  control: (provided, state) => ({
                                                    ...customStyles.control(
                                                      provided,
                                                      state
                                                    ),
                                                    borderColor: isSubmitted &&
                                                      (!item.bill_to_customer ||
                                                        !item.bill_to_customer.value)
                                                      ? "red"
                                                      : provided.borderColor,
                                                  }),
                                                }}
                                                value={
                                                  item.bill_to_customer || ""
                                                }
                                                options={optionBillToCustomer}
                                                onChange={selected =>
                                                  handleInputChange(
                                                    idx,
                                                    "bill_to_customer",
                                                    selected
                                                  )
                                                }
                                              />
                                            </div>
                                          </Col>
                                          <Col md="2" className="mb-2">
                                            <div className="">
                                              {idx == 0 ? (
                                                <RequiredLabel
                                                  htmlFor="formrow-state-Input"
                                                  label="Payer Code"
                                                />
                                              ) : (
                                                ""
                                              )}
                                              <Select
                                                styles={{
                                                  ...customStyles,
                                                  control: (provided, state) => ({
                                                    ...customStyles.control(
                                                      provided,
                                                      state
                                                    ),
                                                    borderColor: isSubmitted &&
                                                      (!item.payer_customer ||
                                                        !item.payer_customer.value)
                                                      ? "red"
                                                      : provided.borderColor,
                                                  }),
                                                }}
                                                value={item?.payer_customer || ""}
                                                options={optionPayerCustomer}
                                                onChange={selected =>
                                                  handleInputChange(
                                                    idx,
                                                    "payer_customer",
                                                    selected
                                                  )
                                                }
                                              />
                                            </div>
                                          </Col>
                                          <Col lg="2" className="mb-1">
                                            <div className="">
                                              {idx == 0 ? (
                                                <RequiredLabel
                                                  htmlFor={`warehouse_id-${idx}`}
                                                  label="Plant"
                                                />
                                              ) : (
                                                ""
                                              )}
                                              <Select
                                                styles={{
                                                  ...customStyles,
                                                  control: (provided, state) => ({
                                                    ...customStyles.control(
                                                      provided,
                                                      state
                                                    ),
                                                    borderColor: isSubmitted &&
                                                      (!item.warehouse_id ||
                                                        !item.warehouse_id.value)
                                                      ? "red"
                                                      : provided.borderColor,
                                                  }),
                                                }}
                                                value={item.warehouse_id}
                                                options={optionWarehouse}
                                                onChange={selected =>
                                                  handleInputChange(
                                                    idx,
                                                    "warehouse_id",
                                                    selected
                                                  )
                                                }
                                              />
                                            </div>
                                          </Col>
                                          <Col lg="2" className="mb-1">
                                            <div className="">
                                              {idx == 0 ? (
                                                <RequiredLabel
                                                  htmlFor={`location_id-${idx}`}
                                                  label="Location"
                                                />
                                              ) : (
                                                ""
                                              )}
                                              <Select
                                                styles={{
                                                  ...customStyles,
                                                  control: (provided, state) => ({
                                                    ...customStyles.control(
                                                      provided,
                                                      state
                                                    ),
                                                    borderColor: isSubmitted &&
                                                      (!item.location_id ||
                                                        !item.location_id.value)
                                                      ? "red"
                                                      : provided.borderColor,
                                                  }),
                                                }}
                                                value={item.location_id}
                                                options={optionLocation}
                                                onChange={selected =>
                                                  handleInputChange(
                                                    idx,
                                                    "location_id",
                                                    selected
                                                  )
                                                }
                                              />
                                            </div>
                                          </Col>
                                          <Col lg="2" className="mb-1">
                                            <div className="">
                                              {idx == 0 ? (
                                                <RequiredLabel
                                                  htmlFor={`item_category_id-${idx}`}
                                                  label="Item Category"
                                                />
                                              ) : (
                                                ""
                                              )}
                                              <Select
                                                styles={{
                                                  ...customStyles,
                                                  control: (provided, state) => ({
                                                    ...customStyles.control(
                                                      provided,
                                                      state
                                                    ),
                                                    borderColor: isSubmitted &&
                                                      (!item.item_category_id ||
                                                        !item.item_category_id.value)
                                                      ? "red"
                                                      : provided.borderColor,
                                                  }),
                                                }}
                                                value={
                                                  item.item_category_id || ""
                                                }
                                                options={optionItemCategory}
                                                onChange={selected =>
                                                  handleInputChange(
                                                    idx,
                                                    "item_category_id",
                                                    selected
                                                  )
                                                }
                                              />
                                            </div>
                                          </Col>
                                          <Col lg="1" className="mb-1">
                                            {idx === 0 ? (
                                              <RequiredLabel
                                                htmlFor={`return_item-${idx}`}
                                                label="Return Item"
                                              />
                                            ) : (
                                              ""
                                            )}
                                            <div>
                                              <Input
                                                id={`return_item-${idx}`}
                                                name="return_item"
                                                type="checkbox"
                                                checked={item.return_item}
                                                onChange={e =>
                                                  handleReturnItemChange(
                                                    idx,
                                                    e.target.checked
                                                  )
                                                }
                                              />
                                            </div>
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
                        </Col>
                      </Row>
                    </Col>
                  </CardBody>
                  <CardTitle className="mb-4"></CardTitle>
                  <Col xs="12">
                    <Row data-repeater-item>
                      <Col lg="5" className="mb-5"></Col>
                      <Col lg="1" className="mb-1">
                        <Button
                          onClick={() => handleSave()}
                          style={{
                            padding: "0.5rem 1rem",
                            "font-size": "0.9rem",
                          }}
                          //color="primary"
                          className="mt-5 mt-lg-2 btn-custom-size btn-custom-theme"
                        >
                          Save
                        </Button>
                      </Col>
                      <Col lg="1" className="mb-1">
                        <Button
                          style={{
                            padding: "0.5rem 1rem",
                            "font-size": "0.9rem",
                          }}
                          color="danger"
                          className="mt-5 mt-lg-2 btn-custom-size"
                          onClick={() => handleCancel()}
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

export default CreateSalesOrder;