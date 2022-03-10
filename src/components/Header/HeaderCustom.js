import React from 'react'
import {Center, Box, Text} from 'native-base'

export function HeaderCustom({title, leftElement, rightElement, bottomElement}) {
  const renderRightElement = () => {
    if (rightElement) {
      return <RightElement rightElement={rightElement} />
    }    

    return <RightElement />;
  }

  const renderLeftElement = () => {
    if (leftElement) {

      return <LeftElement leftElement={leftElement} />;
    }

    return <LeftElement />;
  }

  const renderTitle = () => {
    return <TitleElement title={title} />
  }

  const renderBottomElement = () => {
    return bottomElement;
  }

  return (
    <Box borderBottomWidth="1"
      borderColor="coolGray.200" py={4} px={3} mb={2}>
        <Box>
          
          {renderLeftElement()}

          {renderTitle()}

          {renderRightElement()}
     
        </Box>
        {renderBottomElement()}
    </Box>
  )
}

const TitleElement = ({title}) => (
  <Center>
    <Text _dark={{ color: "warmGray.50" }}
      fontSize={'xl'}
      color="coolGray.800" bold>
      {title}
    </Text>
  </Center>
)

const RightElement = ({rightElement}) => (
  <Box style={{ position: 'absolute', 
          top: 18, right: 10 }}>
    {rightElement}
  </Box>
)


const LeftElement = ({leftElement}) => (
  <Box
     style={{ position: 'absolute', top: 18, left: 10 }}>
       {leftElement}
       {!leftElement && <BackButton /> }
  </Box>
)