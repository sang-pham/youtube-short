import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import ImagePicker from 'react-native-image-crop-picker';
import styles from './styles';
import awaitAsyncGenerator from '@babel/runtime/helpers/esm/awaitAsyncGenerator';
import {useNavigation} from '@react-navigation/native';
import {AlertDialog, Button} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';

const RecordScreen = ({navigation}) => {
  const {isFocused} = navigation;
  const [isRecording, setIsRecording] = useState(false);
  useEffect(() => {});
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    const newMicrophonePermission = await Camera.requestMicrophonePermission();
  };
  const onRecord = async () => {
    const stopRecording = async () => {
      if (camera.current) {
        await camera.current.stopRecording();
      }
      setIsRecording(false);
      return;
    };

    if (isRecording) {
      stopRecording();
    }

    setIsRecording(true);

    if (camera.current) {
      camera.current.startRecording({
        onRecordingFinished: async video => {
          console.log(video);
          // 15 MB
          if (video.size > 15 * 1024 * 1024) {
            Alert.alert('Warning', 'Video upload is not larger than 15MB', [
              {text: 'OK'},
            ]);
            return;
          }
          navigation.navigate('CreatePost', {video, path});
        },
        onRecordingError: error => console.error(error),
      });
    }
  };

  const openPicker = async () => {
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
  };

  if (device == null) {
    return <Text>Hello</Text>;
  }
  checkPermission();
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
        style={isRecording ? styles.buttonStop : styles.buttonRecord}
      />
      <TouchableOpacity style={styles.pickButton} onPress={openPicker}>
        <AntDesign name="upload" size={24} color={'white'} />
      </TouchableOpacity>
    </View>
  );
};

export {RecordScreen};
