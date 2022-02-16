import React, {useEffect, useMemo} from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {MainScreen} from './MainScreen';
import {
  DirectMessage,
  HomeScreen,
  NewChatScreen,
  RecordScreen,
  SigninScreen,
  SignupScreen,
  ProfileEditScreen,
  ProfileFriendsScreen,
  ProfileFollowingsScreen,
  ProfileFollowersScreen,
} from '../../screens';
import {useDispatch, useSelector} from 'react-redux';
import {isAuthenticated} from '../../redux/reducers';
import ProfileRelationship from '../../screens/profile/relationship';

const Stack = createStackNavigator();

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
      {!userReducer.authenticated ? (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Signin" component={SigninScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            transitionConfig: () => ({
              screenInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }),
          }}>
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Record"
            component={RecordScreen}
          />
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="DirectMessage"
            component={DirectMessage}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="NewChat"
            component={NewChatScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="ProfileEdit"
            component={ProfileEditScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="ProfileRelationship"
            component={ProfileRelationship}
          />
        </Stack.Navigator>
      )}
    </>
  );
};

export {Layout};
