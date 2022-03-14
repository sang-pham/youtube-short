import React, { useState, useCallback, useEffect } from 'react'
import { Actions, GiftedChat, InputToolbar, LoadEarlier } from '../../../components/GiftedChat'
import {
  Avatar, Box, VStack, Spacer, HStack, Text,
  Input, Icon, Divider, Flex, ScrollView, KeyboardAvoidingView,
  Center, Heading, Button, View, Spinner
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, getMessages, addMessages, clearMessages } from '../../../redux/reducers';
import ChatBoxLoading from './ChatBoxLoading';
import { useVirtualListApi } from '../../../libs';
import { useFocusEffect } from '@react-navigation/native';

const OPTIONS_MESSAGE = ['Copy', 'Reply', 'Cancel', 'Delete']

export default function GiftedChatCustom({ chatBox }) {
  const dispatch = useDispatch();

  const userInfo = useSelector(state => state.user.user);
  const messages = useSelector(state => state.inbox.messages);
  const msgLoading = useSelector(state => state.inbox.msgLoading);

  const [textInput, setTextInput] = useState('');
  const { pageData, fetchData, loading, max } = useVirtualListApi(`/conversation/${chatBox.id}/messages`,
    (data) => {
      dispatch(addMessages({ messages: data }));
    }
  );

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

  const loadEarlier = async () => {
    await fetchData();
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
              cancelButtonIndex: options.findIndex('Cancel'),
              destructiveButtonIndex: options.findIndex('Delete'),
              withIcon: true
            },
            (buttonIndex) => {
              console.log(buttonIndex);
            },
          )
        }}
        onPressActionButton={() => { console.log('asfasf') }}
        // renderActions={(props) => <ActionButton {...props} />}
        renderComposer={(props) => <ComposerInput onChangeText={onChangeText} textInput={textInput} />}
        renderSend={() => <SendButton handleSendMessage={handleSendMessage} textInput={textInput} />}
        infiniteScroll={!max}
        loadEarlier={!max}
        onLoadEarlier={loadEarlier}
        renderLoadEarlier={(props) => {
          if (loading) {
            return <Spinner size='sm' color={'#000'} />
          }

          return <LoadEarlier label='Show more' {...props} />
        }}
      />
    </>
  )
}


const SendButton = ({ handleSendMessage, textInput }) => {

  return (
    <FontAwesome
      style={{ margin: 13 }}
      name="send"
      size={24}
      onPress={handleSendMessage}
      color={textInput ? 'red' : "grey"}
    />
  )
}

const ComposerInput = ({ onChangeText, textInput }) => {
  return (
    <Input placeholder="Send a message..." variant="filled"
      multiline={true}
      borderRadius={5} p={2} fontSize={16} borderWidth={0} mb={1} w='75%'
      value={textInput}
      onChangeText={onChangeText}
      InputRightElement={<Icon as={
        <MaterialIcons
          style={{ padding: 5 }}
          name="insert-emoticon"
          size={24}
          color="#000"
        />} />} />
  )
}

const ActionButton = (props) => {
  return (
    <FontAwesome
      style={{ margin: 13 }}
      name="camera"
      size={24}
    />
  )
}

