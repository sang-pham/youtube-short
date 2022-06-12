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
  Dimensions,
} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import {Icon} from 'react-native-elements';
import Video from 'react-native-video';
import {axiosAuth, baseURL, socketClient, parseImageToBlob} from '../../libs';
// import {Storage, API, graphqlOperation, Auth} from 'aws-amplify';
import {useRoute, useNavigation} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import TagInput from 'react-native-tags-input';
import styles from './styles';

const CreatePost = () => {
  const mainColor = '#3ca897';
  const [modalVisible, setModalVisible] = useState(false);
  const [tags, updateTagState] = useState({
    tag: '',
    tagsArray: [],
  });
  const [tagsColor, setTagsColor] = useState(mainColor);
  const [tagsText, setTagsText] = useState('#fff');
  const [description, setDescription] = useState('');
  const [videoKey, setVideoKey] = useState(null);
  const [text, onChangeText] = useState('');
  const [paused, setPaused] = useState(false);
  const [auth, setAuth] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    console.log(tags);
  }, tags);
  const togglePause = () => {
    setPaused(!paused);
  };
  const openDescriptionPanel = () => {
    setModalVisible(true);
  };

  const uploadToStorage = async () => {
    try {
      console.log(tags.tagsArray);
      let data = new FormData();
      data.append('caption', description);
      data.append('media', {
        name: `${Date.now()}.mp4`,
        uri: route.params.video.path,
        type: 'video/mp4',
      });
      if (tags.tagsArray) {
        let tagsString = '';
        tags.tagsArray.forEach(item => {
          tagsString += item.toString() + ', '
        })
        console.log(tagsString);
        data.append('tags', tagsString);
      }

      let authToken = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      ).token;
      if (authToken) {
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
            navigation.navigate('Main');
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
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPressOut={() => {
          setModalVisible(false);
        }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
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
              <View>
                <TagInput
                  updateState={updateTagState}
                  tags={tags}
                  placeholder="Press space to add a tag"
                  label="Press space to add a tag"
                  labelStyle={{color: '#fff'}}
                  leftElement={
                    <Icon
                      name={'tag-multiple'}
                      type={'material-community'}
                      color={tags.tagsText}
                    />
                  }
                  leftElementContainerStyle={{marginLeft: 3}}
                  containerStyle={{width: Dimensions.get('window').width - 40}}
                  inputContainerStyle={[
                    styles.textInput,
                    {backgroundColor: tagsColor},
                  ]}
                  inputStyle={{color: tagsText}}
                  autoCorrect={false}
                  tagStyle={styles.tag}
                  tagTextStyle={styles.tagText}
                  keysForTag={' '}
                />
              </View>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={uploadToStorage}>
                <Text style={styles.textStyle}>Post my video now</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    </View>
  );
};

export {CreatePost};
