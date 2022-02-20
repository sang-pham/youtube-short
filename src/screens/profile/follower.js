import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native';
import {Input, View, Center} from 'native-base';
import UserFeed from '../../components/UserFeed';
import {axiosAuth} from '../../libs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const ProfileFollowersScreen = ({userId}) => {
  const [followers, setFollowers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const userReducer = useSelector(state => state.user);

  useEffect(() => {
    getFollowers();
  }, [userId]);

  const getFollowers = async () => {
    try {
      let res = await axiosAuth.get(`/relationship/${userId}/followers`);
      let followers = res.data.followers.filter(follower => {
        return !userReducer.blocks.find(block => block.id == follower.id);
      });
      setFollowers(followers);
    } catch (error) {
      console.log(error);
    }
  };

  const onBlockFollower = ({relationshipId}) => {
    let _followers = followers.filter(
      follower => follower.relationshipId != relationshipId,
    );
    setFollowers(_followers);
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
              <UserFeed
                user={follower}
                key={index}
                onBlockFollower={onBlockFollower}
              />
            ))}
        </View>
      </Center>
    </ScrollView>
  );
};

export {ProfileFollowersScreen};
