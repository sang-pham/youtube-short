import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import Video from 'react-native-video';
import {axiosAuth, baseURL, socketClient, parseImageToBlob} from '../../libs';
// import {Storage, API, graphqlOperation, Auth} from 'aws-amplify';
import {useRoute, useNavigation} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import styles from './styles';

const CreatePost = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [videoKey, setVideoKey] = useState(null);
  const [text, onChangeText] = useState('');
  const [paused, setPaused] = useState(false);
  const [auth, setAuth] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const togglePause = () => {
    setPaused(!paused);
  };
  const openDescriptionPanel = () => {
    setModalVisible(true);
  };

  const uploadToStorage = async () => {
    try {
      // console.log(route.params.video);
      let data = new FormData();
      data.append('caption', description);
      data.append('media', {
        name: `${Date.now()}.mp4`,
        uri: route.params.video.path,
        type: 'video/mp4',
      });
      
      let authToken = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      ).token;
      if(authToken) {
        fetch(`${baseURL}/upload-media`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: authToken,
          },
          method: 'POST',
          body: data,
        })
          .then(response => response.json())
          .then(data => {
            Alert.alert('Message', 'Video uploaded successfully', [
              {text: 'OK'},
            ]);
            navigation.navigate('Main')
          })
          .catch(error => console.log(error));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // retrieveUserSession();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback style={styles.container} onPress={togglePause}>
        <Video
          style={styles.player}
          source={{uri: route.params.video.path}}
          paused={paused}
          controls={false}
          muted={false}
          repeat={true}
          resizeMode="cover"
        />
      </TouchableWithoutFeedback>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={navigation.goBack}>
          <View style={styles.buttonLeft}>
            <Text style={styles.buttonText}>Back</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={openDescriptionPanel}>
          <View style={styles.buttonRight}>
            <Text style={styles.buttonText}>Publish</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPressOut={() => {
            setModalVisible(false);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Description</Text>
              <TextInput
                style={styles.input}
                onChangeText={setDescription}
                value={description}
                multiline={true}
                textAlignVertical={'top'}
                placeholder="Say something about you video"
              />

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={uploadToStorage}>
                <Text style={styles.textStyle}>Post my video now</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export {CreatePost};
