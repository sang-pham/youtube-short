import React, {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import {Text, View, FlatList, Dimensions, StyleSheet} from 'react-native';
import {Button} from 'native-base';
import VideoPost from '../../components/VideoPost';
import Loading from '../../components/Loading';
import {useNavigation} from '@react-navigation/native';
import {axiosAuth, baseURL, socketClient} from '../../libs';

const ProfileVideoPostScreen = ({route}) => {
  const [videoPosts, setVideoPosts] = useState([]);
  const [initLoad, setInitLoad] = useState(false);
  const currentShowId = useRef(null);
  const PER_PAGE = useMemo(() => {
    return 10;
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState(false);

  const navigation = useNavigation();
  const {userId, videoPostId} = route.params;

  const renderItem = useCallback(
    ({item}) => (
      <VideoPost
        post={item}
        currentShowId={currentShowId.current}
        back={() =>
          navigation.navigate('Tab_Profile', {
            userId,
          })
        }
        fullHeight={true}
      />
    ),
    [],
  );

  useEffect(() => {
    (async () => {
      try {
        let res = await axiosAuth.get(
          `video-post/user/${userId}?video_id=${videoPostId}per_page=${PER_PAGE}&page=${currentPage}`,
        );
        if (res.status === 200) {
          let _videoPosts = res.data;
          if (_videoPosts && _videoPosts.length) {
            setVideoPosts(_videoPosts);
          }
        }
        setInitLoad(true);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const onVideoScrollRef = useRef(({changed}) => {
    let item = changed[0].item;
    if (item) {
      if (currentShowId.current != item.id) {
        socketClient.emit('current-video-post', {
          video_post_id: item.id,
        });
        currentShowId.current = item.id;
      }
    }
  });

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 100,
  });

  const loadMore = async ({distanceFromEnd}) => {
    try {
      setLoading(true);
      let res = await axiosAuth.get(
        `video-post/user/${userId}?per_page=${PER_PAGE}&page=${
          currentPage + 1
        }`,
      );
      if (res.status == 200) {
        if (res.data.length) {
          setVideoPosts([...videoPosts, ...res.data]);
          setCurrentPage(currentPage + 1);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={
        !videoPosts.length
          ? {
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }
          : {
              height: '100%',
              backgroundColor: '#fff',
            }
      }>
      {initLoad &&
        (videoPosts.length ? (
          <FlatList
            data={videoPosts}
            onViewableItemsChanged={onVideoScrollRef.current}
            viewabilityConfig={viewConfigRef.current}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            snapToInterval={Dimensions.get('window').height}
            snapToAlignment="start"
            decelerationRate={'fast'}
            onEndReachedThreshold={0.5}
            onEndReached={loadMore}
            maxToRenderPerBatch={3}
            windowSize={5}
            removeClippedSubviews={true}
            ListFooterComponent={() => isLoading && <Loading />}
          />
        ) : (
          <>
            <Text
              style={{
                width: '80%',
                margin: 'auto',
                fontSize: 18,
                textAlign: 'center',
              }}>
              Start following others for watching more videos
            </Text>
            <Button
              onPress={() => navigation.navigate('Discover')}
              size="md"
              style={{
                marginTop: '5%',
              }}>
              DISCOVERY NOW
            </Button>
          </>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: 400,
    backgroundColor: 'red',
  },
});

export {ProfileVideoPostScreen};
