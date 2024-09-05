import React from 'react';
import { Chip } from "react-native-paper";
import { colors, defaultStyles, fontStyles } from '../utils/constants';
import { StyleSheet } from 'react-native';

const PaperChip = ({ backgroundColor, color, text, pressHandler, mode, icon, marginRight }) => {
  return (
    <Chip
      icon={icon}
      onPress={pressHandler}
      mode={mode}
      style={{...styles.chip, backgroundColor: backgroundColor, marginRight: marginRight ? marginRight : 0}}
      selectedColor={color}
      rippleColor={colors.primaryLight}
    >
      {text}
    </Chip>
  );
};

const styles = StyleSheet.create({
    chip: {
        borderRadius: 25,
        borderColor: colors.primary,
        fontFamily: fontStyles.semibold.fontFamily
    }
})

export default PaperChip