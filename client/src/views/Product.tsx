import { Box, Button, Flex, Stack, Heading, Image, Text, VStack, useBreakpointValue, HStack, SimpleGrid, Alert, AlertIcon, AlertTitle, Avatar, Divider, AlertDescription, Textarea, useToast } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { AiFillDelete, AiFillStar, AiOutlineShoppingCart } from "react-icons/ai"
import { BsBoxArrowUpRight } from "react-icons/bs"
import { API_URL } from "../App"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"

export type ProductProps = {
    _id: string;
    name: string,
    price: number,
    description: string,
    stock: number,
    category: string,
    stars: number,
    image: string,
    averageStars: number,
    reviews: [
        {
            fName?: string,
            lName?: string,
            stars?: number,
            review?: string
        }
    ]
}

type CartProductType = {
    quantity: number;
}

type StockStatusType = {
    status: "error" | "warning" | "info" | "loading" | "success" | undefined;
    title?: string;
    description?: string;
}

function Product () {

    const panelWidth = useBreakpointValue({ base: '100%', lg: '50%' })
    const boxPadding = useBreakpointValue({ base: 3, md: 0})
    const boxNegativeMargin = useBreakpointValue({ base: -7, md: 0 })
    const buttonWidth = useBreakpointValue({ base: 'full', md: 'auto' })
    const leftPanelMargin = useBreakpointValue({ base: 3, md: 8 })

    const { id } = useParams()
    const { decode } = useAuth()
    const toast = useToast()

    const [product, setProduct] = useState<ProductProps | null>(null)
    const [isPurchased, setIsPurchased] = useState(false)
    const [rating, setRating] = useState(1)
    const [review, setReview] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [cartProduct, setCartProduct] = useState<CartProductType | null>(null)
    const [reviewLoading, setReviewLoading] = useState(false)

    const [stockStatus, setStockStatus] = useState<StockStatusType | null>(null)

    const {
        cartItems,
        addToCart,
        decrement,
        deleteProduct,
        productExists
    } = useCart()

    const updateStockStatus = async () => {
        if (product?.stock != undefined) {
            if (product?.stock <= 5 && product?.stock > 0) {
                setStockStatus({
                    status: 'warning',
                    title: 'Hurry!',
                    description: `Only ${product?.stock} left in stock!`
                })
            } else if (product?.stock == 0) {
                setStockStatus({
                    status: 'error',
                    title: `Out of stock`
                })
            } else {
                setStockStatus({
                    status: 'info',
                    title: `In Stock`
                })
            }
        }
    }

    const fetchProduct = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${API_URL}/products/getProduct/${id}`)
            setProduct(res.data.transformedProduct)
            setIsPurchased(res.data.isPurchased)

            console.log(res.data.transformedProduct);
        } catch (err: any) {
            setError(err.response.data.message);
        } finally {
            setLoading(false)
        }
    }

    const requestAddReview = async () => {
        try {
            setReviewLoading(true)
            await axios.post(`${API_URL}/review/post/${decode?._id}/${product?._id}`, {
                review,
                stars: rating
            })

            toast({
                title: "Review posted",
                description: "Your review was succesfully posted",
                status: 'success',
                duration: 3000
            })

            clearReview()

            // setTimeout(() => {
            //     window.location.reload()
            // }, 3000);
            fetchProduct()
        } catch (err: any) {
            setError(err.response.data.message);
        } finally {
            setReviewLoading(false)
        }
    }

    const clearReview = () => {
        setReview('')
        setRating(1)
    }

    useEffect(() => {
        fetchProduct();
        updateStockStatus();
    }, [product?.stock])

    useEffect(() => {
        if (product) {
            const res = productExists(id!)
            setCartProduct(res.item)
        }
    }, [cartItems])

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
                    <VStack w={panelWidth} m={3} my={leftPanelMargin}  alignItems='center' textAlign='center'>
                        <Image src={product?.image} w='full' h='auto' objectFit='cover' />
                        <Divider borderColor='gray.600' />
                        <Box w='100%' p={boxPadding}>
                            <Button ml={boxNegativeMargin} my={2} colorScheme="orange" w='full' borderRadius='none'>Buy Now <BsBoxArrowUpRight style={{ marginLeft: '8px' }} /></Button>
                            {cartProduct == null ?
                            <Button ml={boxNegativeMargin} my={2} colorScheme="orange" w='full' variant='outline' borderRadius='none' onClick={() => addToCart(product._id)}>Add to Cart <AiOutlineShoppingCart size={22} style={{ marginLeft: '8px' }} /></Button>
                            :
                            <> 
                                <HStack w='100%'>
                                    <Button w='full' onClick={() => decrement(product._id)}>-</Button>
                                    <Text w='full' color='black'>{cartProduct?.quantity}</Text>
                                    <Button w='full' onClick={() => addToCart(product._id)}>+</Button>
                                </HStack>
                                <Button w='full' my={3} variant='solid' onClick={() => deleteProduct(product._id)} colorScheme='red'>Remove from Cart<AiFillDelete style={{ marginLeft: '8px' }} size={20} /></Button>
                            </>
                            }
                        </Box>
                    </VStack>
                    <VStack w={panelWidth} m={3} p={boxPadding} alignItems='flex-start'>
                        <Heading fontSize='5xl'>{product.name}</Heading>
                        <Text color='gray.800' my={5} fontSize='md'>{product.description}</Text>
                        <Stack direction={{ base: 'column', md: 'row' }}>
                            <HStack spacing='none'>
                                {Array.from({ length: product.averageStars }).map((_, index) => (
                                    <AiFillStar key={index} size={24} />
                                ))}
                            </HStack>
                            <Text ml={{ base: 0, md: 2 }}>{product.reviews.length} reviews | {product.averageStars > 0 ? product.averageStars : 0} star average rating</Text>
                        </Stack>
                        <Text fontSize='4xl' color='gray.900'>&#8377;{product?.price}</Text>
                        <Alert variant='left-accent' mt={2} status={stockStatus?.status} size='3xl'>
                                <AlertIcon />
                                <AlertTitle>{stockStatus?.title}</AlertTitle>
                                <AlertDescription>{stockStatus?.description}</AlertDescription>
                        </Alert>
                        <Text fontSize='3xl' color='gray.700' my={3}>Reviews</Text>
                        <SimpleGrid spacing={3} columns={2}>
                            {product.reviews.length > 0 ? product.reviews.map((review, index) => (
                                <VStack key={index} p={3} boxShadow='md' borderRadius='md' alignItems='flex-start'>
                                    <HStack>
                                        <Avatar size='sm' name={`${review.fName} ${review.lName}`} />
                                        <Text color='gray.600'>{review.fName} {review.lName}</Text>
                                    </HStack>
                                    <HStack spacing='none'>
                                        {Array.from({ length: review.stars || 1 }).map((_, index) => (
                                                <AiFillStar key={index} size={15} />
                                            ))
                                        }
                                        <Text fontSize='xs'>  | {review.stars} stars</Text>
                                    </HStack>
                                    <Text fontSize='medium'>{review.review}</Text>
                                </VStack>
                            )) : <Text>No Reviews posted for this product</Text>}
                        </SimpleGrid>
                        {isPurchased ?
                            <Box py={3} w='full'>
                                <Text fontSize="3xl" fontWeight='medium' my={2} color='gray.800'>Leave a Review!</Text>
                                <Text color='gray.600' fontSize="xl" fontWeight='medium' my={2}>Rating:</Text>
                                {Array.from({ length: 5 }).map((_, index) => {
                                    const buttonValue = index + 1
                                    return (
                                        <Button onClick={_ => setRating(buttonValue)} value={buttonValue} colorScheme={rating == index + 1 ? 'orange' : 'gray'} mx={1} mb={3}>{buttonValue}</Button>
                                    )
                                })
                                }
                                <Textarea onChange={e => setReview(e.target.value)} value={review} placeholder="What do you think of this product?" resize='none' />
                                <HStack mt={4}>
                                    <Button size='md' colorScheme="orange" w={buttonWidth} onClick={requestAddReview} isLoading={reviewLoading}>Submit Review</Button>
                                    <Button size='md' w={buttonWidth} onClick={clearReview}>Clear Review</Button>
                                </HStack>
                            </Box> : null
                        }
                    </VStack>                
                </Flex>
            }
        </>
    )
}

export default Product