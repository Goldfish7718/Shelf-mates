import axios from "axios";
import { API_URL } from "../App";
import Navbar from "../components/Navbar"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Flex, useBreakpointValue, Box, Image, Divider, Heading, Text, VStack, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { ProductProps, StockStatusType } from "./Product";
import CountUp from "react-countup";
import { TriangleUpIcon } from "@chakra-ui/icons";

const ProductStatistics = () => {

    const { productId } = useParams()

    const [frequencyMap, setfrequencyMap] = useState([])
    const [salesData, setSalesData] = useState([])
    const [error, setError] = useState(false)
    const [product, setProduct] = useState<ProductProps | null>(null)
    const [unitsSold, setUnitsSold] = useState(0)
    const [sales, setSales] = useState(0)
    const [totalStars, setTotalStars] = useState(0)
    const [stockStatus, setStockStatus] = useState<StockStatusType | null>(null)

    // @ts-ignore
    const flexDirection = useBreakpointValue<FlexDirection>({ base: 'column', md: 'row' })
    const boxWidth = useBreakpointValue({ base: '100%', md: '50%' })

    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

    const requestReviewCounts = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/data/reviewcount/${productId}`)
            
            const newMap = res.data.frequencyMap.map((item: any) => {
                return {
                    ...item,
                    stars: `${item.stars} stars`,
                };
            });

            const totalStars = res.data.frequencyMap.reduce((acc: any, current: any) => {
                return acc + (current.stars * current.count)
            }, 0)

            setTotalStars(totalStars)
            setfrequencyMap(newMap)
        } catch (err) {
            console.log(err);
        }
    }

    const getSalesData = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/data/salesdata/${productId}`)

            const salesData = res.data.salesData.map((data: any) => {return {...data, Sales: data.totalPrice}})

            setSalesData(salesData)
            setSales(res.data.totalSales)
            setUnitsSold(res.data.totalQuantity)
        } catch (err) {
            console.log(err);
        }
    }

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`${API_URL}/products/getProduct/${productId}`)
            setProduct(res.data.transformedProduct)
        } catch (err: any) {
            setError(err.response.data.message);
        }
    }

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

    useEffect(() => {
        getSalesData()
    }, [])

    useEffect(() => {
        if (salesData.length > 0) {
            fetchProduct()
            requestReviewCounts()
        }
    }, [salesData])

    useEffect(() => {
        updateStockStatus()
    }, [product?.stock])

  return (
    <>
        <Navbar />
        <Flex direction={flexDirection}>
            <Box w={boxWidth}>
                <Image src={product?.image} w='full' h='auto' objectFit='cover' mt={10} />
                <Divider borderColor='gray.600' my={4} />

                <Box w='100%' p={4}>
                    <Text fontSize='4xl' fontWeight='bold'>Price: &#8377;{product?.price}</Text>

                    <Alert variant='left-accent' mt={2} status={stockStatus?.status} size='3xl'>
                        <AlertIcon />
                        <AlertTitle>{stockStatus?.title}</AlertTitle>
                        <AlertDescription>{stockStatus?.description}</AlertDescription>
                    </Alert>
                </Box>
            </Box>
            <VStack w={boxWidth} m={3} p={2} pr={{ base: 8, md: 2 }}>
                <Heading fontSize='3xl' m={1} color='gray.700'>{product?.name}: Statistics</Heading>
                <Box w='100%' m={2} p={3} borderRadius='15px' boxShadow='lg'>
                    <Text fontSize='lg' mb={2} color='gray.500'>Product Sales:</Text>
                    {salesData.length > 0 && 
                        <ResponsiveContainer width='100%' height={200}>
                            <AreaChart data={salesData}>
                            <defs>
                                <linearGradient id="colorTotalPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='date' />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area dataKey='Sales' type='monotone' stroke="#8884d8" fillOpacity={1} fill="url(#colorTotalPrice)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    }
                </Box>
                <Flex w='100%' direction={flexDirection}>
                    <Box w={boxWidth} m={2} p={3} borderRadius='15px' boxShadow='lg'>
                        <Text fontSize='lg' mb={2} color='gray.500'>Customer Feedback:</Text>
                        <ResponsiveContainer width='100%' height={200}>
                            <PieChart>
                            <Legend />
                            <Tooltip />
                                <Pie data={frequencyMap} nameKey='stars' dataKey='count'>
                                    {frequencyMap.map((_, index) => <Cell key={index} fill={colors[index]}></Cell>)}    
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                    <Box w={boxWidth} m={2} p={2} borderRadius='15px' boxShadow='lg'>
                        <Text fontSize='lg' mb={4} color='gray.500'>General Statistics:</Text>
                            <Text color='gray.600' fontSize='xl' m={3}>
                                Total Units Sold: 
                                <TriangleUpIcon color='green' mx={3} mb={1} />
                                <CountUp end={unitsSold} duration={4} />
                            </Text>
                            <Text color='gray.600' fontSize='xl' m={3}>
                                Total Sales: 
                                <TriangleUpIcon color='green' mx={3} mb={1} />
                                &#8377;<CountUp end={sales} duration={4} />
                            </Text>
                            <Text color='gray.600' fontSize='xl' m={3}>
                                Total Stars: 
                                <TriangleUpIcon color='green' mx={3} mb={1} />
                                <CountUp end={totalStars} duration={4} />
                            </Text>
                            <Text color='gray.600' fontSize='xl' m={3}>
                                Total Reviews: 
                                <TriangleUpIcon color='green' mx={3} mb={1} />
                                <CountUp end={product?.reviews.length || 0} duration={4} />
                            </Text>
                            <Text color='gray.600' fontSize='xl' m={3}>
                                Stock: 
                                <TriangleUpIcon color='green' mx={3} mb={1} />
                                <CountUp end={product?.stock || 0} duration={4} />
                            </Text>
                    </Box>
                </Flex>
            </VStack>
        </Flex>
    </>
  )
}

export default ProductStatistics