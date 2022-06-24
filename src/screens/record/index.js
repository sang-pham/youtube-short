import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import ImagePicker from 'react-native-image-crop-picker';
import styles from './styles';
import awaitAsyncGenerator from '@babel/runtime/helpers/esm/awaitAsyncGenerator';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {AlertDialog, Button} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/core';

const RecordScreen = ({navigation}) => {
  // const {isFocused} = navigation;
  const [hasPermission, setHasPermission] = React.useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState('');
  // React.useEffect(() => {
  //   ; (async () => {
  //     const status = await Camera.requestCameraPermission()
  //     setHasPermission(status === 'authorized')
  //   })()
  // }, [])
  useEffect(() => {
    if (videoUri) {
      navigation.navigate('CreatePost', {videoUri});
    }
  }, [videoUri]);
  const camera = useRef(null);
  // const devices = useCameraDevices();
  // const device = devices.back;
  const isFocused = useIsFocused();
  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    const newMicrophonePermission = await Camera.requestMicrophonePermission();
    setHasPermission(
      newCameraPermission === 'authorized' &&
        newMicrophonePermission === 'authorized',
    );
  };

  useEffect(() => {
    checkPermission();
  });

  const onRecord = async () => {
    if (!isRecording) {
      setIsRecording(true);
      const {uri, codec = 'mp4'} = await camera.current.recordAsync();
      if (uri) {
        setVideoUri(uri);
        console.info(uri);
      }
    } else {
      setIsRecording(false);
      camera.current.stopRecording();
    }

    // if (camera.current) {
    //   camera.current.startRecording({
    //     onRecordingFinished: async video => {
    //       console.log(video);
    //       // 15 MB
    //       if (video.size > 15 * 1024 * 1024) {
    //         Alert.alert('Warning', 'Video upload is not larger than 15MB', [
    //           {text: 'OK'},
    //         ]);
    //         return;
    //       }
    //       navigation.navigate('CreatePost', {video, path});
    //     },
    //     onRecordingError: error => console.error(error),
    //   });
    // }
  };

  const openPicker = async () => {
    try {
      ImagePicker.openPicker({
        mediaType: 'video',
      })
        .then(video => {
          console.log(video);
          // 15 MB
          if (video.size > 15 * 1024 * 1024) {
            throw 'Video upload is not larger than 15MB';
          }
          navigation.navigate('CreatePost', {video});
        })
        .catch(error => {
          // Toast.show({
          //   type: 'error',
          //   text1: 'File upload',
          //   text2: error,
          // });
          Alert.alert('Warning', error, [{text: 'OK'}]);
        });
    } catch (error) {
      console.log(error);
    }
    {
      ImagePicker.openPicker({
        mediaType: 'video',
      })
        .then(video => {
          console.log(video);
          // 15 MB
          if (video.size > 15 * 1024 * 1024) {
            throw 'Video upload is not larger than 15MB';
          }
          navigation.navigate('CreatePost', {video});
        })
        .catch(error => {
          Alert.alert('Warning', error, [{text: 'OK'}]);
        });
    }
  };

  // if (device == null) {
  //   return <Text>Hello</Text>;
  // }
  // checkPermission();
  return (
    <View style={styles.container}>
      <RNCamera
        ref={camera}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />

      <TouchableOpacity
        onPress={() => onRecord()}
        // onPress={() => setIsRecording(!isRecording)}

        style={isRecording ? styles.buttonStop : styles.buttonRecord}
      />
      <TouchableOpacity style={styles.pickButton} onPress={openPicker}>
        <Image
          source={require('../../public/images/icon-image.png')}
          style={styles.imageButton}
        />
      </TouchableOpacity>
    </View>
  );
};

export {RecordScreen};
