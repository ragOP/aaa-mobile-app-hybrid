import React from 'react';
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const MaterialIconsItem = ({name, color, size}) => {
  return (
    <MaterialIcon
      name={name}
      size={size}
      color={color}
    />
  );
}

export default MaterialIconsItem