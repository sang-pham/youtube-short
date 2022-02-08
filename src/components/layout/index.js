// import React, { useEffect, useMemo } from 'react';
// import { View, Text, Button } from 'react-native';

// import { useDispatch, useSelector } from 'react-redux';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import { isAuthenticated } from '../../redux/reducers';
// import {
// 	SigninScreen, SignupScreen, HomeScreen,
// 	ProfileScreen, InboxScreen
// } from '../../screens';

// import Icon from 'react-native-vector-icons/FontAwesome';


// const Layout = () => {
// 	const dispatch = useDispatch();
// 	const userReducer = useSelector(state => state.user);

// 	let Stack = useMemo(() => {
// 		if (!userReducer.authenticated) {
// 			return createNativeStackNavigator();
// 		} else {
// 			return createBottomTabNavigator();
// 		}
// 	}, [userReducer.authenticated]);

// 	useEffect(() => {
// 		if (!userReducer.loaded) {
// 			dispatch(isAuthenticated({}));
// 		}
// 	}, [userReducer.loaded]);

// 	// useEffect(() => {
// 	//   console.log(userReducer.authenticated);
// 	//   if (userReducer.authenticated) {
// 	//     console.log('authenticated');
// 	//     Stack = createBottomTabNavigator();
// 	//   }
// 	// }, [userReducer.authenticated]);
// 	return (
// 		<>
// 			{!userReducer.authenticated ? (
// 				<Stack.Navigator>
// 					<Stack.Screen name="Home" component={HomeScreen} />
// 					<Stack.Screen name="Signin" component={SigninScreen} />
// 					<Stack.Screen name="Signup" component={SignupScreen} />
// 				</Stack.Navigator>
// 			) : (
// 				<Stack.Navigator>
// 					<Stack.Screen
// 						name="Home"
// 						options={{
// 							tabBarIcon: ({ color }) => (
// 								<Icon color={color} name="home" size={26} />
// 							),
// 						}}
// 						component={HomeScreen}
// 					/>
// 					<Stack.Screen
// 						name="Inbox"
// 						options={{
// 							tabBarIcon: ({ color }) => (
// 								<Icon color={color} name="comment" size={26} />
// 							),
// 						}}
// 						component={InboxScreen}
// 					/>
// 					<Stack.Screen
// 						name="Profile"
// 						options={{
// 							tabBarIcon: ({ color }) => (
// 								<Icon color={color} name="user-circle" size={26} />
// 							),
// 						}}
// 						component={ProfileScreen}
// 					/>
// 				</Stack.Navigator>
// 			)}
// 		</>
// 	);
// }

// export { Layout }

import React, { useEffect, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainScreen } from './MainScreen';
import { DirectMessage, HomeScreen, RecordScreen, SigninScreen, SignupScreen } from '../../screens';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthenticated } from '../../redux/reducers';


const Layout = () => {
	const dispatch = useDispatch();
	const userReducer = useSelector(state => state.user);
	let Stack = useMemo(() => {
		if (!userReducer.authenticated) {
			return createNativeStackNavigator();
		}

		return createStackNavigator();

	}, [userReducer.authenticated]);

	useEffect(() => {
		if (!userReducer.loaded) {
			dispatch(isAuthenticated({}));
		}
	}, [userReducer.loaded]);

	return (
		<>
			{!userReducer.authenticated ?
				<Stack.Navigator>
					<Stack.Screen name="Home" component={HomeScreen} />
					<Stack.Screen name="Signin" component={SigninScreen} />
					<Stack.Screen name="Signup" component={SignupScreen} />
				</Stack.Navigator>
				:
				<Stack.Navigator screenOptions={{
					presentation: "modal"
				}}>
					<Stack.Screen
						name="Main"
						component={MainScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						options={{ headerShown: false }}
						name="Record"
						component={RecordScreen}
					/>
					<Stack.Screen
						options={{ headerShown: false }}
						name="DirectMessage"
						component={DirectMessage}
					/>
				</Stack.Navigator>
			}

		</>
	);
};

export { Layout };