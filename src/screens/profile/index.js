import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView, View, Text, TouchableOpacity} from 'react-native';
import {Button, Box, Center, Avatar, Input, FormControl} from 'native-base';
import globalStyle from '../../styles';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {logout} from '../../redux/reducers/user';
import {baseURL} from '../../libs/config';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
// import FormData from 'form-data';
import {updateProfile} from '../../redux/reducers';

const schema = yup
  .object({
    email: yup.string().required('Email must be filled'),
    first_name: yup.string().required('First name must be filled'),
    last_name: yup.string().required('Last name must be filled'),
    user_name: yup.string().required('User name must be filled'),
  })
  .required();

const ProfileScreen = ({navigation}) => {
  const userReducer = useSelector(state => state.user);
  const [avatar, setAvatar] = useState('');
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
    dispatch(logout({}));
  };

  const cancel = () => {
    setValue('email', userReducer.user.email);
    setValue('first_name', userReducer.user.first_name);
    setValue('last_name', userReducer.user.last_name);
    setValue('user_name', userReducer.user.user_name);
    setAvatar('');
  };

  const onSubmit = async data => {
    dispatch(
      updateProfile({
        data,
        avatar,
        userId: userReducer.user.id,
      }),
    );
  };

  const selectFile = async () => {
    try {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        console.log(image);
        setAvatar(image);
      });
    } catch (err) {
      console.log(err);
      setAvatar(null);
      // if (DocumentPicker.isCancel(err)) {
      //   alert('Canceled');
      // } else {
      //   // For Unknown Error
      //   alert('Unknown Error: ' + JSON.stringify(err));
      //   throw err;
      // }
    }
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
        <View
          style={{
            position: 'relative',
            width: '100%',
            alignItems: 'center',
          }}>
          <Avatar
            size="xl"
            source={{
              uri:
                (avatar && avatar.path) ||
                `${baseURL}/user/${userReducer.user.id}/avatar`,
            }}
          />
          <TouchableOpacity
            onPress={selectFile}
            style={{
              position: 'absolute',
              top: '65%',
              right: '38%',
            }}>
            <Icon name="camera" size={24} />
          </TouchableOpacity>
        </View>
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
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            width: '80%',
            marginBottom: '5%',
          }}>
          <Button
            variant="ghost"
            size="sm"
            style={{
              marginRight: '5%',
            }}
            onPress={cancel}>
            Cancel
          </Button>
          <Button size="sm" variant="ghost" onPress={handleSubmit(onSubmit)}>
            Save
          </Button>
        </View>
        <Box alignItems="center">
          <Button variant="ghost" onPress={handleLogout}>
            Log out{' '}
          </Button>
        </Box>
      </Center>
    </ScrollView>
  );
};

export {ProfileScreen};
