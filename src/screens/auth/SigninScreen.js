import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Center, Input, Stack, Button, View, Text,
  Heading, VStack, FormControl, Box, Link, HStack,
} from 'native-base';
import { globalStyle } from '../../styles';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { axiosInstance } from '../../libs/utils';
import { signin } from '../../redux/reducers/user';



const schema = yup
  .object({
    email: yup.string().required('Email must be filled'),
    password: yup
      .string()
      .required('Password must be filled')
      .min(6, 'Password must has at least 6 characters'),
  })
  .required();

const SigninScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userReducer = useSelector(state => state.user);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState('');

  const onSubmit = async data => {
    try {
      let res = await axiosInstance.post('/signin', data);
      if (res.status === 200) {
        dispatch(signin({ data: res.data }));
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data) {
        if (err.response.data.error) {
          setError(err.response.data.error);
        }
      }
    }
  };

  // useEffect(() => {
  //   if (userReducer.authenticated) {
  //     navigation.navigate('Home');
  //   }
  // }, [userReducer.authenticated]);

  return (
    <Center w="100%" >
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }}>
          Welcome
        </Heading>
        <Heading mt="1" _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="xs">
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
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
                  placeholder="Email"
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
                  placeholder="Password"
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
            <Link _text={{
              fontSize: "xs",
              fontWeight: "500",
              color: "indigo.500"
            }} alignSelf="flex-end" mt="1">
              Forget Password?
            </Link>
          </FormControl>
          <Button mt="2" colorScheme="indigo"
            onPress={handleSubmit(onSubmit)}>
            Sign in
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{
              color: "warmGray.200"
            }}>
              I'm a new user.{" "}
            </Text>
            <Link _text={{
              color: "indigo.500",
              fontWeight: "medium",
              fontSize: "sm"
            }}
              onPress={() => navigation.navigate('Signup')}
            >
              Sign Up
            </Link>
          </HStack>
        </VStack >
      </Box >
    </Center >

  );
};

export { SigninScreen };
