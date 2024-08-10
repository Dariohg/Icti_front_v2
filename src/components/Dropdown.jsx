import React from 'react';
import Select from 'react-select';

const Dropdown = ({ value, onChange, options }) => {
    const handleChange = (selectedOption) => {
        const selectedValue = selectedOption ? selectedOption.value : null;
        onChange(selectedValue);
    };

    return (
        <Select
            value={options.find((option) => option.value === value) || null}
            onChange={handleChange}
            options={options}
            isSearchable
            placeholder="Search..."
        />
    );
};

export default Dropdown;
