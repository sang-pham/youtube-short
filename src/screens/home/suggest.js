import React, {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import {Text, View, FlatList, Dimensions, VirtualizedList} from 'react-native';
import VideoPost from '../../components/VideoPost';
import Loading from '../../components/Loading';
import {useNavigation} from '@react-navigation/native';
import {axiosAuth, baseURL, socketClient} from '../../libs';

const HomeSuggest = () => {
  const [videoPosts, setVideoPosts] = useState([]);
  const [initLoad, setInitLoad] = useState(false);
  const currentShowId = useRef(null);
  const PER_PAGE = useMemo(() => {
    return 10;
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState(false);

  const renderItem = useCallback(
    ({item}) => <VideoPost post={item} currentShowId={currentShowId.current} />,
    [],
  );

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        let res = await axiosAuth.get(
          `video-post/suggest?per_page=${PER_PAGE}&page=${currentPage}`,
        );
        if (res.status === 200) {
          let _videoPosts = res.data.videoPosts;
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
    setLoading(true);
    let res = await axiosAuth.get(
      `video-post/suggest?per_page=${PER_PAGE}&page=${currentPage + 1}`,
    );
    if (res.status == 200) {
      setVideoPosts([...videoPosts, ...res.data.videoPosts]);
      setCurrentPage(currentPage + 1);
    }
    setLoading(false);
  };

  return (
    <View>
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
    </View>
  );
};

export default HomeSuggest;
