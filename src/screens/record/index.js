import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
// import {RNCamera} from 'react-native-camera';
import { useCameraDevices, Camera } from "react-native-vision-camera"
import ImagePicker from "react-native-image-crop-picker";
import styles from './styles';
import awaitAsyncGenerator from '@babel/runtime/helpers/esm/awaitAsyncGenerator';
import {useNavigation} from '@react-navigation/native';
import { Button } from 'native-base';

const RecordScreen = ({navigation}) => {
  const {isFocused} = navigation
  const [isRecording, setIsRecording] = useState(false);
  useEffect(() => {
    
  })
  const camera = useRef(null);
  const devices = useCameraDevices()
  const device = devices.back
  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission()
    const newMicrophonePermission = await Camera.requestMicrophonePermission()
  }
  const onRecord = async () => {
    const stopRecording = async () => {
      if (camera.current) await camera.current.stopRecording();
      setIsRecording(false);
      return;
    };

    if (isRecording) {
      stopRecording();
    }

    setIsRecording(true);

    if (camera.current)
      camera.current.startRecording({
        onRecordingFinished: async (video) => {
          const blob = await fetch(video.path)
          navigation.navigate('CreatePost', { video, path });
        },
        onRecordingError: (error) => console.error(error),
      });
  };

  const openPicker = async () => {
    ImagePicker.openPicker({
      mediaType: "video",
    }).then((video) => {
      // const blob = fetch(video.path)
      navigation.navigate('CreatePost', { video });
    });
  }

  if (device == null) return <Text>Hello</Text>
  checkPermission()
  return (
    <View style={styles.container}>
      <Camera
      ref={camera}
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      video={true}
      audio={true}
      />
      <TouchableOpacity
      onPress={onRecord}
      style={
        isRecording ? styles.buttonStop : styles.buttonRecord
      }
      />
      <TouchableOpacity style={styles.pickButton} onPress={openPicker}>
        <Image source={require('../../public/images/discovery.png')} style={styles.imageButton}/>
      </TouchableOpacity>
      </View>
   
  );
};

export {RecordScreen};