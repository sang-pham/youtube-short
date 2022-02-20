import { Box, Text, Heading } from 'native-base'
import React from 'react'

const ChatBox = ({ navigation }) => {
  return (
    <Box>
      <Heading onPress={() => { navigation.navigate('DirectMessage') }}>
        Back
      </Heading>
      <Text>ChatBox</Text>
    </Box>
  )
}

export { ChatBox }

