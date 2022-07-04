import { Box } from '@chakra-ui/react';

function ColorBox(props) {
  return (
    <Box
      w={5}
      h={5}
      border="1px"
      borderColor="gray.300"
      borderRadius="sm"
      bg={props.currentColor}
    />
  );
}

export default ColorBox;
