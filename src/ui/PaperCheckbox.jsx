import React from 'react';
import { Checkbox } from 'react-native-paper';

const CheckboxItem = ({checked, setChecked}) => {
  return (
    <Checkbox
      status={checked ? "checked" : "unchecked"}
      onPress={() => {
        setChecked(!checked);
      }}
    />
  );
}

export default CheckboxItem;