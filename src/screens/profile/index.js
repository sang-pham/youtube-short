import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {ScrollView, View, Text, Image} from 'react-native';
import {Button, Box, Center, Avatar, Pressable, Menu} from 'native-base';
import {baseURL} from '../../libs/config';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {logout} from '../../redux/reducers/user';
import {axiosAuth} from '../../libs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({navigation, route}) => {
  const userReducer = useSelector(state => state.user);
  const [friends, setFriends] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [userName, setUserName] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userReducer.authenticated) {
      navigation.navigate('Home');
    }
  }, [userReducer.authenticated]);

  useEffect(() => {
    (async () => {
      try {
        let res = await axiosAuth.get(
          `/relationship/${route.params.userId}/friends`,
        );
        setFriends(res.data.friends.map(friend => friend.own));
        res = await axiosAuth.get(
          `/relationship/${route.params.userId}/followers`,
        );
        setFollowers(res.data.followers.map(follower => follower.own));
        res = await axiosAuth.get(
          `/relationship/${route.params.userId}/followings`,
        );
        setFollowings(res.data.followings.map(following => following.receive));
        res = await axiosAuth.get(`/user/${route.params.userId}`);
        setUserName(res.data.user.user_name);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [route.params.userId]);

  const handleEdit = () => {
    navigation.navigate('ProfileEdit');
  };

  const handleLogout = () => {
    dispatch(logout({}));
  };

  const navigateToFriend = () => {
    navigation.navigate('ProfileRelationship', {
      userId: route.params.userId,
      userName,
      defaultTab: 'ProfileFriend',
    });
  };

  const navigateToFollowing = () => {
    navigation.navigate('ProfileRelationship', {
      userId: route.params.userId,
      userName,
      defaultTab: 'ProfileFollowing',
    });
  };

  const navigateToFollower = () => {
    navigation.navigate('ProfileRelationship', {
      userId: route.params.userId,
      userName,
      defaultTab: 'ProfileFollower',
    });
  };

  return (
    <ScrollView>
      <Center
        style={{
          marginTop: '5%',
        }}>
        <Box
          w="95%"
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
          {userReducer.user.id === route.params.userId && (
            <Menu
              trigger={triggerProps => {
                return (
                  <Pressable
                    accessibilityLabel="More options menu"
                    {...triggerProps}>
                    <AntDesign name="ellipsis1" size={24} />
                  </Pressable>
                );
              }}>
              <Menu.Item onPress={handleLogout}>Logout</Menu.Item>
            </Menu>
          )}
        </Box>
        <Avatar
          size={'xl'}
          source={{
            uri: `${baseURL}/user/${route.params.userId}/avatar?${Date.now()}`,
          }}
        />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            margin: '3%',
          }}>
          {userName}
        </Text>
        {userReducer.user.id == route.params.userId && (
          <Button
            onPress={handleEdit}
            leftIcon={
              <FontAwesomeIcon
                name="edit"
                style={{
                  color: '#FFF',
                }}
                size={24}
              />
            }>
            Edit
          </Button>
        )}
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            marginTop: '3%',
          }}>
          <View style={{flex: 1}}>
            <Text
              onPress={navigateToFriend}
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
              }}>
              {friends.length} {friends.length >= 2 ? 'friends' : 'friend'}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text
              onPress={navigateToFollowing}
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
              }}>
              {followings.length}{' '}
              {followings.length >= 2 ? 'followings' : 'following'}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text
              onPress={navigateToFollower}
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
              }}>
              {followers.length}{' '}
              {followers.length >= 2 ? 'followers' : 'follower'}
            </Text>
          </View>
        </View>
      </Center>
    </ScrollView>
  );
};

export {ProfileScreen};
