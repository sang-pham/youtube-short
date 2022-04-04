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

const initialState = {
  isRinging: false,
  isCalling: false,
  senderId: null,
  receiverId: null,
  chatBoxId: null,
};

export const callSlice = createSlice({
  name: 'Call',
  initialState,
  reducers: {
    calling: (state, action) => {
      const {receiverId, senderId, chatBoxId} = action.payload;
      state.senderId = senderId;
      state.receiverId = receiverId;
      state.chatBoxId = chatBoxId;
      state.isRinging = true;
    },
    startCall: (state, action) => {
      const {receiverId, senderId, chatBoxId, offer} = action.payload;
      state.senderId = senderId;
      state.receiverId = receiverId;
      state.chatBoxId = chatBoxId;
      state.isCalling = true;

      socketClient.emit('video-call-start', {
        senderId,
        receiverId,
        chatBoxId,
        offer,
      });
    },
    stopCall: (state, action) => {
      const {senderId, receiverId, chatBoxId} = action.payload;
      if (chatBoxId == state.chatBoxId) {
        state.isRinging = false;
        state.isCalling = false;
        state.senderId = null;
        state.receiverId = null;
        state.chatBoxId = null;
      }
      socketClient.emit('video-call-stop', {senderId, receiverId, chatBoxId});
    },
    acceptCall: (state, action) => {
      const {chatBoxId} = action.payload;
      if (chatBoxId === state.chatBoxId) {
        state.isRinging = false;
        state.isCalling = true;
      }
    },
    rejectCall: (state, action) => {},
  },
  extraReducers: {},
});

export const {startCall, acceptCall, stopCall, calling} = callSlice.actions;
export default callSlice.reducer;
