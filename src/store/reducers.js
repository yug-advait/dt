import { combineReducers } from "redux"
// Front
import Layout from "./layout/reducer"
// Authentication
import Login from "./auth/login/reducer"
// import Account from "./auth/register/reducer"
// import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

//Master Modules
import departments from "./department/reducer"
import countries from "./country/reducer"
import languages from "./language/reducer"
import states from "./state/reducer"
import designations from "./designation/reducer"
import distribution from "./distribution/reducer"
import currency from "./currency/reducer"
import companyLegalEntity from "./companyLegalEntity/reducer"


//Product Modules
import productGroups from "./productGroups/reducer"

// Vendors Modules
import accountGroups from "./accountGroups/reducer"
import locationCodes from "./locationCodes/reducer"
import warehouses from "./warehouses/reducer"
import revenueIndicators from "./revenueIndicator/reducer"
import withHoldingTaxTypes from "./withholdingTaxType/reducer"
import TaxIndicator from "./taxIndicator/reducer"
import VendorGroups from "./vendorGroups/reducer"
import incoTerms from "./incoTerms/reducer"
import paymentTerms from "./paymentTerms/reducer"
import purchaseGroups from "./purchaseGroups/reducer"
import vendor from "./vendor/reducer"
import purchaseOrganisations from "./purchaseOrganisation/reducer"
import employeeGroup from "./employeeGroup/reducer"
import employeeMaster from "./employeeMaster/reducer"
import customerGroups from "./customerGroups/reducer"
import productHierarchy from "./productHierarchy/reducer"
import materialType from "./materialType/reducer"
import materialGroup from "./materialGroup/reducer"
import unitOfMeasure from "./unitOfMeasure/reducer"
import customers from "./customers/reducer"
import workingCalender from "./workingCalender/reducer"
import products from "./products/reducer"
import admins from "./admins/reducer"
import currencyConversions from "./currencyConversions/reducer"
import cities from "./cities/reducer"
import costCenter from "./costCenter/reducer"
import GLAccount from "./glAccount/reducer"
import AdminGroups from "./adminGroups/reducer"
import salesgroup from "./salesGroup/reducer"
import salesOffice from "./salesOffice/reducer"
import salesorganisation from "./salesOrganisation/reducer"
import hsnsac from "./HsnSaccode/reducer"
import prItem from "./prItem/reducer"
import prDocType from "./prDocType/reducer"
import purchaseRequest from "./purchaseRequest/reducer"
import departmentpermission from "./departmentpermission/reducer"
import poDocType from "./poDocType/reducer"
import asnDocType from "./asnDocType/reducer"
import grnDocType from "./grnDocType/reducer"
import purchaseOrder from "./purchaseOrder/reducer"
import asn from "./ASN/reducer"
import goodreceipt from "./goodReceipt/reducer"
import qualitycheck from "./QualityCheck/reducer"
import technicalparameter from "./technicalParameter/reducer"
import rfq from "./RFQ/reducer"
import site_setting from "./siteSetting/reducer"
import techset from "./technicalParameterSet/reducer"
import rfqDocType from "./rfqDocType/reducer"
import vendorDashboard from "./vendorDashboard/reducer"
import gateEntry from "./gateEntry/reducer"
import gateEntryDocType from "./gateEntryDocType/reducer"
import invoice from "./invoice/reducer"
import salesOrders from "./salesOrderMaster/reducers"
import salesOrderDocType from "./salesOrderDocType/reducer"


//common
import commons from "./common/reducer"
import inquiryItemCategories from "./inquiryItemCategory/reducer"
import salesDistricts from "./salesDistricts/reducer"

 
//Dashboard 
// import Dashboard from "./dashboard/reducer";

const rootReducer = combineReducers({
  Layout,
  Login,
  // Account,
  // ForgetPassword,
  Profile,
  commons,
  departments,
  countries,
  states,
  languages,
  designations,
  distribution,
  currency,
  productGroups,
  companyLegalEntity,
  revenueIndicators,
  accountGroups,
  locationCodes,
  warehouses,
  withHoldingTaxTypes,
  TaxIndicator,
  VendorGroups,
  vendor,
  incoTerms,
  paymentTerms,
  purchaseGroups,
  purchaseOrganisations,
  employeeGroup,
  employeeMaster,
  customerGroups,
  productHierarchy,
  materialType,
  materialGroup,
  unitOfMeasure,
  customers,
  workingCalender,
  products,
  currencyConversions,
  admins,
  cities,
  costCenter,
  GLAccount,
  AdminGroups,
  salesgroup,
  salesOffice,
  salesorganisation,
  hsnsac,
  prItem,
  prDocType,
  purchaseRequest,
  departmentpermission,
  poDocType,
  asnDocType,
  grnDocType,
  purchaseOrder,
  asn,
  goodreceipt,
  qualitycheck,
  technicalparameter,
  rfq,
  site_setting,
  techset,
  rfqDocType,
  vendorDashboard,
  gateEntry,
  gateEntryDocType,
  invoice,
  salesOrders,
  salesOrderDocType,
  inquiryItemCategories,
  salesDistricts
  })

export default rootReducer
