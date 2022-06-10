import {configureStore} from '@reduxjs/toolkit';
import userReducer from './reducers/user';
import inboxReducer from './reducers/inbox';
import notifyReducer from './reducers/notify';

const store = configureStore({
  reducer: {
    user: userReducer,
    inbox: inboxReducer,
    notify: notifyReducer,
  },
});

export default store;
