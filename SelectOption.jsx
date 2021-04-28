import { Box, MenuItem, TextField } from "@material-ui/core";
import React from "react";
import PropTypes from 'prop-types';

function SelectOption(props) {
  const {value, onChange, options, variant, fullWidth, label} =  props;
  return (
    <Box>
      <TextField
        select
        label={label}
        value={value}
        onChange={onChange}
        variant={variant}
        fullWidth={fullWidth}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
SelectOption.propTypes ={
    variant : PropTypes.string,
    fullWidth: PropTypes.bool,
    options : PropTypes.array,
    onChange: PropTypes.func
}
SelectOption.defaultProps = {
    fullWidth: true,
    variant:"outlined"
}
export default SelectOption;
