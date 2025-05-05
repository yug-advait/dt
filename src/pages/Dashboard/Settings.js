import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
} from "reactstrap";
import { getCounts } from "../../helpers/Api/api_dashboard";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Skeleton, Stack } from "@mui/material";

const LoadingSkeleton = () => (
  <>
    <Col xl={4}>
      {/* GRN Card Skeleton */}
      <Card className="mini-stats-wid">
        <CardBody>
          <div className="d-flex flex-wrap">
            <div className="me-3">
              <Skeleton variant="text" width={80} height={24} />
              <Skeleton variant="text" width={60} height={28} />
            </div>
            <div className="ms-auto">
              <Skeleton variant="circular" width={40} height={40} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Vendor Card Skeleton */}
      <Card>
        <CardBody>
          <div className="d-flex flex-wrap">
            <Skeleton variant="text" width={100} height={32} className="mb-3" />
          </div>
          <div className="d-flex flex-wrap">
            <div>
              <Skeleton variant="text" width={100} height={24} />
              <Skeleton variant="text" width={80} height={36} className="mt-2" />
            </div>
            <div className="ms-auto">
              <Skeleton variant="circular" width={48} height={48} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Products Card Skeleton */}
      <Card>
        <CardBody>
          <div className="d-flex flex-wrap">
            <Skeleton variant="text" width={100} height={32} className="mb-3" />
          </div>
          <div className="d-flex flex-wrap">
            <div>
              <Skeleton variant="text" width={120} height={24} />
              <Skeleton variant="text" width={80} height={36} className="mt-2" />
            </div>
            <div className="ms-auto">
              <Skeleton variant="circular" width={48} height={48} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Bottom Row Cards Skeleton */}
      <Row className="mt-2">
        {[1, 2, 3, 4].map((index) => (
          <Col lg={6} key={index}>
            <Card className="mini-stats-wid">
              <CardBody className="p-4">
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <Skeleton variant="text" width={100} height={24} />
                    <Skeleton variant="text" width={60} height={28} />
                  </div>
                  <div className="ms-auto">
                    <Skeleton variant="circular" width={40} height={40} />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Col>
  </>
);

const Settings = () => {
  const [data, setData] = useState({});
  const [fullName, setFullName] = useState('');
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  const auth = JSON.parse(localStorage.getItem("authUser")) || {};
  const permissionList = auth.permissionList || [];

  const dashboardPermissions = ['po_dashboard', 'pr_dashboard', 'so_dashboard'];
  const permissions = {};

  permissionList.forEach(item => {
    if (item.menu_label === 'Dashboard' && dashboardPermissions.includes(item.sub_menu_name)) {
      permissions[item.sub_menu_name] = item.can_list;
    }
  });

  const prPermission = permissions['pr_dashboard'];
  const poPermission = permissions['po_dashboard'];
  const soPermission = permissions['so_dashboard'];

  const visibleCount = [prPermission, poPermission, soPermission].filter(Boolean).length;
  const getColSize = () => {
    if (visibleCount === 1) return 12;
    if (visibleCount === 2) return 6;
    return 4;
  };


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
        const response = await getCounts();
        setData(response);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }
  const {
    salesOrderCount,
    PRCount,
    POCount,
  } = data.dashboardMasterData || {};

  return (
    <React.Fragment>
      <Row>
        {prPermission ?
          <Col lg={getColSize()}>
            <Card className="mini-stats-wid">
              <CardBody
                onClick={() => {
                  history.push("/purchase_request");
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">Total PR</p>
                    <h5 className="mb-0">{PRCount >= 0 ? PRCount : "--"}</h5>
                  </div>
                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-custom-theme rounded-circle font-size-20">
                      <i className="bx bxs-purchase-tag"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          : ""
        }
        {poPermission ?
          <Col lg={getColSize()}>
            <Card className="mini-stats-wid">
              <CardBody
                onClick={() => {
                  history.push("/purchase_order");
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">Total PO</p>
                    <h5 className="mb-0">{POCount >= 0 ? POCount : "--"}</h5>
                  </div>
                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-custom-theme rounded-circle font-size-20">
                      <i className="mdi mdi-file-document-outline"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          : ""
        }
        {soPermission ?
          <Col xl={getColSize()}>
            <Card className="mini-stats-wid">
              <CardBody
                onClick={() => { history.push("/sales_order") }}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">Total SO</p>
                    <h5 className="mb-0">{salesOrderCount >= 0 ? salesOrderCount : "--"}</h5>
                  </div>
                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-custom-theme rounded-circle font-size-20">
                      <i className="mdi mdi-receipt"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          : ""
        }
      </Row>
    </React.Fragment >
  );
};

export default Settings;
