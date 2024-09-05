import React from 'react';
import TouchableItem from './TouchableItem';
import PaperText from './PaperText';
import { fontStyles } from '../utils/constants';

const PaperButton = ({
  text,
  styling,
  pressHandler,
  textColor,
  buttonColor,
}) => {
  return (
    <TouchableItem opacity={1} pressHandler={pressHandler} styling={styling}>
      <PaperText text={text} fontStyling={{color: textColor, fontFamily: fontStyles.semibold.fontFamily, textAlign: 'center'}} variant="titleSmall" />
    </TouchableItem>
  );
};

export default PaperButton;