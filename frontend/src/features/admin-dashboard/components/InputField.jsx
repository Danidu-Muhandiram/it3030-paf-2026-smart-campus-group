import React from 'react';

/**
 * Generic labelled field wrapper with error display.
 */
const InputField = ({ label, required, error, children }) => (
    <div>
        <label className="block text-sm font-medium text-text-main mb-1">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

export default InputField;
