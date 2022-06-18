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
    height: 70,
    width: 70,
    borderRadius: 40,
    bottom: 0,
    // backgroundColor: '#ff4343',
    borderColor:'#fff',
    borderWidth: 4
  },
  buttonStop: {
    alignSelf: 'center',
    position: 'absolute',
    marginVertical: 25,
    height: 40,
    width: 40,
    bottom: 0,
    borderRadius: 3,
    backgroundColor: '#ff4343',
  },
  pickButton: {
    // alignSelf: 'center',
    position: 'absolute',
    marginVertical: 25,
    height: 40,
    width: 40,
    bottom: 0,
    right: 40,
    borderRadius: 3,
    // backgroundColor: '#ff4343',
  },
  imageButton: {
    width: 60,
    height: 40,
    // position: 'absolute',
    // bottom: 0,
    // right: 10,
  }
});

export default styles;