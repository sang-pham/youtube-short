import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ButtonInCall} from '../../../components';

export default function GettingCall(props) {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Text style={{color: '#fff'}}>Calling...</Text>
      </View>
      <View style={styles.btnContainer}>
        <ButtonInCall
          onPress={props.join}
          iconName="call"
          backgroundColor="green"
        />
        <ButtonInCall
          onPress={props.hangup}
          iconName="call-end"
          backgroundColor="red"
          style={{marginLeft: 30}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  btnContainer: {
    flexDirection: 'row',
    bottom: 30,
  },
});
