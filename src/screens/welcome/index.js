import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Button, VStack, Box, Heading, Center } from 'native-base';

const WelcomeScreen = ({ navigation }) => {
  const userReducer = useSelector(state => state.user);
  const dispatch = useDispatch();

  return (
    <Center w='100%'>
      <Box safeArea mt={5}>
        <Heading size="xl" fontWeight="600" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }}>
          Welcome
        </Heading>
        <VStack space={3} mt={5}>
          <Button
            colorScheme="indigo"
            onPress={() => navigation.navigate('Signin')}
          >Login</Button>

          <Button
            colorScheme="indigo"
            onPress={() => navigation.navigate('Signup')}
          >Sign Up</Button>
        </VStack>
      </Box>
    </Center >

  );
};

export { WelcomeScreen };
