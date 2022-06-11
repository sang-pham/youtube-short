import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {ProfileScreen} from '.';
import {DiscoverySearchUser} from '../discovery/user-search';
import {ProfileEditScreen} from './edit';
import ProfileRelationship from './relationship';
import {ProfileVideoPostScreen} from './videoPosts';

const profileStack = createStackNavigator();
export default function ProfileStack() {
  const userReducer = useSelector(state => state.user);
  return (
    <profileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <profileStack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{userId: userReducer.user.id}}
      />
      <profileStack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <profileStack.Screen
        name="ProfileRelationship"
        component={ProfileRelationship}
      />
      <profileStack.Screen
        name="DiscoverySearchUser"
        component={DiscoverySearchUser}
      />
      <profileStack.Screen
        name="ProfileVideoPost"
        component={ProfileVideoPostScreen}
      />
    </profileStack.Navigator>
  );
}
