import React, { useEffect, useMemo } from 'react';
import {
  CardStyleInterpolators, createStackNavigator,
} from '@react-navigation/stack';
import { MainScreen } from './MainScreen';
import {
  DirectMessage,
  ChatBox,
  NewChatScreen,
  RecordScreen,
  SigninScreen,
  SignupScreen,
  ProfileEditScreen,
  WelcomeScreen,
} from '../../screens';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthenticated } from '../../redux/reducers';
import ProfileRelationship from '../../screens/profile/relationship';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Spinner, View } from 'native-base';
import {WebRTCCall} from '../../screens/inbox';

const Stack = createNativeStackNavigator();
// const Stack = createStackNavigator();

const Layout = () => {
  const dispatch = useDispatch();
  const userReducer = useSelector(state => state.user);

  useEffect(() => {
    if (!userReducer.loaded) {
      dispatch(isAuthenticated({}));
    }
  }, [userReducer.loaded]);

  return (
    <>
      {!userReducer.loaded ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <Spinner size='lg' color={'#000'} />
        </View>
      ) :
        !userReducer.authenticated ? (
          <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Signin" component={SigninScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator
            screenOptions={{
              transitionConfig: () => ({
                screenInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }),
              headerShown: false
            }}>
            <Stack.Screen
              name="Main"
              component={MainScreen}
            />
            <Stack.Screen
              name="Record"
              component={RecordScreen}
            />
            <Stack.Screen
              name="DirectMessage"
              component={DirectMessage}
            />
            <Stack.Screen
              name="ChatBox"
              component={ChatBox}
            />
            <Stack.Screen
              name="NewChat"
              component={NewChatScreen}
            />
             <Stack.Screen
              name="WebRTCCall"
              component={WebRTCCall}
            />
            <Stack.Screen
              name="ProfileEdit"
              component={ProfileEditScreen}
            />
            <Stack.Screen
              name="ProfileRelationship"
              component={ProfileRelationship}
            />
          </Stack.Navigator>
        )}
    </>
  );
};

export { Layout };
