import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';

import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Container, ButtonInCall} from '../../../components';
import GettingCall from './GettingCall';
import {socketClient} from '../../../libs';
import {useDispatch, useSelector} from 'react-redux';
import {stopCall} from '../../../redux/reducers';

const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};

const getStream = async () => {
  try {
    let isFront = true;
    const sourceInfos = await mediaDevices.enumerateDevices();
    console.log('sourceinfos', sourceInfos);
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if (
        sourceInfo.kind == 'videoinput' &&
        sourceInfo.facing == (isFront ? 'front' : 'environment')
      ) {
        videoSourceId = sourceInfo.deviceId;
      }
    }

    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 640,
        height: 480,
        frameRate: 30,
        facingMode: isFront ? 'user' : 'environment',
        deviceId: videoSourceId,
      },
    });

    return stream;
  } catch (error) {
    console.log(error);
  }
};

export function WebRTCCall({route, navigation}) {
  const senderId = route.params.senderId;
  const receiverId = route.params.receiverId;
  const chatBoxId = route.params.chatBoxId;
  const isCaller = route.params.isCaller;
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [gettingCall, setGettingCall] = useState(!isCaller);
  const pc = useRef();
  const sdp = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isCaller) {
      create();
    }

    socketClient.on('video-call-stop', ({senderId, receiverId, chatBoxId}) => {
      console.log('stop-call');
      navigation.replace('DirectMessage');
    });

    socketClient.on('video-call-offer', ({senderId, receiverId, sdp}) => {
      console.log('receive sdp', sdp);
      sdp.current = sdp;
    });

    socketClient.on('video-call-answer', ({senderId, receiverId, sdp}) => {
      console.log('receivesdp', sdp);
      sdp.current = sdp;
    });

    socketClient.on('candidate', ({senderId, receiverId, candidate}) => {
      if (pc.current) {
        pc.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log(candidate);
      }
    });

    return () => {
      // hangup();
      // socketClient.off('video-call-stop');
      // socketClient.off('video-call-offer');
      // socketClient.off('video-call-answer');
      // socketClient.off('candidate');
      cleanUp();
    };
  }, []);

  const sendToPeer = (messageType, payload) => {
    socketClient.emit(messageType, {
      senderId,
      receiverId,
      payload,
    });
  };

  const setupWebrtc = async () => {
    pc.current = new RTCPeerConnection(configuration);

    const stream = await getStream();
    setLocalStream(stream);

    pc.current.onaddstream = event => {
      setRemoteStream(event.stream);
      console.log('remotestream', event.stream);
    };
  };

  const collectIceCandidates = () => {
    if (pc.current) {
      pc.current.onicecandidate = event => {
        if (event.candidate) {
          console.log('candidate', event.candidate);
          sendToPeer('video-call-candidate', event.candidate);
          // send event.candidate to peer
          //......
        }
      };
    }
  };

  const create = async () => {
    await setupWebrtc();

    collectIceCandidates();

    if (pc.current) {
      const offer = await pc.current.createOffer();
      console.log('offer', offer);
      pc.current.setLocalDescription(offer);
      sendToPeer('video-call-offer', offer);
    }
  };

  const join = async () => {
    console.log('Joining the call');
    setGettingCall(false);
    const offer = sdp.current;
    console.log('receive', offer);
    if (offer) {
      await setupWebrtc();

      collectIceCandidates();

      if (pc.current) {
        pc.current.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await pc.current.createAnswer();
        pc.current.setLocalDescription(answer);

        sendToPeer('video-call-answer', answer);
      }
    }
  };

  const hangup = () => {
    cleanUp();
    dispatch(stopCall({senderId, receiverId, chatBoxId}));
    navigation.replace('DirectMessage');
  };

  const cleanUp = () => {
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
      localStream.release();
    }
    if (pc.current) {
      pc.current.close();
    }

    setGettingCall(false);
    setLocalStream(null);
    setRemoteStream(null);
  };

  if (gettingCall) {
    return <GettingCall hangup={hangup} join={join} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.localVideo}>
        <RTCView
          objectFit="contain"
          style={{
            with: '100%',
            height: '100%',
          }}
          streamURL={localStream && localStream.toURL()}
        />
      </View>
      <View style={styles.remoteVideo}>
        {!remoteStream ? (
          <Text>Calling...</Text>
        ) : (
          <RTCView
            objectFit="contain"
            style={{with: 640, height: 480}}
            streamURL={remoteStream && remoteStream.toURL()}
          />
        )}
      </View>
      <View style={styles.btnContainer}>
        <ButtonInCall iconName="videocam" backgroundColor="grey" />
        <ButtonInCall iconName="mic" backgroundColor="grey" />
        <ButtonInCall
          iconName="call-end"
          backgroundColor="red"
          onPress={hangup}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  localVideo: {
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    zIndex: 1,
  },
  remoteVideo: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  btnContainer: {
    flexDirection: 'row',
    bottom: 30,
    zIndex: 10,
  },
});
