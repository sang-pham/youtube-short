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
import UserFeed from '../../components/UserFeed';

const DiscoverySearchUser = ({navigation}) => {
  const {searchData, searchLoading, setText, handleSearch} =
    useSearch('/user/search');

  const onSearch = text => {
    handleSearch(text);
  };

  return (
    <Container>
      <HeaderCustom
        title="Find user"
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
          data={searchData}
          renderItem={({item}) => <UserFeed user={item} />}
          keyExtractor={item => item.id}
        />
      </Box>
    </Container>
  );
};

export {DiscoverySearchUser};
