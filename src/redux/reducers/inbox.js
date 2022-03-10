import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosAuth, socketClient, swapItemArray } from '../../libs';
import { getAvatarUrl } from '../../libs';
import { v4 } from 'uuid';

export const getAllChatBox = createAsyncThunk('inbox/getAllChatBox',
  async ({ }, { rejectWithValue }) => {
    try {
      const res = await axiosAuth.get('/conversation');
      return res.data;
    } catch (error) {
      rejectWithValue(error);
    }

  })

export const getMessages = createAsyncThunk('inbox/getMessages',
  async ({ chatBoxId }, { rejectWithValue }) => {
    try {
      const res = await axiosAuth.get('/conversation/' + chatBoxId + '/messages');
      return res.data;
    } catch (error) {
      rejectWithValue(error);
    }
  })

export const setChatBox = createAsyncThunk('inbox/setChatBox',
  async ({ chatBoxId, personId, userId }, { rejectWithValue }) => {
    try {


      const res = await axiosAuth.get('/conversation/info', {
        params: {
          userId,
          personId,
          conversationId: chatBoxId
        }
      });



      return res.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
)

export const getNumberOfUnRead = createAsyncThunk('inbox/getNumberOfUnRead',
  async ({ }, { rejectWithValue }) => {
    try {
      const res = await axiosAuth.get('/conversation/unread');

      return res.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
)


const initialState = {
  messages: [],
  chatBoxList: [],
  chatBox: null,
  msgLoading: false,
  numberOfUnRead: 0
};

export const inboxSlice = createSlice({
  name: 'Inbox',
  initialState,
  reducers: {
    sendMessage: (state, action) => {
      const { senderId, receiverId, text, conversationId } = action.payload;
      const v4Id = v4();

      state.messages.unshift({
        _id: v4Id,
        text,
        createdAt: (new Date()).toISOString(),
        user: {
          _id: senderId,
        }
      })

      socketClient.emit('send-message', {
        text,
        conversationId,
        senderId,
        receiverId,
        v4Id
      });

    },
    receiveMessage: (state, action) => {
      const { conversation, message, person } = action.payload;
      const chatBoxList = state.chatBoxList;
      const idx = chatBoxList.findIndex(item => item.id === conversation.id);


      if (idx >= 0) {
        chatBoxList[idx].message = message;
        swapItemArray(chatBoxList, idx, 0);
      } else {
        chatBoxList.unshift({ ...conversation, ...person, message });
      }

      chatBoxList[0].is_seen = false;
      state.numberOfUnRead++;

      if (!state.messages.length) return;

      state.messages.unshift({
        _id: message.id,
        text: message.text,
        createdAt: message.createdAt,
        user: {
          _id: person.person_id,
          avatar: getAvatarUrl(person.person_id),
        }
      })
    },
    sentMessage: (state, action) => {
      const { message, person, conversation, v4Id } = action.payload;
      const msg = state.messages.find(msg => msg.createdAt === v4Id);

      if (msg) msg._id = message.id;

      const chatBoxList = state.chatBoxList;
      const idx = chatBoxList.findIndex(item => item.id === message.conversation_id);

      if (idx >= 0) {
        chatBoxList[idx].message = message;
        swapItemArray(chatBoxList, idx, 0);
      } else {
        chatBoxList.unshift({ ...conversation, ...person, message });
      }

      chatBoxList[0].is_seen = true;

    },
    readMessage: (state, action) => {
      const { chatBoxId } = action.payload;
      const chatBox = state.chatBoxList.find(item => item.id === chatBoxId);
      if (chatBox && !chatBox.is_seen) {
        chatBox.is_seen = true;
        state.numberOfUnRead--;
      }
    },
    addMessage: (state, action) => {
      const {messages} = action.payload;
      state.messages.push(...messages);
    }

  },
  extraReducers: {
    [getAllChatBox.fulfilled]: (state, action) => {
      state.chatBoxList = action.payload;
    },
    [getAllChatBox.rejected]: (state, action) => {
      console.log(action.payload);
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
      state.messages = action.payload.map(msg => ({
        _id: msg.id,
        text: msg.text,
        createdAt: msg.createdAt,
        user: {
          _id: msg.user_id,
          avatar: getAvatarUrl(msg.user_id),
        },
      }));
      state.msgLoading = false;
    },
    [getMessages.rejected]: (state, action) => {
      console.log(action.payload);
      state.msgLoading = false;
    }
  },
});

export const {
  sendMessage, receiveMessage,
  sentMessage, readMessage } = inboxSlice.actions;
export default inboxSlice.reducer;
