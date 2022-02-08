import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text} from 'react-native';
import {Button, Box} from 'native-base';
import {logout} from '../../redux/reducers/user';

const ProfileScreen = ({navigation}) => {
  const userReducer = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log('logout');
    dispatch(logout({}));
  };

  useEffect(() => {
    if (!userReducer.authenticated) {
      navigation.navigate('Home');
    }
  }, [userReducer.authenticated]);

  return (
    <View>
      <Text>Profile screen</Text>
      <Text>{JSON.stringify(userReducer.user)}</Text>
      <Box alignItems="center">
        <Button onPress={handleLogout}>Log out </Button>
      </Box>
    </View>
  );
};

export default ProfileScreen;
