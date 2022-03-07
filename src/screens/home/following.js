import React, {useState, useRef, useEffect} from 'react';
import {Text, View, FlatList, Dimensions} from 'react-native';
import VideoPost from '../../components/VideoPost';
import {axiosAuth, baseURL} from '../../libs';

const HomeFollowing = () => {
  const [currentShowId, setShowId] = useState(0);
  const [videoPosts, setVideoPosts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let res = await axiosAuth.get('video-post/following');
        if (res.status === 200) {
          let _videoPosts = res.data.videoPosts;
          if (_videoPosts && _videoPosts.length) {
            setVideoPosts(_videoPosts);
            setShowId(_videoPosts[0].id);
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
      setShowId(item.id);
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
          <VideoPost post={item} currentShowId={currentShowId} />
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
