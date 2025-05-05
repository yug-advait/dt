import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import FormWizard from "./Form"; // Assuming this is your form wizard component
import Timer from "./Timer";
import AddModal from "./AddModal"; // Assuming your AddModal is being used
import "./defect-parameter.css";

const DefectiveParameter = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer
  const [timeOut, setTimeOut] = useState(false);

  // Set document title dynamically
  useEffect(() => {
    document.title = "Defective Parameter | Advait - Detergent";
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeOut(true);
    }
  }, [timeLeft]);

  return (
    <div className="page-content2">
      {!timeOut && (
        <Container fluid className="py-3">
          <Row className="justify-content-center">
            <div className="timer-container">
              <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
            </div>
            <Col md={10} lg={10}>
              {/* Card Design for Form Wizard */}
              <Card className="shadow-lg border-0 rounded-lg">
                <CardHeader className="bg-soft text-white text-center py-4">
                  <h4>Defect Parameter Setup 🛠️</h4>
                </CardHeader>
                <CardBody>
                  {/* FormWizard Component */}
                  <FormWizard />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      )}

      {timeOut && (
        <AddModal
          isOpen={timeOut}
          toggle={() => setTimeOut(false)}
        />
      )}
    </div>
  );
};

export default DefectiveParameter;
