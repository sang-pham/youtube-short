import React, {useEffect} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {ChatBox, NewChatScreen, WebRTCCall} from '../../screens/inbox';
import NotifyService from '../../firebase/NotifyService';
import RNBootSplash from 'react-native-bootsplash';
import Toast from 'react-native-toast-message';
import MainStack from './MainStack';
import AuthStack from '../../screens/auth/AuthStack';
import {
  CreatePost,
  DiscoverySearchUser,
  ProfileEditScreen,
  ProfileVideoPostScreen,
  RecordScreen,
} from '../../screens';
import ProfileStack from '../../screens/profile/ProfileStack';
import ProfileRelationship from '../../screens/profile/relationship';

const Stack = createStackNavigator();

const Layout = () => {
  const isAuth = useSelector(state => state.user.authenticated);
  const loading = useSelector(state => state.user.loading);

  useEffect(() => {
    // const notify = NotifyService.getInstance();
    const notify = new NotifyService();
    notify.testNotify({
      title: 'Notification',
      subTitle: 'new',
      content: 'You have new videos today',
      message: ' Welcome to video short!',
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      RNBootSplash.hide({fade: true});
    }
  }, [loading]);

  if (loading) {
    return null;
  }

  return (
    <>
      {!isAuth ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Auth" component={AuthStack} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            transitionConfig: () => ({
              screenInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }),
            headerShown: false,
          }}>
          <Stack.Screen name="Main" component={MainStack} />
          <Stack.Screen name="Record" component={RecordScreen} />
          <Stack.Screen name="CreatePost" component={CreatePost} />
          <Stack.Screen name="WebRTCCall" component={WebRTCCall} />
          <Stack.Screen name="ChatBox" component={ChatBox} />
          <Stack.Screen name="NewChat" component={NewChatScreen} />
          <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
          <Stack.Screen
            name="ProfileRelationship"
            component={ProfileRelationship}
          />
          <Stack.Screen
            name="DiscoverySearchUser"
            component={DiscoverySearchUser}
          />
          <Stack.Screen
            name="ProfileVideoPost"
            component={ProfileVideoPostScreen}
          />
        </Stack.Navigator>
      )}
    </>
  );
};

export {Layout};
