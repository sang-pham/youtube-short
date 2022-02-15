import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, Center} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function ProfileNavbar({
  userName,
  userId,
  currentScreen,
  navigation,
}) {
  const navigateFriend = () => {
    navigation.navigate('ProfileFriend', {
      userId: userId,
      userName,
    });
  };

  const navigateFollowing = () => {
    navigation.navigate('ProfileFollowing', {
      userId: userId,
      userName,
    });
  };

  const navigateFollower = () => {
    navigation.navigate('ProfileFollower', {
      userId: userId,
      userName,
    });
  };

  return (
    <>
      <View
        style={{
          width: '90%',
          flexDirection: 'row',
        }}>
        <AntDesign
          name="arrowleft"
          size={24}
          onPress={() =>
            navigation.navigate('Profile', {
              userId,
            })
          }
        />
        <Text
          style={{
            width: '90%',
            fontWeight: '600',
            textAlign: 'center',
            fontSize: 18,
          }}>
          {userName}
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
        }}>
        <View
          style={currentScreen === 'friend' ? styles.currentTab : styles.tab}>
          <Text
            onPress={navigateFriend}
            style={
              currentScreen === 'friend'
                ? styles.textCurrentTab
                : styles.textTab
            }>
            Friends
          </Text>
        </View>
        <View
          style={currentScreen === 'follower' ? styles.currentTab : styles.tab}>
          <Text
            onPress={navigateFollower}
            style={
              currentScreen === 'follower'
                ? styles.textCurrentTab
                : styles.textTab
            }>
            Followers
          </Text>
        </View>
        <View
          style={
            currentScreen === 'following' ? styles.currentTab : styles.tab
          }>
          <Text
            onPress={navigateFollowing}
            style={
              currentScreen === 'following'
                ? styles.textCurrentTab
                : styles.textTab
            }>
            Followings
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
  currentTab: {
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomWidth: 3,
    borderColor: 'red',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
  textCurrentTab: {
    fontSize: 16,
    color: 'red',
  },
  textTab: {
    fontSize: 16,
  },
});
