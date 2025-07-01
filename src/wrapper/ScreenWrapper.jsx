import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScreenWrapper = ({ children, style, contentContainerStyle, ...props }) => {
  return (
    <SafeAreaView style={[styles.safeArea, style]} edges={['top', 'bottom', 'left', 'right']}>
      {/* <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 410 : 0}
        {...props}
      > */}
        <View style={[styles.flex, contentContainerStyle]}>{children}</View>
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  flex: {
    flex: 1,
  },
});

export default ScreenWrapper;
