import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export function ButtonInCall(props) {
  return (
    <View>
      <TouchableOpacity
        onPress={props.onPress}
        style={[
          {backgroundColor: props.backgroundColor},
          props.style,
          styles.button,
        ]}>
        <MaterialIcons name={props.iconName} size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    padding: 10,
    margin: 10,
    borderRadius: 100,
    width: 50,
    height: 50,
  },
});
