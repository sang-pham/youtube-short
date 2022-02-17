import React from 'react';
import {useDispatch} from 'react-redux';
import {Menu, Pressable} from 'native-base';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {} from '../../redux/reducers';

export default function FollowerMenu({user}) {
  const dispatch = useDispatch();

  return (
    <Menu
      w="190"
      trigger={triggerProps => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <AntDesignIcon name="ellipsis1" size={20} />
          </Pressable>
        );
      }}>
      <Menu.Item>Block</Menu.Item>
    </Menu>
  );
}
