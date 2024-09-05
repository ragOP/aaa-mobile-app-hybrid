import React from "react";
import { FlatList } from "react-native";
import { defaultStyles } from "../utils/constants";

const FlatListItem = ({ renderItem, data, horizontal }) => {
  return (
    <FlatList
      style={{ paddingHorizontal: defaultStyles.paddingHorizantally }}
      horizontal={horizontal}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item?.id}
    />
  );
};

export default FlatListItem;
