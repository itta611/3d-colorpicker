import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
  Box,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  HStack,
} from '@chakra-ui/react';
import ColorBox from './ColorBox';
import ColorCubes from './ColorCubes';
import { useState, popoverOpenRef } from 'react';

function validateColor(hex) {
  // just check it is a hex color
  const regex = /^#[0-9a-f]*$/i;
  return regex.test(hex);
}

function ColorPicker3d({ defaultColor }) {
  const [currentColor, setCurrentColor] = useState(defaultColor);
  if (defaultColor && !currentColor) {
    setCurrentColor(defaultColor);
  }
  const [saturation, setSaturation] = useState(11);
  const handleChange = (e) => {
    let hex = e.target.value;
    if (hex?.[0] != '#') {
      hex += '#';
    }
    if (validateColor(hex)) {
      setCurrentColor(hex);
    }
  };

  return (
    <Popover isLazy>
      <PopoverTrigger>
        <Button leftIcon={<ColorBox currentColor={currentColor} />}>{currentColor}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <HStack my={10} mx={5}>
            <ColorCubes
              saturation={saturation}
              setCurrentColor={setCurrentColor}
              ref={popoverOpenRef}
            />
            <Slider
              area-label="saturation"
              orientation="vertical"
              defaultValue={0}
              min={1}
              max={16}
              value={saturation}
              minH={24}
              onChange={setSaturation}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </HStack>
          <Input value={currentColor} maxLength={7} onChange={handleChange} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default ColorPicker3d;
