import React, { useState, useCallback, useEffect } from 'react'
import { Actions, GiftedChat, InputToolbar, LoadEarlier } from '../../../components/GiftedChat'
import {
  Avatar, Box, VStack, Spacer, HStack, Text,
  Input, Icon, Divider, Flex, ScrollView, KeyboardAvoidingView,
  Center, Heading, Button, View
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, getMessages } from '../../../redux/reducers';
import ChatBoxLoading from './ChatBoxLoading';

const OPTIONS_MESSAGE = ['Copy', 'Reply', 'Cancel', 'Delete']

export default function CustomGiftedChat({ chatBox }) {
  const userInfo = useSelector(state => state.user.user);
  const messages = useSelector(state => state.inbox.messages);
  const msgLoading = useSelector(state => state.inbox.msgLoading);
  const [textInput, setTextInput] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMessages({ chatBoxId: chatBox.id }));
  }, [chatBox])


  const handleSendMessage = () => {
    if (!textInput) {
      return;
    }
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

  const loadEarlier = () => {
    console.log('loading');
  }


  if (msgLoading) {
    return <ChatBoxLoading />
  }

  return (
    <>
      <GiftedChat
        messages={messages}
        user={{
          _id: userInfo.id,
        }}
        onLongPress={(context, message) => {
          const options = OPTIONS_MESSAGE;
          context.actionSheet().showActionSheetWithOptions(
            {
              options: options,
              cancelButtonIndex: options.length - 2,
              destructiveButtonIndex: options.length - 1,
              withIcon: true
            },
            (buttonIndex) => {
              console.log(buttonIndex);
            },
          )
        }}
        onPressActionButton={() => { console.log('asfasf') }}
        renderActions={(props) => <Actions {...props} />}
        renderComposer={(props) =>
          <Input placeholder="Send a message..." variant="filled"
            multiline={true}
            borderRadius={5} p={2} fontSize={16} borderWidth={0} mt={2} w='75%'
            value={textInput} onChangeText={onChangeText}
            InputRightElement={<Icon as={
              <MaterialIcons
                style={{ padding: 5 }}
                name="insert-emoticon"
                size={24}
                color="#000"
              />} />} />}
        renderSend={() =>
          <FontAwesome
            style={{ marginLeft: 15 }}
            name="send"
            size={24}
            onPress={handleSendMessage}
            color={textInput ? 'red' : "grey"}
          />}
        infiniteScroll={true}
        loadEarlier={true}
        onLoadEarlier={loadEarlier}
        renderLoadEarlier={(props) => <LoadEarlier label='Show more' {...props} />}
      // renderInputToolbar={() => null}
      />

      {/* <InputChat textInput={textInput}
        onChangeText={onChangeText}
        handleSendMessage={handleSendMessage} /> */}

    </>
  )
}

function InputChat({ textInput, onChangeText, handleSendMessage }) {
  return (
    <Box borderTopWidth="1" borderColor="coolGray.200" mt={-5} p={3} zIndex={-1}>
      <HStack alignItems='center' justifyContent={'center'}>
        <Input placeholder="Send a message..." variant="filled"
          multiline={true}
          borderRadius={5} p={2} fontSize={16} borderWidth={0} mt={2} w='85%'
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
  )
}

