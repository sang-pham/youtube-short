import React, { useEffect, useState } from 'react'
import { Container } from '../../../styles';
import {
  Avatar, Box, VStack, Spacer, HStack, Text,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { axiosAuth, getFullName, } from '../../../libs';
import Message from './Message';
import { useDispatch, useSelector } from 'react-redux';
import { setChatBox } from '../../../redux/reducers';
import ChatBoxLoading from './ChatBoxLoading';

const ChatBox = ({ navigation, route }) => {
  const personId = route.params.personId;
  const chatBoxId = route.params.chatBoxId;
  const chatBox = useSelector(state => state.inbox.chatBox);
  const userInfo = useSelector(state => state.user.user)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setChatBox({ chatBoxId, personId, userId: userInfo.id }))

  }, [personId])

  if (!chatBox) {
    return <ChatBoxLoading />
  }

  return (
    <Container>
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
      <Message chatBox={chatBox} />
    </Container>
  )
}


export { ChatBox }

