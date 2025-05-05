import React, { useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  FormFeedback,
  Table,
} from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";
 
const FormWizard = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);
  const [rows, setRows] = useState([
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
      answer: "No",
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
      answer: "No",
      remark:
        "The product arrived later than expected due to logistics problems.",
    },
  ]);
  const [formData, setFormData] = useState({
    materialCode: "",
    batchNo: "",
    tray: "",
    lightLuxMeasurement: "",
  });
  const [errors, setErrors] = useState({});
 
  const toggleTab = tab => {
    if (activeTab !== tab && tab >= 1 && tab <= 4) {
      setActiveTab(tab);
      if (!passedSteps.includes(tab)) {
        setPassedSteps([...passedSteps, tab]);
      }
    }
  };
 
  const handleInputChange = (index, event) => {
    const { value } = event.target;
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], answer: value };
    setRows(updatedRows);
  };
 
  const handleFormInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
 
    // Remove error message for the field being edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };
 
  // Validate form fields based on the active tab
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
 
    // Only validate fields for active tab 1
    if (activeTab === 1) {
      if (!formData.materialCode) {
        formErrors.materialCode = "Material Code is required";
        isValid = false;
      }
      if (!formData.batchNo) {
        formErrors.batchNo = "Batch No is required";
        isValid = false;
      }
      if (!formData.tray) {
        formErrors.tray = "Tray is required";
        isValid = false;
      }
      if (!formData.lightLuxMeasurement) {
        formErrors.lightLuxMeasurement = "Light Lux Measurement is required";
        isValid = false;
      }
    }
 
    setErrors(formErrors);
    return isValid;
  };
 
  const handleNext = () => {
    if (validateForm()) {
      toggleTab(activeTab + 1);
    }
  };
 
  const handleSubmit = () => {
    // Handle form submission (e.g., send data to API or log it)
    console.log("Form Submitted", formData, rows);
    toggleTab(activeTab + 1);
    // Reset form after submission (optional)
    setFormData({
      materialCode: "",
      batchNo: "",
      tray: "",
      lightLuxMeasurement: "",
    });
    setRows(rows.map(row => ({ ...row, answer: "No" })));
  };
 
  return (
    <Container fluid={true}>
      <Row>
        <Col lg="12">
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Defect Parameter Check</h4>
              <div className="wizard clearfix">
                <div className="steps clearfix">
                  <ul>
                    <NavItem
                      className={classnames({ current: activeTab === 1 })}
                    >
                      <NavLink
                        className={classnames({ active: activeTab === 1 })}
                        onClick={() => toggleTab(1)}
                      >
                        <span className="number">1.</span> 🛠️ Defect Details
                      </NavLink>
                    </NavItem>
                    <NavItem
                      className={classnames({ current: activeTab === 2 })}
                    >
                      <NavLink
                        disabled={!passedSteps.includes(2)}
                        className={classnames({ active: activeTab === 2 })}
                        onClick={() => validateForm() && toggleTab(2)}
                      >
                        <span className="number">2.</span> 📋 Defect Master
                      </NavLink>
                    </NavItem>
                    <NavItem
                      className={classnames({ current: activeTab === 3 })}
                    >
                      <NavLink
                        disabled={!passedSteps.includes(3)}
                        className={classnames({ active: activeTab === 3 })}
                      >
                        <span className="number">3.</span> ✅ Confirm Detail
                      </NavLink>
                    </NavItem>
                  </ul>
                </div>
                <div className="content clearfix">
                  <TabContent activeTab={activeTab} className="body">
                    <TabPane tabId={1}>
                      <Form>
                        <Row>
                          <Col lg="6">
                            <FormGroup>
                              <Label for="material-code">Material Code</Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="material-code"
                                name="materialCode"
                                value={formData.materialCode}
                                placeholder="Enter Material Code"
                                onChange={handleFormInputChange}
                                invalid={!!errors.materialCode}
                              />
                              {errors.materialCode && (
                                <FormFeedback>
                                  {errors.materialCode}
                                </FormFeedback>
                              )}
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <Label for="batch-no">Batch No</Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="batch-no"
                                name="batchNo"
                                value={formData.batchNo}
                                placeholder="Enter Batch No"
                                onChange={handleFormInputChange}
                                invalid={!!errors.batchNo}
                              />
                              {errors.batchNo && (
                                <FormFeedback>{errors.batchNo}</FormFeedback>
                              )}
                            </FormGroup>
                          </Col>
                        </Row>
 
                        <Row>
                          <Col lg="6">
                            <FormGroup>
                              <Label for="tray">Tray</Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="tray"
                                name="tray"
                                value={formData.tray}
                                placeholder="Enter Tray"
                                onChange={handleFormInputChange}
                                invalid={!!errors.tray}
                              />
                              {errors.tray && (
                                <FormFeedback>{errors.tray}</FormFeedback>
                              )}
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <Label for="light-lux-measurement">
                                Light Lux Measurement
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="light-lux-measurement"
                                name="lightLuxMeasurement"
                                value={formData.lightLuxMeasurement}
                                placeholder="Enter Light Lux Measurement"
                                onChange={handleFormInputChange}
                                invalid={!!errors.lightLuxMeasurement}
                              />
                              {errors.lightLuxMeasurement && (
                                <FormFeedback>
                                  {errors.lightLuxMeasurement}
                                </FormFeedback>
                              )}
                            </FormGroup>
                          </Col>
                        </Row>
                      </Form>
                    </TabPane>
 
                    <TabPane tabId={2}>
                      <div className="table-responsive mt-4">
                        <Table
                          hover
                          responsive
                          bordered
                          className="styled-table"
                        >
                          <thead className="thead-light">
                            <tr>
                              <th>Defect Type</th>
                              <th>Defect Code</th>
                              <th>Question</th>
                              <th>Answer</th>
                              <th>Remark</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((entry, index) => (
                              <tr key={index} className="table-row">
                                <td>{entry.defectiveType}</td>
                                <td>{entry.defectiveCode}</td>
                                <td>{entry.question}</td>
                                <td
                                  style={{
                                    fontWeight: "bold",
                                    color:
                                      entry.answer === "Yes"
                                        ? "#008000"
                                        : entry.answer === "No"
                                          ? "#721c24"
                                          : "#000",
                                  }}
                                >
                                  <div className="d-flex gap-2 justify-content-space-evenly">
                                    <div className="position-relative">
                                      <Input
                                        type="radio"
                                        id={`answerYES-${index}`}
                                        name={`answer-${index}`}
                                        value="Yes"
                                        checked={entry.answer === "Yes"}
                                        onChange={e =>
                                          handleInputChange(index, e)
                                        }
                                        className="btn-check"
                                      />
                                      <Label
                                        className={`btn p-0 d-flex align-items-center justify-content-center rounded-circle shadow-sm ${entry.answer === "Yes"
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                          }`}
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                          fontSize: "0.8rem",
                                          fontWeight: "500",
                                          transition: "all 0.2s ease",
                                          transform:
                                            entry.answer === "Yes"
                                              ? "scale(0.95)"
                                              : "scale(1)",
                                          border:
                                            entry.answer === "Yes"
                                              ? "none"
                                              : "2px solid",
                                          touchAction: "manipulation",
                                        }}
                                        htmlFor={`answerYES-${index}`}
                                      >
                                        Yes
                                      </Label>
                                    </div>
                                    <div className="position-relative">
                                      <Input
                                        type="radio"
                                        id={`answerNO-${index}`}
                                        name={`answer-${index}`}
                                        value="No"
                                        checked={entry.answer === "No"}
                                        onChange={e =>
                                          handleInputChange(index, e)
                                        }
                                        className="btn-check"
                                      />
                                      <Label
                                        className={`btn p-0 d-flex align-items-center justify-content-center rounded-circle shadow-sm ${entry.answer === "No"
                                            ? "btn-danger"
                                            : "btn-outline-danger"
                                          }`}
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                          fontSize: "0.8rem",
                                          fontWeight: "500",
                                          transition: "all 0.2s ease",
                                          transform:
                                            entry.answer === "No"
                                              ? "scale(0.95)"
                                              : "scale(1)",
                                          border:
                                            entry.answer === "No"
                                              ? "none"
                                              : "2px solid",
                                          touchAction: "manipulation",
                                        }}
                                        htmlFor={`answerNO-${index}`}
                                      >
                                        No
                                      </Label>
                                    </div>
                                  </div>
                                </td>
                                <td>{entry.remark}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </TabPane>
 
                    <TabPane tabId={3}>
                      <div className="row justify-content-center">
                        <Col lg="6">
                          <div className="text-center">
                            <div className="mb-4">
                              <i className="mdi mdi-check-circle-outline text-success display-4" />
                            </div>
                            <div>
                              <h5>Form submitted</h5>
                            </div>
                          </div>
                        </Col>
                      </div>
                    </TabPane>
                  </TabContent>
                </div>
                {activeTab !== 3 && (
                  <div className="actions clearfix">
                    <ul>
                      <li
                        className={
                          activeTab === 1 ? "previous disabled" : "previous"
                        }
                      >
                        <Link
                          to="#"
                          onClick={() => {
                            toggleTab(activeTab - 1);
                          }}
                        >
                          Previous
                         
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          onClick={activeTab === 2 ? handleSubmit : handleNext}
                        >
                          {activeTab === 2 ? "Submit " : "Next"}
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
 
export default FormWizard;