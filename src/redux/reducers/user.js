import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import EncryptedStorage from 'react-native-encrypted-storage';
import {axiosAuth, baseURL} from '../../libs';

const initialState = {
  user: {},
  error: null,
  authenticated: false,
  followings: [],
  followers: [],
  blocks: [],
  loaded: false,
  status: 'active',
  relationshipLoaded: false,
};

export const isAuthenticated = createAsyncThunk(
  'user/isAuthenticated',
  async ({}, {rejectWithValue}) => {
    try {
      let session = await EncryptedStorage.getItem('user_session');
      console.log(session);
      session = JSON.parse(session);
      if (session && session.token) {
        const res = await axiosAuth.get(`/user/${session.id}`);
        session = {...session, ...res.data.user};
        return {session};
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
  async ({data}, {rejectWithValue}) => {
    console.log(data);
    try {
      await EncryptedStorage.setItem('user_session', JSON.stringify(data));
      return {data};
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const logout = createAsyncThunk(
  'user/logout',
  async ({}, {rejectWithValue}) => {
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
  async ({data, avatar, userId}, {getState, rejectWithValue}) => {
    try {
      const formData = new FormData();
      if (avatar) {
        formData.append('avatar', {
          name: 'avatar-image.jpg',
          uri: avatar.path,
          type: avatar.mime,
        });
      }
      formData.append('email', data.email);
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('user_name', data.user_name);

      const res = await fetch(`${baseURL}/user/${userId}/profile`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: getState().user.user.token,
        },
        method: 'PUT',
        body: formData,
      });
      if (res.status == 200) {
        let session = JSON.parse(
          await EncryptedStorage.getItem('user_session'),
        );
        const data = await res.json();
        let {user} = data;
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

export const getRelationship = createAsyncThunk(
  'user/relationship',
  async ({}, {getState, rejectWithValue}) => {
    try {
      let userId = getState().user.user.id;
      let res = await axiosAuth.get(`/relationship/${userId}/followers`);
      let followers = res.data.followers.map(follower => ({
        relationshipId: follower.id,
        ...follower.own,
      }));
      res = await axiosAuth.get(`/relationship/${userId}/followings`);
      let followings = res.data.followings.map(following => ({
        relationshipId: following.id,
        ...following.receive,
      }));
      res = await axiosAuth.get(`/relationship/blocks`);
      let blocks = res.data.blocks.map(block => ({
        relationshipId: block.id,
        ...block.receive,
      }));
      return {followers, followings, blocks};
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const unfollow = createAsyncThunk(
  'user/unfollow',
  async ({userId, relationshipId}, {rejectWithValue}) => {
    try {
      let res = await axiosAuth.delete(`/relationship/${relationshipId}`);
      if (res.status == 200) {
        return {userId, relationshipId};
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {},
  extraReducers: {
    [isAuthenticated.pending]: () => {},
    [isAuthenticated.fulfilled]: (state, action) => {
      let {session} = action.payload;
      state.user = session;
      state.authenticated = true;
      state.loaded = true;
    },
    [isAuthenticated.rejected]: (state, action) => {
      state.loaded = true;
      state.authenticated = false;
    },
    [signin.fulfilled]: (state, action) => {
      let {data} = action.payload;
      console.log(data);
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
    [getRelationship.fulfilled]: (state, action) => {
      let {followings, followers, blocks} = action.payload;
      state.followings = followings;
      state.followers = followers;
      state.blocks = blocks;
      state.relationshipLoaded = true;
    },
    [getRelationship.rejected]: (state, action) => {
      console.log(action.payload);
      state.relationshipLoaded = true;
    },
    [unfollow.fulfilled]: (state, action) => {
      let {relationshipId, userId} = action.payload;
      state.followings = state.followings.filter(
        following => following.relationshipId != relationshipId,
      );
    },
    [unfollow.rejected]: (state, action) => {
      let {error} = action.payload;
      console.log(error);
    },
  },
});

export default userSlice.reducer;
