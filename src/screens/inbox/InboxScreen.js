import React, { useEffect, useState } from 'react';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Box, Center, Text, HStack, Button } from 'native-base';
import { Badge, HeaderCustom, Container } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { axiosAuth } from '../../libs';
import { getNumberOfUnRead } from '../../redux/reducers';
import { Pressable } from 'react-native';
import { CameraScreen } from '../camera';


const InboxScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const numberOfUnRead = useSelector(state => state.inbox.numberOfUnRead);

  useEffect(() => {
    dispatch(getNumberOfUnRead({}));
  }, [])


  return (
    <Container>
      <HeaderCustom
        title={<HStack >
          <Text _dark={{ color: "warmGray.50" }}
            fontSize={'xl'}
            color="coolGray.800" bold>
            All activity
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="black" />
        </HStack>}
        rightElement={
          <Pressable onPress={() => { navigation.navigate('DirectMessage'); }}>
            <Badge title={numberOfUnRead} >
              <Feather
                name="send"
                size={24}
                color="black"
              />
            </Badge>
          </Pressable>
        }
      />

      {/* <CameraScreen /> */}

    </Container >
  );
};

export { InboxScreen };