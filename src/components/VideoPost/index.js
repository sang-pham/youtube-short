import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import Video from 'react-native-video';
import {View, Avatar, Input} from 'native-base';
import {
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import {useSelector} from 'react-redux';
import {axiosAuth, baseURL} from '../../libs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import Comment from '../Comment';
import {timeDiff} from '../../libs';
import {ScrollView} from 'react-native-gesture-handler';

export default function VideoPost({post, currentShowId}) {
  //bottom sheet
  const refRBSheet = useRef();

  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [commentLoaded, setLoadComment] = useState(false);
  const [comments, setComments] = useState([]);
  const userReducer = useSelector(state => state.user);

  const togglePause = () => {
    setPaused(!paused);
  };

  useEffect(() => {
    setPaused(currentShowId != post.id);
  }, [currentShowId]);

  const handleOpenComment = async () => {
    refRBSheet.current.open();
    if (!commentLoaded) {
      try {
        let res = await axiosAuth.get(`video-post/${post.id}/comments`);
        let _comments = res.data.comments;
        setComments(_comments);
        setLoadComment(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

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
            uri: `${baseURL}/video-post/${post.id}/video`,
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
            @{post.user.user_name} . {timeDiff(post.createdAt)}
          </Text>
          <Text style={{color: '#fff'}}>
            {post.tags.slice(0, 3).reduce((tagStr, currentTag) => {
              return tagStr + `#${currentTag.name} `;
            }, '')}
          </Text>
          <Text style={{color: '#fff'}}>{post.caption}</Text>
        </View>
        <View style={styles.rightContainer}>
          <Avatar
            style={styles.avatarStyle}
            source={{
              uri: `${baseURL}/user/${post.user_id}/avatar`,
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
          <TouchableWithoutFeedback onPress={handleOpenComment}>
            <Ionicons
              name="ios-chatbubble-ellipses-outline"
              size={40}
              color="#FFF"
              style={{
                marginTop: 20,
              }}
            />
          </TouchableWithoutFeedback>
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
        <RBSheet
          ref={refRBSheet}
          height={600}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
            container: {
              position: 'relative',
            },
          }}>
          {comments.length > 0 && (
            <FlatList
              style={{
                height: '50%',
                marginBottom: '15%',
                overflow: 'scroll',
              }}
              data={comments}
              renderItem={({item}) => <Comment comment={item} />}
            />
          )}
          <View
            style={{
              position: 'absolute',
              bottom: '3%',
              left: 0,
              right: 0,
              padding: '1%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Avatar
              source={{
                uri: `${baseURL}/user/${userReducer.user.id}/avatar`,
              }}
            />
            <Input
              m={1}
              py={1}
              w={300}
              placeholder="Write your comment"
              size="sm"
            />
            <MaterialCommunityIcons name="file" size={20} color="#ccc" />
            <MaterialCommunityIcons name="send" size={20} color="#198ae6" />
          </View>
        </RBSheet>
        {/* )} */}
      </View>
    </TouchableWithoutFeedback>
  );
}

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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bottomSheet: {
    marginHorizontal: 24,
  },
});
