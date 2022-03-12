import React from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';

const Loading = () => {
  return <ActivityIndicator size="large" />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
  },
});

export default Loading;
