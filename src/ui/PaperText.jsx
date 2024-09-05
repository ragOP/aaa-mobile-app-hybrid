import React from "react";
import { Text } from "react-native-paper";

const PaperText = ({ text, variant, fontStyling }) => {
  return (
    <Text variant={variant} style={fontStyling}>
      {text}
    </Text>
  );
};
export default PaperText;
