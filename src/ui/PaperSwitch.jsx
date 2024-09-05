import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Switch } from "react-native-paper";
import { colors } from "../utils/constants";

const PaperSwitch = ({styling}) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return <Switch thumbColor={colors.primary} color={colors.greyText} style={{...styling, ...styles.switch}} value={isSwitchOn} onValueChange={onToggleSwitch} />;
};

const styles = StyleSheet.create({
    switch: {
        height: 40
    }
})
export default PaperSwitch;
