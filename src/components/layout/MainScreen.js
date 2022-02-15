import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {StatusBar, Platform} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {HomeScreen, InboxScreen, ProfileScreen} from '../../screens';
import {RecordButton} from '../button';

const Tab = createMaterialBottomTabNavigator();

const MainScreen = () => {
  const [home, setHome] = useState(true);
  const userReducer = useSelector(state => state.user);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      if (home) {
        StatusBar.setBackgroundColor('#000');
        StatusBar.setBarStyle('light-content');
      } else {
        StatusBar.setBackgroundColor('#fff');
      }
    }
  }, [home]);

  return (
    <Tab.Navigator
      shifting={false}
      barStyle={{
        backgroundColor: home ? '#000' : '#fff',
      }}
      initialRouteName="Home"
      activeColor={home ? '#fff' : '#000'}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        listeners={{
          focus: () => setHome(true),
          blur: () => setHome(false),
        }}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Discover"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({color}) => (
            <FontAwesome5 name="compass" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Live"
        component={HomeScreen}
        listeners={({navigation}) => ({
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
          tabBarIcon: ({color}) => (
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
          tabBarIcon: ({color}) => (
            <AntDesign name="user" size={24} color={color} />
          ),
        }}
        initialParams={{userId: userReducer.user.id}}
      />
    </Tab.Navigator>
  );
};

export {MainScreen};
