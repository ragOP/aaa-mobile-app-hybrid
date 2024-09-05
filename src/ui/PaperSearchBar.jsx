import React from "react";
import { Searchbar } from "react-native-paper";
import { StyleSheet } from "react-native";
import { colors, defaultStyles, fontStyles } from "../utils/constants";

const PaperSearchBar = ({
  placeholder,
  onChangeSearch,
  searchQuery,
  onBlur,
  onFocus,
  onPressIn,
  style
}) => {
  return (
    <Searchbar
      style={{...styles.searchBarItem, ...style}}
      placeholder={placeholder}
      onChangeText={onChangeSearch}
      value={searchQuery}
      placeholderTextColor={colors.greyText}
      onBlur={onBlur}
      onFocus={onFocus}
      onPressIn={onPressIn}
    />
  );
};

const styles = StyleSheet.create({
  searchBarItem: {
    borderRadius: defaultStyles.searchRadius,
    backgroundColor: colors.white,
    fontFamily: fontStyles.regular.fontFamily,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: defaultStyles.borderRadius,
    elevation: 10,
    color: colors.secondary
  },
});

export default PaperSearchBar;
