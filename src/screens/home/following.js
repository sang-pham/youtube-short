import React, {useState, useRef, useEffect} from 'react';
import {Text, View, FlatList, Dimensions, VirtualizedList} from 'react-native';
import VideoPost from '../../components/VideoPost';
import {axiosAuth, baseURL, socketClient} from '../../libs';

const HomeFollowing = () => {
  const [videoPosts, setVideoPosts] = useState([]);
  const currentShowId = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        let res = await axiosAuth.get('video-post/following');
        if (res.status === 200) {
          let _videoPosts = res.data.videoPosts;
          if (_videoPosts && _videoPosts.length) {
            setVideoPosts(_videoPosts);
          }
        }
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

  return (
    <View>
      <FlatList
        data={videoPosts}
        onViewableItemsChanged={onVideoScrollRef.current}
        viewabilityConfig={viewConfigRef.current}
        renderItem={({item}) => (
          <VideoPost post={item} currentShowId={currentShowId.current} />
        )}
        showsVerticalScrollIndicator={false}
        snapToInterval={Dimensions.get('window').height}
        snapToAlignment="start"
        decelerationRate={'fast'}
      />
    </View>
  );
};

export default HomeFollowing;
