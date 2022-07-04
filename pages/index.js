import { Container, FormControl } from '@chakra-ui/react';
import ColorPicker3d from '../components/ColorPicker3d';

function Index() {
  return (
    <Container minW="container.md" pt={5}>
      <FormControl>
        <ColorPicker3d defaultColor={'#000'} />
      </FormControl>
    </Container>
  );
}

export default Index;
