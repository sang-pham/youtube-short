import React, {useEffect, useMemo, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {Avatar, Box, FlatList, HStack, VStack, Spacer, Text} from 'native-base';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getAllChatBox, readMessage} from '../../redux/reducers';
import {getAvatarUrl, formatMessageTime} from '../../libs';
import {TouchableWithoutFeedback} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {BackButton, HeaderCustom, Container, Badge} from '../../components';

const DirectMessage = ({navigation}) => {
  const dispatch = useDispatch();
  const chatBoxList = useSelector(state => state.inbox.chatBoxList);

  useEffect(() => {
    dispatch(getAllChatBox({}));
  }, []);

  const parseRecentMessage = (personId, userId, content) => {
    let str = '';
    if (personId !== userId) str = 'You: ';
    if (!content) {
      str += 'This is a image';
      return str;
    }

    str += content;
    return str;
  };

  const randStatusColor = id => {
    const colors = ['green', 'orange', '#b5b5b5', 'transparent'];
    let idx = Math.floor(Math.random() * colors.length);
    return colors[idx];
  };

  return (
    <Container>
      <HeaderCustom
        title="Direct messages"
        // leftElement={<BackButton pathRoute={'Inbox'} />}
        rightElement={
          <Feather
            name="plus"
            size={24}
            color="black"
            onPress={() => {
              navigation.push('NewChat');
            }}
          />
        }
      />

      <Box>
        <FlatList
          data={chatBoxList}
          renderItem={({item}) => (
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate('ChatBox', {
                  personId: item.person_id,
                  chatBoxId: item.id,
                });
              }}>
              <Box pl="4" pr="5" py="2">
                <HStack
                  space={3}
                  justifyContent="space-between"
                  alignItems={'center'}>
                  <Badge
                    title={' '}
                    direction="bottom-right"
                    color={`${randStatusColor(item.id)}`}
                    size={10}
                    style={{right: 0, bottom: 0}}>
                    <Avatar
                      size="md"
                      source={{
                        uri: getAvatarUrl(item.person_id),
                      }}
                    />
                  </Badge>
                  <VStack>
                    <Text
                      _dark={{
                        color: 'warmGray.50',
                      }}
                      color="coolGray.800"
                      bold>
                      {item.full_name}
                    </Text>
                    <Text
                      bold={!item.is_seen}
                      color={item.is_seen ? 'coolGray.600' : 'warmGray.800'}
                      _dark={{
                        color: 'warmGray.200',
                      }}
                      w="200"
                      numberOfLines={1}>
                      {parseRecentMessage(
                        item.person_id,
                        item.message.user_id,
                        item.message?.text,
                      )}
                    </Text>
                  </VStack>
                  <Spacer />
                  {!item.is_seen && <View style={styles.hightlight}></View>}
                  <Text
                    fontSize="xs"
                    _dark={{
                      color: 'warmGray.50',
                    }}
                    color="coolGray.800"
                    alignSelf="flex-start">
                    {formatMessageTime(item.message?.createdAt)}
                  </Text>
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

const styles = StyleSheet.create({
  hightlight: {
    backgroundColor: '#0095f6',
    width: 8,
    height: 8,
    borderRadius: 5,
  },
});

export {DirectMessage};
