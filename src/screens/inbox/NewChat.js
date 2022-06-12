import React, {useCallback, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {axiosAuth, getAvatarUrl, useSearch} from '../../libs';
import {
  Avatar,
  Box,
  FlatList,
  HStack,
  VStack,
  Text,
  Center,
  Input,
  Spinner,
} from 'native-base';
import {useSelector} from 'react-redux';
import {
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import {HeaderCustom, Container} from '../../components';

const NewChatScreen = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const {searchData, searchLoading, setText, handleSearch} =
    useSearch('/user/search');

  const onSearch = text => {
    handleSearch(text);
  };

  return (
    <Container>
      <HeaderCustom
        title="New Chat"
        leftElement={<Text onPress={navigation.goBack}>Close</Text>}
        bottomElement={
          <Input
            placeholder="Search"
            variant="filled"
            borderRadius="5"
            py="2"
            borderWidth="0"
            mt="5"
            onChangeText={onSearch}
            InputLeftElement={
              <AntDesign
                style={{padding: 10}}
                name="search1"
                size={18}
                color="#000"
              />
            }
            InputRightElement={
              searchLoading && <Spinner size="sm" color="#000" mr="2" />
            }
          />
        }
      />

      <Box>
        <FlatList
          data={searchData.filter(item => item.id !== user.id)}
          renderItem={({item}) => (
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate('ChatBox', {
                  personId: item.id,
                  chatBoxId: null,
                });
              }}>
              <Box px="5" py="3">
                <HStack space={3} justifyContent="flex-start">
                  <Avatar
                    size="48px"
                    source={{
                      uri: getAvatarUrl(item.id),
                    }}
                  />
                  <VStack>
                    <Text
                      _dark={{
                        color: 'warmGray.50',
                      }}
                      color="coolGray.800"
                      bold>
                      {item.user_name}
                    </Text>
                    <Text
                      color="coolGray.600"
                      _dark={{
                        color: 'warmGray.200',
                      }}>
                      {item.full_name}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </TouchableWithoutFeedback>
          )}
          keyExtractor={item => item.id}
        />
      </Box>
    </Container>
  );
};

export {NewChatScreen};
