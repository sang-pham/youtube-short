import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {ProfileScreen} from '.';
import {DiscoverySearchUser} from '../discovery/user-search';
import {ProfileEditScreen} from './edit';
import ProfileRelationship from './relationship';
import {ProfileVideoPostScreen} from './videoPosts';

const profileStack = createStackNavigator();
export default function ProfileStack({route}) {
  const userReducer = useSelector(state => state.user);
  console.log(route);
  return (
    <profileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {/* <profileStack.Screen
        name="Profile"
        component={ProfileScreen}
        params={{userId: route.params.userId}}
      /> */}
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
