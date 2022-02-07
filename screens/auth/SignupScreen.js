import React, {useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Center, Input, Stack, Button, Alert, VStack, HStack} from 'native-base';
import globalStyle from '../../styles';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup
  .object({
    firstName: yup.string().required('First name must be filled'),
    lastName: yup.string().required('Last name must be filled'),
    userName: yup.string().required('User name must be filled'),
    birthDay: yup.string().required('Birthday must be filled'),
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

const SignupScreen = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      userName: '',
      birthDay: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <ScrollView>
      <Center>
        <Stack space={4} w="100%" alignItems="center">
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                w={{
                  base: '75%',
                  md: '25%',
                }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="First name"
                variant="underlined"
                type="text"
              />
            )}
            name="firstName"
          />
          {errors.firstName?.message && (
            <Text
              style={{
                ...globalStyle.errorColor,
                width: '75%',
                margin: 'auto',
              }}>
              {errors.firstName?.message}
            </Text>
          )}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                w={{
                  base: '75%',
                  md: '25%',
                }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Last name"
                variant="underlined"
                type="text"
              />
            )}
            name="lastName"
          />
          {errors.lastName?.message && (
            <Text
              style={{
                ...globalStyle.errorColor,
                width: '75%',
                margin: 'auto',
              }}>
              {errors.lastName?.message}
            </Text>
          )}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                w={{
                  base: '75%',
                  md: '25%',
                }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="User name"
                variant="underlined"
                type="text"
              />
            )}
            name="userName"
          />
          {errors.userName?.message && (
            <Text
              style={{
                ...globalStyle.errorColor,
                width: '75%',
                margin: 'auto',
              }}>
              {errors.userName?.message}
            </Text>
          )}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                w={{
                  base: '75%',
                  md: '25%',
                }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Email"
                variant="underlined"
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
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                w={{
                  base: '75%',
                  md: '25%',
                }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Password"
                variant="underlined"
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
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                w={{
                  base: '75%',
                  md: '25%',
                }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Confirm Password"
                variant="underlined"
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
          <Text
            onPress={() => navigation.navigate('Signin')}
            style={globalStyle.baseBlueColor}>
            Already have account? Sign in now
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Button size="sm" onPress={handleSubmit(onSubmit)}>
              Sign up
            </Button>
          </View>
        </Stack>
      </Center>
    </ScrollView>
  );
};

export {SignupScreen};
