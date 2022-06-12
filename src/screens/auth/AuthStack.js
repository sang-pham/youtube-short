import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {WelcomeScreen} from '../welcome';
import {SigninScreen} from './SigninScreen';
import {SignupScreen} from './SignupScreen';
import RNBootSplash from 'react-native-bootsplash';

const authStack = createStackNavigator();

export default function AuthStack({navigation}) {
  return (
    <authStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <authStack.Screen name="Welcome" component={WelcomeScreen} />
      <authStack.Screen name="Signin" component={SigninScreen} />
      <authStack.Screen name="Signup" component={SignupScreen} />
    </authStack.Navigator>
  );
}
