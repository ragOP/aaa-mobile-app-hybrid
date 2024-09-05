import React from "react";
import SimpleIcon from "react-native-vector-icons/SimpleLineIcons";

const SimpleLineIconsItem = ({ name, color, size }) => {
  return <SimpleIcon name={name} size={size} color={color} />;
};

export default SimpleLineIconsItem;
