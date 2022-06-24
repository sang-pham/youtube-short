               import React, {useEffect, useMemo, useRef, useState} from 'react';
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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {AlertDialog, Button} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import Loading from '../../components/Loading';

function getMaxFps(format) {
  return format.frameRateRanges.reduce((prev, curr) => {
    if (curr.maxFrameRate > prev) return curr.maxFrameRate;
    else return prev;
  }, 0);
}

const RecordScreen = ({navigation}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = React.useState(false);
  const isFocused = useIsFocused();

  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;
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

    if (isRecording) {
      if (camera.current) {
        await camera.current.stopRecording();
      }
      setIsRecording(false);
      return;
    }

    setIsRecording(true);

    if (camera.current) {
      camera.current.startRecording({
        onRecordingFinished: video => {
          console.log(video);
          // 15 MB
          if (video.size > 15 * 1024 * 1024) {
            Alert.alert('Warning', 'Video upload is not larger than 15MB', [
              {text: 'OK'},
            ]);
            return;
          }
          // navigation.navigate('CreatePost', {video, path});
        },
        onRecordingError: error => {
          console.error(':(', error);
        },
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
        Alert.alert('Warning', error, [{text: 'OK'}]);
      });
  };

  if (!device) {
    return (
      <View style={{justifyContent: 'center', height: '100%'}}>
        <Loading />
      </View>
    );
  }
  // checkPermission();
  return (
    <View style={styles.container}>
      {hasPermission && (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isFocused}
            fps={30}
            video={true}
            audio={true}
          />
          <TouchableOpacity
            onPress={() => onRecord()}
            style={isRecording ? styles.buttonStop : styles.buttonRecord}
          />
          <TouchableOpacity style={styles.pickButton} onPress={openPicker}>
            <AntDesign name="upload" size={24} color={'white'} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export {RecordScreen};
