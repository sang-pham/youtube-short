import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonRecord: {
    alignSelf: 'center',
    position: 'absolute',
    marginVertical: 10,
    height: 50,
    width: 50,
    borderRadius: 25,
    bottom: 0,
    backgroundColor: '#ff4343',
  },
  buttonStop: {
    alignSelf: 'center',
    position: 'absolute',
    marginVertical: 20,
    height: 30,
    width: 30,
    bottom: 0,
    borderRadius: 3,
    backgroundColor: '#ff4343',
  },
  pickButton: {
    // alignSelf: 'center',
    position: 'absolute',
    marginVertical: 10,
    // height: 50,
    // width: 50,
    bottom: 0,
    right: 40,
    borderRadius: 3,
    // backgroundColor: '#ff4343',
  },
  imageButton: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 0,
    right: 10,
  }
});

export default styles;