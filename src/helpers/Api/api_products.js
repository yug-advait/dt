import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;


const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

export const getProducts = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/products/product`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const products = response?.data?.productsData || [];
    return products;
  } catch (error) {
    return [];
  }
};
export const getProductsByID = async (id) => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/products/product/` + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const products = response?.data?.productByIDData || [];
    return products;
  } catch (error) {
    return [];
  }
};

export const addProductsApiCall = async (
  formData,
  techData,
  isActive,
  Id,
  isdeleted
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      material_type: formData?.material_type,
      material_allowed_indicator: formData?.material_allowed_indicator,
      product_code : formData?.product_code,
      product_description : formData?.product_description,
      base_uom : formData?.base_uom,
      sales_uom : formData?.sales_uom,
      conversion_factor_sales : formData?.conversion_factor_sales,
      wh_uom : formData?.wh_uom,
      conversion_factor_wh_uom : formData?.conversion_factor_wh_uom,
      prodn_uom : formData?.prodn_uom,
      conversion_factor_prod_uom : formData?.conversion_factor_prod_uom,
      procurement_uom : formData?.procurement_uom,
      conversion_factor_procurement_uom : formData?.conversion_factor_procurement_uom,
      valid_from: formData?.valid_from,
      valid_to: formData?.valid_to,
      plant_id: formData?.plant_id,
      company_id: formData?.company_id,
      sales_organisation_id: formData?.sales_organisation_id,
      distribution_channel_id: formData?.distribution_channel_id,
      division_id: formData?.division_id,
      ean_upc_number: formData?.ean_upc_number,
      hsn_id: formData?.hsn_id,
      sac_id: formData?.sac_id,
      gross_weight: formData?.gross_weight,
      gross_weight_uom: formData?.gross_weight_uom,
      net_weight: formData?.net_weight,
      net_weight_uom: formData?.net_weight_uom,
      volume: formData?.volume,
      volume_uom: formData?.volume_uom,
      length: formData?.length,
      length_uom: formData?.length_uom,
      breadth: formData?.breadth,
      breadth_uom: formData?.breadth_uom,
      height: formData?.height,
      height_uom: formData?.height_uom,
      materialgroup1: formData?.materialgroup1,
      materialgroup2: formData?.materialgroup2,
      materialgroup3: formData?.materialgroup3,
      materialgroup4: formData?.materialgroup4,
      materialgroup5: formData?.materialgroup5,
      product_hierarchy: formData?.product_hierarchy,
      sales_long_text_description: formData?.sales_long_text_description,
      batch_indicator: formData?.batch_indicator,
      serial_number_indicator: formData?.serial_number_indicator,
      shelf_life_product: formData?.shelf_life_product,
      shelf_life_uom: formData?.shelf_life_uom,
      profit_centre: formData?.profit_centre,
      work_centre: formData?.work_centre,
      standard_price_per_unit: formData?.standard_price_per_unit,
      moving_avg_price_per_unit: formData?.moving_avg_price_per_unit,
      currency_id: formData?.currency_id,
      unrestricted: formData?.unrestricted,
      restricted_use_stock: formData?.restricted_use_stock,
      quality_inspection: formData?.quality_inspection,
      blocked: formData?.blocked,
      returns: formData?.returns,
      stock_in_transfer: formData?.stock_in_transfer,
      in_transfer_plant: formData?.in_transfer_plant,
      technical_set_id: formData?.technical_set_id,
      technical_set_value: techData,
      gst_rate_details: formData?.gst_rate_details,
      taxability_type: formData?.taxability_type,
      gst_rate: formData?.gst_rate,
      type_of_supply: formData?.type_of_supply,
      gst_classification: formData?.gst_classification,
      gst_classification_id: formData?.gst_classification_id,
      isactive: isActive,
      id: Id,
    };

    if (Id === 0) {
      requestBody = {
        ...requestBody,
        createdby: userID,
        isdeleted: isdeleted,
      };
    } else {
      requestBody = {
        ...requestBody,
        updatedby: userID,
        isdeleted: isdeleted,
      };
    }
    const response = await axios.post(
      `${apiUrl}/products/product/${Id}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return false;
  }
};


export const productTechParameterByID = async (
  parameter_sets,
) => {
  const userData = getUserData();
  const token = userData?.token
  try {
    let requestBody = {
      parameter_sets: parameter_sets,
    };
    const response = await axios.post(
      `${apiUrl}/products/techparameter`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return false;
  }
};