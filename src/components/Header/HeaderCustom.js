import React from 'react'
import { Center, Box, Text } from 'native-base'
import { BackButton } from '../button'
import { StyleSheet } from 'react-native'

export function HeaderCustom({ title, leftElement = null, rightElement = null, bottomElement = null }) {

  return (
    <Box borderBottomWidth="1"
      borderColor="coolGray.200" py={4} px={3} mb={2}>
      <Box>

        <LeftElement leftElement={leftElement} />

        <TitleElement title={title} />

        <RightElement rightElement={rightElement} />

      </Box>

      {bottomElement}
    </Box>
  )
}

const TitleElement = ({ title }) => (
  <Center>
    <Text _dark={{ color: "warmGray.50" }}
      fontSize={'xl'}
      color="coolGray.800" bold>
      {title}
    </Text>
  </Center>
)

const RightElement = ({ rightElement }) => (
  <Box style={[styles.posElement, { right: 10 }]}>
    {rightElement}
  </Box>
)


const LeftElement = ({ leftElement }) => (
  <Box
    style={[styles.posElement, { left: 10 }]}>
    {leftElement}
  </Box>
)

const styles = StyleSheet.create({
  posElement: {
    position: 'absolute',
    top: 5,
  }
})