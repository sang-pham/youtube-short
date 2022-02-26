import React from 'react';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Box, Center, Text, HStack } from 'native-base'
import { Container } from '../../styles';

const InboxScreen = ({ navigation }) => {

  return (
    <Container>
      <Box borderBottomWidth="1"
        borderColor="coolGray.200" py={4} px={3} mb={2}>
        <Center>
          <HStack alignItems={'center'}>
            <Text _dark={{ color: "warmGray.50" }}
              fontSize={'xl'}
              color="coolGray.800" bold>
              All activity
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="black" />
          </HStack>

        </Center>

        <Feather
          style={{ position: 'absolute', right: 15, top: 15 }}
          name="send"
          size={24}
          color="black"
          onPress={() => { navigation.navigate('DirectMessage'); }}
        />
      </Box>
    </Container>
  );
};

export { InboxScreen };