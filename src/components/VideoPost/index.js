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
import {v4} from 'uuid';
import {axiosAuth, baseURL, socketClient} from '../../libs';
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
  const [reactionLoaded, setLoadReaction] = useState(false);
  const [liked, setLiked] = useState(false);
  const [reload, setReload] = useState(v4());
  const [newCommentText, setNewCommentText] = useState('');
  const [trigger, setTrigger] = useState(v4());
  const userReducer = useSelector(state => state.user);

  const commentsRef = useRef(null);
  const reactionsRef = useRef(null);

  const togglePause = () => {
    setPaused(!paused);
  };

  const handleNewComment = useCallback((comment, newComment) => {
    if (comment.id == newComment.parent_id) {
      comment.comments.unshift(newComment);
      return;
    } else {
      for (const c of comment.comments) {
        handleNewComment(c, newComment);
      }
    }
  }, []);

  useEffect(() => {
    socketClient.on('new-comment', comment => {
      if (comment.video_post_id == post.id) {
        let _comments = [...commentsRef.current];

        if (comment.parent_id == null) {
          commentsRef.current.unshift(comment);
          return;
        }

        for (const _comment of _comments) {
          handleNewComment(_comment, comment);
        }
        commentsRef.current = _comments;
        setReload(v4());
      }
    });

    socketClient.on('new-unreaction-post', ({user_id, video_post_id}) => {
      if (video_post_id == post.id) {
        let idx = reactionsRef.current.findIndex(
          reaction => reaction.user.id == user_id,
        );
        if (idx >= 0) {
          reactionsRef.current.splice(idx, 1);
        }
      }
    });

    socketClient.on('new-reaction-post', reaction => {
      if (reaction.video_post_id == post.id) {
        reactionsRef.current.push(reaction);
        setReload(v4());
      }
    });

    (async () => {
      try {
        let res = await axiosAuth.get(`video-post/${post.id}/reactions`);
        if (res.status == 200) {
          reactionsRef.current = res.data.reactions;
          setLiked(
            !!res.data.reactions.find(
              reaction => reaction.user.id == userReducer.user.id,
            ),
          );
        }
        setLoadReaction(true);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    setPaused(currentShowId != post.id);
  }, [currentShowId]);

  const handleOpenComment = async () => {
    refRBSheet.current.open();
    if (!commentLoaded) {
      try {
        let res = await axiosAuth.get(`video-post/${post.id}/comments`);
        let _comments = res.data.comments;
        commentsRef.current = _comments;
        setLoadComment(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSend = () => {
    if (newCommentText) {
      socketClient.emit('post-comment', {
        text: newCommentText,
        video_post_id: post.id,
        parent_id: null,
        user_id: userReducer.user.id,
      });
      setNewCommentText('');
    }
  };

  const toggleReaction = () => {
    if (liked) {
      let idx = reactionsRef.current.findIndex(
        reaction => reaction.user.id == userReducer.user.id,
      );
      if (idx >= 0) {
        reactionsRef.current.splice(idx, 1);
      }
      socketClient.emit('unreaction-video-post', {
        user_id: userReducer.user.id,
        video_post_id: post.id,
      });
      setLiked(false);
    } else {
      socketClient.emit('reaction-video-post', {
        user_id: userReducer.user.id,
        type: 'like',
        video_post_id: post.id,
      });
      setLiked(true);
    }
  };

  const onOpenComment = () => {};

  const onCloseComment = () => {};

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
          {reactionLoaded && (
            <>
              <TouchableWithoutFeedback onPress={toggleReaction}>
                {liked ? (
                  <AntDesign
                    name="heart"
                    size={40}
                    color="red"
                    style={{
                      marginTop: 20,
                    }}
                  />
                ) : (
                  <AntDesign
                    name="hearto"
                    size={40}
                    color="white"
                    style={{
                      marginTop: 20,
                    }}
                  />
                )}
              </TouchableWithoutFeedback>
              <Text
                style={{
                  color: '#fff',
                }}>
                {reactionsRef.current.length}
              </Text>
            </>
          )}
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
          onOpen={onOpenComment}
          onClose={onCloseComment}
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
          {commentsRef.current && (
            <FlatList
              style={{
                height: '50%',
                marginBottom: '15%',
                overflow: 'scroll',
              }}
              data={commentsRef.current}
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
              value={newCommentText}
              onChangeText={value => setNewCommentText(value)}
              size="sm"
            />
            <MaterialCommunityIcons name="file" size={20} color="#ccc" />
            <TouchableWithoutFeedback
              onPress={handleSend}
              disabled={!newCommentText}>
              <MaterialCommunityIcons name="send" size={20} color="#198ae6" />
            </TouchableWithoutFeedback>
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
