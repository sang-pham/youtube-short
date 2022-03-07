import React from 'react'
import { View, Spinner } from 'native-base';

export default function ChatBoxLoading() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      <Spinner size='lg' color={'#000'} />
    </View>
  )
}
