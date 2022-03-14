import React, { useEffect, useState } from 'react'
import { Container } from '../../../styles';
import {
  Box, HStack, Text,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import GiftedChatCustom from './GiftedChatCustom';
import { useDispatch, useSelector } from 'react-redux';
import { clearChatBox, readMessage, setChatBox } from '../../../redux/reducers';
import ChatBoxLoading from './ChatBoxLoading';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BackButton, HeaderCustom } from '../../../components'

const ChatBox = ({ route }) => {
  const personId = route.params.personId;
  const chatBoxId = route.params.chatBoxId;
  const chatBox = useSelector(state => state.inbox.chatBox);
  const userInfo = useSelector(state => state.user.user)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setChatBox({ chatBoxId, personId, userId: userInfo.id }))

    return () => {
      dispatch(clearChatBox());
    }
  }, [personId])

  useFocusEffect(() => {
    dispatch(readMessage({ chatBoxId }))
  })

  if (!chatBox) {
    // return <ChatBoxLoading />
    return null;
  }

  return (
    <Container>
      <HeaderCustom title={chatBox.full_name} />
      <GiftedChatCustom chatBox={chatBox} />
    </Container>
  )
}



export { ChatBox }

