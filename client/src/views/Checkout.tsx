import Navbar from "../components/Navbar";
import { Box, Heading, Step, StepIcon, StepIndicator, StepStatus, Stepper, StepTitle, StepDescription, StepSeparator, Flex, SimpleGrid, Text, Button, Card, Image, VStack, useBreakpointValue, RadioGroup, Radio, Stack } from "@chakra-ui/react";
import { IoHomeSharp } from "react-icons/io5";
import { MdPayment } from "react-icons/md";
import { FaTruckFast } from "react-icons/fa6";
import AddressBox, { AddressBoxProps } from "../components/AddressBox";
import { useOrder } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../App";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import { FaArrowRight } from "react-icons/fa";
import { IoMdCash } from "react-icons/io";
import { BsQrCode } from "react-icons/bs";
import { BsBank } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

interface OrderCardProps {
    quantity: number;
    price: number;
    image: string;
    name: string;
}

const Checkout = () => {

    const { address, setPaymentMethod, paymentMethod, requestCheckout, loading, activeStep, setActiveStep, steps } = useOrder()
    const { cartItems,subtotal } = useCart()
    const { decode } = useAuth()
    const navigate = useNavigate()

    const paymentMethods = [
        { method: 'Card', disabled: false, icon: <MdPayment style={{ marginRight: '8px', marginTop: '6px' }} /> },
        { method: 'COD', disabled: true, icon: <IoMdCash style={{ marginRight: '8px', marginTop: '6px' }} /> },
        { method: 'UPI', disabled: true, icon: <BsQrCode style={{ marginRight: '8px', marginTop: '6px' }} /> },
        { method: 'Net Banking', disabled: true, icon: <BsBank style={{ marginRight: '8px', marginTop: '6px' }} /> },
    ]

    const icons = [<IoHomeSharp />, <MdPayment />, <FaTruckFast />]

    const [addresses, setAddresses] = useState<AddressBoxProps[]>([])
    const [initialRender, setInitialRender] = useState(true)

    const stepperSize = useBreakpointValue({ base: 'md', md: 'md', lg: 'lg' })
    const isBelowMd = useBreakpointValue({ base: true, md: false })

    const fetchAddresses = async () => {
        try {
            const res = await axios.get(`${API_URL}/address/getaddresses/${decode?._id}`) 
            setAddresses(res.data.addresses)   
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchAddresses()
    }, [])

    useEffect(() => {
        if (initialRender) {
            // Skip the else block on the initial render
            setInitialRender(false);
            return;
        }

        if (cartItems.length === 0) 
           navigate('/categories')
    }, [cartItems])

    return (
        <>
            <Navbar />
            <Box p={6}>
                <Heading color='gray.800'>Checkout</Heading>
                <Stepper orientation={isBelowMd ? 'vertical' : 'horizontal'} size={stepperSize} my={8} mx={10} index={activeStep} colorScheme="orange" _hover={{ cursor: 'pointer' }}>
                    {steps.map((step, index) => (
                        <Step onClick={() => setActiveStep(index)} key={index}>
                            <StepIndicator>
                                <StepStatus
                                complete={<StepIcon />}
                                incomplete={icons[index]}
                                active={icons[index]}
                                />
                            </StepIndicator>

                            <Box flexShrink='0'>
                                <StepTitle>{step.title}</StepTitle>
                                <StepDescription>{step.description}</StepDescription>
                            </Box>

                            <StepSeparator />
                        </Step>
                    ))
                    }
                </Stepper>
                <Flex direction={{ base: 'column', md: 'row' }} mt={15} mx={5}>
                    {activeStep == 0 &&
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w='full' mx={5}>
                            {addresses.map((item, index) => (
                                <AddressBox addressLine1={item.addressLine1} landmark={item.landmark} city={item.city} state={item.state} _id={item._id} type={item.type} key={index} toSelect={true} />
                            ))}
                            <Button width='full'><FaPlus style={{ marginRight: '8px' }} /> Add new address</Button>
                            <Button onClick={() => setActiveStep(activeStep + 1)} isDisabled={address ? false : true} width='full' colorScheme="orange">Next <FaArrowRight style={{ marginLeft: '8px' }} /></Button>
                        </SimpleGrid>
                    }
                    {activeStep == 1 &&
                        <Stack w='full'>
                            <Heading fontSize='2xl' fontWeight='bold'>Select Payment Method:</Heading>
                            <RadioGroup colorScheme="orange"  size='lg' onChange={e => setPaymentMethod(e)}>
                                <Stack mt={{ base: 2, md: 5 }}>
                                    {paymentMethods.map(item => (
                                        <Radio bgColor='gray.100' isChecked={paymentMethod === item.method ? true : false} value={item.method} isDisabled={item.disabled}>
                                            <Flex>{item.icon} {item.method === 'COD' ? 'Cash On Delivery' : item.method}</Flex>
                                        </Radio>
                                    ))
                                    }
                                </Stack>
                            </RadioGroup>
                            <Button my={5} onClick={() => setActiveStep(activeStep + 1)} isDisabled={paymentMethod ? false : true} width='fit-content' colorScheme="orange">Next <FaArrowRight style={{ marginLeft: '8px' }} /></Button>
                        </Stack>
                    }
                    {activeStep == 2 &&
                        <>
                        <Stack w='full' my={5} mx={8}>
                            {addresses.filter(item => item._id === address).map(item => (
                                <AddressBox addressLine1={item.addressLine1} landmark={item.landmark} city={item.city} state={item.state} type={item.type} key={item.type} _id={item._id} toSelect={false} />
                            ))}
                            {paymentMethods.filter(item => item.method === paymentMethod).map(item => (
                                <>
                                    <Heading mt={3} fontWeight='bold' fontSize='lg'>Mode of Payment:</Heading>
                                    <Flex>{item.icon} {item.method}</Flex>      
                                </>
                            ))}
                            <Button size='lg' py={3} isLoading={loading} my={5} onClick={requestCheckout} width='full' colorScheme="orange">Pay and Order</Button>
                        </Stack>
                        </>
                    }
                    <VStack w='full' alignItems='flex-start' mt={{ base: 5, md: 0 }}>
                        <Text fontWeight='bold' fontSize='2xl' color='gray.800'>Order Items:</Text>
                        {cartItems.map(item => (
                            <OrderCard image={item.image} quantity={item.quantity} name={item.name} price={item.price} key={item.productId} />
                        ))}
                        <Text fontWeight='bold' fontSize='2xl' color='gray.800'>Subtotal: &#8377;{subtotal}</Text>
                    </VStack>
                </Flex>
            </Box>
        </>
    )
}

const OrderCard = ({ image, quantity, name, price }: OrderCardProps) => {
    return (
        <>
            <Card variant='filled' direction='row' w='100%' h='120px' borderRadius='lg' my={1}>
                <Image src={image} w='45%' h='100%' objectFit='cover' backgroundColor='white' border='1px solid #e2e8f0' borderTopLeftRadius='lg' borderBottomLeftRadius='lg' />
                <Box p={2}>
                    <Text fontWeight='bold'>{name}</Text>
                    <Text fontWeight='bold' color='gray.600'>&#8377;{price}</Text> 
                    <Text color='gray.600'>Quantity: {quantity}</Text> 
                </Box>
            </Card>
        </>
    )
}

export default Checkout