import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/user';
import inboxReducer from './reducers/inbox';

const store = configureStore({
  reducer: {
    user: userReducer,
    inbox: inboxReducer
  },
});

export default store;
