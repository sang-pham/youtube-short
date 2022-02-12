import React from 'react';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

import { Container, Title, Header } from './styles';

const InboxScreen = ({ navigation }) => {

  return (
    <Container>
      <Header>
        <Title>All activity</Title>
        <MaterialIcons name="arrow-drop-down" size={24} color="black" />
        <Feather
          style={{ position: 'absolute', right: 10, top: 10 }}
          name="send"
          size={24}
          color="black"
          onPress={(e) => {
            e.preventDefault();
            navigation.navigate('DirectMessage');
          }}
        />
      </Header>
    </Container>
  );
};

export { InboxScreen };