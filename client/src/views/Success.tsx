import { Alert, AlertIcon, AlertTitle, Box, Card, Container, Image, Link, Text } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { useLocation } from "react-router-dom";
import { API_URL } from "../App";
import axios from "axios";
import { useEffect, useState } from "react";

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

  const requestOrderConfirmation = async () => {
    try {
      const res = await axios.post(`${API_URL}/order/confirmorder/${orderId}`)
      setItems(res.data.transformedProducts)

      const subtotal = res.data.transformedProducts.reduce((acc: number, item: ItemType) => {
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
      <Container pb={10}>
          <Alert status="success" mt={10} mb={5}>
            <AlertIcon />
            <AlertTitle>Order Placed Successfully</AlertTitle>
          </Alert>
          {items.map((item, index) => (
              <>
                <Card key={index} variant='filled' direction='row' w='100%' h='120px' borderRadius='lg' my={3}>
                  <Image src={item.image} w='45%' h='100%' objectFit='cover' backgroundColor='white' border='1px solid #e2e8f0' borderTopLeftRadius='lg' borderBottomLeftRadius='lg' />
                  <Box p={2}>
                    <Text fontWeight='bold' as={Link} href={`/categories/${item.category}/${item._id}`}>{item.name}</Text>
                    <Text fontWeight='bold' color='gray.600'>&#8377;{item.price * item.quantity}</Text> 
                    <Text color='gray.600'>Quantity: {item.quantity}</Text> 
                  </Box>
                </Card>
              </>
            ))
          }
          <Text fontSize='3xl' fontWeight='semibold'>Subtotal: &#8377;{subtotal}</Text>
      </Container>
    </>
  )
}

export default Success