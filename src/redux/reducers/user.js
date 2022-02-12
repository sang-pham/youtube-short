import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import EncryptedStorage from 'react-native-encrypted-storage';
import { baseURL } from '../../libs';

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

export const updateProfile = createAsyncThunk(
  'user/update',
  async ({ data, avatar, userId }, { getState, rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (avatar) {
        formData.append('avatar', {
          name: '50k.jpg',
          uri: avatar.path,
          type: avatar.mime,
        });
      }
      formData.append('email', data.email);
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('user_name', data.user_name);

      // const res = await axiosAuth.put(`/user/${userId}/profile`, formData, {
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'multipart/form-data; charset=utf-8;',
      //   }
      // });

      const res = await fetch(`${baseURL}/user/${userId}/profile`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': getState().user.user.token,
        },
        method: 'PUT',
        body: formData,
      });
      if (res.status == 200) {
        let session = JSON.parse(
          await EncryptedStorage.getItem('user_session'),
        );
        const data = await res.json();
        let { user } = data;
        session = {
          ...session,
          ...user,
        };
        await EncryptedStorage.setItem('user_session', JSON.stringify(session));
        return user;
      }
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
      // session.token = undefined;
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
      // data.token = undefined;
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
    [updateProfile.fulfilled]: (state, action) => {
      let data = action.payload;
      console.log(data);
      state.user = {
        ...state.user,
        ...data,
      };
    },
    [updateProfile.rejected]: (state, action) => {
      if (action.payload.error) {
        state.error = action.payload.error;
      }
    },
  },
});

export default userSlice.reducer;
