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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './redux';
import { Layout } from './components';
import { LogBox } from 'react-native';
import { theme } from './styles'


//ignore warning

LogBox.ignoreLogs(['NativeBase:']);


const App = () => {

  return (
    <Provider store={store}>
      <NativeBaseProvider >
        <SafeAreaProvider>
          <NavigationContainer>
            <Layout />
          </NavigationContainer>
        </SafeAreaProvider>
      </NativeBaseProvider>
    </Provider>
  );
};



export default App;
