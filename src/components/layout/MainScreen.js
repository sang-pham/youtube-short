import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusBar, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, InboxScreen, ProfileScreen } from '../../screens';
import { useNavigation } from '@react-navigation/native';
import { RecordButton } from '../button';
import { socketClient } from '../../libs';
import { receiveMessage, sentMessage } from '../../redux/reducers';

const Tab = createBottomTabNavigator();

const MainScreen = () => {
  const [home, setHome] = useState(true);
  const userReducer = useSelector(state => state.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    socketClient.auth = { userId: userReducer.user.id };
    socketClient.connect();

    socketClient.on('receive-message', (data) => {
      dispatch(receiveMessage(data))
    });

    socketClient.on('sent-message', (data) => {
      dispatch(sentMessage(data))
    })

    socketClient.on("disconnect", () => {
      socketClient.connect();
      console.log('try to auto reconnect');
    });

    socketClient.on('connect_error', error => {
      console.log(error, 'connect');
    });

    socketClient.on('error', error => {
      console.log(error, 'error');
    });

  }, []);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      if (home) {
        StatusBar.setBackgroundColor('#000');
        StatusBar.setBarStyle('light-content');
      } else {
        StatusBar.setBackgroundColor('#fff');
      }
      StatusBar.setBackgroundColor('#fff');
    }
  }, [home]);

  const backToProfile = () => {
    navigation.navigate('Profile', {
      userId: userReducer.user.id,
    });
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: home ? '#000' : '#fff',
          position: 'absolute',
        },
        tabBarActiveTintColor: home ? '#fff' : '#000',
      }}
      initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        listeners={{
          focus: () => setHome(true),
          blur: () => setHome(false),
        }}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Discover"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="compass" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Live"
        component={HomeScreen}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Record');
          },
        })}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => <RecordButton home={home} />,
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          tabBarLabel: 'Inbox',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="message-text-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <AntDesign
              name="user"
              size={24}
              color={color}
              onPress={backToProfile}
            />
          ),
        }}
        initialParams={{ userId: userReducer.user.id }}
      />
    </Tab.Navigator>
  );
};

export { MainScreen };
