import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, Button } from 'native-base';
import { getRelationship } from '../../redux/reducers';

const HomeScreen = ({ navigation }) => {
  const userReducer = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRelationship({}));
  }, [userReducer.relationshipLoaded]);

  return (
    <View>
      <Text>Home screen 123</Text>

      <Text>Logged in</Text>

    </View>
  );
};

export { HomeScreen };
