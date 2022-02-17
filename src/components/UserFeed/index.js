import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Text, View, TouchableWithoutFeedback} from 'react-native';
import {Avatar, Button} from 'native-base';
import {baseURL} from '../../libs';
import {useNavigation} from '@react-navigation/native';
import {unfollow} from '../../redux/reducers';
import FollowerMenu from './FollowerMenu';
import FollowingMenu from './FollowingMenu';

export default function UserFeed({user, refresh}) {
  const userReducer = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleUnfollow = () => {
    dispatch(
      unfollow({
        relationshipId: user.relationshipId,
        userId: user.id,
      }),
    );
  };

  const navigateProfile = userId => event => {
    navigation.navigate('Profile', {
      userId,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={navigateProfile(user.id)}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '3%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Avatar
            source={{
              uri: `${baseURL}/user/${user.id}/avatar`,
            }}
          />
          <Text
            style={{
              fontWeight: '500',
              marginLeft: '8%',
              fontSize: 16,
            }}>
            {user.user_name}
          </Text>
        </View>
        {userReducer.followers.find(follower => follower.id === user.id) && (
          <FollowerMenu user={user} />
        )}
        {userReducer.followings.find(following => following.id === user.id) && (
          <FollowingMenu user={user} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
