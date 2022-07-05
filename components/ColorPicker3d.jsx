import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
  Box,
  Input,
} from '@chakra-ui/react';
import ColorBox from './ColorBox';
import { useState, useRef, createRef, useEffect } from 'react';

function validateColor(hex) {
  // just check it is a hex color
  const regex = /^#[0-9a-f]*$/i;
  return regex.test(hex);
}

function ColorPicker3d() {
  const [currentColor, setCurrentColor] = useState('#38B2AC');
  const ref = useRef();
  const handleChange = (e) => {
    let hex = e.target.value;
    if (hex[0] === '#') {
      setCurrentColor(hex);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button leftIcon={<ColorBox currentColor={currentColor} />}>Select Color</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <Box ref={ref} h="xs"></Box>
          <Input value={currentColor} maxLength={7} onChange={handleChange} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default ColorPicker3d;
