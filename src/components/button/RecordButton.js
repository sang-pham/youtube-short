import React from 'react';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { View, StyleSheet, TouchableOpacity } from 'react-native';


const RecordButton = ({ home }) => {
  return (
    <View style={[
      {
        backgroundColor: home ? '#fff' : '#000',
      },
      styles.button,

    ]}>
      <TouchableOpacity style={{ activeOpacity: 1, }}  >
        <FontAwesome5 name="plus" size={18} color={home ? '#000' : '#fff'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    width: 45,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderLeftColor: '#20d5ea',
    borderRightColor: '#ec376d'
  },
});


export { RecordButton };