import React from "react";
import EntypoIconItem from "react-native-vector-icons/Entypo";

const EntypoIcon = ({ name, color, size }) => {
  return <EntypoIconItem name={name} size={size} color={color} />;
};

export default EntypoIcon;
