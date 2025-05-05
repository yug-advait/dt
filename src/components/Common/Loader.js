import React, { Component } from "react";
//import AdvaitLogo from "../../assets/images/Advaitlogo.png";
import AdvaitLogo from "../../assets/images/navyugIcon.png";
class Loader extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="loader-container">
          <div className="loader-content">
            <img src={AdvaitLogo} alt="Logo" className="loader-logo" />
            <div className="dot-loader">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Loader;
