import {Avatar} from 'native-base';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ButtonInCall} from '../../../components';
import {axiosAuth, getAvatarUrl} from '../../../libs';

export default function GettingCall({join, hangup, remoteInfo}) {
  return (
    <View style={styles.container}>
      {remoteInfo && (
        <View style={styles.background}>
          <Avatar
            size="80px"
            source={{
              uri: getAvatarUrl(remoteInfo.id),
            }}
            style={{marginBottom: 20}}
          />
          <Text style={{color: '#000'}}>
            {remoteInfo.full_name} is calling...
          </Text>
        </View>
      )}
      <View style={styles.btnContainer}>
        <ButtonInCall onPress={join} iconName="call" backgroundColor="green" />
        <ButtonInCall
          onPress={hangup}
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
