import React from "react"
import { Container, Row, Col } from "reactstrap"
import AdvaitLogo from "../../assets/images/Advaitlogo1.png";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>{new Date().getFullYear()} © Detergent.</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
              Powered by : <img src={AdvaitLogo} alt="" height="22" /> Advait Business Solutions Pvt Ltd
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
