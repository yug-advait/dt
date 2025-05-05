import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";

const AddModal = ({ isOpen, toggle }) => {
  const [timeLeft, setTimeLeft] = useState(10); // Countdown timer

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime === 1) {
            clearInterval(timer);
            toggle();
            return 10;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, toggle]);

  return (
    <React.Fragment>
      <Modal
        isOpen={isOpen}
        role="dialog"
        centered
        className="exampleModal"
        tabIndex="-1"
      >
        <div className="modal-body">
          <h1>
            {timeLeft > 0 ? "🎉 Yay!! It's Break Time! ⏳" : "🎊 You're back! Refresh now!"}
          </h1>
          <p>You’ll be back soon. Stay tuned! 🍹</p>
          <p>
            Resuming in: <span>{timeLeft}</span> {timeLeft > 0 ? "⏳" : "🎉"}
          </p>
        </div>
      </Modal>
    </React.Fragment>
  );
};

AddModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default AddModal;
