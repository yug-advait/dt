import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Table } from "reactstrap";
import FormRepeater from "./Form"; // Assuming this component manages the form
import "./defect-master.css";

const DefectiveMaster = () => {
  useEffect(() => {
    document.title = "Defective Master | Advait - Detergent";
  }, []);

  const [defectiveEntries, setDefectiveEntries] = useState([
    {
      defectiveType: "Manufacturing Defect",
      defectiveCode: "MFD123",
      question: "Is the product missing a component?",
      answer: "No",
      remark: "The product was missing a crucial part in the assembly.",
    },
    {
      defectiveType: "Packaging Issue",
      defectiveCode: "PKG456",
      question: "Was the packaging damaged?",
      answer: "Yes",
      remark: "The packaging was intact with no visible damage.",
    },
    {
      defectiveType: "Quality Control",
      defectiveCode: "QC789",
      question: "Does the product meet quality standards?",
      answer: "No",
      remark: "The product passed all quality checks.",
    },
    {
      defectiveType: "Shipping Error",
      defectiveCode: "SHI101",
      question: "Was there an issue during shipping?",
      answer: "Yes",
      remark:
        "The product arrived later than expected due to logistics problems.",
    },
  ]);

  const handleAddDefectiveEntry = (entry) => {
    setDefectiveEntries((prevEntries) => [...prevEntries, entry]);
  };

  return (
      <Container fluid>
        <Row className="defective-master-form-container">
          <Col md={10} lg={8}>
            <Card className="defective-master-form-card">
              <CardBody>
                <h4 className="defective-master-form-title"> Add New Defect Entry</h4>
                <FormRepeater onAddDefectiveEntry={handleAddDefectiveEntry} />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="defective-master-table-container">
          <Col md={10} lg={8}>
            <Card className="defective-master-table-card">
              <CardBody>
                <h4 className="defective-master-table-title">📋 Defect Entries List</h4>
                <Table hover responsive bordered className="defective-master-styled-table">
                  <thead className="defective-master-table-head">
                    <tr>
                      <th>⚠️ Defect Type</th>
                      <th>🔢 Defect Code</th>
                      <th>❓ Question</th>
                      <th>✅ Answer</th>
                      <th>📝 Remark</th>
                    </tr>
                  </thead>
                  <tbody className="defective-master-table-body">
                    {defectiveEntries.length > 0 ? (
                      defectiveEntries.map((entry, index) => (
                        <tr key={index} className="defective-master-table-row">
                          <td className="defective-master-type">{entry.defectiveType}</td>
                          <td className="defective-master-code">{entry.defectiveCode}</td>
                          <td className="defective-master-question">{entry.question}</td>
                          <td className={`defective-master-answer answer-${entry.answer.toLowerCase()}`}>{entry.answer}</td>
                          <td className="defective-master-remark">{entry.remark}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="defective-master-no-records">🤷‍♂️ No records found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
  );
};

export default DefectiveMaster;