import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

const SidebarContent = props => {
  const ref = useRef();
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname;

    const initMenu = () => {
      new MetisMenu("#side-menu");
      let matchingMenuItem = null;
      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname]);

  useEffect(() => {
    ref.current.recalculate();
  });

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>
            <li>
              <Link to="/#">
                <i className="bx bx-home-circle"></i>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>
            <li>
              <Link to="/purchase_request">
                <i className="bx bxs-purchase-tag"></i>
                <span>{props.t("PR ")}</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/#">
                <i className="bx bxs-quote-single-left"></i>
                <span>{props.t("RFQ ")}</span>
              </Link>
            </li> */}
            <li>
              <Link to="/#">
                <i className="bx bxs-purchase-tag"></i>
                <span>{props.t("PO ")}</span>
              </Link>
            </li>
            <li>
              <Link to="/#">
                <i className="bx bxs-ship"></i>
                <span>{props.t("ASN ")}</span>
              </Link>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-box"></i>
                <span>{props.t("GRN ")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/#">{props.t("Gate Entry")}</Link>
                </li>
                <li>
                  <Link to="/#">{props.t("Good Receipt")}</Link>
                </li>
                <li>
                  <Link to="/#">{props.t("Quality Check")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-data"></i>
                <span>{props.t("Masters")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/#">{props.t("Admins")}</Link>
                </li>
                <li>
                  <Link to="/#">{props.t("Admin Groups")}</Link>
                </li>
                <li>
                  <Link to="/master/department">
                    {props.t("Departments")}
                  </Link>
                </li>
                <li>
                  <Link to="/master/designation">
                    {props.t("Designations")}
                  </Link>
                </li>
                <li>
                  <Link to="/master/language">
                    {props.t("Languages")}
                  </Link>
                </li>
                <li>
                  <Link to="/master/country">{props.t("Countries")}</Link>
                </li>
                <li>
                  <Link to="/master/states">{props.t("States")}</Link>
                </li>
                <li>
                  <Link to="/#">{props.t("Cities")}</Link>
                </li>
                <li>
                  <Link to="/master/company_legal_entity">{props.t("Company Legal Entities")}</Link>
                </li>
                <li>
                  <Link to="/master/distribution">{props.t("Distribution Methods")}</Link>
                </li>
                <li>
                  <Link to="/master/currency">{props.t("Currencies")}</Link>
                </li>
                <li>
                  <Link to="/#">{props.t("Currency Conversions")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-cube"></i>
                <span>{props.t("Products")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/#">{props.t("UOMs")}</Link>
                </li>
                <li>
                  <Link to="/#">{props.t("Material Types")}</Link>
                </li>
                <li>
                  <Link to="/#">
                    {props.t("Material Groups")}
                  </Link>
                </li>
                <li>
                  <Link to="/#">
                    {props.t("Products ")}
                  </Link>
                </li>
                <li>
                  <Link to="/products/groups">{props.t("Product Groups")}</Link>
                </li>
                <li>
                  <Link to="/#">{props.t("Product Hierarchy")}</Link>
                </li>
                <li>
                  <Link to="/products/warehouses">{props.t("Warehouses")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-building"></i>
                <span>{props.t("Vendors")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/vendor/vendor">{props.t("Vendors")}</Link>
                </li>
                <li>
                  <Link to="/vendor/account_groups">{props.t("Account Groups")}</Link>
                </li>
                <li>
                  <Link to="/vendor/location_code"> {props.t("Location Codes")}</Link>
                </li>
                <li>
                  <Link to="/vendor/tax_indicator"> {props.t("Tax Indicators ")}</Link>
                </li>
                <li>
                  <Link to="/vendor/vendor_groups">{props.t("Vendor Groups")}</Link>
                </li>
                <li>
                  <Link to="/vendor/revenue_indicator">{props.t("Revenue Indicators")}</Link>
                </li>
                <li>
                  <Link to="/vendor/inco_terms">{props.t("Inco Terms")}</Link>
                </li>
                <li>
                  <Link to="/vendor/payment_terms">{props.t("Payment Terms")}</Link>
                </li>
                <li>
                  <Link to="/vendor/purchase_groups">{props.t("Purchase Group")}</Link>
                </li>
                <li>
                  <Link to="/vendor/purchase_orgs">{props.t("Purchase Organisation")}</Link>
                </li>
                <li>
                  <Link to="/vendor/withholding_tax_type">{props.t("Withholding Taxes")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-user"></i>
                <span>{props.t("Customers")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/#">{props.t("Customers")}</Link>
                </li>
                <li>
                  <Link to="/#">{props.t("Account Groups")}</Link>
                </li>
                <li>
                  <Link to="/#"> {props.t("Location Codes")}</Link>
                </li>
                <li>
                  <Link to="/#"> {props.t("Tax Indicators ")}</Link>
                </li>
                <li>
                  <Link to="/customers/customer_groups">{props.t("Customer Groups")}</Link>
                </li>
                <li>
                  <Link to="/#">{props.t("Revenue Indicators")}</Link>
                </li>
                <li>
                  <Link to="/#">{props.t("Withholding Taxes")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-id-card"></i>
                <span>{props.t("HR Data")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/#">{props.t("Employee Master")}</Link>
                </li>
                <li>
                  <Link to="/hrdata/employee_group">{props.t("Employee Group")}</Link>
                </li>
                <li>
                  <Link to="/#"> {props.t("Working Calendar")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-report"></i>
                <span>{props.t("Reports")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/#">{props.t("- TBD")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-cog"></i>
                <span>{props.t("Site Settings")}</span>
              </Link>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
