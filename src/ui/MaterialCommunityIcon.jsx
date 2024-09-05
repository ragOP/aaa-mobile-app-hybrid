import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MaterialCommunityIconsItem = ({ name, color, size }) => {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
};

export default MaterialCommunityIconsItem;
