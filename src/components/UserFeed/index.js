import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Text, View, TouchableWithoutFeedback} from 'react-native';
import {Avatar, Menu, Pressable} from 'native-base';
import {baseURL} from '../../libs';
import {useNavigation} from '@react-navigation/native';
import {unfollow, follow, block} from '../../redux/reducers';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

export default function UserFeed({
  user,
  onUnfollow,
  onBlockFollower,
  onBlockFollowing,
}) {
  const userReducer = useSelector(state => state.user);
  const [changeRelation, setChangeRelation] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleUnfollow = () => {
    setChangeRelation(true);
    dispatch(
      unfollow({
        relationshipId: user.relationshipId,
        userId: user.id,
      }),
    );
  };

  const handleFollow = event => {
    let {first_name, last_name, user_name, id} = user;
    dispatch(
      follow({
        first_name,
        last_name,
        user_name,
        userId: id,
      }),
    );
  };

  const handleBlock = event => {
    setChangeRelation(true);
    let {first_name, last_name, user_name, id} = user;
    dispatch(
      block({
        first_name,
        last_name,
        user_name,
        userId: id,
      }),
    );
  };

  useEffect(() => {
    if (changeRelation) {
      setChangeRelation(false);
      onBlockFollower &&
        onBlockFollower({
          relationshipId: user.relationshipId,
        });
      onBlockFollowing &&
        onBlockFollowing({
          relationshipId: user.relationshipId,
        });
    }
  }, [userReducer.blocks.length]);

  useEffect(() => {
    if (changeRelation) {
      setChangeRelation(false);
      onUnfollow && onUnfollow({relationshipId: user.relationshipId});
    }
  }, [userReducer.followings.length]);

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
            {user.user_name != userReducer.user.user_name
              ? user.user_name
              : 'You'}
          </Text>
        </View>
        {userReducer.followings.find(following => following.id === user.id) ? (
          <Menu
            w="190"
            trigger={triggerProps => {
              return (
                <Pressable
                  accessibilityLabel="More options menu"
                  {...triggerProps}>
                  <AntDesignIcon name="ellipsis1" size={20} />
                </Pressable>
              );
            }}>
            <Menu.Item onPress={handleUnfollow}>Unfollow</Menu.Item>
            <Menu.Item onPress={handleBlock}>Block</Menu.Item>
          </Menu>
        ) : (
          user.id !== userReducer.user.id && (
            <Menu
              w="190"
              trigger={triggerProps => {
                return (
                  <Pressable
                    accessibilityLabel="More options menu"
                    {...triggerProps}>
                    <AntDesignIcon name="ellipsis1" size={20} />
                  </Pressable>
                );
              }}>
              <Menu.Item onPress={handleFollow}>Follow</Menu.Item>
              <Menu.Item onPress={handleBlock}>Block</Menu.Item>
            </Menu>
          )
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
