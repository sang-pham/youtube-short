import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
} from 'react-native';
import {Button, Box, Center, Avatar, Pressable, Menu} from 'native-base';
import {baseURL} from '../../libs/config';
import {logout} from '../../redux/reducers/user';
import {axiosAuth} from '../../libs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loading from '../../components/Loading';
import 'react-native-get-random-values';
import Video from 'react-native-video';
import {v4} from 'uuid';

const VideoWrapper = ({source, style, handleNavigate}) => {
  return (
    <TouchableWithoutFeedback onPress={() => handleNavigate()}>
      <Video
        source={source}
        paused={false}
        controls={false}
        muted={true}
        repeat={true}
        resizeMode="cover"
        style={style}
      />
    </TouchableWithoutFeedback>
  );
};

const ProfileScreen = ({navigation, route}) => {
  const userReducer = useSelector(state => state.user);
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [userName, setUserName] = useState([]);
  const [reload, setReload] = useState(v4());
  const dispatch = useDispatch();

  const [initLoad, setInitLoad] = useState(false);
  const [videoPosts, setVideoPosts] = useState([]);
  const PER_PAGE = useMemo(() => {
    return 3;
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let res = await axiosAuth.get(
          `/relationship/${route.params.userId}/followers`,
        );
        setFollowers(res.data.followers.map(follower => follower.own));
        res = await axiosAuth.get(
          `/relationship/${route.params.userId}/followings`,
        );
        setFollowings(res.data.followings.map(following => following.receive));
        res = await axiosAuth.get(`/user/${route.params.userId}`);
        setUserName(res.data.user.user_name);
        res = await axiosAuth.get(
          `/video-post/user/${route.params.userId}?per_page=${PER_PAGE}&page=${currentPage}`,
        );
        if (res.status === 200) {
          let _videoPosts = res.data;
          if (_videoPosts) {
            setVideoPosts(_videoPosts);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setInitLoad(true);
      }
    })();
  }, [route.params.userId]);

  const handleEdit = () => {
    navigation.navigate('ProfileEdit');
  };

  const handleLogout = () => {
    dispatch(logout({}));
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

  const navigateUserVideoPosts = ({userId, videoPostId}) => {
    console.log(userId, videoPostId);
    navigation.navigate('ProfileVideoPost', {
      userId,
      videoPostId,
    });
  };

  return (
    <>
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
              <TouchableWithoutFeedback onPress={handleLogout}>
                <Text>Logout</Text>
              </TouchableWithoutFeedback>
            )}
          </Box>
          <Avatar
            size={'xl'}
            source={{
              uri: `${baseURL}/user/${route.params.userId}/avatar?${reload}`,
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
              onPress={() => {
                handleEdit();
              }}
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
        <Text
          style={{
            marginTop: '5%',
            paddingLeft: '5%',
            fontSize: 18,
            fontWeight: '600',
          }}>
          Recent post
        </Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            paddingLeft: '5%',
            paddingTop: '4%',
            marginTop: '2%',
            borderTopColor: '#ccc',
            borderTopWidth: 1,
          }}>
          {videoPosts?.slice(0, 3)?.map(videoPost => (
            <VideoWrapper
              key={videoPost.id}
              source={{
                uri: `${baseURL}/video-post/${videoPost.id}/video`,
              }}
              style={styles.videoThump}
              handleNavigate={() =>
                navigateUserVideoPosts({
                  userId: videoPost.user_id,
                  videoPostId: videoPost.id,
                })
              }
            />
          ))}
          {initLoad && videoPosts.length == 0 && (
            <Text
              style={{
                marginTop: '5%',
                textAlign: 'center',
                width: '100%',
                fontSize: 18,
                fontWeight: '600',
              }}>
              No post yet
            </Text>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  videoThump: {
    width: '30%',
    height: 150,
    marginRight: '3%',
    // backgroundColor: 'red',
    marginBottom: '3%',
  },
});

export {ProfileScreen};
