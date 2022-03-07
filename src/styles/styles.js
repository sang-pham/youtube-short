import { StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import styled from 'styled-components/native';

export const globalStyle = StyleSheet.create({
  baseBlueColor: {
    color: '#1962a7',
  },
  errorColor: {
    color: 'red',
    textAlign: 'left',
  },
});


export const Container = styled.View.attrs({
  // paddingTop: getStatusBarHeight(),
})`
  flex: 1;
  background: #fff;
`;
