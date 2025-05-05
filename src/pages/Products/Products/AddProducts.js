import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  TabContent,
  TabPane,
  Label,
  Card,
  Input,
  CardBody,
  Alert,
} from "reactstrap";
import Select from "react-select";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import "flatpickr/dist/themes/material_blue.css";
import { getSelectData } from "helpers/Api/api_common";
import { productTechParameterByID } from "helpers/Api/api_products";
import {
  GET_PRODUCTS_REQUEST,
  UPDATE_PRODUCTS_REQUEST,
  ADD_PRODUCTS_REQUEST,
} from "../../../store/products/actionTypes";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchGstClassification } from "helpers/Api/api_gstClassification";

const AddProducts = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, listproduct, addproducts, updateproducts } = useSelector(
    state => state.products
  );
  const [activeTab, setActiveTab] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [passedSteps, setPassedSteps] = useState([]);
  const [toast, setToast] = useState(false);
  const [selectedTechSet, setSelectedTechSet] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [extMaterialGrp, setMaterialGrp] = useState([]);
  const [toastMessage, setToastMessage] = useState();
  const [optionMaterialType, setOptionMaterialType] = useState([]);
  const [optionBaseUoM, setOptionBaseUoM] = useState([]);
  const [optionDropDownItems, setOptionDropDownItems] = useState([]);
  const [optionSalesUoM, setOptionSalesUoM] = useState([]);
  const [optionPlantCode, setOptionPlantCode] = useState([]);
  const [optionCompany, setOptionCompany] = useState([]);
  const [optionSalesOrg, setOptionSalesOrg] = useState([]);
  const [optionDistributionChannel, setOptionDistributionChannel] = useState(
    []
  );
  const [optionDivision, setOptionDivision] = useState([]);
  const [optionGrossWeightUoM, setOptionGrossWeightUoM] = useState([]);
  const [optionNetWeightUoM, setOptionNetWeightUoM] = useState([]);
  const [optionVolumeUoM, setOptionVolumeUoM] = useState([]);
  const [optionLengthUoM, setOptionLengthUoM] = useState([]);
  const [optionBreadthUoM, setOptionBreadthUoM] = useState([]);
  const [optionHeightUoM, setOptionHeightUoM] = useState([]);
  const [optionMaterialGrp, setOptionMaterialGrp] = useState([]);
  const [optionProductHierarchy, setOptionProductHierarchy] = useState([]);
  const [optionShelfLifeProduct, setOptionShelfLifeProduct] = useState([]);
  const [optionProfitCentre, setOptionProfitCentre] = useState([]);
  const [optionWorkCentre, setOptionWorkCentre] = useState([]);
  const [optionCurrency, setOptionCurrency] = useState([]);
  const [OptionHsn, setOptionHsn] = useState([]);
  const [OptionSac, setOptionSac] = useState([]);
  const [formData, setFormData] = useState({});
  const [techData, setTechData] = useState({});
  const [Edit, setEdit] = useState(null);
  const [classificationData, setClassificationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const mode = Edit === null ? "Add" : "Edit";

  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };

  const userData = getUserData();

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'product_code' && value.length > 50) {
      setFormErrors({
        ...formErrors,
        product_code: "Product Code cannot be more than 50 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        product_code: ""
      });
    }
    if (name === 'product_description' && value.length > 70) {
      setFormErrors({
        ...formErrors,
        product_description: "Product Name cannot be more than 70 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        product_description: ""
      });
    }
    if (name === 'conversion_factor_sales' && value.length > 4) {
      setFormErrors({
        ...formErrors,
        conversion_factor_sales: "conversion factor sales cannot be more than 4 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        conversion_factor_sales: ""
      });
    }
    if (name === 'wh_uom' && value.length > 4) {
      setFormErrors({
        ...formErrors,
        wh_uom: "Wh UOM cannot be more than 4 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        wh_uom: ""
      });
    }
    if (name === 'conversion_factor_wh_uom' && value.length > 4) {
      setFormErrors({
        ...formErrors,
        conversion_factor_wh_uom: "Conversion factor WH UoM cannot be more than 4 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        conversion_factor_wh_uom: ""
      });
    }
    if (name === 'prodn_uom' && value.length > 4) {
      setFormErrors({
        ...formErrors,
        prodn_uom: "Production UoM cannot be more than 4 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        prodn_uom: ""
      });
    }
    if (name === 'conversion_factor_prod_uom' && value.length > 4) {
      setFormErrors({
        ...formErrors,
        conversion_factor_prod_uom: "Conversion Factor Production UoM cannot be more than 4 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        conversion_factor_prod_uom: ""
      });
    }
    if (name === 'procurement_uom' && value.length > 4) {
      setFormErrors({
        ...formErrors,
        procurement_uom: "procurement uom cannot be more than 4 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        procurement_uom: ""
      });
    }
    if (name === 'conversion_factor_procurement_uom' && value.length > 4) {
      setFormErrors({
        ...formErrors,
        conversion_factor_procurement_uom: "conversion factor procurement uom cannot be more than 4 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        conversion_factor_procurement_uom: ""
      });
    }
    if (name === 'ean_upc_number' && value.length > 30) {
      setFormErrors({
        ...formErrors,
        ean_upc_number: "ean upc number cannot be more than 30 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        ean_upc_number: ""
      });
    }
    if (name === 'gross_weight' && value.length > 10) {
      setFormErrors({
        ...formErrors,
        gross_weight: "Gross weight cannot be more than 10 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        gross_weight: ""
      });
    }
    if (name === 'net_weight' && value.length > 10) {
      setFormErrors({
        ...formErrors,
        net_weight: "Net weight cannot be more than 10 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        net_weight: ""
      });
    }
    if (name === 'volume' && value.length > 10) {
      setFormErrors({
        ...formErrors,
        volume: "volume cannot be more than 10 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        volume: ""
      });
    }
    if (name === 'length' && value.length > 10) {
      setFormErrors({
        ...formErrors,
        length: "Length be more than 10 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        length: ""
      });
    }
    if (name === 'breadth' && value.length > 10) {
      setFormErrors({
        ...formErrors,
        breadth: "Breadth be more than 10 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        breadth: ""
      });
    }
    if (name === 'height' && value.length > 10) {
      setFormErrors({
        ...formErrors,
        height: "Height be more than 10 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        height: ""
      });
    }
    if (name === 'conversion_factor_procurement_uom' && value.length > 4) {
      setFormErrors({
        ...formErrors,
        conversion_factor_procurement_uom: "conversion factor procurement uom cannot be more than 4 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        conversion_factor_procurement_uom: ""
      });
    }
    if (name === 'standard_price_per_unit' && value.length > 25) {
      setFormErrors({
        ...formErrors,
        standard_price_per_unit: "standard price per unit cannot be more than 25 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        standard_price_per_unit: ""
      });
    }
    if (name === 'moving_avg_price_per_unit' && value.length > 25) {
      setFormErrors({
        ...formErrors,
        moving_avg_price_per_unit: "Moving avg price per unitcannot be more than 25 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        moving_avg_price_per_unit: ""
      });
    }
    if (name === 'unrestricted' && value.length > 25) {
      setFormErrors({
        ...formErrors,
        unrestricted: "Unrestricted cannot be more than 25 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        unrestricted: ""
      });
    }
    if (name === 'restricted_use_stock' && value.length > 25) {
      setFormErrors({
        ...formErrors,
        restricted_use_stock: "Restricted Use Stock cannot be more than 25 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        restricted_use_stock: ""
      });
    }
    if (name === 'sales_long_text_description' && value.length > 500) {
      setFormErrors({
        ...formErrors,
        sales_long_text_description: "Sales long text Description cannot be more than 500 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        sales_long_text_description: ""
      });
    }
    if (name === 'quality_inspection' && value.length > 25) {
      setFormErrors({
        ...formErrors,
        quality_inspection: "Quality Inspection  cannot be more than 25 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        quality_inspection: ""
      });
    }
    if (name === 'blocked' && value.length > 25) {
      setFormErrors({
        ...formErrors,
        blocked: "Blocked cannot be more than 25 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        blocked: ""
      });
    }
    if (name === 'returns' && value.length > 25) {
      setFormErrors({
        ...formErrors,
        returns: "Returns cannot be more than 25 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        returns: ""
      });
    }
    if (name === 'stock_in_transfer' && value.length > 25) {
      setFormErrors({
        ...formErrors,
        stock_in_transfer: "Stock In Transfer cannot be more than 25 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        stock_in_transfer: ""
      });
    }
    if (name === 'in_transfer_plant' && value.length > 10) {
      setFormErrors({
        ...formErrors,
        in_transfer_plant: "In Transfer Plant cannot be more than 10 characters"
      });
    } else {
      setFormErrors({
        ...formErrors,
        in_transfer_plant: ""
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm1 = () => {
    const errors = {};
    if (!formData.material_type) {
      errors.material_type = "Material Type is required";
    }
    if (!formData.product_code) {
      errors.product_code = "Product Code is required";
    }
    else if (formData.product_code.length > 50) {
      errors.product_code = "Product Code cannot be more than 50 characters"
    }
    if (!formData.product_description) {
      errors.product_description = "Product Name is required";
    }
    else if (formData.product_description.length > 70) {
      errors.product_description = "Product Name cannot be more than 70 characters"
    }
    if (!formData.base_uom) {
      errors.base_uom = "Base UoM is required";
    }
    if (!formData.sales_uom) {
      errors.sales_uom = "Sales UoM is required";
    }
    if (!formData.conversion_factor_sales) {
      errors.conversion_factor_sales = "Conversion Factor Sales is required";
    }
    else if (formData.conversion_factor_sales.length > 4) {
      errors.conversion_factor_sales = "conversion factor sales cannot be more than 4 characters"
    }
    if (!formData.wh_uom) {
      errors.wh_uom = "WH UoM is required";
    }
    else if (formData.wh_uom.length > 4) {
      errors.wh_uom = "WH UoM cannot be more than 4 characters"
    }
    if (!formData.conversion_factor_wh_uom) {
      errors.conversion_factor_wh_uom = "Conversion factor WH UoM is required";
    }
    else if (formData.conversion_factor_wh_uom.length > 4) {
      errors.conversion_factor_wh_uom = "Conversion factor WH UoM cannot be more than 4 characters"
    }
    if (!formData.material_type) {
      errors.material_type = "Material Allowed For Indicator is required";
    }
    if (!formData.prodn_uom) {
      errors.prodn_uom = "Production UoM is required";
    }
    else if (formData.prodn_uom.length > 4) {
      errors.prodn_uom = "Production UoM  cannot be more than 4 characters"
    }
    if (!formData.conversion_factor_prod_uom) {
      errors.conversion_factor_prod_uom =
        "Conversion Factor Production UoM is required";
    }
    else if (formData.conversion_factor_prod_uom.length > 4) {
      errors.conversion_factor_prod_uom = "Conversion Factor Production UoM  cannot be more than 4 characters"
    }
    if (!formData.procurement_uom) {
      errors.procurement_uom = "Procurement UoM is required";
    }
    else if (formData.procurement_uom.length > 4) {
      errors.procurement_uom = "Procurement UoM  cannot be more than 4 characters"
    }
    if (!formData.conversion_factor_procurement_uom) {
      errors.conversion_factor_procurement_uom =
        "Conversion Factor Procurement UoM is required";
    }
    else if (formData.conversion_factor_procurement_uom.length > 4) {
      errors.conversion_factor_procurement_uom = "Conversion Factor Procurement UoM  cannot be more than 4 characters"
    }
    if (!formData.valid_from) {
      errors.valid_from = "Valid From is required";
    }
    if (!formData.valid_to) {
      errors.valid_to = "Valid To is required";
    }
    if (!formData.plant_id) {
      errors.plant_id = "Plant Code is required";
    }
    if (!formData.company_id) {
      errors.company_id = "Company is required";
    }
    if (!formData.sales_organisation_id) {
      errors.sales_organisation_id = "Sales Organization is required";
    }
    if (!formData.distribution_channel_id) {
      errors.distribution_channel_id = "Distribution Channel is required";
    }
    if (!formData.division_id) {
      errors.division_id = "Division is required";
    }
    if (!formData.hsn_id) {
      errors.hsn_id = "HSN is required";
    }
    if (!formData.sac_id) {
      errors.sac_id = "SAC is required";
    }
    if (!formData.ean_upc_number) {
      errors.ean_upc_number = "EAN/UPC Number is required";
    }
    else if (formData.ean_upc_number.length > 30) {
      errors.ean_upc_number = "EAN/UPC Number  cannot be more than 30 characters"
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm2 = () => {
    const errors = {};
    if (!formData.gross_weight) {
      errors.gross_weight = "Gross weight is required";
    }
    else if (formData.gross_weight.length > 10) {
      errors.gross_weight = "Gross weight  cannot be more than 10 characters"
    }
    if (!formData.gross_weight_uom) {
      errors.gross_weight_uom = "Gross weight UoM is required";
    }
    if (!formData.net_weight) {
      errors.net_weight = "Net weight is required";
    }
    else if (formData.net_weight.length > 10) {
      errors.net_weight = "Net weight cannot be more than 10 characters"
    }
    if (!formData.net_weight_uom) {
      errors.net_weight_uom = "Net weight UoM is required";
    }
    if (!formData.volume) {
      errors.volume = "Volume is required";
    }
    else if (formData.volume.length > 10) {
      errors.volume = "volume cannot be more than 10 characters"
    }
    if (!formData.volume_uom) {
      errors.volume_uom = "Volume UoM is required";
    }
    if (!formData.length) {
      errors.length = "Length is required";
    }
    else if (formData.length.length > 10) {
      errors.length = "length cannot be more than 10 characters"
    }
    if (!formData.length_uom) {
      errors.length_uom = "Length UoM is required";
    }
    if (!formData.breadth) {
      errors.breadth = "Breadth is required";
    }
    else if (formData.breadth.length > 10) {
      errors.breadth = "Beadth cannot be more than 10 characters"
    }
    if (!formData.breadth_uom) {
      errors.breadth_uom = "Breadth UoM is required";
    }
    if (!formData.height) {
      errors.height = "Height is required";
    }
    else if (formData.height.length > 10) {
      errors.height = "Height cannot be more than 10 characters"
    }
    if (!formData.height_uom) {
      errors.height_uom = "Height UoM is required";
    }
    if (!formData.materialgroup1) {
      errors.materialgroup1 = "Material Group Id is required";
    }
    extMaterialGrp.forEach((_, idx) => {
      const fieldName = `materialgroup${idx + 2}`;
      const value = formData[fieldName];
      if (!value) {
        errors[fieldName] = `Material Group  ${idx + 2} is required`;
      }
    });
    if (!formData.product_hierarchy) {
      errors.product_hierarchy = "Product Hierarchy is required";
    }
    if (!formData.sales_long_text_description) {
      errors.sales_long_text_description =
        "Sales Long Text Description is required";
    }
    else if (formData.sales_long_text_description.length > 500) {
      errors.sales_long_text_description = "Sales Long Text Description cannot be more than 500 characters"
    }
    if (!formData.batch_indicator) {
      errors.batch_indicator = "Batch Indicator is required";
    }
    if (!formData.serial_number_indicator) {
      errors.serial_number_indicator = "Serial Number Indicator is required";
    }
    if (!formData.shelf_life_product) {
      errors.shelf_life_product = "Shelf Life Product is required";
    }
    else if (formData.shelf_life_product.length > 4) {
      errors.shelf_life_product = "shelf life product cannot be more than 4 characters"
    }
    if (!formData.shelf_life_uom) {
      errors.shelf_life_uom = "Shelf Life Product is required";
    }
    if (!formData.standard_price_per_unit) {
      errors.standard_price_per_unit = "Standard Price Per Unit is required";
    }
    else if (formData.standard_price_per_unit.length > 25) {
      errors.standard_price_per_unit = "Standard Price Per Unit cannot be more than 25 characters"
    }
    if (!formData.moving_avg_price_per_unit) {
      errors.moving_avg_price_per_unit =
        "Moving Avg Price Per Unit is required";
    }
    else if (formData.moving_avg_price_per_unit.length > 25) {
      errors.moving_avg_price_per_unit = "Moving avg price per unit cannot be more than 25 characters"
    }
    if (!formData.currency_id) {
      errors.currency_id = "Currency Id is required";
    }
    if (!formData.unrestricted) {
      errors.unrestricted = "Unrestricted is required";
    } else if (formData.unrestricted.length > 25) {
      errors.unrestricted = "Unrestricted cannot be more than 25 characters"
    }
    if (!formData.restricted_use_stock) {
      errors.restricted_use_stock = "Restricted Use Stock is required";
    } else if (formData.restricted_use_stock.length > 25) {
      errors.restricted_use_stock = "Restricted Use Stockcannot be more than 25 characters"
    }
    if (!formData.quality_inspection) {
      errors.quality_inspection = "Quality Inspection is required";
    } else if (formData.quality_inspection.length > 25) {
      errors.quality_inspection = "Quality Inspection cannot be more than 25 characters"
    }
    if (!formData.blocked) {
      errors.blocked = "Blocked is required";
    } else if (formData.blocked.length > 25) {
      errors.blocked = "Blocked cannot be more than 25 characters"
    }
    if (!formData.returns) {
      errors.returns = "Returns is required";
    } else if (formData.returns.length > 25) {
      errors.returns = "Returns cannot be more than 25 characters"
    }
    if (!formData.stock_in_transfer) {
      errors.stock_in_transfer = "Stock In Transfer is required";
    } else if (formData.stock_in_transfer.length > 25) {
      errors.stock_in_transfer = "Stock In Transfercannot be more than 25 characters"
    }
    if (!formData.in_transfer_plant) {
      errors.in_transfer_plant = "In Transfer Plant is required";
    } else if (formData.in_transfer_plant.length > 10) {
      errors.in_transfer_plant = "In Transfer Plant cannot be more than 10 characters"
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm3 = () => {
    const errors = {};
    if (!formData.gst_rate_details) {
      errors.gst_rate_details = "GST Rate Details is required";
    }

    if (formData?.gst_rate_details === "GSTclassification") {
      if (!formData.gst_classification) {
        errors.gst_classification = "Classification is required";
      }
    } else {
      if (!formData.taxability_type) {
        errors.taxability_type = "Taxability Type is required";
      }

      if (!formData.gst_rate) {
        errors.gst_rate = "GST Rate is required";
      }
    }

    if (!formData.type_of_supply) {
      errors.type_of_supply = "Type of Supply is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm4 = () => {
    const errors = {};
    if (!selectedTechSet) {
      errors.tech_set = "Technical Parameter Set is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const tabAction = tab => {
    if (activeTab !== tab && tab >= 1 && tab <= 5) {
      var newPassedSteps;
      if (tab === 5) {
        newPassedSteps = [];
        setPassedSteps([]);
      } else {
        newPassedSteps = [...passedSteps];
      }
      if (!newPassedSteps.includes(tab)) {
        newPassedSteps.push(tab);
      }
      setPassedSteps(newPassedSteps);
      setActiveTab(tab);
    }
  };

  const toggleTab = tab => {
    if (!Edit) {
      localStorage.setItem("productData", JSON.stringify(formData));
    }
    if (activeTab !== tab && activeTab == 1) {
      if (!validateForm1()) {
        return;
      }
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 2 && tab == 1) {
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 2) {
      if (!validateForm2()) {
        return;
      }
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 3 && tab == 2) {
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 3) {
      if (!validateForm3()) {
        return;
      }
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 4 && tab == 3) {
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 4) {
      if (!validateForm4()) {
        return;
      }
      if (Edit) {
        setLoading(true);
        const Id = Edit.id;
        const data = {
          formData,
          techData,
          Id,
        };
        dispatch({
          type: UPDATE_PRODUCTS_REQUEST,
          payload: data,
        });
      } else {
        setLoading(true);
        const data = {
          formData,
          techData,
        };
        dispatch({
          type: ADD_PRODUCTS_REQUEST,
          payload: data,
        });
      }
      tabAction(tab);
    } else if (activeTab !== tab && activeTab == 5 && tab == 4) {
      tabAction(tab);
    }
  };

  useEffect(() => {
    dropdownList();
    const productData = JSON.parse(localStorage.getItem("productData"));
    const techData = JSON.parse(localStorage.getItem("techData"));
    const { editProduct } = location.state || {};
    if (editProduct) {
      setEdit(editProduct);
      const technical_setData = JSON.parse(editProduct?.technical_set_value)
      const Techids = Object.values(technical_setData).flatMap(item => {
        return item.id;
      });
      productTechParameter(Techids.join(","));
      setTechData(technical_setData)
      setSelectedTechSet(editProduct?.parameter_sets);
      setFormData({
        material_type: editProduct?.material_type?.value,
        material_allowed_indicator: editProduct?.material_allowed_indicator,
        product_code: editProduct?.product_code,
        product_description: editProduct?.product_description,
        base_uom: editProduct?.base_uom,
        sales_uom: editProduct?.sales_uom,
        conversion_factor_sales: editProduct?.conversion_factor_sales,
        wh_uom: editProduct?.wh_uom,
        conversion_factor_wh_uom: editProduct?.conversion_factor_wh_uom,
        prodn_uom: editProduct?.prodn_uom,
        conversion_factor_prod_uom: editProduct?.conversion_factor_prod_uom,
        procurement_uom: editProduct?.procurement_uom,
        conversion_factor_procurement_uom:
          editProduct?.conversion_factor_procurement_uom,
        valid_from: moment(editProduct.valid_from).format("DD/MM/YYYY") || "",
        valid_to: moment(editProduct.valid_to).format("DD/MM/YYYY") || "",
        plant_id: editProduct?.plant?.value,
        company_id: editProduct?.company?.value,
        sales_organisation_id: editProduct?.sales_organisation_id,
        distribution_channel_id: editProduct?.distribution?.value,
        division_id: editProduct?.division?.value,
        ean_upc_number: editProduct?.ean_upc_number,
        hsn_id: editProduct?.hsn?.value,
        sac_id: editProduct?.sac?.value,
        gross_weight: editProduct?.gross_weight,
        gross_weight_uom: editProduct?.gross_weight_uom,
        net_weight: editProduct?.net_weight,
        net_weight_uom: editProduct?.net_weight_uom,
        volume: editProduct?.volume,
        volume_uom: editProduct?.volume_uom,
        length: editProduct?.length,
        length_uom: editProduct?.length_uom,
        breadth: editProduct?.breadth,
        breadth_uom: editProduct?.breadth_uom,
        height: editProduct?.height,
        height_uom: editProduct?.height_uom,
        materialgroup1: editProduct?.materialgroup1?.value || 0,
        materialgroup2: editProduct?.materialgroup2?.value || 0,
        materialgroup3: editProduct?.materialgroup3?.value || 0,
        materialgroup4: editProduct?.materialgroup4?.value || 0,
        materialgroup5: editProduct?.materialgroup5?.value || 0,
        product_hierarchy: editProduct?.producthierarchy?.value,
        sales_long_text_description: editProduct?.sales_long_text_description,
        batch_indicator: editProduct?.batch_indicator,
        serial_number_indicator: editProduct?.serial_number_indicator,
        shelf_life_product: editProduct?.shelf_life_product,
        shelf_life_uom: editProduct?.shelf_life_uom,
        profit_centre: editProduct?.profit_centre,
        work_centre: editProduct?.work_centre,
        standard_price_per_unit: editProduct?.standard_price_per_unit,
        moving_avg_price_per_unit: editProduct?.moving_avg_price_per_unit,
        currency_id: editProduct?.currency?.value,
        unrestricted: editProduct?.unrestricted,
        restricted_use_stock: editProduct?.restricted_use_stock,
        quality_inspection: editProduct?.quality_inspection,
        blocked: editProduct?.blocked,
        returns: editProduct?.returns,
        stock_in_transfer: editProduct?.stock_in_transfer,
        in_transfer_plant: editProduct?.in_transfer_plant,
        technical_set_value: editProduct?.technical_set_value,
        technical_set_id: editProduct?.technical_set_id,
        gst_rate_details: editProduct?.gst_rate_details,
        taxability_type: editProduct?.taxability_type,
        gst_rate: editProduct?.gst_rate || "0",
        type_of_supply: editProduct?.type_of_supply,
        gst_classification: editProduct?.gst_classification,
        gst_classification_id: editProduct?.gst_classification_id,
      });
    } else {
      setEdit(null);
      if (productData?.technical_set_value) {
        productTechParameter(productData?.technical_set_value);
      }
      setSelectedTechSet(productData?.parameter_sets);
      if (productData) {
        setTechData(techData)
        setFormData({
          material_type: productData?.material_type || "",
          material_allowed_indicator:
            productData?.material_allowed_indicator || "",
          product_code: productData?.product_code || "",
          product_description: productData?.product_description || "",
          base_uom: productData?.base_uom || "",
          sales_uom: productData?.sales_uom || "",
          conversion_factor_sales: productData?.conversion_factor_sales || "",
          wh_uom: productData?.wh_uom || "",
          conversion_factor_wh_uom: productData?.conversion_factor_wh_uom || "",
          prodn_uom: productData?.prodn_uom || "",
          conversion_factor_prod_uom:
            productData?.conversion_factor_prod_uom || "",
          procurement_uom: productData?.procurement_uom || "",
          conversion_factor_procurement_uom:
            productData?.conversion_factor_procurement_uom || "",
          valid_from: productData?.valid_from || "",
          valid_to: productData?.valid_to || "",
          plant_id: productData?.plant_id || "",
          company_id: productData?.company_id || "",
          sales_organisation_id: productData?.sales_organisation_id || "",
          distribution_channel_id: productData?.distribution_channel_id || "",
          division_id: productData?.division_id || "",
          ean_upc_number: productData?.ean_upc_number || "",
          hsn_id: productData?.hsn_id || "",
          sac_id: productData?.sac_id || "",
          gross_weight: productData?.gross_weight || "",
          gross_weight_uom: productData?.gross_weight_uom || "",
          net_weight: productData?.net_weight || "",
          net_weight_uom: productData?.net_weight_uom || "",
          volume: productData?.volume || "",
          volume_uom: productData?.volume_uom || "",
          length: productData?.length || "",
          length_uom: productData?.length_uom || "",
          breadth: productData?.breadth || "",
          breadth_uom: productData?.breadth_uom || "",
          height: productData?.height || "",
          height_uom: productData?.height_uom || "",
          materialgroup1: productData?.materialgroup1 || 0,
          materialgroup2: productData?.materialgroup2 || 0,
          materialgroup3: productData?.materialgroup3 || 0,
          materialgroup4: productData?.materialgroup4 || 0,
          materialgroup5: productData?.materialgroup5 || 0,
          product_hierarchy: productData?.product_hierarchy || "",
          sales_long_text_description:
            productData?.sales_long_text_description || "",
          batch_indicator: productData?.batch_indicator || "",
          serial_number_indicator: productData?.serial_number_indicator || "",
          shelf_life_product: productData?.shelf_life_product || "",
          shelf_life_uom: productData?.shelf_life_uom || "",
          profit_centre: productData?.profit_centre || "",
          work_centre: productData?.work_centre || "",
          standard_price_per_unit: productData?.standard_price_per_unit || "",
          moving_avg_price_per_unit:
            productData?.moving_avg_price_per_unit || "",
          currency_id: productData?.currency_id || "",
          unrestricted: productData?.unrestricted || "",
          restricted_use_stock: productData?.restricted_use_stock || "",
          quality_inspection: productData?.quality_inspection || "",
          blocked: productData?.blocked || "",
          returns: productData?.returns || "",
          stock_in_transfer: productData?.stock_in_transfer || "",
          in_transfer_plant: productData?.in_transfer_plant || "",
          technical_set_value: productData?.technical_set_value || "",
          technical_set_id: productData?.technical_set_id || "",
          gst_rate_details: productData?.gst_rate_details || "specifyDetails",
          taxability_type: productData?.taxability_type || "",
          gst_rate: productData?.gst_rate || "0",
          type_of_supply: productData?.type_of_supply || "",
          gst_classification: productData?.gst_classification || "",
          gst_classification_id: productData?.gst_classification_id || "",
        });
      }
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: GET_PRODUCTS_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (addproducts?.success === true) {
      setLoading(false)
      setToastMessage("Product Added Successfully");
      localStorage.removeItem("productData");
    }
    if (updateproducts?.success === true) {
      setLoading(false)
      setToastMessage("Product Updated Successfully");
    }
    if (listproduct) {
      if (products) {
        setOptionMaterialType(products?.material_types);
        setOptionBaseUoM(products?.Uom);
        setOptionSalesUoM(products?.Uom);
        setOptionPlantCode(products?.plant_codes);
        setOptionCompany(products?.companies);
        setOptionSalesOrg(products?.sales_organisations);
        setOptionDistributionChannel(products?.distributions);
        setOptionDivision(products?.divisions);
        setOptionGrossWeightUoM(products?.Uom);
        setOptionNetWeightUoM(products?.Uom);
        setOptionVolumeUoM(products?.Uom);
        setOptionLengthUoM(products?.Uom);
        setOptionBreadthUoM(products?.Uom);
        setOptionHeightUoM(products?.Uom);
        setOptionMaterialGrp(products?.material_groups);
        setOptionProductHierarchy(products?.product_hierarchy);
        setOptionShelfLifeProduct(products?.Uom);
        setOptionProfitCentre(products?.profitCentre);
        setOptionWorkCentre(products?.workCentre);
        setOptionCurrency(products?.currencies);
        setOptionHsn(products?.hsnCode);
        setOptionSac(products?.sacCode);
      }
    }
  }, [listproduct, addproducts, updateproducts, products]);

  useEffect(() => {
    if (activeTab === 3 && !Edit) {
      setFormData(prevData => ({
        ...prevData,
        gst_rate_details: prevData.gst_rate_details || "specifyDetails",
        taxability_type: prevData.gst_rate_details === "specifyDetails" ? prevData.taxability_type : "taxable",
        gst_rate: prevData.gst_rate_details === "specifyDetails" ? prevData.gst_rate : "0",
      }));
    }
  }, [activeTab, Edit]);

  const getGstClassification = async () => {
    const id = userData?.user?.id;
    try {
      const data = await fetchGstClassification(id);
      setClassificationData(data || []);
    } catch (error) {
      console.log("Error fetching GST gst_classification:", error);
    }
  }

  useEffect(() => {
    if (activeTab === 3 || formData.gst_rate_details === "GSTclassification") {
      getGstClassification();
    }
  }, [activeTab, formData.gst_rate_details]);

  useEffect(() => {
    if (activeTab === 5) {
      const timer = setTimeout(() => {
        history.push("/products/products");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeTab, history]);

  const handleAddRowNestedMaterialgrp = () => {
    if (extMaterialGrp.length < 4) {
      const newItem = { name1: "" };
      setMaterialGrp([...extMaterialGrp, newItem]);
    }
  };

  const handleRemoveRowNestedMaterialgrp = idx => {
    setFormData(prevData => ({
      ...prevData,
      ["materialgroup" + (idx + 2)]: "",
    }));
    const updatedRows = [...extMaterialGrp];
    updatedRows.splice(idx, 1);
    setMaterialGrp(updatedRows);
  };

  const dropdownList = async () => {
    const selectData = await getSelectData(
      "set_label",
      "",
      "technical_parameters_sets_search"
    );
    setOptionDropDownItems(selectData?.getDataByColNameData);
  };

  const handleTechSetChange = async selectedTechSet => {
    setTechData({})
    setSelectedTechSet(selectedTechSet);
    setFormData(prevData => ({
      ...prevData,
      technical_set_id: selectedTechSet.value,
    }));
    setFormData(prevData => ({
      ...prevData,
      technical_set_value: selectedTechSet.parameter_sets,
    }));
    setFormData(prevData => ({
      ...prevData,
      parameter_sets: selectedTechSet,
    }));
    try {
      const response = await productTechParameterByID(
        selectedTechSet.parameter_sets
      );
      setTableData(response?.productTechParameterByID);
      response?.productTechParameterByID.map((item, index) => {
        if (item.types[0] === "datebox") {
          setTechData(prevData => ({
            ...prevData,
            [`datebox-${index}`]:
            {
              id: item?.items[0]?.id,
              type: item?.types[0],
              label: item?.values[0]
            },
          }));
        } else if (item.types[0] === "textfield") {
          setTechData(prevData => ({
            ...prevData,
            [`textfield-${index}`]:
            {
              id: item?.items[0]?.id,
              type: item?.types[0],
              label: item?.values[0]
            },
          }));
        } else if (item.types[0] === "dropdown") {
          setTechData(prevData => ({
            ...prevData,
            [`dropdown-${index}`]:
            {
              id: item?.items[0]?.id,
              type: item?.types[0],
              default_value: false,
              dropdown: '',
            },
          }));
        } else if (item.types[0] === "textarea") {
          setTechData(prevData => ({
            ...prevData,
            [`textarea-${index}`]:
            {
              id: item?.items[0]?.id,
              type: item?.types[0],
              label: item?.values[0]
            },
          }));
        } else if (item.types[0] === "dateTime") {
          setTechData(prevData => ({
            ...prevData,
            [`dateTime-${index}`]:
            {
              id: item?.items[0]?.id,
              type: item?.types[0],
              label: moment(
                item?.values[0]
              ).format("DD/MM/YYYY hh:mm A")
            },
          }));
        } else if (item.types[0] === "timebox") {
          setTechData(prevData => ({
            ...prevData,
            [`timebox-${index}`]:
            {
              id: item?.items[0]?.id,
              type: item?.types[0],
              label: moment(
                item?.values[0]
              ).format("hh:mm A")
            },
          }));
        } else if (item.types[0] === "urlbox") {
          setTechData(prevData => ({
            ...prevData,
            [`urlbox-${index}`]:
            {
              id: item?.items[0]?.id,
              type: item?.types[0],
              label: item?.values[0]
            },
          }));
        } else if (item.types[0] === "emailbox") {
          setTechData(prevData => ({
            ...prevData,
            [`emailbox-${index}`]:
            {
              id: item?.items[0]?.id,
              type: item?.types[0],
              label: item?.values[0]
            },
          }));
        } else if (item.types[0] === "colorbox") {
          setTechData(prevData => ({
            ...prevData,
            [`colorbox-${index}`]:
            {
              id: item?.items[0]?.id,
              type: item?.types[0],
              label: item?.values[0]
            },
          }));
        } else if (item.types[0] === "numberbox") {
          setTechData(prevData => ({
            ...prevData,
            [`numberbox-${index}`]:
            {
              id: item?.items[0]?.id,
              type: item?.types[0],
              label: item?.values[0]
            },
          }));
        } else if (item.types[0] === "multipleselect") {
          setTechData(prevData => ({
            ...prevData,
            [`multipleselect-${index}`]:
            {
              id: item?.items[0]?.id,
              type: item?.types[0],
              default_value: false,
              multipleselect: '',
            },
          }));
        } else {
          setTechData({})
        }
      })
      if (!Edit) {
        localStorage.setItem("techData", JSON.stringify(techData));
        localStorage.setItem("productData", JSON.stringify(formData));
      }
    } catch (error) {
      console.log("error", error)
    }
  };

  const productTechParameter = async parameter_sets => {
    const response = await productTechParameterByID(parameter_sets);
    setTableData(response?.productTechParameterByID);
  };

  const handleGstChange = e => {
    const { name, value } = e.target;

    let cleanValue = value;

    if (name === "gst_rate") {
      cleanValue = value.replace(/[^0-9.]/g, "");

      if (formData.gst_rate === "0" && cleanValue.length > 1) {
        cleanValue = cleanValue.replace(/^0/, "");
      }
    }

    setFormData({
      ...formData,
      [name]: cleanValue,
    });
  };

  const onGstRateKeyDown = (e) => {
    const input = e.currentTarget;
    const cursor_position = input.selectionStart;
    const isBackspace = e.key === "Backspace";
    const isDelete = e.key === "Delete";

    if ((isBackspace && cursor_position > 0 && input.value[cursor_position - 1] === '%') ||
      (isDelete && input.value[cursor_position] === '%')) {
      e.preventDefault();
      const newPos = Math.max(cursor_position - 1, 0);
      requestAnimationFrame(() => {
        input.setSelectionRange(newPos, newPos);
      });
    }
  };

  document.title = "Detergent | Add Products";
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
            titlePath="/products/products"
            title="Products"
            breadcrumbItem="Add Products"
          />
          <Card>
            <CardBody>
              {loading ? (
                <Loader />
              ) : (
                <Row>
                  <Col lg="12">
                    <Card>
                      <CardBody>
                        <div className="wizard clearfix">

                          <div className="custom-tabs-wrapper">
                            <ul className="custom-tab-nav">
                              {[
                                { id: 1, label: "Products Details" },
                                { id: 2, label: "Products Basic Details" },
                                { id: 3, label: "GST Rate Details" },
                                { id: 4, label: "Product Parameter" },
                                { id: 5, label: "Confirm Detail" },
                              ].map((tab, index) => (
                                <li key={tab.id} className="custom-tab-item">
                                  <button
                                    className={`custom-tab-link ${activeTab === tab.id ? "active" : ""}`}
                                    onClick={() => {
                                      if (tab.id === 1 || passedSteps.includes(tab.id)) {
                                        toggleTab(tab.id);
                                      }
                                    }}
                                    disabled={tab.id !== 1 && !passedSteps.includes(tab.id)}
                                  >
                                    <span className="tab-index">{index + 1}</span>
                                    {tab.label}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="content clearfix">
                            <TabContent activeTab={activeTab} className="body">
                              <TabPane tabId={1}>
                                <Form>
                                  <Row>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={formData?.material_type}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionMaterialType.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              material_type:
                                                selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Material Type
                                          </option>
                                          {optionMaterialType?.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="material_type">
                                          Material Type
                                        </label>
                                        {formErrors.material_type && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.material_type}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="product_code"
                                          name="product_code"
                                          placeholder="Enter Product Code"
                                          onChange={handleChange}
                                          defaultValue={formData?.product_code}
                                        />
                                        <label htmlFor="product_code">
                                          Product Code
                                        </label>
                                        {formErrors.product_code && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.product_code}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <textarea
                                          id="product_description"
                                          name="product_description"
                                          className="form-control"
                                          rows="2"
                                          placeholder="Enter Product Name"
                                          onChange={handleChange}
                                          defaultValue={
                                            formData?.product_description
                                          }
                                        />
                                        <label htmlFor="product_description">
                                          Product Name
                                        </label>
                                        {formErrors.product_description && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.product_description}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={formData?.base_uom}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionBaseUoM.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              base_uom: selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Base UoM
                                          </option>
                                          {optionBaseUoM?.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="base_uom">Base UoM</label>
                                        {formErrors.base_uom && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.base_uom}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={formData?.sales_uom}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionSalesUoM.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              sales_uom: selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Sales UoM
                                          </option>
                                          {optionSalesUoM?.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="sales_uom">
                                          Sales UoM
                                        </label>
                                        {formErrors.sales_uom && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.sales_uom}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="conversion_factor_sales"
                                          name="conversion_factor_sales"
                                          placeholder="Enter Conversion Factor Sales"
                                          onChange={handleChange}
                                          defaultValue={
                                            formData?.conversion_factor_sales
                                          }
                                        />
                                        <label htmlFor="conversion_factor_sales">
                                          Conversion Factor Sales
                                        </label>
                                        {formErrors.conversion_factor_sales && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.conversion_factor_sales}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="wh_uom"
                                          name="wh_uom"
                                          placeholder="Enter WH UoM"
                                          onChange={handleChange}
                                          defaultValue={formData?.wh_uom}
                                        />
                                        <label htmlFor="wh_uom">WH UoM</label>
                                        {formErrors.wh_uom && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.wh_uom}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="conversion_factor_wh_uom"
                                          name="conversion_factor_wh_uom"
                                          placeholder="Enter Conversion Factor WH UoM"
                                          onChange={handleChange}
                                          defaultValue={
                                            formData?.conversion_factor_wh_uom
                                          }
                                        />
                                        <label htmlFor="conversion_factor_wh_uom">
                                          Conversion Factor WH UoM
                                        </label>
                                        {formErrors.conversion_factor_wh_uom && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.conversion_factor_wh_uom}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <div className="form-check mb-3">
                                          <input
                                            type="checkbox"
                                            className="form-check-input input-mini"
                                            id="material_allowed_indicator"
                                            checked={
                                              formData?.material_allowed_indicator
                                            }
                                            onChange={event => {
                                              setFormData(prevData => ({
                                                ...prevData,
                                                material_allowed_indicator:
                                                  event.target.checked,
                                              }));
                                            }}
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor="material_allowed_indicator"
                                          >
                                            Material Allowed Indicator
                                          </label>
                                          {formErrors.material_allowed_indicator && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {
                                                formErrors.material_allowed_indicator
                                              }
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="prodn_uom"
                                          name="prodn_uom"
                                          placeholder="Enter Prodn UoM"
                                          onChange={handleChange}
                                          defaultValue={formData?.prodn_uom}
                                        />
                                        <label htmlFor="prodn_uom">
                                          Prodn UoM
                                        </label>
                                        {formErrors.prodn_uom && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.prodn_uom}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="conversion_factor_prod_uom"
                                          placeholder="Enter Conversion Factor Prod UoM"
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              conversion_factor_prod_uom:
                                                event.target.value,
                                            }));
                                          }}
                                          defaultValue={
                                            formData?.conversion_factor_prod_uom
                                          }
                                        />
                                        <label htmlFor="conversion_factor_prod_uom">
                                          Conversion Factor Prod UoM
                                        </label>
                                        {formErrors.conversion_factor_prod_uom && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {
                                              formErrors.conversion_factor_prod_uom
                                            }
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="procurement_uom"
                                          placeholder="Enter Procurement UoM"
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              procurement_uom: event.target.value,
                                            }));
                                          }}
                                          defaultValue={formData?.procurement_uom}
                                        />
                                        <label htmlFor="procurement_uom">
                                          Procurement UoM
                                        </label>
                                        {formErrors.procurement_uom && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.procurement_uom}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="conversion_factor_procurement_uom"
                                          placeholder="Enter Conversion Factor Procurement UoM"
                                          onChange={event => {
                                            setFormData(prevData => ({
                                              ...prevData,
                                              conversion_factor_procurement_uom:
                                                event.target.value,
                                            }));
                                          }}
                                          defaultValue={
                                            formData?.conversion_factor_procurement_uom
                                          }
                                        />
                                        <label htmlFor="conversion_factor_procurement_uom">
                                          Conversion Factor Procurement UoM
                                        </label>
                                        {formErrors.conversion_factor_procurement_uom && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {
                                              formErrors.conversion_factor_procurement_uom
                                            }
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <Flatpickr
                                          placeholder="dd M, yyyy"
                                          options={{
                                            altInput: true,
                                            altFormat: "j F, Y",
                                            dateFormat: "Y-m-d",
                                            minDate: "today",
                                          }}
                                          onChange={(selectedDates, dateStr, instance) => {
                                            const selectedDate = moment(selectedDates[0]).format("DD/MM/YYYY");
                                            setFormData(prevData => ({
                                              ...prevData,
                                              valid_from: selectedDate,
                                            }));

                                            if (formData.valid_to && moment(selectedDate, "DD/MM/YYYY").isAfter(moment(formData.valid_to, "DD/MM/YYYY"))) {
                                              setFormErrors(prevErrors => ({
                                                ...prevErrors,
                                                valid_to: "Valid To date should be after Valid From date",
                                              }));
                                            } else {
                                              setFormErrors(prevErrors => ({
                                                ...prevErrors,
                                                valid_to: null,
                                              }));
                                            }
                                          }}
                                          value={moment(formData?.valid_from, "DD/MM/YYYY").toDate()}
                                        />
                                        <label htmlFor="valid_from">Valid From</label>
                                        {formErrors.valid_from && (
                                          <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                                            {formErrors.valid_from}
                                          </div>
                                        )}
                                      </div>
                                    </Col>


                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <Flatpickr
                                          placeholder="dd M, yyyy"
                                          options={{
                                            altInput: true,
                                            altFormat: "j F, Y",
                                            dateFormat: "Y-m-d",
                                            minDate: "today",
                                          }}
                                          onChange={(selectedDates, dateStr, instance) => {
                                            const selectedDate = moment(selectedDates[0]).format("DD/MM/YYYY");

                                            if (moment(selectedDate, "DD/MM/YYYY").isBefore(moment(formData.valid_from, "DD/MM/YYYY"))) {
                                              setFormErrors(prevErrors => ({
                                                ...prevErrors,
                                                valid_to: "Valid To date should be after Valid From date",
                                              }));
                                            } else {
                                              setFormData(prevData => ({
                                                ...prevData,
                                                valid_to: selectedDate,
                                              }));
                                              setFormErrors(prevErrors => ({
                                                ...prevErrors,
                                                valid_to: null,
                                              }));
                                            }
                                          }}
                                          value={moment(formData?.valid_to, "DD/MM/YYYY").toDate()}
                                        />
                                        <label htmlFor="valid_to">Valid To</label>
                                        {formErrors.valid_to && (
                                          <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                                            {formErrors.valid_to}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          value={formData?.plant_id}
                                          className="form-select"
                                          onChange={async event => {
                                            const selectedOption =
                                              optionPlantCode.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              plant_id: selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Plant Code
                                          </option>
                                          {optionPlantCode?.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="plant_id">
                                          Plant Code
                                        </label>
                                        {formErrors.plant_id && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.plant_id}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={formData?.company_id}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionCompany.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              company_id: selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Company
                                          </option>
                                          {optionCompany?.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="company_id">
                                          Company
                                        </label>
                                        {formErrors.company_id && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.company_id}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={formData?.sales_organisation_id}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionSalesOrg.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              sales_organisation_id:
                                                selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Sales Organisation
                                          </option>
                                          {optionSalesOrg?.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="sales_organisation_id">
                                          Sales Organisation
                                        </label>
                                        {formErrors.sales_organisation_id && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.sales_organisation_id}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={
                                            formData?.distribution_channel_id
                                          }
                                          onChange={async event => {
                                            const selectedOption =
                                              optionDistributionChannel.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              distribution_channel_id:
                                                selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Distribution Channel
                                          </option>
                                          {optionDistributionChannel?.map(
                                            option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            )
                                          )}
                                        </select>
                                        <label htmlFor="distribution_channel_id">
                                          Distribution Channel
                                        </label>
                                        {formErrors.distribution_channel_id && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.distribution_channel_id}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          className="form-select"
                                          value={formData?.division_id}
                                          onChange={async event => {
                                            const selectedOption =
                                              optionDivision.find(
                                                option =>
                                                  option.value ==
                                                  event.target.value
                                              );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              division_id: selectedOption?.value,
                                            }));
                                          }}
                                        >
                                          <option value="0">
                                            Select Division
                                          </option>
                                          {optionDivision?.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="division_id">
                                          Division
                                        </label>
                                        {formErrors.division_id && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.division_id}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="ean_upc_number"
                                          name="ean_upc_number"
                                          placeholder="Enter EAN/UPC Number"
                                          onChange={handleChange}
                                          defaultValue={formData?.ean_upc_number}
                                        />
                                        <label htmlFor="ean_upc_number">
                                          EAN/UPC Number
                                        </label>
                                        {formErrors.ean_upc_number && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.ean_upc_number}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          value={formData?.hsn_id}
                                          onChange={async event => {
                                            const selectedOption = OptionHsn.find(
                                              option =>
                                                option.value == event.target.value
                                            );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              hsn_id: selectedOption?.value,
                                            }));
                                          }}
                                          className="form-select"
                                        >
                                          <option value="0">
                                            Select HSN Code
                                          </option>
                                          {OptionHsn?.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="hsn_id">HSN Code</label>
                                        {formErrors.hsn_id && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.hsn_id}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg="4">
                                      <div className="form-floating mb-3">
                                        <select
                                          value={formData?.sac_id}
                                          onChange={async event => {
                                            const selectedOption = OptionSac.find(
                                              option =>
                                                option.value == event.target.value
                                            );
                                            setFormData(prevData => ({
                                              ...prevData,
                                              sac_id: selectedOption?.value,
                                            }));
                                          }}
                                          className="form-select"
                                        >
                                          <option value="0">
                                            Select SAC Code
                                          </option>
                                          {OptionSac?.map(option => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <label htmlFor="sac_id">SAC Code</label>
                                        {formErrors.sac_id && (
                                          <div
                                            style={{
                                              color: "#f46a6a",
                                              fontSize: "80%",
                                            }}
                                          >
                                            {formErrors.sac_id}
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                </Form>
                              </TabPane>
                              <TabPane tabId={2}>
                                <div>
                                  <Form>
                                    <Row>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="gross_weight"
                                            name="gross_weight"
                                            placeholder="Legal Gross Weight"
                                            onChange={handleChange}
                                            defaultValue={formData?.gross_weight}
                                          />
                                          <label htmlFor="gross_weight">
                                            Gross Weight
                                          </label>
                                          {formErrors.gross_weight && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.gross_weight}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.gross_weight_uom}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionGrossWeightUoM.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                gross_weight_uom:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Gross Weight UoM
                                            </option>
                                            {optionGrossWeightUoM?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="gross_weight_uom">
                                            Gross Weight UoM
                                          </label>
                                          {formErrors.gross_weight_uom && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.gross_weight_uom}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="net_weight"
                                            name="net_weight"
                                            placeholder="Legal Net Weight"
                                            onChange={handleChange}
                                            defaultValue={formData?.net_weight}
                                          />
                                          <label htmlFor="net_weight">
                                            Net Weight
                                          </label>
                                          {formErrors.net_weight && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.net_weight}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.net_weight_uom}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionNetWeightUoM.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                net_weight_uom:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Net Weight UoM
                                            </option>
                                            {optionNetWeightUoM?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="net_weight_uom">
                                            Net Weight UoM
                                          </label>
                                          {formErrors.net_weight_uom && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.net_weight_uom}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="volume"
                                            name="volume"
                                            placeholder="Legal Volume"
                                            onChange={handleChange}
                                            value={formData?.volume}
                                          />
                                          <label htmlFor="volume">Volume</label>
                                          {formErrors.volume && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.volume}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.volume_uom}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionVolumeUoM.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                volume_uom: selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Volume UoM
                                            </option>
                                            {optionVolumeUoM?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="volume_uom">
                                            Volume UoM
                                          </label>
                                          {formErrors.volume_uom && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.volume_uom}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="length"
                                            name="length"
                                            placeholder="Legal Length"
                                            onChange={handleChange}
                                            defaultValue={formData?.length}
                                          />
                                          <label htmlFor="length">Length</label>
                                          {formErrors.length && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.length}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.length_uom}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionLengthUoM.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                length_uom: selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Length UoM
                                            </option>
                                            {optionLengthUoM?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="length_uom">
                                            Length UoM
                                          </label>
                                          {formErrors.length_uom && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.length_uom}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="breadth"
                                            name="breadth"
                                            placeholder="Legal Breadth"
                                            onChange={handleChange}
                                            defaultValue={formData?.breadth}
                                          />
                                          <label htmlFor="breadth">Breadth</label>
                                          {formErrors.breadth && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.breadth}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.breadth_uom}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionBreadthUoM.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                breadth_uom:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Breadth UoM
                                            </option>
                                            {optionBreadthUoM?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="breadth_uom">
                                            Breadth UoM
                                          </label>
                                          {formErrors.breadth_uom && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.breadth_uom}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="height"
                                            name="height"
                                            placeholder="Legal Height"
                                            onChange={handleChange}
                                            defaultValue={formData?.height}
                                          />
                                          <label htmlFor="height">Height</label>
                                          {formErrors.height && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.height}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.height_uom}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionHeightUoM.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                height_uom: selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Height UoM
                                            </option>
                                            {optionHeightUoM?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="height_uom">
                                            Height UoM
                                          </label>
                                          {formErrors.height_uom && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.height_uom}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg="3">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.materialgroup1}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionMaterialGrp.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                materialgroup1:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Material Group
                                            </option>
                                            {optionMaterialGrp?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="materialgroup1">
                                            Material Group 1
                                          </label>
                                          {formErrors.materialgroup1 && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.materialgroup1}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="1">
                                        <Button
                                          onClick={handleAddRowNestedMaterialgrp}
                                          color="primary"
                                        >
                                          Add
                                        </Button>
                                      </Col>
                                      {extMaterialGrp.map((item1, idx) => (
                                        <>
                                          <Col lg="3">
                                            <tr id={"nested" + idx} key={idx}>
                                              <td>
                                                <div className="form-floating mb-3">
                                                  <select
                                                    value={
                                                      formData?.[`materialgroup${idx + 2}`]
                                                    }
                                                    onChange={async event => {
                                                      const selectedOption =
                                                        optionMaterialGrp?.find(
                                                          option =>
                                                            option.value ==
                                                            event.target.value
                                                        );
                                                      setFormData(prevData => ({
                                                        ...prevData,
                                                        [`materialgroup${idx + 2}`]:
                                                          selectedOption?.value,
                                                      }));
                                                    }}
                                                    className="form-select"
                                                  >
                                                    <option value="0">
                                                      Select Material Group
                                                    </option>
                                                    {optionMaterialGrp?.map(
                                                      option => (
                                                        <option
                                                          key={option.value}
                                                          value={option.value}
                                                        >
                                                          {option.label}
                                                        </option>
                                                      )
                                                    )}
                                                  </select>
                                                  <label htmlFor={`materialgroup${idx + 2}`}>
                                                    {`Material Group ${idx + 2}`}
                                                  </label>
                                                  {formErrors[`materialgroup${idx + 2}`] && (
                                                    <div style={{
                                                      color: "#f46a6a",
                                                      fontSize: "80%",
                                                    }}>
                                                      {formErrors[`materialgroup${idx + 2}`]}
                                                    </div>
                                                  )}
                                                </div>
                                              </td>
                                            </tr>
                                          </Col>
                                          <Col lg="1">
                                            <Button
                                              onClick={() =>
                                                handleRemoveRowNestedMaterialgrp(
                                                  idx
                                                )
                                              }
                                              color="danger"
                                              className="btn-block inner"
                                              style={{ width: "100%" }}
                                            >
                                              Delete
                                            </Button>
                                          </Col>
                                        </>
                                      ))}
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.product_hierarchy}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionProductHierarchy.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                product_hierarchy:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Product Hierarchy
                                            </option>
                                            {optionProductHierarchy?.map(
                                              option => (
                                                <option
                                                  key={option.value}
                                                  value={option.value}
                                                >
                                                  {option.label}
                                                </option>
                                              )
                                            )}
                                          </select>
                                          <label htmlFor="product_hierarchy">
                                            Product Hierarchy
                                          </label>
                                          {formErrors.product_hierarchy && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.product_hierarchy}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <textarea
                                            id="sales_long_text_description"
                                            name="sales_long_text_description"
                                            className="form-control"
                                            rows="2"
                                            placeholder="Enter Sales Long Text Description"
                                            onChange={handleChange}
                                            defaultValue={
                                              formData?.sales_long_text_description
                                            }
                                          />
                                          <label htmlFor="sales_long_text_description">
                                            Sales Long Text Description
                                          </label>
                                          {formErrors.sales_long_text_description && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {
                                                formErrors.sales_long_text_description
                                              }
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <div className="form-check mb-3">
                                            <input
                                              type="checkbox"
                                              className="form-check-input input-mini"
                                              id="batch_indicator"
                                              checked={formData?.batch_indicator}
                                              onChange={event => {
                                                setFormData(prevData => ({
                                                  ...prevData,
                                                  batch_indicator:
                                                    event.target.checked,
                                                }));
                                              }}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor="batch_indicator"
                                            >
                                              Batch Indicator
                                            </label>
                                            {formErrors.batch_indicator && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {formErrors.batch_indicator}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <div className="form-check mb-3">
                                            <input
                                              type="checkbox"
                                              className="form-check-input input-mini"
                                              id="serial_number_indicator"
                                              checked={
                                                formData?.serial_number_indicator
                                              }
                                              onChange={event => {
                                                setFormData(prevData => ({
                                                  ...prevData,
                                                  serial_number_indicator:
                                                    event.target.checked,
                                                }));
                                              }}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor="serial_number_indicator"
                                            >
                                              Serial Number Indicator
                                            </label>
                                            {formErrors.serial_number_indicator && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {
                                                  formErrors.serial_number_indicator
                                                }
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="shelf_life_product"
                                            placeholder="Shelf Life of Product"
                                            onChange={event => {
                                              setFormData(prevData => ({
                                                ...prevData,
                                                shelf_life_product:
                                                  event.target.value,
                                              }));
                                            }}
                                            defaultValue={
                                              formData?.shelf_life_product
                                            }
                                          />
                                          <label htmlFor="shelf_life_product">
                                            Shelf Life of Product
                                          </label>
                                          {formErrors.shelf_life_product && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.shelf_life_product}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            className="form-select"
                                            value={formData?.shelf_life_uom}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionShelfLifeProduct.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                shelf_life_uom:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                          >
                                            <option value="0">
                                              Select Shelf Life UoM
                                            </option>
                                            {optionShelfLifeProduct?.map(
                                              option => (
                                                <option
                                                  key={option.value}
                                                  value={option.value}
                                                >
                                                  {option.label}
                                                </option>
                                              )
                                            )}
                                          </select>
                                          <label htmlFor="shelf_life_uom">
                                            Shelf Life UoM
                                          </label>
                                          {formErrors.shelf_life_uom && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.shelf_life_uom}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            value={formData?.profit_centre}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionProfitCentre.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                profit_centre:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                            className="form-select"
                                          >
                                            <option value="0">
                                              Select Profit Centre
                                            </option>
                                            {optionProfitCentre?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="profit_centre">
                                            Profit Centre
                                          </label>
                                          {formErrors.profit_centre && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.profit_centre}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            value={formData?.work_centre}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionWorkCentre.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                work_centre:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                            className="form-select"
                                          >
                                            <option value="0">
                                              Select Work Centre
                                            </option>
                                            {optionWorkCentre?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="work_centre">
                                            Work Centre
                                          </label>
                                          {formErrors.work_centre && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.work_centre}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="standard_price_per_unit"
                                            placeholder="Standard Price per unit"
                                            onChange={event => {
                                              setFormData(prevData => ({
                                                ...prevData,
                                                standard_price_per_unit:
                                                  event.target.value,
                                              }));
                                            }}
                                            defaultValue={
                                              formData?.standard_price_per_unit
                                            }
                                          />
                                          <label htmlFor="standard_price_per_unit">
                                            Standard Price per unit
                                          </label>
                                          {formErrors.standard_price_per_unit && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.standard_price_per_unit}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="moving_avg_price_per_unit"
                                            name="moving_avg_price_per_unit"
                                            placeholder="Moving Avg Price per unit"
                                            onChange={handleChange}
                                            defaultValue={
                                              formData?.moving_avg_price_per_unit
                                            }
                                          />
                                          <label htmlFor="moving_avg_price_per_unit">
                                            Moving Avg Price per unit
                                          </label>
                                          {formErrors.moving_avg_price_per_unit && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {
                                                formErrors.moving_avg_price_per_unit
                                              }
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <select
                                            value={formData?.currency_id}
                                            onChange={async event => {
                                              const selectedOption =
                                                optionCurrency.find(
                                                  option =>
                                                    option.value ==
                                                    event.target.value
                                                );
                                              setFormData(prevData => ({
                                                ...prevData,
                                                currency_id:
                                                  selectedOption?.value,
                                              }));
                                            }}
                                            className="form-select"
                                          >
                                            <option value="0">
                                              Select Currency
                                            </option>
                                            {optionCurrency?.map(option => (
                                              <option
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </option>
                                            ))}
                                          </select>
                                          <label htmlFor="currency_id">
                                            Currency
                                          </label>
                                          {formErrors.currency_id && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.currency_id}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="unrestricted"
                                            name="unrestricted"
                                            placeholder="Unrestricted"
                                            onChange={handleChange}
                                            defaultValue={formData?.unrestricted}
                                          />
                                          <label htmlFor="unrestricted">
                                            Unrestricted
                                          </label>
                                          {formErrors.unrestricted && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.unrestricted}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="restricted_use_stock"
                                            name="restricted_use_stock"
                                            placeholder="Restricted-Use Stock"
                                            onChange={handleChange}
                                            defaultValue={
                                              formData?.restricted_use_stock
                                            }
                                          />
                                          <label htmlFor="restricted_use_stock">
                                            Restricted-Use Stock
                                          </label>
                                          {formErrors.restricted_use_stock && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.restricted_use_stock}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="quality_inspection"
                                            name="quality_inspection"
                                            placeholder="Quality Inspection"
                                            onChange={handleChange}
                                            defaultValue={
                                              formData?.quality_inspection
                                            }
                                          />
                                          <label htmlFor="quality_inspection">
                                            Quality Inspection
                                          </label>
                                          {formErrors.quality_inspection && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.quality_inspection}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="blocked"
                                            name="blocked"
                                            placeholder="Blocked"
                                            onChange={handleChange}
                                            defaultValue={formData?.blocked}
                                          />
                                          <label htmlFor="blocked">Blocked</label>
                                          {formErrors.blocked && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.blocked}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="returns"
                                            name="returns"
                                            placeholder="Returns"
                                            onChange={handleChange}
                                            defaultValue={formData?.returns}
                                          />
                                          <label htmlFor="returns">Returns</label>
                                          {formErrors.returns && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.returns}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="stock_in_transfer"
                                            name="stock_in_transfer"
                                            placeholder="Stock in transfer"
                                            onChange={handleChange}
                                            defaultValue={
                                              formData?.stock_in_transfer
                                            }
                                          />
                                          <label htmlFor="stock_in_transfer">
                                            Stock in transfer
                                          </label>
                                          {formErrors.stock_in_transfer && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.stock_in_transfer}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg="4">
                                        <div className="form-floating mb-3">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="in_transfer_plant"
                                            name="in_transfer_plant"
                                            placeholder="In transfer (Plant)"
                                            onChange={handleChange}
                                            defaultValue={
                                              formData?.in_transfer_plant
                                            }
                                          />
                                          <label htmlFor="in_transfer_plant">
                                            In Transfer (Plant)
                                          </label>
                                          {formErrors.in_transfer_plant && (
                                            <div
                                              style={{
                                                color: "#f46a6a",
                                                fontSize: "80%",
                                              }}
                                            >
                                              {formErrors.in_transfer_plant}
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                  </Form>
                                </div>
                              </TabPane>
                              {activeTab === 3 && (
                                <TabPane tabId={3}>
                                  {formData?.gst_rate_details === "GSTclassification" ? (
                                    <Row>
                                      <Col lg="6">
                                        <Row>
                                          <Col lg="6">
                                            <div className="form-floating mb-3">
                                              <select
                                                className="form-select"
                                                id="gst_rate_details"
                                                value={formData?.gst_rate_details}
                                                onChange={async e => {
                                                  const selectedValue = e.target.value;
                                                  const isSpecifyDetails = selectedValue === "specifyDetails";

                                                  setFormData(prevData => ({
                                                    ...prevData,
                                                    gst_rate_details: selectedValue,
                                                    taxability_type: isSpecifyDetails ? "taxable" : "",
                                                    gst_rate: isSpecifyDetails ? "0" : "0",
                                                  }));
                                                }}
                                              >
                                                <option value="specifyDetails">Specify Details Here</option>
                                                <option value="GSTclassification">Use GST Classification</option>
                                              </select>
                                              <label htmlFor="gst_rate_details">GST Rate Details</label>
                                              {formErrors.gst_rate_details && (
                                                <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                                                  {formErrors.gst_rate_details}
                                                </div>
                                              )}
                                            </div>
                                          </Col>
                                          <Col lg="6">
                                            <div className="form-floating mb-3">
                                              <input
                                                type="text"
                                                className="form-control"
                                                id="gst_classification"
                                                name="gst_classification"
                                                placeholder="Classification"
                                                value={formData?.gst_classification}
                                                onChange={e => {
                                                  const inputValue = e.target.value;
                                                  setFormData(prev => ({
                                                    ...prev,
                                                    gst_classification: inputValue,
                                                  }));
                                                }}
                                              />
                                              <label htmlFor="gst_classification">Classification</label>
                                              {formErrors.gst_classification && (
                                                <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                                                  {formErrors.gst_classification}
                                                </div>
                                              )}
                                            </div>
                                          </Col>
                                        </Row>

                                        <Row>
                                          <Col lg="6">
                                            <div className="form-floating mb-3">
                                              <select
                                                className="form-select"
                                                id="taxability_type"
                                                value={formData?.taxability_type || ""}
                                                disabled>
                                                <option value=""></option>
                                                <option value="taxable">Taxable</option>
                                                <option value="exempt">Exempt</option>
                                                <option value="nilRated">Nil Rated</option>
                                                <option value="nonGST">Non GST</option>
                                              </select>
                                              <label htmlFor="taxability_type">Taxability Type</label>
                                            </div>
                                          </Col>
                                          <Col lg="6">
                                            <div className="form-floating mb-3">
                                              <input
                                                type="text"
                                                className="form-control"
                                                id="gst_rate"
                                                name="gst_rate"
                                                placeholder="GST Rate"
                                                value={formData?.gst_rate !== undefined && formData?.gst_rate !== null ? `${formData.gst_rate}%` : ""}
                                                onChange={e => {
                                                  let inputValue = e.target.value.replace("%", "");
                                                  inputValue = inputValue.replace(/[^0-9.]/g, "");
                                                  setFormData(prev => ({
                                                    ...prev,
                                                    gst_rate: inputValue,
                                                  }));
                                                }}
                                                disabled
                                              />
                                              <label htmlFor="gst_rate">GST Rate</label>
                                            </div>
                                          </Col>
                                        </Row>

                                        <Row>
                                          <Col lg="6">
                                            <div className="form-floating mb-3">
                                              <select
                                                className="form-select"
                                                id="type_of_supply"
                                                value={formData?.type_of_supply}
                                                onChange={e =>
                                                  setFormData(prev => ({
                                                    ...prev,
                                                    type_of_supply: e.target.value,
                                                  }))
                                                }
                                              >
                                                <option value="">Select Supply Type</option>
                                                <option value="Capital Goods">Capital Goods</option>
                                                <option value="Goods">Goods</option>
                                                <option value="Services">Services</option>
                                              </select>
                                              <label htmlFor="type_of_supply">Type of Supply</label>
                                              {formErrors.type_of_supply && (
                                                <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                                                  {formErrors.type_of_supply}
                                                </div>
                                              )}
                                            </div>
                                          </Col>
                                        </Row>
                                      </Col>

                                      <Col lg="6">
                                        <div className="border rounded p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                          <h5 className="mb-3">GST Data List</h5>
                                          {loading ? (
                                            <div>Loading...</div>
                                          ) : classificationData.length > 0 ? (
                                            <ul className="list-group">
                                              {classificationData.map((item, index) => (
                                                <li key={index} className="list-group-item" style={{ cursor: "pointer" }}
                                                  onClick={() => {
                                                    console.log("item", item?.id)
                                                    setFormData(prev => ({
                                                      ...prev,
                                                      gst_classification: item.name || "",
                                                      taxability_type: item.gst_tax_type?.trim() || "",
                                                      gst_rate: item.gst_rate || "",
                                                      gst_classification_id: item?.id,
                                                    }));
                                                  }}>
                                                  <div> {item.name} </div>
                                                </li>
                                              ))}
                                            </ul>
                                          ) : (
                                            <div>No Data Found</div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                  ) : (
                                    <Row>
                                      <Row>
                                        <Col lg="4">
                                          <div className="form-floating mb-3">
                                            <select
                                              className="form-select"
                                              id="gst_rate_details"
                                              value={formData?.gst_rate_details}
                                              onChange={async e => {
                                                const selectedValue = e.target.value;
                                                const isSpecifyDetails = selectedValue === "specifyDetails";

                                                setFormData(prevData => ({
                                                  ...prevData,
                                                  gst_rate_details: selectedValue,
                                                  taxability_type: isSpecifyDetails ? "taxable" : "",
                                                  gst_rate: isSpecifyDetails ? "0" : "0",
                                                }));
                                              }}
                                            >
                                              <option value="specifyDetails">Specify Details Here</option>
                                              <option value="GSTclassification">Use GST Classification</option>
                                            </select>
                                            <label htmlFor="gst_rate_details">GST Rate Details</label>
                                            {formErrors.gst_rate_details && (
                                              <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                                                {formErrors.gst_rate_details}
                                              </div>
                                            )}
                                          </div>
                                        </Col>

                                        <Col lg="4">
                                          <div className="form-floating mb-3">
                                            <select
                                              className="form-select"
                                              id="taxability_type"
                                              value={formData?.taxability_type}
                                              onChange={async e => {
                                                const selectedType = e.target.value;
                                                const isNotTaxable = selectedType === "exempt" || selectedType === "nilRated" || selectedType === "nonGST";
                                                setFormData(prevData => ({
                                                  ...prevData,
                                                  taxability_type: selectedType,
                                                  gst_rate: isNotTaxable ? "0" : prevData.gst_rate,
                                                }));
                                              }}
                                            >
                                              <option value="taxable">Taxable</option>
                                              <option value="exempt">Exempt</option>
                                              <option value="nilRated">Nil Rated</option>
                                              <option value="nonGST">Non GST</option>
                                            </select>
                                            <label htmlFor="taxability_type">Taxability Type</label>
                                            {formErrors.taxability_type && (
                                              <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                                                {formErrors.taxability_type}
                                              </div>
                                            )}
                                          </div>
                                        </Col>

                                        <Col lg="4">
                                          <div className="form-floating mb-3">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="gst_rate"
                                              name="gst_rate"
                                              placeholder="GST Rate"
                                              value={formData?.gst_rate ? `${formData.gst_rate}%` : ""}
                                              onChange={handleGstChange}
                                              onKeyDown={onGstRateKeyDown}
                                              disabled={formData?.gst_rate_details === "GSTclassification" ||
                                                formData?.taxability_type === "exempt" ||
                                                formData?.taxability_type === "nilRated" ||
                                                formData?.taxability_type === "nonGST"}
                                            />
                                            <label htmlFor="gst_rate">GST Rate</label>
                                            {formErrors.gst_rate && (
                                              <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                                                {formErrors.gst_rate}
                                              </div>
                                            )}
                                          </div>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col lg="4">
                                          <div className="form-floating mb-3">
                                            <select
                                              className="form-select"
                                              id="type_of_supply"
                                              value={formData?.type_of_supply}
                                              onChange={e =>
                                                setFormData(prev => ({
                                                  ...prev,
                                                  type_of_supply: e.target.value,
                                                }))
                                              }
                                            >
                                              <option value="">Select Supply Type</option>
                                              <option value="Capital Goods">Capital Goods</option>
                                              <option value="Goods">Goods</option>
                                              <option value="Services">Services</option>
                                            </select>
                                            <label htmlFor="type_of_supply">Type of Supply</label>
                                            {formErrors.type_of_supply && (
                                              <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                                                {formErrors.type_of_supply}
                                              </div>
                                            )}
                                          </div>
                                        </Col>
                                      </Row>
                                    </Row>
                                  )}
                                </TabPane>
                              )}

                              <TabPane tabId={4}>
                                <Row>
                                  <Col lg={4}></Col>
                                  <Col lg={4}>
                                    <Label>Technical Parameter Set</Label>
                                    <Select
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                      value={selectedTechSet}
                                      options={optionDropDownItems}
                                      onChange={handleTechSetChange}
                                    />
                                    {formErrors?.tech_set && (
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "80%",
                                        }}
                                      >
                                        {formErrors?.tech_set}
                                      </div>
                                    )}
                                  </Col>
                                  <Col lg={4}></Col>
                                </Row>
                                <br></br>
                                <Row>
                                  {tableData?.length > 0 &&
                                    tableData.map((item, index) => {
                                      if (item.types[0] === "datebox") {
                                        return (
                                          <Col
                                            key={index}
                                            md={6}
                                            className="mb-3"
                                          >
                                            <Label htmlFor="datebox">
                                              {item?.labels[0]}
                                            </Label>
                                            <Flatpickr
                                              placeholder="dd M, yyyy"
                                              options={{
                                                altInput: true,
                                                altFormat: "j F, Y",
                                                dateFormat: "Y-m-d",
                                              }}
                                              onChange={selectedDates => {
                                                setTechData(prevData => ({
                                                  ...prevData,
                                                  [`datebox-${index}`]:
                                                  {
                                                    id: item?.items[0]?.id,
                                                    type: item?.types[0],
                                                    label: moment(selectedDates[0]).format("DD/MM/YYYY")
                                                  },
                                                }));
                                              }}
                                              value={moment(
                                                techData?.[`datebox-${index}`] == null ? item?.values[0] : techData?.[`datebox-${index}`]?.label,
                                                "DD/MM/YYYY"
                                              ).toDate()}
                                            />
                                            {formErrors?.[`datebox-${index}`] && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {formErrors?.[`datebox-${index}`]}
                                              </div>
                                            )}
                                          </Col>
                                        );
                                      } else if (item.types[0] === "textfield") {
                                        return (
                                          <Col
                                            key={index}
                                            md={6}
                                            className="mb-3"
                                          >
                                            <Label htmlFor={`textfield-${index}`}>
                                              {item?.labels[0]}
                                            </Label>
                                            <Input
                                              type="text"
                                              id={`textfield-${index}`}
                                              name={`textfield-${index}`}
                                              value={techData?.[`textfield-${index}`] == null ? item?.values[0] : techData?.[`textfield-${index}`]?.label}
                                              onChange={event => {
                                                setTechData(prevData => ({
                                                  ...prevData,
                                                  [`textfield-${index}`]:
                                                  {
                                                    id: item?.items[0]?.id,
                                                    type: item?.types[0],
                                                    label: event.target?.value
                                                  },
                                                }));
                                              }}
                                              placeholder="Please Enter Text Field"
                                            />
                                            {formErrors?.[`textfield-${index}`] && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {formErrors?.[`textfield-${index}`]}
                                              </div>
                                            )}
                                          </Col>
                                        );
                                      } else if (item.types[0] === "dropdown") {
                                        return (
                                          <Col
                                            key={index}
                                            md={6}
                                            className="mb-3"
                                          >
                                            <label htmlFor="dropdown">
                                              {item?.labels[0]}
                                            </label>
                                            <Select
                                              className="basic-multi-select"
                                              classNamePrefix="select"
                                              options={item?.items}
                                              onChange={async selectedTechSet => {
                                                setTechData(prevData => ({
                                                  ...prevData,
                                                  [`dropdown-${index}`]:
                                                  {
                                                    id: item?.items[0]?.id,
                                                    type: item?.types[0],
                                                    default_value: selectedTechSet[0]?.default_value,
                                                    dropdown: selectedTechSet,
                                                  },
                                                }));
                                              }}
                                              value={techData?.[`dropdown-${index}`] == null ? item?.values[0] : techData?.[`dropdown-${index}`]?.dropdown}

                                            ></Select>
                                            {formErrors?.[`dropdown-${index}`] && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {formErrors?.[`dropdown-${index}`]}
                                              </div>
                                            )}
                                          </Col>
                                        );
                                      } else if (item.types[0] === "textarea") {
                                        return (
                                          <Col
                                            key={index}
                                            md={6}
                                            className="mb-3"
                                          >
                                            <Label htmlFor={`textarea-${index}`}>
                                              {item?.labels[0]}
                                            </Label>
                                            <Input
                                              type="textarea"
                                              id={`textarea-${index}`}
                                              name={`textarea-${index}`}
                                              className={`form-control ${formErrors.textarea
                                                ? "is-invalid"
                                                : ""
                                                }`}
                                              value={techData?.[`textarea-${index}`] == null ? item?.values[0] : techData?.[`textarea-${index}`]?.label}
                                              onChange={event => {
                                                setTechData(prevData => ({
                                                  ...prevData,
                                                  [`textarea-${index}`]:
                                                  {
                                                    id: item?.items[0]?.id,
                                                    type: item?.types[0],
                                                    label: event.target?.value
                                                  },
                                                }));
                                              }}
                                              rows="1"
                                              placeholder="Please Enter Text Area"
                                            />
                                          </Col>
                                        );
                                      } else if (item.types[0] === "dateTime") {
                                        return (
                                          <Col
                                            key={index}
                                            md={6}
                                            className="mb-3"
                                          >
                                            <Label htmlFor="dateTime">
                                              {item?.labels[0]}
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
                                                setTechData(prevData => ({
                                                  ...prevData,
                                                  [`dateTime-${index}`]:
                                                  {
                                                    id: item?.items[0]?.id,
                                                    type: item?.types[0],
                                                    label: moment(
                                                      selectedDates[0]
                                                    ).format("DD/MM/YYYY hh:mm A")
                                                  },
                                                }));
                                              }}
                                              value={moment(
                                                techData?.[`dateTime-${index}`] == null ? item?.values[0] : techData?.[`dateTime-${index}`]?.label,
                                                "DD/MM/YYYY hh:mm A"
                                              ).toDate()}
                                            />
                                            {formErrors?.[`dateTime-${index}`] && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {formErrors?.[`dateTime-${index}`]}
                                              </div>
                                            )}
                                          </Col>
                                        );
                                      } else if (item.types[0] === "timebox") {
                                        return (
                                          <Col
                                            key={index}
                                            md={6}
                                            className="mb-3"
                                          >
                                            <Label htmlFor="timebox">
                                              {item?.labels[0]}
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
                                                setTechData(prevData => ({
                                                  ...prevData,
                                                  [`timebox-${index}`]:
                                                  {
                                                    id: item?.items[0]?.id,
                                                    type: item?.types[0],
                                                    label: moment(
                                                      selectedDates[0]
                                                    ).format("hh:mm A")
                                                  },
                                                }));
                                              }}
                                              value={moment(
                                                techData?.[`timebox-${index}`] == null ? item?.values[0] : techData?.[`timebox-${index}`]?.label,
                                                "hh:mm A"
                                              ).toDate()}
                                            />
                                            {formErrors?.[`timebox-${index}`] && (
                                              <div
                                                style={{
                                                  color: "#f46a6a",
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {formErrors?.[`timebox-${index}`]}
                                              </div>
                                            )}
                                          </Col>
                                        );
                                      } else if (item.types[0] === "urlbox") {
                                        return (
                                          <Col
                                            key={index}
                                            md={6}
                                            className="mb-3"
                                          >
                                            <Label htmlFor="textarea">
                                              {item?.labels[0]}
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
                                              value={techData?.[`urlbox-${index}`] == null ? item?.values[0] : techData?.[`urlbox-${index}`]?.label}
                                              onChange={event => {
                                                setTechData(prevData => ({
                                                  ...prevData,
                                                  [`urlbox-${index}`]:
                                                  {
                                                    id: item?.items[0]?.id,
                                                    type: item?.types[0],
                                                    label: event.target?.value
                                                  },
                                                }));
                                              }}
                                            />
                                            {formErrors?.[`urlbox-${index}`] && (
                                              <div className="invalid-feedback">
                                                {formErrors?.[`urlbox-${index}`]}
                                              </div>
                                            )}
                                          </Col>
                                        );
                                      } else if (item.types[0] === "emailbox") {
                                        return (
                                          <Col
                                            key={index}
                                            md={6}
                                            className="mb-3"
                                          >
                                            <Label htmlFor="email">
                                              {item?.labels[0]}
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
                                              value={techData?.[`emailbox-${index}`] == null ? item?.values[0] : techData?.[`emailbox-${index}`]?.label}
                                              onChange={event => {
                                                setTechData(prevData => ({
                                                  ...prevData,
                                                  [`emailbox-${index}`]:
                                                  {
                                                    id: item?.items[0]?.id,
                                                    type: item?.types[0],
                                                    label: event.target?.value
                                                  },
                                                }));
                                              }}
                                            />
                                            {formErrors?.[`emailbox-${index}`] && (
                                              <div className="invalid-feedback">
                                                {formErrors?.[`emailbox-${index}`]}
                                              </div>
                                            )}
                                          </Col>
                                        );
                                      } else if (item.types[0] === "colorbox") {
                                        return (
                                          <Col
                                            key={index}
                                            md={6}
                                            className="mb-3"
                                          >
                                            <Label htmlFor="email">
                                              {item?.labels[0]}
                                            </Label>
                                            <Input
                                              type="color"
                                              id="colorbox"
                                              name="colorbox"
                                              className={`form-control ${formErrors.colorbox
                                                ? "is-invalid"
                                                : ""
                                                }`}
                                              value={techData?.[`colorbox-${index}`] == null ? item?.values[0] : techData?.[`colorbox-${index}`]?.label}
                                              onChange={event => {
                                                setTechData(prevData => ({
                                                  ...prevData,
                                                  [`colorbox-${index}`]:
                                                  {
                                                    id: item?.items[0]?.id,
                                                    type: item?.types[0],
                                                    label: event.target?.value
                                                  },
                                                }));
                                              }}
                                            />
                                            {formErrors?.[`colorbox-${index}`] && (
                                              <div className="invalid-feedback">
                                                {formErrors?.[`colorbox-${index}`]}
                                              </div>
                                            )}
                                          </Col>
                                        );
                                      } else if (item.types[0] === "numberbox") {
                                        return (
                                          <Col
                                            key={index}
                                            md={6}
                                            className="mb-3"
                                          >
                                            <Label htmlFor="email">
                                              {item?.labels[0]}
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
                                              value={techData?.[`numberbox-${index}`] == null ? item?.values[0] : techData?.[`numberbox-${index}`]?.label}
                                              onChange={event => {
                                                setTechData(prevData => ({
                                                  ...prevData,
                                                  [`numberbox-${index}`]:
                                                  {
                                                    id: item?.items[0]?.id,
                                                    type: item?.types[0],
                                                    label: event.target?.value
                                                  },
                                                }));
                                              }}
                                            />
                                            {formErrors?.[`numberbox-${index}`] && (
                                              <div className="invalid-feedback">
                                                {formErrors?.[`numberbox-${index}`]}
                                              </div>
                                            )}
                                          </Col>
                                        );
                                      } else if (
                                        item.types[0] === "multipleselect"
                                      ) {
                                        return (
                                          <Col
                                            key={index}
                                            md={6}
                                            className="mb-3"
                                          >
                                            {" "}
                                            <label htmlFor="uom">
                                              {item?.labels[0]}
                                            </label>
                                            <Select
                                              isMulti
                                              multiple
                                              className="basic-multi-select"
                                              classNamePrefix="select"
                                              options={item?.items}
                                              onChange={async selectedTechSet => {
                                                setTechData(prevData => ({
                                                  ...prevData,
                                                  [`multipleselect-${index}`]:
                                                  {
                                                    id: item?.items[0]?.id,
                                                    type: item?.types[0],
                                                    default_value: selectedTechSet[0]?.default_value,
                                                    multipleselect: selectedTechSet,
                                                  },
                                                }));
                                              }}
                                              value={techData?.[`multipleselect-${index}`] == null ? item?.values[0] : techData?.[`multipleselect-${index}`]?.multipleselect}

                                            ></Select>
                                          </Col>
                                        );
                                      } else {
                                        return null;
                                      }
                                    })}
                                </Row>
                              </TabPane>
                              <TabPane tabId={5}>
                                <div className="row justify-content-center">
                                  <Col lg="6">
                                    <div className="text-center">
                                      <div className="mb-4">
                                        {addproducts?.success === true ||
                                          updateproducts?.success === true ? (
                                          <i className="mdi mdi-check-circle-outline text-success display-4" />
                                        ) : (
                                          <i className="mdi mdi-close-circle-outline text-danger display-4" />
                                        )}
                                      </div>
                                      <div>
                                        <h5>
                                          {addproducts?.message ||
                                            updateproducts?.message}
                                        </h5>
                                      </div>
                                    </div>
                                  </Col>
                                </div>
                              </TabPane>
                            </TabContent>
                          </div>
                          <div className="actions clearfix">
                            <ul>
                              <li className={
                                activeTab === 1 || activeTab === 5
                                  ? "previous disabled"
                                  : "previous"
                              }>
                                <Link
                                  to={{
                                    pathname: "/products/" + mode,
                                    state: { editProduct: Edit },
                                  }}
                                  onClick={() => {
                                    if (activeTab == 2 || activeTab == 3 || activeTab == 4) {
                                      toggleTab(activeTab - 1);
                                    }
                                  }}
                                >
                                  Previous
                                </Link>
                              </li>

                              <li className={activeTab === 5 ? "next disabled" : "next"}>
                                <Link
                                  to={{
                                    pathname: "/products/" + mode,
                                    state: { editProduct: Edit },
                                  }}
                                  onClick={() => {
                                    toggleTab(activeTab + 1);
                                  }}
                                >
                                  Next
                                </Link>
                              </li>
                            </ul>
                          </div>

                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddProducts;
