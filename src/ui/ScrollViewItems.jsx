import React, {memo} from "react";
import { ScrollView } from "react-native";

const ScrollViewItems = memo(({ children, style, horizontal, stickyHeaderIndices }) => {
  return (
    <ScrollView
      stickyHeaderIndices={stickyHeaderIndices}
      nestedScrollEnabled={true}
      contentContainerStyle={style}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={true}
    >
      {children}
    </ScrollView>
  );
});

export default ScrollViewItems;
