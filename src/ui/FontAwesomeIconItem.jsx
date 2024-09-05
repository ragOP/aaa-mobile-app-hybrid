import React from "react";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";

const FontAwesomeIconsItem = ({ name, color, size }) => {
  return <FontAwesomeIcons name={name} size={size} color={color} />;
};

export default FontAwesomeIconsItem;
