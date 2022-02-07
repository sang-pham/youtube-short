import React from 'react';
import {View, Text} from 'react-native';
import {Center, Input, Stack, Button} from 'native-base';
import globalStyle from '../../styles';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup
  .object({
    email: yup.string().required('Email must be filled'),
    password: yup
      .string()
      .required('Password must be filled')
      .min(6, 'Password must has at least 6 characters'),
  })
  .required();

const SigninScreen = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <View>
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

export {SigninScreen};
