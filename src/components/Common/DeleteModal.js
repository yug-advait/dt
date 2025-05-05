import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Col, Modal, ModalBody, Row } from "reactstrap";

class DeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <Modal isOpen={this.props.show} toggle={this.props.onCloseClick} centered={true}>
          <ModalBody className="py-3 px-5">
            <Row>
              <Col lg={12}>
                <div className="text-center">
                  <i
                    className={this.props.className}
                    style={{ fontSize: "9em", color: "orange" }}
                  />
                  <h2>{this.props.title1}</h2>
                  <h4>{this.props.title2}</h4>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
              <div className="text-center mt-3">
                  <Button
                    type="button"
                    className="btn-custom-theme btn-lg mb-2 me-2"
                    onClick={this.props.onDeleteClick}
                  >
                    {this.props.saveTitle}
                  </Button>
                  <Button
                    type="button"
                    className="btn btn-danger btn-lg mb-2 me-2"
                    onClick={this.props.onCloseClick}
                  >
                    Cancel
                  </Button>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

DeleteModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any,
};

export default DeleteModal;
