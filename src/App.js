/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider, useDispatch} from 'react-redux';
import store from './redux';
import {Layout} from './components';
import {LogBox} from 'react-native';
import {theme} from './styles';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import {isAuthenticated} from './redux/reducers';

//ignore warning
LogBox.ignoreLogs(['NativeBase:']);

const App = () => {
  useEffect(() => {
    NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Toast.show({
          type: 'error',
          text1: 'Problem',
          text2: 'No internet access',
        });
      }
    });
    store.dispatch(isAuthenticated({}));
  }, []);

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Layout />
            <Toast />
          </NavigationContainer>
        </SafeAreaProvider>
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
