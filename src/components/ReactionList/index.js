import React, {useMemo} from 'react';
import {
  View,
  Animated,
  Text,
  useWindowDimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import {Avatar} from 'native-base';
import {TabView, SceneMap} from 'react-native-tab-view';
import {baseURL} from '../../libs';

const UserItem = ({user}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: '3%',
        paddingBottom: '3%',
        width: '90%',
        marginLeft: '5%',
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
      }}>
      <Avatar
        size="sm"
        source={{
          uri: `${baseURL}/user/${user.id}/avatar`,
        }}
      />
      <Text
        style={{
          marginLeft: '2%',
        }}>
        {user.user_name}
      </Text>
    </View>
  );
};

const AllReactions = ({reactions}) => {
  return (
    <FlatList
      style={{
        marginTop: '2%',
        overflow: 'scroll',
      }}
      data={reactions}
      renderItem={({item}) => <UserItem user={item.user} />}
    />
  );
};

const LikeReactions = ({reactions}) => {
  return (
    <FlatList
      style={{
        marginTop: '2%',
        overflow: 'scroll',
      }}
      data={reactions}
      renderItem={({item}) => <UserItem user={item.user} />}
    />
  );
};

const MyTabBar = props => {
  const inputRange = props.navigationState.routes.map((x, i) => i);

  return (
    <View style={styles.tabBar}>
      {props.navigationState.routes.map((route, i) => {
        const opacity = props.position.interpolate({
          inputRange,
          outputRange: inputRange.map(inputIndex =>
            inputIndex === i ? 1 : 0.5,
          ),
        });

        return (
          <TouchableWithoutFeedback
            key={i}
            style={styles.tabItem}
            onPress={() => props.changeIndex(i)}>
            <Animated.Text
              style={{
                opacity,
                borderBottomWidth: 2,
                borderColor: i == props.index ? 'blue' : 'transparent',
                width: '20%',
                textAlign: 'center',
                paddingBottom: 5,
              }}>
              {route.title}
            </Animated.Text>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};

export default function ReactionList({reactions}) {
  const layout = useWindowDimensions();

  const renderScene = useMemo(() => {
    return SceneMap({
      all: () => <AllReactions reactions={reactions} />,
      like: () => (
        <LikeReactions
          reactions={reactions.filter(reaction => reaction.type == 'like')}
        />
      ),
    });
  }, []);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'all', title: 'All'},
    {key: 'like', title: 'Like'},
  ]);

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={props => (
        <MyTabBar {...props} changeIndex={setIndex} index={index} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
});
