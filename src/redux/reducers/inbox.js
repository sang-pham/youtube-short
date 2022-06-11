import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  axiosAuth,
  NUMBER_OF_ROW,
  parseImageToBlob,
  socketClient,
  swapItemArray,
} from '../../libs';
import {getAvatarUrl} from '../../libs';
import {v4} from 'uuid';
import NotifyService from '../../firebase/NotifyService';

export const getAllChatBox = createAsyncThunk(
  'inbox/getAllChatBox',
  async ({}, {rejectWithValue}) => {
    try {
      const res = await axiosAuth.get('/conversation');
      return res.data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const getMessages = createAsyncThunk(
  'inbox/getMessages',
  async ({chatBoxId}, {rejectWithValue}) => {
    try {
      const res = await axiosAuth.get(
        '/conversation/' + chatBoxId + '/messages',
      );
      return res.data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const setChatBox = createAsyncThunk(
  'inbox/setChatBox',
  async ({chatBoxId, personId, userId}, {rejectWithValue}) => {
    try {
      const res = await axiosAuth.get('/conversation/info', {
        params: {
          userId,
          personId,
          conversationId: chatBoxId,
        },
      });

      return res.data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const getNumberOfUnRead = createAsyncThunk(
  'inbox/getNumberOfUnRead',
  async ({}, {rejectWithValue}) => {
    try {
      const res = await axiosAuth.get('/conversation/unread');

      return res.data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const sendMessage = createAsyncThunk(
  'inbox/sendMessage',
  async ({senderId, receiverId, text, conversationId, image}) => {
    const v4Id = v4();
    let img = null;

    if (image) {
      img = {
        size: image.size,
        mime: image.mime,
        path: image.path,
        data: await parseImageToBlob(image.path),
      };
    }

    socketClient.emit('send-message', {
      text,
      image: img,
      conversationId,
      senderId,
      receiverId,
      v4Id,
    });

    return {
      id: v4Id,
      text,
      createdAt: new Date().toISOString(),
      user_id: senderId,
      media: img
        ? [
            {
              id: v4Id,
              url: img.path,
            },
          ]
        : undefined,
    };
  },
);

export const deleteMessage = createAsyncThunk(
  'inbox/deleteMessage',
  async ({messageId}) => {
    try {
      const res = await axiosAuth.delete('/conversation/message/' + messageId);

      return res.data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

const parseMessages = messages => {
  return messages.map(msg => ({
    _id: msg.id,
    text: msg.text,
    createdAt: msg.createdAt,
    user: {
      _id: msg.user_id,
      avatar: getAvatarUrl(msg.user_id),
    },
    image: msg.media && msg.media[0]?.url,
  }));
};

const initialState = {
  messages: [],
  chatBoxList: [],
  chatBox: null,
  msgLoading: false,
  numberOfUnRead: 0,
};

export const inboxSlice = createSlice({
  name: 'Inbox',
  initialState,
  reducers: {
    receiveMessage: (state, action) => {
      const {conversation, message, person} = action.payload;
      const chatBoxList = state.chatBoxList;
      const idx = chatBoxList.findIndex(item => item.id === conversation.id);

      // const notify = NotifyService.getInstance();
      const notify = new NotifyService();
      notify.messageNotify({senderName: person.full_name, message});

      if (idx >= 0) {
        chatBoxList[idx].message = message;
        swapItemArray(chatBoxList, idx, 0);
      } else {
        chatBoxList.unshift({...conversation, ...person, message});
      }

      chatBoxList[0].is_seen = false;

      if (!state.messages.length) return;

      state.messages.unshift(...parseMessages([message]));
    },
    sentMessage: (state, action) => {
      const {message, person, conversation, v4Id} = action.payload;
      const msg = state.messages.find(msg => msg._id === v4Id);

      if (msg) msg._id = message.id;

      // use for test
      // const notify = NotifyService.getInstance();
      // const notify = new NotifyService();
      // notify.messageNotify({senderName: person.full_name, message});

      const chatBoxList = state.chatBoxList;
      const idx = chatBoxList.findIndex(
        item => item.id === message.conversation_id,
      );

      if (idx >= 0) {
        chatBoxList[idx].message = message;
        swapItemArray(chatBoxList, idx, 0);
      } else {
        chatBoxList.unshift({...conversation, ...person, message});
      }

      chatBoxList[0].is_seen = true;
    },
    readMessage: (state, action) => {
      const {chatBoxId} = action.payload;
      const chatBox = state.chatBoxList.find(item => item.id === chatBoxId);
      if (chatBox && !chatBox.is_seen) {
        chatBox.is_seen = true;
        state.numberOfUnRead--;
      }
    },
    addMessages: (state, action) => {
      const {messages} = action.payload;
      const last_cur_id = state.messages[state.messages.length - 1]?._id || 0;
      const last_fetch_id = messages[messages.length - 1]?.id;

      if (last_cur_id === last_fetch_id) return;

      state.messages.push(...parseMessages(messages));
    },
    clearChatBox: (state, action) => {
      state.chatBox = null;
      state.messages = [];
    },
  },
  extraReducers: {
    [getAllChatBox.fulfilled]: (state, action) => {
      state.chatBoxList = action.payload;
    },
    [getAllChatBox.rejected]: (state, action) => {
      console.log(action.payload);
    },
    [setChatBox.pending]: (state, action) => {
      state.messages = [];
      state.chatBox = null;
    },
    [setChatBox.fulfilled]: (state, action) => {
      state.chatBox = action.payload;
    },
    [setChatBox.rejected]: (state, action) => {
      console.log(action.payload);
    },
    [getNumberOfUnRead.fulfilled]: (state, action) => {
      state.numberOfUnRead = action.payload;
    },
    [getNumberOfUnRead.rejected]: (state, action) => {
      console.log(action.payload);
    },
    [getMessages.pending]: (state, action) => {
      state.msgLoading = true;
    },
    [getMessages.fulfilled]: (state, action) => {
      state.messages = parseMessages(action.payload);

      state.msgLoading = false;
    },
    [getMessages.rejected]: (state, action) => {
      console.log(action.payload);
      state.msgLoading = false;
    },
    [sendMessage.fulfilled]: (state, action) => {
      const message = action.payload;
      console.log(message);
      state.messages.unshift(...parseMessages([message]));
    },
    [deleteMessage.fulfilled]: (state, action) => {
      const {messageId} = action.payload;
    },
    [deleteMessage.rejected]: (state, action) => {
      console.log(action);
    },
  },
});

export const {
  receiveMessage,
  clearChatBox,
  sentMessage,
  readMessage,
  addMessages,
} = inboxSlice.actions;
export default inboxSlice.reducer;
