import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {Input, View, Center} from 'native-base';
import UserFeed from '../../components/UserFeed';
import ProfileNavbar from './navbar';
import {axiosAuth} from '../../libs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const ProfileFollowingsScreen = ({navigation, route}) => {
  const {userId, userName} = route.params;
  const [followings, setFollowings] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getFollowings();
  }, [userId]);

  const getFollowings = async () => {
    try {
      let res = await axiosAuth.get(`/relationship/${userId}/followings`);
      setFollowings(
        res.data.followings.map(following => ({
          relationshipId: following.id,
          ...following.receive,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView
      style={{
        marginTop: '5%',
      }}>
      <Center>
        <ProfileNavbar
          userId={userId}
          userName={userName}
          currentScreen="following"
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
              <UserFeed user={following} key={index} refresh={getFollowings} />
            ))}
        </View>
      </Center>
    </ScrollView>
  );
};

export {ProfileFollowingsScreen};
