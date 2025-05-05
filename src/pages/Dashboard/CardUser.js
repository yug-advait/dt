import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import { getCounts } from "../../helpers/Api/api_dashboard";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Skeleton } from "@mui/material";

const LoadingSkeleton = () => (
  <Col xl={8}>
    <Row>
      {/* Top Row Card Skeletons */}
      {[1, 2, 3].map((index) => (
        <Col lg={4} key={index}>
          <Card className="mini-stats-wid">
            <CardBody>
              <div className="d-flex flex-wrap">
                <div className="me-3">
                  <Skeleton variant="text" width={80} height={24} />
                  <Skeleton variant="text" width={60} height={28} />
                </div>
                <div className="avatar-sm ms-auto">
                  <Skeleton variant="circular" width={40} height={40} />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>

    {/* Chart Card Skeleton */}
    <Card>
      <CardBody>
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          <Skeleton variant="rectangular" width={150} height={38} className="me-2" />
          <Skeleton variant="rectangular" width={150} height={38} />
        </div>

        <Row className="text-center">
          {[1, 2, 3].map((index) => (
            <Col lg={4} key={index}>
              <div className="mt-4">
                <Skeleton variant="text" width={100} height={24} style={{ margin: '0 auto' }} />
                <Skeleton variant="text" width={60} height={32} style={{ margin: '0 auto' }} />
              </div>
            </Col>
          ))}
        </Row>

        <hr className="mb-4" />
        <Skeleton variant="rectangular" height={350} className="w-full" />
      </CardBody>
    </Card>
  </Col>
);

const CardUser = () => {
  const [data, setData] = useState({});
  const [series, setSeries] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedType, setSelectedType] = useState("pr");
  const [loading, setLoading] = useState(true);
  const history = useHistory();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCounts();
        const dashboardData = response.dashboardMasterData || {};
        setData(dashboardData);
        updateSeries(dashboardData, selectedType, currentYear);

        // const yearWiseData = dashboardData.yearWiseCount || {};

        // const yearData = yearWiseData[currentYear];

        // if (yearData) {
        //   setSeries([
        //     {
        //       name: "Active",
        //       data: yearData.customerMonthlyActiveCount || [],
        //     },
        //     {
        //       name: "Inactive",
        //       data: yearData.customerMonthlyDeactiveCount || [],
        //     },
        //   ]);
        // }
        setData(dashboardData);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, [currentYear, selectedType]);

  const updateSeries = (dashboardData, type, year) => {
    const yearWiseData = dashboardData[`${type}YearWiseCount`] || {};
    const yearData = yearWiseData[year] || {};

    setSeries([
      {
        name: "Active",
        data: yearData[`${type}CountThisYear`] || [],
      },
      {
        name: "Inactive",
        data: yearData[`${type}MonthlyDeactiveCount`] || [],
      },
    ]);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  const handleYearChange = (e) => {
    setCurrentYear(Number(e.target.value));
  }

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const {
    productCount, vendorCount, vendorCodunt, employeeCount, companyCount, warehousescount,
    prCountToday, poCountToday, salesOrderCountToday, grnCountToday,
    prCountThisMonth, poCountThisMonth, salesOrderCountThisMonth, grnCountThisMonth,
    prCountThisYear, poCountThisYear, salesOrderCountThisYear, grnCountThisYear
  } = data || {};

  const todayCount = {
    pr: prCountToday,
    po: poCountToday,
    so: salesOrderCountToday,
    grn: grnCountToday,
  }[selectedType];

  const monthCount = {
    pr: prCountThisMonth,
    po: poCountThisMonth,
    so: salesOrderCountThisMonth,
    grn: grnCountThisMonth,
  }[selectedType];

  const yearCount = {
    pr: prCountThisYear,
    po: poCountThisYear,
    so: salesOrderCountThisYear,
    grn: grnCountThisYear,
  }[selectedType];

  const options = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    colors: ["#1c20a4", "#ff2b2b"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    xaxis: {
      categories: Array.from({ length: 12 },
        (_, i) => new Date(0, i).toLocaleString('en-US', { month: 'short' }))
    },
    markers: {
      size: 3,
      strokeWidth: 3,
      hover: {
        size: 4,
        sizeOffset: 2,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  };

  return (
    <React.Fragment>
      <Row>
      <Col xl={8}>
        <Card>
          <CardBody>
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <select
                className="form-select mb-3 me-2"
                style={{ width: "150px" }}
                value={selectedType}
                onChange={handleTypeChange}
              >
                <option value="pr">PR</option>
                <option value="po">PO</option>
                <option value="so">SO</option>
                {/* <option value="grn">GRN</option> */}
              </select>
              <input
                type="text"
                className="form-control"
                value={currentYear}
                onChange={(e) => handleYearChange(e.target.value)}
                style={{ width: "150px" }}
                readOnly
              />
            </div>

            <Row className="text-center">
              <Col lg={4}>
                <div className="mt-4">
                  <p className="text-muted mb-1">Today</p>
                  <h5>{todayCount >= 0 ? todayCount : "--"}</h5>
                </div>
              </Col>
              <Col lg={4}>
                <div className="mt-4">
                  <p className="text-muted mb-1">This Month</p>
                  <h5>{monthCount >= 0 ? monthCount : "--"}</h5>
                </div>
              </Col>
              <Col lg={4}>
                <div className="mt-4">
                  <p className="text-muted mb-1">This Year</p>
                  <h5>{yearCount >= 0 ? yearCount : "--"}</h5>
                </div>
              </Col>
            </Row>

            <hr className="mb-4" />
            <div className="apex-charts" id="area-chart" dir="ltr">
              <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={350}
                className="apex-charts"
              />
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col xl={4}>
        <Card>
          <CardBody
            onClick={() => { history.push("/vendor/vendor") }}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex flex-wrap">
              <h5 className="card-title mb-2 me-2">Vendor</h5>
            </div>

            <div className="d-flex flex-wrap">
              <div>
                <p className="text-muted mb-1">Vendor</p>
                <h3 className="mt-2">{vendorCount >= 0 ? vendorCount : "--"}</h3>
              </div>
              <div className="ms-auto align-self-end bg-custom-theme-icon">
                <i className="mdi mdi-account-tie display-5"></i>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody 
            onClick={() => { history.push("/products/products") }}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex flex-wrap">
              <h5 className="card-title mb-2 me-2">Products</h5>
            </div>

            <div className="d-flex flex-wrap">
              <div>
                <p className="text-muted mb-1">Products</p>
                <h3 className="mt-2">{productCount >= 0 ? productCount : "--"}</h3>
              </div>
              <div className="ms-auto align-self-end bg-custom-theme-icon">
                <i className="mdi mdi-package-variant-closed display-5"></i>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Row className="mt-2">
          {/* <Col lg={6}>
            <Card className="mini-stats-wid">
              <CardBody className="p-4"
                onClick={() => { history.push("/rfq") }}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">RFQ</p>
                    <h5 className="mb-0">{vendorCount >= 0 ? vendorCount : "--"}</h5>
                  </div>
                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-custom-theme rounded-circle font-size-20">
                      <i className="mdi mdi-email"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col> */}
          <Col lg={6}>
            <Card className="mini-stats-wid">
              <CardBody className="p-4"
                onClick={() => { history.push("/hrdata/employee_master") }}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex flex-wrap">
                  <div className="">
                    <p className="text-muted mb-2">Employees</p>
                    <h5 className="mb-0">{employeeCount >= 0 ? employeeCount : "--"}</h5>
                  </div>
                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-custom-theme rounded-circle font-size-20">
                      <i className="mdi mdi-account-multiple"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="mini-stats-wid">
              <CardBody className="p-4"
                onClick={() => { history.push("/master/company_legal_entity") }}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">Company</p>
                    <h5 className="mb-0">{companyCount >= 0 ? companyCount : "--"}</h5>
                  </div>
                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-custom-theme rounded-circle font-size-20">
                      <i className="mdi mdi-domain"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="mini-stats-wid">
              <CardBody className="p-4"
                onClick={() => { history.push("/products/warehouses") }}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex flex-wrap">
                  <div className="">
                    <p className="text-muted mb-2">Warehouses</p>
                    <h5 className="mb-0">{warehousescount >= 0 ? warehousescount : "--"}</h5>
                  </div>
                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-custom-theme rounded-circle font-size-20">
                      <i className="mdi mdi-warehouse"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
      </Row>
    </React.Fragment>
  );
};

export default CardUser;
