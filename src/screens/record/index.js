import React, {useRef, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';

import styles from './styles';
import awaitAsyncGenerator from '@babel/runtime/helpers/esm/awaitAsyncGenerator';
import {useNavigation} from '@react-navigation/native';

const RecordScreen = ({navigation}) => {
  const {isFocused} = navigation
  const [isRecording, setIsRecording] = useState(false);
  const camera = useRef();
  const onRecord = async () => {
    if (isRecording) {
      camera.current.stopRecording();
    } else {
      const data = await camera.current.recordAsync();
      navigation.navigate('CreatePost', {videoUri: data.uri});
    }
  };

  return (
    <View style={styles.container}>
      {isFocused && <RNCamera
        ref={camera}
        onRecordingStart={() => setIsRecording(true)}
        onRecordingEnd={() => setIsRecording(false)}
        style={styles.preview}
      />}
      <TouchableOpacity
        onPress={onRecord}
        style={
          isRecording ? styles.buttonStop : styles.buttonRecord
        }
      />
    </View>
  );
};

export {RecordScreen};