import React from 'react';
import { List } from "react-native-paper";
import PaperText from './PaperText';
import { StyleSheet } from 'react-native';
import { colors, defaultStyles, fontStyles } from '../utils/constants';

const PaperAccordion = ({children, title, accStyle}) => {
  return (
    <List.AccordionGroup>
      <List.Accordion
        theme={{colors: {primary: colors.white}}}
        rippleColor={colors.primaryExtraLight}
        style={{...styles.accordion, ...accStyle}}
        titleStyle={styles.title}
        descriptionStyle={styles.desc}
        title={title}
        id="1"
        
      >
        {
          children
        }
      </List.Accordion>
    </List.AccordionGroup>
  );
}

const styles = StyleSheet.create({
  accordion: {
    backgroundColor: colors.white,
    marginBottom: 1,
  },
  title: {
    fontFamily: fontStyles.bold.fontFamily,
    color: colors.black,
  },
  desc: {
    backgroundColor: colors.white,
    margin: 0,
    padding: 0,
    width: "100%",
  }
});

export default PaperAccordion