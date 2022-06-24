import React from "react"
import { StyleSheet, Text } from "react-native"
// import { useCameraDevices, Camera } from "react-native-vision-camera"

export function CameraScreen() {
  const devices = useCameraDevices()
  const device = devices.back

  console.log(devices);

  if (device == null) return <Text>Hello</Text>
  return (
    // <Camera
    //   style={StyleSheet.absoluteFill}
    //   device={device}
    // // isActive={true}
    // />
    <View></View>
  )
}