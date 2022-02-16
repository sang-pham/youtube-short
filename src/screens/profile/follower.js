import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {Input, View, Center} from 'native-base';
import UserFeed from '../../components/UserFeed';
import {axiosAuth} from '../../libs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const ProfileFollowersScreen = ({userId}) => {
  const [followers, setFollowers] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getFollowers();
  }, [userId]);

  const getFollowers = async () => {
    try {
      let res = await axiosAuth.get(`/relationship/${userId}/followers`);
      setFollowers(
        res.data.followers.map(follower => ({
          relationshipId: follower.id,
          ...follower.own,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView
      style={{
        marginTop: '2%',
      }}>
      <Center>
        <Input
          w={{
            base: '90%',
            md: '25%',
          }}
          value={searchText}
          onChangeText={value => setSearchText(value)}
          InputLeftElement={<FontAwesomeIcon name="search" />}
          placeholder="Search"
        />
        <View w={'95%'}>
          {followers
            .filter(follower => {
              return (
                follower.user_name
                  .toLowerCase()
                  .indexOf(searchText.toLowerCase()) >= 0
              );
            })
            .map((follower, index) => (
              <UserFeed user={follower} key={index} refresh={getFollowers} />
            ))}
        </View>
      </Center>
    </ScrollView>
  );
};

export {ProfileFollowersScreen};
