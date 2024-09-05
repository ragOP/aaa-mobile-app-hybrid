import React from 'react'
import { SafeAreaView } from 'react-native'
import { colors } from '../utils/constants'

const SafeAreaViewItem = ({children, style}) => {
  return (
    <SafeAreaView style={{...style, backgroundColor: colors.white}}>{children}</SafeAreaView>
  )
}

export default SafeAreaViewItem