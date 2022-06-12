import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Animated, View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Button} from 'native-base';
import {getRelationship} from '../../redux/reducers';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HomeFollowing from './following';
import HomeSuggest from './suggest';

function MyTabBar({state, descriptors, navigation, position}) {
  return (
    <View style={tabBarStyle.mainTab}>
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
            style={tabBarStyle.tab}>
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
  );
}

const Tab = createMaterialTopTabNavigator();

const HomeScreen = ({navigation}) => {
  const userReducer = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRelationship({}));
  }, [userReducer.relationshipLoaded]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <MyTabBar {...props} />}
      initialRouteName="HomeSuggest">
      <Tab.Screen
        name="HomeFollowing"
        component={HomeFollowing}
        options={{tabBarLabel: 'Following'}}
      />
      <Tab.Screen
        name="HomeSuggest"
        component={HomeSuggest}
        options={{tabBarLabel: 'For you'}}
      />
    </Tab.Navigator>
  );
};

export {HomeScreen};

const tabBarStyle = StyleSheet.create({
  mainTab: {
    width: '50%',
    margin: 'auto',
    position: 'absolute',
    zIndex: 10,
    top: '5%',
    left: '25%',
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
  },
  tabText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
  currentTabText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    color: '#fff',
  },
});
