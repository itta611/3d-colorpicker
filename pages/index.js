import { Container, Box, FormControl, FormLabel, Heading, Button } from '@chakra-ui/react';
import ColorPicker3d from '../components/ColorPicker3d';

function Index() {
  return (
    <Container minW="container.md" pt={10}>
      <Heading as="h2" mb={5}>
        Profile Settings
      </Heading>
      <FormControl>
        <FormLabel htmlFor="profile-color">Profile Color</FormLabel>
        <ColorPicker3d defaultColor={'#000'} id="profile-color" />
      </FormControl>
      <Box mt={5} display="flex" flexDir="row-reverse">
        <Button colorScheme="teal">Save</Button>
      </Box>
    </Container>
  );
}

export default Index;
