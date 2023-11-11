import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import lightTheme from './themes/LightTheme/lightTheme.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ChakraProvider theme={lightTheme}>
    <App />
  </ChakraProvider>
)
