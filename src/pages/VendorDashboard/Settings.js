import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
} from "reactstrap";
import { getVendorCounts } from "../../helpers/Api/api_dashboard";
import { Link, useLocation, useHistory } from "react-router-dom";


const Settings = () => {
  const [data, setData] = useState({});
  const [fullName, setFullName] = useState('');
    const history = useHistory();
  

  const getUserName = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        setFullName(obj.full_name);
      } else if (process.env.REACT_APP_DEFAULTAUTH === "fake" || process.env.REACT_APP_DEFAULTAUTH === "jwt") {
        setFullName(`${obj?.user?.title} ${obj?.user?.first_name} ${obj?.user?.last_name}`);
      }
    }
  };
  useEffect(() => {
    getUserName();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getVendorCounts();
        setData(response);

      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, []);

  const {
    GRNCount,
    productCount,
    vendorCount,
    vendorCodunt,
    employeeCount,
    companyCount,
    warehousescount
  } = data.dashboardMasterData || {};

  return (
    <React.Fragment>
    </React.Fragment >
  );
};

export default Settings;
