import React, {useState, useEffect, useRef, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {Text, Avatar, View, Input} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {axiosAuth, baseURL, shortTimeDiff, socketClient} from '../../libs';
import ReactionList from '../ReactionList';

export default function Comment({comment, dispatchReply}) {
  const userReducer = useSelector(state => state.user);
  const refRBSheet = useRef();

  const [openReply, setOpenReply] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [text, setText] = useState('');
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    socketClient.on('comment-reaction-change', ({comment_id, reactions}) => {
      if (comment_id == comment.id) {
        setReactions(reactions);
      }
    });
    (async () => {
      try {
        let res = await axiosAuth.get(`/comment/${comment.id}/reactions`);
        if (res.status == 200) {
          let {reactions} = res.data;
          setReactions(reactions || []);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const isLiked = useMemo(() => {
    if (reactions.length) {
      return (
        reactions.find(reaction => reaction.user.id == userReducer.user.id) !=
        null
      );
    }
    return false;
  }, [reactions]);

  const toggleReply = () => {
    if (comment.parent_id != null) {
      dispatchReply && dispatchReply();
    } else {
      setText('');
      setOpenReply(!openReply);
    }
  };

  const toggleReaction = () => {
    socketClient.emit('reaction-comment', {
      comment_id: comment.id,
      user_id: userReducer.user.id,
      video_post_id: comment.video_post_id,
    });
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onDispatchReply = () => {
    setText('');
    setOpenReply(true);
    // setCollapsed(true);
  };

  const handleSend = () => {
    if (text) {
      console.log('call');
      socketClient.emit('post-comment', {
        text,
        video_post_id: comment.video_post_id,
        parent_id: comment.id,
        user_id: userReducer.user.id,
      });
      setText('');
      setCollapsed(true);
      setOpenReply(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Avatar
          size="sm"
          source={{
            uri: `${baseURL}/user/${comment.user_id}/avatar`,
          }}
        />
        <View
          style={{
            marginLeft: '3%',
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <View
            style={{
              backgroundColor: '#e6e6e6',
              padding: '2%',
              borderRadius: 10,
            }}>
            <Text style={styles.userName}>{comment.user.user_name}</Text>
            <Text>{comment.text}</Text>
          </View>
          <View
            style={{
              width: '80%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '40%',
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  marginRight: '8%',
                }}>
                {shortTimeDiff(comment.createdAt)}
              </Text>
              <Text
                style={{
                  marginRight: '8%',
                  color: isLiked ? 'blue' : 'black',
                }}
                onPress={toggleReaction}>
                Like
              </Text>
              <Text onPress={toggleReply}>Reply</Text>
            </View>
            {reactions && reactions.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text>{reactions.length}</Text>
                <TouchableWithoutFeedback
                  onPress={() => {
                    refRBSheet.current.open();
                  }}>
                  <AntDesign
                    name="like1"
                    size={16}
                    style={{
                      color: 'blue',
                    }}
                  />
                </TouchableWithoutFeedback>
              </View>
            )}
          </View>
          {openReply && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '80%',
              }}>
              <Avatar
                size="sm"
                source={{
                  uri: `${baseURL}/user/${userReducer.user.id}/avatar`,
                }}
              />
              <Input
                m={1}
                py={1}
                w={Dimensions.get('window').width - 150}
                placeholder="Write your comment"
                size="sm"
                value={text}
                onChangeText={value => setText(value)}
              />
              <MaterialCommunityIcons name="file" size={20} color="#ccc" />
              <MaterialCommunityIcons
                name="send"
                size={20}
                color="#198ae6"
                onPress={handleSend}
              />
            </View>
          )}
          {comment.comments != null && comment.comments.length > 0 && (
            <Text
              onPress={toggleCollapsed}
              style={{
                color: '#42aaf5',
              }}>
              {collapsed ? 'See more' : 'See less'}
            </Text>
          )}
          {!collapsed &&
            comment.comments.map(_comment => (
              <Comment
                comment={_comment}
                key={_comment.id}
                dispatchReply={onDispatchReply}
              />
            ))}
        </View>
        <RBSheet
          ref={refRBSheet}
          height={400}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(144, 147, 150, 0.5)',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
            container: {
              position: 'relative',
            },
          }}>
          <ReactionList reactions={reactions} />
        </RBSheet>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '3%',
    marginLeft: '2%',
    marginTop: '2%',
  },
  userName: {
    fontWeight: '500',
  },
});
