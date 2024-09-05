import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const ShimmerEffect = ({ children, visible, style }) => {
  const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
  return (
    <ShimmerPlaceHolder style={style} visible={visible}>
      {children}
    </ShimmerPlaceHolder>
  );
};

export default ShimmerEffect;
