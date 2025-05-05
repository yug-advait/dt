import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { checkTokenExpiry } from "../utils/auth"; // Import token expiry check function
import PageNotFound from "../pages/PageNotFound/pageNotFound";


const AppRoute = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  role,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      const authUser = localStorage.getItem("authUser");
      const currentUserRole = JSON.parse(authUser)?.login_as;
      const isTokenValid = checkTokenExpiry();
 
      if (isAuthProtected) {
        if (!authUser && !isTokenValid) {
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
              replace
            />
          );
        }
        if(role!== "both"){
          if (role && currentUserRole !== role) {
            return <Redirect to="/pageNotFound" component={PageNotFound} />;
          }
        }
      }
      return (
        <Layout>
          <Component {...props} />
        </Layout>
      );
    }}
  />
);

AppRoute.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default AppRoute;
