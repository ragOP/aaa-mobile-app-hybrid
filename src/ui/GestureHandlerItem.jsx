import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const GestureHandlerItem = ({children}) => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>{children}</GestureHandlerRootView>
  )
}



export default GestureHandlerItem