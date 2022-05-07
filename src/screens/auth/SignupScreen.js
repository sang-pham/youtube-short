import React, { useState } from 'react';
import {
  Center,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Modal,
  ScrollView,
  Heading, FormControl,
  Link,
  Box
} from 'native-base';
import { globalStyle } from '../../styles';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { axiosInstance } from '../../libs/utils';

const schema = yup
  .object({
    first_name: yup.string().required('First name must be filled'),
    last_name: yup.string().required('Last name must be filled'),
    user_name: yup.string().required('User name must be filled'),
    email: yup.string().required('Email must be filled'),
    password: yup
      .string()
      .required('Password must be filled')
      .min(6, 'Password must has at least 6 characters'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  })
  .required();

const SignupScreen = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      user_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  });

  const [modalShow, setModalShow] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async data => {
    try {
      let res = await axiosInstance.post('/signup', data);
      if (res.status == 201) {
        setModalShow(true);
        setValue('first_name', '');
        setValue('last_name', '');
        setValue('user_name', '');
        setValue('email', '');
        setValue('password', '');
        setValue('confirmPassword', '');
        setError('');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      }
    }
  };

  return (
    <>
      <ScrollView>
        <Center w="100%">
          <Box safeArea p="2" w="90%" maxW="290" py="8">
            <Heading size="lg" color="coolGray.800" _dark={{
              color: "warmGray.50"
            }} fontWeight="semibold">
              Welcome
            </Heading>
            <Heading mt="1" color="coolGray.600" _dark={{
              color: "warmGray.200"
            }} fontWeight="medium" size="xs">
              Sign up to continue!
            </Heading>
            <VStack space={3} mt="5">
              <FormControl>
                <FormControl.Label>First Name</FormControl.Label>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      type="text"
                    />
                  )}
                  name="first_name"
                />
                {errors.first_name?.message && (
                  <Text
                    style={{
                      ...globalStyle.errorColor,
                      width: '75%',
                      margin: 'auto',
                    }}>
                    {errors.first_name?.message}
                  </Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Last Name</FormControl.Label>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      type="text"
                    />
                  )}
                  name="last_name"
                />
                {errors.last_name?.message && (
                  <Text
                    style={{
                      ...globalStyle.errorColor,
                      width: '75%',
                      margin: 'auto',
                    }}>
                    {errors.last_name?.message}
                  </Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>User Name</FormControl.Label>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      type="text"
                    />
                  )}
                  name="user_name"
                />
                {errors.user_name?.message && (
                  <Text
                    style={{
                      ...globalStyle.errorColor,
                      width: '75%',
                      margin: 'auto',
                    }}>
                    {errors.user_name?.message}
                  </Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Email</FormControl.Label>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      type="email"
                    />
                  )}
                  name="email"
                />
                {errors.email?.message && (
                  <Text
                    style={{
                      ...globalStyle.errorColor,
                      width: '75%',
                      margin: 'auto',
                    }}>
                    {errors.email?.message}
                  </Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Password</FormControl.Label>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      type="password"
                    />
                  )}
                  name="password"
                />
                {errors.password?.message && (
                  <Text
                    style={{
                      ...globalStyle.errorColor,
                      width: '75%',
                      margin: 'auto',
                    }}>
                    {errors.password?.message}
                  </Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Confirm Password</FormControl.Label>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      type="password"
                    />
                  )}
                  name="confirmPassword"
                />
                {errors.confirmPassword?.message && (
                  <Text
                    style={{
                      ...globalStyle.errorColor,
                      width: '75%',
                      margin: 'auto',
                    }}>
                    {errors.confirmPassword?.message}
                  </Text>
                )}
                {error.length > 0 && (
                  <Text
                    style={{
                      ...globalStyle.errorColor,
                      width: '75%',
                      margin: 'auto',
                    }}>
                    {error}
                  </Text>
                )}
              </FormControl>
              <HStack mt="6" justifyContent="center">
                <Text fontSize="sm" color="coolGray.600" _dark={{
                  color: "warmGray.200"
                }}>
                  Already have account? {" "}
                </Text>
                <Link _text={{
                  color: "indigo.500",
                  fontWeight: "medium",
                  fontSize: "sm"
                }}
                  onPress={() => navigation.navigate('Signin')}
                >
                  Sign in now
                </Link>
              </HStack>
              <Button mt="2" colorScheme="indigo" onPress={handleSubmit(onSubmit)}>
                Sign up
              </Button>
            </VStack>
          </Box>
        </Center>
      </ScrollView>

      <Modal isOpen={modalShow} onClose={() => setModalShow(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Body>
            <Text>Sign up successfully. Sign in now ? </Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setModalShow(false);
                }}>
                No
              </Button>
              <Button
                onPress={() => {
                  setModalShow(false);
                  navigation.navigate('Signin');
                }}>
                Yes
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};

export { SignupScreen };
