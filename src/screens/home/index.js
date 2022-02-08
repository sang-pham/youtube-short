import React from 'react';
import { useSelector } from 'react-redux';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const userReducer = useSelector(state => state.user);

  return (
    <View>
      <Text>Home screen 123</Text>
      {userReducer.authenticated ? (
        <Text>Logged in</Text>
      ) : (
        <Button
          title="Login now"
          onPress={() => navigation.navigate('Signin')}
        />
      )}
    </View>
  );
}

export { HomeScreen }
