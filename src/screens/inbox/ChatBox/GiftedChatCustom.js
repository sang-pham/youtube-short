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
import { parseImageToBlob, socketClient, useVirtualListApi } from '../../../libs';
import { useFocusEffect } from '@react-navigation/native';
import ImagePicker, { openCamera } from 'react-native-image-crop-picker';

const OPTIONS_MESSAGE = ['Like', 'Copy', 'Reply', 'Cancel', 'Delete']

export default function GiftedChatCustom({ chatBox }) {
  const dispatch = useDispatch();

  const userInfo = useSelector(state => state.user.user);
  const messages = useSelector(state => state.inbox.messages);

  const [textInput, setTextInput] = useState('');
  const { pageData, fetchData, loading, isMax } = useVirtualListApi(`/conversation/${chatBox.id}/messages`,
    (data) => {
      dispatch(addMessages({ messages: data }));
    }
  );

  const handleSendMessage = () => {
    if (!textInput) {
      return;
    }
    send({ text: textInput });
    setTextInput('');
  }

  const send = ({ text, image }) => {
    dispatch(sendMessage({
      conversationId: chatBox.id,
      senderId: userInfo.id,
      receiverId: chatBox.person_id,
      text,
      image
    }));
  }

  const loadEarlier = async () => {
    await fetchData();
  }

  const LoadMessage = (props) => {
    if (loading) {
      return <Spinner size='sm' color={'#000'} />
    }

    return <LoadEarlier label='Show more' {...props} />
  }


  return (
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
            cancelButtonIndex: options.findIndex(item => item === 'Cancel'),
            destructiveButtonIndex: options.findIndex(item => item === 'Delete'),
            withIcon: true
          },
          (buttonIndex) => {
            if (options[buttonIndex] === 'Delete') {
              dispatch(deleteMessage())
            }
          },
        )
      }}
      renderActions={() => <CameraButton send={send} />}
      renderComposer={() => <ComposerInput textInput={textInput} setTextInput={setTextInput} />}
      renderSend={() => <SendButton textInput={textInput} handleSendMessage={handleSendMessage} />}
      infiniteScroll={!isMax}
      loadEarlier={!isMax}
      onLoadEarlier={loadEarlier}
      renderLoadEarlier={(props) => <LoadMessage {...props} />}
    />
  )
}


const SendButton = ({ handleSendMessage, textInput }) => {
  return (
    <FontAwesome
      style={{ padding: 12 }}
      name="send"
      size={24}
      onPress={handleSendMessage}
      color={textInput ? 'red' : "grey"}
    />
  )
}

const ComposerInput = ({ setTextInput, textInput }) => {
  return (
    <Input placeholder="Send a message..." variant="filled"
      multiline={true}
      borderRadius={15} p={2} fontSize={14} borderWidth={0} my={1} w='62%'
      value={textInput}
      onChangeText={(text) => {
        setTextInput(text)
      }}
      InputRightElement={<Icon as={
        <MaterialIcons
          style={{ padding: 5 }}
          name="insert-emoticon"
          size={24}
          color="#000"
        />} />} />
  )
}


const CameraButton = ({ send }) => {

  const captureImage = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(async image => {
      // const data = await parseImageToBlob(image.path);
      send({ image });

    }).catch(error => {
      console.log(error);
    });
  }

  const selectImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(async image => {
      // const data = await Promise.all(images.map(async img => {
      //   return await parseImageToBlob(img.path);
      // }))
      // const data = await parseImageToBlob(image.path);
      send({ image });
    }).catch(error => {
      console.log(error);
    });
  }

  return (
    <HStack>
      <FontAwesome
        onPress={captureImage}
        style={{ margin: 13 }}
        name="camera"
        size={24}
      />
      <FontAwesome
        onPress={selectImage}
        style={{ margin: 13 }}
        name="image"
        size={24}
      />
    </HStack>
  )
}