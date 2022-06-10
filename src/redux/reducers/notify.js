import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {v4} from 'uuid';

const initialState = {
  notify: null,
};

export const notifySlice = createSlice({
  name: 'Notify',
  initialState,
  reducers: {
    initNotify: (state, action) => {
      state.notify = action.payload.notify;
    },
  },
  extraReducers: {},
});

export const {initNotify} = notifySlice.actions;
export default notifySlice.reducer;
