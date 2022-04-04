import React, {useEffect, useState} from 'react';
import {Box, Button, HStack, Text} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import GiftedChatCustom from './GiftedChatCustom';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearChatBox,
  readMessage,
  setChatBox,
  startCall,
} from '../../../redux/reducers';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BackButton, HeaderCustom, Container} from '../../../components';

const ChatBox = ({route, navigation}) => {
  const personId = route.params.personId;
  const chatBoxId = route.params.chatBoxId;
  const chatBox = useSelector(state => state.inbox.chatBox);
  const userInfo = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // const navigation = useNavigation();
    dispatch(setChatBox({chatBoxId, personId, userId: userInfo.id}));

    return () => {
      dispatch(clearChatBox());
    };
  }, [personId]);

  useFocusEffect(() => {
    dispatch(readMessage({chatBoxId}));
  });

  if (!chatBox) {
    return null;
  }

  const startVideoCall = () => {
    navigation.push('WebRTCCall', {
      senderId: userInfo.id,
      receiverId: personId,
      chatBoxId,
      isCaller: true,
    });
    dispatch(
      startCall({senderId: userInfo.id, receiverId: personId, chatBoxId}),
    );
  };

  return (
    <Container>
      <HeaderCustom
        title={chatBox.full_name}
        leftElement={<BackButton />}
        rightElement={
          chatBoxId && (
            <AntDesign
              name="videocamera"
              size={24}
              color="black"
              onPress={startVideoCall}
            />
          )
        }
      />
      <GiftedChatCustom chatBox={chatBox} />
    </Container>
  );
};

export {ChatBox};
