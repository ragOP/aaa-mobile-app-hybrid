import React from "react";
import { ActivityIndicator } from "react-native-paper";

const Loader = ({ size, color }) => {
  return <ActivityIndicator animating={true} size={size} color={color} />;
};

export default Loader;
