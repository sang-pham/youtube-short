import {configureStore} from '@reduxjs/toolkit';
import userReducer from './reducers/user';
import inboxReducer from './reducers/inbox';
import callReducer from './reducers/call';

const store = configureStore({
  reducer: {
    user: userReducer,
    inbox: inboxReducer,
    call: callReducer,
  },
});

export default store;
