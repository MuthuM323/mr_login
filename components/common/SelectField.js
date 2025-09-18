// components/common/SelectField.js
import React from 'react';
import { Field, ErrorMessage } from 'formik';

const SelectField = ({ label, name, options, required = false, ...props }) => (
  <div className="standard-top-margin">
    {label && (
      <p className="standard-top-margin">
        {required && <span className="red">*</span>}
        {label}
      </p>
    )}
    <Field
      as="select"
      id={name}
      name={name}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Field>
    <ErrorMessage name={name} component="div" className="required displayError margin-top">
      {msg => <p className="red">{msg}</p>}
    </ErrorMessage>
  </div>
);

export default SelectField;
