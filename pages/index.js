import { Container, Box, FormControl, FormLabel, Heading, Button, Link } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import ColorPicker3d from '../components/ColorPicker3d';

function Index() {
  const [defaultColor, setDefaultColor] = useState(null);
  useEffect(() => {
    setDefaultColor(
      '#' +
        (
          '000000' +
          Math.floor(
            Math.floor(Math.random() * 5) * (0xff / 5) * 0x10000 +
              Math.floor(Math.random() * 5) * (0xff / 5) * 0x100 +
              Math.floor(Math.random() * 5) * (0xff / 5)
          ).toString(16)
        ).slice(-6)
    );
  }, []);
  return (
    <Container minW="container.md" pt={10}>
      <Heading as="h2" mb={5}>
        Profile Settings
      </Heading>
      <FormControl>
        <FormLabel htmlFor="profile-color">Profile Color</FormLabel>
        {defaultColor ? <ColorPicker3d defaultColor={defaultColor} id="profile-color" /> : null}
      </FormControl>
      <Box mt={5} display="flex" flexDir="row-reverse">
        <Button colorScheme="teal">Save</Button>
      </Box>
      <Box mt={'16'} textAlign="center">
        <Link href="https://github.com/itta611/3d-colorpicker" fontFamily="mono">
          View source on GitHub
        </Link>
      </Box>
    </Container>
  );
}

export default Index;
