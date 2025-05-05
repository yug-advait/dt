import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import { connect } from "react-redux";

import { authProtectedRoutes, publicRoutes } from "./routes/";
import AppRoute from "./routes/route";

import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

import "./assets/scss/theme.scss";

import fakeBackend from "./helpers/AuthType/fakeBackend";
import { checkTokenExpiry } from "utils/auth";

import { permissionListsfetchData } from "../src/firebase/index";

import { collection, onSnapshot } from "firebase/firestore";
import { db, requestPermission } from "../src/firebase/configration";
import { getMessaging, onMessage } from "firebase/messaging";
import { updateUserPermission } from "store/actions";

const messaging = "";
// const messaging = getMessaging();

permissionListsfetchData();
fakeBackend();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: localStorage.getItem("authUser"),
      isTokenValid: checkTokenExpiry(),
      permissionLists: [],
      isLoading: true,
      error: null,
      userData: {},
    };

    this.getLayout = this.getLayout.bind(this);
  }

  getLayout = () => {
    let layoutCls = HorizontalLayout;
    switch (this.props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  };

  getAuthNav = () => {
    const authUser = localStorage.getItem("authUser");
    const isTokenValid = checkTokenExpiry();
    const parsedAuthUser = authUser ? JSON.parse(authUser) : null;
    const location = this.props.location;
    return {
      authUser,
      isTokenValid,
      parsedAuthUser,
      location,
    };
  };

  // update permission
  updatePermission = (data, authUser) => {
    data[0]?.users.forEach(user => {
      if (authUser?.user.id === user.id) {
        const itemToSet = {
          ...authUser,
          permissionList: user.permissions,
        };

        this.props.updateUserPermission();
        localStorage.setItem("authUser", JSON.stringify(itemToSet));
      }
    });
  };

  getLocalStorge = () => {
    const auth = JSON.parse(localStorage.getItem("authUser"));
    this.setState({ userData: auth });
  };

  fetchPermissionLists = async () => {
    const dataCollection = collection(db, "permissionLists");

    // Listen for real-time changes
    const unsubscribe = onSnapshot(
      dataCollection,
      snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update state with the new data from the snapshot
        this.setState({
          permissionLists: data,
          isLoading: false,
        });
        this.updatePermission(data);
      },
      error => {
        // Handle error if snapshot listener fails
        console.error("Error fetching permission lists:", error);
        this.setState({ isLoading: false });
      }
    );
  };

  componentDidMount() {
    window.addEventListener("storage", this.handleStorageChange);
    // onMessage(messaging, (payload) => {
    //   console.log("Message received. ", payload);
    //   new Notification(payload.notification.title, {
    //     body: payload.notification.body,
    //     icon: payload.notification.image, // Optional
    //   });
    // });

    const fcmtoken = requestPermission();

    this.updateTitle();
    this.getLocalStorge();
    this.fetchPermissionLists();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.authUser !== this.state.authUser ||
      prevState.isTokenValid !== this.state.isTokenValid
    ) {
      this.updateTitle();
    }
    if (
      (prevState.permissionLists !== this.state.permissionLists &&
        this.state.permissionLists.length > 0) ||
      prevState.userData !== this.state.userData
    ) {
      // this.fetchPermissionLists();
      this.updatePermission(this.state.permissionLists, this.state.userData);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("storage", this.handleStorageChange);
  }

  handleStorageChange = () => {
    this.setState({
      authUser: localStorage.getItem("authUser"),
      isTokenValid: checkTokenExpiry(),
    });
  };

  updateTitle = () => {
    const { authUser, isTokenValid } = this.state;
    if (!authUser || !isTokenValid) {
      document.title = "Detergent | Login";
    } else {
      document.title = "Detergent";
    }
  };

  render() {
    const Layout = this.getLayout();
    const { isTokenValid, parsedAuthUser, location } = this.getAuthNav();

    if (!parsedAuthUser || !isTokenValid) {
      const { pathname } = location;

      const isNotLoginOrDefectivePage = pathname !== "/login" && 
                                        pathname !== "/defective-parameter" && 
                                        pathname !== "/defective-master";
    
      if (isNotLoginOrDefectivePage) {
        this.props.history.push("/login", { replace: true });
        document.title = "Detergent App | Login";
        return <Redirect to="/login" replace />;
      }
    } else {
      const shouldRedirectToUserDashboard =
        parsedAuthUser.login_as === "user" &&
        ["/", "/login"].includes(location.pathname);
      const shouldRedirectToCustomerDashboard =
        parsedAuthUser.login_as === "vendor" &&
        ["/", "/login"].includes(location.pathname);
      if (shouldRedirectToUserDashboard) {
        return <Redirect to={{ pathname: "/dashboard" }} replace />;
      }
      if (shouldRedirectToCustomerDashboard) {
        return <Redirect to={{ pathname: "/vendor/dashboard" }} replace />;
      }
    }

    return (
      <React.Fragment>
        <Router>
          <Switch>
            {publicRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
              />
            ))}

            {authProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={Layout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                role={route.role}
                exact
              />
            ))}
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  };
};

App.propTypes = {
  layout: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

export default connect(mapStateToProps, { updateUserPermission })(
  withRouter(App)
);
