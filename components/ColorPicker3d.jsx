import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
  Box,
} from '@chakra-ui/react';
import ColorBox from './ColorBox';
import { useState, useRef } from 'react';

function ColorPicker3d() {
  const [currentColor, setCurrentColor] = useState('teal.400');
  const ref = useRef();
  return (
    <Popover>
      <PopoverTrigger>
        <Button leftIcon={<ColorBox currentColor={currentColor} />}>Select Color</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <Box ref={ref} h="xs"></Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default ColorPicker3d;
