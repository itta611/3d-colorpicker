import { Container, Box, FormControl, FormLabel, Heading, Button } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import ColorPicker3d from '../components/ColorPicker3d';

function Index() {
  const [defaultColor, setDefaultColor] = useState(null);
  useEffect(() => {
    setDefaultColor(
      '#' +
        Math.floor(
          Math.floor(Math.random() * 6) * (0xff / 6) * 0x10000 +
            Math.floor(Math.random() * 6) * (0xff / 6) * 0x100 +
            Math.floor(Math.random() * 6) * (0xff / 6)
        ).toString(16)
    );
  }, []);
  return (
    <Container minW="container.md" pt={10}>
      <Heading as="h2" mb={5}>
        Profile Settings
      </Heading>
      <FormControl>
        <FormLabel htmlFor="profile-color">Profile Color</FormLabel>
        <ColorPicker3d defaultColor={defaultColor} id="profile-color" />
      </FormControl>
      <Box mt={5} display="flex" flexDir="row-reverse">
        <Button colorScheme="teal">Save</Button>
      </Box>
    </Container>
  );
}

export default Index;
