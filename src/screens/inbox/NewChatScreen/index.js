import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import { Container, Title, Header, Input, Search, SearchView } from './styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
const NewChatScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  return (
    <Container>
      <Header>
        <Text style={{ position: 'absolute', left: 10, top: 10 }}
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
            onChangeText={text => setSearch(text)}
          />
        </Search>
      </SearchView>

    </Container>
  );
}

export { NewChatScreen }
