import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { Container, Title, Header, Input, Search, SearchView } from './styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
import _ from 'lodash'
import { axiosAuth } from '../../../libs';

const NewChatScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [userSearched, setUserSearched] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchDebounce = useCallback(_.debounce(async (searchName) => {
    if (searchName !== '') {
      let response = await axiosAuth.get('/user/search', {
        text: searchName
      })
      console.log(response.data.users);
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
      <Header>
        <Text style={{ position: 'absolute', left: 15, top: 15 }}
          onPress={navigation.goBack}>
          Close
        </Text>
        <Title>
          New Chat
        </Title>
      </Header>
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

      <View>
        {userSearched.map((user) => (
          <View key={user.id}>
            <Text>{user.id}</Text>
            <Text>{user.user_name}</Text>
          </View>
        ))}
      </View>
    </Container>
  );
}

export { NewChatScreen }
