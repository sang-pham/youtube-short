import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import EncryptedStorage from 'react-native-encrypted-storage';

const initialState = {
  user: {},
  error: null,
  authenticated: false,
  loaded: false,
  status: 'active',
};

export const isAuthenticated = createAsyncThunk(
  'user/isAuthenticated',
  async ({ }, { rejectWithValue }) => {
    try {
      let session = await EncryptedStorage.getItem('user_session');
      console.log(session);
      session = JSON.parse(session);
      if (session && session.token) {
        return { session };
      } else {
        throw 'Not authenticated';
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const signin = createAsyncThunk(
  'user/signin',
  async ({ data }, { rejectWithValue }) => {
    console.log(data);
    try {
      await EncryptedStorage.setItem('user_session', JSON.stringify(data));
      return { data };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const logout = createAsyncThunk(
  'user/logout',
  async ({ }, { rejectWithValue }) => {
    try {
      await EncryptedStorage.removeItem('user_session');
      return 'success';
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {},
  extraReducers: {
    [isAuthenticated.pending]: () => { },
    [isAuthenticated.fulfilled]: (state, action) => {
      let { session } = action.payload;
      session.token = undefined;
      state.user = session;
      state.authenticated = true;
      state.loaded = true;
    },
    [isAuthenticated.rejected]: (state, action) => {
      state.loaded = true;
      state.authenticated = false;
    },
    [signin.fulfilled]: (state, action) => {
      let { data } = action.payload;
      console.log(data);
      data.token = undefined;
      state.user = data;
      state.authenticated = true;
      state.loaded = true;
    },
    [signin.rejected]: () => {
      state.authenticated = false;
    },
    [logout.fulfilled]: state => {
      state.user = {};
      state.error = null;
      state.authenticated = false;
      state.loaded = false;
    },
  },
});

export default userSlice.reducer;
