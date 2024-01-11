import { Box, Flex, Heading, Text, useBreakpointValue, Tooltip as ChakraToolTip, Spacer, Select, Icon } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell } from "recharts"
import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "../App"
import { RepeatIcon } from "@chakra-ui/icons"
import { GoGraph } from "react-icons/go";

interface MostSoldProduct {
    name: string;
    productId: string;
    quantity: number;
    stock: number;
}

const Dashboard = () => {

    const [mostSoldData, setmostSoldData] = useState<MostSoldProduct[]>([])
    const [frequencyMap, setfrequencyMap] = useState([])
    const [customerFeedbackProductName, setCustomerFeedbackProductName] = useState('')
    const [initialFetchDone, setInitialFetchDone] = useState(false)
    const [transformedProducts, settransformedProducts] = useState([])

    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
    
    const barChartWidth = useBreakpointValue({ base: '100%', md: '50%' })
    const barWidth = useBreakpointValue({ base: 40, md: 80 })

    const requestMostSoldData = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/data/mostsold`)
            const { transformedData, transformedProducts } = res.data

            setmostSoldData(transformedData)            
            settransformedProducts(transformedProducts)
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
            console.log(newMap);
            setCustomerFeedbackProductName(res.data.name)
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        requestMostSoldData()
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
        <Heading mt={3} mx={5} color='gray.700' display='flex'>Analytics <Icon as={GoGraph} ml={3} mt={1} /></Heading>
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
                            <RepeatIcon mx={2} _hover={{ transform: 'rotateZ(180deg)', cursor: 'pointer' }} onClick={() => requestReviewCounts(mostSoldData[0]?.productId)} transitionDuration='.4s' />
                        </ChakraToolTip>
                    </Text>
                    <Spacer />
                    <Select placeholder="Select Item" w='fit-content' defaultValue={mostSoldData[0]?.productId} onChange={e => requestReviewCounts(e.target.value)}>
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
    </>
  )
}

export default Dashboard