import { ChakraProvider } from '@chakra-ui/react';
import theme from '../lib/theme';

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
