import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {ChatBox} from './ChatBox';
import {DirectMessage} from './DirectMessage';
import {InboxScreen} from './InboxScreen';
import {NewChatScreen} from './NewChat';

const messStack = createStackNavigator();
export default function MessengerStack() {
  return (
    <messStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {/* <messStack.Screen name="Inbox" component={InboxScreen} /> */}
      <messStack.Screen name="DirectMessage" component={DirectMessage} />
      {/* <messStack.Screen name="ChatBox" component={ChatBox} /> */}
      {/* <messStack.Screen name="NewChat" component={NewChatScreen} /> */}
    </messStack.Navigator>
  );
}
