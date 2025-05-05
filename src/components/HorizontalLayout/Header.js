import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { withTranslation } from "react-i18next";
import "react-drawer/lib/react-drawer.css";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import megamenuImg from "../../assets/images/megamenu-img.png";
import logo from "../../assets/images/logo.svg";
import logoLight from "../../assets/images/logo-light.png";
import logoDark from "../../assets/images/logo-dark.png";
import NavyugLogo from "../../assets/images/navyugIcon.png";

import { toggleRightSidebar } from "../../store/actions";

class Header extends Component {
  state = {
    isSearch: false,
    permissionList: [],
    open: false,
    position: "right",
    megaMenuDrp: false,
  };

  getDashboardPath = () => {
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      const { login_as } = JSON.parse(authUser);
      if (login_as === "user") {
        return "/dashboard";
      } else if (login_as === "vendor") {
        return "/vendor/dashboard";
      } 
    }
    return "/";
  }

  toggleSearch = () => this.setState({ isSearch: !this.state.isSearch });

  toggleMenu = () => this.props.openLeftMenuCallBack();

  toggleRightbar = () => this.props.toggleRightSidebar();

  toggleFullscreen = () => {
    const doc = document.documentElement;
    if (!document.fullscreenElement) {
      doc.requestFullscreen?.() ||
        doc.mozRequestFullScreen?.() ||
        doc.webkitRequestFullscreen?.(Element.ALLOW_KEYBOARD_INPUT);
    } else {
      document.exitFullscreen?.() ||
        document.mozCancelFullScreen?.() ||
        document.webkitCancelFullScreen?.();
    }
  };

  getUserData = () => {
    const authUser = localStorage.getItem("authUser");
    return authUser ? JSON.parse(authUser) : {};
  };

  componentDidMount() {
    const userData = this.getUserData();
    if (userData) {
      this.setState({ permissionList: userData?.permissionList || [] });
    }
  }
  

  componentDidUpdate(preProps,preState){
    if(preProps.isUpdatePermisson !== this.props.isUpdatePermisson){
      const userData = this.getUserData();
      if (userData) {
        this.setState({ permissionList: userData?.permissionList || [] });
      }
    }
  }

  renderMegaMenuList = () => {
    const { permissionList } = this.state;
    const { t } = this.props;

    // Define the allowed menu names
    const allowedMenuNames = ["masters", "products", "vendors", "customers","hr_data", "accounting_master", "inventory_master",
      "statutory_master", "statutory_details"];

    // Filter the permissions based on allowed menu names and the `can_list` flag
    const filteredPermissions = permissionList.filter(
      permission =>
        allowedMenuNames.includes(permission.menu_name) && permission.can_list
    );

    // If no permissions exist, return null
    if (!filteredPermissions.length) return null;

    return (
      <DropdownToggle className="btn header-item" caret tag="button"   
      style={{ paddingLeft: '50px' }}
      >
        {t("Mega Menu")} <i className="mdi mdi-chevron-down" />
      </DropdownToggle>
    );
  };

  renderMenuList = (menuName, label) => {
    const { permissionList } = this.state;
    const { t } = this.props;
    const filteredPermissions = permissionList.filter(
      permission => permission.menu_name === menuName && permission.can_list
    );
    if (!filteredPermissions.length) return null;

    return (
      <>
        <Col md={3}>
          <h5 className="font-size-14 mt-0">{t(label)}</h5>
          <ul className="list-unstyled megamenu-list">
            {filteredPermissions.map((permission, index) => (
              <li key={index}>
                <Link to={permission.link}>{t(permission.sub_menu_label)}</Link>
              </li>
            ))}
          </ul>
        </Col>
        {/* {menuName == "hr_data" ? (
          <Col sm={3}>
            <div style={{ height: "220px", width: "230px" }}>
               <img
                src={megamenuImg}
                alt=""
                className="img-fluid mx-auto d-block"
              /> 
            </div>
          </Col>
        ) : null} */}
      </>
    );
  };
  

  render() {
    const { isSearch, megaMenuDrp, permissionList } = this.state;
    const { t } = this.props;

    return (
      <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box me-5">
              <Link to={this.getDashboardPath()} className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={NavyugLogo} alt="logo" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={NavyugLogo} alt="logo-dark" height="17" />
                  </span>
                </Link>
                <Link to={this.getDashboardPath()} className="logo logo-light">
                  <span className="logo-sm">
                    <img src={NavyugLogo} alt="Advait logo" height="65" />
                  </span>
                  <span className="logo-lg">
                    <img src={NavyugLogo} alt="logo-light" height="19" />
                  </span>
                </Link>
              </div>

              <button
                type="button"
                className="btn btn-sm px-4 font-size-16 d-lg-none header-item"
                onClick={this.toggleMenu}
              >
                <i className="fa fa-fw fa-bars" />
              </button>

              <form className="app-search d-none d-lg-block ms-2">
                <div className="position-relative">
                  {/* <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                  /> */}
                  <span className="bx bx-search-alt" />
                </div>
              </form>

              <Dropdown
                className="dropdown-mega d-none d-lg-block ms-2"
                isOpen={megaMenuDrp}
                toggle={() => this.setState({ megaMenuDrp: !megaMenuDrp })}
              >
                {this.renderMegaMenuList()}
                <DropdownMenu className="dropdown-menu dropdown-megamenu">
                  <Row>
                    <Col sm={8}>
                      <Row>
                        {this.renderMenuList("masters", "Masters")}
                        {this.renderMenuList("products", "Products")}
                        {this.renderMenuList("vendors", "Vendors")}
                        {this.renderMenuList("customers", "Customers")}
                      </Row>
                    </Col>
                    <Col sm={4}>
                      <Row>
                      {this.renderMenuList("hr_data", "HR Data")}
                      {/* {this.renderMenuList("accounting_master", "Accounting Master")}
                      {this.renderMenuList("inventory_master", "Inventory Master")} */}
                      {this.renderMenuList("statutory_master", "Statutory Master")}
                      {/* {this.renderMenuList("statutory_details", "Statutory Details")} */}
                      </Row>
                    </Col>
                  </Row>
                </DropdownMenu>
              </Dropdown>
            </div>

            <div className="d-flex">
              <div className="dropdown d-inline-block d-lg-none ms-2">
                <button
                  type="button"
                  className="btn header-item noti-icon"
                  onClick={this.toggleSearch}
                >
                  <i className="mdi mdi-magnify" />
                </button>
                {isSearch && (
                  <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show">
                    <form className="p-3">
                      <div className="form-group m-0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`${t("Search")}...`}
                          />
                          <div className="input-group-append">
                            <button className="btn-custom-theme" type="submit">
                              <i className="mdi mdi-magnify" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              <div className="dropdown d-inline-block d-lg-inline-block ms-1">
                <button
                  type="button"
                  className="btn header-item noti-icon"
                  onClick={this.toggleFullscreen}
                >
                  <i className="bx bx-fullscreen" />
                </button>
              </div>

              {/* <NotificationDropdown /> */}

              <ProfileMenu />

              <div className="dropdown d-inline-block">
                <button
                  onClick={this.toggleRightbar}
                  type="button"
                  className="btn header-item noti-icon right-bar-toggle"
                >
                  <i className="bx bx-cog bx-spin" />
                </button>
              </div>
            </div>
          </div>
        </header>
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  openLeftMenuCallBack: PropTypes.func,
  t: PropTypes.any,
  toggleRightSidebar: PropTypes.func,
};

const mapStatetoProps = state => {
  const { layoutType } = state.Layout;
  const { isUpdatePermisson } = state.Login;
  return { layoutType,isUpdatePermisson };
};

export default connect(mapStatetoProps, { toggleRightSidebar })(
  withTranslation()(Header)
);
