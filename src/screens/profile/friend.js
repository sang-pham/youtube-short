import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {Input, View, Center} from 'native-base';
import UserFeed from '../../components/UserFeed';
import ProfileNavbar from './navbar';
import {axiosAuth} from '../../libs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const ProfileFriendsScreen = ({navigation, route}) => {
  const [friends, setFriends] = useState([]);
  const [searchText, setSearchText] = useState('');
  const {userId, userName} = route.params;

  useEffect(() => {
    getFriends();
  }, [userId]);

  const getFriends = async () => {
    try {
      let res = await axiosAuth.get(`/relationship/${userId}/friends`);
      setFriends(
        res.data.friends.map(friend => ({
          relationshipId: friend.id,
          ...friend.own,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      <Center
        style={{
          marginTop: '5%',
        }}>
        <ProfileNavbar
          userName={userName}
          userId={userId}
          currentScreen="friend"
          navigation={navigation}
        />
        <Input
          w={{
            base: '90%',
            md: '25%',
          }}
          value={searchText}
          onChangeText={value => setSearchText(value)}
          InputLeftElement={<FontAwesomeIcon name="search" />}
          placeholder="Search text"
        />
        <View w="90%">
          {friends
            .filter(friend => {
              return (
                friend.user_name
                  .toLowerCase()
                  .indexOf(searchText.toLowerCase()) >= 0
              );
            })
            .map((friend, index) => (
              <UserFeed user={friend} key={index} refresh={getFriends} />
            ))}
        </View>
      </Center>
    </ScrollView>
  );
};

export {ProfileFriendsScreen};
