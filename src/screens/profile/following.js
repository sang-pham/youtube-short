import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native';
import {Input, View, Center} from 'native-base';
import UserFeed from '../../components/UserFeed';
import {axiosAuth} from '../../libs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const ProfileFollowingsScreen = ({userId}) => {
  const [followings, setFollowings] = useState([]);
  const [searchText, setSearchText] = useState('');
  const userReducer = useSelector(state => state.user);

  useEffect(() => {
    getFollowings();
  }, [userId]);

  const getFollowings = async () => {
    try {
      let res = await axiosAuth.get(`/relationship/${userId}/followings`);
      let followings = res.data.followings.filter(following => {
        return !userReducer.blocks.find(block => block.id == following.id);
      });
      setFollowings(followings);
    } catch (error) {
      console.log(error);
    }
  };

  const onUnfollow = ({relationshipId}) => {
    if (userId == userReducer.user.id) {
      let _followings = followings.filter(
        following => following.relationshipId != relationshipId,
      );
      setFollowings(_followings);
    }
  };

  const onBlockFollowing = ({relationshipId}) => {
    let _followings = followings.filter(
      following => following.relationshipId != relationshipId,
    );
    setFollowings(_followings);
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
          {followings
            .filter(following => {
              return (
                following.user_name
                  .toLowerCase()
                  .indexOf(searchText.toLowerCase()) >= 0
              );
            })
            .map((following, index) => (
              <UserFeed
                user={following}
                key={index}
                onUnfollow={onUnfollow}
                onBlockFollowing={onBlockFollowing}
              />
            ))}
        </View>
      </Center>
    </ScrollView>
  );
};

export {ProfileFollowingsScreen};
