import React, {useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {
  Center,
  Input,
  Stack,
  Button,
  Alert,
  VStack,
  HStack,
  Modal,
} from 'native-base';
import globalStyle from '../../styles';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {axiosInstance} from '../../libs/utils';

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

const SignupScreen = ({navigation}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
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

export {SignupScreen};
