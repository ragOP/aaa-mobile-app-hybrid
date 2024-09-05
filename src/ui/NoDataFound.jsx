import React from 'react'
import ViewItem from './ViewItem'
import PaperText from './PaperText'
import { StyleSheet,Image } from 'react-native'
import { colors, fontStyles } from '../utils/constants'

const NoDataFound = ({text}) => {
  return (
    <ViewItem styling={styles.container}>
        <PaperText text={text} fontStyling={styles.text} variant="titleMedium" />
        {/* <Image
            source={require("../../assets/images/profileScreen/male.png")}
            style={styles.loginImage4}
          /> */}
    </ViewItem>
  )
}

const styles = StyleSheet.create({
    container:{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontFamily: fontStyles.semibold.fontFamily,
        color: colors.black
    },
    image: {
      width: 300,
      height: 300,
      resizeMode: 'cover',
    },
})

export default NoDataFound