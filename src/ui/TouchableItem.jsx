import React, {memo} from 'react';
import { TouchableOpacity } from 'react-native';

const TouchableItem = memo(({children, pressHandler, styling, opacity}) => {
  return (
    <TouchableOpacity activeOpacity={opacity ? 0.9 : 1} style={styling} onPress={pressHandler}>{children}</TouchableOpacity>
  )
});

export default TouchableItem;