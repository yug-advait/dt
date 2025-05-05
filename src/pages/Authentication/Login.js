import React, { Component, useEffect } from "react";
import { Alert, Card, CardBody, Col, Container, Row, Label } from "reactstrap";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { apiError, loginUser } from "../../store/actions";
import profile from "../../assets/images/profile-img.png";
import AdvaitLogo from "../../assets/images/navyugIcon.png";
import { encryptData, decryptData } from "../../common/encrypt";
import Loader from "../../components/Common/Loader";

class Login extends Component {
  constructor(props) {
    super(props);
    const encryptedCredentials = localStorage.getItem("rememberMe");
    let rememberedCredentials = {};

    if (encryptedCredentials) {
      try {
        rememberedCredentials = decryptData(encryptedCredentials);
      } catch (error) {
        console.error("Failed to decrypt saved credentials:", error);
      }
    }


    this.state = {
      showPassword: false,
      rememberMe: !!rememberedCredentials.email,
      savedCredentials: rememberedCredentials,
      options: [
        { value: "vendor", label: "Vendor" },
        { value: "user", label: "User" },
      ],
      loading: false, // Added loading state
    };

    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
    this.handleRememberMeChange = this.handleRememberMeChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Reset loading when error changes
    if (this.props.error !== prevProps.error) {
      this.setState({ loading: false });
    }
  }
  togglePasswordVisibility() {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }));
  }


  handleRememberMeChange(event) {
    this.setState({ rememberMe: event.target.checked });
  }

  componentDidMount() {
    document.title = "Detergent | Login";
    this.props.apiError("");

  }

  render() {
    const { showPassword, options, rememberMe, savedCredentials, loading } = this.state;
    return (
      <React.Fragment>
        {loading ? (
          <Loader />
        ) : (
          <div className="account-pages my-2 pt-sm-2">
            <Container>
              <Row
                className="justify-content-center align-items-center"
                style={{ minHeight: "80vh" }}
              >
                <Col md={8} lg={6} xl={5}>
                  <Card className="overflow-hidden">
                    <div className="bg-primary bg-soft">
                      <div className="custom-welcome-section">
                        <Row>
                          <Col className="col-7">
                            <div className="text-primary p-4">
                              <h5 className="text-black">Welcome Back !</h5>
                              <p className="text-black">Sign in to continue to Detergent.</p>
                            </div>
                          </Col>
                          <Col className="col-5 align-self-end">
                            <img src={profile} alt="" className="img-fluid" />
                          </Col>
                        </Row>
                      </div>
                    </div>
                    <CardBody className="pt-0">
                      <div className="auth-logo">
                        <Link to="/" className="auth-logo-light">
                          <div className="avatar-md profile-user-wid mb-2">
                            <span className="avatar-title rounded-circle bg-light">
                              <img
                                src={AdvaitLogo}
                                alt=""
                                className="rounded-circle"
                                height="25"
                              />
                            </span>
                          </div>
                        </Link>
                        <Link to="/" className="auth-logo-dark">
                          <div className="avatar-md profile-user-wid mb-2">
                            <span className="avatar-title rounded-circle bg-light">
                              <img
                                src={AdvaitLogo}
                                alt=""
                                className="rounded-circle"
                                height="40"
                              />
                            </span>
                          </div>
                        </Link>
                      </div>

                      <div className="p-2">
                        {this.props.error && this.props.error ? (
                          <Alert color="danger">
                            {this.props.error?.message}
                          </Alert>
                        ) : null}
                        <Formik
                          enableReinitialize={true}
                          initialValues={{
                            email: savedCredentials.email || "",
                            password: savedCredentials.password || "",
                            // login_as: savedCredentials.login_as || "",
                          }}
                          validationSchema={Yup.object().shape({
                            email: Yup.string().required(
                              "Please Enter Your Email"
                            ),
                            password: Yup.string().required(
                              "Please Enter Valid Password"
                            ),
                            // login_as: Yup.string().required(
                            //   "Please Select a Role"
                            // ),
                          })}
                          onSubmit={values => {
                            if (rememberMe) {
                              const encryptedData = encryptData({
                                email: values.email,
                                password: values.password,
                                // login_as: values.login_as,
                              });
                              localStorage.setItem("rememberMe", encryptedData);
                            } else {
                              localStorage.removeItem("rememberMe");
                            }
                            // Set loading to true when form is submitted
                            this.setState({ loading: true });

                            this.props.loginUser(values, this.props.history);
                          }}
                        >
                          {({ errors, touched }) => (
                            <Form className="form-horizontal">
                              {/* <div className="mb-2">
                                <Label for="login_as" className="form-label">
                                  Login As
                                </Label>
                                <Field
                                  as="select"
                                  name="login_as"
                                  className={
                                    "form-control" +
                                    (errors.login_as && touched.login_as
                                      ? " is-invalid"
                                      : "")
                                  }
                                >
                                  <option value="">
                                    --Please choose an option--
                                  </option>
                                  {options.map(option => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </Field>
                                <ErrorMessage
                                  name="login_as"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div> */}

                              <div className="mb-3">
                                <Label for="email" className="form-label">
                                  Email
                                </Label>
                                <Field
                                  name="email"
                                  type="text"
                                  className={
                                    "form-control" +
                                    (errors.email && touched.email
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                              <div className="mb-3">
                                <Label for="password" className="form-label">
                                  Password
                                </Label>
                                <div className="input-group auth-pass-inputgroup">
                                  <Field
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="true"
                                    className={
                                      "form-control" +
                                      (errors.password && touched.password
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <button
                                    className="btn btn-light"
                                    type="button"
                                    id="password-addon"
                                    onClick={this.togglePasswordVisibility}
                                  >
                                    <i
                                      className={
                                        showPassword
                                          ? "mdi mdi-eye-off-outline"
                                          : "mdi mdi-eye-outline"
                                      }
                                    ></i>
                                  </button>
                                </div>
                                <ErrorMessage
                                  name="password"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="mb-3 form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="rememberMe"
                                  checked={rememberMe}
                                  onChange={this.handleRememberMeChange}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="rememberMe"
                                >
                                  Remember Me
                                </label>
                              </div>

                              <div className="mt-3 d-grid">
                                <button
                                  className="btn custom-login-btn btn-block"
                                  type="submit"
                                >
                                  Log In
                                </button>
                              </div>

                            </Form>
                          )}
                        </Formik>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { error } = state.Login;
  return { error };
};

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError })(Login)
);
