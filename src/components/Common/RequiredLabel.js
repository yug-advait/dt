import React, { Component } from 'react';

class RequiredLabel extends Component {
    render() {
        const { htmlFor, label, isRequired } = this.props;

        return (
            <label htmlFor={htmlFor}>
                {label}
                {isRequired && <span style={{ color: 'red' }}> *</span>}
            </label>
        )
    }
}

export default RequiredLabel;