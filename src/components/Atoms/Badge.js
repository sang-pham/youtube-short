import { theme } from 'common/theme/config';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';


export function Badge({
  size = 20,
  color = 'red',
  direction = 'top-right',
  title,
  style,
  children,
  visible = true,
}) {


  const positionStyle = () => {
    switch (direction) {
      case 'top-right':
        return styles.topRight;
      case 'top-left':
        return styles.topLeft;
      case 'bottom-left':
        return styles.bottomRight;
      case 'bottom-right':
        return styles.bottomRight;
    }
  }

  const BadgeView = () => {
    if (!title) return null;

    return (
      <View
        style={[
          {
            minWidth: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            opacity: visible ? 1 : 0,
          },
          styles.container,
          positionStyle(),
          style,
        ]}>
        <Text style={[styles.text]}>{title}</Text>
      </View>
    )

  }

  return (
    <View>
      {children}
      <BadgeView />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  text: {
    color: '#fff'
  },
  topRight: {
    right: -10,
    top: -10,
  },
  topLeft: {
    left: -10,
    top: -10,
  },
  bottomLeft: {
    left: -10,
    top: -10,
  },
  bottomRight: {
    right: -10,
    bottom: -10,
  }
});
