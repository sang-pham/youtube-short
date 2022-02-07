import React from 'react';
import {View, Text, Button} from 'react-native';

export default function HomeScreen({navigation}) {
  return (
    <View>
      <Text>Home screen 123</Text>
      <Button title="Login now" onPress={() => navigation.navigate('Signin')} />
    </View>
  );
}
