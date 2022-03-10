import React, { useEffect, useState } from 'react';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Box, Center, Text, HStack, Badge, Button } from 'native-base'
import { Container } from '../../styles';
import { useDispatch, useSelector } from 'react-redux';
import { axiosAuth } from '../../libs';
import { getNumberOfUnRead } from '../../redux/reducers';
import { Pressable } from 'react-native';


const InboxScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const numberOfUnRead = useSelector(state => state.inbox.numberOfUnRead);


  useEffect(() => {
    dispatch(getNumberOfUnRead({}));
  }, [])


  return (
    <Container>
      <Box borderBottomWidth="1"
        borderColor="coolGray.200" py={4} px={3} mb={2}>
        <Center>
          <HStack >
            <Text _dark={{ color: "warmGray.50" }}
              fontSize={'xl'}
              color="coolGray.800" bold>
              All activity
            </Text>

            <MaterialIcons name="arrow-drop-down" size={24} color="black" />

          </HStack>
        </Center>


        <Pressable onPress={() => { navigation.navigate('DirectMessage'); }}
          style={{ position: 'absolute', right: 15, top: 15 }}>
          <Feather

            name="send"
            size={24}
            color="black"
          />

          {
            numberOfUnRead > 0 &&
            <Badge colorScheme='secondary' rounded="xl" style={{
              position: 'absolute', right: -15, top: -15,
              width: 25, height: 25
            }} >
              <Text color='white'>
                {numberOfUnRead}
              </Text>
            </Badge>
          }

        </Pressable>



      </Box>
    </Container >
  );
};

export { InboxScreen };