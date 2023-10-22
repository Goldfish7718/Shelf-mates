import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    VStack,
    Card,
    Image,
    Text,
    Box,
    ButtonGroup,
  } from '@chakra-ui/react'
import { useCart } from '../context/CartContext'
import { useEffect } from 'react'
import { AiFillDelete } from 'react-icons/ai'

function Cart() {

    const { isOpen, onClose, btnRef, cartItems, addToCart, decrement, deleteProduct } = useCart()

    useEffect(() => {
      console.log(cartItems);
    }, [])

    return (
      <>
        <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={onClose}
          finalFocusRef={btnRef}
          size='sm'
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Shopping Cart</DrawerHeader>
            <DrawerBody>
              <VStack h='70%' overflowY='scroll' p={1}>
                {cartItems.map((item, index) => (
                      <Card key={index} variant='filled' direction='row' w='100%' h='120px' borderRadius='lg'>
                      <Image src={item.image} w='45%' h='100%' objectFit='cover' backgroundColor='white' border='1px solid #e2e8f0' borderTopLeftRadius='lg' borderBottomLeftRadius='lg' />
                      <Box p={2}>
                        <Text fontWeight='bold'>{item.name}</Text>
                        <Text fontWeight='bold' color='gray.600'>${item.price}</Text> 
                        <ButtonGroup backgroundColor='white' mt={3} isAttached variant='outline' borderRadius='lg'>
                          <Button onClick={() => decrement(item.productId)}>-</Button>
                          <Button disabled>{item.quantity}</Button>
                          <Button onClick={() => addToCart(item.productId)}>+</Button>
                          <Button variant='solid' onClick={() => deleteProduct(item.productId)} colorScheme='red'><AiFillDelete /></Button>
                        </ButtonGroup>
                      </Box>
                    </Card>
                  ))
                }
              </VStack>
            </DrawerBody>
  
            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='blue'>Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
}

export default Cart