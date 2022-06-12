import React from 'react';
import {Animated, View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {ProfileFollowersScreen} from './follower';
import {ProfileFollowingsScreen} from './following';
import AntDesign from 'react-native-vector-icons/AntDesign';

function MyTabBar({
  state,
  descriptors,
  navigation,
  position,
  userId,
  userName,
}) {
  return (
    <>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          padding: '2%',
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
        }}>
        <AntDesign
          name="arrowleft"
          size={24}
          onPress={() =>
            navigation.navigate('Tab_Profile', {
              userId,
            })
          }
        />
        <Text
          style={{
            width: '90%',
            fontWeight: '600',
            textAlign: 'center',
            fontSize: 18,
          }}>
          {userName}
        </Text>
      </View>
      <View style={{flexDirection: 'row', width: '100%'}}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({name: route.name, merge: true});
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              key={index}
              style={isFocused ? tabBarStyle.currentTab : tabBarStyle.tab}>
              <Animated.Text
                style={
                  isFocused ? tabBarStyle.currentTabText : tabBarStyle.tabText
                }>
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function ProfileRelationship({route}) {
  const {userId, userName, defaultTab} = route.params;
  return (
    <Tab.Navigator
      initialRouteName={defaultTab || 'ProfileFollowing'}
      tabBar={props => (
        <MyTabBar {...props} userId={userId} userName={userName} />
      )}>
      <Tab.Screen
        name="ProfileFollowing"
        children={props => (
          <ProfileFollowingsScreen {...props} userId={userId} />
        )}
        options={{tabBarLabel: 'Followings'}}
      />
      <Tab.Screen
        name="ProfileFollower"
        component={props => (
          <ProfileFollowersScreen {...props} userId={userId} />
        )}
        options={{tabBarLabel: 'Followers'}}
      />
    </Tab.Navigator>
  );
}

const tabBarStyle = StyleSheet.create({
  tab: {
    flex: 1,
    padding: 8,
  },
  currentTab: {
    flex: 1,
    padding: 8,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
  },
  tabText: {
    fontSize: 16,
    textAlign: 'center',
  },
  currentTabText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
