import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {socketClient} from '../../libs';
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
      const {receiverId, senderId, chatBoxId, offer, isVideoCall} =
        action.payload;
      state.senderId = senderId;
      state.receiverId = receiverId;
      state.chatBoxId = chatBoxId;
      state.isCalling = true;

      socketClient.emit('video-call-start', {
        senderId,
        receiverId,
        chatBoxId,
        offer,
        isVideoCall,
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
  },
  extraReducers: {},
});

export const {startCall, stopCall, calling} = callSlice.actions;
export default callSlice.reducer;
