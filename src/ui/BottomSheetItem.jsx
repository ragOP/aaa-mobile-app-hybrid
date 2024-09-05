import React, { useCallback, useMemo, useRef } from "react";
import BottomSheet, {BottomSheetScrollView, BottomSheetBackdrop} from "@gorhom/bottom-sheet";
import {StyleSheet} from "react-native";
import { colors } from "../utils/constants";

const BottomSheetItem = ({children, snapPercent, visible, indicator}) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => snapPercent, []);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

    const renderBackdrop = useCallback(
      (props) => (
        <BottomSheetBackdrop
          {...props}
          style={{opacity: 0, backgroundColor: "green"}}
          disappearsOnIndex={1}
          appearsOnIndex={2}
        />
      ),
      []
    );
  return (
    visible ? 
    <BottomSheet
      ref={bottomSheetRef}
      
      animateOnMount={true}
      handleIndicatorStyle={{
        backgroundColor: colors.primary,
        display: indicator,
      }}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChanges}
    >
      <BottomSheetScrollView contentContainerStyle={{flex: 1}}>{children}</BottomSheetScrollView>
    </BottomSheet> : null
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backfaceVisibility: "hidden",
    borderRadius: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    borderRadius: 0,
  },
});

export default BottomSheetItem;
