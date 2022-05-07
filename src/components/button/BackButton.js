import * as React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export function BackButton() {
  const navigation = useNavigation();

  return (
    <MaterialIcons
      name="arrow-back"
      size={24}
      color="black"
      onPress={navigation.goBack}
    />
  );
}