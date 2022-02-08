import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text } from 'react-native';
import { Center, Input, Stack, Button } from 'native-base';
import globalStyle from '../../styles';
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

  useEffect(() => {
    if (userReducer.authenticated) {
      navigation.navigate('Home');
    }
  }, [userReducer.authenticated]);

  return (
    <View>
      <Center>
        <Stack space={4} w="100%" alignItems="center">
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
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
            render={({ field: { onChange, onBlur, value } }) => (
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
          <Text
            onPress={() => navigation.navigate('Signup')}
            style={globalStyle.baseBlueColor}>
            Don't have account? Sign up here
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Button size="sm" onPress={handleSubmit(onSubmit)}>
              Log in
            </Button>
          </View>
        </Stack>
      </Center>
    </View>
  );
};

export { SigninScreen };
