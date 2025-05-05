import React, { useState } from "react";
import { Container, Row } from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import CardUser from "./CardUser";
import Settings from "./Settings";

const Dashboard = () => {
  React.useEffect(() => {
    document.title = "Detergent | Dashboard ";
  }, []);

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Settings />
          <CardUser />
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
