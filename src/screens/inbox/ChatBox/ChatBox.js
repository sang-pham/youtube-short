import React, { useEffect, useState } from 'react'
import { Container } from '../../../styles';
import {
  Box, HStack, Text,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomGiftedChat from './CustomGiftedChat';
import { useDispatch, useSelector } from 'react-redux';
import { readMessage, setChatBox } from '../../../redux/reducers';
import ChatBoxLoading from './ChatBoxLoading';
import { useFocusEffect } from '@react-navigation/native';

const ChatBox = ({ navigation, route }) => {
  const personId = route.params.personId;
  const chatBoxId = route.params.chatBoxId;
  const chatBox = useSelector(state => state.inbox.chatBox);
  const userInfo = useSelector(state => state.user.user)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setChatBox({ chatBoxId, personId, userId: userInfo.id }))
  }, [personId])


  useFocusEffect(() => {
    dispatch(readMessage({ chatBoxId }))
  })

  if (!chatBox) {
    return <ChatBoxLoading />
  }

  return (
    <Container>
      <Header chatBox={chatBox} navigation={navigation} />
      <CustomGiftedChat chatBox={chatBox} />
    </Container>
  )
}

const Header = ({ chatBox, navigation }) => {

  return (
    <Box borderBottomWidth="1"
      borderColor="coolGray.200" py={4} px={3} mb={2}>
      <HStack space={3} justifyContent="space-between">
        <MaterialIcons
          name="arrow-back"
          size={24}
          color="black"
          onPress={navigation.goBack}
        />
        <Text _dark={{ color: "warmGray.50" }}
          fontSize={'xl'}
          color="coolGray.800" bold>
          {chatBox.full_name}
        </Text>
        <Entypo
          name="dots-three-vertical"
          size={20}
          color="black"
        />
      </HStack>
    </Box>
  )
}


export { ChatBox }

