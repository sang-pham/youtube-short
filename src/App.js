/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import store from './redux';
import { Layout } from './components';
import { LogBox } from 'react-native';
import { theme } from './styles'

//ignore warning

LogBox.ignoreLogs(['NativeBase:']);


const App = () => {

  return (
    <NavigationContainer>
      <NativeBaseProvider >
        <Layout />
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
