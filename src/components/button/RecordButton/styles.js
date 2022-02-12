import styled from 'styled-components/native';


export const Container = styled.View`
  top: 3px;
  width: 45px;
  height: 30px;
  justify-content: center;
  border-radius: 10px;
  align-items: center;
  background: ${(props) => (props.home ? '#fff' : '#000')};
  border-left-width: 3px;
  border-left-color: #20d5ea;
  border-right-width: 3px;
  border-right-color: #ec376d;
`;

// export const Container = styled.View`
//   top: -3px;
//   width: 45px;
//   height: 45px;
//   justify-content: center;
//   border-radius: 30px;
//   align-items: center;
//   background: ${(props) => (props.home ? 'red' : '#000')};
// `;

export const Button = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})``;