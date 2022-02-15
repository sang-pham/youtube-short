import { getStatusBarHeight } from 'react-native-status-bar-height';

import styled from 'styled-components/native';

export const Container = styled.View.attrs({
  paddingTop: getStatusBarHeight(),
})`
  flex: 1;
  background: #fff;
`;

export const Header = styled.View`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

export const SearchView = styled.View`
  margin: 15px;
  flex-direction: row;
  align-items: center;
`;

export const Search = styled.View`
  flex: 1;
  border-radius: 5px;
  align-items: center;
  padding: 10px 15px;
  background: #ececec;
  flex-direction: row;
`;
export const Input = styled.TextInput`
  flex: 1;
  font-size: 16px;
`;