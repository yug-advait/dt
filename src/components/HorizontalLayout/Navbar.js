import React, { Component } from "react";
import PropTypes from "prop-types";
import { Collapse } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import classname from "classnames";

//i18n
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissionList: 0,
      login_as: "",
      prPermission: "",
      poPermission: "",
      soPermission: "",
      asnPermission: "",
      gateEnteryPermission: "",
      grnPermission: "",
      rfqPermission: "",
    };
  }

  componentDidMount() {
    const userData = getUserData();
    const permissions = userData?.permissionList.filter(
      permission =>
        permission.sub_menu_name === "pr" ||
        permission.sub_menu_name === "po" ||
        permission.sub_menu_name === "so" ||
        permission.sub_menu_name === "asn" ||
        permission.sub_menu_name === "grn" ||
        permission.sub_menu_name === "rfq" ||
        permission.sub_menu_name === "gate_entry"
    );

    const prPermission = permissions.find(
      permission => permission.sub_menu_name === "pr"
    );
    const poPermission = permissions.find(
      permission => permission.sub_menu_name === "po"
    );
    const soPermission = permissions.find(
      permission => permission.sub_menu_name === "so"
    );
    const asnPermission = permissions.find(
      permission => permission.sub_menu_name === "asn"
    );
    const gateEnteryPermission = permissions.find(
      permission => permission.sub_menu_name === "gate_entry"
    );
    const grnPermission = permissions.find(
      permission => permission.sub_menu_name === "grn"
    );
    const rfqPermission = permissions.find(
      permission => permission.sub_menu_name === "rfq"
    );
    if (userData) {
      this.setState({
        permissionList: userData?.permissionList.length,
        loginAs: userData?.login_as,
        prPermission: prPermission,
        poPermission: poPermission,
        soPermission: soPermission,
        asnPermission: asnPermission,
        gateEnteryPermission: gateEnteryPermission,
        grnPermission: grnPermission,
        rfqPermission: rfqPermission,
      });
    }

    let matchingMenuItem = null;

    const ul = document.getElementById("navigation");
    const items = ul.getElementsByTagName("a");
    for (let i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

  getUserData = () => {
    const authUser = localStorage.getItem("authUser");
    return authUser ? JSON.parse(authUser) : {};
  };


  componentDidUpdate(preProps, preState) {
    if (preProps.isUpdatePermisson !== this.props.isUpdatePermisson) {
      const userData = this.getUserData();
      const permissions = userData?.permissionList.filter(
        permission =>
          permission.sub_menu_name === "pr" ||
          permission.sub_menu_name === "po" ||
          permission.sub_menu_name === "so" ||
          permission.sub_menu_name === "asn" ||
          permission.sub_menu_name === "grn" ||
          permission.sub_menu_name === "rfq" ||
          permission.sub_menu_name === "gate_entry"
      );

      const prPermission = permissions.find(
        permission => permission.sub_menu_name === "pr"
      );
      const poPermission = permissions.find(
        permission => permission.sub_menu_name === "po"
      );
      const soPermission = permissions.find(
        permission => permission.sub_menu_name === "so"
      );
      const asnPermission = permissions.find(
        permission => permission.sub_menu_name === "asn"
      );
      const gateEnteryPermission = permissions.find(
        permission => permission.sub_menu_name === "gate_entry"
      );
      const grnPermission = permissions.find(
        permission => permission.sub_menu_name === "grn"
      );
      const rfqPermission = permissions.find(
        permission => permission.sub_menu_name === "rfq"
      );
      if (userData) {
        this.setState({
          permissionList: userData?.permissionList.length,
          loginAs: userData?.login_as,
          prPermission: prPermission,
          poPermission: poPermission,
          soPermission: soPermission,
          asnPermission: asnPermission,
          gateEnteryPermission: gateEnteryPermission,
          grnPermission: grnPermission,
          rfqPermission: rfqPermission,
        });
      }
    }
  }

  activateParentDropdown = item => {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      parent2.classList.add("active"); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add("active"); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add("active"); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("active"); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add("active"); // li
            }
          }
        }
      }
    }
    return false;
  };
  isActive = (path) => this.props.location.pathname === path;
  render() {
    return (
      <React.Fragment>
        <div className="topnav">
          <div className="container-fluid">
            <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
              {this.state.permissionList > 0 && (
                <>
                  <Collapse
                    isOpen={this.props.menuOpen}
                    className="navbar-collapse"
                    id="topnav-menu-content"
                  >
                    <ul className="navbar-nav">
                      <li
                        className={classname("nav-item dropdown", {
                          active: this.isActive("/dashboard"),
                        })}
                      >
                        <Link
                          className="nav-link dropdown-toggle arrow-none"
                          to="/dashboard"
                        >
                          <i className="bx bx-home-circle me-2" />
                          {this.props.t("Dashboard")} {this.props.menuOpen}
                        </Link>
                      </li>

                      {this.state.prPermission?.can_list ? (
                        <li
                          className={classname("nav-item dropdown", {
                            active: this.isActive("/purchase_request"),
                          })}
                        >
                          <Link
                            to="/purchase_request"
                            className="nav-link dropdown-toggle arrow-none"
                          >
                            <i className="bx bxs-purchase-tag me-2"></i>
                            {this.props.t("PR")}
                          </Link>
                        </li>
                      ) : null}

                      {this.state.rfqPermission?.can_list ? (
                        <li
                          className={classname("nav-item dropdown", {
                            active: this.isActive("/rfq"),
                          })}
                        >
                          <Link
                            to="/rfq"
                            className="nav-link dropdown-toggle arrow-none"
                          >
                            <i className="mdi mdi-email me-2"></i>
                            {this.props.t("RFQ")}
                          </Link>
                        </li>
                      ) : null}

                      {this.state.poPermission?.can_list ? (
                        <li
                          className={classname("nav-item dropdown", {
                            active: this.isActive("/purchase_order"),
                          })}
                        >
                          <Link
                            to="/purchase_order"
                            className="nav-link dropdown-toggle arrow-none"
                          >
                            <i className="mdi mdi-file-document me-2"></i>
                            {this.props.t("PO")}
                          </Link>
                        </li>
                      ) : null}

                      {this.state.soPermission?.can_list ? (
                        <li
                          className={classname("nav-item dropdown", {
                            active: this.isActive("/sales_order"),
                          })}
                        >
                          <Link
                            to="/sales_order"
                            className="nav-link dropdown-toggle arrow-none"
                          >
                            <i className="mdi mdi-file-document me-2"></i>
                            {this.props.t("SO")}
                          </Link>
                        </li>
                      ) : null}


                      {this.state.asnPermission?.can_list ? (
                        <li
                          className={classname("nav-item dropdown", {
                            active: this.isActive("/asn"),
                          })}
                        >
                          <Link
                            className="nav-link dropdown-toggle arrow-none"
                            to="/asn"
                          >
                            <i className="mdi mdi-truck-check me-2"></i>
                            {this.props.t("ASN")}
                          </Link>
                        </li>
                      ) : null}

                      {this.state.gateEnteryPermission?.can_list ? (
                        <li
                          className={classname("nav-item dropdown", {
                            active: this.isActive("/gate_entry"),
                          })}
                        >
                          <Link
                            className="nav-link dropdown-toggle arrow-none"
                            to="/gate_entry"
                          >
                            <i className="mdi mdi-gate me-2"></i>
                            {this.props.t("Gate Entry")}
                          </Link>
                        </li>
                      ) : null}
                      {this.state.grnPermission?.can_list ? (
                        <li
                          className={classname("nav-item dropdown", {
                            active: this.isActive("/grn/good_receipt"),
                          })}
                        >
                          <Link
                            className="nav-link dropdown-toggle arrow-none"
                            to="/grn/good_receipt"
                          >
                            <i className="mdi mdi-receipt me-2"></i>
                            {this.props.t("GRN")}
                          </Link>
                          <div
                            className={classname("dropdown-menu", {
                              show: this.state.isDashboard,
                            })}
                          >
                            <Link
                              to="/grn/quality_check_list"
                              className="dropdown-item"
                            >
                              {this.props.t("Quality Check")}
                            </Link>
                          </div>
                        </li>
                      ) : null}

                      {/* {this.state.gateEnteryPermission?.can_list ? ( */}
                      {/* <li
                        className={classname("nav-item dropdown", {
                          active: this.isActive("/list_invoices"),
                        })}
                      >
                        <Link
                          className="nav-link dropdown-toggle arrow-none"
                          to="/list_invoices"
                        >
                          <i className="mdi mdi-file-document me-2"></i>
                          {this.props.t("Invoice")}
                        </Link>
                      </li> */}
                      {/* ) : null} */}

                      {/* <li className="nav-item dropdown">
                        <Link
                          className="nav-link dropdown-toggle arrow-none"
                          to="/#"
                        >
                          <i className="mdi mdi-chart-bar me-2"></i>
                          {this.props.t("Reports")}{" "}
                          <div className="arrow-down" />
                        </Link>
                        <div
                          className={classname("dropdown-menu", {
                            show: this.state.isDashboard,
                          })}
                        >
                          <Link to="/#" className="dropdown-item">
                            {this.props.t("- TBD")}
                          </Link>
                        </div>
                      </li> */}

                      <li className="nav-item dropdown">
                        <Link
                          className="nav-link dropdown-toggle arrow-none"
                          to="/site_setting"
                        >
                          <i className="bx bxs-cog me-2"></i>
                          {this.props.t("Site Settings")}
                        </Link>
                      </li>
                    </ul>
                  </Collapse>
                </>
              )}

              {this.state.loginAs == 'vendor' && (
                <>
                  <Collapse
                    isOpen={this.props.menuOpen}
                    className="navbar-collapse"
                    id="topnav-menu-content"
                  >
                    <ul className="navbar-nav">
                      <li
                        className={classname("nav-item dropdown", {
                          active: this.isActive("/vendor/dashboard"),
                        })}
                      >
                        <Link
                          className="nav-link dropdown-toggle arrow-none"
                          to="/vendor/dashboard"
                        >
                          <i className="bx bx-home-circle me-2" />
                          {this.props.t("Dashboard")} {this.props.menuOpen}
                        </Link>
                      </li>

                      <li
                        className={classname("nav-item dropdown", {
                          active: this.isActive("/vendor/detail"),
                        })}
                      >
                        <Link
                          to="/vendor/detail"
                          className="nav-link dropdown-toggle arrow-none"
                        >
                          <i className="bx bxs-purchase-tag me-2"></i>
                          {this.props.t("Vendor Details")}
                        </Link>
                      </li>
                    </ul>
                  </Collapse>
                </>
              )}
            </nav>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Navbar.propTypes = {
  location: PropTypes.object,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = state => {
  const { isUpdatePermisson } = state.Login;

  return { isUpdatePermisson };
};

export default connect(mapStatetoProps, null)(withRouter(withTranslation()(Navbar)));
