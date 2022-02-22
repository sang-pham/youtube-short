import React, {useState, useEffect} from 'react';
import Video from 'react-native-video';
import {View, Avatar} from 'native-base';
import {
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector} from 'react-redux';
import {baseURL} from '../../libs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function VideoPost({post, currentShowId}) {
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const userReducer = useSelector(state => state.user);

  const togglePause = () => {
    setPaused(!paused);
  };

  useEffect(() => {
    setPaused(currentShowId != post.id);
  }, [currentShowId]);

  return (
    <TouchableWithoutFeedback onPress={togglePause}>
      <View
        style={{
          width: '100%',
          height: Dimensions.get('window').height,
          justifyContent: 'center',
        }}>
        {/* {loading ? (
        <ActivityIndicator size="large" />
      ) : ( */}
        <Video
          source={{
            uri: post.uri,
          }}
          paused={paused}
          controls={false}
          muted={false}
          fullscreen={true}
          repeat={true}
          onReadyForDisplay={() => setLoading(false)}
          resizeMode="cover"
          style={styles.backgroundVideo}
        />
        <View style={styles.textContainer}>
          <Text style={{color: '#fff'}}>
            @{userReducer.user.user_name} 1h ago
          </Text>
          <Text style={{color: '#fff'}}>Sample Tags</Text>
          <Text style={{color: '#fff'}}>Sample Caption</Text>
        </View>
        <View style={styles.rightContainer}>
          <Avatar
            style={styles.avatarStyle}
            source={{
              uri: `${baseURL}/user/${userReducer.user.id}/avatar`,
            }}
          />
          <AntDesign
            name="heart"
            size={40}
            color="red"
            style={{
              marginTop: 20,
            }}
          />
          <Ionicons
            name="ios-chatbubble-ellipses-outline"
            size={40}
            color="#FFF"
            style={{
              marginTop: 20,
            }}
          />
          <MaterialCommunityIcons
            name="share"
            size={40}
            color="#FFF"
            style={{
              marginTop: 20,
            }}
          />
          <Text style={{color: '#fff'}}>Share</Text>
        </View>
        {/* )} */}
      </View>
    </TouchableWithoutFeedback>
  );
}

// export default function VideoPost({post}) {
//   return (
//     <View>
//       <Text>{JSON.stringify(post)}</Text>
//     </View>
//   );
// }

var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
  },
  textContainer: {
    position: 'absolute',
    bottom: '2%',
    left: '2%',
  },
  rightContainer: {
    position: 'absolute',
    right: 0,
    bottom: '2%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
  },
  avatarStyle: {
    borderWidth: 2,
    borderColor: '#FFF',
  },
});
