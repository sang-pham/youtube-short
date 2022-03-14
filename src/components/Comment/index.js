import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet} from 'react-native';
import {Text, Avatar, View, Input} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {baseURL, shortTimeDiff, socketClient} from '../../libs';

export default function Comment({comment}) {
  const userReducer = useSelector(state => state.user);

  const [openReply, setOpenReply] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [text, setText] = useState('');

  const toggleLike = async () => {
    console.log('handle like');
  };

  const toggleReply = () => {
    setText('');
    setOpenReply(!openReply);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
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
              display: 'flex',
              flexDirection: 'row',
              marginLeft: '2%',
            }}>
            <Text>Like</Text>
            <Text
              style={{
                marginLeft: '3%',
              }}
              onPress={toggleReply}>
              Reply
            </Text>
            <Text
              style={{
                marginLeft: '3%',
              }}>
              {shortTimeDiff(comment.createdAt)}
            </Text>
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
                w={200}
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
            <Text onPress={toggleCollapsed}>
              {collapsed ? 'See more' : 'See less'}
            </Text>
          )}
          {!collapsed &&
            comment.comments.map(_comment => (
              <Comment comment={_comment} key={_comment.id} />
            ))}
        </View>
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
