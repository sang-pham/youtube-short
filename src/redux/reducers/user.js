import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import EncryptedStorage from 'react-native-encrypted-storage';
import {axiosAuth, baseURL} from '../../libs';

const initialState = {
  user: {},
  error: null,
  authenticated: false,
  loading: false,
  followings: [],
  followers: [],
  blocks: [],
  relationshipLoaded: false,
};

export const isAuthenticated = createAsyncThunk(
  'user/isAuthenticated',
  async ({}, {rejectWithValue}) => {
    try {
      let session = await EncryptedStorage.getItem('user_session');
      session = JSON.parse(session);
      if (session && session.token) {
        const res = await axiosAuth.get(`/user/${session.id}`);
        session = {...session, ...res.data.user};

        return {session};
      } else {
        throw 'Not authenticated';
      }
    } catch (error) {
      console.log('eeeeeee', error);
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
      let followers = res.data.followers;
      res = await axiosAuth.get(`/relationship/${userId}/followings`);
      let followings = res.data.followings;
      res = await axiosAuth.get(`/relationship/blocks`);
      let blocks = res.data.blocks;
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

export const follow = createAsyncThunk(
  'user/follow',
  async (
    {userId, first_name, last_name, user_name},
    {getState, rejectWithValue},
  ) => {
    try {
      const res = await axiosAuth.post('/relationship', {
        relate_id: userId,
        status: 'follow',
        user_id: getState().user.user.id,
      });
      if (res.status == 200) {
        let data = res.data.relationship;
        return {
          relationshipId: data.id,
          first_name,
          last_name,
          user_name,
          id: userId,
        };
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const block = createAsyncThunk(
  'user/block',
  async (
    {userId, first_name, last_name, user_name},
    {getState, rejectWithValue},
  ) => {
    try {
      let res = await axiosAuth.post('relationship', {
        relate_id: userId,
        status: 'block',
        user_id: getState().user.user.id,
      });
      if (res.status === 200) {
        let {relationship} = res.data;
        return {
          first_name,
          user_name,
          last_name,
          id: userId,
          relationshipId: relationship.id,
        };
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
    [isAuthenticated.pending]: (state, action) => {
      state.loading = true;
    },
    [isAuthenticated.fulfilled]: (state, action) => {
      const {session} = action.payload;
      state.user = session;
      state.authenticated = true;
      state.loading = false;
    },
    [isAuthenticated.rejected]: (state, action) => {
      state.authenticated = false;
      state.loading = false;
    },
    [signin.fulfilled]: (state, action) => {
      const {data} = action.payload;
      state.user = data;
      state.authenticated = true;
    },
    [signin.rejected]: (state, action) => {
      state.authenticated = false;
    },
    [logout.fulfilled]: state => {
      state.user = {};
      state.error = null;
      state.authenticated = false;
    },
    [updateProfile.fulfilled]: (state, action) => {
      const data = action.payload;
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
      let idx = state.followings.findIndex(
        following => following.relationshipId == relationshipId,
      );
      state.followings.splice(idx, 1);
    },
    [unfollow.rejected]: (state, action) => {
      let {error} = action.payload;
      console.log(error);
    },
    [follow.fulfilled]: (state, action) => {
      let {relationshipId, first_name, last_name, user_name, id} =
        action.payload;
      state.followings.push({
        relationshipId,
        first_name,
        last_name,
        user_name,
        id,
      });
    },
    [follow.rejected]: (state, action) => {
      let {error} = action.payload;
      console.log(error);
    },
    [block.fulfilled]: (state, action) => {
      let {userId, relationshipId, user_name, first_name, last_name} =
        action.payload;
      let idx = state.followers.findIndex(follower => follower.id == userId);
      if (idx >= 0) {
        state.followers.splice(idx, 1);
      }
      idx = state.followings.findIndex(following => following.id == userId);
      if (idx >= 0) {
        state.followings.splice(idx, 1);
      }
      state.blocks.push({
        id: userId,
        relationshipId,
        first_name,
        user_name,
        last_name,
      });
    },
  },
});

export default userSlice.reducer;
