import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, Button} from 'react-native';
import {getRelationship} from '../../redux/reducers';

const HomeScreen = ({navigation}) => {
  const userReducer = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRelationship({}));
  }, [userReducer.relationshipLoaded]);

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
};

export {HomeScreen};
