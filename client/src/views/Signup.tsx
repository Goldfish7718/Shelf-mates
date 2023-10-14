import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { API_URL } from '../App'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Signup() {

  const navigate = useNavigate()
  const toast = useToast()
  const { setIsLoggedIn } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)

  const [fName, setFName] = useState('')
  const [lName, setLName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const requestSignup = async () => {
    try {
        setIsLoading(true)
        await axios.post(`${API_URL}/auth/signup`, {
            username, 
            password,
            fName,
            lName
        })
        toast({
          title: `Welcome To Shelf-Mates! ${fName}`,
          description: "Account Created Succesfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setIsLoggedIn(true)
        navigate('/categories')
    } catch (err: any) {
      setError(err.response.data.message)
    } finally {
      setIsLoading(false)
    }
}

  return (
    <>
      <Navbar />
      <Flex
        h='100vh'
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input onChange={e => setFName(e.target.value)} type="text" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName" isRequired>
                    <FormLabel>Last Name</FormLabel>
                    <Input onChange={e => setLName(e.target.value)} type="text" />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input onChange={e => setUsername(e.target.value)} type="string" />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => setShowPassword(showPassword => !showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              {error && 
                <Alert status='error' variant="left-accent">
                  <AlertIcon />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              }
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  isLoading={isLoading}
                  colorScheme='orange'
                  onClick={requestSignup}>
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user? <Link color='orange' href='/login'>Login</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  )
}

export default Signup