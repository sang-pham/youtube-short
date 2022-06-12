import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  ScrollView,
  Pressable,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {View, Text} from 'native-base';
import Video from 'react-native-video';
import {axiosAuth, baseURL} from '../../libs';

const DiscoveryScreen = ({navigation}) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let res = await axiosAuth.get('/video-post/get-by-tag');
        if (res.status == 200) {
          setTags(
            res.data.tags.sort((tag1, tag2) => {
              if (tag1.videoPosts.length > tag2.videoPosts.length) {
                return -1;
              } else if (tag1.videoPosts.length == tag2.videoPosts.length) {
                return 0;
              }
              return 1;
            }),
          );
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          width: '100%',
          marginTop: '2%',
          marginBottom: '2%',
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}>
        <Feather
          name="search"
          size={24}
          color="black"
          onPress={() => {
            navigation.push('DiscoverySearchUser');
          }}
        />
      </View>
      <ImageBackground
        resizeMode="cover"
        style={styles.mainImage}
        source={require('../../public/images/discovery.png')}>
        <Text style={styles.mainText}>Explore to find more interstings</Text>
      </ImageBackground>
      <View
        style={{
          marginTop: 10,
        }}>
        <Text style={styles.header}>Top 10 Popular Tags for Video</Text>
        <Text>Press each tag for watching video in correspond tag</Text>
        {tags.slice(0, 10).map(tag => (
          <View
            key={tag.id}
            style={{
              marginTop: '2%',
            }}>
            <TouchableWithoutFeedback>
              <Text style={styles.tagHeader}>
                {tag.name}
                <AntDesign
                  name="right"
                  size={20}
                  style={{
                    marginLeft: '3%',
                  }}
                />
              </Text>
            </TouchableWithoutFeedback>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
              }}>
              {tag.videoPosts.slice(0, 3).map(videoPost => (
                <Video
                  key={videoPost.id}
                  source={{
                    uri: `${baseURL}/video-post/${videoPost.id}/video`,
                  }}
                  paused={false}
                  controls={false}
                  muted={true}
                  repeat={true}
                  resizeMode="cover"
                  style={styles.videoThump}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: '3%',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  mainImage: {
    flex: 1,
    justifyContent: 'flex-end',
    height: 400,
  },
  mainText: {
    paddingLeft: '5%',
    color: 'white',
    // marginTop: 300,
    fontSize: 30,
    lineHeight: 40,
    fontWeight: 'bold',
  },
  header: {
    lineHeight: 30,
    fontSize: 25,
    fontWeight: '500',
  },
  tagHeader: {
    textTransform: 'capitalize',
    fontSize: 26,
    lineHeight: 30,
  },
  videoThump: {
    width: '30%',
    height: 150,
    marginRight: '3%',
  },
});

export {DiscoveryScreen};
