import React from 'react'
import { Center, Box, Text } from 'native-base'
import { BackButton } from '../button'

export function HeaderCustom({ title, leftElement = null, rightElement = null, bottomElement = null }) {
  const RenderRightElement = () => {
    if (rightElement) {
      return <RightElement rightElement={rightElement} />
    }

    return <RightElement />;
  }

  const RenderLeftElement = () => {
    if (leftElement) {

      return <LeftElement leftElement={leftElement} />;
    }

    return <LeftElement />;
  }

  const RenderTitle = () => {
    return <TitleElement title={title} />
  }

  const RenderBottomElement = () => {
    return bottomElement;
  }

  return (
    <Box borderBottomWidth="1"
      borderColor="coolGray.200" py={4} px={3} mb={2}>
      <Box>

        <RenderLeftElement />

        <RenderTitle />

        <RenderRightElement />

      </Box>
      <RenderBottomElement />
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
  <Box style={{
    position: 'absolute',
    top: 18, right: 10
  }}>
    {rightElement}
  </Box>
)


const LeftElement = ({ leftElement }) => (
  <Box
    style={{ position: 'absolute', top: 18, left: 10 }}>
    {leftElement}
    {!leftElement && <BackButton />}
  </Box>
)