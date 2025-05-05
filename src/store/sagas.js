import { all, fork } from "redux-saga/effects"

//public
// import AccountSaga from "./auth/register/saga"
import AuthSaga from "./auth/login/saga"
// import ForgetSaga from "./auth/forgetpwd/saga"
import ProfileSaga from "./auth/profile/saga"
import LayoutSaga from "./layout/saga"
import {commonAllSaga} from "./common/saga"
import {departmentAllSaga} from "./department/saga"
import {countriesAllSaga} from "./country/saga"
import {statesAllSaga} from "./state/saga"
import {languageAllSaga } from "./language/saga"
import {designationAllSaga } from "./designation/saga"
import {distributionAllSaga } from "./distribution/saga"
import {productGroupsAllSaga } from "./productGroups/saga"
import {currencyAllSaga } from "./currency/saga"
import {companyLegalEntityAllSaga } from "./companyLegalEntity/saga" 
import {revenueIndicatorAllSaga } from "./revenueIndicator/saga"
import { accountGroupsAllSaga } from "./accountGroups/saga"
import { WarehousesAllSaga } from "./warehouses/saga"
import { locationcodesAllSaga } from "./locationCodes/saga"
import { withHoldingTaxTypeAllSaga } from "./withholdingTaxType/saga"
import {TaxIndicatorAllSaga} from "./taxIndicator/saga"
import {VendorGroupsAllSaga} from "./vendorGroups/saga"
import {VendorAllSaga} from "./vendor/saga"
import { incoTermsAllSaga } from "./incoTerms/saga"
import { paymentTermsAllSaga } from "./paymentTerms/saga"
import { purchaseGroupsAllSaga } from "./purchaseGroups/saga"
import { purchaseOrganisationAllSaga } from "./purchaseOrganisation/saga"
import { employeeGroupAllSaga } from "./employeeGroup/saga"
import { employeeMasterAllSaga } from "./employeeMaster/saga"
import { customerGroupsAllSaga } from "./customerGroups/saga"
import { productHierarchyAllSaga } from "./productHierarchy/saga"
import { materialTypeAllSaga } from "./materialType/saga"
import { materialGroupAllSaga } from "./materialGroup/saga"
import { unitOfMeasureAllSaga } from "./unitOfMeasure/saga"
import { customersAllSaga } from "./customers/saga"
import { workingCalenderAllSaga } from "./workingCalender/saga"
import { productsAllSaga } from "./products/saga"
import { currencyConversionsAllSaga } from "./currencyConversions/saga"
import { adminsAllSaga } from "./admins/saga"
import { citiesAllSaga } from "./cities/saga"
import { glAccountAllSaga } from "./glAccount/saga"
import { costcenterAllSaga } from "./costCenter/saga"
import { adminGroupsAllSaga } from "./adminGroups/saga"
import { salesgroupAllSaga } from "./salesGroup/saga"
import { salesOfficeAllSaga } from "./salesOffice/saga"
import { salesorganisationAllSaga } from "./salesOrganisation/saga"
import { hsnsacAllSaga } from "./HsnSaccode/saga"
import { prItemAllSaga } from "./prItem/saga"
import { prDocTypeAllSaga } from "./prDocType/saga"
import { prAllSaga } from "./purchaseRequest/saga"
import { departmentPermissionAllSaga } from "./departmentpermission/saga"
import { poDocTypeAllSaga } from "./poDocType/saga"
import { asnDocTypeAllSaga } from "./asnDocType/saga"
import { grnDocTypeAllSaga } from "./grnDocType/saga"
import { poAllSaga } from "./purchaseOrder/saga"
import { asnAllSaga } from "./ASN/saga"
import { goodReceiptAllSaga } from "./goodReceipt/saga"
import { qualityCheckAllSaga } from "./QualityCheck/saga"
import { technicalParameterAllSaga } from "./technicalParameter/saga"
import { rfqAllSaga } from "./RFQ/saga"
import { siteSettingAllSaga } from "./siteSetting/saga"
import { techSetAllSaga } from "./technicalParameterSet/saga"
import { rfqDocTypeAllSaga } from "./rfqDocType/saga"
import { vendorDashboardAllSaga } from "./vendorDashboard/saga"
import { gateEntryAllSaga } from "./gateEntry/saga"
import { gateEntryDocTypeAllSaga } from "./gateEntryDocType/saga"
import { invoiceAllSaga } from "./invoice/saga"
import { salesOrderAllSaga } from "./salesOrderMaster/saga"
import { salesOrderDocTypeAllSaga } from "./salesOrderDocType/saga"
import { inquiryItemAllSaga } from "./inquiryItemCategory/saga"
import { salesDistrictsAllSaga } from "./salesDistricts/saga"


// import dashboardSaga from "./dashboard/saga";

export default function* rootSaga() {
  yield all([
    fork(AuthSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(commonAllSaga),
    fork(departmentAllSaga),
    fork(languageAllSaga),
    fork(countriesAllSaga),
    fork(statesAllSaga),
    fork(designationAllSaga),
    fork(distributionAllSaga),
    fork(productGroupsAllSaga),
    fork(currencyAllSaga),
    fork(companyLegalEntityAllSaga),
    fork(revenueIndicatorAllSaga),
    fork(accountGroupsAllSaga),
    fork(WarehousesAllSaga),
    fork(locationcodesAllSaga),
    fork(withHoldingTaxTypeAllSaga),
    fork(TaxIndicatorAllSaga),
    fork(VendorGroupsAllSaga),
    fork(VendorAllSaga),
    fork(incoTermsAllSaga),
    fork(paymentTermsAllSaga),
    fork(purchaseGroupsAllSaga),
    fork(purchaseOrganisationAllSaga),
    fork(employeeGroupAllSaga),
    fork(employeeMasterAllSaga),
    fork(customerGroupsAllSaga),
    fork(productHierarchyAllSaga),
    fork(materialTypeAllSaga),
    fork(materialGroupAllSaga),
    fork(unitOfMeasureAllSaga),
    fork(customersAllSaga),
    fork(workingCalenderAllSaga),
    fork(productsAllSaga),    
    fork(currencyConversionsAllSaga),
    fork(adminsAllSaga),
    fork(citiesAllSaga),
    fork(glAccountAllSaga),
    fork(costcenterAllSaga),
    fork(adminGroupsAllSaga),
    fork(salesgroupAllSaga),
    fork(salesOfficeAllSaga),
    fork(salesorganisationAllSaga),
    fork(salesOrderAllSaga),
    fork(salesOrderDocTypeAllSaga),
    fork(hsnsacAllSaga),
    fork(prItemAllSaga),
    fork(prDocTypeAllSaga),
    fork(prAllSaga),
    fork(departmentPermissionAllSaga),
    fork(poDocTypeAllSaga),
    fork(asnDocTypeAllSaga),
    fork(grnDocTypeAllSaga),
    fork(poAllSaga),
    fork(asnAllSaga),
    fork(goodReceiptAllSaga),
    fork(qualityCheckAllSaga),
    fork(technicalParameterAllSaga),
    fork(rfqAllSaga),
    fork(siteSettingAllSaga),
    fork(techSetAllSaga),
    fork(rfqDocTypeAllSaga),
    fork(vendorDashboardAllSaga),
    fork(gateEntryAllSaga),
    fork(gateEntryDocTypeAllSaga),
    fork(invoiceAllSaga),
    fork(inquiryItemAllSaga),
    fork(salesDistrictsAllSaga),
    // fork(dashboardSaga)
  ])
}
