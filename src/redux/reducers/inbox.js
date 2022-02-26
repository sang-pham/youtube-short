import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosAuth, socketClient } from '../../libs';


export const getAllChatBox = createAsyncThunk('inbox/getAllChatBox', async ({ }, { rejectWithValue }) => {
  try {
    const res = await axiosAuth.get('/conversation');
    return res.data;
  } catch (error) {
    rejectWithValue(error);
  }

})

export const getMessages = createAsyncThunk('inbox/getMessages', async ({ inboxId, lastMessageId }, { rejectWithValue }) => {
  try {
    const res = await axiosAuth.get('/conversation/' + inboxId + '/messages', {
      params: {
        lastMessageId,
      }
    });
    return res.data;
  } catch (error) {
    rejectWithValue(error);
  }
})

export const setChatBox = createAsyncThunk('inbox/setChatBox', async ({ chatBoxId, personId }, { getState, rejectWithValue }) => {
  try {

    const res = await axiosAuth.get('/conversation/info', {
      params: {
        userId: personId,
        conversationId: chatBoxId
      }
    });

    console.log('asfasf', res.data);

    return res.data;
  } catch (error) {
    rejectWithValue(error);
  }
})


const initialState = {
  messages: [],
  chatBoxList: [],
  chatBox: null,
};



export const inboxSlice = createSlice({
  name: 'Inbox',
  initialState,
  reducers: {
    sendMessage: (state, action) => {
      const { senderId, receiverId, text, conversationId } = action.payload;

      socketClient.emit('send-message', {
        conversationId,
        senderId,
        receiverId,
        text
      });

      // let convParticipant = state.conversations.find(conv => {
      //   return (conv.participantId === receiverId || conv.participantId === senderId)
      // });

      // if (convParticipant) {
      //   console.log('replaceeeeee id', convParticipant)
      //   convParticipant.conversationId = conversationId;
      // }

      // let conversation = state.conversations.find(conv => conv.conversationId === conversationId);
      // if (!conversation && !convParticipant) {
      //   state.conversations.unshift({
      //     conversationId, participantId: senderId,
      //     participantName: senderName, isRead: false
      //   })
      // }

      // if (state.conversation.participant && (receiverId === state.conversation.participant.id || senderId === state.conversation.participant.id)) {
      //   state.conversation.messages.push({ id: messageId, content, userId: senderId, conversationId, files, photos, videos, createdAt });

      //   if (files && files.length) {
      //     state.conversation.files.unshift(...files)
      //   }
      //   if (videos && videos.length) {
      //     state.conversation.files.unshift(...videos)
      //   }
      //   if (photos && photos.length) {
      //     state.conversation.images.unshift(...photos)
      //   }
      // }

      // const pIdx = state.conversations.findIndex(conv => conv.conversationId === conversationId);

      // if (pIdx >= 0) {
      //   //check is read?
      //   conversation = state.conversations[pIdx];
      //   conversation.isRead = true;
      //   if (!state.conversation.participant || state.conversation.participant.id !== receiverId) {
      //     conversation.isRead = false;
      //   }


      //   state.conversations.splice(pIdx, 1);
      //   state.conversations.unshift(conversation);

      //   //check status
      //   if (conversation.participantId === senderId) {
      //     conversation.status = 'active';
      //   }
      // }

      // state.lastMessageChange = !state.lastMessageChange;
    },
    receiveMessage: (state, action) => {
      console.log('receive redux');
    },

  },
  extraReducers: {
    [getAllChatBox.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.chatBoxList = action.payload;
    },
    [getAllChatBox.rejected]: (state, action) => {
      console.log(action.payload);
    },
    [setChatBox.fulfilled]: (state, action) => {
      state.chatBox = action.payload;
    },
    [setChatBox.rejected]: (state, action) => {
      console.log(error);
    }
  },
});

export const { sendMessage, receiveMessage } = inboxSlice.actions;
export default inboxSlice.reducer;
