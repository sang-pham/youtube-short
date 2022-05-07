import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {Modal} from 'native-base';

const {width, height} = Dimensions.get('window');

export default function ImageFullScreen({imageUrl}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    console.log('open open');
    setOpen(true);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={handleOpen}>
        <Image
          style={{
            width: 100,
            height: 100,
            borderRadius: 10,
          }}
          source={{
            uri: imageUrl,
          }}
        />
      </TouchableWithoutFeedback>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <Modal.Content
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            position: 'relative',
          }}>
          <Modal.CloseButton
            style={{
              color: 'white',
              zIndex: 1000,
            }}
          />
          {/* <Modal.Header></Modal.Header> */}
          <Image
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 10,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            source={{
              uri: imageUrl,
            }}
          />
        </Modal.Content>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});
