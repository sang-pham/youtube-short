/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Provider} from 'react-redux';
import {View, Text, Button} from 'react-native';
import store from './redux';
import {isAuthenticated} from './redux/reducers/user';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeBaseProvider} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/home';
import {SigninScreen, SignupScreen} from './screens/auth';
import ProfileScreen from './screens/profile';

const App = () => {
  const dispatch = useDispatch();
  const userReducer = useSelector(state => state.user);

  let Stack = useMemo(() => {
    if (!userReducer.authenticated) {
      return createNativeStackNavigator();
    } else {
      return createBottomTabNavigator();
    }
  }, [userReducer.authenticated]);

  useEffect(() => {
    if (!userReducer.loaded) {
      dispatch(isAuthenticated({}));
    }
  }, [userReducer.loaded]);

  // useEffect(() => {
  //   console.log(userReducer.authenticated);
  //   if (userReducer.authenticated) {
  //     console.log('authenticated');
  //     Stack = createBottomTabNavigator();
  //   }
  // }, [userReducer.authenticated]);

  return (
    <NavigationContainer>
      {/* Rest of your app code */}
      <NativeBaseProvider>
        {!userReducer.authenticated ? (
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Signin" component={SigninScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        )}
      </NativeBaseProvider>
    </NavigationContainer>
  );
};

const RootApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default RootApp;
