import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  textInput: {
    margin: 10,
    backgroundColor: 'white',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonLeft: {
    margin: 30,
    height: 50,
  },
  buttonRight: {
    margin: 30,
    height: 50,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  player: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 2,
    padding: 10,
    elevation: 2,
    width: 250,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    // color: "white",
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '800',
  },
  input: {
    height: 100,
    width: 350,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  textInput: {
    height: 40,
    width: 350,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
    alignSelf: 'center',
  },
  tag: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginBottom: 25,
  },
  tagText: {
    color: '#3ca897',
  },
});

export default styles;
