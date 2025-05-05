import React from "react"
import { Redirect } from "react-router-dom"

import UserProfile from "../pages/Authentication/UserProfile"
import Department from "pages/GeneralMaster/DepartmentMaster/Department";
import Language from "pages/GeneralMaster/LanguageMaster/Language";
import Country from "pages/GeneralMaster/CountryMaster/Country";
import State from "pages/GeneralMaster/StateMaster/State";
import Designation from "pages/GeneralMaster/DesignationMaster/Designation";
import Distribution from "pages/GeneralMaster/DistributionMaster/Distribution";
import Currency from "pages/GeneralMaster/CurrencyMaster/Currency";
import Groups from "pages/Products/ProductsGroups/Groups";
import CompanyLegalEntity from "pages/GeneralMaster/CompanyLegalEntityMaster/CompanyLegalEntity";
import RevenueIndicator from "pages/Vendors/RevenueIndicatorMaster/RevenueIndicator";
import AccountGroups from "pages/Vendors/AccountGroups/AccountGroups";
import Customers from "pages/Customers/Customers/Customers";
import AddCustomers from "pages/Customers/Customers/AddCustomers";
import Warehouses from "pages/Products/WarehousesMaster/Warehouses";
import LocationCodes from "pages/Vendors/LocationCodes/LocationCodes";
import WithHoldingTaxType from 'pages/Vendors/WithholdingTaxType/WithHoldingTaxType'
import VendorGroups from 'pages/Vendors/VendorGroups/VendorGroups'
import TaxIndicator from "pages/Vendors/TaxIndicator/TaxIndicator";
import Vendors from "pages/Vendors/Vendors/Vendors";
import AddVendor from "pages/Vendors/Vendors/AddVendor";
import PurchaseRequest from "pages/PurchaseRequest/purchaseRequest"
import createPR from "pages/PurchaseRequest/createPR";
import IncoTerm from "pages/Vendors/IncoTerms/IncoTerms";
import PaymentTerms from "pages/Vendors/PaymentTerms/PaymentTerms";
import PurchaseGroups from "pages/Vendors/PurchaseGroups/PurchaseGroups";
import PurchaseOrganisation from "pages/Vendors/PurchaseOrganisation/PurchaseOrganisation";
import EmployeeGroup from "pages/HRdata/EmployeeGroup/EmployeeGroup"
import EmployeeMaster from "pages/HRdata/EmployeeMaster/EmployeeMaster"
import AddEmployeeMaster from "pages/HRdata/EmployeeMaster/AddEmployeeMaster"
import CustomerGroups from "pages/Customers/CustomerGroups/CustomerGroups";
import ProductHierarchy from "pages/Products/ProductHierarchy/ProductHierarchy";
import MaterialType from "pages/Products/MaterialType/MaterialType";
import PurchaseOrder from "pages/PurchaseOrder/PurchaseOrder";
import MaterialGroup from "pages/Products/MaterialGroup/MaterialGroup";
import CreatePurchaseOrder from "pages/PurchaseOrder/CreatePurchaseOrder";
import UnitOfMeasure from "pages/Products/UOMs/UnitOfMeasure";
import Products from "pages/Products/Products/Products";
import AddProducts from "pages/Products/Products/AddProducts";
import workingCalender from "pages/HRdata/WorkingCalender/WorkingCalender";
import CurrencyConversions from "pages/GeneralMaster/CurrencyConversions/CurrencyConversions";
import Admin from "pages/GeneralMaster/Admin/Admin";
import AddAdmin from "pages/GeneralMaster/Admin/AddAdmin";
import Cities from "pages/GeneralMaster/CityMaster/Cities";
import CostCenter from "pages/GeneralMaster/CostCenter/CostCenter";
import GLAccount from "pages/GeneralMaster/GLAccount/GLAccount";
import AdminGroups from "pages/GeneralMaster/AdminGroups/AdminGroups";
import SalesGroup from "pages/Customers/SalesGroup/SalesGroup";
import SalesOffice from "pages/Customers/SalesOffice/SalesOffice";
import SalesOrganisation from "pages/Customers/SalesOrganisation/SalesOrganisation";
import HSNSACcode from "pages/Products/HSNSACcode/HsnSaccode";
import PrItem from "pages/GeneralMaster/PRitem/PrItem";
import DepartmentPermission from "pages/GeneralMaster/DepartmentPermission/DepartmentPermission";
import PrDocType from "pages/GeneralMaster/PRdocType/PrDocType";
import PoDocType from "pages/GeneralMaster/POdocType/PoDocType";
import ASN from "pages/ASN/ASN";
import TechnicalParameters from "pages/Products/TechnicalParameters/TechnicalParameters";
import rfq from "pages/RFQ/rfq";
import siteSetting from "pages/SiteSetting/SiteSetting";
import approvalrequest from "pages/ApprovalRequest/approvalRequest";


// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"
import ASNdocType from "pages/GeneralMaster/ASNdocType/ASNdoctype";
import createAsn from "pages/ASN/createASN";
import GoodReceipt from "pages/GRN/GoodReceipt/GoodReceipt";
import QualityCheck from "pages/GRN/QualityCheck/QualityCheck";
import createRFQ from "pages/RFQ/createRFQ";
import rfqDetail from "pages/RFQ/rfqDetail";
import TechnicalParametersSet from "pages/Products/TechnicalParametersSet/TechnicalParametersSet";
import RFQdocType from "pages/GeneralMaster/RFQdocType/RFQdoctype";


// Dashboard
import Dashboard from "../pages/Dashboard/index"
import VenDashboard from "pages/VendorDashboard/index";
import GRNdocType from "pages/GeneralMaster/GRNdocType/GRNdoctype";
import createGoodReceipt from "pages/GRN/GoodReceipt/createGoodReceipt";
import GateEntry from "pages/GateEntry/gateEntry";
import createGateEntry from "pages/GateEntry/createGateEntry";
import GateEntryDocType from "pages/Vendors/GateEntryDocType/GateEntryDocType";
import QualityCheckList from "pages/GRN/QualityCheck/QualityCheckList";
import InvoiceDetail from "pages/Invoice/InvoiceDetail";
import CreateInvoice from "pages/Invoice/CreateInvoice";
import InvoiceList from "pages/Invoice/InvoiceList";
import VendorDetail from "pages/Vendors/Vendors/VendorDetail";
import VendorDashboard from "pages/VendorDashboard/index";
import PageNotFound from "pages/PageNotFound/pageNotFound";
import DefectiveMaster from "pages/NPL/DefectiveMaster/DefectiveMaster";
import DefectiveParameter from "pages/NPL/DefectiveParameter/DefectiveParameter";
import CreateSalesOrder from "pages/SalesOrderMaster/CreateSalesOrder";
import SalesOrderMaster from "pages/SalesOrderMaster/SalesOrderMaster";
import SalesOrderDocType from "pages/SalesOrderMaster/SalesOrderDocType";
import InquiryItemCategory from "pages/GeneralMaster/ItemCategory/InquiryItemCategories";
import SalesDistricts from "pages/GeneralMaster/SalesDistricts/SalesDistricts";
import GroupCreation from "pages/AccountingMasters/GroupCreation/GroupCreation";
import bank from "pages/AccountingMasters/Banking/bank";
import GSTRegistration from "pages/StatutoryMasters/GSTRegistration/GstRegistration";
import voucherTypes from "pages/AccountingMasters/VoucherTypes/voucherTypes";
import GSTClassification from "pages/StatutoryMasters/GST Classification/GstClassification";
import InvoiceModal from "components/Common/InvoiceModal";
import DirectPurchaseOrder from "pages/PurchaseOrder/DirectPurchaseOrder";

import TallyTaxInvoice from "../components/InvoiceFormat"

const userRoutes = [
  { path: "/profile", component: UserProfile, role: "both" },
  { path: "/dashboard", component: Dashboard , role: "user"},
  { path: "/invoice-format", component: TallyTaxInvoice , role: "user"},
 
  //Master Routes
  { path: "/master/department", component: Department, role: "user" },
  { path: "/master/language", component: Language , role: "user"},
  { path: "/master/country", component: Country , role: "user"},
  { path: "/master/states", component: State , role: "user"},
  { path: "/master/designation", component: Designation , role: "user"},
  { path: "/master/distribution", component: Distribution , role: "user"},
  { path: "/master/currency", component: Currency , role: "user"},
  { path: "/master/company_legal_entity", component: CompanyLegalEntity, role: "user" },
  { path: "/master/currency_conversions", component: CurrencyConversions , role: "user"},
  { path: "/master/admins", component: Admin , role: "user"},
  { path: "/master/admins/add", component: AddAdmin , role: "user"},
  { path: "/master/admins/edit", component: AddAdmin , role: "user"},
  { path: "/master/cities", component: Cities , role: "user"},
  { path: "/master/admin_groups", component: AdminGroups , role: "user"},
  { path: "/master/pritem", component: PrItem , role: "user"},
  { path: "/master/prdoctype", component: PrDocType , role: "user"},
  { path: "/master/podoctype", component: PoDocType , role: "user"},
  { path: "/master/departmentPermission", component: DepartmentPermission , role: "user"},
  { path: "/master/asndoctype", component: ASNdocType , role: "user"},
  { path: "/sales_orders/doc_type", component: SalesOrderDocType , role: "user"},
  { path: "/products/rfqdoctype", component: RFQdocType , role: "user"},
  { path: "/master/item_category", component: InquiryItemCategory , role: "user"},

  //Vendor Routes
  { path: "/vendor/vendor", component: Vendors , role: "user"},
  { path: "/vendor/add", component: AddVendor , role: "user"},
  { path: "/vendor/edit", component: AddVendor , role: "user"},
  { path: "/vendor/revenue_indicator", component: RevenueIndicator , role: "user"},
  { path: "/vendor/account_groups", component: AccountGroups , role: "user"},
  { path: "/vendor/location_code", component: LocationCodes , role: "user"},
  { path: "/vendor/withholding_tax_type", component: WithHoldingTaxType , role: "user"},
  { path: "/vendor/vendor_groups", component: VendorGroups , role: "user"},
  { path: "/vendor/tax_indicator", component: TaxIndicator, role: "user" },
  { path: "/vendor/inco_terms", component: IncoTerm , role: "user"},
  { path: "/vendor/payment_terms", component: PaymentTerms, role: "user" , role: "user"},
  { path: "/vendor/purchase_groups", component: PurchaseGroups, role: "user" },
  { path: "/vendor/purchase_orgs", component: PurchaseOrganisation , role: "user"},  
  { path: "/vendor/gate_entry_doctype", component: GateEntryDocType, role: "user"}, 

  // HR DATA
  { path: "/hrdata/employee_group", component: EmployeeGroup, role: "user" },
  { path: "/hrdata/employee_master", component: EmployeeMaster , role: "user"},
  { path: "/hrdata/employee_master/add", component: AddEmployeeMaster , role: "user"},
  { path: "/hrdata/employee_master/edit", component: AddEmployeeMaster , role: "user"},
  { path: "/hrdata/working_calender", component: workingCalender, role: "user" , role: "user"},

  //products Routes
  { path: "/products/products", component: Products , role: "user"},
  { path: "/products/add", component: AddProducts , role: "user"},
  { path: "/products/edit", component: AddProducts , role: "user"},
  { path: "/products/groups", component: Groups , role: "user"},
  { path: "/products/warehouses", component: Warehouses , role: "user"},
  { path: "/products/uoms", component: UnitOfMeasure , role: "user"},
  { path: "/products/hsn_code", component: HSNSACcode , role: "user"},
  { path: "/products/sac_code", component: HSNSACcode , role: "user"},
  { path: "/products/cost_center", component: CostCenter , role: "user"},
  { path: "/products/profit_center", component: CostCenter , role: "user"},
  { path: "/products/gl_account", component: GLAccount , role: "user"},
  { path: "/products/technical_parameters", component: TechnicalParameters , role: "user"},
  { path: "/products/technical_parameters_set", component: TechnicalParametersSet , role: "user"},
  { path: "/products/grn_doc_type", component: GRNdocType , role: "user"},

  //Purchase Request
  { path: "/purchase_request", component: PurchaseRequest , role: "user"},
  { path: "/purchase_request/create", component: createPR , role: "user"},
  { path: "/purchase_request/edit", component: createPR , role: "user"},

  // RFQ
  { path: "/rfq", component: rfq , role: "user"},
  { path: "/rfq/create_rfq", component: createRFQ , role: "user"},
  { path: "/rfq/rfq_details", component: rfqDetail , role: "user"},

  // Purchase Order
  { path: "/purchase_order", component: PurchaseOrder , role: "user"},
  { path: "/sales_orders/create", component: CreateSalesOrder , role: "user"},
  { path: "/purchase_order/create_po", component: CreatePurchaseOrder , role: "user"},
  { path: "/purchase_order/create_direct_po", component: DirectPurchaseOrder , role: "user"},

  // Sales Order
  { path: "/sales_order", component: SalesOrderMaster , role: "user"},

  // ASN
  { path: "/asn", component: ASN , role: "user"},

  // GRN
  { path: "/grn/good_receipt", component: GoodReceipt, role: "user" },
  { path: "/grn/good_receipt/create_good_receipt", component: createGoodReceipt, role: "user" },
  { path: "/grn/quality_check_list", component: QualityCheckList, role: "user" },
  { path: "/grn/quality_check", component: QualityCheck , role: "user"},

  // Invoice

  { path: "/detail_invoices", component: InvoiceDetail , role: "user"},
  { path: "/create_invoice", component: CreateInvoice, role: "user" },
   { path: "/list_invoices", component: InvoiceList, role: "user" },

   // Invoice Master
   { path: "/Invoice/:type", component: InvoiceModal , role: "user"},
  
  // Gate Entry

  { path : "/gate_entry", component: GateEntry , role: "user"},
  { path : "/gate_entry/create_gate_entry", component: createGateEntry , role: "user"},

   // Site Settings

   { path : "/site_setting", component: siteSetting , role: "user"},

    // Site Settings

    { path : "/approval_request", component: approvalrequest, role: "user" },
  // Products
  { path: "/products/product_hierarchy", component: ProductHierarchy, role: "user" },
  { path: "/products/material_type", component: MaterialType , role: "user"},
  { path: "/products/material_group", component: MaterialGroup , role: "user"},
  // Customers
  { path: "/customers/customer_groups", component: CustomerGroups , role: "user"},
  { path: "/customers/account_groups", component: AccountGroups , role: "user"},
  { path: "/customers/customers", component: Customers , role: "user"},
  { path: "/customers/add", component: AddCustomers , role: "user"},
  { path: "/customers/edit", component: AddCustomers , role: "user"},
  { path: "/customers/location_code", component: LocationCodes , role: "user"},
  { path: "/customers/tax_indicator", component: TaxIndicator, role: "user" },
  { path: "/customers/revenue_indicator", component: RevenueIndicator, role: "user" , role: "user"},
  { path: "/customers/inco_terms", component: IncoTerm , role: "user"},
  { path: "/customers/sales_group", component: SalesGroup , role: "user"},
  { path: "/customers/sales_office", component: SalesOffice , role: "user"},
  { path: "/customers/sales_organisation", component: SalesOrganisation , role: "user"},
  { path: "/customers/sales_districts", component: SalesDistricts , role: "user"},
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  // { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> }

  // Accounting Masters
  { path: "/accounting/group", component: GroupCreation , role: "user"},
  { path: "/accounting/banking", component: bank, role: "user" },
  { path: "/accounting/voucher_types", component: voucherTypes , role: "user" },

  // Statutory Masters
  { path: "/statutory/gst_registration", component: GSTRegistration , role: "user"},
  { path: "/statutory/gst_classification", component: GSTClassification , role: "user"},
]

const vendorRoutes = [
  { path: "/vendor/dashboard", component: VendorDashboard,role:"vendor" },
  { path: "/vendor/detail", component: VendorDetail,role:"vendor"},
  { path: "/asn/create_asn", component: createAsn ,role:"vendor"},
  { path: "/profile", component: UserProfile, role: "both" },
  { path: "*", component: PageNotFound, role: "both"},
]

const authProtectedRoutes = [ ...userRoutes , ...vendorRoutes ]




const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
  // nkpl route
  { path: "/defective-master", component: DefectiveMaster },
  { path: "/defective-parameter", component: DefectiveParameter },
];


export { authProtectedRoutes, publicRoutes }
