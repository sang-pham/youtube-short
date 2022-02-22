import React, {useState, useRef} from 'react';
import {Text, View, FlatList, Dimensions} from 'react-native';
import VideoPost from '../../components/VideoPost';

const samplePosts = [
  {
    id: 1,
    uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  {
    id: 2,
    uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 3,
    uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
];

const HomeFollowing = () => {
  const [currentShowId, setShowId] = useState(1);

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
        data={samplePosts}
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
