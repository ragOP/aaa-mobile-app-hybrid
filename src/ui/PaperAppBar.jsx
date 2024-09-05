import React from "react";
import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { colors, defaultStyles } from "../utils/constants";

const PaperAppBar = ({ children, style }) => {
  return <Appbar.Header style={{...styles.header, ...style}}>{children}</Appbar.Header>;
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: defaultStyles.paddingHorizantally,
  },
});

export default PaperAppBar;
