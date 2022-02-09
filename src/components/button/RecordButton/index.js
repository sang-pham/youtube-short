import React from 'react';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Container, Button } from './styles';


const RecordButton = ({ home }) => {
  return (
    <Container home={home}>
      <Button>
        <FontAwesome5 name="plus" size={18} color={home ? '#000' : '#fff'} />
      </Button>
    </Container>
  );
};

export { RecordButton };