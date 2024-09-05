import React from "react";
import { defaultStyles, fontStyles } from "../utils/constants";
import { TextInput } from "react-native-paper";

const PaperTextInput = ({
  label,
  onChangeText,
  limit,
  text,
  keyboardType,
  styling,
  placeholderTextColor,
  outlineColor,
  activeOutlineColor,
  placeholder,
  disabled=false
}) => {
  return (
    <TextInput
      mode="outlined"
      placeholder={placeholder}
      outlineColor={outlineColor}
      keyboardType={keyboardType}
      // label={label}
      value={text}
      maxLength={limit}
      disabled={disabled}
      onChangeText={onChangeText}
      style={{ ...styling, fontFamily: fontStyles.semibold.fontFamily }}
      placeholderTextColor={placeholderTextColor}
      scrollEnabled={false}
      textAlignVertical="center"
      outlineStyle={{borderColor: activeOutlineColor}}
      activeOutlineColor={activeOutlineColor}
      theme={{
        roundness: defaultStyles.borderRadius,
        
      }}
    />
  );
};

export default PaperTextInput;
