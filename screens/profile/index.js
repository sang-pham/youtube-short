import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView, Text} from 'react-native';
import {Button, Box, Center, Avatar, Input, FormControl} from 'native-base';
import globalStyle from '../../styles';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {logout} from '../../redux/reducers/user';
import {baseURL} from '../../libs/config';

const schema = yup
  .object({
    email: yup.string().required('Email must be filled'),
    first_name: yup.string().required('First name must be filled'),
    last_name: yup.string().required('First name must be filled'),
    user_name: yup.string().required('First name must be filled'),
  })
  .required();

const ProfileScreen = ({navigation}) => {
  const userReducer = useSelector(state => state.user);
  const dispatch = useDispatch();
  const {
    control,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: userReducer.user.email,
      first_name: userReducer.user.first_name,
      last_name: userReducer.user.last_name,
      user_name: userReducer.user.user_name,
    },
    resolver: yupResolver(schema),
  });

  const handleLogout = () => {
    console.log('logout');
    dispatch(logout({}));
  };

  const cancel = () => {
    setValue('email', userReducer.user.email);
    setValue('first_name', userReducer.user.first_name);
    setValue('last_name', userReducer.user.last_name);
    setValue('user_name', userReducer.user.user_name);
  };

  const onSubmit = async data => {
    console.log(data);
  };

  useEffect(() => {
    if (!userReducer.authenticated) {
      navigation.navigate('Home');
    }
  }, [userReducer.authenticated]);

  return (
    <ScrollView>
      <Center
        style={{
          marginTop: '5%',
        }}>
        <Avatar
          size="xl"
          source={{
            uri: `${baseURL}/user/avatar/${userReducer.user.id}`,
          }}
        />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormControl
              style={{marginBottom: '5%'}}
              w={{
                base: '80%',
                md: '25%',
              }}>
              <FormControl.Label>Email</FormControl.Label>
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                variant="underlined"
                type="text"
              />
            </FormControl>
          )}
          name="email"
        />
        {errors.email?.message && (
          <Text
            style={{
              ...globalStyle.errorColor,
              width: '80%',
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
            <FormControl
              style={{marginBottom: '5%'}}
              w={{
                base: '80%',
                md: '25%',
              }}>
              <FormControl.Label>First name</FormControl.Label>
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                variant="underlined"
                type="text"
              />
            </FormControl>
          )}
          name="first_name"
        />
        {errors.first_name?.message && (
          <Text
            style={{
              ...globalStyle.errorColor,
              width: '80%',
              margin: 'auto',
            }}>
            {errors.first_name?.message}
          </Text>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormControl
              style={{marginBottom: '5%'}}
              w={{
                base: '80%',
                md: '25%',
              }}>
              <FormControl.Label>Last name</FormControl.Label>
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                variant="underlined"
                type="text"
              />
            </FormControl>
          )}
          name="last_name"
        />
        {errors.last_name?.message && (
          <Text
            style={{
              ...globalStyle.errorColor,
              width: '80%',
              margin: 'auto',
            }}>
            {errors.last_name?.message}
          </Text>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormControl
              style={{marginBottom: '5%'}}
              w={{
                base: '80%',
                md: '25%',
              }}>
              <FormControl.Label>User name</FormControl.Label>
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                variant="underlined"
                type="text"
              />
            </FormControl>
          )}
          name="user_name"
        />
        {errors.user_name?.message && (
          <Text
            style={{
              ...globalStyle.errorColor,
              width: '80%',
              margin: 'auto',
            }}>
            {errors.user_name?.message}
          </Text>
        )}
        <Box alignItems={'right'}>
          <Button size="sm" onPress={cancel()}>
            Cancel
          </Button>
          <Button size="sm" onPress={handleSubmit(onSubmit)}>
            Save
          </Button>
        </Box>
        <Box alignItems="center">
          <Button onPress={handleLogout}>Log out </Button>
        </Box>
      </Center>
    </ScrollView>
  );
};

export default ProfileScreen;
