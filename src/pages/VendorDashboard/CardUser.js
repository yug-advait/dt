import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import { getVendorCounts } from "../../helpers/Api/api_dashboard";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Skeleton } from "@mui/material";


const LoadingSkeleton = () => (
  <Col xl={12}>
    <Row>
      {/* Top Row Card Skeletons */}
      {[1, 2].map((index) => (
        <Col lg={6} key={index}>
          <Card className="mini-stats-wid">
            <CardBody>
              <div className="d-flex flex-wrap">
                <div className="me-3">
                  <Skeleton variant="text" width={120} height={24} />
                  <Skeleton variant="text" width={80} height={28} />
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
        {/* Controls */}
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          <Skeleton variant="rectangular" width={150} height={38} className="me-2" />
          <Skeleton variant="rectangular" width={150} height={38} />
        </div>

        {/* Stats Row */}
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
        {/* Chart Skeleton */}
        <Skeleton variant="rectangular" height={350} className="w-full" />
      </CardBody>
    </Card>
  </Col>
);

const CardUser = () => {
  const [data, setData] = useState({});
  const [series, setSeries] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedType, setSelectedType] = useState("quotation");
  const [loading, setLoading] = useState(true);
  const history = useHistory();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getVendorCounts();
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
    let yearWiseData = {};
    let yearData = {};

    switch (type) {
      case 'quotation':
        yearWiseData = dashboardData.quotationsYearWiseCount || {};
        yearData = yearWiseData[year] || {};
        setSeries([
          { name: "Pending", data: yearData.quotationsMonthlyPendingCount || [] },
          { name: "WF Approval", data: yearData.quotationsMonthlyWFApprovalCount || [] },
          { name: "Rejected", data: yearData.quotationsMonthlyRejectedCount || [] }
        ]);
        break;

      case 'po':
        yearWiseData = dashboardData.posYearWiseCount || {};
        yearData = yearWiseData[year] || {};
        setSeries([
          { name: "Open", data: yearData.posMonthlyOpenCount || [] },
          { name: "Approved", data: yearData.posMonthlyApprovedCount || [] },
          { name: "Rejected", data: yearData.posMonthlyRejectedCount || [] },
          { name: "Closed", data: yearData.posMonthlyClosedCount || [] }
        ]);
        break;

      // Add similar cases for invoices if needed

      default:
        setSeries([]);
        break;
    }
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
    quotationCount, poCount, invoicesCount,
    quotationsCountToday, posCountToday, invoicesCountToday,
    quotationsCountThisMonth, posCountThisMonth, invoicesCountThisMonth,
    quotationsCountThisYear, posCountThisYear, invoicesCountThisYear
  } = data || {};

  const todayCount = {
    quotation: quotationsCountToday,
    po: posCountToday,
    invoice: invoicesCountToday,
  }[selectedType];

  const monthCount = {
    quotation: quotationsCountThisMonth,
    po: posCountThisMonth,
    invoice: invoicesCountThisMonth,
  }[selectedType];

  const yearCount = {
    quotation: quotationsCountThisYear,
    po: posCountThisYear,
    invoice: invoicesCountThisYear,
  }[selectedType];


  const options = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    colors: ["#556ee6", "#f01b0c", "#060807", "#f07e0c"],
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
      <Col xl={12}>
        <Row>
          <Col lg={6}>
            <Card className="mini-stats-wid">
              <CardBody
                // onClick={()=>{
                //   history.push("/purchase_request");
                // }}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">Total Quotations</p>
                    <h5 className="mb-0">{quotationCount >= 0 ? quotationCount : "--"}</h5>
                  </div>
                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bx-transfer"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="mini-stats-wid">
              <CardBody
                // onClick={() => {    history.push("/purchase_order");
                // }}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">Total PO</p>
                    <h5 className="mb-0">{poCount >= 0 ? poCount : "--"}</h5>
                  </div>
                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bx-shopping-bag"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* <Col lg={4}>
            <Card className="mini-stats-wid">
              <CardBody
                // onClick={() => { history.push("/purchase_order");
                // }}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">Total Invoices</p>
                    <h5 className="mb-0">{invoicesCount >= 0 ? invoicesCount : "--"}</h5>
                  </div>
                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bx-shopping-bag"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col> */}

        </Row>

        <Card>
          <CardBody>
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <select
                className="form-select mb-3 me-2"
                style={{ width: "150px" }}
                value={selectedType}
                onChange={handleTypeChange}
              >
                <option value="quotation">Quotations</option>
                <option value="po">POs</option>
                {/* <option value="invoice">Invoices</option> */}
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
    </React.Fragment>
  );
};

export default CardUser;
