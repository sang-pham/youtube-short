import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, SafeAreaView} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import Video from "react-native-video";

// import {Storage, API, graphqlOperation, Auth} from 'aws-amplify';
import {useRoute, useNavigation} from '@react-navigation/native';

import styles from './styles';

const CreatePost = () => {
  const [description, setDescription] = useState('');
  const [videoKey, setVideoKey] = useState(null);

  const route = useRoute();
  const navigation = useNavigation();
  const uploadToStorage = async (imagePath) => {
    try {
      const response = await fetch(imagePath);

      const blob = await response.blob();

      const filename = `${uuidv4()}.mp4`;
      // const s3Response = await Storage.put(filename, blob);
      // console.log(filename);
      // setVideoKey(s3Response.key);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // uploadToStorage(route.params.videoData);
    console.log(route.params.videoUri);
  }, []);

  

  return (
    <View style={styles.container}>
      <TextInput
        value={description}
        onChangeText={setDescription}
        numberOfLines={5}
        placeholder={'Description'}
        style={styles.textInput}
      />
    <SafeAreaView style={styles.container}>
      <Video
        style={styles.player}
        source={{uri: route.params.videoUri}}
        controls
        resizeMode="contain"
      />
    </SafeAreaView>

      <TouchableOpacity >
        <View style={styles.button}>
          <Text style={styles.buttonText}>Publish</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export {CreatePost};