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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Container, ButtonInCall} from '../../../components';
import GettingCall from './GettingCall';
import {axiosAuth, getAvatarUrl, socketClient} from '../../../libs';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar, Spinner} from 'native-base';

const configuration = {
  iceServers: [
    // {url: 'stun:stun.stunprotocol.org:3478'},
    {url: 'stun:stun.l.google.com:19302'},
    {
      url: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com',
    },
  ],
};

const getStream = async () => {
  try {
    let isFront = true;
    const sourceInfos = await mediaDevices.enumerateDevices();
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
  const sdp = route.params.sdp;
  const isCaller = !sdp;
  const chatBoxId = route.params.chatBoxId;
  const isVideoCall = route.params.isVideoCall;

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [gettingCall, setGettingCall] = useState(!isCaller);
  const [isMic, setIsMic] = useState(true);
  const [isCamera, setIsCamera] = useState(isVideoCall);
  const [isRemoteMic, setIsRemoteMic] = useState(true);
  const [isRemoteCamera, setIsRemoteCamera] = useState(isVideoCall);
  const [remoteInfo, setRemoteInfo] = useState();
  const pc = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const getRemoteInfo = async () => {
      try {
        const res = await axiosAuth.get(`/user/${receiverId}/info`);
        setRemoteInfo(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getRemoteInfo();
  }, [isCaller]);

  useEffect(() => {
    if (isCaller) {
      create();
    }

    socketClient.on('video-call-stop', ({senderId, receiverId, chatBoxId}) => {
      console.log('stop-call');
      // navigation.push('ChatBox');
      navigation.navigate('ChatBox', {
        personId: senderId,
        chatBoxId: chatBoxId,
      });
    });

    socketClient.on(
      'video-call-answer',
      async ({senderId, receiverId, answer}) => {
        try {
          if (pc.current && answer && !pc.current.remoteDescription) {
            const test = pc.current.setRemoteDescription(
              new RTCSessionDescription(answer),
            );
          }
        } catch (error) {
          console.log('remote error', error);
        }
      },
    );

    socketClient.on(
      'video-call-candidate',
      ({senderId, receiverId, candidate}) => {
        if (pc.current) {
          pc.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      },
    );

    socketClient.on('video-call-media-active', ({mic, camera}) => {
      setIsRemoteCamera(camera);
      setIsRemoteMic(mic);
    });

    return () => {
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
    console.log('aaaa', stream);
    setLocalStream(stream);
    pc.current.addStream(stream);

    pc.current.onaddstream = e => {
      if (e.stream && remoteStream !== e.stream) {
        console.log('RemotePC received the stream call', e.stream);
        setRemoteStream(e.stream);
      }
    };
  };

  const collectIceCandidates = () => {
    if (pc.current) {
      pc.current.onicecandidate = event => {
        if (event.candidate) {
          sendToPeer('video-call-candidate', event.candidate);
          // send event.candidate to peer
          //......
        }
      };
      pc.current.onicecandidateerror = error => {
        console.log('candidate error:', error);
      };
    }
  };

  const create = async () => {
    try {
      await setupWebrtc();

      collectIceCandidates();

      if (pc.current) {
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);

        socketClient.emit('video-call-start', {
          senderId,
          receiverId,
          chatBoxId,
          offer,
          isVideoCall,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log('xxx', localStream);

  const join = async () => {
    console.log('Joining the call');
    setGettingCall(false);
    const offer = sdp;
    if (offer) {
      try {
        await setupWebrtc();

        collectIceCandidates();

        if (pc.current && !pc.current.localDescription && offer) {
          const test = pc.current.setRemoteDescription(
            new RTCSessionDescription(offer),
          );
          const answer = await pc.current.createAnswer();
          await pc.current.setLocalDescription(answer);
          sendToPeer('video-call-answer', answer);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const hangup = () => {
    cleanUp();
    socketClient.emit('video-call-stop', {senderId, receiverId, chatBoxId});
    navigation.navigate('ChatBox', {
      personId: senderId,
      chatBoxId: chatBoxId,
    });
  };

  const mute = () => {
    setIsMic(!isMic);
    socketClient.emit('video-call-media-active', {
      receiverId,
      mic: !isMic,
      camera: isCamera,
    });
  };

  const hideCamera = () => {
    setIsCamera(!isCamera);
    socketClient.emit('video-call-media-active', {
      receiverId,
      camera: !isCamera,
      mic: isMic,
    });
  };

  const cleanUp = () => {
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
      localStream.release();
    }
    if (pc.current) {
      pc.current.close();
    }

    socketClient.off('video-call-stop');
    socketClient.off('video-call-offer');
    socketClient.off('video-call-answer');
    socketClient.off('video-call-candidate');
    socketClient.off('video-call-media-active');

    setGettingCall(false);
    setLocalStream(null);
    setRemoteStream(null);
  };

  if (gettingCall) {
    return (
      <GettingCall
        senderId={senderId}
        remoteInfo={remoteInfo}
        hangup={hangup}
        join={join}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.localVideo, styles.video]}>
        {!localStream || !isCamera ? (
          <View style={styles.center}>
            <Avatar
              size="50px"
              source={{
                uri: getAvatarUrl(senderId),
              }}
              style={{marginBottom: 15}}
            />
            <Text style={{color: '#fff'}}>You</Text>
          </View>
        ) : (
          <RTCView
            objectFit="cover"
            style={{
              with: '100%',
              height: '100%',
            }}
            streamURL={localStream && localStream.toURL()}
          />
        )}
      </View>
      <View style={[styles.video, styles.remoteVideo]}>
        {!remoteStream || !isRemoteCamera ? (
          <View style={styles.center}>
            {remoteInfo && (
              <>
                <Avatar
                  size="80px"
                  source={{
                    uri: getAvatarUrl(remoteInfo.id),
                  }}
                  style={{marginBottom: 15}}
                />
                <Text style={{color: '#fff', fontSize: 18}}>
                  {remoteInfo.full_name}
                </Text>
                {!remoteStream && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 15,
                    }}>
                    <Spinner size="sm" color="#fff" mr="2" />
                    <Text style={{color: '#fff'}}>Waiting to join ...</Text>
                  </View>
                )}
              </>
            )}
          </View>
        ) : (
          <RTCView
            objectFit="cover"
            style={{with: '100%', height: '100%'}}
            streamURL={remoteStream && remoteStream.toURL()}
          />
        )}
        <View style={styles.mediaStyle}>
          <MaterialIcons
            name={isRemoteMic ? 'mic' : 'mic-off'}
            size={20}
            color="#fff"
            style={{margin: 5}}
          />
          <MaterialIcons
            name={isRemoteCamera ? 'videocam' : 'videocam-off'}
            size={20}
            color="#fff"
            style={{margin: 5}}
          />
        </View>
      </View>
      <View style={styles.btnContainer}>
        <ButtonInCall
          iconName={isCamera ? 'videocam' : 'videocam-off'}
          backgroundColor="grey"
          onPress={hideCamera}
        />
        <ButtonInCall
          iconName={isMic ? 'mic' : 'mic-off'}
          backgroundColor="grey"
          onPress={mute}
        />
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
    backgroundColor: '#747474',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    backgroundColor: '#000',
    borderRadius: 10,
  },
  localVideo: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 150,
    height: 150,
  },
  remoteVideo: {
    top: 180,
    width: '95%',
    height: '55%',
  },
  center: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaStyle: {
    flexDirection: 'row',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  btnContainer: {
    flexDirection: 'row',
    bottom: 30,
    zIndex: 10,
  },
});
