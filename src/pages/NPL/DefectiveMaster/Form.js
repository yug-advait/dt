  import React, { useState } from "react";
  import {
    Alert,
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Container,
    Form,
    FormFeedback,
    Input,
    Label,
    Row,
  } from "reactstrap";


  const FormRepeater = ({ onAddDefectiveEntry }) => {
    // State to manage form data
    const [formData, setFormData] = useState({
      defectiveType: "",
      defectiveCode: "",
      question: "",
      answer: "", // Either 'YES' or 'NO'
      remark: "",
    });

    // State to manage errors
    const [errors, setErrors] = useState({
      defectiveType: "",
      defectiveCode: "",
      question: "",
      answer: "",
      remark: "",
    });

    const [toast, setToast] = useState({
      open: false,
      message: null,
      variant: true,
    });

    // Handle form field change and remove error if the field is modified
    const handleChange = e => {
      const { name, value } = e.target;
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));

      // Remove error message for the field being edited
      if (errors[name]) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    };

    // Form validation function
    const validateForm = () => {
      const newErrors = {};
      let isValid = true;

      // Check if all fields are filled
      if (!formData.defectiveType) {
        newErrors.defectiveType = "Defect Type is required";
        isValid = false;
      }

      if (!formData.defectiveCode) {
        newErrors.defectiveCode = "Defect Code is required";
        isValid = false;
      }

      if (!formData.question) {
        newErrors.question = "Question is required";
        isValid = false;
      }

      if (!formData.answer) {
        newErrors.answer = "Answer is required";
        isValid = false;
      }

      if (!formData.remark) {
        newErrors.remark = "Remark is required";
        isValid = false;
      }

      setErrors(newErrors);
      return isValid;
    };

    // Handle form submit
    const handleSubmit = e => {
      e.preventDefault();

      // Validate form before submission
      if (validateForm()) {
        setToast({
          open: true,
          message: "Defect Master Added",
          variant: true,
        });
        onAddDefectiveEntry(formData);
        setFormData({
          defectiveType: "",
          defectiveCode: "",
          question: "",
          answer: "",
          remark: "",
        });
        setErrors({}); // Clear any previous errors
      }

      setTimeout(() => {
        setToast({
          open: false,
          message: null,
          variant: null,
        });
      }, [2000]);
    };

    return (
      <React.Fragment>
        {toast.open && (
          <div
            className="position-fixed top-0 end-0 p-3"
            style={{ zIndex: "1005" }}
          >
            <Alert color={toast.variant ? "success" : "danger"} role="alert">
              {toast.message}
            </Alert>
          </div>
        )}
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Defect Master</CardTitle>
                  <Form className="outer-repeater" onSubmit={handleSubmit}>
                    <div data-repeater-list="outer-group" className="outer">
                      <div data-repeater-item className="outer">
                        <Row>
                          {/* Defective Type */}
                          <Col md={6} className="mb-3">
                            <Label htmlFor="defective-type">Defect Type :</Label>
                            <Input
                              type="text"
                              id="defective-type"
                              name="defectiveType"
                              placeholder="Enter Defect Type..."
                              className={`form-control ${
                                errors.defectiveType ? "is-invalid" : ""
                              }`}
                              value={formData.defectiveType}
                              onChange={handleChange}
                            />
                            {errors.defectiveType && (
                              <div className="text-danger">
                                {errors.defectiveType}
                              </div>
                            )}
                          </Col>

                          {/* Defective Code */}
                          <Col md={6} className="mb-3">
                            <Label htmlFor="defective-code">Defect Code :</Label>
                            <Input
                              type="text"
                              id="defective-code"
                              name="defectiveCode"
                              placeholder="Enter Defect Code..."
                              className={`form-control ${
                                errors.defectiveCode ? "is-invalid" : ""
                              }`}
                              value={formData.defectiveCode}
                              onChange={handleChange}
                            />
                            {errors.defectiveCode && (
                              <div className="text-danger">
                                {errors.defectiveCode}
                              </div>
                            )}
                          </Col>
                        </Row>

                        <Row>
                          {/* Question */}
                          <Col md={6} className="mb-3">
                            <Label htmlFor="question">Question :</Label>
                            <Input
                              type="textarea"
                              id="question"
                              name="question"
                              placeholder="Enter Question..."
                              className={`form-control ${
                                errors.question ? "is-invalid" : ""
                              }`}
                              value={formData.question}
                              onChange={handleChange}
                            />
                            {errors.question && (
                              <div className="text-danger">{errors.question}</div>
                            )}
                          </Col>

                          {/* Answer */}
                          <Col md={6} className="mb-4">
                            <Label className="h6 mb-3">Answer:</Label>
                            <div className="d-flex gap-2 justify-content-space-evenly">
                              <div className="position-relative">
                                <Input
                                  type="radio"
                                  id="answerYES"
                                  name="answer"
                                  value="Yes"
                                  checked={formData.answer === "Yes"}
                                  onChange={handleChange}
                                  className="btn-check"
                                />
                                <Label
                                  className={`
                btn p-0 d-flex align-items-center justify-content-center
                rounded-circle shadow-sm
                ${
                  formData.answer === "Yes"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }
              `}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    fontSize: "1rem",
                                    fontWeight: "500",
                                    transition: "all 0.2s ease",
                                    transform:
                                      formData.answer === "Yes"
                                        ? "scale(0.95)"
                                        : "scale(1)",
                                    border:
                                      formData.answer === "Yes"
                                        ? "none"
                                        : "2px solid",
                                    touchAction: "manipulation",
                                  }}
                                  htmlFor="answerYES"
                                >
                                  Yes
                                </Label>
                              </div>

                              <div className="position-relative">
                                <Input
                                  type="radio"
                                  id="answerNO"
                                  name="answer"
                                  value="No"
                                  checked={formData.answer === "No"}
                                  onChange={handleChange}
                                  className="btn-check"
                                />
                                <Label
                                  className={`
                btn p-0 d-flex align-items-center justify-content-center
                rounded-circle shadow-sm
                ${formData.answer === "No" ? "btn-danger" : "btn-outline-danger"}
              `}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    fontSize: "1rem",
                                    fontWeight: "500",
                                    transition: "all 0.2s ease",
                                    transform:
                                      formData.answer === "No"
                                        ? "scale(0.95)"
                                        : "scale(1)",
                                    border:
                                      formData.answer === "No"
                                        ? "none"
                                        : "2px solid",
                                    touchAction: "manipulation",
                                  }}
                                  htmlFor="answerNO"
                                >
                                  No
                                </Label>
                              </div>
                            </div>

                            {errors.answer && (
                              <FormFeedback className="d-block mt-3">
                                {errors.answer}
                              </FormFeedback>
                            )}
                          </Col>
                        </Row>

                        {/* Remark */}
                        <Col md={12} className="mb-3">
                          <Label htmlFor="remark">Remark :</Label>
                          <Input
                            type="textarea"
                            id="remark"
                            name="remark"
                            placeholder="Enter Remark Here..."
                            className={`form-control ${
                              errors.remark ? "is-invalid" : ""
                            }`}
                            value={formData.remark}
                            onChange={handleChange}
                          />
                          {errors.remark && (
                            <div className="text-danger">{errors.remark}</div>
                          )}
                        </Col>

                        {/* Center the submit button */}
                        <div className="text-center">
                          <Button type="submit" color="primary">
                          Add <i className="fas fa-plus"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  };

  export default FormRepeater;
