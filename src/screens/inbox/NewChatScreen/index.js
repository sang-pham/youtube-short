import React, { useCallback, useState } from 'react';
import { Input, Search, SearchView } from './styles';
import { Container } from '../../../styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
import _ from 'lodash'
import { axiosAuth, getAvatarUrl, getFullName } from '../../../libs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Avatar, Box, FlatList, HStack, VStack,
  Text, Spacer, Flex, Center
} from 'native-base';
import { useSelector } from 'react-redux';

const NewChatScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [userSearched, setUserSearched] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const userReducer = useSelector(state => state.user);
  const searchDebounce = useCallback(_.debounce(async (searchName) => {
    if (searchName !== '') {
      let response = await axiosAuth.get('/user/search', {
        text: searchName
      })
      setUserSearched(response.data.users);
      setSearchLoading(false);
    }
  }, 200), []);

  const onSearch = (text) => {

    setSearch(text);
    searchDebounce(text);
    setSearchLoading(true);
    setUserSearched([]);
  }


  return (
    <Container>
      <Box borderBottomWidth="1"
        borderColor="coolGray.200" py={4} px={3} mb={2}>
        <MaterialIcons
          style={{ position: 'absolute', top: 18, left: 10 }}
          name="arrow-back"
          size={24}
          color="black"
          onPress={navigation.goBack}
        />
        <Center>
          <Text _dark={{ color: "warmGray.50" }}
            fontSize={'xl'}
            color="coolGray.800" bold>
            New Chat
          </Text>
        </Center>


        <SearchView>
          <Search>
            <AntDesign
              style={{
                paddingRight: 10,
              }}
              name="search1"
              size={18}
              color="#838383"
            />
            <Input
              placeholder="Search"
              value={search}
              returnKeyType="search"
              onChangeText={onSearch}
              style={{ padding: 0 }}
            />
          </Search>
        </SearchView>
      </Box>

      <Box>

        <FlatList data={userSearched}
          renderItem={
            ({ item }) => <Box px="5" py="3" onTouchEnd={() => { navigation.navigate('ChatBox') }}>
              <HStack space={3} justifyContent="flex-start">
                <Avatar size="48px" source={{
                  uri: getAvatarUrl(item.id)
                }} />
                <VStack>
                  <Text _dark={{
                    color: "warmGray.50"
                  }} color="coolGray.800" bold>
                    {item.user_name}
                  </Text>
                  <Text color="coolGray.600" _dark={{
                    color: "warmGray.200"
                  }}>
                    {getFullName(item)}
                  </Text>
                </VStack>
              </HStack>
            </Box>}
          keyExtractor={item => item.id} />
      </Box>

    </Container >
  );
}

export { NewChatScreen }
