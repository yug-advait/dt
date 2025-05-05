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

      {
        timeOut &&
        <><div
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(to right, #FF7E5F, #feb47b)", // Gradient background for style
            padding: "20px",
            fontFamily: "'Roboto', sans-serif", // Smooth modern font
          }}
        >
          <div
            style={{
              textAlign: "center",
              backgroundColor: "#fff",
              borderRadius: "10px", // Rounded corners
              padding: "40px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Subtle shadow effect
              width: "80%",
              maxWidth: "500px",
            }}
          >
            <p
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "20px",
              }}
            >
              <i
                className="fa-solid fa-triangle-exclamation"
                style={{ fontSize: "40px", color: "#FF6347", marginRight: "10px" }}
              />
              Attention Here
            </p>

            <p
              style={{
                fontSize: "24px",
                color: "#d9534f",
                fontWeight: "bold",
                marginBottom: "30px",
              }}
            >
              <i
                className="fas fa-exclamation-triangle"
                style={{
                  marginRight: "10px",
                  fontSize: "40px",
                  color: "#FF6347",
                }}
              />
              Shift Over!
            </p>

            {/* Optional Button */}
            <button
              style={{
                padding: "12px 25px",
                backgroundColor: "#FF6347",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onClick={() => window.location.reload()} // Example button action
            >
              Retry
            </button>
          </div>
        </div>

        </>
      }
    </div>
  );
};

export default DefectiveParameter;