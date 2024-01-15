import { Box, Flex, Heading, Text, useBreakpointValue, Tooltip as ChakraToolTip, Spacer, Select, StatGroup, VStack, Divider, StatLabel, Stat, StatNumber, StatHelpText, StatArrow, Button, useDisclosure, Tabs, TabList, Tab, TabPanels, TabPanel, TableContainer, Table, Thead, Th, Tr, Tbody, Td } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell } from "recharts"
import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "../App"
import { AddIcon, DeleteIcon, RepeatIcon, TriangleUpIcon } from "@chakra-ui/icons"
import CountUp from 'react-countup'
import ProductInputModal from "../components/ProductInputModal"
import ProductTableModal from "../components/ProductTableModal"
import OrderModal from "../components/OrderModal"

interface MostSoldProduct {
    name: string;
    productId: string;
    quantity: number;
    stock: number;
}

interface PriceComparison {
    product1: {
        name: string;
        totalSale: number;
    },
    product2: {
        name: string;
        totalSale: number;
    }
}

export interface Order {
    _id: string;
    items: [
        {
            productId: string;
            quantity: number;
            totalPrice: number;
            _id: string;
            name: string;
        }
    ];
    address: {
        _id: string;
        addressLine1: string;
        landmark: string;
        city: string;
        state: string;
        type: string;
    }
    userId: string;
    addressId: string;
    paymentMethod: string
    subtotal: number;
    fName: string;
    lName: string;
    username: string;
    date: string;
}

export interface TransformedProduct {
    name: string,
    productId: string,
    category: string
}


const Dashboard = () => {

    const [mostSoldData, setmostSoldData] = useState<MostSoldProduct[]>([])
    const [frequencyMap, setfrequencyMap] = useState([])
    const [customerFeedbackProductName, setCustomerFeedbackProductName] = useState('')
    const [initialFetchDone, setInitialFetchDone] = useState(false)
    const [transformedProducts, settransformedProducts] = useState<TransformedProduct[]>([])
    const [selectedItem, setSelectedItem] = useState('')
    const [priceComparison, setpriceComparison] = useState<PriceComparison | null>(null)
    const [operation, setOperation] = useState('')
    const [orders, setOrders] = useState<Order[]>([])
    const [orderModalId, setOrderModalId] = useState('')

    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
    
    const barChartWidth = useBreakpointValue({ base: '100%', md: '50%' })
    const barWidth = useBreakpointValue({ base: 40, md: 80 })

    const {
        isOpen: isOpenProductModal,
        onOpen: onOpenProductModal,
        onClose: onCloseProductModal
    } = useDisclosure()

    const {
        isOpen: isOpenProductTableModal,
        onOpen: onOpenProductTableModal,
        onClose: onCloseProductTableModal
    } = useDisclosure()

    const {
        isOpen: isOpenOrderModal,
        onOpen: onOpenOrderModal,
        onClose: onCloseOrderModal
    } = useDisclosure()

    const requestMostSoldData = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/data/mostsold`)
            const { transformedData, transformedProducts, priceComparison } = res.data

            setmostSoldData(transformedData)            
            settransformedProducts(transformedProducts)
            setpriceComparison(priceComparison)
        } catch (err) {
            console.log(err);
        }
    }

    const requestReviewCounts = async (_id: string) => {
        try {
            const res = await axios.get(`${API_URL}/admin/data/reviewcount/${_id}`)
            
            const newMap = res.data.frequencyMap.map((item: any) => {
                return {
                    ...item,
                    stars: `${item.stars} stars`,
                };
            });

            setfrequencyMap(newMap)
            setCustomerFeedbackProductName(res.data.name)
        } catch (err) {
            console.log(err);
        }
    }

    const requestOrders = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/data/orders`)
            setOrders(res.data.transformedOrders)
        } catch (err) {
            console.log(err);
        }
    }

    const handleOrderModal = (orderId: string) => {
        setOrderModalId(orderId)
        onOpenOrderModal()
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedItem(e.target.value)
        requestReviewCounts(e.target.value)
    }

    const handleClick = (operation: string) => {
        setOperation(operation)
        onOpenProductTableModal()
    }

    const onDelete = () => requestMostSoldData()

    useEffect(() => {
        requestMostSoldData()
        requestOrders()
    }, [])
    
    useEffect(() => {
        if (mostSoldData.length > 0 && !initialFetchDone) {
            requestReviewCounts(mostSoldData[0]?.productId)
            setInitialFetchDone(true)
        }
    }, [mostSoldData])    

  return (
    <>
        <Navbar />
        <Tabs colorScheme="orange" size='lg'>
            <TabList>
                <Tab>Analytics</Tab>
                <Tab>Orders &#40;{orders.length}&#41;</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <Flex p={4} direction={{ base: 'column', md: 'row' }}>
                        <Box m={3} w={barChartWidth} boxShadow='lg' borderRadius='15px' p={5}>
                            <Text fontSize='xl' fontWeight='bold' color='gray.700' my={2}>
                                Most Sold Product Today: {mostSoldData[0]?.name} &#40;{mostSoldData[0]?.quantity}&#41;
                                <ChakraToolTip label="Refresh" hasArrow>
                                    <RepeatIcon mx={2} _hover={{ transform: 'rotateZ(180deg)', cursor: 'pointer' }} onClick={requestMostSoldData} transitionDuration='.4s' />
                                </ChakraToolTip>
                            </Text>
                            {mostSoldData.length > 0 &&
                            <ResponsiveContainer width='100%' height={300}>
                                <BarChart data={mostSoldData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey='name' />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar barSize={barWidth} dataKey="quantity" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                            }
                            {mostSoldData.length === 0 && <Text>No Stat Available</Text>}
                        </Box>
                        <Box m={3} w={barChartWidth} boxShadow='lg' borderRadius='15px' p={5}>
                            <Flex direction={{ base: 'column', md: 'row' }}>
                                <Text fontSize='xl' fontWeight='bold' color='gray.700' my={2}>
                                    Customer Feedback for {customerFeedbackProductName}
                                    <ChakraToolTip label="Refresh" hasArrow>
                                        <RepeatIcon
                                            mx={2}
                                            _hover={{ transform: 'rotateZ(180deg)', cursor: 'pointer' }} 
                                            onClick={() => requestReviewCounts(selectedItem)} 
                                            transitionDuration='.4s' 
                                        />
                                    </ChakraToolTip>
                                </Text>
                                <Spacer />
                                <Select placeholder="Select Item" w='fit-content' defaultValue={mostSoldData[0]?.productId} onChange={handleSelectChange}>
                                    {transformedProducts.map((item: any) => <option key={item.productId} value={item.productId}>{item.name}</option>)}
                                </Select>
                            </Flex>
                            <ResponsiveContainer width='100%' height={300}>
                                <PieChart>
                                    <Legend />
                                    <Tooltip />
                                    <Pie data={frequencyMap} nameKey='stars' dataKey='count'>
                                        {frequencyMap.map((_, index) => <Cell key={index} fill={colors[index]}></Cell>)}    
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Flex>
                    <Flex direction={{ base: 'column', md: 'row' }}>
                        <Box p={3} m={3} boxShadow='lg' w={barChartWidth} borderRadius='15px' >
                            <Heading color='gray.800'>Sales Comparison:</Heading>
                            <Divider mt={4} borderColor='gray.400' />
                            <Flex justifyContent='space-around' my={4} alignItems='center' direction={{ base: 'column', md: 'row' }}>
                                {priceComparison ?
                                <VStack m={2} alignItems='flex-start'>
                                    <Text fontSize='2xl' color='gray.700'>{priceComparison.product1.name}: &#8377;{priceComparison.product1.totalSale}</Text>
                                    <Text fontSize='2xl' color='gray.700'>{priceComparison.product2.name}: &#8377;{priceComparison.product2.totalSale}</Text>
                                </VStack> : null
                                }
                                {priceComparison ?
                                <StatGroup h='40%' mt={{ base: 4 }}>
                                    <Stat>
                                        <StatLabel>{priceComparison.product1.name}:</StatLabel>
                                        <StatNumber><CountUp end={priceComparison.product1.totalSale} duration={4} /></StatNumber>
                                        <StatHelpText>
                                            <StatArrow type="increase" />
                                            <CountUp
                                            end={((priceComparison.product1.totalSale - priceComparison.product2.totalSale) / priceComparison.product2.totalSale) * 100} 
                                            duration={4} 
                                            />% more revenue than {priceComparison.product2.name}
                                        </StatHelpText>
                                    </Stat>
                                </StatGroup> : null
                                }
                            </Flex>
                        </Box>
                        <Box w={barChartWidth} m={3} p={3} boxShadow='lg'>
                            <Heading m={2}>Product Operations</Heading>
                            <Divider borderColor='gray.400' />

                            <Box justifyContent='center'>
                                <Button m={2} w='full' onClick={onOpenProductModal}>Add Product <AddIcon ml={2} /></Button>
                                <Button m={2} w='full' onClick={() => handleClick('stats')}>Product Stats <TriangleUpIcon ml={2} /></Button>
                                <Button m={2} w='full' onClick={() => handleClick('delete')}>Delete Product <DeleteIcon ml={2} /></Button>
                            </Box>
                        </Box>
                    </Flex>
                </TabPanel>

                <TabPanel>
                    <TableContainer>
                        <Table size='md'>
                            <Thead>
                                <Tr>
                                    <Th>Order ID:</Th>
                                    <Th>Customer Name:</Th>
                                    <Th>Username:</Th>
                                    <Th>Payment Method:</Th>
                                    <Th>Subtotal:</Th>
                                    <Th>Date:</Th>
                                </Tr>
                            </Thead>

                            <Tbody>
                                {orders.length > 0 && orders.map(order => (
                                    <Tr key={order._id}>
                                        <Td onClick={() => handleOrderModal(order._id)} _hover={{ textDecoration: 'underline 1px solid black', cursor: 'pointer' }}>{order._id}</Td>
                                        <Td>{order.fName} {order.lName}</Td>
                                        <Td>@{order.username}</Td>
                                        <Td>{order.paymentMethod}</Td>
                                        <Td>&#8377;{order.subtotal}</Td>
                                        <Td>{order.date}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </TabPanel>
            </TabPanels>
        </Tabs>
        <ProductInputModal isOpen={isOpenProductModal} onClose={onCloseProductModal} onAdd={onDelete} />
        <ProductTableModal isOpen={isOpenProductTableModal} onClose={onCloseProductTableModal} products={transformedProducts} onDelete={onDelete} operation={operation} />
        <OrderModal isOpen={isOpenOrderModal} onClose={onCloseOrderModal} orderId={orderModalId} />
    </>
  )
}

export default Dashboard