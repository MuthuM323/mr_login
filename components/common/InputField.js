// components/common/InputField.js
import React from 'react';
import { Field, ErrorMessage } from 'formik';

const InputField = ({ label, name, type = 'text', placeholder, required = false, ...props }) => (
  <div className="standard-top-margin">
    {label && (
      <p className="standard-top-margin">
        {required && <span className="red">*</span>}
        {label}
      </p>
    )}
    <Field
      type={type}
      id={name}
      name={name}
      placeholder={placeholder}
      {...props}
    />
    <ErrorMessage name={name} component="div" className="required displayError margin-top">
      {msg => <p className="red">{msg}</p>}
    </ErrorMessage>
  </div>
);

export default InputField;
