import { Box, Button, Divider, Flex, HStack, Heading, Spacer, Text, VStack } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { useLocation } from "react-router-dom";
import { API_URL } from "../App";
import axios from "axios";
import { useEffect, useState } from "react";
import AddressBox, { AddressBoxProps } from "../components/AddressBox";
import OrderCard from "../components/OrderCard";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { paymentMethods } from "./Checkout";

interface ItemType {
  quantity: number;
  price: number;
  image: string;
  name: string;
  _id: string;
  category: string;
}

const Success = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const orderId = searchParams.get('orderId');
  
  const [items, setItems] = useState<ItemType[]>([])
  const [subtotal, setSubtotal] = useState<number>(0)
  const [address, setAddress] = useState<AddressBoxProps | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('')

  const requestOrderConfirmation = async () => {
    try {
      const res = await axios.post(`${API_URL}/order/confirmorder/${orderId}`)

      setItems(res.data.orderObject.items)
      setAddress(res.data.orderObject.address)
      setPaymentMethod(res.data.orderObject.paymentMethod)

      const subtotal = res.data.orderObject.items.reduce((acc: number, item: ItemType) => {
        return acc + item.price * item.quantity
      }, 0)

      setSubtotal(subtotal)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    requestOrderConfirmation()
  }, [])

  return (
    <>
      <Navbar />
      <Box p={10}>
        <Heading mb={6} color='gray.700'>
          <Flex>
            <IoIosCheckmarkCircle style={{ marginRight: '12px', color: '#ed8936' }} size='52px' /> 
            Order placed Succesfully
          </Flex>
        </Heading>
        <Flex direction={{ sm: 'column', md: 'row' }}>
          <Box overflowY='scroll' w='100%' height='400px' mx={5} my={{ sm: 5, md: 0 }}>
            {items.map(item => (
              <OrderCard name={item.name} quantity={item.quantity} price={item.price} image={item.image} key={item._id} />
              ))
            }
          </Box>
          <VStack w='100%' alignItems='flex-start'>
            <AddressBox type={address?.type!} addressLine1={address?.addressLine1!} landmark={address?.landmark!} city={address?.city!} state={address?.state!} toSelect={false} _id={address?._id!} />
            <Box p={4} w='100%' my={2} boxShadow='base'>
              <Heading my={2} fontSize='2xl'>Payment Method:</Heading>
              <Divider borderColor='gray.200' />

              <Text>
                {paymentMethods
                  .filter(item => item.method === paymentMethod)
                  .map(item => (
                    <Flex mt={2} key={item.method}>
                      <span key={item.method} style={{ fontSize: '30px' }}>
                        {item.icon}
                      </span>
                      <Text mt={2} fontSize='18px'>{item.method}</Text>
                      <Spacer />
                      <Text fontSize='xl'>&#8377;{subtotal}</Text>
                    </Flex>
                  ))}
              </Text>
            </Box>
            <HStack w='100%' my={2}>
              <Button m={1} w='100%' variant='outline' colorScheme="orange" onClick={() => window.location.href = '/'}>Home</Button>
              <Button m={1} w='100%' variant='solid' colorScheme="orange" onClick={() => window.location.href = '/orders'}>Orders</Button>
            </HStack>
          </VStack>
        </Flex>
      </Box>
    </>
  )
}

export default Success