import { Box, Button, Flex, Stack, Heading, Image, Text, VStack, useBreakpointValue, HStack, SimpleGrid, Alert, AlertIcon, AlertTitle, Avatar, Divider, AlertDescription } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { AiFillStar, AiOutlineShoppingCart } from "react-icons/ai"
import { BsBoxArrowUpRight } from "react-icons/bs"
import { API_URL } from "../App"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"

type ProductProps = {
    name: string,
    price: number,
    description: string,
    stock: number,
    category: string,
    stars: number,
    image: string,
    reviews: [
        {
            username?: string,
            stars?: number,
            review?: string
        }
    ]
}

function Product () {

    const panelWidth = useBreakpointValue({ base: '100%', lg: '50%' })
    const boxPadding = useBreakpointValue({ base: 3, md: 0})
    const boxNegativeMargin = useBreakpointValue({ base: -7, md: 0 })

    const { id } = useParams()

    const [product, setProduct] = useState<ProductProps | null>(null)

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const fetchProduct = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${API_URL}/products/getProduct/${id}`)
            setProduct(res.data.transformedProduct)
        } catch (err: any) {
            setError(err.response.data.message);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProduct();
    }, [])

    return (
        <>
            <Navbar />
            {loading &&
                <Loading />
            }
            {error &&
                <ErrorComponent error={error} />
            }
            {product && !error &&
                <Flex direction={{ base: 'column', md: 'row' }} w="100%" minH="100vh" p={3}>
                <VStack w={panelWidth} m={3} justifyContent='center' alignItems='center' textAlign='center'>
                    <Image src={product?.image} w='full' h='60%' objectFit='cover' />
                    <Divider borderColor='gray.600' />
                    <Box w='100%' p={boxPadding}>
                        <Button ml={boxNegativeMargin} my={2} colorScheme="orange" w='full' borderRadius='none'>Buy Now <BsBoxArrowUpRight style={{ marginLeft: '8px' }} /></Button>
                        <Button ml={boxNegativeMargin} my={2} colorScheme="orange" w='full' variant='outline' borderRadius='none'>Add to Cart <AiOutlineShoppingCart size={22} style={{ marginLeft: '8px' }} /></Button>
                    </Box>
                </VStack>
                <VStack w={panelWidth} m={3} p={boxPadding} alignItems='flex-start'>
                    <Heading fontSize='5xl'>{product?.name}</Heading>
                    <Text color='gray.800' my={5} fontSize='md'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto adipisci, assumenda, doloribus optio fuga numquam cum culpa molestiae molestias alias incidunt impedit, et eaque veniam perferendis voluptatibus repellat eligendi est voluptate facere reprehenderit ex excepturi sint placeat. Necessitatibus, aspernatur. Similique sunt atque voluptate laudantium officia odit error. Vitae repellat est animi? Deserunt veniam similique quisquam!</Text>
                    <Stack direction={{ base: 'column', md: 'row' }}>
                        <HStack spacing='none'>
                            {Array.from({ length: product.stars }).map((_, index) => (
                                <AiFillStar key={index} size={24} />
                            ))}
                        </HStack>
                        <Text ml={{ base: 0, md: 2 }}>265 reviews | 80% Customer satisfaction</Text>
                    </Stack>
                    <Text fontSize='4xl' color='gray.900'>${product?.price}</Text>
                    <Alert mt={2} status={product.stock >= 5 ? 'info' : 'warning'} size='3xl'>
                            <AlertIcon />
                            <AlertTitle>{product.stock >= 5 ? 'In Stock' : 'Hurry!'}</AlertTitle>
                            {product.stock < 5 && <AlertDescription>Only {product.stock} left in stock.</AlertDescription>}
                    </Alert>
                    <Text fontSize='3xl' color='gray.700' my={3}>Reviews</Text>
                    <SimpleGrid spacing={3} columns={2}>
                        <VStack p={3} boxShadow='md' borderRadius='md' alignItems='flex-start'>
                            <HStack>
                                <Avatar size='sm' name="John Doe" />
                                <Text color='gray.600'>John Doe</Text>
                            </HStack>
                            <Text fontSize='small'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum hic sit quo doloremque quia maiores.</Text>
                        </VStack>
                        <VStack p={3} boxShadow='md' borderRadius='md' alignItems='flex-start'>
                            <Text color='gray.600'>John Doe</Text>
                            <Text fontSize='small'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum hic sit quo doloremque quia maiores.</Text>
                        </VStack>
                        <VStack p={3} boxShadow='md' borderRadius='md' alignItems='flex-start'>
                            <Text color='gray.600'>John Doe</Text>
                            <Text fontSize='small'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum hic sit quo doloremque quia maiores.</Text>
                        </VStack>
                        <VStack p={3} boxShadow='md' borderRadius='md' alignItems='flex-start'>
                            <Text color='gray.600'>John Doe</Text>
                            <Text fontSize='small'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum hic sit quo doloremque quia maiores.</Text>
                        </VStack>
                        <VStack p={3} boxShadow='md' borderRadius='md' alignItems='flex-start'>
                            <Text color='gray.600'>John Doe</Text>
                            <Text fontSize='small'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum hic sit quo doloremque quia maiores.</Text>
                        </VStack>
                    </SimpleGrid>
                </VStack>
            </Flex>
            }   
        </>
    )
}

export default Product