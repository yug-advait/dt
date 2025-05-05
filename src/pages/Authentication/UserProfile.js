import PropTypes from "prop-types";
import React, { Component } from "react";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import "./userprofile.css";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import avatar from "../../assets/images/users/avatar-1.png";
// actions
import { editProfile, resetProfileFlag } from "../../store/actions";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      functionName: "",
      fullName: "",
      timeZone: "",
      mobile: "",
      language_description: "",
      salesOrganisation: "",
      address: "",
      pincode: "",
      company_name: "",
      city: "",
      employee_code: "",
      max_price_band: 0,
      department: "",
      userGroup: "",
      division: "",
      distribution: "",
      idx: 1,
      showDetails: true,
      login_as: "", // State to control visibility of user details
    };
  }

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  componentDidMount() {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      const loginAs = obj.login_as || ""; // Retrieve the login_as value
      this.setState({
        login_as: loginAs,
        fullName: `${obj?.user?.title} ${loginAs == "vendor" ? obj?.user?.firstname : obj?.user?.first_name
          } ${loginAs == "vendor" ? obj?.user?.lastname : obj?.user?.last_name
          }`,
        email: obj?.user?.email_id,
        idx: obj.uid,
        firstName: loginAs == "vendor" ? obj?.user?.firstname : obj?.user?.first_name,
        lastName: obj?.user?.last_name,
        vendor_code:obj?.user?.vendor_code,
        functionName: obj?.user?.function_name,
        timeZone: obj?.user?.time_zone,
        mobile: obj?.user?.mobile,
        language_description: obj?.user?.language_description,
        salesOrganisation: obj?.user?.sales_organisation,
        address: obj?.user?.address_data_1,
        pincode: obj?.user?.pincode,
        company_name: obj?.user?.company_name,
        city: obj?.user?.city,
        employee_code: obj?.user?.employee_code,
        max_price_band: obj?.user?.max_price_band,
        department: obj?.user?.department_code,
        userGroup: obj?.user?.user_group_name,
        division: obj?.user?.division_code,
        distribution: obj?.user?.distribution_code,
      });
    }
  }

  // componentDidMount() {
  //   if (localStorage.getItem("authUser")) {
  //     const obj = JSON.parse(localStorage.getItem("authUser"));
  //     if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
  //       this.setState({
  //         fullName: `${obj.fullName}`,
  //         email: obj.email,
  //         idx: obj.uid,
  //       });
  //     } else if (
  //       process.env.REACT_APP_DEFAULTAUTH === "fake" ||
  //       process.env.REACT_APP_DEFAULTAUTH === "jwt"
  //     ) {
  //       this.setState({
  //         fullName: `${obj?.user?.title} ${
  //           obj.login_as == "vendor"
  //             ? obj?.user?.firstname
  //             : obj?.user?.first_name
  //         } ${
  //           obj.login_as == "vendor"
  //             ? obj?.user?.lastname
  //             : obj?.user?.last_name
  //         }`,
  //         email: obj?.user?.email_id,
  //         idx: obj.uid,
  //         firstName:
  //           obj.login_as == "vendor"
  //             ? obj?.user?.firstname
  //             : obj?.user?.first_name,
  //         lastName: obj?.user?.last_name,
  //         functionName: obj?.user?.function_name,
  //         timeZone: obj?.user?.time_zone,
  //         mobile: obj?.user?.mobile,
  //         language_description: obj?.user?.language_description,
  //         salesOrganisation: obj?.user?.sales_organisation,
  //         address: obj?.user?.address_data_1,
  //         pincode: obj?.user?.pincode,
  //         company_name: obj?.user?.company_name,
  //         city: obj?.user?.city,
  //         employee_code: obj?.user?.employee_code,
  //         max_price_band: obj?.user?.max_price_band,
  //         department: obj?.user?.department_code,
  //         userGroup: obj?.user?.user_group_name,
  //         division: obj?.user?.division_code,
  //         distribution: obj?.user?.distribution_code,
  //       });
  //     }
  //   }
  // }

  render() {
    const { showDetails, login_as } = this.state; // Destructure state

    return (
      <React.Fragment>
        <div className="page-content">
          <Container>
            {/* Render Breadcrumb */}
            <Breadcrumb titlePath="#" title="Detergent" breadcrumbItem="Profile" />
            <Row>
              <Col lg="12">
                <Card
                  className="user-details-card"
                  style={{
                    borderRadius: "10px",
                    boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <CardBody>
                    <div
                      className="d-flex align-items-center p-3"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                      }}
                    >
                      <div className="me-3">
                        <img
                          src={avatar}
                          alt="User Avatar"
                          className="avatar-md rounded-circle img-thumbnail"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="align-self-center flex-1">
                        <div className="text-muted">
                          <h5
                            className="mb-2"
                            style={{ fontWeight: "bold", color: "#333" }}
                          >
                            {this?.state?.fullName}
                          </h5>
                          <p className="mb-1" style={{ fontSize: "14px" }}>
                            {this?.state?.email}
                          </p>
                          <p className="mb-1" style={{ fontSize: "14px" }}>
                            {this?.state?.employee_code}
                          </p>
                          <p className="mb-0" style={{ fontSize: "14px" }}>
                            Max Price Band: {this?.state?.max_price_band}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <div className="align-self-center text-center">
              <strong className="card-title mb-4 text-center fs-3">

                User Details

              </strong>
              {/* <Button
                color="link"
                className="text-primary btn-lg"
                style={{
                  fontSize: "24px",
                  lineHeight: "1.5",
                  marginBottom: "8px",
                }}
                onClick={this.toggleDetails}
              >
                <i
                  className={`mdi ${showDetails ? "mdi-chevron-up" : "mdi-chevron-down"
                    }`}
                  style={{ fontSize: "24px" }}
                ></i>
              </Button> */}
            </div>
            {showDetails && (
              <Container className="user-details-container" fluid>
                <Card className="user-details-card">
                  <CardBody>
                    <Row>
                      <Col md="4" className="user-details-col">
                        <div className="user-detail-item">
                          <strong>First Name :</strong> {this?.state?.firstName}
                        </div>
                        <div className="user-detail-item">
                          <strong>Last Name :</strong> {this?.state?.lastName}
                        </div>
                        <div className="user-detail-item">
                          <strong>Mobile :</strong> {this?.state?.mobile}
                        </div>
                      </Col>
                      <Col md="4" className="user-details-col">
                        <div className="user-detail-item">
                          <strong>Company :</strong> {this?.state?.company_name}
                        </div>
                        <div className="user-detail-item">
                          <strong>Pincode :</strong> {this?.state?.pincode}
                        </div>
                        <div className="user-detail-item">
                          <strong>City :</strong> {this?.state?.city}
                        </div>
                      </Col>
                      <Col md="4" className="user-details-col">
                        <div className="user-detail-item">
                          <strong>Country :</strong> India
                        </div>
                        <div className="user-detail-item">
                          <strong>State :</strong> Gujarat
                        </div>
                        {login_as !== "vendor" && (
                          <div className="user-detail-item">
                            <strong>Address :</strong> {this?.state?.address}
                          </div>
                        )}{login_as == "vendor" && (
                          <div className="user-detail-item">
                            <strong>Vendor Code :</strong> {this?.state?.vendor_code}
                          </div>
                        )}
                      </Col>
                    </Row>

                    <Row>

                      <Col md="4" className="user-details-col">
                        {login_as !== "vendor" && (
                          <>
                            <div className="user-detail-item">
                              <strong>Function Name :</strong> {this?.state?.functionName}
                            </div>
                            <div className="user-detail-item">
                              <strong>Department :</strong> {this?.state?.department}
                            </div>
                            <div className="user-detail-item">
                              <strong>Timezone :</strong> {this?.state?.timeZone}
                            </div>
                          </>
                        )}
                      </Col>
                      <Col md="4" className="user-details-col">
                        {login_as !== "vendor" && (
                          <>
                            <div className="user-detail-item">
                              <strong>Sales Organisation :</strong> {this?.state?.salesOrganisation}
                            </div>
                            <div className="user-detail-item">
                              <strong>Language :</strong> {this?.state?.language_description}
                            </div>
                            <div className="user-detail-item">
                              <strong>User Group :</strong> {this?.state?.userGroup}
                            </div>
                          </>
                        )}
                      </Col>

                      <Col md="4" className="user-details-col">
                        {login_as !== "vendor" && (
                          <>
                            <div className="user-detail-item">
                              <strong>Division :</strong> {this?.state?.division}
                            </div>
                            <div className="user-detail-item">
                              <strong>Distribution :</strong> {this?.state?.distribution}
                            </div>
                          </>
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Container>


            )}
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

UserProfile.propTypes = {
  editProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  resetProfileFlag: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { editProfile, resetProfileFlag })(UserProfile)
);
