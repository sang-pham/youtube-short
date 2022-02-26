import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, InputToolbar } from '../../../components/GiftedChat'
import {
  Avatar, Box, VStack, Spacer, HStack, Text,
  Input, Icon, Divider, Flex, ScrollView, KeyboardAvoidingView,
  Center, Heading, Button, View
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../../redux/reducers';
import { v4 } from 'uuid';
import { getAvatarUrl, getFullName } from '../../../libs';


export default function Message({
  chatBox
}) {
  const userInfo = useSelector(state => state.user.user);
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {


    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: chatBox.person_id,
          name: chatBox.full_name,
          avatar: getAvatarUrl(chatBox.person_id),
        },
        image: 'https://picsum.photos/200/300'
      },
    ])

    // dispatch(getMessages({ inboxId }));
  }, [])

  const handleSendMessage = () => {
    if (!textInput) {
      return;
    }

    setMessages(previousMessages => GiftedChat.append(previousMessages, [{
      _id: v4(),
      text: textInput,
      createdAt: new Date(),
      user: {
        _id: userInfo.id,
      },
      pending: true,
    }])
    )
    dispatch(sendMessage({
      conversationId: chatBox.id,
      senderId: userInfo.id,
      receiverId: chatBox.person_id,
      text: textInput
    }));
    setTextInput('');
  }


  const onChangeText = (text) => {
    setTextInput(text);
  }


  return (
    <>
      <GiftedChat
        messages={messages}
        user={{
          _id: userInfo.id,
        }}
        renderInputToolbar={() => null}
      />
      <Box borderTopWidth="1" borderColor="coolGray.200" p={3} mt={-5} zIndex={-1}>
        <HStack alignItems='center' justifyContent={'center'}>
          <Input placeholder="Send a message..." variant="filled"
            multiline={true}
            borderRadius={5} py={2} p={3} fontSize={16} borderWidth={0} mt={2} w='85%'
            value={textInput} onChangeText={onChangeText}
            InputRightElement={<Icon as={
              <MaterialIcons
                style={{ padding: 5 }}
                name="insert-emoticon"
                size={24}
                color="#000"
              />} />} />

          <FontAwesome
            style={{ marginLeft: 15, marginTop: 10 }}
            name="send"
            size={24}
            onPress={handleSendMessage}
            color={textInput ? 'red' : "grey"}
          />
        </HStack>
      </Box>
    </>
  )
}

